// ============================================
// DATA.JS - RÉPONSES CORRECTES
// ============================================
// 
// ⚠️ IMPORTANT : Les réponses restent dans le frontend
// Les questions sont chargées depuis Supabase
// 
// Structure :
// - answer: la/les réponse(s) correcte(s)
// - validateFlexible: true pour accepter plusieurs variantes (input)
//
// ============================================

const ANSWERS_DATA = {
  // ========================================
  // CULTURE GÉNÉRALE
  // ========================================
  
  "q_culture_1": {
    answer: ["Paris", "paris", "PARIS"],
    validateFlexible: true
  },
  
  "q_culture_2": {
    answer: {
      "France": "Paris",
      "Allemagne": "Berlin",
      "Italie": "Rome"
    }
  },
  
  "q_culture_3": {
    answer: ["324", "trois cent vingt-quatre", "300", "330"],
    validateFlexible: true
  },
  
  "q_culture_4": {
    answer: "Léonard de Vinci"
  },
  
  "q_culture_5": {
    answer: "Pacifique"
  },
  
  "q_culture_6": {
    answer: {
      "Violon": "Cordes",
      "Trompette": "Cuivres",
      "Flûte": "Bois"
    }
  },
  
  "q_culture_7": {
    answer: true
  },
  
  "q_culture_8": {
    answer: "Italie"
  },
  
  "q_culture_9": {
    answer: ["7", "sept"],
    validateFlexible: true
  },
  
  "q_culture_10": {
    answer: ["France", "france", "la France"],
    validateFlexible: true
  },
  
  // ========================================
  // SCIENCE
  // ========================================
  
  "q_science_1": {
    answer: true
  },
  
  "q_science_2": {
    answer: {
      "Mammifères": ["Chat", "Chien"],
      "Reptiles": ["Serpent", "Lézard"]
    }
  },
  
  "q_science_3": {
    answer: ["H2O", "h2o", "H₂O"],
    validateFlexible: true
  },
  
  "q_science_4": {
    answer: false
  },
  
  "q_science_5": {
    answer: ["8", "huit"],
    validateFlexible: true
  },
  
  "q_science_6": {
    answer: {
      "Solide": ["Fer", "Sel"],
      "Liquide": ["Eau"],
      "Gaz": ["Oxygène"]
    }
  },
  
  "q_science_7": {
    answer: "Azote"
  },
  
  "q_science_8": {
    // Ordre correct : Mercure (index 3), Vénus (2), Terre (1), Mars (0)
    answer: [3, 2, 1, 0]
  },
  
  "q_science_9": {
    answer: ["206", "deux cent six"],
    validateFlexible: true
  },
  
  "q_science_10": {
    answer: ["300000", "300 000", "3×10^5", "trois cent mille"],
    validateFlexible: true
  },
  
  // ========================================
  // HISTOIRE
  // ========================================
  
  "q_histoire_1": {
    answer: "Christophe Colomb"
  },
  
  "q_histoire_2": {
    // Ordre chronologique : Révolution française (0), WWI (1), Mur de Berlin (2)
    answer: [0, 1, 2]
  },
  
  "q_histoire_3": {
    answer: "1789"
  },
  
  "q_histoire_4": {
    answer: true
  },
  
  "q_histoire_5": {
    // Ordre chronologique : Louis XIV (0), Louis XVI (1), Napoléon (2)
    answer: [0, 1, 2]
  },
  
  "q_histoire_6": {
    answer: ["Napoléon", "napoléon", "Napoleon", "Napoléon Bonaparte", "Napoleon Bonaparte"],
    validateFlexible: true
  },
  
  "q_histoire_7": {
    answer: ["1989", "novembre 1989", "9 novembre 1989"],
    validateFlexible: true
  },
  
  "q_histoire_8": {
    answer: {
      "Égyptiens": "Afrique",
      "Mayas": "Amérique",
      "Grecs": "Europe"
    }
  },
  
  "q_histoire_9": {
    answer: false  // Jules César était un général et dictateur, pas un empereur
  },
  
  "q_histoire_10": {
    answer: "George Washington"
  }
};

console.log(`📚 ${Object.keys(ANSWERS_DATA).length} réponses chargées`);

