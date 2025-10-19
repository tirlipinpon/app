// ============================================
// GAME - Orchestrateur principal
// ============================================
// Version: 2.1.9

const GAME_VERSION = '2.1.13';

class CultureGame {
  constructor() {
    // Afficher la version
    console.log(`%c🎮 Jeu de Cultures - Version ${GAME_VERSION}`, 'color: #667eea; font-size: 16px; font-weight: bold;');
    console.log(`%c📅 ${new Date().toLocaleString('fr-FR')}`, 'color: #10b981; font-size: 12px;');
    console.log('');
    
    // Initialiser les services de base
    this.supabaseService = new SupabaseService();
    this.userManager = new UserManager();
    this.questionManager = new QuestionManager();
    this.incorrectTracker = new IncorrectTracker(this.userManager);
    this.aiHintService = new AIHintService(this.supabaseService);
    
    // Rendre le service accessible globalement pour la lecture vocale
    window.aiHintService = this.aiHintService;
    this.soundManager = new SoundManager();
    this.ui = new UIManager();
    this.inputHandler = new InputHandler(this);
    
    // État du jeu
    this.currentQuestionId = null;
    this.currentCategory = 'toutes';
    this.isLoading = false;
    
    // Compteur d'essais pour la question actuelle
    this.attemptCount = 0;
    this.maxAttempts = 3; // 3 tentatives maximum
    
    // Initialiser le jeu
    this.initialize();
  }
  
  // ==========================================
  // INITIALISATION
  // ==========================================
  
  async initialize() {
    console.log('🚀 Initialisation du jeu...');
    
    // Charger les préférences utilisateur
    this.loadUserPreferences();
    
    // Afficher un loader
    this.ui.showLoader('Chargement des questions...');
    
    try {
      // Charger les questions depuis Supabase
      const questions = await this.supabaseService.loadAllQuestions();
      
      if (questions.length === 0) {
        console.error('❌ Aucune question chargée depuis Supabase');
        this.ui.showFeedback('Erreur: Impossible de charger les questions. Vérifiez la configuration Supabase.', 'error');
        return;
      }
      
      this.questionManager.setQuestions(questions);
      
      console.log(`✅ ${questions.length} questions chargées`);
      
      // Charger les catégories
      const categories = await this.supabaseService.loadCategories();
      console.log(`✅ ${categories.length} catégories chargées`);
      
    } catch (error) {
      console.error('❌ Erreur lors du chargement:', error);
      this.ui.showFeedback('Erreur lors du chargement. Vérifiez votre connexion.', 'error');
    } finally {
      this.ui.hideLoader();
    }
    
    // Setup des event listeners
    this.setupEventListeners();
    
    // Mise à jour de la visibilité
    this.updateVisibility();
    
    // Mise à jour du sélecteur de catégories
    this.updateCategorySelect();
    
    // Peupler la liste des utilisateurs
    this.populateUserSelect();
    
    // Charger une question (même si non connecté)
    if (this.userManager.isLoggedIn()) {
      const username = this.userManager.getCurrentUser();
      console.log(`✅ Session restaurée : ${username}`);
      this.ui.setCurrentUser(username);
    }
    
    // Toujours charger une question au démarrage
    await this.loadQuestion();
    
    // Afficher la version dans le badge
    this.displayVersion();
    
    console.log('✅ Jeu initialisé avec succès');
  }
  
  // ==========================================
  // VERSION
  // ==========================================
  
  displayVersion() {
    const versionBadge = document.getElementById('versionBadge');
    if (versionBadge) {
      versionBadge.textContent = `v${GAME_VERSION}`;
      versionBadge.title = `Jeu de Cultures - Version ${GAME_VERSION}`;
    }
  }
  
  // ==========================================
  // EVENT LISTENERS
  // ==========================================
  
  setupEventListeners() {
    // Connexion/Déconnexion
    const loginBtn = document.getElementById('loginBtn');
    const logoutBtn = document.getElementById('logoutBtn');
    const usernameInput = document.getElementById('usernameInput');
    const usernameSelect = document.getElementById('usernameSelect');
    
    if (loginBtn) {
      loginBtn.addEventListener('click', () => this.handleLogin());
    }
    
    if (logoutBtn) {
      logoutBtn.addEventListener('click', () => this.handleLogout());
    }
    
    if (usernameInput) {
      usernameInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') this.handleLogin();
      });
    }
    
    if (usernameSelect) {
      usernameSelect.addEventListener('change', (e) => this.handleUserSelect(e));
    }
    
    // Bouton son
    const soundBtn = document.getElementById('soundBtn');
    if (soundBtn) {
      soundBtn.addEventListener('click', () => this.toggleSound());
      this.updateSoundButton();
    }
    
    // Sélecteur de catégorie
    const categorySelect = document.getElementById('categorySelect');
    if (categorySelect) {
      categorySelect.addEventListener('change', (e) => this.setCategory(e.target.value));
    }
  }
  
  // ==========================================
  // GESTION DU BOUTON D'AIDE
  // ==========================================
  
  disableHintButton() {
    const hintBtn = document.getElementById('hintBtn');
    if (hintBtn) {
      hintBtn.disabled = true;
      hintBtn.style.opacity = '0.5';
      hintBtn.style.cursor = 'not-allowed';
      hintBtn.innerHTML = '💡 Question terminée';
    }
  }
  
  enableHintButton() {
    const hintBtn = document.getElementById('hintBtn');
    if (hintBtn) {
      hintBtn.disabled = false;
      hintBtn.style.opacity = '1';
      hintBtn.style.cursor = 'pointer';
      hintBtn.innerHTML = '💡 Besoin d\'aide ?';
    }
  }

  // ==========================================
  // GESTION DES QUESTIONS
  // ==========================================
  
  async loadQuestion() {
    if (this.isLoading) return;
    this.isLoading = true;
    
    // Réinitialiser le compteur d'essais
    this.attemptCount = 0;
    
    // Nettoyer l'input handler
    this.inputHandler.cleanup();
    
    // Réinitialiser le feedback
    this.ui.hideFeedback();
    
    // Obtenir les questions à reproposer
    const retryQuestions = this.incorrectTracker.getRetryQuestions();
    
    // Sélectionner une question
    const result = this.questionManager.selectRandomQuestion(
      this.userManager,
      this.currentCategory,
      retryQuestions
    );
    
    // Vérifier si toutes les questions sont complétées
    if (result.allQuestionsCompleted) {
      console.log('🎉 Toutes les questions complétées !');
      this.handleGameCompleted();
      this.isLoading = false;
      return;
    }
    
    // Vérifier si la catégorie est complétée
    if (result.categoryCompleted) {
      console.log(`🎉 Catégorie ${this.currentCategory} complétée !`);
      this.handleCategoryCompleted(this.currentCategory);
      
      // Retour automatique à "Toutes"
      setTimeout(() => {
        this.currentCategory = 'toutes';
        this.updateCategorySelect();
        this.loadQuestion();
      }, 4000);
      
      this.isLoading = false;
      return;
    }
    
    // Préparer la question (avec shuffle)
    this.currentQuestionId = result.questionId;
    const questionData = this.questionManager.prepareQuestion(this.currentQuestionId);
    
    if (!questionData) {
      console.error('❌ Impossible de préparer la question');
      this.ui.showFeedback('Erreur lors du chargement de la question', 'error');
      this.isLoading = false;
      return;
    }
    
    // Log pour debug
    console.log(`%c🎯 QUESTION: "${this.currentQuestionId}"`, 'color: #f59e0b; font-size: 14px; font-weight: bold;');
    console.log(`📝 Type: ${questionData.type} | 🗂️ Catégorie: ${this.currentCategory}`);
    console.log(`%c✅ RÉPONSE:`, 'color: #10b981; font-size: 14px; font-weight: bold;', questionData.answer);
    
    if (result.isRetry) {
      console.log('🔄 Question reproposée (incorrecte précédemment)');
    }
    
    // Stocker les données pour l'UI
    window.currentQuestionDataForUI = questionData;
    
    // Afficher la question
    this.ui.displayQuestion(questionData.question);
    
    // Créer l'interface de réponse
    this.ui.createAnswerInterface(questionData.type, questionData);
    
    // Attacher les event listeners
    this.inputHandler.attachListeners(questionData.type, questionData);
    
    // Réactiver le bouton d'aide pour la nouvelle question
    this.enableHintButton();
    
    // Attacher le listener pour le bouton hint
    const hintBtn = document.getElementById('hintBtn');
    if (hintBtn) {
      hintBtn.addEventListener('click', () => this.handleHintRequest());
    }
    
    this.ui.showFeedback('💭 Réponds à la question !', 'info');
    
    this.isLoading = false;
  }
  
  // ==========================================
  // GESTION DES RÉPONSES
  // ==========================================
  
  async handleAnswer(userAnswer) {
    if (this.isLoading) return;
    
    console.log('📥 Réponse utilisateur:', userAnswer);
    
    // Valider la réponse
    const isCorrect = this.questionManager.validateAnswer(this.currentQuestionId, userAnswer);
    
    if (isCorrect) {
      console.log('✅ CORRECT !');
      this.handleCorrectAnswer();
    } else {
      console.log('❌ INCORRECT');
      this.handleIncorrectAnswer();
    }
  }
  
  handleCorrectAnswer() {
    // Marquer comme correcte (seulement si connecté)
    if (this.userManager.isLoggedIn()) {
      this.incorrectTracker.markAsCorrect(this.currentQuestionId);
    }
    
    // Feedback visuel
    const message = this.userManager.isLoggedIn() 
      ? '✅ Correct ! Bravo !' 
      : '✅ Correct ! Bravo ! (Connecte-toi pour sauvegarder ta progression)';
    this.ui.showFeedback(message, 'success');
    
    // Désactiver le bouton d'aide après réponse correcte
    this.disableHintButton();
    
    // Son
    this.soundManager.play('correct');
    
    // Mettre à jour le sélecteur de catégories
    this.updateCategorySelect();
    
    // Attendre puis charger la question suivante
    setTimeout(() => {
      this.loadQuestion();
    }, 2000);
  }
  
  handleIncorrectAnswer() {
    // Incrémenter le compteur d'essais
    this.attemptCount++;
    
    console.log(`❌ Tentative ${this.attemptCount}/${this.maxAttempts}`);
    
    // Son
    this.soundManager.play('incorrect');
    
    // Vérifier si le nombre max d'essais est atteint
    if (this.attemptCount >= this.maxAttempts) {
      // Max atteint : afficher la bonne réponse et passer
      this.showCorrectAnswerAndSkip();
    } else {
      // Encore des essais disponibles
      const remaining = this.maxAttempts - this.attemptCount;
      const message = remaining === 1 
        ? `❌ Incorrect ! Dernier essai !` 
        : `❌ Incorrect ! Encore ${remaining} essais.`;
      
      this.ui.showFeedback(message, 'error');
      
      // Réactiver les inputs pour permettre un nouvel essai
      const questionData = this.questionManager.getCurrentQuestion();
      this.inputHandler.reactivateInputs(questionData.type);
    }
  }
  
  showCorrectAnswerAndSkip() {
    console.log('📖 Affichage de la bonne réponse après 3 essais');
    
    // Récupérer la bonne réponse
    const questionData = this.questionManager.getCurrentQuestion();
    const correctAnswer = this.formatCorrectAnswer(questionData.answer, questionData.type);
    
    // Afficher la bonne réponse
    this.ui.showFeedback(`❌ La bonne réponse était : ${correctAnswer}`, 'error');
    
    // Désactiver le bouton d'aide après affichage de la réponse
    this.disableHintButton();
    
    // Ajouter aux incorrectes (seulement si connecté)
    if (this.userManager.isLoggedIn()) {
      this.incorrectTracker.addIncorrect(this.currentQuestionId);
    }
    
    // Attendre 3 secondes puis charger la question suivante
    setTimeout(() => {
      this.loadQuestion();
    }, 3000);
  }
  
  // Formater la réponse correcte pour l'affichage
  formatCorrectAnswer(answer, questionType) {
    if (questionType === 'vrai-faux') {
      return answer ? '✓ Vrai' : '✗ Faux';
    }
    
    if (typeof answer === 'object' && !Array.isArray(answer)) {
      // Association
      const pairs = Object.entries(answer).map(([key, value]) => `${key} → ${value}`);
      return pairs.join(', ');
    }
    
    if (Array.isArray(answer)) {
      // Array (peut être pour ordre ou multiple values)
      return answer.join(', ');
    }
    
    return String(answer);
  }
  
  // ==========================================
  // GESTION DES HINTS
  // ==========================================
  
  async handleHintRequest() {
    const hintBtn = document.getElementById('hintBtn');
    if (!hintBtn || hintBtn.disabled) return;
    
    // Obtenir la question actuelle
    const questionData = this.questionManager.getCurrentQuestion();
    
    // Vérifier combien de hints ont été utilisés
    const hintStats = this.aiHintService.getUsedHintCount(this.currentQuestionId, questionData.type);
    
    if (!hintStats.canRequestMore) {
      this.ui.showFeedback(`Tu as déjà utilisé tous tes hints (${hintStats.used}/${hintStats.max}) !`, 'info');
      return;
    }
    
    // Obtenir le numéro du prochain hint
    const nextHintNumber = this.aiHintService.getNextHintNumber(this.currentQuestionId, questionData.type);
    
    if (!nextHintNumber) {
      this.ui.showFeedback('Plus de hints disponibles !', 'info');
      return;
    }
    
    // Afficher le loader
    this.ui.showHintLoader();
    
    // Son
    this.soundManager.play('hint');
    
    // Générer le hint avec le bon numéro
    const hint = await this.aiHintService.generateHint(questionData, nextHintNumber);
    
    if (hint) {
      this.ui.displayHint(hint, nextHintNumber, hintStats.max);
    } else {
      this.ui.displayHint('💡 Réfléchis bien, tu peux y arriver !', nextHintNumber, hintStats.max);
    }
    
    // Mettre à jour le bouton selon les hints restants
    const updatedStats = this.aiHintService.getUsedHintCount(this.currentQuestionId, questionData.type);
    if (updatedStats.canRequestMore) {
      // Il reste des hints
      hintBtn.disabled = false;
      hintBtn.textContent = `💡 Hint ${updatedStats.used + 1}/${updatedStats.max}`;
    } else {
      // Plus de hints
      hintBtn.disabled = true;
      hintBtn.textContent = `💡 Hints utilisés (${updatedStats.used}/${updatedStats.max})`;
      hintBtn.classList.add('used');
    }
  }
  
  // ==========================================
  // GESTION DES CATÉGORIES
  // ==========================================
  
  setCategory(category) {
    this.currentCategory = category;
    console.log(`🗂️ Catégorie changée: ${category}`);
    
    const categoryName = getCategoryName(category);
    this.ui.showFeedback(`Catégorie: ${categoryName}`, 'info');
    
    // Sauvegarder la préférence
    this.saveUserPreferences();
    
    // Charger une nouvelle question
    this.loadQuestion();
  }
  
  updateCategorySelect() {
    const select = document.getElementById('categorySelect');
    if (!select) return;
    
    const questions = this.questionManager.getAllQuestions();
    
    // Vider et repeupler
    select.innerHTML = '';
    
    CATEGORIES.forEach(category => {
      const categoryKey = category.key;
      const option = document.createElement('option');
      option.value = categoryKey;
      
      if (categoryKey === 'toutes') {
        option.textContent = getCategoryName(categoryKey);
      } else {
        const counts = getFoundAndTotalCount(questions, categoryKey, this.userManager);
        
        if (counts.remaining === 0 && this.userManager.isLoggedIn()) {
          option.textContent = `${getCategoryName(categoryKey)} ✓`;
          option.disabled = true;
          option.style.color = '#10b981';
          option.style.fontWeight = 'bold';
        } else {
          option.textContent = `${getCategoryName(categoryKey)} (${counts.remaining})`;
        }
      }
      
      if (categoryKey === this.currentCategory) {
        option.selected = true;
      }
      
      select.appendChild(option);
    });
  }
  
  // ==========================================
  // GESTION DES UTILISATEURS
  // ==========================================
  
  async handleLogin() {
    const username = document.getElementById('usernameInput').value.trim();
    
    if (!username) {
      this.ui.showFeedback('Veuillez entrer un nom !', 'error');
      return;
    }
    
    if (this.userManager.login(username)) {
      this.ui.showFeedback(`Bienvenue ${username} ! Ta progression sera sauvegardée.`, 'success');
      document.getElementById('currentUser').textContent = username;
      this.updateVisibility();
      this.populateUserSelect();
      this.updateCategorySelect();
      
      // Recharger la question pour tenir compte de la progression
      await this.loadQuestion();
    } else {
      this.ui.showFeedback('Erreur lors de la connexion.', 'error');
    }
  }
  
  handleLogout() {
    this.userManager.logout();
    this.updateVisibility();
    this.updateCategorySelect();
    this.populateUserSelect();
    this.ui.showFeedback('Déconnexion réussie. Tu peux continuer à jouer sans sauvegarder.', 'info');
    
    // Recharger une question (mode anonyme)
    this.loadQuestion();
  }
  
  handleUserSelect(event) {
    const selectedUsername = event.target.value;
    
    if (selectedUsername) {
      document.getElementById('usernameInput').value = selectedUsername;
      this.handleLogin();
    } else {
      document.getElementById('usernameInput').value = '';
    }
  }
  
  populateUserSelect() {
    const allUsers = this.userManager.getAllUsers();
    const currentUser = this.userManager.getCurrentUser();
    
    const availableUsers = allUsers.filter(user => user !== currentUser);
    
    const usernameSelect = document.getElementById('usernameSelect');
    usernameSelect.innerHTML = '<option value="">-- Utilisateurs existants --</option>';
    
    if (this.userManager.isLoggedIn()) {
      usernameSelect.classList.add('hidden');
      return;
    }
    
    if (availableUsers.length === 0) {
      usernameSelect.classList.add('hidden');
      document.getElementById('usernameInput').placeholder = 'Ton nom (optionnel)...';
      document.getElementById('usernameInput').value = '';
      return;
    }
    
    usernameSelect.classList.remove('hidden');
    document.getElementById('usernameInput').placeholder = 'Ou crée un nouveau profil...';
    
    availableUsers.forEach(user => {
      const option = document.createElement('option');
      option.value = user;
      option.textContent = user;
      usernameSelect.appendChild(option);
    });
  }
  
  updateVisibility() {
    // Mise à jour de l'affichage selon l'état de connexion
    const isLoggedIn = this.userManager.isLoggedIn();
    const logoutBtn = document.getElementById('logoutBtn');
    
    if (isLoggedIn) {
      document.getElementById('usernameInput').classList.add('hidden');
      document.getElementById('usernameSelect').classList.add('hidden');
      document.getElementById('loginBtn').classList.add('hidden');
      document.getElementById('userInfo').classList.remove('hidden');
      if (logoutBtn) logoutBtn.classList.remove('hidden');
    } else {
      document.getElementById('usernameInput').classList.remove('hidden');
      document.getElementById('loginBtn').classList.remove('hidden');
      document.getElementById('userInfo').classList.add('hidden');
      if (logoutBtn) logoutBtn.classList.add('hidden');
      this.populateUserSelect();
    }
  }
  
  // ==========================================
  // GESTION DES COMPLÉTIONS
  // ==========================================
  
  handleCategoryCompleted(categoryKey) {
    const category = getCategoryByKey(categoryKey);
    const categoryName = category ? category.name : categoryKey;
    const categoryIcon = category ? category.icon : '🏆';
    
    const encouragement = 'Continue comme ça ! 💪';
    
    this.ui.showFeedback(`🏆 BRAVO ! Catégorie ${categoryName} terminée !`, 'success');
    this.ui.createCategoryCompletionCelebration(categoryIcon, categoryName, encouragement);
    this.soundManager.play('categoryComplete');
  }
  
  handleGameCompleted() {
    this.ui.showFeedback('🏆 FÉLICITATIONS ! Toutes les questions terminées ! 👑', 'success');
    this.ui.createCelebration();
    this.soundManager.play('success');
  }
  
  // ==========================================
  // SON
  // ==========================================
  
  toggleSound() {
    this.soundManager.toggleMute();
    this.updateSoundButton();
    this.soundManager.play('click');
  }
  
  updateSoundButton() {
    const soundBtn = document.getElementById('soundBtn');
    if (soundBtn) {
      if (this.soundManager.isMuted) {
        soundBtn.textContent = '🔇';
        soundBtn.classList.add('muted');
        soundBtn.title = 'Activer les sons';
      } else {
        soundBtn.textContent = '🔊';
        soundBtn.classList.remove('muted');
        soundBtn.title = 'Désactiver les sons';
      }
    }
  }
  
  // ==========================================
  // PRÉFÉRENCES
  // ==========================================
  
  loadUserPreferences() {
    const preferences = this.userManager.getUserPreferences();
    this.currentCategory = preferences.selectedCategory || 'toutes';
    console.log(`📂 Préférences chargées: catégorie = ${this.currentCategory}`);
  }
  
  saveUserPreferences() {
    const preferences = {
      selectedCategory: this.currentCategory
    };
    
    this.userManager.saveUserPreferences(preferences);
  }
}

// ==========================================
// DÉMARRAGE DU JEU
// ==========================================

let gameInstance;

document.addEventListener('DOMContentLoaded', async () => {
  gameInstance = new CultureGame();
  
  // Fonction globale pour réinitialiser les données (accessible dans la console)
  window.resetUserData = () => {
    if (gameInstance && gameInstance.userManager && gameInstance.userManager.isLoggedIn()) {
      const username = gameInstance.userManager.getCurrentUser();
      if (confirm(`⚠️ Êtes-vous sûr de vouloir réinitialiser TOUTES les données de ${username} ?`)) {
        gameInstance.userManager.resetAllUserData();
        location.reload();
      }
    } else {
      console.log('⚠️ Aucun utilisateur connecté');
    }
  };
  
  console.log('💡 Astuce: Tape resetUserData() dans la console pour réinitialiser tes données');
});

