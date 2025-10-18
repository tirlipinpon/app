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
    
    // Stocker les données de la question pour validation
    this.currentQuestionData = questionData;
    
    switch (questionType) {
      case 'input':
        this.setupInputType(questionData);
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
  // TYPE: INPUT (avec letter-boxes)
  // ==========================================
  
  setupInputType(questionData) {
    this.currentInput = '';
    this.currentQuestionData = questionData;
    // Normaliser la réponse (retirer les accents)
    this.correctAnswer = this.removeAccents(String(questionData.answer).toUpperCase());
    
    // Setup clavier physique
    const keydownHandler = (e) => this.handleLetterBoxKeyPress(e);
    document.addEventListener('keydown', keydownHandler);
    this.currentInteractions.push({ 
      element: document, 
      event: 'keydown', 
      handler: keydownHandler 
    });
    
    // Setup mobile input
    this.setupMobileInputAnswer();
    
    // Setup bouton submit
    const submitBtn = document.getElementById('submitBtn');
    if (submitBtn) {
      const handleClick = () => this.submitInputAnswer();
      submitBtn.addEventListener('click', handleClick);
      this.currentInteractions.push({ 
        element: submitBtn, 
        event: 'click', 
        handler: handleClick 
      });
    }
    
    // Click sur word display pour focus mobile
    const wordDisplay = document.getElementById('wordDisplayAnswer');
    if (wordDisplay) {
      const clickHandler = () => {
        if (this.isMobileDevice()) {
          const mobileInput = document.getElementById('mobileInputAnswer');
          if (mobileInput) mobileInput.focus();
        }
      };
      wordDisplay.addEventListener('click', clickHandler);
      this.currentInteractions.push({ 
        element: wordDisplay, 
        event: 'click', 
        handler: clickHandler 
      });
    }
  }
  
  handleLetterBoxKeyPress(e) {
    // Ignorer si un input/select est focus (sauf mobileInputAnswer)
    const activeElement = document.activeElement;
    if (activeElement && 
        (activeElement.tagName === 'INPUT' && activeElement.id !== 'mobileInputAnswer') ||
        activeElement.tagName === 'SELECT') {
      return;
    }
    
    const letterBoxes = document.querySelectorAll('#wordDisplayAnswer .letter-box');
    if (!letterBoxes.length) return;
    
    // Backspace
    if (e.key === 'Backspace') {
      e.preventDefault();
      if (this.currentInput.length > 0) {
        // Ne pas supprimer les lettres vertes verrouillées
        const lastIndex = this.currentInput.length - 1;
        if (!letterBoxes[lastIndex].classList.contains('letter-correct')) {
          this.currentInput = this.currentInput.slice(0, -1);
          this.updateLetterBoxes();
        }
      }
      return;
    }
    
    // Lettres ET chiffres (accepter aussi les lettres accentuées)
    if (e.key.length === 1 && /[a-zA-ZÀ-ÿ0-9]/.test(e.key)) {
      e.preventDefault();
      
      if (this.currentInput.length < this.correctAnswer.length) {
        // Retirer les accents avant d'ajouter (si c'est une lettre)
        const normalizedKey = /[0-9]/.test(e.key) 
          ? e.key 
          : this.removeAccents(e.key.toUpperCase());
        this.currentInput += normalizedKey;
        this.updateLetterBoxes();
      }
    }
  }
  
  setupMobileInputAnswer() {
    const mobileInput = document.getElementById('mobileInputAnswer');
    if (!mobileInput) return;
    
    let previousValue = '';
    
    mobileInput.addEventListener('input', (e) => {
      const value = e.target.value.toUpperCase();
      
      if (value.length > previousValue.length) {
        // Nouvelle lettre/chiffre (accepter les lettres accentuées ET les chiffres)
        const newChar = value[value.length - 1];
        if (/[A-ZÀ-ÿ0-9]/.test(newChar) && this.currentInput.length < this.correctAnswer.length) {
          // Retirer les accents si c'est une lettre
          const normalizedChar = /[0-9]/.test(newChar) 
            ? newChar 
            : this.removeAccents(newChar);
          this.currentInput += normalizedChar;
          this.updateLetterBoxes();
        }
      } else if (value.length < previousValue.length) {
        // Backspace
        if (this.currentInput.length > 0) {
          const letterBoxes = document.querySelectorAll('#wordDisplayAnswer .letter-box');
          const lastIndex = this.currentInput.length - 1;
          if (!letterBoxes[lastIndex].classList.contains('letter-correct')) {
            this.currentInput = this.currentInput.slice(0, -1);
            this.updateLetterBoxes();
          }
        }
      }
      
      previousValue = value;
      
      // Réinitialiser l'input
      setTimeout(() => {
        e.target.value = '';
        previousValue = '';
      }, 10);
    });
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
  
  updateLetterBoxes() {
    const letterBoxes = document.querySelectorAll('#wordDisplayAnswer .letter-box');
    
    // Mettre à jour l'affichage
    for (let i = 0; i < letterBoxes.length; i++) {
      if (i < this.currentInput.length) {
        const letter = this.currentInput[i];
        letterBoxes[i].textContent = letter;
        
        // Validation en temps réel
        if (letter === this.correctAnswer[i]) {
          // ✅ Lettre correcte à la bonne position (VERT)
          letterBoxes[i].className = 'letter-box letter-correct';
        } else if (this.correctAnswer.includes(letter)) {
          // 🟡 Lettre existe mais mauvaise position (JAUNE)
          letterBoxes[i].className = 'letter-box letter-wrong-place';
        } else {
          // ❌ Lettre n'existe pas (ROUGE)
          letterBoxes[i].className = 'letter-box letter-wrong';
        }
      } else {
        // Case vide
        letterBoxes[i].textContent = '?';
        letterBoxes[i].className = 'letter-box';
      }
    }
    
    // Curseur sur la prochaine case (saute les vertes verrouillées)
    for (let i = 0; i < letterBoxes.length; i++) {
      letterBoxes[i].classList.remove('cursor');
    }
    
    if (this.currentInput.length < letterBoxes.length) {
      letterBoxes[this.currentInput.length].classList.add('cursor');
    }
  }
  
  isMobileDevice() {
    return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
  }
  
  submitInputAnswer() {
    const answer = this.currentInput.trim();
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
  // RÉACTIVATION DES INPUTS (pour réessayer)
  // ==========================================
  
  reactivateInputs(questionType) {
    console.log(`🔄 Réactivation des inputs pour type: ${questionType}`);
    
    switch (questionType) {
      case 'input':
        // Réinitialiser les letter boxes (ne garder que les vertes)
        this.currentInput = '';
        const letterBoxes = document.querySelectorAll('#wordDisplayAnswer .letter-box');
        letterBoxes.forEach(box => {
          if (!box.classList.contains('letter-correct')) {
            box.textContent = '?';
            box.className = 'letter-box';
          } else {
            // Reconstruire currentInput avec les lettres vertes
            this.currentInput += box.textContent;
          }
        });
        this.updateLetterBoxes();
        break;
      
      case 'remplir-blancs':
        // Vider le champ et refocus
        const input = document.querySelector('.blanks-input');
        if (input) {
          input.value = '';
          input.disabled = false;
          input.focus();
        }
        break;
      
      case 'qcm':
        // Réactiver tous les boutons
        const optionBtns = document.querySelectorAll('.option-btn');
        optionBtns.forEach(btn => {
          btn.disabled = false;
          btn.classList.remove('disabled');
        });
        break;
      
      case 'vrai-faux':
        // Réactiver les boutons vrai/faux
        const trueBtn = document.getElementById('trueFalseTrue');
        const falseBtn = document.getElementById('trueFalseFalse');
        if (trueBtn) {
          trueBtn.disabled = false;
          trueBtn.classList.remove('disabled');
        }
        if (falseBtn) {
          falseBtn.disabled = false;
          falseBtn.classList.remove('disabled');
        }
        break;
      
      case 'ordre':
        // Les éléments drag&drop sont déjà actifs
        console.log('✅ Ordre : les éléments restent actifs');
        break;
      
      case 'association':
        // Réinitialiser les associations
        this.associationState = {
          selectedLeft: null,
          pairs: {}
        };
        const svg = document.getElementById('associationSVG');
        if (svg) svg.innerHTML = '';
        
        const associationItems = document.querySelectorAll('.association-item');
        associationItems.forEach(item => {
          item.classList.remove('selected', 'connected');
        });
        break;
      
      case 'glisser-deposer':
        // Remettre les items dans la pool
        console.log('✅ Glisser-déposer : réinitialisation nécessaire');
        break;
      
      default:
        console.warn('⚠️ Type de question non géré pour réactivation:', questionType);
    }
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

