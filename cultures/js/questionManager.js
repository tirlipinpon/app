// ============================================
// QUESTION MANAGER - Gestion et shuffle des questions
// ============================================

class QuestionManager {
  constructor() {
    this.questions = [];
    this.currentQuestion = null;
    this.shuffleHistory = new Map(); // Garde en mémoire le shuffle par question
  }
  
  // Définir les questions (chargées depuis Supabase)
  setQuestions(questions) {
    this.questions = questions;
    console.log(`📚 ${questions.length} questions chargées dans QuestionManager`);
  }
  
  // Obtenir toutes les questions
  getAllQuestions() {
    return this.questions;
  }
  
  // ============================================
  // SÉLECTION DE QUESTIONS
  // ============================================
  
  selectRandomQuestion(userManager, categoryKey, retryQuestions = []) {
    // Priorité 1 : Questions à re-proposer
    if (retryQuestions.length > 0) {
      const randomIndex = Math.floor(Math.random() * retryQuestions.length);
      const questionId = retryQuestions[randomIndex];
      console.log(`🔄 Re-proposition d'une question incorrecte: ${questionId}`);
      return { questionId, isRetry: true };
    }
    
    // Priorité 2 : Nouvelles questions
    let availableQuestions = [...this.questions];
    
    // Filtrer par catégorie
    if (categoryKey !== 'toutes') {
      availableQuestions = filterQuestionsByCategory(availableQuestions, categoryKey);
    }
    
    // Filtrer les questions déjà répondues
    if (userManager && userManager.isLoggedIn()) {
      const answeredIds = userManager.getQuestionsAnswered();
      availableQuestions = availableQuestions.filter(q => !answeredIds.includes(q.id));
    }
    
    // Vérifier s'il reste des questions
    if (availableQuestions.length === 0) {
      // Vérifier si toutes les questions du jeu sont complétées
      const allQuestionsAnswered = userManager.getQuestionsAnswered().length;
      const totalQuestions = this.questions.length;
      
      if (allQuestionsAnswered >= totalQuestions) {
        return { allQuestionsCompleted: true };
      }
      
      // Sinon, c'est juste la catégorie qui est complète
      return { categoryCompleted: true };
    }
    
    // Sélectionner aléatoirement
    const randomIndex = Math.floor(Math.random() * availableQuestions.length);
    const selectedQuestion = availableQuestions[randomIndex];
    
    return { questionId: selectedQuestion.id, isRetry: false };
  }
  
  // ============================================
  // PRÉPARATION DE QUESTION AVEC SHUFFLE
  // ============================================
  
  prepareQuestion(questionId) {
    // Trouver la question dans la liste
    const questionData = this.questions.find(q => q.id === questionId);
    if (!questionData) {
      console.error(`❌ Question non trouvée: ${questionId}`);
      return null;
    }
    
    // Récupérer la réponse depuis Supabase (champ answer)
    if (!questionData.answer || questionData.answer.value === undefined || questionData.answer.value === null) {
      console.error(`❌ Pas de réponse trouvée pour: ${questionId}`);
      return null;
    }
    
    // Créer l'objet question complet avec copie des options (important pour shuffle)
    const question = {
      id: questionId,
      question: questionData.question_text,
      type: questionData.question_type,
      category: questionData.category_id,
      tags: questionData.tags || [],
      hint: questionData.hint,
      answer: questionData.answer.value,
      validateFlexible: questionData.answer.validateFlexible || false,
      // Copier les options pour permettre un nouveau shuffle à chaque fois
      originalOptions: questionData.options ? JSON.parse(JSON.stringify(questionData.options)) : null
    };
    
    // SHUFFLE selon le type (SE FAIT À CHAQUE AFFICHAGE !)
    console.log(`🔀 Shuffle des options pour: ${questionId}`);
    this.applyShuffleByType(question);
    
    this.currentQuestion = question;
    return question;
  }
  
  // Appliquer le shuffle selon le type de question
  applyShuffleByType(question) {
    switch (question.type) {
      case 'qcm':
        this.shuffleQCM(question);
        break;
      
      case 'ordre':
        this.shuffleOrdre(question);
        break;
      
      case 'association':
        this.shuffleAssociation(question);
        break;
      
      case 'glisser-deposer':
        this.shuffleGlisserDeposer(question);
        break;
      
      default:
        // input, vrai-faux, remplir-blancs : pas de shuffle
        question.options = question.originalOptions;
    }
  }
  
  // ==========================================
  // SHUFFLE QCM
  // ==========================================
  shuffleQCM(question) {
    const options = question.originalOptions ? [...question.originalOptions] : [];
    const correctAnswer = question.answer;
    
    // Log l'ordre original
    console.log(`📋 Options originales: ${options.join(', ')}`);
    
    // Créer tableau avec mapping original
    const optionsWithIndex = options.map((opt, idx) => ({
      text: opt,
      originalIndex: idx,
      isCorrect: opt === correctAnswer
    }));
    
    // Shuffle (Fisher-Yates) - NOUVEAU MÉLANGE À CHAQUE FOIS
    this.shuffleArray(optionsWithIndex);
    
    // Garder le mapping pour validation
    question.shuffledOptions = optionsWithIndex.map(opt => opt.text);
    question.correctAnswerText = correctAnswer;
    
    // Pour l'affichage
    question.options = question.shuffledOptions;
    
    console.log(`🔀 QCM shuffled (NOUVEAU): ${question.shuffledOptions.join(', ')}`);
    
    // Trouver la position de la bonne réponse après shuffle
    const correctIndex = question.shuffledOptions.indexOf(correctAnswer);
    console.log(`✅ Position de la bonne réponse: ${correctIndex + 1}/${question.shuffledOptions.length}`);
  }
  
  // ==========================================
  // SHUFFLE ORDRE
  // ==========================================
  shuffleOrdre(question) {
    const items = question.originalOptions ? [...question.originalOptions] : [];
    
    console.log(`📋 Ordre original: ${items.join(' → ')}`);
    
    // Créer mapping avec indices originaux
    const itemsWithIndex = items.map((item, idx) => ({
      text: item,
      originalIndex: idx
    }));
    
    // Shuffle (NOUVEAU MÉLANGE À CHAQUE FOIS)
    this.shuffleArray(itemsWithIndex);
    
    // Pour l'affichage : ordre mélangé
    question.shuffledItems = itemsWithIndex;
    question.options = itemsWithIndex.map(item => item.text);
    
    // La réponse correcte reste : [0, 1, 2, ...] (ordre correct)
    // L'utilisateur doit recréer cet ordre
    
    console.log(`🔀 Ordre shuffled (NOUVEAU): ${question.options.join(' → ')}`);
  }
  
  // ==========================================
  // SHUFFLE ASSOCIATION
  // ==========================================
  shuffleAssociation(question) {
    if (!question.originalOptions) {
      question.options = { left: [], right: [] };
      return;
    }
    
    const leftItems = [...(question.originalOptions.left || [])];
    const rightItems = [...(question.originalOptions.right || [])];
    
    console.log(`📋 Association originale - Left: ${leftItems.join(', ')}`);
    console.log(`📋 Association originale - Right: ${rightItems.join(', ')}`);
    
    // Shuffle les deux colonnes indépendamment (NOUVEAU MÉLANGE À CHAQUE FOIS)
    this.shuffleArray(leftItems);
    this.shuffleArray(rightItems);
    
    question.options = {
      left: leftItems,
      right: rightItems
    };
    
    console.log(`🔀 Association shuffled (NOUVEAU):`);
    console.log(`   Left: ${leftItems.join(', ')}`);
    console.log(`   Right: ${rightItems.join(', ')}`);
  }
  
  // ==========================================
  // SHUFFLE GLISSER-DEPOSER
  // ==========================================
  shuffleGlisserDeposer(question) {
    if (!question.originalOptions) {
      question.options = { categories: [], items: [] };
      return;
    }
    
    const categories = [...(question.originalOptions.categories || [])];
    const items = [...(question.originalOptions.items || [])];
    
    console.log(`📋 Items originaux: ${items.join(', ')}`);
    
    // Shuffle les items (pas les catégories) - NOUVEAU MÉLANGE À CHAQUE FOIS
    this.shuffleArray(items);
    
    question.options = {
      categories: categories,  // Pas shufflé
      items: items  // Shufflé
    };
    
    console.log(`🔀 Glisser-déposer shuffled (NOUVEAU): ${items.join(', ')}`);
  }
  
  // ==========================================
  // ALGORITHME SHUFFLE (Fisher-Yates)
  // ==========================================
  shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
  }
  
  // ==========================================
  // VALIDATION DES RÉPONSES
  // ==========================================
  
  validateAnswer(questionId, userAnswer) {
    const question = this.questions.find(q => q.id === questionId);
    if (!question) return false;
    
    // Récupérer la réponse depuis Supabase
    if (!question.answer || question.answer.value === undefined || question.answer.value === null) return false;
    
    const correctAnswer = question.answer.value;
    const validateFlexible = question.answer.validateFlexible || false;
    const questionType = question.question_type;
    
    switch (questionType) {
      case 'input':
        return this.validateInput(userAnswer, correctAnswer, validateFlexible);
      
      case 'qcm':
        // Ignorer majuscules/minuscules pour simplifier les réponses
        return this.normalizeString(userAnswer) === this.normalizeString(correctAnswer);
      
      case 'vrai-faux':
        return userAnswer === correctAnswer;
      
      case 'ordre':
        return this.validateOrdre(userAnswer, correctAnswer);
      
      case 'association':
        return this.validateAssociation(userAnswer, correctAnswer);
      
      case 'glisser-deposer':
        return this.validateGlisserDeposer(userAnswer, correctAnswer);
      
      case 'remplir-blancs':
        return this.validateInput(userAnswer, correctAnswer, true);
      
      default:
        return false;
    }
  }
  
  // Normaliser les chaînes (minuscules, trim, SANS accents)
  normalizeString(str) {
    if (typeof str !== 'string') return String(str);
    return this.removeAccents(str.trim().toLowerCase());
  }
  
  // Retirer les accents ET convertir les caractères spéciaux
  removeAccents(str) {
    // Convertir les ligatures et caractères spéciaux
    const specialChars = {
      'œ': 'oe',
      'Œ': 'OE',
      'æ': 'ae',
      'Æ': 'AE',
      'ß': 'ss'
    };
    
    let result = str;
    for (const [special, replacement] of Object.entries(specialChars)) {
      result = result.replace(new RegExp(special, 'g'), replacement);
    }
    
    // Retirer les accents
    return result.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
  }
  
  // Validation input flexible
  validateInput(userAnswer, correctAnswers, flexible = true) {
    if (!userAnswer || userAnswer.trim() === '') return false;
    
    if (!flexible) {
      // Même en mode non flexible, ignorer la casse
      return this.normalizeString(userAnswer) === this.normalizeString(correctAnswers);
    }
    
    // Accepter plusieurs variantes
    const answerArray = Array.isArray(correctAnswers) ? correctAnswers : [correctAnswers];
    const userClean = this.normalizeString(userAnswer);
    
    return answerArray.some(ans => 
      this.normalizeString(ans) === userClean
    );
  }
  
  // Validation ordre
  validateOrdre(userOrder, correctOrder) {
    if (!Array.isArray(userOrder) || !Array.isArray(correctOrder)) return false;
    if (userOrder.length !== correctOrder.length) return false;
    
    return userOrder.every((val, idx) => val === correctOrder[idx]);
  }
  
  // Validation association
  validateAssociation(userPairs, correctPairs) {
    if (!userPairs || !correctPairs) return false;
    
    const correctKeys = Object.keys(correctPairs);
    
    // Vérifier que toutes les associations sont correctes
    return correctKeys.every(key => {
      return userPairs[key] === correctPairs[key];
    });
  }
  
  // Validation glisser-déposer
  validateGlisserDeposer(userCategories, correctCategories) {
    if (!userCategories || !correctCategories) return false;
    
    // Vérifier chaque catégorie
    return Object.keys(correctCategories).every(category => {
      const userItems = userCategories[category] || [];
      const correctItems = correctCategories[category];
      
      if (userItems.length !== correctItems.length) return false;
      
      // Vérifier que tous les items corrects sont présents (ordre n'importe pas)
      return correctItems.every(item => userItems.includes(item));
    });
  }
  
  // ==========================================
  // UTILITAIRES
  // ==========================================
  
  getCurrentQuestion() {
    return this.currentQuestion;
  }
  
  getQuestionById(questionId) {
    return this.questions.find(q => q.id === questionId);
  }
  
  getQuestionCount() {
    return this.questions.length;
  }
}

