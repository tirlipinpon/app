-- Script SQL pour ajouter des données d'exemple
-- À exécuter dans l'éditeur SQL de Supabase après avoir créé les tables

-- Insertion de catégories d'exemple
INSERT INTO categories (name, description, icon) VALUES
('Histoire', 'Questions sur l''histoire mondiale et française', '📜'),
('Géographie', 'Questions sur les pays, capitales et reliefs', '🌍'),
('Sciences', 'Questions sur les sciences naturelles et physiques', '🔬'),
('Arts', 'Questions sur la peinture, musique et littérature', '🎨'),
('Sport', 'Questions sur les sports et les champions', '⚽');

-- Insertion de questions d'exemple pour Histoire
INSERT INTO questions (category_id, question_text, question_type, correct_answer, wrong_answers, difficulty, hint, explanation) 
VALUES 
(
  (SELECT id FROM categories WHERE name = 'Histoire' LIMIT 1),
  'En quelle année a eu lieu la Révolution française ?',
  'qcm',
  '1789',
  ARRAY['1776', '1799', '1804'],
  'facile',
  'C''est la fin du 18ème siècle',
  'La Révolution française a commencé en 1789 avec la prise de la Bastille le 14 juillet.'
),
(
  (SELECT id FROM categories WHERE name = 'Histoire' LIMIT 1),
  'Qui était le premier empereur de France ?',
  'text',
  'Napoléon Bonaparte',
  NULL,
  'moyen',
  'Il a été couronné en 1804',
  'Napoléon Bonaparte s''est proclamé empereur des Français en 1804.'
);

-- Insertion de questions d'exemple pour Géographie
INSERT INTO questions (category_id, question_text, question_type, correct_answer, wrong_answers, difficulty, hint) 
VALUES 
(
  (SELECT id FROM categories WHERE name = 'Géographie' LIMIT 1),
  'Quelle est la capitale de l''Italie ?',
  'qcm',
  'Rome',
  ARRAY['Milan', 'Naples', 'Venise'],
  'facile',
  'C''est une ville très ancienne'
),
(
  (SELECT id FROM categories WHERE name = 'Géographie' LIMIT 1),
  'Quel est le plus long fleuve du monde ?',
  'qcm',
  'L''Amazone',
  ARRAY['Le Nil', 'Le Yangtsé', 'Le Mississippi'],
  'moyen',
  'Il se trouve en Amérique du Sud'
);

-- Insertion de questions d'exemple pour Sciences
INSERT INTO questions (category_id, question_text, question_type, correct_answer, wrong_answers, difficulty, hint) 
VALUES 
(
  (SELECT id FROM categories WHERE name = 'Sciences' LIMIT 1),
  'La Terre tourne autour du Soleil',
  'vrai_faux',
  'Vrai',
  ARRAY['Faux'],
  'facile',
  'Système héliocentrique'
),
(
  (SELECT id FROM categories WHERE name = 'Sciences' LIMIT 1),
  'Combien de planètes y a-t-il dans le système solaire ?',
  'text',
  '8',
  NULL,
  'moyen',
  'Pluton n''est plus considérée comme une planète'
);

-- Insertion de questions d'exemple pour Arts
INSERT INTO questions (category_id, question_text, question_type, correct_answer, wrong_answers, difficulty, hint) 
VALUES 
(
  (SELECT id FROM categories WHERE name = 'Arts' LIMIT 1),
  'Qui a peint la Joconde ?',
  'qcm',
  'Léonard de Vinci',
  ARRAY['Michel-Ange', 'Raphaël', 'Botticelli'],
  'facile',
  'Un artiste de la Renaissance italienne'
),
(
  (SELECT id FROM categories WHERE name = 'Arts' LIMIT 1),
  'Dans quelle ville se trouve le musée du Louvre ?',
  'qcm',
  'Paris',
  ARRAY['Lyon', 'Marseille', 'Bordeaux'],
  'facile',
  'La capitale de la France'
);

-- Insertion de questions d'exemple pour Sport
INSERT INTO questions (category_id, question_text, question_type, correct_answer, wrong_answers, difficulty) 
VALUES 
(
  (SELECT id FROM categories WHERE name = 'Sport' LIMIT 1),
  'Combien de joueurs composent une équipe de football sur le terrain ?',
  'qcm',
  '11',
  ARRAY['10', '12', '9'],
  'facile'
),
(
  (SELECT id FROM categories WHERE name = 'Sport' LIMIT 1),
  'Quel pays a remporté la Coupe du Monde de football en 2018 ?',
  'qcm',
  'France',
  ARRAY['Brésil', 'Allemagne', 'Argentine'],
  'moyen'
);

-- Vérification des données insérées
SELECT 
  c.name AS categorie,
  COUNT(q.id) AS nombre_questions
FROM categories c
LEFT JOIN questions q ON c.id = q.category_id
GROUP BY c.id, c.name
ORDER BY c.name;

