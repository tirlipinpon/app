// ============================================
// USER MANAGER - Gestion utilisateurs et cookies
// ============================================

class UserManager {
  constructor() {
    this.currentUser = null;
    this.questionsAnswered = [];
    this.incorrectAnswers = {}; // { questionId: { count, lastAttempt, nextRetry } }
    
    // Préfixe unique pour éviter les conflits
    this.COOKIE_PREFIX = 'cultures_game_';
    
    // 🔐 Intégration du SessionManager
    this.sessionManager = new SessionManager();
    
    // 🚀 Auto-restauration de la session au chargement
    this.restoreSession();
  }
  
  // 🚀 Restaurer la session automatiquement au chargement
  restoreSession() {
    if (this.sessionManager.isLoggedIn()) {
      const username = this.sessionManager.getCurrentUser();
      console.log(`🔄 Restauration automatique de la session : ${username}`);
      
      // Restaurer l'utilisateur dans le UserManager
      this.currentUser = username;
      this.loadUserData();
      
      return true;
    }
    return false;
  }

  // Connexion d'un utilisateur
  login(username) {
    if (!username || username.trim() === '') {
      return false;
    }

    this.currentUser = username.trim();
    
    // 🔐 Créer une session persistante (survit au refresh)
    this.sessionManager.login(this.currentUser);
    
    this.loadUserData();
    
    // Si c'est un nouvel utilisateur (pas de cookie), créer un cookie vide
    if (this.questionsAnswered.length === 0) {
      this.saveUserData();
    }
    
    return true;
  }

  // Déconnexion
  logout() {
    // 🔐 Déconnexion de la session
    this.sessionManager.logout();
    
    this.currentUser = null;
    this.questionsAnswered = [];
    this.incorrectAnswers = {};
  }

  // Charger les données utilisateur depuis les cookies
  loadUserData() {
    if (!this.currentUser) return;

    console.log('📂 Chargement des données pour:', this.currentUser);

    // Charger les questions répondues
    const questionsAnsweredCookie = this.getCookie(`${this.COOKIE_PREFIX}questionsAnswered_${this.currentUser}`);
    if (questionsAnsweredCookie) {
      try {
        const loaded = JSON.parse(questionsAnsweredCookie);
        console.log('📥 Questions chargées depuis cookie:', loaded);
        
        // Nettoyer les doublons
        this.questionsAnswered = [...new Set(loaded)];
        
        console.log('🧹 Questions après nettoyage des doublons:', this.questionsAnswered);
        
        // Sauvegarder les données nettoyées
        this.saveUserData();
      } catch (e) {
        console.error('❌ Erreur lors du chargement des questions:', e);
      }
    } else {
      console.log('ℹ️ Aucune question sauvegardée pour cet utilisateur');
    }
    
    // Charger les réponses incorrectes
    const incorrectCookie = this.getCookie(`${this.COOKIE_PREFIX}incorrectAnswers_${this.currentUser}`);
    if (incorrectCookie) {
      try {
        this.incorrectAnswers = JSON.parse(incorrectCookie);
        console.log(`❌ Réponses incorrectes chargées: ${Object.keys(this.incorrectAnswers).length}`);
      } catch (e) {
        console.error('❌ Erreur lors du chargement des réponses incorrectes:', e);
      }
    }
  }

  // Sauvegarder les données utilisateur
  saveUserData() {
    if (!this.currentUser) return;

    console.log('💾 Sauvegarde des données pour:', this.currentUser);
    console.log('📝 Questions à sauvegarder:', this.questionsAnswered);

    // Sauvegarder les questions répondues
    this.setCookie(`${this.COOKIE_PREFIX}questionsAnswered_${this.currentUser}`, JSON.stringify(this.questionsAnswered), 365);
    
    // Sauvegarder les réponses incorrectes
    this.setCookie(`${this.COOKIE_PREFIX}incorrectAnswers_${this.currentUser}`, JSON.stringify(this.incorrectAnswers), 365);
    
    console.log('✅ Sauvegarde terminée');
  }

  // Ajouter une question répondue correctement
  addQuestionAnswered(questionId) {
    if (!this.currentUser) return;
    
    // Vérifier si la question n'est pas déjà dans la liste
    if (!this.questionsAnswered.includes(questionId)) {
      console.log(`➕ Ajout de la question "${questionId}"`);
      this.questionsAnswered.push(questionId);
      console.log(`📊 Total de questions répondues: ${this.questionsAnswered.length}`);
      
      // Supprimer des incorrectes si elle y était
      if (this.incorrectAnswers[questionId]) {
        delete this.incorrectAnswers[questionId];
        console.log(`✅ Question retirée des incorrectes`);
      }
      
      this.saveUserData();
    } else {
      console.log(`⚠️ Question "${questionId}" déjà répondue, pas d'ajout`);
    }
  }

  // Obtenir les questions répondues
  getQuestionsAnswered() {
    return this.questionsAnswered || [];
  }

  // Obtenir les questions disponibles (excluant celles déjà répondues)
  getAvailableQuestions(allQuestions) {
    return allQuestions.filter(questionId => !this.questionsAnswered.includes(questionId));
  }

  // ===== GESTION DES RÉPONSES INCORRECTES =====
  
  // Obtenir les réponses incorrectes
  getIncorrectAnswers() {
    return this.incorrectAnswers;
  }
  
  // Sauvegarder les réponses incorrectes
  saveIncorrectAnswers(incorrectData) {
    this.incorrectAnswers = incorrectData;
    this.saveUserData();
  }
  
  // Vérifier si un utilisateur existe
  userExists(username) {
    const questionsAnsweredCookie = this.getCookie(`${this.COOKIE_PREFIX}questionsAnswered_${username}`);
    return questionsAnsweredCookie !== null;
  }

  // Obtenir tous les utilisateurs existants
  getAllUsers() {
    const users = [];
    const cookies = document.cookie.split(';');
    
    cookies.forEach(cookie => {
      const trimmed = cookie.trim();
      if (trimmed.startsWith(`${this.COOKIE_PREFIX}questionsAnswered_`)) {
        const username = trimmed.split('=')[0].replace(`${this.COOKIE_PREFIX}questionsAnswered_`, '');
        if (username && !users.includes(username)) {
          users.push(username);
        }
      }
    });
    
    return users.sort();
  }

  // Obtenir toutes les questions répondues
  getAllQuestionsAnswered() {
    return [...new Set(this.questionsAnswered)]; // Supprime les doublons
  }
  
  // Réinitialiser complètement les données de l'utilisateur (utile pour debug)
  resetAllUserData() {
    if (!this.currentUser) return;
    
    console.log('🗑️ Réinitialisation complète des données pour:', this.currentUser);
    
    this.questionsAnswered = [];
    this.incorrectAnswers = {};
    this.saveUserData();
    
    console.log('✅ Toutes les données ont été réinitialisées');
  }

  // Vérifier si un utilisateur est connecté
  isLoggedIn() {
    return this.currentUser !== null;
  }

  // Obtenir le nom de l'utilisateur connecté
  getCurrentUser() {
    return this.currentUser;
  }

  // Gestion des cookies
  setCookie(name, value, days) {
    const expires = new Date();
    expires.setTime(expires.getTime() + (days * 24 * 60 * 60 * 1000));
    const encodedValue = encodeURIComponent(value);
    document.cookie = `${name}=${encodedValue};expires=${expires.toUTCString()};path=/`;
    console.log(`🍪 Cookie enregistré: ${name}`);
  }

  getCookie(name) {
    const nameEQ = name + "=";
    const ca = document.cookie.split(';');
    for (let i = 0; i < ca.length; i++) {
      let c = ca[i];
      while (c.charAt(0) === ' ') c = c.substring(1, c.length);
      if (c.indexOf(nameEQ) === 0) {
        const encodedValue = c.substring(nameEQ.length, c.length);
        return decodeURIComponent(encodedValue);
      }
    }
    return null;
  }

  // Supprimer un cookie
  deleteCookie(name) {
    document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 UTC;path=/;`;
  }

  // Sauvegarder les préférences utilisateur
  saveUserPreferences(preferences) {
    this.setCookie(`${this.COOKIE_PREFIX}userPreferences`, JSON.stringify(preferences), 365);
  }

  // Charger les préférences utilisateur
  getUserPreferences() {
    const prefsCookie = this.getCookie(`${this.COOKIE_PREFIX}userPreferences`);
    if (prefsCookie) {
      return JSON.parse(prefsCookie);
    }
    return {
      selectedCategory: 'toutes'
    };
  }
}

