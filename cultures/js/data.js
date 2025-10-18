// ============================================
// DATA.JS - RÉPONSES MAINTENANT DANS SUPABASE
// ============================================
// 
// ⚠️ IMPORTANT : Les réponses sont maintenant stockées dans Supabase
// Ce fichier est conservé pour compatibilité mais n'est plus utilisé
// 
// Pour gérer les questions et réponses :
// 1. Connecte-toi à Supabase Dashboard
// 2. Ouvre le SQL Editor
// 3. Utilise la table 'cultures_questions' avec le champ 'answer' (JSONB)
// 
// Structure du champ 'answer' :
// {
//   "value": <réponse(s) correcte(s)>,
//   "validateFlexible": true/false (optionnel)
// }
// 
// Exemples :
// - Input simple: {"value": "Paris"}
// - Input flexible: {"value": ["Paris", "paris"], "validateFlexible": true}
// - QCM: {"value": "Léonard de Vinci"}
// - Vrai/Faux: {"value": true}
// - Ordre: {"value": [0, 1, 2]}
// - Association: {"value": {"France": "Paris", "Allemagne": "Berlin"}}
// 
// ============================================

console.log('📚 Réponses chargées depuis Supabase');
