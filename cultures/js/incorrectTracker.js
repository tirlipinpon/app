// ============================================
// INCORRECT TRACKER - Gestion des questions échouées
// ============================================

class IncorrectTracker {
  constructor(userManager) {
    this.userManager = userManager;
  }
  
  // Ajouter une question incorrecte
  addIncorrect(questionId) {
    if (!this.userManager.isLoggedIn()) return;
    
    const incorrects = this.userManager.getIncorrectAnswers();
    
    if (incorrects[questionId]) {
      // Incrémenter le compteur d'essais
      incorrects[questionId].count++;
      incorrects[questionId].lastAttempt = Date.now();
    } else {
      // Première erreur
      incorrects[questionId] = {
        count: 1,
        lastAttempt: Date.now()
      };
    }
    
    // Calculer le prochain moment de re-proposition
    const delay = this.calculateDelay(incorrects[questionId].count);
    incorrects[questionId].nextRetry = Date.now() + delay;
    
    console.log(`❌ Question incorrecte ajoutée: ${questionId} (tentative ${incorrects[questionId].count})`);
    console.log(`⏱️ Prochain essai dans: ${Math.round(delay / 1000 / 60)} minutes`);
    
    // Sauvegarder
    this.userManager.saveIncorrectAnswers(incorrects);
  }
  
  // Calculer le délai avant re-proposition (en millisecondes)
  calculateDelay(attemptCount) {
    const config = CONFIG.RETRY_CONFIG;
    
    // Délai de base avec multiplicateur selon les tentatives
    let delay = config.minDelay * Math.pow(config.multiplierPerAttempt, attemptCount - 1);
    
    // Limiter au délai maximum
    delay = Math.min(delay, config.maxDelay);
    
    // Ajouter un facteur aléatoire (±25%)
    const randomFactor = 0.75 + Math.random() * 0.5;
    delay = delay * randomFactor;
    
    return Math.round(delay);
  }
  
  // Obtenir les questions prêtes à être reproposées
  getRetryQuestions() {
    if (!this.userManager.isLoggedIn()) return [];
    
    const incorrects = this.userManager.getIncorrectAnswers();
    const now = Date.now();
    const retryQuestions = [];
    
    Object.keys(incorrects).forEach(questionId => {
      if (incorrects[questionId].nextRetry <= now) {
        retryQuestions.push(questionId);
      }
    });
    
    if (retryQuestions.length > 0) {
      console.log(`🔄 ${retryQuestions.length} question(s) prête(s) à être reproposée(s)`);
    }
    
    return retryQuestions;
  }
  
  // Marquer une question comme correcte (retirer des incorrectes)
  markAsCorrect(questionId) {
    if (!this.userManager.isLoggedIn()) return;
    
    const incorrects = this.userManager.getIncorrectAnswers();
    
    // Supprimer des incorrectes
    if (incorrects[questionId]) {
      delete incorrects[questionId];
      console.log(`✅ Question ${questionId} retirée des incorrectes`);
      this.userManager.saveIncorrectAnswers(incorrects);
    }
    
    // Ajouter aux questions répondues
    this.userManager.addQuestionAnswered(questionId);
  }
  
  // Obtenir le nombre de questions incorrectes
  getIncorrectCount() {
    if (!this.userManager.isLoggedIn()) return 0;
    
    const incorrects = this.userManager.getIncorrectAnswers();
    return Object.keys(incorrects).length;
  }
  
  // Obtenir les statistiques détaillées
  getStats() {
    if (!this.userManager.isLoggedIn()) return null;
    
    const incorrects = this.userManager.getIncorrectAnswers();
    const now = Date.now();
    
    let readyCount = 0;
    let pendingCount = 0;
    
    Object.keys(incorrects).forEach(questionId => {
      if (incorrects[questionId].nextRetry <= now) {
        readyCount++;
      } else {
        pendingCount++;
      }
    });
    
    return {
      total: Object.keys(incorrects).length,
      ready: readyCount,
      pending: pendingCount
    };
  }
  
  // Réinitialiser toutes les questions incorrectes (debug)
  resetAll() {
    if (!this.userManager.isLoggedIn()) return;
    
    this.userManager.saveIncorrectAnswers({});
    console.log('🗑️ Toutes les questions incorrectes réinitialisées');
  }
}

