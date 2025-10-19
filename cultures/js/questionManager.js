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
    // Différents formats selon le type de question :
    // - association : answer = {left, right, pairs}
    // - timeline, map-click : answer = valeur directe (array ou string)
    // - autres : answer = {value, validateFlexible}
    
    let answerData = null;
    let finalAnswer = null;
    
    if (questionData.question_type === 'association') {
      // Association : answer contient left, right, pairs
      if (!questionData.answer || !questionData.answer.left || !questionData.answer.right) {
        console.error(`❌ Pas de réponse d'association trouvée pour: ${questionId}`);
        return null;
      }
      answerData = questionData.answer;
      finalAnswer = answerData;
    } else if (questionData.question_type === 'timeline' || questionData.question_type === 'map-click') {
      // Timeline et Map-click : answer est directement la valeur (array ou string)
      if (!questionData.answer) {
        console.error(`❌ Pas de réponse trouvée pour: ${questionId}`);
        return null;
      }
      finalAnswer = questionData.answer;
    } else {
      // Autres types : answer contient {value, validateFlexible}
      if (!questionData.answer || questionData.answer.value === undefined || questionData.answer.value === null) {
        console.error(`❌ Pas de réponse trouvée pour: ${questionId}`);
        return null;
      }
      answerData = questionData.answer;
      finalAnswer = answerData.value;
    }
    
    // Créer l'objet question complet avec copie des options (important pour shuffle)
    const question = {
      id: questionId,
      question: questionData.question_text,
      type: questionData.question_type,
      category: questionData.category_id,
      tags: questionData.tags || [],
      hint: questionData.hint,
      answer: finalAnswer,
      validateFlexible: (answerData && answerData.validateFlexible) || false,
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
      
      case 'timeline':
        this.shuffleTimeline(question);
        break;
      
      case 'map-click':
        // Pas de shuffle pour map-click, les zones sont fixes
        question.options = question.originalOptions;
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
    // Pour les questions d'association, les données sont dans answer
    if (!question.answer || !question.answer.left || !question.answer.right) {
      question.options = { left: [], right: [] };
      return;
    }
    
    const leftItems = [...(question.answer.left || [])];
    const rightItems = [...(question.answer.right || [])];
    
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
  // SHUFFLE TIMELINE
  // ==========================================
  shuffleTimeline(question) {
    if (!question.originalOptions || !Array.isArray(question.originalOptions)) {
      question.options = [];
      return;
    }
    
    // Copier et mélanger les événements
    const events = [...question.originalOptions];
    this.shuffleArray(events);
    
    question.options = events;
    console.log(`🔀 Timeline events shuffled:`, events.map(e => e.text).join(' → '));
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
    // Pour les questions d'association, la réponse est directement dans answer
    let correctAnswer, validateFlexible;
    if (question.question_type === 'association') {
      if (!question.answer || !question.answer.pairs) return false;
      correctAnswer = question.answer;
      validateFlexible = false;
    } else {
      if (!question.answer || question.answer.value === undefined || question.answer.value === null) return false;
      correctAnswer = question.answer.value;
      validateFlexible = question.answer.validateFlexible || false;
    }
    
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
      
      case 'map-click':
        return this.validateMapClick(userAnswer, correctAnswer);
      
      case 'timeline':
        return this.validateTimeline(userAnswer, correctAnswer);
      
      default:
        return false;
    }
  }
  
  // ==========================================
  // VALIDATION: MAP-CLICK
  // ==========================================
  
  validateMapClick(userAnswer, correctAnswer) {
    // userAnswer = l'ID de la zone cliquée
    // correctAnswer = l'ID de la zone correcte
    return userAnswer === correctAnswer;
  }
  
  // ==========================================
  // VALIDATION: TIMELINE
  // ==========================================
  
  validateTimeline(userAnswer, correctAnswer) {
    // userAnswer = array des event IDs dans l'ordre placé
    // correctAnswer = array des event IDs dans le bon ordre
    if (!Array.isArray(userAnswer) || !Array.isArray(correctAnswer)) return false;
    if (userAnswer.length !== correctAnswer.length) return false;
    
    // Comparer chaque élément
    return userAnswer.every((eventId, index) => eventId === correctAnswer[index]);
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
  validateAssociation(userPairs, correctAnswer) {
    if (!userPairs || !correctAnswer || !correctAnswer.pairs) return false;
    
    // Convertir les pairs correctes en objet pour faciliter la comparaison
    const correctPairsObj = {};
    correctAnswer.pairs.forEach(pair => {
      correctPairsObj[pair[0]] = pair[1];
    });
    
    const userKeys = Object.keys(userPairs);
    
    // Vérifier que toutes les associations sont correctes
    return userKeys.every(key => {
      return userPairs[key] === correctPairsObj[key];
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

