-- ============================================
-- SIMPLIFICATION DES RÉPONSES
-- Suppression des variantes de majuscules/minuscules
-- ============================================

-- La validation ignore maintenant la casse, on peut donc simplifier les réponses

-- CULTURE GÉNÉRALE
UPDATE cultures_questions SET answer = '{"value": "Paris", "validateFlexible": true}'::jsonb WHERE id = 'q_culture_1';
UPDATE cultures_questions SET answer = '{"value": "324", "validateFlexible": true}'::jsonb WHERE id = 'q_culture_3';
UPDATE cultures_questions SET answer = '{"value": "7", "validateFlexible": true}'::jsonb WHERE id = 'q_culture_9';
UPDATE cultures_questions SET answer = '{"value": "France", "validateFlexible": true}'::jsonb WHERE id = 'q_culture_10';

-- SCIENCE
UPDATE cultures_questions SET answer = '{"value": "H2O", "validateFlexible": true}'::jsonb WHERE id = 'q_science_3';
UPDATE cultures_questions SET answer = '{"value": "8", "validateFlexible": true}'::jsonb WHERE id = 'q_science_5';
UPDATE cultures_questions SET answer = '{"value": "206", "validateFlexible": true}'::jsonb WHERE id = 'q_science_9';
UPDATE cultures_questions SET answer = '{"value": "300000", "validateFlexible": true}'::jsonb WHERE id = 'q_science_10';

-- HISTOIRE
UPDATE cultures_questions SET answer = '{"value": "Napoléon", "validateFlexible": true}'::jsonb WHERE id = 'q_histoire_6';
UPDATE cultures_questions SET answer = '{"value": "1989", "validateFlexible": true}'::jsonb WHERE id = 'q_histoire_7';

-- ENFANTS 8 ANS - CULTURE
UPDATE cultures_questions SET answer = '{"value": "France", "validateFlexible": true}'::jsonb WHERE id = 'q_enfant8_culture_2';
UPDATE cultures_questions SET answer = '{"value": "Alexander De Croo", "validateFlexible": true}'::jsonb WHERE id = 'q_enfant8_culture_4';
UPDATE cultures_questions SET answer = '{"value": "Éléphant", "validateFlexible": true}'::jsonb WHERE id = 'q_enfant8_culture_6';
UPDATE cultures_questions SET answer = '{"value": "Espagnol", "validateFlexible": true}'::jsonb WHERE id = 'q_enfant8_culture_9';
UPDATE cultures_questions SET answer = '{"value": "Terre", "validateFlexible": true}'::jsonb WHERE id = 'q_enfant8_culture_10';
UPDATE cultures_questions SET answer = '{"value": "Banane", "validateFlexible": true}'::jsonb WHERE id = 'q_enfant8_culture_11';
UPDATE cultures_questions SET answer = '{"value": "Vin", "validateFlexible": true}'::jsonb WHERE id = 'q_enfant8_culture_17';

-- ENFANTS 8 ANS - SCIENCE
UPDATE cultures_questions SET answer = '{"value": "Soleil", "validateFlexible": true}'::jsonb WHERE id = 'q_enfant8_science_3';
UPDATE cultures_questions SET answer = '{"value": "Yeux", "validateFlexible": true}'::jsonb WHERE id = 'q_enfant8_science_4';
UPDATE cultures_questions SET answer = '{"value": "Cœur", "validateFlexible": true}'::jsonb WHERE id = 'q_enfant8_science_5';
UPDATE cultures_questions SET answer = '{"value": "Abeille", "validateFlexible": true}'::jsonb WHERE id = 'q_enfant8_science_7';
UPDATE cultures_questions SET answer = '{"value": "Gravité", "validateFlexible": true}'::jsonb WHERE id = 'q_enfant8_science_11';
UPDATE cultures_questions SET answer = '{"value": "Poisson", "validateFlexible": true}'::jsonb WHERE id = 'q_enfant8_science_14';
UPDATE cultures_questions SET answer = '{"value": "Mars", "validateFlexible": true}'::jsonb WHERE id = 'q_enfant8_science_20';

-- ENFANTS 8 ANS - HISTOIRE
UPDATE cultures_questions SET answer = '{"value": "Rome", "validateFlexible": true}'::jsonb WHERE id = 'q_enfant8_histoire_9';

-- Vérification
SELECT id, question_text, answer 
FROM cultures_questions 
WHERE answer::text LIKE '%validateFlexible%true%'
ORDER BY id;

SELECT 'Simplification terminée !' as message;

