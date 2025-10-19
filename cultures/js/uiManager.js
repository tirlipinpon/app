// ============================================
// UI MANAGER - Gestion de l'interface utilisateur
// ============================================

class UIManager {
  constructor() {
    // Pas besoin de stocker les domElements, on les récupère directement quand nécessaire
  }
  
  // ==========================================
  // UTILITAIRES
  // ==========================================
  
  setCurrentUser(username) {
    const currentUserDisplay = document.getElementById('currentUser');
    if (currentUserDisplay) {
      currentUserDisplay.textContent = username;
    }
  }
  
  // ==========================================
  // AFFICHAGE DES QUESTIONS
  // ==========================================
  
  displayQuestion(questionText) {
    const questionTextElement = document.getElementById('questionText');
    if (questionTextElement) {
      questionTextElement.textContent = questionText;
    }
  }
  
  // ==========================================
  // CRÉATION DES INTERFACES DE RÉPONSE
  // ==========================================
  
  createAnswerInterface(questionType, questionData) {
    const answerContainer = document.getElementById('answerContainer');
    const hintContainer = document.getElementById('hintContainer');
    
    if (!answerContainer) return;
    
    // Nettoyer le contenu précédent
    answerContainer.innerHTML = '';
    if (hintContainer) hintContainer.innerHTML = '';
    
    // Créer l'interface selon le type
    switch (questionType) {
      case 'input':
        this.createInputInterface();
        break;
      
      case 'qcm':
        this.createQCMInterface(questionData);
        break;
      
      case 'vrai-faux':
        this.createVraiFauxInterface();
        break;
      
      case 'ordre':
        this.createOrdreInterface(questionData);
        break;
      
      case 'association':
        this.createAssociationInterface(questionData);
        break;
      
      case 'glisser-deposer':
        this.createGlisserDeposerInterface(questionData);
        break;
      
      case 'remplir-blancs':
        this.createRemplirBlancsInterface(questionData);
        break;
      
      case 'map-click':
        this.createMapClickInterface(questionData);
        break;
      
      case 'timeline':
        this.createTimelineInterface(questionData);
        break;
    }
    
    // Ajouter le bouton hint
    this.createHintButton();
  }
  
  // ==========================================
  // INTERFACE: INPUT
  // ==========================================
  
  createInputInterface() {
    // Récupérer la réponse pour connaître la longueur
    const questionData = this.getCurrentQuestionData();
    const answer = questionData?.answer || '';
    // Normaliser la réponse pour avoir la vraie longueur (œ → oe = 2 lettres)
    const normalizedAnswer = this.normalizeAnswer(String(answer));
    const answerLength = normalizedAnswer.length;
    
    // Créer les letter boxes
    let letterBoxesHtml = '';
    for (let i = 0; i < answerLength; i++) {
      letterBoxesHtml += '<div class="letter-box" data-index="' + i + '">?</div>';
    }
    
    const html = `
      <div class="word-input-container">
        <!-- Input caché pour mobile -->
        <input 
          type="text" 
          id="mobileInputAnswer" 
          class="mobile-input-answer" 
          autocomplete="off"
          autocorrect="off"
          autocapitalize="off"
          spellcheck="false"
          maxlength="${answerLength}"
          placeholder="Tape ici..."
        />
        
        <!-- Letter boxes -->
        <div class="word-display-answer" id="wordDisplayAnswer">
          ${letterBoxesHtml}
        </div>
      </div>
    `;
    
    answerContainer.innerHTML = html;
  }
  
  getCurrentQuestionData() {
    // Cette méthode sera appelée depuis game.js
    // Pour l'instant, on retourne null, game.js devra la setter
    return window.currentQuestionDataForUI || null;
  }
  
  normalizeAnswer(str) {
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
  
  // ==========================================
  // INTERFACE: QCM
  // ==========================================
  
  createQCMInterface(questionData) {
    const options = questionData.options || [];
    const answerContainer = document.getElementById('answerContainer');
    
    const html = `
      <div class="qcm-container">
        ${options.map(option => `
          <button class="option-btn" data-answer="${this.escapeHtml(option)}">
            ${this.escapeHtml(option)}
          </button>
        `).join('')}
      </div>
    `;
    
    answerContainer.innerHTML = html;
  }
  
  // ==========================================
  // INTERFACE: VRAI-FAUX
  // ==========================================
  
  createVraiFauxInterface() {
    const html = `
      <div class="vrai-faux-container">
        <button id="trueFalseTrue" class="true-false-btn true-btn">
          ✓ Vrai
        </button>
        <button id="trueFalseFalse" class="true-false-btn false-btn">
          ✗ Faux
        </button>
      </div>
    `;
    
    answerContainer.innerHTML = html;
  }
  
  // ==========================================
  // INTERFACE: ORDRE
  // ==========================================
  
  createOrdreInterface(questionData) {
    const items = questionData.shuffledItems || [];
    const answerContainer = document.getElementById('answerContainer');
    
    const html = `
      <div class="ordre-instructions">
        Glisse les éléments pour les mettre dans le bon ordre
      </div>
      <div id="ordreContainer" class="ordre-container">
        ${items.map(item => `
          <div class="ordre-item" data-original-index="${item.originalIndex}" draggable="true">
            <span class="drag-handle">⋮⋮</span>
            <span class="ordre-text">${this.escapeHtml(item.text)}</span>
          </div>
        `).join('')}
      </div>
      <button id="submitOrdre" class="submit-btn">✓ Valider l'ordre</button>
    `;
    
    answerContainer.innerHTML = html;
  }
  
  // ==========================================
  // INTERFACE: ASSOCIATION
  // ==========================================
  
  createAssociationInterface(questionData) {
    // Pour les questions d'association, utiliser les données mélangées dans options
    const options = questionData.options || questionData.answer || { left: [], right: [] };
    const answerContainer = document.getElementById('answerContainer');
    
    const html = `
      <div class="association-instructions">
        Clique sur un élément de gauche, puis sur son correspondant à droite
      </div>
      <div class="association-container">
        <div class="association-column association-left">
          ${options.left.map(item => `
            <div class="association-item" data-value="${this.escapeHtml(item)}">
              ${this.escapeHtml(item)}
            </div>
          `).join('')}
        </div>
        
        <svg class="association-lines" id="associationSVG"></svg>
        
        <div class="association-column association-right">
          ${options.right.map(item => `
            <div class="association-item" data-value="${this.escapeHtml(item)}">
              ${this.escapeHtml(item)}
            </div>
          `).join('')}
        </div>
      </div>
      <button id="submitAssociation" class="submit-btn">✓ Valider les associations</button>
    `;
    
    answerContainer.innerHTML = html;
  }
  
  drawAssociationLine(leftValue, rightValue) {
    const svg = document.getElementById('associationSVG');
    if (!svg) return;
    
    const leftItem = document.querySelector(`.association-left .association-item[data-value="${leftValue}"]`);
    const rightItem = document.querySelector(`.association-right .association-item[data-value="${rightValue}"]`);
    
    if (!leftItem || !rightItem) return;
    
    const svgRect = svg.getBoundingClientRect();
    const leftRect = leftItem.getBoundingClientRect();
    const rightRect = rightItem.getBoundingClientRect();
    
    const x1 = leftRect.right - svgRect.left;
    const y1 = leftRect.top + leftRect.height / 2 - svgRect.top;
    const x2 = rightRect.left - svgRect.left;
    const y2 = rightRect.top + rightRect.height / 2 - svgRect.top;
    
    const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
    line.setAttribute('x1', x1);
    line.setAttribute('y1', y1);
    line.setAttribute('x2', x2);
    line.setAttribute('y2', y2);
    line.setAttribute('class', 'association-line');
    line.setAttribute('data-left', leftValue);
    line.setAttribute('data-right', rightValue);
    
    svg.appendChild(line);
    
    // Marquer les items comme connectés
    leftItem.classList.add('connected');
    rightItem.classList.add('connected');
  }
  
  // ==========================================
  // INTERFACE: GLISSER-DÉPOSER
  // ==========================================
  
  createGlisserDeposerInterface(questionData) {
    const options = questionData.options || { categories: [], items: [] };
    const answerContainer = document.getElementById('answerContainer');
    
    const html = `
      <div class="glisser-instructions">
        Glisse chaque élément dans la bonne catégorie
      </div>
      <div class="glisser-container">
        <div class="items-pool drop-zone" data-category="pool">
          <h4>Éléments à classer :</h4>
          ${options.items.map(item => `
            <div class="draggable-item" data-value="${this.escapeHtml(item)}" draggable="true">
              ${this.escapeHtml(item)}
            </div>
          `).join('')}
        </div>
        
        <div class="categories-zones">
          ${options.categories.map(category => `
            <div class="category-zone">
              <h4>${this.escapeHtml(category)}</h4>
              <div class="drop-zone" data-category="${this.escapeHtml(category)}">
                <!-- Les éléments seront déposés ici -->
              </div>
            </div>
          `).join('')}
        </div>
      </div>
      <button id="submitGlisser" class="submit-btn">✓ Valider</button>
    `;
    
    answerContainer.innerHTML = html;
  }
  
  // ==========================================
  // INTERFACE: REMPLIR-BLANCS
  // ==========================================
  
  createRemplirBlancsInterface(questionData) {
    const questionText = questionData.question || '';
    const parts = questionText.split('___');
    const answerContainer = document.getElementById('answerContainer');
    
    // Récupérer la longueur de la réponse pour les letter-boxes
    const answer = questionData?.answer || '';
    const normalizedAnswer = this.normalizeAnswer(String(answer));
    const answerLength = normalizedAnswer.length;
    
    // Créer les letter boxes pour le blanc
    let letterBoxesHtml = '';
    for (let i = 0; i < answerLength; i++) {
      letterBoxesHtml += `<div class="letter-box" data-index="${i}">?</div>`;
    }
    
    let html = '<div class="blanks-container">';
    
    parts.forEach((part, index) => {
      html += `<span class="blanks-text">${this.escapeHtml(part)}</span>`;
      if (index < parts.length - 1) {
        // Ajouter les letter boxes au lieu d'un input
        html += `
          <div class="blanks-word-display">
            <input 
              type="text" 
              id="mobileInputBlanks" 
              class="mobile-input-answer" 
              autocomplete="off"
              autocorrect="off"
              autocapitalize="off"
              spellcheck="false"
              maxlength="${answerLength}"
              placeholder="Tape ici..."
            />
            <div class="word-display-blanks" id="wordDisplayBlanks">
              ${letterBoxesHtml}
            </div>
          </div>
        `;
      }
    });
    
    html += '</div>';
    
    answerContainer.innerHTML = html;
  }
  
  // ==========================================
  // INTERFACE: MAP-CLICK (Carte interactive)
  // ==========================================
  
  createMapClickInterface(questionData) {
    const answerContainer = document.getElementById('answerContainer');
    if (!answerContainer) return;
    
    // questionData.options devrait contenir :
    // Nouveau format : { imageUrl: "...", zones: [...] }
    // Ancien format : { mapKey: "europe", zones: [...] } ou directement le mapKey
    const mapData = questionData.options || {};
    
    let html = '';
    let zones = [];
    
    // Vérifier si c'est une image uploadée (nouveau format)
    if (mapData.imageUrl && mapData.zones) {
      console.log('🗺️ Map-click avec image uploadée:', mapData.imageUrl);
      console.log('🎯 Mode de validation:', mapData.validationMode || 'any (défaut)');
      console.log('📍 Nombre de zones:', mapData.zones.length);
      zones = mapData.zones;
      
      // Créer un SVG avec l'image et les zones clicables
      const zonesPolygons = zones.map(zone => {
        const points = zone.points.map(p => {
          const x = Math.round(p.x * 100) / 100; // Arrondir à 2 décimales
          const y = Math.round(p.y * 100) / 100;
          return `${x},${y}`; // Pas de % car on utilise viewBox="0 0 100 100"
        }).join(' ');
        return `<polygon class="map-zone" data-zone="${zone.id}" points="${points}" />`;
      }).join('');
      
      html = `
        <div class="map-click-container">
          <div class="map-wrapper" id="mapWrapper">
            <div class="map-svg-container" id="mapSvgContainer">
              <svg viewBox="0 0 100 100" preserveAspectRatio="xMidYMid meet" xmlns="http://www.w3.org/2000/svg" style="width: 100%; height: 100%;">
                <image href="${mapData.imageUrl}" x="0" y="0" width="100" height="100" />
                <g class="zones-overlay">
                  ${zonesPolygons}
                </g>
              </svg>
            </div>
            <div class="map-click-marker hidden" id="mapMarker">📍</div>
          </div>
          <div class="map-instruction">
            👆 Clique sur la carte pour répondre
          </div>
        </div>
      `;
    } else {
      // Ancien format avec mapKey (fallback)
      console.log('🗺️ Map-click avec SVG en dur');
      const mapKey = typeof mapData === 'string' ? mapData : (mapData.mapKey || 'europe');
      const mapSvg = typeof getMapSvg === 'function' ? getMapSvg(mapKey) : '';
      zones = typeof getMapZones === 'function' ? getMapZones(mapKey) : [];
      
      html = `
        <div class="map-click-container">
          <div class="map-wrapper" id="mapWrapper">
            <div class="map-svg-container" id="mapSvgContainer">
              ${mapSvg}
            </div>
            <div class="map-click-marker hidden" id="mapMarker">📍</div>
          </div>
          <div class="map-instruction">
            👆 Clique sur la carte pour répondre
          </div>
        </div>
      `;
    }
    
    answerContainer.innerHTML = html;
    
    // Stocker les zones et le mode de validation pour l'input handler
    const mapWrapper = document.getElementById('mapWrapper');
    if (mapWrapper) {
      mapWrapper.dataset.zones = JSON.stringify(zones);
      mapWrapper.dataset.validationMode = mapData.validationMode || 'any';
    }
  }
  
  // ==========================================
  // INTERFACE: TIMELINE (Ligne du temps visuelle)
  // ==========================================
  
  createTimelineInterface(questionData) {
    const answerContainer = document.getElementById('answerContainer');
    if (!answerContainer) return;
    
    // questionData.options devrait contenir les événements mélangés
    const events = questionData.options || [];
    
    let html = `
      <div class="timeline-container">
        <div class="timeline-instruction">
          📅 Glisse les événements sur la ligne du temps dans le bon ordre
        </div>
        
        <!-- Pool d'événements à placer -->
        <div class="timeline-pool" id="timelinePool">
          ${events.map((event, index) => `
            <div class="timeline-event-card" draggable="true" data-event-id="${event.id || index}">
              <div class="event-emoji">${event.emoji || '📌'}</div>
              <div class="event-text">${this.escapeHtml(event.text)}</div>
            </div>
          `).join('')}
        </div>
        
        <!-- Ligne du temps avec slots -->
        <div class="timeline-line-wrapper">
          <div class="timeline-line">
            <div class="timeline-arrow">→</div>
          </div>
          <div class="timeline-slots" id="timelineSlots">
            ${events.map((_, index) => `
              <div class="timeline-slot" data-position="${index}">
                <div class="slot-number">${index + 1}</div>
                <div class="slot-drop-zone" data-slot-index="${index}">
                  Glisse ici
                </div>
              </div>
            `).join('')}
          </div>
        </div>
        
        <button id="submitTimeline" class="submit-btn">✓ Valider l'ordre</button>
      </div>
    `;
    
    answerContainer.innerHTML = html;
  }
  
  // ==========================================
  // HINT BUTTON
  // ==========================================
  
  createHintButton() {
    const hintContainer = document.getElementById('hintContainer');
    if (!hintContainer) return;
    
    const html = `
      <button id="hintBtn" class="hint-btn">
        💡 Besoin d'aide ?
      </button>
      <div id="hintsContainer" class="hints-container"></div>
    `;
    
    hintContainer.innerHTML = html;
  }
  
  displayHint(hintText, hintNumber = 1, maxHints = 1) {
    // Cacher le loader du bouton
    this.hideHintLoader();
    
    const hintsContainer = document.getElementById('hintsContainer');
    
    if (hintsContainer) {
      // Créer un nouveau div pour ce hint
      const hintDiv = document.createElement('div');
      hintDiv.className = 'hint-display';
      hintDiv.innerHTML = `
        <div class="hint-number">Indice ${hintNumber}/${maxHints}</div>
        <div class="hint-content">
          <div class="hint-text">${hintText}</div>
          <button class="hint-speak-btn" title="Lire à haute voix">
            🔊
          </button>
        </div>
      `;
      
      // Attacher l'event listener au bouton de lecture avec le texte stocké
      const speakBtn = hintDiv.querySelector('.hint-speak-btn');
      if (speakBtn) {
        speakBtn.addEventListener('click', () => {
          if (window.aiHintService) {
            window.aiHintService.speakText(hintText);
          }
        });
      }
      
      // Ajouter avec animation
      hintsContainer.appendChild(hintDiv);
      
      // Animer l'apparition
      setTimeout(() => {
        hintDiv.classList.add('visible');
      }, 10);
    }
  }
  
  showHintLoader() {
    const hintBtn = document.getElementById('hintBtn');
    if (hintBtn) {
      // Désactiver le bouton
      hintBtn.disabled = true;
      
      // Sauvegarder le texte original
      const originalText = hintBtn.innerHTML;
      hintBtn.setAttribute('data-original-text', originalText);
      
      // Afficher le spinner
      hintBtn.innerHTML = `
        <span class="hint-btn-loader"></span>
        Réflexion...
      `;
      hintBtn.classList.add('loading');
    }
  }
  
  hideHintLoader() {
    const hintBtn = document.getElementById('hintBtn');
    if (hintBtn && hintBtn.classList.contains('loading')) {
      // Restaurer le texte original
      const originalText = hintBtn.getAttribute('data-original-text');
      if (originalText) {
        hintBtn.innerHTML = originalText;
      }
      hintBtn.classList.remove('loading');
      hintBtn.disabled = false;
    }
  }
  
  // ==========================================
  // FEEDBACK
  // ==========================================
  
  showFeedback(message, type = 'info') {
    const feedback = document.getElementById('feedback');
    if (!feedback) return;
    
    feedback.textContent = message;
    feedback.className = `feedback feedback-${type}`;
    feedback.classList.remove('hidden');
  }
  
  hideFeedback() {
    const feedback = document.getElementById('feedback');
    if (feedback) {
      feedback.classList.add('hidden');
    }
  }
  
  
  // ==========================================
  // ANIMATIONS
  // ==========================================
  
  createCelebration() {
    const celebration = document.createElement('div');
    celebration.className = 'celebration';
    celebration.innerHTML = `
      <div class="celebration-content">
        <div class="celebration-emoji">🎉🏆🎊</div>
        <h2>FÉLICITATIONS !</h2>
        <p>Tu as terminé toutes les questions !</p>
        <p class="celebration-subtitle">Tu es un champion de culture ! 👑</p>
      </div>
    `;
    
    document.body.appendChild(celebration);
    
    // Créer des confettis
    this.createConfetti();
    
    // Retirer après 5 secondes
    setTimeout(() => {
      celebration.remove();
    }, 5000);
  }
  
  createCategoryCompletionCelebration(icon, categoryName, encouragement) {
    const celebration = document.createElement('div');
    celebration.className = 'celebration category-celebration';
    celebration.innerHTML = `
      <div class="celebration-content">
        <div class="celebration-emoji">${icon} ✨</div>
        <h2>BRAVO !</h2>
        <p>Catégorie <strong>${categoryName}</strong> terminée !</p>
        <p class="celebration-subtitle">${encouragement}</p>
      </div>
    `;
    
    document.body.appendChild(celebration);
    
    this.createConfetti();
    
    setTimeout(() => {
      celebration.remove();
    }, 4000);
  }
  
  createConfetti() {
    const colors = ['#ff0000', '#00ff00', '#0000ff', '#ffff00', '#ff00ff', '#00ffff'];
    const confettiCount = 50;
    
    for (let i = 0; i < confettiCount; i++) {
      const confetti = document.createElement('div');
      confetti.className = 'confetti';
      confetti.style.left = Math.random() * 100 + '%';
      confetti.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
      confetti.style.animationDelay = Math.random() * 3 + 's';
      confetti.style.animationDuration = Math.random() * 3 + 2 + 's';
      
      document.body.appendChild(confetti);
      
      setTimeout(() => confetti.remove(), 5000);
    }
  }
  
  // ==========================================
  // UTILITAIRES
  // ==========================================
  
  escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  }
  
  showLoader(message = 'Chargement...') {
    const loader = document.createElement('div');
    loader.id = 'globalLoader';
    loader.className = 'global-loader';
    loader.innerHTML = `
      <div class="loader-content">
        <div class="spinner"></div>
        <p>${message}</p>
      </div>
    `;
    
    document.body.appendChild(loader);
  }
  
  hideLoader() {
    const loader = document.getElementById('globalLoader');
    if (loader) {
      loader.remove();
    }
  }
}

// ==========================================
// FONCTION GLOBALE POUR LA LECTURE VOCALE
// ==========================================

// Note: Les boutons de lecture vocale utilisent maintenant des event listeners
// attachés directement dans displayHint(), donc plus besoin de fonction globale
