-- ============================================
-- CULTURES GAME - SUPABASE DATABASE SCHEMA
-- Version: 1.0.0
-- Description: Questions et catégories uniquement
--              (Réponses et progression dans le frontend)
-- ============================================

-- 1. TABLE DES CATÉGORIES
CREATE TABLE cultures_categories (
  id SERIAL PRIMARY KEY,
  key VARCHAR(50) UNIQUE NOT NULL,
  name VARCHAR(100) NOT NULL,
  icon VARCHAR(10) NOT NULL,
  display_order INT NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Index pour recherche rapide
CREATE INDEX idx_cultures_categories_key ON cultures_categories(key);

-- Données initiales
INSERT INTO cultures_categories (id, key, name, icon, display_order) VALUES
  (0, 'toutes', '📦 Toutes', '📦', 0),
  (1, 'culture', '🎭 Culture générale', '🎭', 1),
  (2, 'science', '🔬 Science', '🔬', 2),
  (3, 'histoire', '📜 Histoire', '📜', 3);

-- Reset sequence
SELECT setval('cultures_categories_id_seq', (SELECT MAX(id) FROM cultures_categories));


-- 2. TABLE DES QUESTIONS
CREATE TABLE cultures_questions (
  id VARCHAR(100) PRIMARY KEY,
  question_text TEXT NOT NULL,
  category_id INT NOT NULL REFERENCES cultures_categories(id) ON DELETE CASCADE,
  question_type VARCHAR(50) NOT NULL CHECK (
    question_type IN ('input', 'qcm', 'vrai-faux', 'ordre', 'association', 'glisser-deposer', 'remplir-blancs')
  ),
  
  -- Options/items pour l'affichage (QCM, ordre, etc.)
  -- SANS les réponses correctes (qui restent dans le frontend)
  options JSONB,
  
  -- Tags optionnels
  tags TEXT[],
  
  -- Hint généré par IA (NULL tant que pas généré)
  hint TEXT,
  
  -- Activation/désactivation
  is_active BOOLEAN DEFAULT true,
  
  -- Timestamps
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Index pour performances
CREATE INDEX idx_cultures_questions_category ON cultures_questions(category_id);
CREATE INDEX idx_cultures_questions_type ON cultures_questions(question_type);
CREATE INDEX idx_cultures_questions_active ON cultures_questions(is_active);

-- Trigger pour updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_cultures_questions_updated_at
  BEFORE UPDATE ON cultures_questions
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();


-- ============================================
-- EXEMPLES DE QUESTIONS
-- ============================================

-- CULTURE GÉNÉRALE
INSERT INTO cultures_questions (id, question_text, category_id, question_type, options, tags) VALUES
('q_culture_1', 'Quelle est la capitale de la France ?', 1, 'input', NULL, ARRAY['géographie', 'europe']),
('q_culture_2', 'Associe chaque pays à sa capitale', 1, 'association', '{"left": ["France", "Allemagne", "Italie"], "right": ["Paris", "Berlin", "Rome", "Madrid"]}', ARRAY['géographie', 'capitales']),
('q_culture_3', 'La tour Eiffel mesure ___ mètres de hauteur.', 1, 'remplir-blancs', NULL, ARRAY['monuments', 'france']),
('q_culture_4', 'Qui a peint la Joconde ?', 1, 'qcm', '["Léonard de Vinci", "Michel-Ange", "Raphaël", "Botticelli"]', ARRAY['art', 'peinture']),
('q_culture_5', 'Quel est le plus grand océan du monde ?', 1, 'qcm', '["Pacifique", "Atlantique", "Indien", "Arctique"]', ARRAY['géographie', 'océans']),
('q_culture_6', 'Associe chaque instrument à sa famille', 1, 'association', '{"left": ["Violon", "Trompette", "Flûte"], "right": ["Cordes", "Cuivres", "Bois", "Percussion"]}', ARRAY['musique']),
('q_culture_7', 'Shakespeare a écrit "Roméo et Juliette".', 1, 'vrai-faux', NULL, ARRAY['littérature', 'théâtre']),
('q_culture_8', 'Quel pays a inventé la pizza ?', 1, 'qcm', '["Italie", "France", "Grèce", "Espagne"]', ARRAY['gastronomie']),
('q_culture_9', 'Combien de continents y a-t-il sur Terre ?', 1, 'input', NULL, ARRAY['géographie']),
('q_culture_10', 'La Statue de la Liberté a été offerte par ___.', 1, 'remplir-blancs', NULL, ARRAY['histoire', 'monuments']);

-- SCIENCE
INSERT INTO cultures_questions (id, question_text, category_id, question_type, options, tags) VALUES
('q_science_1', 'L''eau bout à 100°C au niveau de la mer.', 2, 'vrai-faux', NULL, ARRAY['physique', 'eau']),
('q_science_2', 'Classe ces animaux dans la bonne catégorie', 2, 'glisser-deposer', '{"categories": ["Mammifères", "Reptiles"], "items": ["Chat", "Serpent", "Chien", "Lézard"]}', ARRAY['biologie', 'animaux']),
('q_science_3', 'Quelle est la formule chimique de l''eau ?', 2, 'input', NULL, ARRAY['chimie']),
('q_science_4', 'La Terre est plate.', 2, 'vrai-faux', NULL, ARRAY['astronomie']),
('q_science_5', 'Combien de planètes compte notre système solaire ?', 2, 'input', NULL, ARRAY['astronomie']),
('q_science_6', 'Classe ces éléments selon leur état à température ambiante', 2, 'glisser-deposer', '{"categories": ["Solide", "Liquide", "Gaz"], "items": ["Fer", "Eau", "Oxygène", "Sel"]}', ARRAY['chimie', 'états']),
('q_science_7', 'Quel gaz respirons-nous principalement ?', 2, 'qcm', '["Azote", "Oxygène", "Dioxyde de carbone", "Hydrogène"]', ARRAY['biologie', 'respiration']),
('q_science_8', 'Classe ces planètes du plus proche au plus éloigné du Soleil', 2, 'ordre', '["Mars", "Terre", "Vénus", "Mercure"]', ARRAY['astronomie', 'système solaire']),
('q_science_9', 'Le corps humain contient ___ os à l''âge adulte.', 2, 'remplir-blancs', NULL, ARRAY['anatomie']),
('q_science_10', 'La vitesse de la lumière est d''environ ___ km/s.', 2, 'input', NULL, ARRAY['physique']);

-- HISTOIRE
INSERT INTO cultures_questions (id, question_text, category_id, question_type, options, tags) VALUES
('q_histoire_1', 'Qui a découvert l''Amérique en 1492 ?', 3, 'qcm', '["Christophe Colomb", "Magellan", "Vasco de Gama", "Marco Polo"]', ARRAY['découvertes', 'explorateurs']),
('q_histoire_2', 'Classe ces événements par ordre chronologique', 3, 'ordre', '["Révolution française", "Première Guerre mondiale", "Chute du mur de Berlin"]', ARRAY['chronologie', 'europe']),
('q_histoire_3', 'En quelle année a eu lieu la Révolution française ?', 3, 'qcm', '["1789", "1799", "1776", "1804"]', ARRAY['france', 'révolution']),
('q_histoire_4', 'La Seconde Guerre mondiale s''est terminée en 1945.', 3, 'vrai-faux', NULL, ARRAY['guerre']),
('q_histoire_5', 'Classe ces rois de France par ordre chronologique', 3, 'ordre', '["Louis XIV", "Louis XVI", "Napoléon Bonaparte"]', ARRAY['france', 'monarchie']),
('q_histoire_6', 'Quel empereur français a été exilé à Sainte-Hélène ?', 3, 'input', NULL, ARRAY['france', 'napoléon']),
('q_histoire_7', 'La chute du mur de Berlin a eu lieu en ___.', 3, 'remplir-blancs', NULL, ARRAY['allemagne', 'guerre froide']),
('q_histoire_8', 'Associe chaque civilisation à son continent', 3, 'association', '{"left": ["Égyptiens", "Mayas", "Grecs"], "right": ["Afrique", "Amérique", "Europe", "Asie"]}', ARRAY['civilisations']),
('q_histoire_9', 'Jules César était un empereur romain.', 3, 'vrai-faux', NULL, ARRAY['rome', 'antiquité']),
('q_histoire_10', 'Qui était le premier président des États-Unis ?', 3, 'qcm', '["George Washington", "Thomas Jefferson", "Abraham Lincoln", "Benjamin Franklin"]', ARRAY['usa', 'présidents']);


-- ============================================
-- POLITIQUES RLS (Row Level Security)
-- ============================================

-- Activer RLS
ALTER TABLE cultures_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE cultures_questions ENABLE ROW LEVEL SECURITY;

-- Tout le monde peut lire les catégories
CREATE POLICY "Categories are viewable by everyone"
  ON cultures_categories FOR SELECT
  USING (true);

-- Tout le monde peut lire les questions actives
CREATE POLICY "Active questions are viewable by everyone"
  ON cultures_questions FOR SELECT
  USING (is_active = true);

-- Si vous voulez permettre la mise à jour des hints (pour l'IA)
CREATE POLICY "Anyone can update hints"
  ON cultures_questions FOR UPDATE
  USING (true)
  WITH CHECK (true);


-- ============================================
-- FONCTIONS UTILES
-- ============================================

-- Fonction pour récupérer les questions d'une catégorie
CREATE OR REPLACE FUNCTION get_questions_by_category(p_category_key VARCHAR)
RETURNS TABLE (
  id VARCHAR,
  question_text TEXT,
  category_id INT,
  question_type VARCHAR,
  options JSONB,
  tags TEXT[],
  hint TEXT
) AS $$
BEGIN
  IF p_category_key = 'toutes' OR p_category_key = '0' THEN
    -- Toutes les questions actives
    RETURN QUERY
    SELECT q.id, q.question_text, q.category_id, q.question_type, q.options, q.tags, q.hint
    FROM cultures_questions q
    WHERE q.is_active = true
    ORDER BY RANDOM();
  ELSE
    -- Questions d'une catégorie spécifique
    RETURN QUERY
    SELECT q.id, q.question_text, q.category_id, q.question_type, q.options, q.tags, q.hint
    FROM cultures_questions q
    JOIN cultures_categories c ON q.category_id = c.id
    WHERE q.is_active = true AND c.key = p_category_key
    ORDER BY RANDOM();
  END IF;
END;
$$ LANGUAGE plpgsql;


-- Fonction pour mettre à jour le hint après génération IA
CREATE OR REPLACE FUNCTION update_question_hint(p_question_id VARCHAR, p_hint TEXT)
RETURNS VOID AS $$
BEGIN
  UPDATE cultures_questions
  SET hint = p_hint, updated_at = NOW()
  WHERE id = p_question_id;
END;
$$ LANGUAGE plpgsql;


-- ============================================
-- VUES UTILES
-- ============================================

-- Vue pour avoir les questions avec leur catégorie
CREATE OR REPLACE VIEW v_cultures_questions_with_category AS
SELECT 
  q.id,
  q.question_text,
  q.question_type,
  q.options,
  q.tags,
  q.hint,
  c.key as category_key,
  c.name as category_name,
  c.icon as category_icon
FROM cultures_questions q
JOIN cultures_categories c ON q.category_id = c.id
WHERE q.is_active = true;


-- Vue pour statistiques (nombre de questions par catégorie)
CREATE OR REPLACE VIEW v_cultures_category_stats AS
SELECT 
  c.key,
  c.name,
  c.icon,
  COUNT(q.id) as question_count
FROM cultures_categories c
LEFT JOIN cultures_questions q ON c.id = q.category_id AND q.is_active = true
WHERE c.key != 'toutes'
GROUP BY c.id, c.key, c.name, c.icon
ORDER BY c.display_order;


-- ============================================
-- NOTES D'UTILISATION
-- ============================================

-- Pour exécuter ce script :
-- 1. Ouvrez Supabase Dashboard
-- 2. Allez dans "SQL Editor"
-- 3. Créez une nouvelle query
-- 4. Copiez-collez tout ce fichier
-- 5. Exécutez (Run)

-- Pour ajouter des questions :
-- INSERT INTO cultures_questions (id, question_text, category_id, question_type, options, tags) VALUES
-- ('votre_id', 'Votre question ?', 1, 'qcm', '["Option 1", "Option 2"]', ARRAY['tag1']);

-- Pour récupérer les questions d'une catégorie :
-- SELECT * FROM get_questions_by_category('science');

-- Pour voir les stats :
-- SELECT * FROM v_cultures_category_stats;

