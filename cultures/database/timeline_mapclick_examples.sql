-- =====================================================
-- QUESTIONS EXEMPLES : TIMELINE & MAP-CLICK
-- =====================================================
-- Date: 19 octobre 2025
-- Public: Enfants de 8-9 ans (Belgique)
-- =====================================================

-- =====================================================
-- 1. QUESTIONS TYPE TIMELINE (5 questions)
-- =====================================================

-- Question 1 : Cycle de vie du papillon
INSERT INTO cultures_questions (id, question_text, question_type, category_id, answer, options)
VALUES (
  'q_timeline_1',
  'Place dans le bon ordre le cycle de vie du papillon',
  'timeline',
  2, -- Science
  '["evt_papillon_1", "evt_papillon_2", "evt_papillon_3", "evt_papillon_4"]'::jsonb,
  '[
    {"id": "evt_papillon_1", "text": "Œuf", "emoji": "🥚"},
    {"id": "evt_papillon_2", "text": "Chenille", "emoji": "🐛"},
    {"id": "evt_papillon_3", "text": "Chrysalide", "emoji": "🧬"},
    {"id": "evt_papillon_4", "text": "Papillon", "emoji": "🦋"}
  ]'::jsonb
);

-- Question 2 : Les saisons
INSERT INTO cultures_questions (id, question_text, question_type, category_id, answer, options)
VALUES (
  'q_timeline_2',
  'Place les saisons dans l''ordre de l''année (commence par le printemps)',
  'timeline',
  6, -- Nature
  '["evt_saison_1", "evt_saison_2", "evt_saison_3", "evt_saison_4"]'::jsonb,
  '[
    {"id": "evt_saison_1", "text": "Printemps", "emoji": "🌸"},
    {"id": "evt_saison_2", "text": "Été", "emoji": "☀️"},
    {"id": "evt_saison_3", "text": "Automne", "emoji": "🍂"},
    {"id": "evt_saison_4", "text": "Hiver", "emoji": "❄️"}
  ]'::jsonb
);

-- Question 3 : Une journée type
INSERT INTO cultures_questions (id, question_text, question_type, category_id, answer, options)
VALUES (
  'q_timeline_3',
  'Place les moments d''une journée dans l''ordre',
  'timeline',
  1, -- Culture générale
  '["evt_jour_1", "evt_jour_2", "evt_jour_3", "evt_jour_4"]'::jsonb,
  '[
    {"id": "evt_jour_1", "text": "Lever du soleil", "emoji": "🌅"},
    {"id": "evt_jour_2", "text": "Midi", "emoji": "☀️"},
    {"id": "evt_jour_3", "text": "Coucher du soleil", "emoji": "🌇"},
    {"id": "evt_jour_4", "text": "Minuit", "emoji": "🌙"}
  ]'::jsonb
);

-- Question 4 : Croissance d'une plante
INSERT INTO cultures_questions (id, question_text, question_type, category_id, answer, options)
VALUES (
  'q_timeline_4',
  'Place dans l''ordre la croissance d''une plante',
  'timeline',
  6, -- Nature
  '["evt_plante_1", "evt_plante_2", "evt_plante_3", "evt_plante_4"]'::jsonb,
  '[
    {"id": "evt_plante_1", "text": "Graine plantée", "emoji": "🌱"},
    {"id": "evt_plante_2", "text": "Pousse sort de terre", "emoji": "🌿"},
    {"id": "evt_plante_3", "text": "Fleur apparaît", "emoji": "🌸"},
    {"id": "evt_plante_4", "text": "Fruit mûr", "emoji": "🍎"}
  ]'::jsonb
);

-- Question 5 : Histoire de la vie
INSERT INTO cultures_questions (id, question_text, question_type, category_id, answer, options)
VALUES (
  'q_timeline_5',
  'Place dans l''ordre les grandes étapes de la vie humaine',
  'timeline',
  1, -- Culture générale
  '["evt_vie_1", "evt_vie_2", "evt_vie_3", "evt_vie_4"]'::jsonb,
  '[
    {"id": "evt_vie_1", "text": "Bébé", "emoji": "👶"},
    {"id": "evt_vie_2", "text": "Enfant", "emoji": "👧"},
    {"id": "evt_vie_3", "text": "Adulte", "emoji": "👨"},
    {"id": "evt_vie_4", "text": "Personne âgée", "emoji": "👴"}
  ]'::jsonb
);

-- =====================================================
-- 2. QUESTIONS TYPE MAP-CLICK (5 questions)
-- =====================================================

-- Note : Pour map-click, il faut des images de cartes.
-- Pour l'instant, je crée la structure SQL.
-- Les images devront être hébergées (Supabase Storage ou URL externe)

-- Question 1 : Belgique sur carte d'Europe
INSERT INTO cultures_questions (id, question_text, question_type, category_id, answer, options)
VALUES (
  'q_mapclick_1',
  'Clique sur la Belgique 🇧🇪',
  'map-click',
  4, -- Géographie
  '"belgium"'::jsonb,
  '"europe"'::jsonb
);

-- Question 2 : Paris sur carte de France
INSERT INTO cultures_questions (id, question_text, question_type, category_id, answer, options)
VALUES (
  'q_mapclick_2',
  'Clique sur Paris (la capitale de la France) 🇫🇷',
  'map-click',
  4, -- Géographie
  '"paris"'::jsonb,
  '"france"'::jsonb
);

-- Question 3 : L'Afrique sur planisphère
INSERT INTO cultures_questions (id, question_text, question_type, category_id, answer, options)
VALUES (
  'q_mapclick_3',
  'Clique sur le continent africain 🌍',
  'map-click',
  4, -- Géographie
  '"africa"'::jsonb,
  '"world"'::jsonb
);

-- Question 4 : Europe (différente de Q1)
INSERT INTO cultures_questions (id, question_text, question_type, category_id, answer, options)
VALUES (
  'q_mapclick_4',
  'Clique sur la France 🇫🇷',
  'map-click',
  4, -- Géographie
  '"france"'::jsonb,
  '"europe"'::jsonb
);

-- Question 5 : Bruxelles en Belgique
INSERT INTO cultures_questions (id, question_text, question_type, category_id, answer, options)
VALUES (
  'q_mapclick_5',
  'Clique sur Bruxelles (la capitale de la Belgique)',
  'map-click',
  4, -- Géographie
  '"brussels"'::jsonb,
  '"belgium"'::jsonb
);

-- =====================================================
-- NOTES IMPORTANTES
-- =====================================================
-- 
-- Pour MAP-CLICK :
-- Les cartes sont des SVG définis dans js/mapSvgs.js
-- Cartes disponibles : 'europe', 'world', 'france', 'belgium'
-- Les zones cliquables sont définies dans les SVG avec data-zone="id"
-- 
-- Pour TIMELINE :
-- Les events doivent avoir un ID unique et un ordre logique
-- Format : [{id, text, emoji}, ...]
-- L'utilisateur glisse les cartes sur une ligne du temps visuelle
-- 
-- AVANT d'exécuter ce script :
-- 1. Exécuter add_new_question_types.sql pour autoriser les nouveaux types
-- 2. S'assurer que mapSvgs.js est chargé dans index.html
-- =====================================================

