-- ============================================
-- CORRECTION DES CARACTÈRES SPÉCIAUX
-- Remplacer œ, æ par leurs équivalents simples
-- ============================================

-- Corriger "Cœur" → "Coeur"
UPDATE cultures_questions 
SET answer = '{"value": "Coeur", "validateFlexible": true}'::jsonb 
WHERE id = 'q_enfant8_science_5';

-- Vérifier s'il y a d'autres questions avec des caractères spéciaux
SELECT id, question_text, answer 
FROM cultures_questions 
WHERE answer::text LIKE '%œ%' 
   OR answer::text LIKE '%Œ%'
   OR answer::text LIKE '%æ%'
   OR answer::text LIKE '%Æ%';

-- Message de confirmation
SELECT 'Caractères spéciaux corrigés !' as message;

