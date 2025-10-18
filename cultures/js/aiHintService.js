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
    
    // Pour les questions INPUT : 2 hints autorisés
    // Pour les autres types : 1 hint seulement
    const maxHints = questionData.type === 'input' ? 2 : 1;
    
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
    const type = questionData.type;
    const category = this.getCategoryName(questionData.category);
    
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
    
    // Prompt progressif selon le numéro du hint
    let hintInstruction = '';
    if (hintNumber === 1) {
      hintInstruction = `
- Donne un PREMIER indice général et encourageant
- Oriente dans la bonne direction SANS donner la réponse
- Reste vague et pédagogique`;
    } else {
      hintInstruction = `
- C'est le DEUXIÈME indice, sois plus PRÉCIS que le premier
- Donne plus de détails pour vraiment aider
- Tu peux être plus direct, mais NE DONNE PAS la réponse exacte`;
    }
    
    return `Tu es un assistant pédagogique TRÈS bienveillant pour des ENFANTS (7-12 ans) qui jouent à un jeu de culture.

CONTEXTE :
- Public : Enfants de 7 à 12 ans (adapte ton langage !)
- Question : "${question}"
- Catégorie : ${category}
- Type : ${typeDescription}
- Indice numéro : ${hintNumber}

CONSIGNES STRICTES :
${hintInstruction}
- Maximum 20 mots (COURT et CLAIR)
- Commence TOUJOURS par "💡"
- Utilise un vocabulaire SIMPLE adapté aux enfants
- Ton ENCOURAGEANT et POSITIF
- NE DONNE JAMAIS la réponse finale (très important !)
- Aide-les à RÉFLÉCHIR par eux-mêmes

EXEMPLES pour des enfants :

Premier indice (général) :
- "💡 Pense à la plus grande ville de France, celle qu'on voit dans les films !"
- "💡 C'est un événement très important qui a changé la France il y a longtemps"
- "💡 C'est une formule avec H et O, pense à ce que tu bois tous les jours"

Deuxième indice (plus précis, pour questions input) :
- "💡 Cette ville est connue pour sa grande tour en métal et elle est sur la Seine"
- "💡 Cet événement a eu lieu en 1789, les gens voulaient plus de liberté"
- "💡 H2O : 2 lettres H (hydrogène) et 1 lettre O (oxygène)"

TON INDICE (adapté aux enfants) :`;
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
    
    // Hints progressifs selon le numéro
    const fallbackHints = {
      'input': {
        1: '💡 Réfléchis bien ! Parfois la réponse est plus simple qu\'on ne croit. Tu peux y arriver !',
        2: '💡 Essaie de penser aux mots-clés de la question. Qu\'est-ce qui est important ici ?'
      },
      'qcm': {
        1: '💡 Élimine d\'abord les réponses qui te semblent impossibles. Ensuite choisis parmi celles qui restent !'
      },
      'vrai-faux': {
        1: '💡 Prends ton temps pour bien lire la phrase. Est-ce que ça te semble juste ou faux ?'
      },
      'ordre': {
        1: '💡 Pense à la chronologie : qu\'est-ce qui s\'est passé en premier ? Et après ?'
      },
      'association': {
        1: '💡 Essaie de faire des connexions : qu\'est-ce qui va bien ensemble ?'
      },
      'glisser-deposer': {
        1: '💡 Regarde les caractéristiques de chaque élément : dans quelle catégorie il va le mieux ?'
      },
      'remplir-blancs': {
        1: '💡 Quel mot manque pour que la phrase ait du sens ? Lis bien ce qui vient avant et après !'
      }
    };
    
    const hints = fallbackHints[type];
    if (hints && hints[hintNumber]) {
      return hints[hintNumber];
    }
    
    return '💡 Prends ton temps pour bien réfléchir à la question. Tu es capable de trouver !';
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
    const maxHints = questionType === 'input' ? 2 : 1;
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

