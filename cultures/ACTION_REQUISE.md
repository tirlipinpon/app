# ⚠️ ACTION REQUISE - Dernière étape

## 🗄️ Exécuter le script SQL dans Supabase

### Vous avez dit que vous avez déjà exécuté le script, mais il faut vérifier que tout est en place :

---

## ✅ Étape 1 : Vérifier les tables

1. Allez sur **https://supabase.com**
2. Ouvrez votre projet : `zmgfaiprgbawcernymqa`
3. Cliquez sur **Table Editor** (menu de gauche)
4. Vérifiez que vous avez ces tables :
   - ✅ `cultures_categories` (4 lignes)
   - ✅ `cultures_questions` (30 lignes)

---

## ❌ Si les tables N'EXISTENT PAS ou ont des noms différents

### Cas 1 : Vous avez `categories` et `questions` (sans préfixe)

**Solution** : Supprimez et recréez avec les bons noms

```sql
-- Dans Supabase SQL Editor
DROP TABLE IF EXISTS questions CASCADE;
DROP TABLE IF EXISTS categories CASCADE;
DROP VIEW IF EXISTS v_questions_with_category;
DROP VIEW IF EXISTS v_category_stats;
DROP FUNCTION IF EXISTS get_questions_by_category(VARCHAR);
DROP FUNCTION IF EXISTS update_question_hint(VARCHAR, TEXT);
```

Puis exécutez le fichier complet `database/schema.sql`

### Cas 2 : Les tables n'existent pas du tout

1. Allez dans **SQL Editor**
2. Cliquez sur **"+ New query"**
3. Ouvrez le fichier `cultures/database/schema.sql`
4. Copiez tout le contenu
5. Collez dans l'éditeur Supabase
6. Cliquez sur **"Run"** (ou Ctrl+Enter)
7. ✅ Message : "Success. No rows returned"

---

## ✅ Étape 2 : Vérifier que les questions sont là

1. Dans **Table Editor**, cliquez sur `cultures_questions`
2. Vous devriez voir **30 lignes** :
   - 10 questions `q_culture_*`
   - 10 questions `q_science_*`
   - 10 questions `q_histoire_*`

---

## ✅ Étape 3 : Tester le jeu

1. Ouvrez `cultures/index.html`
2. Ouvrez la console (F12)
3. Vérifiez ces messages :

```
✅ ⚙️ Configuration chargée
✅ 📡 Supabase configuré: true
✅ 🗂️ 4 catégories chargées
✅ 📚 30 réponses chargées
✅ 🎮 Jeu de Cultures - Version 1.0.0
✅ 🔊 SoundManager initialisé
✅ 🎵 Utilisation des sons synthétiques (Web Audio API)
✅ 🚀 Initialisation du jeu...
✅ ✅ 30 questions chargées depuis Supabase  ← IMPORTANT !
✅ ✅ 4 catégories chargées
✅ ✅ Jeu initialisé avec succès
```

4. ✅ Une question devrait s'afficher
5. ✅ Répondez → Question suivante
6. ✅ Aucune erreur 404 !

---

## 🎯 Si tout fonctionne

Vous verrez :
- ✅ 30 questions chargées
- ✅ 4 catégories disponibles
- ✅ Shuffle des réponses fonctionnel
- ✅ Sons synthétiques qui fonctionnent
- ✅ Mode anonyme + mode connecté
- ✅ Session partagée avec math/

**Le jeu est 100% fonctionnel ! 🎉**

---

## ❌ Si ça ne fonctionne pas

### Erreur : "Aucune question chargée depuis Supabase"

**Diagnostic** :

1. Dans la console, cherchez :
   ```
   ❌ Erreur chargement questions: ...
   ```

2. Causes possibles :
   - Tables pas créées
   - Tables ont un nom différent (sans "cultures_")
   - Fonction `get_questions_by_category()` n'existe pas
   - Problème de RLS (Row Level Security)

**Solution** :

1. Allez dans Supabase → **SQL Editor**
2. Testez manuellement :
   ```sql
   SELECT * FROM cultures_questions;
   ```
3. Si erreur → Tables n'existent pas → Exécutez `database/schema.sql`
4. Si OK → Testez la fonction :
   ```sql
   SELECT * FROM get_questions_by_category('toutes');
   ```
5. Si erreur → Fonction n'existe pas → Ré-exécutez `database/schema.sql`

---

## 📞 Aide rapide

### Commandes utiles SQL

```sql
-- Voir toutes les tables
SELECT tablename FROM pg_tables WHERE schemaname = 'public';

-- Compter les questions
SELECT COUNT(*) FROM cultures_questions;

-- Voir les catégories
SELECT * FROM cultures_categories;

-- Tester la fonction
SELECT * FROM get_questions_by_category('science');
```

---

## ✅ Checklist finale

- [ ] J'ai ouvert Supabase
- [ ] J'ai vérifié que les tables `cultures_*` existent
- [ ] J'ai vu 30 questions dans `cultures_questions`
- [ ] J'ai rechargé `cultures/index.html`
- [ ] J'ai vu "✅ 30 questions chargées depuis Supabase" dans la console
- [ ] Une question s'affiche
- [ ] Je peux répondre et passer à la suivante
- [ ] Aucune erreur 404 dans la console

**Si toutes les cases sont cochées : C'EST BON ! 🎉**

---

**Rechargez la page et amusez-vous ! 🎮**

