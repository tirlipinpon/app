-- =====================================================
-- 40 QUESTIONS TIMELINE POUR ENFANTS 8-9 ANS
-- =====================================================
-- Date: 19 octobre 2025
-- 10 questions par thème : Culture générale, Science, Histoire, Nature
-- =====================================================

-- =====================================================
-- CULTURE GÉNÉRALE (10 questions)
-- =====================================================

-- Question 1 : Moments de la journée
INSERT INTO cultures_questions (id, question_text, question_type, category_id, answer, options)
VALUES (
  'q_timeline_culture_1',
  'Place les moments d''une journée dans l''ordre',
  'timeline',
  1,
  '["evt_jour_1", "evt_jour_2", "evt_jour_3", "evt_jour_4"]'::jsonb,
  '[
    {"id": "evt_jour_1", "text": "Lever du soleil", "emoji": "🌅"},
    {"id": "evt_jour_2", "text": "Midi", "emoji": "☀️"},
    {"id": "evt_jour_3", "text": "Coucher du soleil", "emoji": "🌇"},
    {"id": "evt_jour_4", "text": "Minuit", "emoji": "🌙"}
  ]'::jsonb
);

-- Question 2 : Repas de la journée
INSERT INTO cultures_questions (id, question_text, question_type, category_id, answer, options)
VALUES (
  'q_timeline_culture_2',
  'Place les repas dans l''ordre de la journée',
  'timeline',
  1,
  '["evt_repas_1", "evt_repas_2", "evt_repas_3", "evt_repas_4"]'::jsonb,
  '[
    {"id": "evt_repas_1", "text": "Petit-déjeuner", "emoji": "🥐"},
    {"id": "evt_repas_2", "text": "Déjeuner", "emoji": "🍽️"},
    {"id": "evt_repas_3", "text": "Goûter", "emoji": "🍪"},
    {"id": "evt_repas_4", "text": "Dîner", "emoji": "🍝"}
  ]'::jsonb
);

-- Question 3 : Âges de la vie
INSERT INTO cultures_questions (id, question_text, question_type, category_id, answer, options)
VALUES (
  'q_timeline_culture_3',
  'Place les étapes de la vie humaine dans l''ordre',
  'timeline',
  1,
  '["evt_vie_1", "evt_vie_2", "evt_vie_3", "evt_vie_4"]'::jsonb,
  '[
    {"id": "evt_vie_1", "text": "Bébé", "emoji": "👶"},
    {"id": "evt_vie_2", "text": "Enfant", "emoji": "👧"},
    {"id": "evt_vie_3", "text": "Adulte", "emoji": "👨"},
    {"id": "evt_vie_4", "text": "Personne âgée", "emoji": "👴"}
  ]'::jsonb
);

-- Question 4 : Jours de la semaine
INSERT INTO cultures_questions (id, question_text, question_type, category_id, answer, options)
VALUES (
  'q_timeline_culture_4',
  'Place ces jours dans l''ordre de la semaine',
  'timeline',
  1,
  '["evt_sem_1", "evt_sem_2", "evt_sem_3", "evt_sem_4"]'::jsonb,
  '[
    {"id": "evt_sem_1", "text": "Lundi", "emoji": "📅"},
    {"id": "evt_sem_2", "text": "Mercredi", "emoji": "📅"},
    {"id": "evt_sem_3", "text": "Vendredi", "emoji": "📅"},
    {"id": "evt_sem_4", "text": "Dimanche", "emoji": "📅"}
  ]'::jsonb
);

-- Question 5 : Mois de l'année
INSERT INTO cultures_questions (id, question_text, question_type, category_id, answer, options)
VALUES (
  'q_timeline_culture_5',
  'Place ces mois dans l''ordre de l''année',
  'timeline',
  1,
  '["evt_mois_1", "evt_mois_2", "evt_mois_3", "evt_mois_4"]'::jsonb,
  '[
    {"id": "evt_mois_1", "text": "Janvier", "emoji": "❄️"},
    {"id": "evt_mois_2", "text": "Avril", "emoji": "🌸"},
    {"id": "evt_mois_3", "text": "Juillet", "emoji": "☀️"},
    {"id": "evt_mois_4", "text": "Décembre", "emoji": "🎄"}
  ]'::jsonb
);

-- Question 6 : Fabrication du pain
INSERT INTO cultures_questions (id, question_text, question_type, category_id, answer, options)
VALUES (
  'q_timeline_culture_6',
  'Place dans l''ordre la fabrication du pain',
  'timeline',
  1,
  '["evt_pain_1", "evt_pain_2", "evt_pain_3", "evt_pain_4"]'::jsonb,
  '[
    {"id": "evt_pain_1", "text": "Mélanger la farine", "emoji": "🥣"},
    {"id": "evt_pain_2", "text": "Pétrir la pâte", "emoji": "👐"},
    {"id": "evt_pain_3", "text": "Laisser lever", "emoji": "⏰"},
    {"id": "evt_pain_4", "text": "Cuire au four", "emoji": "🔥"}
  ]'::jsonb
);

-- Question 7 : Faire du vélo
INSERT INTO cultures_questions (id, question_text, question_type, category_id, answer, options)
VALUES (
  'q_timeline_culture_7',
  'Place dans l''ordre les étapes pour apprendre à faire du vélo',
  'timeline',
  1,
  '["evt_velo_1", "evt_velo_2", "evt_velo_3", "evt_velo_4"]'::jsonb,
  '[
    {"id": "evt_velo_1", "text": "Petites roulettes", "emoji": "🎡"},
    {"id": "evt_velo_2", "text": "Papa qui tient", "emoji": "👨"},
    {"id": "evt_velo_3", "text": "Premiers essais", "emoji": "🚲"},
    {"id": "evt_velo_4", "text": "Rouler tout seul", "emoji": "🎉"}
  ]'::jsonb
);

-- Question 8 : Faire un gâteau
INSERT INTO cultures_questions (id, question_text, question_type, category_id, answer, options)
VALUES (
  'q_timeline_culture_8',
  'Place dans l''ordre les étapes pour faire un gâteau',
  'timeline',
  1,
  '["evt_gateau_1", "evt_gateau_2", "evt_gateau_3", "evt_gateau_4"]'::jsonb,
  '[
    {"id": "evt_gateau_1", "text": "Mélanger les ingrédients", "emoji": "🥄"},
    {"id": "evt_gateau_2", "text": "Verser dans le moule", "emoji": "🍰"},
    {"id": "evt_gateau_3", "text": "Cuire au four", "emoji": "🔥"},
    {"id": "evt_gateau_4", "text": "Décorer et manger", "emoji": "🎂"}
  ]'::jsonb
);

-- Question 9 : Se préparer pour l'école
INSERT INTO cultures_questions (id, question_text, question_type, category_id, answer, options)
VALUES (
  'q_timeline_culture_9',
  'Place dans l''ordre ce que tu fais le matin avant l''école',
  'timeline',
  1,
  '["evt_matin_1", "evt_matin_2", "evt_matin_3", "evt_matin_4"]'::jsonb,
  '[
    {"id": "evt_matin_1", "text": "Se réveiller", "emoji": "😴"},
    {"id": "evt_matin_2", "text": "Prendre le petit-déjeuner", "emoji": "🥐"},
    {"id": "evt_matin_3", "text": "Se brosser les dents", "emoji": "🪥"},
    {"id": "evt_matin_4", "text": "Partir à l''école", "emoji": "🎒"}
  ]'::jsonb
);

-- Question 10 : Construction d'une maison
INSERT INTO cultures_questions (id, question_text, question_type, category_id, answer, options)
VALUES (
  'q_timeline_culture_10',
  'Place dans l''ordre la construction d''une maison',
  'timeline',
  1,
  '["evt_maison_1", "evt_maison_2", "evt_maison_3", "evt_maison_4"]'::jsonb,
  '[
    {"id": "evt_maison_1", "text": "Creuser les fondations", "emoji": "⛏️"},
    {"id": "evt_maison_2", "text": "Monter les murs", "emoji": "🧱"},
    {"id": "evt_maison_3", "text": "Poser le toit", "emoji": "🏠"},
    {"id": "evt_maison_4", "text": "Peindre et décorer", "emoji": "🎨"}
  ]'::jsonb
);

-- =====================================================
-- SCIENCE (10 questions)
-- =====================================================

-- Question 1 : Cycle de vie du papillon
INSERT INTO cultures_questions (id, question_text, question_type, category_id, answer, options)
VALUES (
  'q_timeline_science_1',
  'Place dans l''ordre le cycle de vie du papillon',
  'timeline',
  2,
  '["evt_papillon_1", "evt_papillon_2", "evt_papillon_3", "evt_papillon_4"]'::jsonb,
  '[
    {"id": "evt_papillon_1", "text": "Œuf", "emoji": "🥚"},
    {"id": "evt_papillon_2", "text": "Chenille", "emoji": "🐛"},
    {"id": "evt_papillon_3", "text": "Chrysalide", "emoji": "🧬"},
    {"id": "evt_papillon_4", "text": "Papillon", "emoji": "🦋"}
  ]'::jsonb
);

-- Question 2 : Cycle de vie de la grenouille
INSERT INTO cultures_questions (id, question_text, question_type, category_id, answer, options)
VALUES (
  'q_timeline_science_2',
  'Place dans l''ordre le cycle de vie de la grenouille',
  'timeline',
  2,
  '["evt_grenouille_1", "evt_grenouille_2", "evt_grenouille_3", "evt_grenouille_4"]'::jsonb,
  '[
    {"id": "evt_grenouille_1", "text": "Œufs dans l''eau", "emoji": "🥚"},
    {"id": "evt_grenouille_2", "text": "Têtard", "emoji": "🐟"},
    {"id": "evt_grenouille_3", "text": "Têtard avec pattes", "emoji": "🦎"},
    {"id": "evt_grenouille_4", "text": "Grenouille adulte", "emoji": "🐸"}
  ]'::jsonb
);

-- Question 3 : Phases de la Lune
INSERT INTO cultures_questions (id, question_text, question_type, category_id, answer, options)
VALUES (
  'q_timeline_science_3',
  'Place dans l''ordre les phases de la Lune',
  'timeline',
  2,
  '["evt_lune_1", "evt_lune_2", "evt_lune_3", "evt_lune_4"]'::jsonb,
  '[
    {"id": "evt_lune_1", "text": "Nouvelle Lune", "emoji": "🌑"},
    {"id": "evt_lune_2", "text": "Premier quartier", "emoji": "🌓"},
    {"id": "evt_lune_3", "text": "Pleine Lune", "emoji": "🌕"},
    {"id": "evt_lune_4", "text": "Dernier quartier", "emoji": "🌗"}
  ]'::jsonb
);

-- Question 4 : Cycle de l'eau
INSERT INTO cultures_questions (id, question_text, question_type, category_id, answer, options)
VALUES (
  'q_timeline_science_4',
  'Place dans l''ordre le cycle de l''eau',
  'timeline',
  2,
  '["evt_eau_1", "evt_eau_2", "evt_eau_3", "evt_eau_4"]'::jsonb,
  '[
    {"id": "evt_eau_1", "text": "Évaporation", "emoji": "☀️"},
    {"id": "evt_eau_2", "text": "Formation nuages", "emoji": "☁️"},
    {"id": "evt_eau_3", "text": "Pluie", "emoji": "🌧️"},
    {"id": "evt_eau_4", "text": "Retour à la mer", "emoji": "🌊"}
  ]'::jsonb
);

-- Question 5 : Digestion
INSERT INTO cultures_questions (id, question_text, question_type, category_id, answer, options)
VALUES (
  'q_timeline_science_5',
  'Place dans l''ordre le trajet de la nourriture dans le corps',
  'timeline',
  2,
  '["evt_digest_1", "evt_digest_2", "evt_digest_3", "evt_digest_4"]'::jsonb,
  '[
    {"id": "evt_digest_1", "text": "Bouche (mâcher)", "emoji": "👄"},
    {"id": "evt_digest_2", "text": "Œsophage (avaler)", "emoji": "🔽"},
    {"id": "evt_digest_3", "text": "Estomac (digérer)", "emoji": "🫃"},
    {"id": "evt_digest_4", "text": "Intestins (absorber)", "emoji": "🔄"}
  ]'::jsonb
);

-- Question 6 : Expérience scientifique
INSERT INTO cultures_questions (id, question_text, question_type, category_id, answer, options)
VALUES (
  'q_timeline_science_6',
  'Place dans l''ordre les étapes d''une expérience scientifique',
  'timeline',
  2,
  '["evt_exp_1", "evt_exp_2", "evt_exp_3", "evt_exp_4"]'::jsonb,
  '[
    {"id": "evt_exp_1", "text": "Poser une question", "emoji": "❓"},
    {"id": "evt_exp_2", "text": "Faire l''expérience", "emoji": "🔬"},
    {"id": "evt_exp_3", "text": "Observer les résultats", "emoji": "👀"},
    {"id": "evt_exp_4", "text": "Tirer une conclusion", "emoji": "💡"}
  ]'::jsonb
);

-- Question 7 : États de l'eau
INSERT INTO cultures_questions (id, question_text, question_type, category_id, answer, options)
VALUES (
  'q_timeline_science_7',
  'Place dans l''ordre le passage de la glace à la vapeur',
  'timeline',
  2,
  '["evt_glace_1", "evt_glace_2", "evt_glace_3"]'::jsonb,
  '[
    {"id": "evt_glace_1", "text": "Glace (solide)", "emoji": "🧊"},
    {"id": "evt_glace_2", "text": "Eau (liquide)", "emoji": "💧"},
    {"id": "evt_glace_3", "text": "Vapeur (gaz)", "emoji": "💨"}
  ]'::jsonb
);

-- Question 8 : Système solaire (du Soleil vers l'extérieur)
INSERT INTO cultures_questions (id, question_text, question_type, category_id, answer, options)
VALUES (
  'q_timeline_science_8',
  'Place ces planètes dans l''ordre depuis le Soleil',
  'timeline',
  2,
  '["evt_planete_1", "evt_planete_2", "evt_planete_3", "evt_planete_4"]'::jsonb,
  '[
    {"id": "evt_planete_1", "text": "Mercure", "emoji": "☿️"},
    {"id": "evt_planete_2", "text": "Vénus", "emoji": "♀️"},
    {"id": "evt_planete_3", "text": "Terre", "emoji": "🌍"},
    {"id": "evt_planete_4", "text": "Mars", "emoji": "♂️"}
  ]'::jsonb
);

-- Question 9 : Croissance humaine
INSERT INTO cultures_questions (id, question_text, question_type, category_id, answer, options)
VALUES (
  'q_timeline_science_9',
  'Place dans l''ordre la croissance d''un enfant',
  'timeline',
  2,
  '["evt_croiss_1", "evt_croiss_2", "evt_croiss_3", "evt_croiss_4"]'::jsonb,
  '[
    {"id": "evt_croiss_1", "text": "Naissance", "emoji": "👶"},
    {"id": "evt_croiss_2", "text": "Premiers pas", "emoji": "🚶"},
    {"id": "evt_croiss_3", "text": "Premières dents", "emoji": "🦷"},
    {"id": "evt_croiss_4", "text": "Aller à l''école", "emoji": "🎒"}
  ]'::jsonb
);

-- Question 10 : Évolution de la météo
INSERT INTO cultures_questions (id, question_text, question_type, category_id, answer, options)
VALUES (
  'q_timeline_science_10',
  'Place dans l''ordre l''évolution d''un orage',
  'timeline',
  2,
  '["evt_orage_1", "evt_orage_2", "evt_orage_3", "evt_orage_4"]'::jsonb,
  '[
    {"id": "evt_orage_1", "text": "Nuages s''accumulent", "emoji": "☁️"},
    {"id": "evt_orage_2", "text": "Éclair", "emoji": "⚡"},
    {"id": "evt_orage_3", "text": "Tonnerre", "emoji": "💥"},
    {"id": "evt_orage_4", "text": "Pluie forte", "emoji": "🌧️"}
  ]'::jsonb
);

-- =====================================================
-- HISTOIRE (10 questions)
-- =====================================================

-- Question 1 : Préhistoire à aujourd'hui
INSERT INTO cultures_questions (id, question_text, question_type, category_id, answer, options)
VALUES (
  'q_timeline_histoire_1',
  'Place ces périodes dans l''ordre de l''histoire',
  'timeline',
  3,
  '["evt_hist_1", "evt_hist_2", "evt_hist_3", "evt_hist_4"]'::jsonb,
  '[
    {"id": "evt_hist_1", "text": "Préhistoire", "emoji": "🦴"},
    {"id": "evt_hist_2", "text": "Antiquité", "emoji": "🏛️"},
    {"id": "evt_hist_3", "text": "Moyen Âge", "emoji": "🏰"},
    {"id": "evt_hist_4", "text": "Époque moderne", "emoji": "🚀"}
  ]'::jsonb
);

-- Question 2 : Vie d'un château fort
INSERT INTO cultures_questions (id, question_text, question_type, category_id, answer, options)
VALUES (
  'q_timeline_histoire_2',
  'Place dans l''ordre la construction et la vie d''un château',
  'timeline',
  3,
  '["evt_chateau_1", "evt_chateau_2", "evt_chateau_3", "evt_chateau_4"]'::jsonb,
  '[
    {"id": "evt_chateau_1", "text": "Construction", "emoji": "🏗️"},
    {"id": "evt_chateau_2", "text": "Vie des chevaliers", "emoji": "⚔️"},
    {"id": "evt_chateau_3", "text": "Défense du château", "emoji": "🛡️"},
    {"id": "evt_chateau_4", "text": "Ruines aujourd''hui", "emoji": "🏚️"}
  ]'::jsonb
);

-- Question 3 : Journée d'un roi
INSERT INTO cultures_questions (id, question_text, question_type, category_id, answer, options)
VALUES (
  'q_timeline_histoire_3',
  'Place dans l''ordre une journée du roi Louis XIV',
  'timeline',
  3,
  '["evt_roi_1", "evt_roi_2", "evt_roi_3", "evt_roi_4"]'::jsonb,
  '[
    {"id": "evt_roi_1", "text": "Lever du roi", "emoji": "👑"},
    {"id": "evt_roi_2", "text": "Conseil royal", "emoji": "📜"},
    {"id": "evt_roi_3", "text": "Grand banquet", "emoji": "🍷"},
    {"id": "evt_roi_4", "text": "Coucher du roi", "emoji": "🛏️"}
  ]'::jsonb
);

-- Question 4 : Voyage de Christophe Colomb
INSERT INTO cultures_questions (id, question_text, question_type, category_id, answer, options)
VALUES (
  'q_timeline_histoire_4',
  'Place dans l''ordre le voyage de Christophe Colomb',
  'timeline',
  3,
  '["evt_colomb_1", "evt_colomb_2", "evt_colomb_3", "evt_colomb_4"]'::jsonb,
  '[
    {"id": "evt_colomb_1", "text": "Départ d''Espagne", "emoji": "⛵"},
    {"id": "evt_colomb_2", "text": "Traversée océan", "emoji": "🌊"},
    {"id": "evt_colomb_3", "text": "Découverte terre", "emoji": "🏝️"},
    {"id": "evt_colomb_4", "text": "Retour en Europe", "emoji": "🏰"}
  ]'::jsonb
);

-- Question 5 : Âge de pierre
INSERT INTO cultures_questions (id, question_text, question_type, category_id, answer, options)
VALUES (
  'q_timeline_histoire_5',
  'Place dans l''ordre les inventions préhistoriques',
  'timeline',
  3,
  '["evt_prehist_1", "evt_prehist_2", "evt_prehist_3", "evt_prehist_4"]'::jsonb,
  '[
    {"id": "evt_prehist_1", "text": "Découverte du feu", "emoji": "🔥"},
    {"id": "evt_prehist_2", "text": "Outils en pierre", "emoji": "🪨"},
    {"id": "evt_prehist_3", "text": "Peintures rupestres", "emoji": "🎨"},
    {"id": "evt_prehist_4", "text": "Roue", "emoji": "⚙️"}
  ]'::jsonb
);

-- Question 6 : Égypte antique
INSERT INTO cultures_questions (id, question_text, question_type, category_id, answer, options)
VALUES (
  'q_timeline_histoire_6',
  'Place dans l''ordre la construction d''une pyramide égyptienne',
  'timeline',
  3,
  '["evt_pyramide_1", "evt_pyramide_2", "evt_pyramide_3", "evt_pyramide_4"]'::jsonb,
  '[
    {"id": "evt_pyramide_1", "text": "Plans du pharaon", "emoji": "📜"},
    {"id": "evt_pyramide_2", "text": "Tailler les pierres", "emoji": "🪨"},
    {"id": "evt_pyramide_3", "text": "Transport des blocs", "emoji": "🚚"},
    {"id": "evt_pyramide_4", "text": "Pyramide terminée", "emoji": "🔺"}
  ]'::jsonb
);

-- Question 7 : Guerres mondiales
INSERT INTO cultures_questions (id, question_text, question_type, category_id, answer, options)
VALUES (
  'q_timeline_histoire_7',
  'Place ces événements du 20ème siècle dans l''ordre',
  'timeline',
  3,
  '["evt_guerre_1", "evt_guerre_2", "evt_guerre_3", "evt_guerre_4"]'::jsonb,
  '[
    {"id": "evt_guerre_1", "text": "Première Guerre mondiale", "emoji": "⚔️"},
    {"id": "evt_guerre_2", "text": "Années folles", "emoji": "🎺"},
    {"id": "evt_guerre_3", "text": "Seconde Guerre mondiale", "emoji": "✈️"},
    {"id": "evt_guerre_4", "text": "Chute du mur de Berlin", "emoji": "🧱"}
  ]'::jsonb
);

-- Question 8 : Histoire de la Belgique
INSERT INTO cultures_questions (id, question_text, question_type, category_id, answer, options)
VALUES (
  'q_timeline_histoire_8',
  'Place dans l''ordre l''histoire de la Belgique',
  'timeline',
  3,
  '["evt_belg_1", "evt_belg_2", "evt_belg_3", "evt_belg_4"]'::jsonb,
  '[
    {"id": "evt_belg_1", "text": "Moyen Âge", "emoji": "🏰"},
    {"id": "evt_belg_2", "text": "Domination espagnole", "emoji": "🇪🇸"},
    {"id": "evt_belg_3", "text": "Indépendance 1830", "emoji": "🇧🇪"},
    {"id": "evt_belg_4", "text": "Belgique moderne", "emoji": "🏛️"}
  ]'::jsonb
);

-- Question 9 : Évolution des transports
INSERT INTO cultures_questions (id, question_text, question_type, category_id, answer, options)
VALUES (
  'q_timeline_histoire_9',
  'Place dans l''ordre l''évolution des moyens de transport',
  'timeline',
  3,
  '["evt_transport_1", "evt_transport_2", "evt_transport_3", "evt_transport_4"]'::jsonb,
  '[
    {"id": "evt_transport_1", "text": "Marche à pied", "emoji": "🚶"},
    {"id": "evt_transport_2", "text": "Cheval", "emoji": "🐴"},
    {"id": "evt_transport_3", "text": "Train à vapeur", "emoji": "🚂"},
    {"id": "evt_transport_4", "text": "Avion", "emoji": "✈️"}
  ]'::jsonb
);

-- Question 10 : Évolution de la communication
INSERT INTO cultures_questions (id, question_text, question_type, category_id, answer, options)
VALUES (
  'q_timeline_histoire_10',
  'Place dans l''ordre l''évolution de la communication',
  'timeline',
  3,
  '["evt_comm_1", "evt_comm_2", "evt_comm_3", "evt_comm_4"]'::jsonb,
  '[
    {"id": "evt_comm_1", "text": "Messager à pied", "emoji": "🏃"},
    {"id": "evt_comm_2", "text": "Lettre par pigeon", "emoji": "🕊️"},
    {"id": "evt_comm_3", "text": "Téléphone", "emoji": "☎️"},
    {"id": "evt_comm_4", "text": "Internet", "emoji": "💻"}
  ]'::jsonb
);

-- =====================================================
-- NATURE (10 questions)
-- =====================================================

-- Question 1 : Saisons
INSERT INTO cultures_questions (id, question_text, question_type, category_id, answer, options)
VALUES (
  'q_timeline_nature_1',
  'Place les saisons dans l''ordre (commence par le printemps)',
  'timeline',
  6,
  '["evt_saison_1", "evt_saison_2", "evt_saison_3", "evt_saison_4"]'::jsonb,
  '[
    {"id": "evt_saison_1", "text": "Printemps", "emoji": "🌸"},
    {"id": "evt_saison_2", "text": "Été", "emoji": "☀️"},
    {"id": "evt_saison_3", "text": "Automne", "emoji": "🍂"},
    {"id": "evt_saison_4", "text": "Hiver", "emoji": "❄️"}
  ]'::jsonb
);

-- Question 2 : Croissance d'une plante
INSERT INTO cultures_questions (id, question_text, question_type, category_id, answer, options)
VALUES (
  'q_timeline_nature_2',
  'Place dans l''ordre la croissance d''une plante',
  'timeline',
  6,
  '["evt_plante_1", "evt_plante_2", "evt_plante_3", "evt_plante_4"]'::jsonb,
  '[
    {"id": "evt_plante_1", "text": "Graine plantée", "emoji": "🌱"},
    {"id": "evt_plante_2", "text": "Pousse sort de terre", "emoji": "🌿"},
    {"id": "evt_plante_3", "text": "Fleur apparaît", "emoji": "🌸"},
    {"id": "evt_plante_4", "text": "Fruit mûr", "emoji": "🍎"}
  ]'::jsonb
);

-- Question 3 : Vie d'un arbre
INSERT INTO cultures_questions (id, question_text, question_type, category_id, answer, options)
VALUES (
  'q_timeline_nature_3',
  'Place dans l''ordre la vie d''un chêne',
  'timeline',
  6,
  '["evt_chene_1", "evt_chene_2", "evt_chene_3", "evt_chene_4"]'::jsonb,
  '[
    {"id": "evt_chene_1", "text": "Gland tombe", "emoji": "🌰"},
    {"id": "evt_chene_2", "text": "Jeune pousse", "emoji": "🌱"},
    {"id": "evt_chene_3", "text": "Grand arbre", "emoji": "🌳"},
    {"id": "evt_chene_4", "text": "Arbre centenaire", "emoji": "🎄"}
  ]'::jsonb
);

-- Question 4 : Journée d'une abeille
INSERT INTO cultures_questions (id, question_text, question_type, category_id, answer, options)
VALUES (
  'q_timeline_nature_4',
  'Place dans l''ordre la journée d''une abeille',
  'timeline',
  6,
  '["evt_abeille_1", "evt_abeille_2", "evt_abeille_3", "evt_abeille_4"]'::jsonb,
  '[
    {"id": "evt_abeille_1", "text": "Sortie de la ruche", "emoji": "🏠"},
    {"id": "evt_abeille_2", "text": "Butinage fleurs", "emoji": "🌸"},
    {"id": "evt_abeille_3", "text": "Retour à la ruche", "emoji": "🐝"},
    {"id": "evt_abeille_4", "text": "Fabrication du miel", "emoji": "🍯"}
  ]'::jsonb
);

-- Question 5 : Taille d'un jardin
INSERT INTO cultures_questions (id, question_text, question_type, category_id, answer, options)
VALUES (
  'q_timeline_nature_5',
  'Place dans l''ordre les étapes pour créer un jardin',
  'timeline',
  6,
  '["evt_jardin_1", "evt_jardin_2", "evt_jardin_3", "evt_jardin_4"]'::jsonb,
  '[
    {"id": "evt_jardin_1", "text": "Préparer la terre", "emoji": "⛏️"},
    {"id": "evt_jardin_2", "text": "Planter les graines", "emoji": "🌱"},
    {"id": "evt_jardin_3", "text": "Arroser régulièrement", "emoji": "💧"},
    {"id": "evt_jardin_4", "text": "Récolter les légumes", "emoji": "🥕"}
  ]'::jsonb
);

-- Question 6 : Météo d'une journée
INSERT INTO cultures_questions (id, question_text, question_type, category_id, answer, options)
VALUES (
  'q_timeline_nature_6',
  'Place dans l''ordre la météo d''une journée changeante',
  'timeline',
  6,
  '["evt_meteo_1", "evt_meteo_2", "evt_meteo_3", "evt_meteo_4"]'::jsonb,
  '[
    {"id": "evt_meteo_1", "text": "Soleil du matin", "emoji": "🌅"},
    {"id": "evt_meteo_2", "text": "Nuages arrivent", "emoji": "☁️"},
    {"id": "evt_meteo_3", "text": "Pluie l''après-midi", "emoji": "🌧️"},
    {"id": "evt_meteo_4", "text": "Arc-en-ciel", "emoji": "🌈"}
  ]'::jsonb
);

-- Question 7 : Migration des oiseaux
INSERT INTO cultures_questions (id, question_text, question_type, category_id, answer, options)
VALUES (
  'q_timeline_nature_7',
  'Place dans l''ordre la migration des hirondelles',
  'timeline',
  6,
  '["evt_hirond_1", "evt_hirond_2", "evt_hirond_3", "evt_hirond_4"]'::jsonb,
  '[
    {"id": "evt_hirond_1", "text": "Printemps : arrivée", "emoji": "🌸"},
    {"id": "evt_hirond_2", "text": "Été : nidification", "emoji": "🪺"},
    {"id": "evt_hirond_3", "text": "Automne : préparation", "emoji": "🍂"},
    {"id": "evt_hirond_4", "text": "Hiver : départ au sud", "emoji": "✈️"}
  ]'::jsonb
);

-- Question 8 : De la vache au lait
INSERT INTO cultures_questions (id, question_text, question_type, category_id, answer, options)
VALUES (
  'q_timeline_nature_8',
  'Place dans l''ordre le chemin du lait',
  'timeline',
  6,
  '["evt_lait_1", "evt_lait_2", "evt_lait_3", "evt_lait_4"]'::jsonb,
  '[
    {"id": "evt_lait_1", "text": "Vache broute l''herbe", "emoji": "🐄"},
    {"id": "evt_lait_2", "text": "Traite du lait", "emoji": "🥛"},
    {"id": "evt_lait_3", "text": "Pasteurisation", "emoji": "🔬"},
    {"id": "evt_lait_4", "text": "Bouteille au magasin", "emoji": "🏪"}
  ]'::jsonb
);

-- Question 9 : Cycle jour/nuit
INSERT INTO cultures_questions (id, question_text, question_type, category_id, answer, options)
VALUES (
  'q_timeline_nature_9',
  'Place dans l''ordre un cycle jour/nuit',
  'timeline',
  6,
  '["evt_cycle_1", "evt_cycle_2", "evt_cycle_3", "evt_cycle_4"]'::jsonb,
  '[
    {"id": "evt_cycle_1", "text": "Aube", "emoji": "🌄"},
    {"id": "evt_cycle_2", "text": "Plein jour", "emoji": "☀️"},
    {"id": "evt_cycle_3", "text": "Crépuscule", "emoji": "🌆"},
    {"id": "evt_cycle_4", "text": "Nuit étoilée", "emoji": "⭐"}
  ]'::jsonb
);

-- Question 10 : De la fleur au fruit
INSERT INTO cultures_questions (id, question_text, question_type, category_id, answer, options)
VALUES (
  'q_timeline_nature_10',
  'Place dans l''ordre la transformation d''une fleur en fruit',
  'timeline',
  6,
  '["evt_fruit_1", "evt_fruit_2", "evt_fruit_3", "evt_fruit_4"]'::jsonb,
  '[
    {"id": "evt_fruit_1", "text": "Fleur s''ouvre", "emoji": "🌸"},
    {"id": "evt_fruit_2", "text": "Abeille pollinise", "emoji": "🐝"},
    {"id": "evt_fruit_3", "text": "Fleur se fane", "emoji": "🥀"},
    {"id": "evt_fruit_4", "text": "Fruit pousse", "emoji": "🍎"}
  ]'::jsonb
);

-- =====================================================
-- RÉSUMÉ
-- =====================================================
-- Total : 40 questions TIMELINE
-- - 10 Culture générale (vie quotidienne, activités)
-- - 10 Science (cycles naturels, corps humain, planètes)
-- - 10 Histoire (périodes, événements, inventions)
-- - 10 Nature (saisons, plantes, animaux, météo)
-- =====================================================

