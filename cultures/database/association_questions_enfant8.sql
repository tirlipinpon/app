-- 40 Questions d'association pour enfant de 8 ans en Belgique
-- Culture générale, Sciences, Histoire, Géographie

-- Créer la catégorie Géographie si elle n'existe pas
INSERT INTO cultures_categories (id, key, name, icon, display_order, created_at) 
VALUES (4, 'geographie', '🌍 Géographie', '🌍', 4, NOW())
ON CONFLICT (id) DO NOTHING;

-- CULTURE GÉNÉRALE - 10 questions d'association (category_id = 1)
INSERT INTO cultures_questions (id, question_text, question_type, category_id, answer, created_at) VALUES

('q_assoc_culture_1', 'Associe chaque fruit à sa couleur', 'association', 1, 
 '{"left": ["Pomme", "Banane", "Cerise", "Orange"], "right": ["Rouge", "Jaune", "Rouge", "Orange"], "pairs": [["Pomme", "Rouge"], ["Banane", "Jaune"], ["Cerise", "Rouge"], ["Orange", "Orange"]]}', NOW()),

('q_assoc_culture_2', 'Associe chaque animal à son petit', 'association', 1, 
 '{"left": ["Chat", "Chien", "Vache", "Poule"], "right": ["Chaton", "Chiot", "Veau", "Poussin"], "pairs": [["Chat", "Chaton"], ["Chien", "Chiot"], ["Vache", "Veau"], ["Poule", "Poussin"]]}', NOW()),

('q_assoc_culture_3', 'Associe chaque métier à son outil', 'association', 1, 
 '{"left": ["Boulanger", "Coiffeur", "Médecin", "Jardinier"], "right": ["Four", "Ciseaux", "Stéthoscope", "Arrosoir"], "pairs": [["Boulanger", "Four"], ["Coiffeur", "Ciseaux"], ["Médecin", "Stéthoscope"], ["Jardinier", "Arrosoir"]]}', NOW()),

('q_assoc_culture_4', 'Associe chaque sport à son équipement', 'association', 1, 
 '{"left": ["Football", "Tennis", "Natation", "Vélo"], "right": ["Ballon", "Raquette", "Maillot", "Casque"], "pairs": [["Football", "Ballon"], ["Tennis", "Raquette"], ["Natation", "Maillot"], ["Vélo", "Casque"]]}', NOW()),

('q_assoc_culture_5', 'Associe chaque véhicule à son conducteur', 'association', 1, 
 '{"left": ["Bus", "Taxi", "Ambulance", "Camion"], "right": ["Chauffeur", "Taxis", "Ambulancier", "Routier"], "pairs": [["Bus", "Chauffeur"], ["Taxi", "Taxis"], ["Ambulance", "Ambulancier"], ["Camion", "Routier"]]}', NOW()),

('q_assoc_culture_6', 'Associe chaque instrument à sa famille', 'association', 1, 
 '{"left": ["Piano", "Violon", "Trompette", "Tambour"], "right": ["Clavier", "Cordes", "Cuivres", "Percussion"], "pairs": [["Piano", "Clavier"], ["Violon", "Cordes"], ["Trompette", "Cuivres"], ["Tambour", "Percussion"]]}', NOW()),

('q_assoc_culture_7', 'Associe chaque couleur à son mélange', 'association', 1, 
 '{"left": ["Rouge", "Bleu", "Jaune", "Blanc"], "right": ["Rouge + Blanc", "Bleu + Jaune", "Jaune + Rouge", "Toutes les couleurs"], "pairs": [["Rouge", "Rouge + Blanc"], ["Bleu", "Bleu + Jaune"], ["Jaune", "Jaune + Rouge"], ["Blanc", "Toutes les couleurs"]]}', NOW()),

('q_assoc_culture_8', 'Associe chaque mois à sa saison', 'association', 1, 
 '{"left": ["Décembre", "Mars", "Juin", "Septembre"], "right": ["Hiver", "Printemps", "Été", "Automne"], "pairs": [["Décembre", "Hiver"], ["Mars", "Printemps"], ["Juin", "Été"], ["Septembre", "Automne"]]}', NOW()),

('q_assoc_culture_9', 'Associe chaque vêtement à sa partie du corps', 'association', 1, 
 '{"left": ["Chapeau", "Gants", "Chaussettes", "Ceinture"], "right": ["Tête", "Mains", "Pieds", "Taille"], "pairs": [["Chapeau", "Tête"], ["Gants", "Mains"], ["Chaussettes", "Pieds"], ["Ceinture", "Taille"]]}', NOW()),

('q_assoc_culture_10', 'Associe chaque pièce à son meuble', 'association', 1, 
 '{"left": ["Cuisine", "Chambre", "Salon", "Salle de bain"], "right": ["Réfrigérateur", "Lit", "Canapé", "Baignoire"], "pairs": [["Cuisine", "Réfrigérateur"], ["Chambre", "Lit"], ["Salon", "Canapé"], ["Salle de bain", "Baignoire"]]}', NOW());

-- SCIENCES - 10 questions d'association (category_id = 2)
INSERT INTO cultures_questions (id, question_text, question_type, category_id, answer, created_at) VALUES

('q_assoc_science_1', 'Associe chaque animal à son habitat', 'association', 2, 
 '{"left": ["Ours", "Dauphin", "Aigle", "Chameau"], "right": ["Forêt", "Océan", "Montagne", "Désert"], "pairs": [["Ours", "Forêt"], ["Dauphin", "Océan"], ["Aigle", "Montagne"], ["Chameau", "Désert"]]}', NOW()),

('q_assoc_science_2', 'Associe chaque planète à sa couleur', 'association', 2, 
 '{"left": ["Terre", "Mars", "Jupiter", "Neptune"], "right": ["Bleue", "Rouge", "Orange", "Bleue"], "pairs": [["Terre", "Bleue"], ["Mars", "Rouge"], ["Jupiter", "Orange"], ["Neptune", "Bleue"]]}', NOW()),

('q_assoc_science_3', 'Associe chaque matière à son état', 'association', 2, 
 '{"left": ["Eau", "Glace", "Vapeur", "Métal"], "right": ["Liquide", "Solide", "Gaz", "Solide"], "pairs": [["Eau", "Liquide"], ["Glace", "Solide"], ["Vapeur", "Gaz"], ["Métal", "Solide"]]}', NOW()),

('q_assoc_science_4', 'Associe chaque organe à sa fonction', 'association', 2, 
 '{"left": ["Cœur", "Poumons", "Estomac", "Cerveau"], "right": ["Pomper", "Respirer", "Digérer", "Penser"], "pairs": [["Cœur", "Pomper"], ["Poumons", "Respirer"], ["Estomac", "Digérer"], ["Cerveau", "Penser"]]}', NOW()),

('q_assoc_science_5', 'Associe chaque saison à sa température', 'association', 2, 
 '{"left": ["Été", "Hiver", "Printemps", "Automne"], "right": ["Chaud", "Froid", "Doux", "Fraîs"], "pairs": [["Été", "Chaud"], ["Hiver", "Froid"], ["Printemps", "Doux"], ["Automne", "Fraîs"]]}', NOW()),

('q_assoc_science_6', 'Associe chaque plante à sa partie comestible', 'association', 2, 
 '{"left": ["Carotte", "Salade", "Pomme", "Blé"], "right": ["Racine", "Feuilles", "Fruit", "Graines"], "pairs": [["Carotte", "Racine"], ["Salade", "Feuilles"], ["Pomme", "Fruit"], ["Blé", "Graines"]]}', NOW()),

('q_assoc_science_7', 'Associe chaque phénomène à sa cause', 'association', 2, 
 '{"left": ["Arc-en-ciel", "Tonnerre", "Vent", "Éclipse"], "right": ["Pluie + Soleil", "Éclair", "Air qui bouge", "Lune devant Soleil"], "pairs": [["Arc-en-ciel", "Pluie + Soleil"], ["Tonnerre", "Éclair"], ["Vent", "Air qui bouge"], ["Éclipse", "Lune devant Soleil"]]}', NOW()),

('q_assoc_science_8', 'Associe chaque animal à son régime alimentaire', 'association', 2, 
 '{"left": ["Lion", "Vache", "Ours", "Mouche"], "right": ["Carnivore", "Herbivore", "Omnivore", "Détritivore"], "pairs": [["Lion", "Carnivore"], ["Vache", "Herbivore"], ["Ours", "Omnivore"], ["Mouche", "Détritivore"]]}', NOW()),

('q_assoc_science_9', 'Associe chaque machine à son énergie', 'association', 2, 
 '{"left": ["Voiture", "Éolienne", "Panneau solaire", "Lampe"], "right": ["Essence", "Vent", "Soleil", "Électricité"], "pairs": [["Voiture", "Essence"], ["Éolienne", "Vent"], ["Panneau solaire", "Soleil"], ["Lampe", "Électricité"]]}', NOW()),

('q_assoc_science_10', 'Associe chaque sens à son organe', 'association', 2, 
 '{"left": ["Vue", "Ouïe", "Toucher", "Goût"], "right": ["Yeux", "Oreilles", "Peau", "Langue"], "pairs": [["Vue", "Yeux"], ["Ouïe", "Oreilles"], ["Toucher", "Peau"], ["Goût", "Langue"]]}', NOW());

-- HISTOIRE - 10 questions d'association (category_id = 3)
INSERT INTO cultures_questions (id, question_text, question_type, category_id, answer, created_at) VALUES

('q_assoc_histoire_1', 'Associe chaque civilisation à son continent', 'association', 3, 
 '{"left": ["Égyptiens", "Grecs", "Mayas", "Chinois"], "right": ["Afrique", "Europe", "Amérique", "Asie"], "pairs": [["Égyptiens", "Afrique"], ["Grecs", "Europe"], ["Mayas", "Amérique"], ["Chinois", "Asie"]]}', NOW()),

('q_assoc_histoire_2', 'Associe chaque roi à son pays', 'association', 3, 
 '{"left": ["Louis XIV", "Élisabeth II", "Philippe le Bel", "Charlemagne"], "right": ["France", "Angleterre", "France", "France"], "pairs": [["Louis XIV", "France"], ["Élisabeth II", "Angleterre"], ["Philippe le Bel", "France"], ["Charlemagne", "France"]]}', NOW()),

('q_assoc_histoire_3', 'Associe chaque invention à son inventeur', 'association', 3, 
 '{"left": ["Ampoule", "Téléphone", "Avion", "Imprimerie"], "right": ["Edison", "Bell", "Wright", "Gutenberg"], "pairs": [["Ampoule", "Edison"], ["Téléphone", "Bell"], ["Avion", "Wright"], ["Imprimerie", "Gutenberg"]]}', NOW()),

('q_assoc_histoire_4', 'Associe chaque monument à sa ville', 'association', 3, 
 '{"left": ["Tour Eiffel", "Big Ben", "Colisée", "Pyramides"], "right": ["Paris", "Londres", "Rome", "Le Caire"], "pairs": [["Tour Eiffel", "Paris"], ["Big Ben", "Londres"], ["Colisée", "Rome"], ["Pyramides", "Le Caire"]]}', NOW()),

('q_assoc_histoire_5', 'Associe chaque guerre à sa période', 'association', 3, 
 '{"left": ["Guerre de Cent Ans", "Première Guerre mondiale", "Seconde Guerre mondiale", "Guerre froide"], "right": ["Moyen Âge", "1914-1918", "1939-1945", "Après 1945"], "pairs": [["Guerre de Cent Ans", "Moyen Âge"], ["Première Guerre mondiale", "1914-1918"], ["Seconde Guerre mondiale", "1939-1945"], ["Guerre froide", "Après 1945"]]}', NOW()),

('q_assoc_histoire_6', 'Associe chaque artiste à son art', 'association', 3, 
 '{"left": ["Léonard de Vinci", "Mozart", "Michel-Ange", "Shakespeare"], "right": ["Peinture", "Musique", "Sculpture", "Littérature"], "pairs": [["Léonard de Vinci", "Peinture"], ["Mozart", "Musique"], ["Michel-Ange", "Sculpture"], ["Shakespeare", "Littérature"]]}', NOW()),

('q_assoc_histoire_7', 'Associe chaque époque à son vêtement', 'association', 3, 
 '{"left": ["Préhistoire", "Moyen Âge", "Renaissance", "XXe siècle"], "right": ["Peaux", "Armure", "Costume", "Jeans"], "pairs": [["Préhistoire", "Peaux"], ["Moyen Âge", "Armure"], ["Renaissance", "Costume"], ["XXe siècle", "Jeans"]]}', NOW()),

('q_assoc_histoire_8', 'Associe chaque transport à son époque', 'association', 3, 
 '{"left": ["Char à cheval", "Train à vapeur", "Automobile", "Fusée"], "right": ["Antiquité", "XIXe siècle", "XXe siècle", "XXIe siècle"], "pairs": [["Char à cheval", "Antiquité"], ["Train à vapeur", "XIXe siècle"], ["Automobile", "XXe siècle"], ["Fusée", "XXIe siècle"]]}', NOW()),

('q_assoc_histoire_9', 'Associe chaque découverte à son explorateur', 'association', 3, 
 '{"left": ["Amérique", "Route des Indes", "Australie", "Pôle Nord"], "right": ["Christophe Colomb", "Vasco de Gama", "James Cook", "Robert Peary"], "pairs": [["Amérique", "Christophe Colomb"], ["Route des Indes", "Vasco de Gama"], ["Australie", "James Cook"], ["Pôle Nord", "Robert Peary"]]}', NOW()),

('q_assoc_histoire_10', 'Associe chaque révolution à son pays', 'association', 3, 
 '{"left": ["Révolution française", "Révolution industrielle", "Révolution russe", "Indépendance américaine"], "right": ["France", "Angleterre", "Russie", "États-Unis"], "pairs": [["Révolution française", "France"], ["Révolution industrielle", "Angleterre"], ["Révolution russe", "Russie"], ["Indépendance américaine", "États-Unis"]]}', NOW());

-- GÉOGRAPHIE - 10 questions d'association (category_id = 4)
INSERT INTO cultures_questions (id, question_text, question_type, category_id, answer, created_at) VALUES

('q_assoc_geo_1', 'Associe chaque capitale à son pays', 'association', 4, 
 '{"left": ["Bruxelles", "Paris", "Berlin", "Madrid"], "right": ["Belgique", "France", "Allemagne", "Espagne"], "pairs": [["Bruxelles", "Belgique"], ["Paris", "France"], ["Berlin", "Allemagne"], ["Madrid", "Espagne"]]}', NOW()),

('q_assoc_geo_2', 'Associe chaque fleuve à son pays', 'association', 4, 
 '{"left": ["Seine", "Rhin", "Escaut", "Meuse"], "right": ["France", "Allemagne", "Belgique", "Belgique"], "pairs": [["Seine", "France"], ["Rhin", "Allemagne"], ["Escaut", "Belgique"], ["Meuse", "Belgique"]]}', NOW()),

('q_assoc_geo_3', 'Associe chaque montagne à son continent', 'association', 4, 
 '{"left": ["Alpes", "Himalaya", "Andes", "Kilimandjaro"], "right": ["Europe", "Asie", "Amérique", "Afrique"], "pairs": [["Alpes", "Europe"], ["Himalaya", "Asie"], ["Andes", "Amérique"], ["Kilimandjaro", "Afrique"]]}', NOW()),

('q_assoc_geo_4', 'Associe chaque océan à sa caractéristique', 'association', 4, 
 '{"left": ["Atlantique", "Pacifique", "Indien", "Arctique"], "right": ["Entre Europe et Amérique", "Le plus grand", "Le plus chaud", "Le plus froid"], "pairs": [["Atlantique", "Entre Europe et Amérique"], ["Pacifique", "Le plus grand"], ["Indien", "Le plus chaud"], ["Arctique", "Le plus froid"]]}', NOW()),

('q_assoc_geo_5', 'Associe chaque ville belge à sa région', 'association', 4, 
 '{"left": ["Bruxelles", "Anvers", "Liège", "Gand"], "right": ["Bruxelles", "Flandre", "Wallonie", "Flandre"], "pairs": [["Bruxelles", "Bruxelles"], ["Anvers", "Flandre"], ["Liège", "Wallonie"], ["Gand", "Flandre"]]}', NOW()),

('q_assoc_geo_6', 'Associe chaque climat à sa végétation', 'association', 4, 
 '{"left": ["Équatorial", "Désertique", "Polaire", "Tempéré"], "right": ["Forêt tropicale", "Cactus", "Toundra", "Prairies"], "pairs": [["Équatorial", "Forêt tropicale"], ["Désertique", "Cactus"], ["Polaire", "Toundra"], ["Tempéré", "Prairies"]]}', NOW()),

('q_assoc_geo_7', 'Associe chaque île à son océan', 'association', 4, 
 '{"left": ["Madagascar", "Hawaii", "Groenland", "Tasmanie"], "right": ["Indien", "Pacifique", "Arctique", "Indien"], "pairs": [["Madagascar", "Indien"], ["Hawaii", "Pacifique"], ["Groenland", "Arctique"], ["Tasmanie", "Indien"]]}', NOW()),

('q_assoc_geo_8', 'Associe chaque pays à sa monnaie', 'association', 4, 
 '{"left": ["Belgique", "États-Unis", "Japon", "Royaume-Uni"], "right": ["Euro", "Dollar", "Yen", "Livre"], "pairs": [["Belgique", "Euro"], ["États-Unis", "Dollar"], ["Japon", "Yen"], ["Royaume-Uni", "Livre"]]}', NOW()),

('q_assoc_geo_9', 'Associe chaque désert à son continent', 'association', 4, 
 '{"left": ["Sahara", "Gobi", "Atacama", "Kalahari"], "right": ["Afrique", "Asie", "Amérique", "Afrique"], "pairs": [["Sahara", "Afrique"], ["Gobi", "Asie"], ["Atacama", "Amérique"], ["Kalahari", "Afrique"]]}', NOW()),

('q_assoc_geo_10', 'Associe chaque mer à sa caractéristique', 'association', 4, 
 '{"left": ["Méditerranée", "Mer du Nord", "Mer Rouge", "Mer Morte"], "right": ["Entre Europe et Afrique", "Près de la Belgique", "Très salée", "Sans vie"], "pairs": [["Méditerranée", "Entre Europe et Afrique"], ["Mer du Nord", "Près de la Belgique"], ["Mer Rouge", "Très salée"], ["Mer Morte", "Sans vie"]]}', NOW());
