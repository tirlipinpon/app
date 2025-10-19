-- Correction de la question sur les couleurs primaires
-- Enseigne les vraies couleurs primaires et leurs mélanges pour créer les couleurs secondaires

UPDATE cultures_questions 
SET answer = '{"left": ["Orange", "Vert", "Violet", "Rouge"], "right": ["Rouge + Jaune", "Bleu + Jaune", "Rouge + Bleu", "Couleur primaire"], "pairs": [["Orange", "Rouge + Jaune"], ["Vert", "Bleu + Jaune"], ["Violet", "Rouge + Bleu"], ["Rouge", "Couleur primaire"]]}'
WHERE id = 'q_assoc_culture_7';

-- Vérification de la correction
SELECT id, question_text, answer 
FROM cultures_questions 
WHERE id = 'q_assoc_culture_7';
