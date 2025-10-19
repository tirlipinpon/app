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
  'Clique sur la Belgique',
  'map-click',
  4, -- Géographie
  '"belgium"'::jsonb,
  '{
    "mapImage": "https://example.com/map-europe.png",
    "zones": [
      {"id": "belgium", "name": "Belgique", "coords": {"x": 45, "y": 30, "width": 8, "height": 8}},
      {"id": "france", "name": "France", "coords": {"x": 35, "y": 40, "width": 12, "height": 15}},
      {"id": "germany", "name": "Allemagne", "coords": {"x": 52, "y": 32, "width": 10, "height": 12}},
      {"id": "netherlands", "name": "Pays-Bas", "coords": {"x": 46, "y": 25, "width": 7, "height": 6}}
    ]
  }'::jsonb
);

-- Question 2 : Paris sur carte de France
INSERT INTO cultures_questions (id, question_text, question_type, category_id, answer, options)
VALUES (
  'q_mapclick_2',
  'Clique sur Paris (la capitale de la France)',
  'map-click',
  4, -- Géographie
  '"paris"'::jsonb,
  '{
    "mapImage": "https://example.com/map-france.png",
    "zones": [
      {"id": "paris", "name": "Paris", "coords": {"x": 48, "y": 35, "width": 5, "height": 5}},
      {"id": "marseille", "name": "Marseille", "coords": {"x": 55, "y": 70, "width": 5, "height": 5}},
      {"id": "lyon", "name": "Lyon", "coords": {"x": 52, "y": 50, "width": 5, "height": 5}},
      {"id": "bordeaux", "name": "Bordeaux", "coords": {"x": 30, "y": 55, "width": 5, "height": 5}}
    ]
  }'::jsonb
);

-- Question 3 : L'Afrique sur planisphère
INSERT INTO cultures_questions (id, question_text, question_type, category_id, answer, options)
VALUES (
  'q_mapclick_3',
  'Clique sur le continent africain',
  'map-click',
  4, -- Géographie
  '"africa"'::jsonb,
  '{
    "mapImage": "https://example.com/world-map.png",
    "zones": [
      {"id": "africa", "name": "Afrique", "coords": {"x": 45, "y": 50, "width": 15, "height": 20}},
      {"id": "europe", "name": "Europe", "coords": {"x": 48, "y": 25, "width": 12, "height": 15}},
      {"id": "asia", "name": "Asie", "coords": {"x": 65, "y": 30, "width": 25, "height": 25}},
      {"id": "america", "name": "Amérique", "coords": {"x": 15, "y": 30, "width": 15, "height": 40}}
    ]
  }'::jsonb
);

-- Question 4 : Océan Atlantique
INSERT INTO cultures_questions (id, question_text, question_type, category_id, answer, options)
VALUES (
  'q_mapclick_4',
  'Clique sur l''océan Atlantique',
  'map-click',
  4, -- Géographie
  '"atlantic"'::jsonb,
  '{
    "mapImage": "https://example.com/world-map.png",
    "zones": [
      {"id": "atlantic", "name": "Atlantique", "coords": {"x": 20, "y": 35, "width": 15, "height": 30}},
      {"id": "pacific", "name": "Pacifique", "coords": {"x": 5, "y": 30, "width": 10, "height": 35}},
      {"id": "indian", "name": "Indien", "coords": {"x": 65, "y": 50, "width": 15, "height": 20}},
      {"id": "mediterranean", "name": "Méditerranée", "coords": {"x": 48, "y": 38, "width": 8, "height": 4}}
    ]
  }'::jsonb
);

-- Question 5 : Bruxelles en Belgique
INSERT INTO cultures_questions (id, question_text, question_type, category_id, answer, options)
VALUES (
  'q_mapclick_5',
  'Clique sur Bruxelles (la capitale de la Belgique)',
  'map-click',
  4, -- Géographie
  '"brussels"'::jsonb,
  '{
    "mapImage": "https://example.com/map-belgium.png",
    "zones": [
      {"id": "brussels", "name": "Bruxelles", "coords": {"x": 48, "y": 45, "width": 6, "height": 6}},
      {"id": "antwerp", "name": "Anvers", "coords": {"x": 52, "y": 30, "width": 6, "height": 6}},
      {"id": "liege", "name": "Liège", "coords": {"x": 65, "y": 48, "width": 6, "height": 6}},
      {"id": "bruges", "name": "Bruges", "coords": {"x": 35, "y": 25, "width": 6, "height": 6}}
    ]
  }'::jsonb
);

-- =====================================================
-- NOTES IMPORTANTES
-- =====================================================
-- 
-- Pour MAP-CLICK :
-- Les URLs des images sont des exemples (https://example.com)
-- Il faudra remplacer par de vraies images :
--   - Option 1 : Héberger dans Supabase Storage
--   - Option 2 : Utiliser des URLs publiques d'images de cartes
--   - Option 3 : Créer des cartes SVG simples
-- 
-- Les coordonnées (x, y, width, height) sont en pourcentage (0-100)
-- par rapport à la taille de l'image
-- 
-- Pour TIMELINE :
-- Les events doivent avoir un ID unique et un ordre logique
-- L'utilisateur glisse les cartes sur une ligne du temps visuelle
-- =====================================================

