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
      const prompt = this.createPrompt(questionData, hintNumber);
      const hint = await this.callDeepSeekAPI(prompt);
      
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
  // CRÉATION DU PROMPT
  // ==========================================
  
  createPrompt(questionData, hintNumber = 1) {
    const question = questionData.question;
    const answer = questionData.answer;
    const type = questionData.type;
    const category = this.getCategoryName(questionData.category);
    const options = questionData.options;
    
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
📍 INDICE 1 (SUBTIL) :
- Donne un indice GÉNÉRAL qui oriente vers la bonne réponse
- Utilise des ASSOCIATIONS d'idées, des CONTEXTES, ou des CARACTÉRISTIQUES
- NE mentionne PAS directement la réponse
- Sois ENCOURAGEANT et PÉDAGOGIQUE
- Maximum 25 mots`;
    } else if (hintNumber === 2) {
      hintInstruction = `
📍 INDICE 2 (PLUS PRÉCIS) :
- L'enfant a déjà eu un premier indice, il a besoin de PLUS DE PRÉCISION
- Donne des DÉTAILS CONCRETS qui permettent vraiment de trouver
- Tu peux mentionner des ÉLÉMENTS CLÉS de la réponse (premières lettres, dates, lieux, etc.)
- Reste ENCOURAGEANT mais sois PLUS EXPLICITE
- Maximum 30 mots`;
    } else {
      hintInstruction = `
📍 INDICE 3 (TRÈS DIRECT) :
- C'est le DERNIER indice, l'enfant a vraiment besoin d'aide maintenant !
- Sois TRÈS EXPLICITE : donne la première lettre ou les 2-3 premières lettres
- Mentionne des FAITS PRÉCIS qui mènent directement à la réponse
- Donne presque la réponse, mais pas complètement
- Maximum 35 mots`;
    }
    
    return `Tu es un assistant pédagogique pour des ENFANTS de 8 ans qui jouent à un jeu éducatif.

📝 QUESTION : "${question}"${optionsText}
✅ RÉPONSE CORRECTE : ${answerText}
🎯 Type : ${typeDescription}
📚 Catégorie : ${category}

${hintInstruction}

🎨 STRATÉGIES D'INDICES EFFICACES :

Pour un QCM :
- Indice 1 : "💡 Élimine les réponses impossibles ! Pense au pays où se trouve [élément lié]..."
- Indice 2 : "💡 La réponse commence par la lettre '${answerText.charAt(0)}' et est connue pour [caractéristique]"

Pour une question à réponse libre (input) :
- Indice 1 : "💡 C'est une ville/un pays/une personne célèbre pour [caractéristique générale]"
- Indice 2 : "💡 C'est lié à [contexte précis]. Pense à [élément important]"
- Indice 3 : "💡 La réponse commence par '${answerText.substring(0, 2)}' et c'est [caractéristique unique]"

Pour Vrai/Faux :
- Indice 1 : "💡 Réfléchis bien : est-ce que ça s'est vraiment passé comme ça ?"
- Indice 2 : "💡 Pense à [élément factuel précis qui permet de trancher]"

Pour ordre chronologique :
- Indice 1 : "💡 Demande-toi : qu'est-ce qui s'est passé EN PREMIER dans le temps ?"
- Indice 2 : "💡 Le premier événement est [indice], puis vient [indice sur le 2e]"

RÈGLES ABSOLUES :
✅ Commence TOUJOURS par "💡"
✅ Langage SIMPLE pour un enfant de 8 ans
✅ Ton ENCOURAGEANT ("Tu peux y arriver !", "C'est ça !", "Bien réfléchi !")
❌ NE DONNE JAMAIS la réponse complète mot pour mot
✅ Donne des INDICES CONCRETS et UTILES

TON INDICE (adapté à un enfant de 8 ans) :`;
  }
  
  // ==========================================
  // APPEL API DEEPSEEK
  // ==========================================
  
  async callDeepSeekAPI(prompt, retryCount = 0) {
    try {
      const response = await fetch(CONFIG.DEEPSEEK_API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${CONFIG.DEEPSEEK_API_KEY}`
        },
        body: JSON.stringify({
          model: CONFIG.DEEPSEEK_MODEL,
          messages: [
            {
              role: 'user',
              content: prompt
            }
          ],
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

