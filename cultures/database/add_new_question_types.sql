-- =====================================================
-- MIGRATION : Ajout des nouveaux types de questions
-- =====================================================
-- Date: 19 octobre 2025
-- Ajout de : timeline, map-click
-- =====================================================

-- Supprimer l'ancienne contrainte
ALTER TABLE cultures_questions 
DROP CONSTRAINT IF EXISTS cultures_questions_question_type_check;

-- Ajouter la nouvelle contrainte avec les nouveaux types
ALTER TABLE cultures_questions 
ADD CONSTRAINT cultures_questions_question_type_check 
CHECK (question_type IN (
  'input',
  'qcm',
  'vrai-faux',
  'ordre',
  'association',
  'glisser-deposer',
  'remplir-blancs',
  'timeline',
  'map-click'
));

-- Vérification
SELECT conname, pg_get_constraintdef(oid) 
FROM pg_constraint 
WHERE conrelid = 'cultures_questions'::regclass 
AND contype = 'c'
AND conname = 'cultures_questions_question_type_check';

