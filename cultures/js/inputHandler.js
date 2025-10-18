// ============================================
// INPUT HANDLER - Gestion de tous les types de réponses
// ============================================

class InputHandler {
  constructor(game) {
    this.game = game;
    this.currentInteractions = [];
    this.dragState = {
      draggedElement: null,
      sourceContainer: null
    };
    this.associationState = {
      selectedLeft: null,
      pairs: {}
    };
  }
  
  // Réinitialiser l'état
  reset() {
    this.currentInteractions = [];
    this.dragState = {
      draggedElement: null,
      sourceContainer: null
    };
    this.associationState = {
      selectedLeft: null,
      pairs: {}
    };
  }
  
  // ==========================================
  // ATTACHER LES LISTENERS SELON LE TYPE
  // ==========================================
  
  attachListeners(questionType, questionData) {
    this.reset();
    
    switch (questionType) {
      case 'input':
        this.setupInputType();
        break;
      
      case 'qcm':
        this.setupQCMType();
        break;
      
      case 'vrai-faux':
        this.setupVraiFauxType();
        break;
      
      case 'ordre':
        this.setupOrdreType();
        break;
      
      case 'association':
        this.setupAssociationType();
        break;
      
      case 'glisser-deposer':
        this.setupGlisserDeposerType();
        break;
      
      case 'remplir-blancs':
        this.setupRemplirBlancsType();
        break;
    }
  }
  
  // ==========================================
  // TYPE: INPUT (Champ texte libre)
  // ==========================================
  
  setupInputType() {
    const input = document.getElementById('answerInput');
    const submitBtn = document.getElementById('submitBtn');
    
    if (!input || !submitBtn) return;
    
    // Soumettre avec Entrée
    const handleKeyPress = (e) => {
      if (e.key === 'Enter') {
        this.submitInputAnswer();
      }
    };
    
    // Soumettre avec bouton
    const handleClick = () => {
      this.submitInputAnswer();
    };
    
    input.addEventListener('keypress', handleKeyPress);
    submitBtn.addEventListener('click', handleClick);
    
    this.currentInteractions.push(
      { element: input, event: 'keypress', handler: handleKeyPress },
      { element: submitBtn, event: 'click', handler: handleClick }
    );
    
    // Focus automatique
    input.focus();
  }
  
  submitInputAnswer() {
    const input = document.getElementById('answerInput');
    if (!input) return;
    
    const answer = input.value.trim();
    if (answer === '') {
      this.game.ui.showFeedback('Merci d\'entrer une réponse !', 'error');
      return;
    }
    
    this.game.handleAnswer(answer);
  }
  
  // ==========================================
  // TYPE: QCM (Choix multiple)
  // ==========================================
  
  setupQCMType() {
    const options = document.querySelectorAll('.option-btn');
    
    options.forEach(option => {
      const handleClick = () => {
        const answer = option.dataset.answer;
        this.game.handleAnswer(answer);
      };
      
      option.addEventListener('click', handleClick);
      this.currentInteractions.push({ element: option, event: 'click', handler: handleClick });
    });
  }
  
  // ==========================================
  // TYPE: VRAI-FAUX
  // ==========================================
  
  setupVraiFauxType() {
    const trueBtn = document.getElementById('trueFalseTrue');
    const falseBtn = document.getElementById('trueFalseFalse');
    
    if (!trueBtn || !falseBtn) return;
    
    const handleTrue = () => this.game.handleAnswer(true);
    const handleFalse = () => this.game.handleAnswer(false);
    
    trueBtn.addEventListener('click', handleTrue);
    falseBtn.addEventListener('click', handleFalse);
    
    this.currentInteractions.push(
      { element: trueBtn, event: 'click', handler: handleTrue },
      { element: falseBtn, event: 'click', handler: handleFalse }
    );
  }
  
  // ==========================================
  // TYPE: ORDRE (Glisser-déposer pour ordonner)
  // ==========================================
  
  setupOrdreType() {
    const container = document.getElementById('ordreContainer');
    if (!container) return;
    
    const items = container.querySelectorAll('.ordre-item');
    
    items.forEach(item => {
      item.draggable = true;
      
      const handleDragStart = (e) => {
        item.classList.add('dragging');
        e.dataTransfer.effectAllowed = 'move';
        e.dataTransfer.setData('text/html', item.innerHTML);
      };
      
      const handleDragEnd = () => {
        item.classList.remove('dragging');
      };
      
      item.addEventListener('dragstart', handleDragStart);
      item.addEventListener('dragend', handleDragEnd);
      
      this.currentInteractions.push(
        { element: item, event: 'dragstart', handler: handleDragStart },
        { element: item, event: 'dragend', handler: handleDragEnd }
      );
    });
    
    // Zone de dépôt
    const handleDragOver = (e) => {
      e.preventDefault();
      const draggingItem = container.querySelector('.dragging');
      const afterElement = this.getDragAfterElement(container, e.clientY);
      
      if (afterElement == null) {
        container.appendChild(draggingItem);
      } else {
        container.insertBefore(draggingItem, afterElement);
      }
    };
    
    container.addEventListener('dragover', handleDragOver);
    this.currentInteractions.push({ element: container, event: 'dragover', handler: handleDragOver });
    
    // Bouton valider
    const submitBtn = document.getElementById('submitOrdre');
    if (submitBtn) {
      const handleSubmit = () => this.submitOrdreAnswer();
      submitBtn.addEventListener('click', handleSubmit);
      this.currentInteractions.push({ element: submitBtn, event: 'click', handler: handleSubmit });
    }
  }
  
  getDragAfterElement(container, y) {
    const draggableElements = [...container.querySelectorAll('.ordre-item:not(.dragging)')];
    
    return draggableElements.reduce((closest, child) => {
      const box = child.getBoundingClientRect();
      const offset = y - box.top - box.height / 2;
      
      if (offset < 0 && offset > closest.offset) {
        return { offset: offset, element: child };
      } else {
        return closest;
      }
    }, { offset: Number.NEGATIVE_INFINITY }).element;
  }
  
  submitOrdreAnswer() {
    const container = document.getElementById('ordreContainer');
    if (!container) return;
    
    const items = container.querySelectorAll('.ordre-item');
    const userOrder = Array.from(items).map(item => parseInt(item.dataset.originalIndex));
    
    this.game.handleAnswer(userOrder);
  }
  
  // ==========================================
  // TYPE: ASSOCIATION (Relier deux colonnes)
  // ==========================================
  
  setupAssociationType() {
    const leftItems = document.querySelectorAll('.association-left .association-item');
    const rightItems = document.querySelectorAll('.association-right .association-item');
    
    leftItems.forEach(item => {
      const handleClick = () => {
        // Désélectionner l'ancien
        document.querySelectorAll('.association-left .association-item').forEach(i => i.classList.remove('selected'));
        
        // Sélectionner le nouveau
        item.classList.add('selected');
        this.associationState.selectedLeft = item.dataset.value;
      };
      
      item.addEventListener('click', handleClick);
      this.currentInteractions.push({ element: item, event: 'click', handler: handleClick });
    });
    
    rightItems.forEach(item => {
      const handleClick = () => {
        if (!this.associationState.selectedLeft) {
          this.game.ui.showFeedback('Sélectionne d\'abord un élément de gauche !', 'info');
          return;
        }
        
        const rightValue = item.dataset.value;
        
        // Créer la paire
        this.associationState.pairs[this.associationState.selectedLeft] = rightValue;
        
        // Afficher visuellement
        this.game.ui.drawAssociationLine(this.associationState.selectedLeft, rightValue);
        
        // Désélectionner
        document.querySelectorAll('.association-left .association-item').forEach(i => i.classList.remove('selected'));
        this.associationState.selectedLeft = null;
      };
      
      item.addEventListener('click', handleClick);
      this.currentInteractions.push({ element: item, event: 'click', handler: handleClick });
    });
    
    // Bouton valider
    const submitBtn = document.getElementById('submitAssociation');
    if (submitBtn) {
      const handleSubmit = () => {
        const questionData = this.game.questionManager.getCurrentQuestion();
        const requiredPairs = Object.keys(questionData.answer).length;
        
        if (Object.keys(this.associationState.pairs).length < requiredPairs) {
          this.game.ui.showFeedback('Termine toutes les associations !', 'error');
          return;
        }
        
        this.game.handleAnswer(this.associationState.pairs);
      };
      
      submitBtn.addEventListener('click', handleSubmit);
      this.currentInteractions.push({ element: submitBtn, event: 'click', handler: handleSubmit });
    }
  }
  
  // ==========================================
  // TYPE: GLISSER-DÉPOSER (Catégoriser)
  // ==========================================
  
  setupGlisserDeposerType() {
    const items = document.querySelectorAll('.draggable-item');
    const dropZones = document.querySelectorAll('.drop-zone');
    
    items.forEach(item => {
      item.draggable = true;
      
      const handleDragStart = (e) => {
        this.dragState.draggedElement = item;
        this.dragState.sourceContainer = item.parentElement;
        item.classList.add('dragging');
        e.dataTransfer.effectAllowed = 'move';
      };
      
      const handleDragEnd = () => {
        item.classList.remove('dragging');
        this.dragState.draggedElement = null;
        this.dragState.sourceContainer = null;
      };
      
      item.addEventListener('dragstart', handleDragStart);
      item.addEventListener('dragend', handleDragEnd);
      
      this.currentInteractions.push(
        { element: item, event: 'dragstart', handler: handleDragStart },
        { element: item, event: 'dragend', handler: handleDragEnd }
      );
    });
    
    dropZones.forEach(zone => {
      const handleDragOver = (e) => {
        e.preventDefault();
        zone.classList.add('drag-over');
      };
      
      const handleDragLeave = () => {
        zone.classList.remove('drag-over');
      };
      
      const handleDrop = (e) => {
        e.preventDefault();
        zone.classList.remove('drag-over');
        
        if (this.dragState.draggedElement) {
          zone.appendChild(this.dragState.draggedElement);
        }
      };
      
      zone.addEventListener('dragover', handleDragOver);
      zone.addEventListener('dragleave', handleDragLeave);
      zone.addEventListener('drop', handleDrop);
      
      this.currentInteractions.push(
        { element: zone, event: 'dragover', handler: handleDragOver },
        { element: zone, event: 'dragleave', handler: handleDragLeave },
        { element: zone, event: 'drop', handler: handleDrop }
      );
    });
    
    // Bouton valider
    const submitBtn = document.getElementById('submitGlisser');
    if (submitBtn) {
      const handleSubmit = () => this.submitGlisserDeposerAnswer();
      submitBtn.addEventListener('click', handleSubmit);
      this.currentInteractions.push({ element: submitBtn, event: 'click', handler: handleSubmit });
    }
  }
  
  submitGlisserDeposerAnswer() {
    const dropZones = document.querySelectorAll('.drop-zone');
    const userCategories = {};
    
    dropZones.forEach(zone => {
      const category = zone.dataset.category;
      const items = zone.querySelectorAll('.draggable-item');
      userCategories[category] = Array.from(items).map(item => item.dataset.value);
    });
    
    this.game.handleAnswer(userCategories);
  }
  
  // ==========================================
  // TYPE: REMPLIR-BLANCS
  // ==========================================
  
  setupRemplirBlancsType() {
    const input = document.querySelector('.blanks-input');
    const submitBtn = document.getElementById('submitBlanks');
    
    if (!input || !submitBtn) return;
    
    const handleKeyPress = (e) => {
      if (e.key === 'Enter') {
        this.submitBlanksAnswer();
      }
    };
    
    const handleClick = () => {
      this.submitBlanksAnswer();
    };
    
    input.addEventListener('keypress', handleKeyPress);
    submitBtn.addEventListener('click', handleClick);
    
    this.currentInteractions.push(
      { element: input, event: 'keypress', handler: handleKeyPress },
      { element: submitBtn, event: 'click', handler: handleClick }
    );
    
    input.focus();
  }
  
  submitBlanksAnswer() {
    const input = document.querySelector('.blanks-input');
    if (!input) return;
    
    const answer = input.value.trim();
    if (answer === '') {
      this.game.ui.showFeedback('Merci de remplir le blanc !', 'error');
      return;
    }
    
    this.game.handleAnswer(answer);
  }
  
  // ==========================================
  // NETTOYAGE
  // ==========================================
  
  cleanup() {
    this.currentInteractions.forEach(({ element, event, handler }) => {
      if (element) {
        element.removeEventListener(event, handler);
      }
    });
    
    this.reset();
  }
}

