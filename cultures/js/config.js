// ============================================
// CONFIGURATION - Supabase & IA
// ============================================

const CONFIG = {
  // 🗄️ SUPABASE CONFIGURATION
  SUPABASE_URL: 'https://zmgfaiprgbawcernymqa.supabase.co',
  SUPABASE_ANON_KEY: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InptZ2ZhaXByZ2Jhd2Nlcm55bXFhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MjQ2NTc0MjEsImV4cCI6MjA0MDIzMzQyMX0.sBq7sR7JhRZCg36xvt13yt_f398oWbHUfdUwa9yoox0',
  
  // 🤖 DEEPSEEK AI CONFIGURATION
  DEEPSEEK_API_URL: 'https://api.deepseek.com/v1/chat/completions',
  DEEPSEEK_API_KEY: 'sk-df452afa345c4fb78f0efc6c719ba8ea',
  DEEPSEEK_MODEL: 'deepseek-chat',
  
  // 💡 AI HINT CONFIGURATION
  AI_HINT_CONFIG: {
    temperature: 0.8,        // Plus créatif pour de meilleurs indices
    max_tokens: 150,         // Plus de mots pour des indices détaillés
    top_p: 0.9
  },
  
  // 💡 HINT SYSTEM CONFIGURATION
  HINT_SYSTEM: {
    maxHintsInput: 3,        // 3 hints pour les questions à réponse libre
    maxHintsOther: 2         // 2 hints pour les autres types
  },
  
  // ⏱️ RETRY DELAYS (pour questions incorrectes)
  RETRY_CONFIG: {
    minDelay: 5 * 60 * 1000,      // 5 minutes minimum
    maxDelay: 30 * 60 * 1000,     // 30 minutes maximum
    multiplierPerAttempt: 1.5     // Augmentation par tentative
  }
};

// Vérifier si la clé API IA est configurée
function isApiKeyConfigured() {
  return CONFIG.DEEPSEEK_API_KEY && 
         CONFIG.DEEPSEEK_API_KEY !== 'sk-votre-cle-api-ici';
}

// Vérifier si Supabase est configuré
function isSupabaseConfigured() {
  return CONFIG.SUPABASE_URL && 
         CONFIG.SUPABASE_URL !== 'https://votre-projet.supabase.co' &&
         CONFIG.SUPABASE_ANON_KEY &&
         CONFIG.SUPABASE_ANON_KEY !== 'votre-anon-key-ici';
}

console.log('⚙️ Configuration chargée');
console.log('📡 Supabase configuré:', isSupabaseConfigured());
console.log('🤖 API IA configurée:', isApiKeyConfigured());

