// ============================================
// QUESTION MANAGER - Gestion et shuffle des questions
// ============================================

class QuestionManager {
  constructor() {
    this.questions = [];
    this.answersData = ANSWERS_DATA;
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
    
    // Récupérer la réponse depuis ANSWERS_DATA
    const answerData = this.answersData[questionId];
    if (!answerData) {
      console.error(`❌ Pas de réponse trouvée pour: ${questionId}`);
      return null;
    }
    
    // Créer l'objet question complet
    const question = {
      id: questionId,
      question: questionData.question_text,
      type: questionData.question_type,
      category: questionData.category_id,
      tags: questionData.tags || [],
      hint: questionData.hint,
      answer: answerData.answer,
      validateFlexible: answerData.validateFlexible || false,
      originalOptions: questionData.options
    };
    
    // SHUFFLE selon le type
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
    
    // Créer tableau avec mapping original
    const optionsWithIndex = options.map((opt, idx) => ({
      text: opt,
      originalIndex: idx,
      isCorrect: opt === correctAnswer
    }));
    
    // Shuffle (Fisher-Yates)
    this.shuffleArray(optionsWithIndex);
    
    // Garder le mapping pour validation
    question.shuffledOptions = optionsWithIndex.map(opt => opt.text);
    question.correctAnswerText = correctAnswer;
    
    // Pour l'affichage
    question.options = question.shuffledOptions;
    
    console.log(`🔀 QCM shuffled: ${question.shuffledOptions.join(', ')}`);
  }
  
  // ==========================================
  // SHUFFLE ORDRE
  // ==========================================
  shuffleOrdre(question) {
    const items = question.originalOptions ? [...question.originalOptions] : [];
    
    // Créer mapping avec indices originaux
    const itemsWithIndex = items.map((item, idx) => ({
      text: item,
      originalIndex: idx
    }));
    
    // Shuffle
    this.shuffleArray(itemsWithIndex);
    
    // Pour l'affichage : ordre mélangé
    question.shuffledItems = itemsWithIndex;
    question.options = itemsWithIndex.map(item => item.text);
    
    // La réponse correcte reste : [0, 1, 2, ...] (ordre correct)
    // L'utilisateur doit recréer cet ordre
    
    console.log(`🔀 Ordre shuffled: ${question.options.join(' → ')}`);
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
    
    // Shuffle les deux colonnes indépendamment
    this.shuffleArray(leftItems);
    this.shuffleArray(rightItems);
    
    question.options = {
      left: leftItems,
      right: rightItems
    };
    
    console.log(`🔀 Association shuffled:`);
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
    
    // Shuffle les items (pas les catégories)
    this.shuffleArray(items);
    
    question.options = {
      categories: categories,  // Pas shufflé
      items: items  // Shufflé
    };
    
    console.log(`🔀 Glisser-déposer shuffled: ${items.join(', ')}`);
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
    
    const answerData = this.answersData[questionId];
    if (!answerData) return false;
    
    const correctAnswer = answerData.answer;
    const questionType = question.question_type;
    
    switch (questionType) {
      case 'input':
        return this.validateInput(userAnswer, correctAnswer, answerData.validateFlexible);
      
      case 'qcm':
        return userAnswer === correctAnswer;
      
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
  
  // Validation input flexible
  validateInput(userAnswer, correctAnswers, flexible = true) {
    if (!userAnswer || userAnswer.trim() === '') return false;
    
    if (!flexible) {
      return userAnswer.trim() === correctAnswers.toString().trim();
    }
    
    // Accepter plusieurs variantes
    const answerArray = Array.isArray(correctAnswers) ? correctAnswers : [correctAnswers];
    const userClean = userAnswer.trim().toLowerCase();
    
    return answerArray.some(ans => 
      ans.toString().trim().toLowerCase() === userClean
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

