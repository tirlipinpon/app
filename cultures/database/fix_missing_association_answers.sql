-- =====================================================
-- CORRECTION : Ajout des réponses manquantes pour les questions d'association
-- =====================================================
-- Date: 19 octobre 2025
-- =====================================================

-- Question 1 : Pays et capitales (Culture générale)
UPDATE cultures_questions
SET answer = '{
  "left": ["France", "Italie", "Espagne", "Allemagne"],
  "right": ["Paris", "Rome", "Madrid", "Berlin"],
  "pairs": [
    ["France", "Paris"],
    ["Italie", "Rome"],
    ["Espagne", "Madrid"],
    ["Allemagne", "Berlin"]
  ]
}'::jsonb
WHERE id = 'q_culture_2';

-- Question 2 : Instruments et familles (Culture générale)
UPDATE cultures_questions
SET answer = '{
  "left": ["Violon", "Trompette", "Piano", "Tambour"],
  "right": ["Cordes", "Cuivres", "Clavier", "Percussions"],
  "pairs": [
    ["Violon", "Cordes"],
    ["Trompette", "Cuivres"],
    ["Piano", "Clavier"],
    ["Tambour", "Percussions"]
  ]
}'::jsonb
WHERE id = 'q_culture_6';

-- Question 3 : Civilisations et continents (Histoire)
UPDATE cultures_questions
SET answer = '{
  "left": ["Égyptiens", "Romains", "Mayas", "Chinois"],
  "right": ["Afrique", "Europe", "Amérique", "Asie"],
  "pairs": [
    ["Égyptiens", "Afrique"],
    ["Romains", "Europe"],
    ["Mayas", "Amérique"],
    ["Chinois", "Asie"]
  ]
}'::jsonb
WHERE id = 'q_histoire_8';

-- Vérification
SELECT id, question_text, answer 
FROM cultures_questions 
WHERE id IN ('q_culture_2', 'q_culture_6', 'q_histoire_8');

