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
        this.setupRemplirBlancsType(questionData);
        break;
      
      case 'map-click':
        this.setupMapClickType(questionData);
        break;
      
      case 'timeline':
        this.setupTimelineType(questionData);
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
    
    // Compter les lettres vertes consécutives depuis le début
    const consecutiveGreenCount = this.countConsecutiveGreenLetters(letterBoxes);
    
    // Backspace
    if (e.key === 'Backspace') {
      e.preventDefault();
      if (this.currentInput.length > 0) {
        // Empêcher de supprimer les lettres vertes
        if (this.currentInput.length <= consecutiveGreenCount) {
          // Afficher un feedback
          const feedback = document.getElementById('feedback');
          if (feedback) {
            feedback.textContent = '🚫 Tu ne peux pas supprimer les lettres vertes !';
            feedback.className = 'feedback warning';
            feedback.classList.remove('hidden');
          }
          return;
        }
        
        this.currentInput = this.currentInput.slice(0, -1);
        this.updateLetterBoxes();
      }
      return;
    }
    
    // Lettres ET chiffres (accepter aussi les lettres accentuées)
    if (e.key.length === 1 && /[a-zA-ZÀ-ÿ0-9]/.test(e.key)) {
      e.preventDefault();
      
      // Si on a des lettres vertes, on ne peut ajouter qu'après elles
      // Vérifier qu'on n'a pas de lettre rouge/jaune avant de continuer
      if (this.currentInput.length > consecutiveGreenCount) {
        // Il y a au moins une lettre non-verte
        const cursorPos = this.currentInput.length - 1;
        const currentBox = letterBoxes[cursorPos];
        if (currentBox && (currentBox.classList.contains('letter-wrong') || currentBox.classList.contains('letter-wrong-place'))) {
          // Ne pas permettre d'avancer tant que la lettre actuelle est fausse
          // On remplace la dernière lettre au lieu d'en ajouter une nouvelle
          this.currentInput = this.currentInput.slice(0, -1);
        }
      }
      
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
  
  // Compter les lettres vertes consécutives depuis le début
  countConsecutiveGreenLetters(letterBoxes) {
    let count = 0;
    for (let i = 0; i < letterBoxes.length; i++) {
      if (letterBoxes[i].classList.contains('letter-correct')) {
        count++;
      } else {
        break; // Arrêter dès qu'on trouve une lettre non-verte
      }
    }
    return count;
  }
  
  setupMobileInputAnswer() {
    const mobileInput = document.getElementById('mobileInputAnswer');
    if (!mobileInput) return;
    
    let previousValue = '';
    
    mobileInput.addEventListener('input', (e) => {
      const value = e.target.value.toUpperCase();
      const letterBoxes = document.querySelectorAll('#wordDisplayAnswer .letter-box');
      const consecutiveGreenCount = this.countConsecutiveGreenLetters(letterBoxes);
      
      if (value.length > previousValue.length) {
        // Nouvelle lettre/chiffre (accepter les lettres accentuées ET les chiffres)
        const newChar = value[value.length - 1];
        if (/[A-ZÀ-ÿ0-9]/.test(newChar)) {
          // Vérifier qu'on n'a pas de lettre rouge/jaune avant de continuer
          if (this.currentInput.length > consecutiveGreenCount) {
            const cursorPos = this.currentInput.length - 1;
            const currentBox = letterBoxes[cursorPos];
            if (currentBox && (currentBox.classList.contains('letter-wrong') || currentBox.classList.contains('letter-wrong-place'))) {
              // Remplacer la dernière lettre fausse
              this.currentInput = this.currentInput.slice(0, -1);
            }
          }
          
          if (this.currentInput.length < this.correctAnswer.length) {
            // Retirer les accents si c'est une lettre
            const normalizedChar = /[0-9]/.test(newChar) 
              ? newChar 
              : this.removeAccents(newChar);
            this.currentInput += normalizedChar;
            this.updateLetterBoxes();
          }
        }
      } else if (value.length < previousValue.length) {
        // Backspace
        if (this.currentInput.length > 0) {
          // Empêcher de supprimer les lettres vertes
          if (this.currentInput.length <= consecutiveGreenCount) {
            const feedback = document.getElementById('feedback');
            if (feedback) {
              feedback.textContent = '🚫 Tu ne peux pas supprimer les lettres vertes !';
              feedback.className = 'feedback warning';
              feedback.classList.remove('hidden');
            }
          } else {
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
    
    // ✅ Validation automatique si toutes les lettres sont vertes
    if (this.currentInput.length === this.correctAnswer.length) {
      const allCorrect = this.currentInput === this.correctAnswer;
      if (allCorrect) {
        // Petit délai pour que l'utilisateur voie la dernière lettre devenir verte
        setTimeout(() => {
          this.submitInputAnswer();
        }, 300);
      }
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
      // Réinitialiser les styles de feedback
      item.classList.remove('ordre-correct');
      item.style.opacity = '1';
      item.style.cursor = 'grab';
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
    
    console.log('📤 Ordre soumis:', userOrder);
    console.log('📋 Items dans le conteneur:', Array.from(items).map((item, idx) => ({
      position: idx,
      originalIndex: item.dataset.originalIndex,
      text: item.querySelector('.ordre-text')?.textContent
    })));
    
    this.game.handleAnswer(userOrder);
  }
  
  // ==========================================
  // TYPE: ASSOCIATION (Relier deux colonnes)
  // ==========================================
  
  setupAssociationType() {
    // Réinitialiser les styles de feedback
    document.querySelectorAll('.association-item').forEach(item => {
      item.classList.remove('association-correct');
      item.style.opacity = '1';
      item.style.pointerEvents = 'auto';
    });
    
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
  // TYPE: REMPLIR-BLANCS (avec letter-boxes)
  // ==========================================
  
  setupRemplirBlancsType(questionData) {
    this.currentInput = '';
    this.currentQuestionData = questionData;
    // Normaliser la réponse (retirer les accents)
    this.correctAnswer = this.removeAccents(String(questionData.answer).toUpperCase());
    
    // Setup clavier physique
    const keydownHandler = (e) => this.handleBlanksKeyPress(e);
    document.addEventListener('keydown', keydownHandler);
    this.currentInteractions.push({ 
      element: document, 
      event: 'keydown', 
      handler: keydownHandler 
    });
    
    // Setup mobile input
    this.setupMobileInputBlanks();
    
    // Click sur word display pour focus mobile
    const wordDisplay = document.getElementById('wordDisplayBlanks');
    if (wordDisplay) {
      const clickHandler = () => {
        if (this.isMobileDevice()) {
          const mobileInput = document.getElementById('mobileInputBlanks');
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
  
  handleBlanksKeyPress(e) {
    // Ignorer si un input/select est focus (sauf mobileInputBlanks)
    const activeElement = document.activeElement;
    if (activeElement && 
        (activeElement.tagName === 'INPUT' && activeElement.id !== 'mobileInputBlanks') ||
        activeElement.tagName === 'SELECT') {
      return;
    }
    
    const letterBoxes = document.querySelectorAll('#wordDisplayBlanks .letter-box');
    if (!letterBoxes.length) return;
    
    // Compter les lettres vertes consécutives depuis le début
    const consecutiveGreenCount = this.countConsecutiveGreenLettersBlanks(letterBoxes);
    
    // Backspace
    if (e.key === 'Backspace') {
      e.preventDefault();
      if (this.currentInput.length > 0) {
        // Empêcher de supprimer les lettres vertes
        if (this.currentInput.length <= consecutiveGreenCount) {
          const feedback = document.getElementById('feedback');
          if (feedback) {
            feedback.textContent = '🚫 Tu ne peux pas supprimer les lettres vertes !';
            feedback.className = 'feedback warning';
            feedback.classList.remove('hidden');
          }
          return;
        }
        
        this.currentInput = this.currentInput.slice(0, -1);
        this.updateBlanksLetterBoxes();
      }
      return;
    }
    
    // Lettres ET chiffres
    if (e.key.length === 1 && /[a-zA-ZÀ-ÿ0-9]/.test(e.key)) {
      e.preventDefault();
      
      // Vérifier qu'on n'a pas de lettre rouge/jaune avant de continuer
      if (this.currentInput.length > consecutiveGreenCount) {
        const cursorPos = this.currentInput.length - 1;
        const currentBox = letterBoxes[cursorPos];
        if (currentBox && (currentBox.classList.contains('letter-wrong') || currentBox.classList.contains('letter-wrong-place'))) {
          // Remplacer la dernière lettre fausse
          this.currentInput = this.currentInput.slice(0, -1);
        }
      }
      
      if (this.currentInput.length < this.correctAnswer.length) {
        const normalizedKey = /[0-9]/.test(e.key) 
          ? e.key 
          : this.removeAccents(e.key.toUpperCase());
        this.currentInput += normalizedKey;
        this.updateBlanksLetterBoxes();
      }
    }
  }
  
  // Compter les lettres vertes consécutives pour blanks
  countConsecutiveGreenLettersBlanks(letterBoxes) {
    let count = 0;
    for (let i = 0; i < letterBoxes.length; i++) {
      if (letterBoxes[i].classList.contains('letter-correct')) {
        count++;
      } else {
        break;
      }
    }
    return count;
  }
  
  setupMobileInputBlanks() {
    const mobileInput = document.getElementById('mobileInputBlanks');
    if (!mobileInput) return;
    
    let previousValue = '';
    
    mobileInput.addEventListener('input', (e) => {
      const value = e.target.value.toUpperCase();
      const letterBoxes = document.querySelectorAll('#wordDisplayBlanks .letter-box');
      const consecutiveGreenCount = this.countConsecutiveGreenLettersBlanks(letterBoxes);
      
      if (value.length > previousValue.length) {
        const newChar = value[value.length - 1];
        if (/[A-ZÀ-ÿ0-9]/.test(newChar)) {
          // Vérifier qu'on n'a pas de lettre rouge/jaune avant de continuer
          if (this.currentInput.length > consecutiveGreenCount) {
            const cursorPos = this.currentInput.length - 1;
            const currentBox = letterBoxes[cursorPos];
            if (currentBox && (currentBox.classList.contains('letter-wrong') || currentBox.classList.contains('letter-wrong-place'))) {
              // Remplacer la dernière lettre fausse
              this.currentInput = this.currentInput.slice(0, -1);
            }
          }
          
          if (this.currentInput.length < this.correctAnswer.length) {
            const normalizedChar = /[0-9]/.test(newChar) 
              ? newChar 
              : this.removeAccents(newChar);
            this.currentInput += normalizedChar;
            this.updateBlanksLetterBoxes();
          }
        }
      } else if (value.length < previousValue.length) {
        if (this.currentInput.length > 0) {
          // Empêcher de supprimer les lettres vertes
          if (this.currentInput.length <= consecutiveGreenCount) {
            const feedback = document.getElementById('feedback');
            if (feedback) {
              feedback.textContent = '🚫 Tu ne peux pas supprimer les lettres vertes !';
              feedback.className = 'feedback warning';
              feedback.classList.remove('hidden');
            }
          } else {
            this.currentInput = this.currentInput.slice(0, -1);
            this.updateBlanksLetterBoxes();
          }
        }
      }
      
      previousValue = value;
      
      setTimeout(() => {
        e.target.value = '';
        previousValue = '';
      }, 10);
    });
  }
  
  updateBlanksLetterBoxes() {
    const letterBoxes = document.querySelectorAll('#wordDisplayBlanks .letter-box');
    
    for (let i = 0; i < letterBoxes.length; i++) {
      if (i < this.currentInput.length) {
        const letter = this.currentInput[i];
        letterBoxes[i].textContent = letter;
        
        // Validation en temps réel
        if (letter === this.correctAnswer[i]) {
          letterBoxes[i].className = 'letter-box letter-correct';
        } else if (this.correctAnswer.includes(letter)) {
          letterBoxes[i].className = 'letter-box letter-wrong-place';
        } else {
          letterBoxes[i].className = 'letter-box letter-wrong';
        }
      } else {
        letterBoxes[i].textContent = '?';
        letterBoxes[i].className = 'letter-box';
      }
    }
    
    // Curseur
    for (let i = 0; i < letterBoxes.length; i++) {
      letterBoxes[i].classList.remove('cursor');
    }
    
    if (this.currentInput.length < letterBoxes.length) {
      letterBoxes[this.currentInput.length].classList.add('cursor');
    }
    
    // ✅ Validation automatique si toutes les lettres sont vertes
    if (this.currentInput.length === this.correctAnswer.length) {
      const allCorrect = this.currentInput === this.correctAnswer;
      if (allCorrect) {
        // Petit délai pour que l'utilisateur voie la dernière lettre devenir verte
        setTimeout(() => {
          this.submitBlanksAnswer();
        }, 300);
      }
    }
  }
  
  submitBlanksAnswer() {
    const answer = this.currentInput.trim();
    if (answer === '') {
      this.game.ui.showFeedback('Merci de remplir le blanc !', 'error');
      return;
    }
    
    this.game.handleAnswer(answer);
  }
  
  // ==========================================
  // RÉACTIVATION DES INPUTS (pour réessayer)
  // ==========================================
  
  reactivateInputs(questionType, correctIndices = null) {
    console.log(`🔄 Réactivation des inputs pour type: ${questionType}`, correctIndices ? `avec ${correctIndices.length} indices corrects` : '');
    
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
        // Réinitialiser les letter boxes (ne garder que les vertes)
        this.currentInput = '';
        const blanksBoxes = document.querySelectorAll('#wordDisplayBlanks .letter-box');
        blanksBoxes.forEach(box => {
          if (!box.classList.contains('letter-correct')) {
            box.textContent = '?';
            box.className = 'letter-box';
          } else {
            this.currentInput += box.textContent;
          }
        });
        if (blanksBoxes.length > 0) {
          this.updateBlanksLetterBoxes();
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
      case 'timeline':
        // Marquer visuellement les cartes correctes et bloquer leur déplacement
        console.log(`🔄 Réactivation ${questionType} avec correctIndices:`, correctIndices);
        
        if (correctIndices && correctIndices.length > 0) {
          // Pour timeline, on travaille avec les slots remplis
          let items;
          if (questionType === 'timeline') {
            // Récupérer les cartes dans l'ordre des slots
            const dropZones = document.querySelectorAll('.slot-drop-zone');
            items = Array.from(dropZones).map(zone => zone.querySelector('.timeline-event-card')).filter(card => card !== null);
            console.log('📦 Nombre de cartes timeline trouvées:', items.length);
          } else {
            // Pour ordre, utiliser le conteneur standard
            const container = document.getElementById('ordreContainer');
            items = container ? Array.from(container.querySelectorAll('.ordre-item')) : [];
            console.log('📦 Nombre d\'items ordre trouvés:', items.length);
          }
            
            items.forEach((item, idx) => {
              const textSelector = questionType === 'timeline' ? '.timeline-event-text' : '.ordre-text';
              console.log(`  Item ${idx}:`, {
                isCorrect: correctIndices.includes(idx),
                text: item.querySelector(textSelector)?.textContent || item.textContent
              });
              
              if (correctIndices.includes(idx)) {
                // Carte correcte : marquer en vert et bloquer
                item.classList.add('timeline-event-correct');
                item.draggable = false;
                item.style.opacity = '0.7';
                item.style.cursor = 'not-allowed';
                console.log(`    ✅ Carte ${idx} marquée comme correcte`);
              } else {
                // Carte incorrecte : réinitialiser
                item.classList.remove('timeline-event-correct');
                item.draggable = true;
                item.style.opacity = '1';
                item.style.cursor = 'grab';
                console.log(`    ❌ Carte ${idx} reste modifiable`);
              }
            });
          console.log(`✅ ${questionType} : ${correctIndices.length} carte(s) correcte(s) bloquée(s)`);
        } else {
          console.log(`⚠️ ${questionType} : aucun indice correct ou array vide`);
        }
        break;
      
      case 'association':
        // Marquer les paires correctes et les bloquer
        console.log('🔄 Réactivation Association avec correctIndices:', correctIndices);
        
        if (correctIndices && typeof correctIndices === 'object' && Object.keys(correctIndices).length > 0) {
          // correctIndices est un objet {left: right} pour les paires correctes
          Object.keys(correctIndices).forEach(leftValue => {
            const rightValue = correctIndices[leftValue];
            
            // Trouver les éléments correspondants
            const leftItem = document.querySelector(`.association-left .association-item[data-value="${leftValue}"]`);
            const rightItem = document.querySelector(`.association-right .association-item[data-value="${rightValue}"]`);
            
            if (leftItem && rightItem) {
              // Marquer comme correct et bloquer
              leftItem.classList.add('association-correct');
              rightItem.classList.add('association-correct');
              leftItem.style.opacity = '0.7';
              rightItem.style.opacity = '0.7';
              leftItem.style.pointerEvents = 'none';
              rightItem.style.pointerEvents = 'none';
              
              // Garder la paire dans l'état
              this.associationState.pairs[leftValue] = rightValue;
              
              console.log(`  ✅ Paire correcte bloquée: ${leftValue} → ${rightValue}`);
            }
          });
          
          console.log(`✅ Association : ${Object.keys(correctIndices).length} paire(s) correcte(s) bloquée(s)`);
        } else {
          // Réinitialiser complètement si aucune paire correcte
          this.associationState = {
            selectedLeft: null,
            pairs: {}
          };
          
          // Réactiver tous les éléments
          document.querySelectorAll('.association-item').forEach(item => {
            item.classList.remove('association-correct', 'selected', 'paired');
            item.style.opacity = '1';
            item.style.pointerEvents = 'auto';
          });
          
          console.log('⚠️ Association : aucune paire correcte, reset complet');
        }
        
        // Effacer la sélection actuelle
        this.associationState.selectedLeft = null;
        document.querySelectorAll('.association-left .association-item').forEach(item => {
          if (!item.classList.contains('association-correct')) {
            item.classList.remove('selected');
          }
        });
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
      
      case 'map-click':
        // Retirer le marqueur
        const marker = document.getElementById('mapMarker');
        if (marker) {
          marker.classList.add('hidden');
          marker.dataset.clickedZone = '';
        }
        break;
      
      case 'timeline':
        // Remettre toutes les cartes dans le pool
        const timelineCards = document.querySelectorAll('.timeline-event-card');
        const timelinePool = document.getElementById('timelinePool');
        if (timelinePool) {
          timelineCards.forEach(card => {
            timelinePool.appendChild(card);
          });
        }
        // Nettoyer les drop zones
        const timelineDropZones = document.querySelectorAll('.slot-drop-zone');
        timelineDropZones.forEach(zone => {
          zone.classList.remove('filled');
          zone.textContent = 'Glisse ici';
        });
        break;
      
      default:
        console.warn('⚠️ Type de question non géré pour réactivation:', questionType);
    }
  }
  
  // ==========================================
  // TYPE: MAP-CLICK (Carte interactive)
  // ==========================================
  
  setupMapClickType(questionData) {
    const mapWrapper = document.getElementById('mapWrapper');
    const mapMarker = document.getElementById('mapMarker');
    const mapSvgContainer = document.getElementById('mapSvgContainer');
    
    if (!mapWrapper || !mapMarker || !mapSvgContainer) return;
    
    // Récupérer les zones et le mode de validation
    const zonesJson = mapWrapper.dataset.zones;
    const zones = zonesJson ? JSON.parse(zonesJson) : [];
    const validationMode = mapWrapper.dataset.validationMode || 'any';
    
    console.log('🎮 Mode de validation reçu:', validationMode);
    
    // Pour le mode "all", stocker les zones trouvées
    let foundZones = [];
    const correctAnswer = questionData.answer;
    const requiredZones = Array.isArray(correctAnswer) ? correctAnswer : [correctAnswer];
    
    console.log('🎯 Zones requises:', requiredZones);
    console.log('📊 Mode actif:', validationMode === 'all' && requiredZones.length > 1 ? 'MODE ET (toutes les zones)' : 'MODE OU (une seule zone)');
    
    // Gérer le clic sur les zones SVG
    const handleSvgClick = (e) => {
      const target = e.target;
      const zoneId = target.dataset.zone;
      
      if (zoneId) {
        // Clic direct sur une zone SVG
        const rect = mapSvgContainer.getBoundingClientRect();
        const x = ((e.clientX - rect.left) / rect.width) * 100;
        const y = ((e.clientY - rect.top) / rect.height) * 100;
        
        // Placer le marqueur
        mapMarker.style.left = `${x}%`;
        mapMarker.style.top = `${y}%`;
        mapMarker.classList.remove('hidden');
        
        if (validationMode === 'all' && requiredZones.length > 1) {
          // Mode "all" : collecter les zones
          if (requiredZones.includes(zoneId) && !foundZones.includes(zoneId)) {
            foundZones.push(zoneId);
            
            // Marquer visuellement la zone comme trouvée
            target.classList.add('zone-found');
            target.style.fill = 'rgba(76, 175, 80, 0.3)';
            target.style.stroke = 'rgba(76, 175, 80, 0.8)';
            
            // Afficher feedback
            const feedback = document.getElementById('feedback');
            if (feedback) {
              feedback.textContent = `✅ Zone trouvée ! (${foundZones.length}/${requiredZones.length})`;
              feedback.className = 'feedback success';
            }
            
            // Vérifier si toutes les zones sont trouvées
            if (foundZones.length === requiredZones.length) {
              setTimeout(() => {
                this.game.handleAnswer(foundZones);
              }, 500);
            }
          } else if (!requiredZones.includes(zoneId)) {
            // Zone incorrecte
            const feedback = document.getElementById('feedback');
            if (feedback) {
              feedback.textContent = `❌ Mauvaise zone ! (${foundZones.length}/${requiredZones.length} trouvées)`;
              feedback.className = 'feedback error';
              setTimeout(() => {
                feedback.textContent = `${foundZones.length}/${requiredZones.length} zones trouvées`;
                feedback.className = 'feedback info';
              }, 1500);
            }
          }
        } else {
          // Mode "any" : validation immédiate (comportement actuel)
          setTimeout(() => {
            this.game.handleAnswer(zoneId);
          }, 500);
        }
      }
    };
    
    // Attacher l'événement sur le SVG
    const svg = mapSvgContainer.querySelector('svg');
    if (svg) {
      svg.addEventListener('click', handleSvgClick);
      this.currentInteractions.push({ 
        element: svg, 
        event: 'click', 
        handler: handleSvgClick 
      });
      
      // Rendre les zones interactives
      const zonePaths = svg.querySelectorAll('[data-zone]');
      zonePaths.forEach(path => {
        path.style.cursor = 'pointer';
        path.style.transition = 'opacity 0.2s ease';
        
        const handleHover = () => {
          path.style.opacity = '0.7';
        };
        
        const handleLeave = () => {
          path.style.opacity = '1';
        };
        
        path.addEventListener('mouseenter', handleHover);
        path.addEventListener('mouseleave', handleLeave);
        
        this.currentInteractions.push(
          { element: path, event: 'mouseenter', handler: handleHover },
          { element: path, event: 'mouseleave', handler: handleLeave }
        );
      });
    }
  }
  
  // ==========================================
  // TYPE: TIMELINE (Ligne du temps)
  // ==========================================
  
  setupTimelineType(questionData) {
    const eventCards = document.querySelectorAll('.timeline-event-card');
    const dropZones = document.querySelectorAll('.slot-drop-zone');
    const submitBtn = document.getElementById('submitTimeline');
    
    // Réinitialiser les styles de feedback
    eventCards.forEach(card => {
      card.classList.remove('timeline-event-correct');
      card.style.opacity = '1';
      card.style.cursor = 'grab';
      card.draggable = true;
    });
    
    let draggedElement = null;
    let timelineState = {}; // {slotIndex: eventId}
    
    // Drag start sur les cartes
    eventCards.forEach(card => {
      const handleDragStart = (e) => {
        draggedElement = card;
        card.classList.add('dragging');
        e.dataTransfer.effectAllowed = 'move';
      };
      
      const handleDragEnd = (e) => {
        card.classList.remove('dragging');
      };
      
      card.addEventListener('dragstart', handleDragStart);
      card.addEventListener('dragend', handleDragEnd);
      
      this.currentInteractions.push(
        { element: card, event: 'dragstart', handler: handleDragStart },
        { element: card, event: 'dragend', handler: handleDragEnd }
      );
    });
    
    // Drop zones
    dropZones.forEach(zone => {
      const handleDragOver = (e) => {
        e.preventDefault();
        zone.classList.add('drag-over');
      };
      
      const handleDragLeave = (e) => {
        zone.classList.remove('drag-over');
      };
      
      const handleDrop = (e) => {
        e.preventDefault();
        zone.classList.remove('drag-over');
        
        if (draggedElement) {
          const slotIndex = zone.dataset.slotIndex;
          const eventId = draggedElement.dataset.eventId;
          
          // Retirer la carte de son emplacement précédent
          const existingCard = zone.querySelector('.timeline-event-card');
          if (existingCard) {
            // Remettre dans le pool
            document.getElementById('timelinePool').appendChild(existingCard);
            delete timelineState[slotIndex];
          }
          
          // Placer la nouvelle carte
          zone.appendChild(draggedElement);
          zone.classList.add('filled');
          zone.textContent = ''; // Retirer le texte "Glisse ici"
          zone.appendChild(draggedElement);
          
          // Enregistrer dans l'état
          timelineState[slotIndex] = eventId;
          
          // Vérifier si toutes les slots sont remplies
          if (Object.keys(timelineState).length === dropZones.length) {
            // Activer le bouton valider
            if (submitBtn) submitBtn.disabled = false;
          }
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
    
    // Bouton submit
    if (submitBtn) {
      const handleSubmit = () => {
        // Construire le tableau des événements dans l'ordre
        const orderedEvents = [];
        for (let i = 0; i < dropZones.length; i++) {
          if (timelineState[i]) {
            orderedEvents.push(timelineState[i]);
          }
        }
        
        this.game.handleAnswer(orderedEvents);
      };
      
      submitBtn.addEventListener('click', handleSubmit);
      this.currentInteractions.push({ 
        element: submitBtn, 
        event: 'click', 
        handler: handleSubmit 
      });
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

