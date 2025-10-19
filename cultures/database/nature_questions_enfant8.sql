-- =====================================================
-- AJOUT CATÉGORIE NATURE + 40 QUESTIONS POUR ENFANTS 8-9 ANS
-- =====================================================
-- Date: 19 octobre 2025
-- Thème: Nature (arbres, animaux, plantes, saisons, environnement)
-- Public: Enfants de 8-9 ans (Belgique)
-- =====================================================

-- 1. CRÉER LA CATÉGORIE NATURE (si elle n'existe pas)
INSERT INTO cultures_categories (id, key, name, icon)
VALUES (6, 'nature', 'nature', '🌳')
ON CONFLICT (id) DO NOTHING;

-- =====================================================
-- 2. QUESTIONS TYPE INPUT (10 questions)
-- =====================================================

-- Question 1 : Arbre commun
INSERT INTO cultures_questions (id, question_text, question_type, category_id, answer)
VALUES (
  'q_nature_input_1',
  'Quel arbre perd ses feuilles en automne et donne des glands ?',
  'input',
  6,

  '{"value": "Chêne", "validateFlexible": true}'::jsonb
);

-- Question 2 : Saison
INSERT INTO cultures_questions (id, question_text, question_type, category_id, answer)
VALUES (
  'q_nature_input_2',
  'Quelle saison vient après l''été ?',
  'input',
  6,

  '{"value": "Automne", "validateFlexible": true}'::jsonb
);

-- Question 3 : Animal de la forêt
INSERT INTO cultures_questions (id, question_text, question_type, category_id, answer)
VALUES (
  'q_nature_input_3',
  'Quel animal roux à queue touffue vit dans nos forêts et mange des noisettes ?',
  'input',
  6,

  '{"value": "Écureuil", "validateFlexible": true}'::jsonb
);

-- Question 4 : Fleur
INSERT INTO cultures_questions (id, question_text, question_type, category_id, answer)
VALUES (
  'q_nature_input_4',
  'Quelle grande fleur jaune suit le soleil et donne des graines ?',
  'input',
  6,

  '{"value": "Tournesol", "validateFlexible": true}'::jsonb
);

-- Question 5 : Insecte
INSERT INTO cultures_questions (id, question_text, question_type, category_id, answer)
VALUES (
  'q_nature_input_5',
  'Quel insecte jaune et noir fait du miel ?',
  'input',
  6,

  '{"value": "Abeille", "validateFlexible": true}'::jsonb
);

-- Question 6 : Fruit
INSERT INTO cultures_questions (id, question_text, question_type, category_id, answer)
VALUES (
  'q_nature_input_6',
  'Quel fruit rouge pousse dans les pommiers ?',
  'input',
  6,

  '{"value": "Pomme", "validateFlexible": true}'::jsonb
);

-- Question 7 : Météo
INSERT INTO cultures_questions (id, question_text, question_type, category_id, answer)
VALUES (
  'q_nature_input_7',
  'Comment s''appelle l''eau qui tombe du ciel sous forme de gouttelettes ?',
  'input',
  6,

  '{"value": "Pluie", "validateFlexible": true}'::jsonb
);

-- Question 8 : Animal domestique
INSERT INTO cultures_questions (id, question_text, question_type, category_id, answer)
VALUES (
  'q_nature_input_8',
  'Quel oiseau de la ferme chante "cocorico" le matin ?',
  'input',
  6,

  '{"value": "Coq", "validateFlexible": true}'::jsonb
);

-- Question 9 : Légume
INSERT INTO cultures_questions (id, question_text, question_type, category_id, answer)
VALUES (
  'q_nature_input_9',
  'Quel légume orange pousse sous terre et est adoré par les lapins ?',
  'input',
  6,

  '{"value": "Carotte", "validateFlexible": true}'::jsonb
);

-- Question 10 : Cycle de l'eau
INSERT INTO cultures_questions (id, question_text, question_type, category_id, answer)
VALUES (
  'q_nature_input_10',
  'Que forment les gouttelettes d''eau dans le ciel ?',
  'input',
  6,

  '{"value": "Nuages", "validateFlexible": true}'::jsonb
);

-- =====================================================
-- 3. QUESTIONS TYPE QCM (15 questions)
-- =====================================================

-- Question 1 : Animal
INSERT INTO cultures_questions (id, question_text, question_type, category_id, answer, options)
VALUES (
  'q_nature_qcm_1',
  'Quel animal hiberne pendant l''hiver ?',
  'qcm',
  6,

  '{"value": "Hérisson"}'::jsonb,
  '["Hérisson", "Écureuil", "Renard", "Lapin"]'::jsonb
);

-- Question 2 : Arbre
INSERT INTO cultures_questions (id, question_text, question_type, category_id, answer, options)
VALUES (
  'q_nature_qcm_2',
  'Quel arbre garde ses aiguilles vertes toute l''année ?',
  'qcm',
  6,

  '{"value": "Sapin"}'::jsonb,
  '["Sapin", "Chêne", "Érable", "Bouleau"]'::jsonb
);

-- Question 3 : Oiseau
INSERT INTO cultures_questions (id, question_text, question_type, category_id, answer, options)
VALUES (
  'q_nature_qcm_3',
  'Quel oiseau migrateur revient au printemps ?',
  'qcm',
  6,

  '{"value": "Hirondelle"}'::jsonb,
  '["Hirondelle", "Moineau", "Pigeon", "Corbeau"]'::jsonb
);

-- Question 4 : Papillon
INSERT INTO cultures_questions (id, question_text, question_type, category_id, answer, options)
VALUES (
  'q_nature_qcm_4',
  'Que devient une chenille après sa transformation ?',
  'qcm',
  6,

  '{"value": "Papillon"}'::jsonb,
  '["Papillon", "Abeille", "Libellule", "Coccinelle"]'::jsonb
);

-- Question 5 : Saisons
INSERT INTO cultures_questions (id, question_text, question_type, category_id, answer, options)
VALUES (
  'q_nature_qcm_5',
  'En quelle saison les arbres sont-ils en fleurs ?',
  'qcm',
  6,

  '{"value": "Printemps"}'::jsonb,
  '["Printemps", "Été", "Automne", "Hiver"]'::jsonb
);

-- Question 6 : Champignons
INSERT INTO cultures_questions (id, question_text, question_type, category_id, answer, options)
VALUES (
  'q_nature_qcm_6',
  'En quelle saison trouve-t-on le plus de champignons en forêt ?',
  'qcm',
  6,

  '{"value": "Automne"}'::jsonb,
  '["Automne", "Printemps", "Été", "Hiver"]'::jsonb
);

-- Question 7 : Eau
INSERT INTO cultures_questions (id, question_text, question_type, category_id, answer, options)
VALUES (
  'q_nature_qcm_7',
  'Où la plupart des rivières se jettent-elles ?',
  'qcm',
  6,

  '{"value": "Dans la mer"}'::jsonb,
  '["Dans la mer", "Dans un lac", "Dans une grotte", "Dans le sol"]'::jsonb
);

-- Question 8 : Recyclage
INSERT INTO cultures_questions (id, question_text, question_type, category_id, answer, options)
VALUES (
  'q_nature_qcm_8',
  'Dans quelle poubelle jette-t-on les bouteilles en plastique ?',
  'qcm',
  6,

  '{"value": "Bleue (PMC)"}'::jsonb,
  '["Bleue (PMC)", "Verte", "Grise", "Jaune"]'::jsonb
);

-- Question 9 : Animaux de la ferme
INSERT INTO cultures_questions (id, question_text, question_type, category_id, answer, options)
VALUES (
  'q_nature_qcm_9',
  'Quel animal de la ferme nous donne du lait ?',
  'qcm',
  6,

  '{"value": "Vache"}'::jsonb,
  '["Vache", "Poule", "Cochon", "Mouton"]'::jsonb
);

-- Question 10 : Météo
INSERT INTO cultures_questions (id, question_text, question_type, category_id, answer, options)
VALUES (
  'q_nature_qcm_10',
  'Que voit-on dans le ciel après la pluie quand il y a du soleil ?',
  'qcm',
  6,

  '{"value": "Arc-en-ciel"}'::jsonb,
  '["Arc-en-ciel", "Étoiles", "Lune", "Nuages noirs"]'::jsonb
);

-- Question 11 : Plantes
INSERT INTO cultures_questions (id, question_text, question_type, category_id, answer, options)
VALUES (
  'q_nature_qcm_11',
  'De quoi une plante a-t-elle besoin pour grandir ?',
  'qcm',
  6,

  '{"value": "Eau et soleil"}'::jsonb,
  '["Eau et soleil", "Juste de l''eau", "Juste du soleil", "Du chocolat"]'::jsonb
);

-- Question 12 : Forêt
INSERT INTO cultures_questions (id, question_text, question_type, category_id, answer, options)
VALUES (
  'q_nature_qcm_12',
  'Quel animal construit des barrages dans les rivières ?',
  'qcm',
  6,

  '{"value": "Castor"}'::jsonb,
  '["Castor", "Loutre", "Rat", "Écureuil"]'::jsonb
);

-- Question 13 : Jardin
INSERT INTO cultures_questions (id, question_text, question_type, category_id, answer, options)
VALUES (
  'q_nature_qcm_13',
  'Quel insecte rouge à points noirs mange les pucerons ?',
  'qcm',
  6,

  '{"value": "Coccinelle"}'::jsonb,
  '["Coccinelle", "Papillon", "Mouche", "Fourmi"]'::jsonb
);

-- Question 14 : Nature
INSERT INTO cultures_questions (id, question_text, question_type, category_id, answer, options)
VALUES (
  'q_nature_qcm_14',
  'Comment appelle-t-on un bébé grenouille ?',
  'qcm',
  6,

  '{"value": "Têtard"}'::jsonb,
  '["Têtard", "Grenouillette", "Crapaud", "Rainette"]'::jsonb
);

-- Question 15 : Environnement
INSERT INTO cultures_questions (id, question_text, question_type, category_id, answer, options)
VALUES (
  'q_nature_qcm_15',
  'Que faut-il faire avec ses déchets en forêt ?',
  'qcm',
  6,

  '{"value": "Les ramener à la maison"}'::jsonb,
  '["Les ramener à la maison", "Les laisser par terre", "Les cacher sous une pierre", "Les donner aux animaux"]'::jsonb
);

-- =====================================================
-- 4. QUESTIONS TYPE VRAI-FAUX (10 questions)
-- =====================================================

-- Question 1
INSERT INTO cultures_questions (id, question_text, question_type, category_id, answer)
VALUES (
  'q_nature_vraifaux_1',
  'Les arbres produisent de l''oxygène pour nous aider à respirer.',
  'vrai-faux',
  6,

  '{"value": true}'::jsonb
);

-- Question 2
INSERT INTO cultures_questions (id, question_text, question_type, category_id, answer)
VALUES (
  'q_nature_vraifaux_2',
  'Les abeilles sont dangereuses et méchantes.',
  'vrai-faux',
  6,

  '{"value": false}'::jsonb
);

-- Question 3
INSERT INTO cultures_questions (id, question_text, question_type, category_id, answer)
VALUES (
  'q_nature_vraifaux_3',
  'Les champignons sont des plantes.',
  'vrai-faux',
  6,

  '{"value": false}'::jsonb
);

-- Question 4
INSERT INTO cultures_questions (id, question_text, question_type, category_id, answer)
VALUES (
  'q_nature_vraifaux_4',
  'Les oiseaux construisent des nids pour pondre leurs œufs.',
  'vrai-faux',
  6,

  '{"value": true}'::jsonb
);

-- Question 5
INSERT INTO cultures_questions (id, question_text, question_type, category_id, answer)
VALUES (
  'q_nature_vraifaux_5',
  'En hiver, tous les animaux hibernent.',
  'vrai-faux',
  6,

  '{"value": false}'::jsonb
);

-- Question 6
INSERT INTO cultures_questions (id, question_text, question_type, category_id, answer)
VALUES (
  'q_nature_vraifaux_6',
  'Les plantes ont besoin d''eau pour vivre.',
  'vrai-faux',
  6,

  '{"value": true}'::jsonb
);

-- Question 7
INSERT INTO cultures_questions (id, question_text, question_type, category_id, answer)
VALUES (
  'q_nature_vraifaux_7',
  'Les vers de terre sont nuisibles pour le jardin.',
  'vrai-faux',
  6,

  '{"value": false}'::jsonb
);

-- Question 8
INSERT INTO cultures_questions (id, question_text, question_type, category_id, answer)
VALUES (
  'q_nature_vraifaux_8',
  'Le recyclage aide à protéger la nature.',
  'vrai-faux',
  6,

  '{"value": true}'::jsonb
);

-- Question 9
INSERT INTO cultures_questions (id, question_text, question_type, category_id, answer)
VALUES (
  'q_nature_vraifaux_9',
  'Les araignées sont des insectes.',
  'vrai-faux',
  6,

  '{"value": false}'::jsonb
);

-- Question 10
INSERT INTO cultures_questions (id, question_text, question_type, category_id, answer)
VALUES (
  'q_nature_vraifaux_10',
  'Les feuilles changent de couleur en automne.',
  'vrai-faux',
  6,

  '{"value": true}'::jsonb
);

-- =====================================================
-- 5. QUESTIONS TYPE REMPLIR-BLANCS (5 questions)
-- =====================================================

-- Question 1
INSERT INTO cultures_questions (id, question_text, question_type, category_id, answer)
VALUES (
  'q_nature_blancs_1',
  'Les abeilles récoltent le ___ des fleurs pour faire du miel.',
  'remplir-blancs',
  6,

  '{"value": "nectar", "validateFlexible": true}'::jsonb
);

-- Question 2
INSERT INTO cultures_questions (id, question_text, question_type, category_id, answer)
VALUES (
  'q_nature_blancs_2',
  'Il y a ___ saisons dans une année.',
  'remplir-blancs',
  6,

  '{"value": "4", "validateFlexible": false}'::jsonb
);

-- Question 3
INSERT INTO cultures_questions (id, question_text, question_type, category_id, answer)
VALUES (
  'q_nature_blancs_3',
  'Le ___ est l''astre qui brille pendant la journée.',
  'remplir-blancs',
  6,

  '{"value": "soleil", "validateFlexible": true}'::jsonb
);

-- Question 4
INSERT INTO cultures_questions (id, question_text, question_type, category_id, answer)
VALUES (
  'q_nature_blancs_4',
  'Les ___ tombent des arbres en automne.',
  'remplir-blancs',
  6,

  '{"value": "feuilles", "validateFlexible": true}'::jsonb
);

-- Question 5
INSERT INTO cultures_questions (id, question_text, question_type, category_id, answer)
VALUES (
  'q_nature_blancs_5',
  'En Belgique, il fait le plus chaud en ___.',
  'remplir-blancs',
  6,

  '{"value": "été", "validateFlexible": true}'::jsonb
);

-- =====================================================
-- RÉSUMÉ
-- =====================================================
-- Total : 40 questions
-- - 10 questions INPUT (réponse libre)
-- - 15 questions QCM (choix multiple)
-- - 10 questions VRAI-FAUX
-- - 5 questions REMPLIR-BLANCS
-- 
-- Thèmes couverts :
-- - Arbres et plantes
-- - Animaux (forêt, ferme, insectes, oiseaux)
-- - Saisons et météo
-- - Cycle de la nature
-- - Environnement et recyclage
-- - Jardin et agriculture
-- =====================================================

