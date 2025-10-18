// ============================================
// SUPABASE SERVICE - Interaction avec la base de données
// ============================================

class SupabaseService {
  constructor() {
    this.client = null;
    this.categoriesCache = [];
    this.questionsCache = [];
    this.isInitialized = false;
    
    this.initialize();
  }
  
  // Initialiser le client Supabase
  initialize() {
    if (!isSupabaseConfigured()) {
      console.warn('⚠️ Supabase non configuré. Veuillez remplir config.js');
      return false;
    }
    
    try {
      this.client = window.supabase.createClient(
        CONFIG.SUPABASE_URL,
        CONFIG.SUPABASE_ANON_KEY
      );
      
      this.isInitialized = true;
      console.log('✅ Supabase initialisé');
      return true;
    } catch (error) {
      console.error('❌ Erreur initialisation Supabase:', error);
      return false;
    }
  }
  
  // Vérifier si Supabase est prêt
  isReady() {
    return this.isInitialized && this.client !== null;
  }
  
  // ============================================
  // CATÉGORIES
  // ============================================
  
  async loadCategories() {
    if (!this.isReady()) {
      console.warn('⚠️ Supabase non initialisé, utilisation des catégories locales');
      return CATEGORIES;
    }
    
    try {
      const { data, error } = await this.client
        .from('cultures_categories')
        .select('*')
        .order('display_order', { ascending: true });
      
      if (error) throw error;
      
      this.categoriesCache = data;
      console.log(`✅ ${data.length} catégories chargées depuis Supabase`);
      return data;
    } catch (error) {
      console.error('❌ Erreur chargement catégories:', error);
      // Fallback sur les catégories locales
      return CATEGORIES;
    }
  }
  
  // ============================================
  // QUESTIONS
  // ============================================
  
  async loadQuestions(categoryKey = 'toutes') {
    if (!this.isReady()) {
      console.warn('⚠️ Supabase non initialisé');
      return [];
    }
    
    try {
      const { data, error } = await this.client
        .rpc('get_questions_by_category', { 
          p_category_key: categoryKey 
        });
      
      if (error) throw error;
      
      console.log(`✅ ${data.length} questions chargées (catégorie: ${categoryKey})`);
      return data;
    } catch (error) {
      console.error('❌ Erreur chargement questions:', error);
      return [];
    }
  }
  
  async loadAllQuestions() {
    if (!this.isReady()) {
      console.warn('⚠️ Supabase non initialisé');
      return [];
    }
    
    try {
      const { data, error } = await this.client
        .from('cultures_questions')
        .select('*')
        .eq('is_active', true);
      
      if (error) throw error;
      
      this.questionsCache = data;
      console.log(`✅ ${data.length} questions chargées depuis Supabase`);
      return data;
    } catch (error) {
      console.error('❌ Erreur chargement questions:', error);
      return [];
    }
  }
  
  // ============================================
  // HINTS IA
  // ============================================
  
  async saveHint(questionId, hintText) {
    if (!this.isReady()) {
      console.warn('⚠️ Supabase non initialisé, hint non sauvegardé');
      return false;
    }
    
    try {
      const { error } = await this.client
        .rpc('update_question_hint', {
          p_question_id: questionId,
          p_hint: hintText
        });
      
      if (error) throw error;
      
      console.log(`💾 Hint sauvegardé pour: ${questionId}`);
      
      // Mettre à jour le cache local
      const questionIndex = this.questionsCache.findIndex(q => q.id === questionId);
      if (questionIndex !== -1) {
        this.questionsCache[questionIndex].hint = hintText;
      }
      
      return true;
    } catch (error) {
      console.error('❌ Erreur sauvegarde hint:', error);
      return false;
    }
  }
  
  // ============================================
  // STATISTIQUES
  // ============================================
  
  async getCategoryStats() {
    if (!this.isReady()) {
      console.warn('⚠️ Supabase non initialisé');
      return [];
    }
    
    try {
      const { data, error } = await this.client
        .from('v_cultures_category_stats')
        .select('*');
      
      if (error) throw error;
      
      return data;
    } catch (error) {
      console.error('❌ Erreur stats:', error);
      return [];
    }
  }
  
  // ============================================
  // CACHE
  // ============================================
  
  getCachedQuestions() {
    return this.questionsCache;
  }
  
  getCachedCategories() {
    return this.categoriesCache;
  }
  
  clearCache() {
    this.questionsCache = [];
    this.categoriesCache = [];
    console.log('🗑️ Cache Supabase vidé');
  }
}

