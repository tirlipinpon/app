# 🚀 Guide d'installation rapide - Cultures

## ✅ Étape 1 : Configuration Supabase

### A. Créer un projet Supabase

1. Allez sur **https://supabase.com** et connectez-vous
2. Cliquez sur **"New Project"**
3. Remplissez les informations :
   - **Name** : cultures-game (ou autre nom)
   - **Database Password** : Choisissez un mot de passe sécurisé
   - **Region** : Choisissez le plus proche de vous
4. Cliquez sur **"Create new project"** et attendez ~2 minutes

### B. Copier vos identifiants

1. Dans votre projet Supabase, cliquez sur **⚙️ Settings** (en bas à gauche)
2. Cliquez sur **API** dans le menu
3. Copiez :
   - **URL** : `https://xxx.supabase.co`
   - **anon public key** : `eyJxxx...`

### C. Exécuter le schéma SQL

1. Dans Supabase, cliquez sur **SQL Editor** (menu de gauche)
2. Cliquez sur **"+ New query"**
3. Ouvrez le fichier `database/schema.sql` de votre projet
4. Copiez tout le contenu et collez-le dans l'éditeur Supabase
5. Cliquez sur **"Run"** (ou appuyez sur Ctrl+Enter)
6. Vous devriez voir : **"Success. No rows returned"**

✅ Vos tables sont créées avec 30 questions d'exemple !

---

## ✅ Étape 2 : Configuration DeepSeek AI (Optionnel)

### Si vous voulez les hints générés par IA :

1. Allez sur **https://platform.deepseek.com**
2. Créez un compte (gratuit)
3. Allez dans **API Keys**
4. Cliquez sur **"Create API Key"**
5. Copiez votre clé : `sk-xxx...`

💡 **Note** : Si vous ne configurez pas l'API, des hints génériques seront affichés.

---

## ✅ Étape 3 : Configuration du fichier config.js

1. Ouvrez le fichier **`js/config.js`**

2. Remplacez les valeurs par vos identifiants :

```javascript
const CONFIG = {
  // 🗄️ SUPABASE CONFIGURATION
  SUPABASE_URL: "https://votre-projet.supabase.co", // ← Collez votre URL ici
  SUPABASE_ANON_KEY: "eyJxxx...", // ← Collez votre anon key ici

  // 🤖 DEEPSEEK AI CONFIGURATION (optionnel)
  DEEPSEEK_API_KEY: "sk-xxx...", // ← Collez votre clé API ici

  // Le reste ne nécessite pas de modification
  DEEPSEEK_API_URL: "https://api.deepseek.com/v1/chat/completions",
  DEEPSEEK_MODEL: "deepseek-chat",

  AI_HINT_CONFIG: {
    temperature: 0.7,
    max_tokens: 100,
    top_p: 0.9,
  },

  RETRY_CONFIG: {
    minDelay: 5 * 60 * 1000,
    maxDelay: 30 * 60 * 1000,
    multiplierPerAttempt: 1.5,
  },
};
```

3. Sauvegardez le fichier

---

## ✅ Étape 4 : Lancer l'application

### Option A : Ouvrir directement dans le navigateur

1. Ouvrez le fichier **`index.html`** avec votre navigateur
2. C'est tout ! Le jeu devrait se charger

### Option B : Avec un serveur local (recommandé)

#### Avec Python (si installé) :

```bash
# Aller dans le dossier cultures
cd cultures

# Lancer le serveur
python -m http.server 8000

# Ouvrir dans le navigateur
# http://localhost:8000
```

#### Avec Node.js (si installé) :

```bash
# Aller dans le dossier cultures
cd cultures

# Lancer le serveur
npx http-server -p 8000

# Ouvrir dans le navigateur
# http://localhost:8000
```

---

## 🎮 Test rapide

1. **Connexion** :

   - Entrez votre nom : `Test`
   - Cliquez sur **"Commencer 🚀"**

2. **Question** :

   - Une question devrait apparaître
   - Répondez à la question
   - Cliquez sur **"💡 Besoin d'aide ?"** pour tester les hints

3. **Progression** :
   - Votre progression devrait être sauvegardée
   - Rechargez la page : vous devriez rester connecté

---

## ❌ Problèmes courants

### "Erreur: Impossible de charger les questions"

**Cause** : Supabase mal configuré

**Solution** :

1. Vérifiez que `SUPABASE_URL` et `SUPABASE_ANON_KEY` sont corrects dans `config.js`
2. Vérifiez que le schéma SQL a bien été exécuté (vérifiez dans Supabase → Table Editor)
3. Vérifiez que les tables `cultures_categories` et `cultures_questions` existent bien
4. Ouvrez la console du navigateur (F12) pour voir l'erreur exacte

### "Les hints ne s'affichent pas"

**Cause** : API DeepSeek mal configurée ou non configurée

**Solution** :

- Si vous n'avez pas configuré l'API, c'est normal : des hints génériques s'affichent
- Si vous avez configuré l'API, vérifiez que `DEEPSEEK_API_KEY` est correct

### "Aucune question n'apparaît"

**Cause** : Le schéma SQL n'a pas été exécuté correctement

**Solution** :

1. Allez dans Supabase → **SQL Editor**
2. Ré-exécutez le fichier `database/schema.sql`
3. Vérifiez dans **Table Editor** que les tables `cultures_categories` et `cultures_questions` existent

---

## 📚 Ajouter vos propres questions

### 1. Dans Supabase

Allez dans **SQL Editor** et exécutez :

```sql
INSERT INTO cultures_questions (id, question_text, category_id, question_type, options, tags)
VALUES (
  'q_custom_1',                                    -- ID unique
  'Quelle est la capitale de l''Italie ?',        -- Question
  1,                                               -- 1=culture, 2=science, 3=histoire
  'input',                                         -- Type : input, qcm, vrai-faux, etc.
  NULL,                                            -- Options (NULL pour input)
  ARRAY['géographie', 'europe']                    -- Tags
);
```

### 2. Dans `js/data.js`

Ajoutez la réponse :

```javascript
const ANSWERS_DATA = {
  // ... autres réponses

  q_custom_1: {
    answer: ["Rome", "rome"],
    validateFlexible: true,
  },
};
```

### 3. Rechargez la page

Votre nouvelle question devrait apparaître !

---

## 📞 Besoin d'aide ?

Consultez le **README.md** pour la documentation complète.

---

**Bon jeu ! 🎮🎉**
