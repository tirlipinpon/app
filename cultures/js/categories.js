// ============================================
// CATEGORIES - Définition des catégories
// ============================================

// 📦 Catégories du jeu (chargées depuis Supabase)
// Cette structure est utilisée comme fallback si Supabase n'est pas accessible
const CATEGORIES = [
  { id: 0, key: "toutes", name: "📦 Toutes", icon: "📦" },
  { id: 1, key: "culture", name: "🎭 Culture générale", icon: "🎭" },
  { id: 2, key: "science", name: "🔬 Science", icon: "🔬" },
  { id: 3, key: "histoire", name: "📜 Histoire", icon: "📜" },
  { id: 4, key: "geographie", name: "🌍 Géographie", icon: "🌍" },
  { id: 6, key: "nature", name: "🌳 Nature", icon: "🌳" }
];

// Correspondance ID → Catégorie
const CATEGORIES_BY_ID = {};
const CATEGORIES_BY_KEY = {};

CATEGORIES.forEach(cat => {
  CATEGORIES_BY_ID[cat.id] = cat;
  CATEGORIES_BY_KEY[cat.key] = cat;
});

// Obtenir une catégorie par ID
function getCategoryById(id) {
  return CATEGORIES_BY_ID[id] || CATEGORIES_BY_ID[0]; // 0 = Toutes par défaut
}

// Obtenir une catégorie par clé
function getCategoryByKey(key) {
  return CATEGORIES_BY_KEY[key] || CATEGORIES_BY_KEY['toutes'];
}

// Fonction pour filtrer les questions par catégorie
function filterQuestionsByCategory(questions, categoryKey) {
  if (categoryKey === 'toutes' || categoryKey === 0) {
    return questions; // Toutes les questions
  }
  
  // Trouver l'ID de la catégorie
  const category = getCategoryByKey(categoryKey);
  if (!category) return questions;
  
  const categoryId = category.id;
  
  // Filtrer les questions par ID de catégorie
  return questions.filter(question => question.category_id === categoryId);
}

// Fonction pour compter les questions restantes dans une catégorie
function getQuestionCountInCategory(questions, categoryKey, userManager = null) {
  const questionsInCategory = filterQuestionsByCategory(questions, categoryKey);
  
  // Si pas d'utilisateur connecté, retourner toutes les questions
  if (!userManager || !userManager.isLoggedIn()) {
    return questionsInCategory.length;
  }
  
  // Filtrer les questions déjà répondues
  const questionsAnswered = userManager.getQuestionsAnswered();
  const availableQuestions = questionsInCategory.filter(q => !questionsAnswered.includes(q.id));
  
  return availableQuestions.length;
}

// Fonction pour compter les questions répondues et le total dans une catégorie
function getFoundAndTotalCount(questions, categoryKey, userManager = null) {
  const questionsInCategory = filterQuestionsByCategory(questions, categoryKey);
  const totalCount = questionsInCategory.length;
  let foundInCategory = 0;
  
  // Si pas d'utilisateur connecté, 0 répondu
  if (!userManager || !userManager.isLoggedIn()) {
    return { found: 0, total: totalCount, remaining: totalCount };
  }
  
  // Compter les questions répondues
  const questionsAnswered = userManager.getQuestionsAnswered();
  foundInCategory = questionsInCategory.filter(q => questionsAnswered.includes(q.id)).length;
  
  return {
    found: foundInCategory,
    total: totalCount,
    remaining: totalCount - foundInCategory
  };
}

// Obtenir le nom d'une catégorie
function getCategoryName(categoryKey) {
  const cat = getCategoryByKey(categoryKey);
  return cat ? cat.name : "📦 Toutes";
}

// Obtenir les catégories disponibles (avec questions restantes)
function getAvailableCategories(questions, userManager = null) {
  const availableCategories = [];
  
  // Toujours ajouter "toutes" en premier
  const allAvailableQuestions = userManager && userManager.isLoggedIn()
    ? questions.filter(q => !userManager.getQuestionsAnswered().includes(q.id))
    : questions;
  
  if (allAvailableQuestions.length > 0) {
    availableCategories.push('toutes');
  }
  
  // Compter combien de questions RESTANTES dans chaque catégorie
  const categoryCounts = {};
  
  allAvailableQuestions.forEach(question => {
    const categoryId = question.category_id;
    categoryCounts[categoryId] = (categoryCounts[categoryId] || 0) + 1;
  });
  
  // Ajouter les catégories qui ont au moins 1 question RESTANTE
  CATEGORIES.forEach(cat => {
    if (cat.id !== 0 && categoryCounts[cat.id] > 0) {
      availableCategories.push(cat.key);
    }
  });
  
  return availableCategories;
}

console.log(`🗂️ ${CATEGORIES.length} catégories chargées`);

