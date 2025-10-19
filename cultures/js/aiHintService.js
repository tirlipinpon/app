// ============================================
// AI HINT SERVICE - Génération d'indices par IA
// ============================================

class AIHintService {
  constructor(supabaseService) {
    this.cache = new Map(); // Cache des hints générés
    this.usedHints = new Set(); // Hints déjà utilisés dans cette session
    this.isLoading = false;
    this.supabaseService = supabaseService;
  }
  
  // ==========================================
  // GÉNÉRATION DE HINTS
  // ==========================================
  
  async generateHint(questionData, hintNumber = 1) {
    const questionId = questionData.id;
    const hintKey = `${questionId}_${hintNumber}`;
    
    // Pour les questions INPUT : 3 hints autorisés
    // Pour les autres types : 2 hints
    const maxHints = questionData.type === 'input' || questionData.type === 'remplir-blancs'
      ? (CONFIG.HINT_SYSTEM?.maxHintsInput || 3)
      : (CONFIG.HINT_SYSTEM?.maxHintsOther || 2);
    
    // Vérifier si tous les hints ont été utilisés
    let usedCount = 0;
    for (let i = 1; i <= maxHints; i++) {
      if (this.usedHints.has(`${questionId}_${i}`)) {
        usedCount++;
      }
    }
    
    if (usedCount >= maxHints) {
      console.log(`⚠️ Tous les hints utilisés pour cette question (${usedCount}/${maxHints})`);
      return null;
    }
    
    // Vérifier si hint existe déjà dans la question (DB) - seulement hint 1
    if (hintNumber === 1 && questionData.hint) {
      console.log(`💾 Hint 1 trouvé dans la DB: ${questionData.hint}`);
      this.usedHints.add(hintKey);
      return questionData.hint;
    }
    
    // Vérifier le cache local
    if (this.cache.has(hintKey)) {
      console.log(`💾 Hint ${hintNumber} trouvé dans le cache local`);
      const hint = this.cache.get(hintKey);
      this.usedHints.add(hintKey);
      return hint;
    }
    
    // Vérifier si l'API est configurée
    if (!isApiKeyConfigured()) {
      console.warn('⚠️ API IA non configurée');
      return this.getFallbackHint(questionData, hintNumber);
    }
    
    // Générer avec l'IA
    try {
      console.log(`🤖 Génération du hint ${hintNumber} par IA pour: ${questionId}`);
      const messages = this.createMessagesArray(questionData, hintNumber);
      console.log(`📚 Historique des messages (${messages.length} messages):`, messages);
      const hint = await this.callDeepSeekAPI(messages);
      
      if (hint) {
        // Mettre en cache
        this.cache.set(hintKey, hint);
        this.usedHints.add(hintKey);
        
        // Sauvegarder dans Supabase (seulement hint 1)
        if (hintNumber === 1 && this.supabaseService && this.supabaseService.isReady()) {
          await this.supabaseService.saveHint(questionId, hint);
        }
        
        console.log(`✅ Hint ${hintNumber} généré et sauvegardé`);
        return hint;
      }
    } catch (error) {
      console.error('❌ Erreur génération hint:', error);
    }
    
    // Fallback si échec
    return this.getFallbackHint(questionData, hintNumber);
  }
  
  // ==========================================
  // SYNTHÈSE VOCALE
  // ==========================================
  
  speakText(text) {
    if ('speechSynthesis' in window) {
      // Arrêter toute lecture en cours
      window.speechSynthesis.cancel();
      
      // Filtrer les emojis pour la lecture vocale
      const textWithoutEmojis = this.removeEmojisFromText(text);
      
      const utterance = new SpeechSynthesisUtterance(textWithoutEmojis);
      
      // Configuration pour les enfants
      utterance.rate = 0.8; // Plus lent pour les enfants
      utterance.pitch = 1.2; // Plus aigu et amical
      utterance.volume = 0.8;
      
      // Essayer d'utiliser une voix française
      const voices = window.speechSynthesis.getVoices();
      const frenchVoice = voices.find(voice => 
        voice.lang.includes('fr') || voice.lang.includes('FR')
      );
      
      if (frenchVoice) {
        utterance.voice = frenchVoice;
      }
      
      // Lancer la lecture
      window.speechSynthesis.speak(utterance);
      
      console.log('🔊 Lecture vocale lancée (sans emojis):', textWithoutEmojis);
      console.log('📝 Texte original avec emojis:', text);
    } else {
      console.warn('⚠️ Synthèse vocale non supportée par ce navigateur');
    }
  }
  
  // Fonction pour supprimer les emojis du texte pour la lecture vocale
  removeEmojisFromText(text) {
    // Regex pour détecter les emojis (caractères Unicode emoji)
    const emojiRegex = /[\u{1F600}-\u{1F64F}]|[\u{1F300}-\u{1F5FF}]|[\u{1F680}-\u{1F6FF}]|[\u{1F1E0}-\u{1F1FF}]|[\u{2600}-\u{26FF}]|[\u{2700}-\u{27BF}]|[\u{1F900}-\u{1F9FF}]|[\u{1F018}-\u{1F270}]/gu;
    
    // Remplacer les emojis par des espaces et nettoyer les espaces multiples
    return text.replace(emojiRegex, ' ').replace(/\s+/g, ' ').trim();
  }
  
  stopSpeaking() {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      console.log('🔇 Lecture vocale arrêtée');
    }
  }

  // ==========================================
  // HISTORIQUE DES HINTS
  // ==========================================
  
  getHintHistory(questionId, currentHintNumber) {
    if (currentHintNumber === 1) {
      return ''; // Pas d'historique pour le premier hint
    }
    
    let historyText = '';
    const questionKey = questionId.split('_')[0]; // Extraire la partie commune de l'ID
    
    // Récupérer les hints précédents depuis le cache
    for (let i = 1; i < currentHintNumber; i++) {
      const previousHintKey = `${questionId}_hint_${i}`;
      const previousHint = this.cache.get(previousHintKey);
      
      if (previousHint) {
        historyText += `💡 INDICE ${i} DÉJÀ DONNÉ : "${previousHint}"\n`;
      } else if (i === 1 && this.supabaseService && this.supabaseService.isReady()) {
        // Pour le hint 1, vérifier aussi dans la DB
        // On pourrait ajouter une méthode pour récupérer le hint depuis la DB
        historyText += `💡 INDICE ${i} DÉJÀ DONNÉ : (récupéré depuis la base de données)\n`;
      }
    }
    
    if (historyText) {
      return `📚 CONTEXTE DES INDICES PRÉCÉDENTS :\n${historyText}\nIMPORTANT : Le nouvel indice doit être PLUS PRÉCIS que les précédents, sans répéter les mêmes informations.\n`;
    }
    
    return '';
  }

  // ==========================================
  // CRÉATION DES MESSAGES AVEC HISTORIQUE
  // ==========================================
  
  createMessagesArray(questionData, hintNumber = 1) {
    const questionId = questionData.id;
    const messages = [];
    
    // Message système initial
    messages.push({
      role: 'system',
      content: `Tu es un assistant pédagogique pour des ENFANTS de 8 ans qui jouent à un jeu éducatif.

RÈGLES ABSOLUES :
- Tu dois donner des indices progressifs SANS JAMAIS donner la réponse complète
- L'enfant doit TOUJOURS faire un effort mental
- Tu peux donner maximum 2-3 lettres au 3ème hint seulement
- Au 1er hint : orientation générale seulement
- Au 2ème hint : plus précis mais PAS de lettres
- Au 3ème hint : 2-3 lettres maximum

🎨 UTILISE DES EMOJIS :
- Commence TOUJOURS par "💡" pour les indices
- Ajoute des emojis pertinents pour illustrer tes propos
- Exemples : 🌍 pour géographie, 🏛️ pour histoire, 🔬 pour science, 🎭 pour culture
- Utilise des emojis pour rendre l'indice plus visuel et attrayant

INTERDICTION TOTALE : Ne donne JAMAIS la réponse complète, même partiellement !`
    });
    
    // Message initial avec la question
    messages.push({
      role: 'user',
      content: this.createInitialQuestionMessage(questionData)
    });
    
    // Ajouter l'historique des hints précédents
    for (let i = 1; i < hintNumber; i++) {
      const previousHintKey = `${questionId}_hint_${i}`;
      const previousHint = this.cache.get(previousHintKey);
      
      if (previousHint) {
        // Ajouter le hint précédent comme message assistant
        messages.push({
          role: 'assistant',
          content: previousHint
        });
        
        // Ajouter un message utilisateur pour le contexte avec la réponse précédente
        messages.push({
          role: 'user',
          content: `L'enfant a besoin d'un indice plus précis maintenant. 
          
INDICE PRÉCÉDENT : "${previousHint}"

IMPORTANT : 
- Ne répète PAS les mêmes informations que l'indice précédent
- Sois PLUS PRÉCIS mais ne donne JAMAIS la réponse complète
- L'enfant doit encore réfléchir, ne fais pas le travail à sa place`
        });
      }
    }
    
    // Message final pour le hint actuel
    messages.push({
      role: 'user',
      content: this.createCurrentHintRequest(questionData, hintNumber)
    });
    
    return messages;
  }
  
  createInitialQuestionMessage(questionData) {
    const question = questionData.question;
    const answer = questionData.answer;
    const type = questionData.type;
    const category = this.getCategoryName(questionData.category);
    const options = questionData.options;
    
    let typeDescription = '';
    switch (type) {
      case 'input': typeDescription = 'une question à réponse libre'; break;
      case 'qcm': typeDescription = 'un QCM (choix multiple)'; break;
      case 'vrai-faux': typeDescription = 'une question vrai ou faux'; break;
      case 'ordre': typeDescription = 'une question d\'ordre chronologique'; break;
      case 'association': typeDescription = 'une question d\'association'; break;
      case 'glisser-deposer': typeDescription = 'une question de catégorisation'; break;
      case 'remplir-blancs': typeDescription = 'une question à trous'; break;
    }
    
    let answerText = '';
    if (typeof answer === 'object' && !Array.isArray(answer)) {
      answerText = JSON.stringify(answer);
    } else if (Array.isArray(answer)) {
      answerText = answer.join(', ');
    } else {
      answerText = String(answer);
    }
    
    let optionsText = '';
    if (options && type === 'qcm') {
      optionsText = `\n- Options disponibles : ${options.join(', ')}`;
    }
    
    return `📝 QUESTION : "${question}"${optionsText}
✅ RÉPONSE CORRECTE : ${answerText}
🎯 Type : ${typeDescription}
📚 Catégorie : ${category}

Je vais avoir besoin d'indices progressifs pour cette question.`;
  }
  
  createCurrentHintRequest(questionData, hintNumber) {
    if (hintNumber === 1) {
      return `Donne le PREMIER INDICE (subtil) pour cette question. Il doit orienter l'enfant sans révéler la réponse. Maximum 25 mots.

⚠️ INTERDICTIONS STRICTES :
- Ne donne JAMAIS la réponse complète
- Ne donne JAMAIS plus de 2-3 lettres
- L'enfant doit encore réfléchir beaucoup

🎨 UTILISE DES EMOJIS :
- Commence par "💡" et ajoute des emojis pertinents
- Exemples : 🌍🏛️🔬🎭 pour illustrer tes propos`;
    } else if (hintNumber === 2) {
      return `Donne le DEUXIÈME INDICE (plus précis). L'enfant a déjà eu le premier indice, il a besoin de plus de précision. Maximum 30 mots.

⚠️ INTERDICTIONS STRICTES :
- Ne donne JAMAIS la réponse complète (même partiellement)
- Tu peux donner 1-2 lettres maximum
- L'enfant doit encore faire un effort mental
- Ne fais PAS le travail à sa place

🎨 UTILISE DES EMOJIS :
- Commence par "💡" et ajoute des emojis pertinents
- Exemples : 🌍🏛️🔬🎭 pour illustrer tes propos`;
    } else {
      return `Donne le TROISIÈME INDICE (très direct). C'est le dernier indice, l'enfant a vraiment besoin d'aide maintenant. Tu peux donner les 2-3 premières lettres. Maximum 35 mots.

⚠️ DERNIÈRE CHANCE :
- Tu peux donner 2-3 lettres maximum
- Ne donne JAMAIS la réponse complète
- L'enfant doit encore deviner la fin

🎨 UTILISE DES EMOJIS :
- Commence par "💡" et ajoute des emojis pertinents
- Exemples : 🌍🏛️🔬🎭 pour illustrer tes propos`;
    }
  }

  // ==========================================
  // CRÉATION DU PROMPT (ANCIENNE MÉTHODE - GARDÉE POUR COMPATIBILITÉ)
  // ==========================================
  
  createPrompt(questionData, hintNumber = 1) {
    const question = questionData.question;
    const answer = questionData.answer;
    const type = questionData.type;
    const category = this.getCategoryName(questionData.category);
    const options = questionData.options;
    const questionId = questionData.id;
    
    // Récupérer l'historique des hints précédents pour cette question
    const hintHistory = this.getHintHistory(questionId, hintNumber);
    
    let typeDescription = '';
    switch (type) {
      case 'input':
        typeDescription = 'une question à réponse libre';
        break;
      case 'qcm':
        typeDescription = 'un QCM (choix multiple)';
        break;
      case 'vrai-faux':
        typeDescription = 'une question vrai ou faux';
        break;
      case 'ordre':
        typeDescription = 'une question d\'ordre chronologique';
        break;
      case 'association':
        typeDescription = 'une question d\'association';
        break;
      case 'glisser-deposer':
        typeDescription = 'une question de catégorisation';
        break;
      case 'remplir-blancs':
        typeDescription = 'une question à trous';
        break;
    }
    
    // Formater la réponse selon le type
    let answerText = '';
    if (typeof answer === 'object' && !Array.isArray(answer)) {
      answerText = JSON.stringify(answer);
    } else if (Array.isArray(answer)) {
      answerText = answer.join(', ');
    } else {
      answerText = String(answer);
    }
    
    // Formater les options si présentes
    let optionsText = '';
    if (options && type === 'qcm') {
      optionsText = `\n- Options disponibles : ${options.join(', ')}`;
    }
    
    // Prompt progressif selon le numéro du hint
    let hintInstruction = '';
    if (hintNumber === 1) {
      hintInstruction = `
📍 INDICE 1 (SUBTIL - ANALYSE DE BASE) :
- ANALYSE d'abord la question : quel est le vrai objectif pédagogique ?
- Donne un indice GÉNÉRAL qui oriente vers la bonne réponse
- Utilise des ASSOCIATIONS d'idées, des CONTEXTES, ou des CARACTÉRISTIQUES
- NE mentionne PAS directement la réponse
- Sois ENCOURAGEANT et PÉDAGOGIQUE
- Maximum 25 mots`;
    } else if (hintNumber === 2) {
      hintInstruction = `
📍 INDICE 2 (PRÉCIS - ANALYSE APPROFONDIE) :
- ANALYSE PLUS PROFONDE : que cherche vraiment cette question ?
- L'enfant a déjà eu un premier indice, il a besoin de BEAUCOUP PLUS DE PRÉCISION
- Donne des DÉTAILS CONCRETS qui permettent VRAIMENT de trouver
- Tu peux mentionner des ÉLÉMENTS CLÉS de la réponse (premières lettres, dates, lieux, etc.)
- Reste ENCOURAGEANT mais sois BEAUCOUP PLUS EXPLICITE
- Maximum 30 mots`;
    } else {
      hintInstruction = `
📍 INDICE 3 (TRÈS DIRECT - ANALYSE COMPLÈTE) :
- ANALYSE COMPLÈTE : l'enfant a vraiment besoin d'aide maintenant !
- Sois TRÈS EXPLICITE : donne la première lettre ou les 2-3 premières lettres
- Mentionne des FAITS PRÉCIS qui mènent DIRECTEMENT à la réponse
- Donne presque la réponse, mais pas complètement
- Maximum 35 mots`;
    }
    
    return `Tu es un assistant pédagogique pour des ENFANTS de 8 ans qui jouent à un jeu éducatif.

📝 QUESTION : "${question}"${optionsText}
✅ RÉPONSE CORRECTE : ${answerText}
🎯 Type : ${typeDescription}
📚 Catégorie : ${category}

${hintHistory}

${hintInstruction}

🎨 STRATÉGIES D'INDICES EFFICACES (ANALYSE REQUISE) :

🧠 MÉTHODE D'ANALYSE OBLIGATOIRE :
1. ANALYSE la question : quel concept l'enfant doit-il maîtriser ?
2. ANALYSE la réponse : quels éléments clés permettent de la trouver ?
3. ANALYSE la progression : comment aider sans donner la réponse ?

Pour un QCM :
- Indice 1 : "💡 ANALYSE les options ! Quelle est la logique de cette question ?"
- Indice 2 : "💡 La réponse est '${answerText.charAt(0)}...' et c'est lié à [contexte précis]"

Pour une question à réponse libre (input) :
- Indice 1 : "💡 ANALYSE : c'est [catégorie générale] connu pour [caractéristique]"
- Indice 2 : "💡 ANALYSE PLUS PROFONDE : c'est lié à [contexte précis] et commence par '${answerText.substring(0, 2)}'"
- Indice 3 : "💡 ANALYSE COMPLÈTE : c'est '${answerText.substring(0, 3)}...' [caractéristique unique]"

Pour Vrai/Faux :
- Indice 1 : "💡 ANALYSE : réfléchis aux faits historiques/scientifiques"
- Indice 2 : "💡 ANALYSE APPROFONDIE : [élément factuel précis qui permet de trancher]"

Pour ordre chronologique :
- Indice 1 : "💡 ANALYSE : quel événement vient chronologiquement EN PREMIER ?"
- Indice 2 : "💡 ANALYSE PRÉCISE : [ordre logique avec éléments clés]"

Pour association :
- Indice 1 : "💡 ANALYSE les liens logiques entre les éléments !"
- Indice 2 : "💡 ANALYSE PLUS PRÉCISE : [connexions spécifiques entre les paires]"

RÈGLES ABSOLUES :
✅ Commence TOUJOURS par "💡"
✅ ANALYSE OBLIGATOIRE : comprends d'abord la question avant de répondre
✅ PROGRESSION LOGIQUE : chaque hint doit être PLUS PERTINENT que le précédent
✅ Langage SIMPLE pour un enfant de 8 ans
✅ Ton ENCOURAGEANT ("Tu peux y arriver !", "C'est ça !", "Bien réfléchi !")
❌ NE DONNE JAMAIS la réponse complète mot pour mot
✅ Donne des INDICES CONCRETS et VRAIMENT UTILES
✅ PENSE COMME UN ENSEIGNANT : quel est le meilleur chemin pour faire comprendre ?

TON INDICE (adapté à un enfant de 8 ans) :`;
  }
  
  // ==========================================
  // APPEL API DEEPSEEK
  // ==========================================
  
  async callDeepSeekAPI(messages, retryCount = 0) {
    try {
      const response = await fetch(CONFIG.DEEPSEEK_API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${CONFIG.DEEPSEEK_API_KEY}`
        },
        body: JSON.stringify({
          model: CONFIG.DEEPSEEK_MODEL,
          messages: messages, // Utiliser l'array de messages avec historique
          temperature: CONFIG.AI_HINT_CONFIG.temperature,
          max_tokens: CONFIG.AI_HINT_CONFIG.max_tokens,
          top_p: CONFIG.AI_HINT_CONFIG.top_p
        })
      });
      
      if (!response.ok) {
        throw new Error(`Erreur API: ${response.status} ${response.statusText}`);
      }
      
      const data = await response.json();
      
      if (data.choices && data.choices[0] && data.choices[0].message) {
        const hint = data.choices[0].message.content.trim();
        console.log('✅ Hint reçu de l\'IA:', hint);
        return hint;
      }
      
      return null;
    } catch (error) {
      console.error('❌ Erreur lors de l\'appel API:', error);
      
      // Retry une fois
      if (retryCount === 0) {
        console.log('🔄 Nouvelle tentative...');
        await new Promise(resolve => setTimeout(resolve, 1000));
        return this.callDeepSeekAPI(prompt, retryCount + 1);
      }
      
      return null;
    }
  }
  
  // ==========================================
  // HINTS DE SECOURS (FALLBACK)
  // ==========================================
  
  getFallbackHint(questionData, hintNumber = 1) {
    const type = questionData.type;
    const answer = questionData.answer;
    
    // Pour les hints fallback, on peut être plus spécifiques
    if (hintNumber === 2 && (type === 'input' || type === 'remplir-blancs')) {
      // Deuxième hint : donner des indices précis
      const answerStr = String(answer);
      return `💡 Encore un indice : pense bien aux mots-clés de la question. La réponse a ${answerStr.length} lettres !`;
    }
    
    if (hintNumber === 3 && (type === 'input' || type === 'remplir-blancs')) {
      // Troisième hint : donner les premières lettres
      const firstLetters = String(answer).substring(0, 2).toUpperCase();
      return `💡 Dernier indice ! La réponse commence par "${firstLetters}..." Tu peux le faire !`;
    }
    
    // Hints progressifs selon le numéro
    const fallbackHints = {
      'input': {
        1: '💡 Lis bien la question ! Cherche le mot-clé principal. Qu\'est-ce qu\'on te demande exactement ?',
        2: '💡 Réfléchis aux mots importants de la question. La réponse est souvent plus simple qu\'on croit !'
      },
      'qcm': {
        1: '💡 Stratégie gagnante : Élimine les réponses clairement fausses ! Puis choisis la plus logique parmi celles qui restent.'
      },
      'vrai-faux': {
        1: '💡 Lis attentivement chaque mot. Demande-toi : "Est-ce que je suis sûr(e) que c\'est vrai ?" Si tu doutes, c\'est peut-être faux !'
      },
      'ordre': {
        1: '💡 Astuce : Trouve d\'abord le tout PREMIER élément dans le temps, puis le DERNIER. Ensuite, place ceux du milieu !'
      },
      'association': {
        1: '💡 Cherche ce qui va ensemble : Quel pays avec quelle capitale ? Quel instrument avec quelle famille ? Fais des liens logiques !'
      },
      'glisser-deposer': {
        1: '💡 Commence par placer les éléments dont tu es SÛR(E), même si c\'est juste un ou deux. Ensuite réfléchis aux autres !'
      },
      'remplir-blancs': {
        1: '💡 Lis la phrase complète ! Quel type de mot manque : un nom ? un nombre ? un lieu ? Ça t\'aidera à trouver !'
      }
    };
    
    const hints = fallbackHints[type];
    if (hints && hints[hintNumber]) {
      return hints[hintNumber];
    }
    
    return '💡 Courage ! Relis bien la question, prends ton temps, et fais confiance à ce que tu sais. Tu vas trouver !';
  }
  
  // ==========================================
  // UTILITAIRES
  // ==========================================
  
  getCategoryName(categoryId) {
    const category = getCategoryById(categoryId);
    return category ? category.name : 'Culture';
  }
  
  // Vérifier combien de hints ont été utilisés pour une question
  getUsedHintCount(questionId, questionType) {
    const maxHints = questionType === 'input' || questionType === 'remplir-blancs'
      ? (CONFIG.HINT_SYSTEM?.maxHintsInput || 3)
      : (CONFIG.HINT_SYSTEM?.maxHintsOther || 2);
    let count = 0;
    
    for (let i = 1; i <= maxHints; i++) {
      if (this.usedHints.has(`${questionId}_${i}`)) {
        count++;
      }
    }
    
    return { used: count, max: maxHints, canRequestMore: count < maxHints };
  }
  
  // Obtenir le prochain numéro de hint à demander
  getNextHintNumber(questionId, questionType) {
    const stats = this.getUsedHintCount(questionId, questionType);
    if (stats.canRequestMore) {
      return stats.used + 1;
    }
    return null;
  }
  
  // Réinitialiser les hints utilisés (nouvelle session)
  resetUsedHints() {
    this.usedHints.clear();
    console.log('🔄 Hints utilisés réinitialisés');
  }
  
  // Vider le cache
  clearCache() {
    this.cache.clear();
    console.log('🗑️ Cache des hints vidé');
  }
  
  // Obtenir les statistiques du cache
  getCacheStats() {
    return {
      size: this.cache.size,
      used: this.usedHints.size,
      keys: Array.from(this.cache.keys())
    };
  }
}

