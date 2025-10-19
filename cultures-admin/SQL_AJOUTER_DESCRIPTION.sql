-- Ajouter la colonne description à la table cultures_categories
-- À exécuter dans Supabase SQL Editor

ALTER TABLE cultures_categories 
ADD COLUMN IF NOT EXISTS description TEXT;

-- Vérifier
SELECT * FROM cultures_categories LIMIT 3;

