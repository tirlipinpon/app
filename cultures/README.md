# 🎭 Cultures - Jeu de Culture Générale

Un jeu de culture générale interactif avec 7 types de questions différents, propulsé par **Supabase** et **DeepSeek AI**.

## 📋 Table des matières

- [Fonctionnalités](#-fonctionnalités)
- [Architecture](#-architecture)
- [Installation](#-installation)
- [Configuration](#-configuration)
- [Types de questions](#-types-de-questions)
- [Utilisation](#-utilisation)
- [Structure du projet](#-structure-du-projet)
- [Base de données](#-base-de-données)
- [Développement](#-développement)

---

## ✨ Fonctionnalités

### 🎮 Gameplay

- **7 types de questions** : Input, QCM, Vrai/Faux, Ordre, Association, Glisser-Déposer, Remplir les blancs
- **3 catégories** : Culture générale, Science, Histoire
- **Shuffle automatique** des réponses pour éviter la mémorisation des positions
- **Validation flexible** pour les réponses textuelles (accepte plusieurs variantes)
- **Re-proposition intelligente** des questions échouées avec délai aléatoire

### 🤖 IA & Hints

- **Hints générés par IA** (DeepSeek) pour chaque question
- **1 hint par question** maximum par session
- **Sauvegarde des hints** dans Supabase pour éviter les appels API répétés
- **Hints de secours** si l'API est indisponible

### 👤 Gestion utilisateurs

- **Système de session** partagé entre toutes vos applications
- **Persistance au refresh** de la page
- **Déconnexion automatique** à la fermeture de l'onglet
- **Multi-utilisateurs** avec sauvegarde individuelle
- **Progression sauvegardée** dans les cookies

### 📊 Suivi de progression

- **Questions réussies** sauvegardées
- **Questions échouées** reproposées intelligemment
- **Compteur de progression** par catégorie
- **Célébrations** pour les catégories et le jeu complet

---

## 🏗️ Architecture

```
┌─────────────────────────────────────────────────────┐
│                    Frontend                          │
├─────────────────────────────────────────────────────┤
│  game.js (Orchestrateur principal)                  │
│  ├── sessionManager.js (Session multi-apps)         │
│  ├── userManager.js (Cookies & progression)         │
│  ├── supabaseService.js (API Supabase)              │
│  ├── questionManager.js (Shuffle & validation)      │
│  ├── incorrectTracker.js (Re-proposition)           │
│  ├── aiHintService.js (Hints IA)                    │
│  ├── inputHandler.js (Gestion réponses)             │
│  ├── uiManager.js (Interface)                       │
│  └── soundManager.js (Sons)                         │
└─────────────────────────────────────────────────────┘
                          │
                          ↓
┌─────────────────────────────────────────────────────┐
│              Supabase Database                       │
├─────────────────────────────────────────────────────┤
│  tables:                                             │
│  ├── cultures_categories (3 catégories)             │
│  └── cultures_questions (texte, type, options,      │
│                           hints)                     │
└─────────────────────────────────────────────────────┘
                          │
                          ↓
┌─────────────────────────────────────────────────────┐
│                 DeepSeek AI                          │
│  (Génération de hints personnalisés)                │
└─────────────────────────────────────────────────────┘
```

**Données stockées :**

- **Supabase** : Questions, catégories, hints générés
- **Cookies** : Progression utilisateur, réponses incorrectes, préférences
- **SessionStorage** : Session active (disparaît à la fermeture)

---

## 🚀 Installation

### 1. Cloner le projet

```bash
cd cultures
```

### 2. Configurer Supabase

#### A. Créer un projet Supabase

1. Allez sur [https://supabase.com](https://supabase.com)
2. Créez un nouveau projet
3. Notez votre **URL** et **anon key**

#### B. Exécuter le schéma SQL

1. Dans Supabase Dashboard, allez dans **SQL Editor**
2. Créez une nouvelle query
3. Copiez-collez le contenu de `database/schema.sql`
4. Exécutez la query (cela créera les tables et insérera les données d'exemple)

### 3. Configurer l'API DeepSeek (optionnel mais recommandé)

1. Obtenez une clé API sur [https://platform.deepseek.com](https://platform.deepseek.com)
2. Notez votre clé API

### 4. Configurer le fichier `config.js`

Éditez `js/config.js` :

```javascript
const CONFIG = {
  // Supabase
  SUPABASE_URL: "https://votre-projet.supabase.co",
  SUPABASE_ANON_KEY: "votre-anon-key",

  // DeepSeek AI
  DEEPSEEK_API_KEY: "sk-votre-cle",

  // ... (le reste est déjà configuré)
};
```

### 5. Lancer l'application

Ouvrez simplement `index.html` dans votre navigateur, ou utilisez un serveur local :

```bash
# Avec Python
python -m http.server 8000

# Avec Node.js (http-server)
npx http-server -p 8000
```

Puis ouvrez : `http://localhost:8000`

---

## ⚙️ Configuration

### Fichier `js/config.js`

```javascript
const CONFIG = {
  // 🗄️ SUPABASE
  SUPABASE_URL: "https://xxx.supabase.co",
  SUPABASE_ANON_KEY: "eyJxxx...",

  // 🤖 DEEPSEEK AI
  DEEPSEEK_API_URL: "https://api.deepseek.com/v1/chat/completions",
  DEEPSEEK_API_KEY: "sk-xxx",
  DEEPSEEK_MODEL: "deepseek-chat",

  // 💡 Configuration des hints
  AI_HINT_CONFIG: {
    temperature: 0.7, // Créativité (0-1)
    max_tokens: 100, // Longueur max du hint
    top_p: 0.9, // Diversité
  },

  // ⏱️ Configuration re-proposition
  RETRY_CONFIG: {
    minDelay: 5 * 60 * 1000, // 5 minutes minimum
    maxDelay: 30 * 60 * 1000, // 30 minutes maximum
    multiplierPerAttempt: 1.5, // Augmentation par tentative
  },
};
```

---

## 📝 Types de questions

### 1. **Input** (Réponse libre)

```javascript
// Dans Supabase
{
  id: 'q_culture_1',
  question_text: 'Quelle est la capitale de la France ?',
  question_type: 'input',
  options: null
}

// Dans data.js
"q_culture_1": {
  answer: ["Paris", "paris", "PARIS"],  // Plusieurs variantes acceptées
  validateFlexible: true
}
```

### 2. **QCM** (Choix multiple)

```javascript
// Dans Supabase
{
  id: 'q_histoire_1',
  question_text: 'Qui a découvert l\'Amérique ?',
  question_type: 'qcm',
  options: '["Christophe Colomb", "Magellan", "Vasco de Gama"]'  // JSONB
}

// Dans data.js
"q_histoire_1": {
  answer: "Christophe Colomb"
}
```

**Options shufflées automatiquement à chaque affichage !**

### 3. **Vrai-Faux**

```javascript
// Dans Supabase
{
  id: 'q_science_1',
  question_text: 'L\'eau bout à 100°C au niveau de la mer.',
  question_type: 'vrai-faux',
  options: null
}

// Dans data.js
"q_science_1": {
  answer: true
}
```

### 4. **Ordre** (Glisser-déposer)

```javascript
// Dans Supabase
{
  id: 'q_histoire_2',
  question_text: 'Classe ces événements par ordre chronologique',
  question_type: 'ordre',
  options: '["Révolution française", "WWI", "Chute du mur de Berlin"]'
}

// Dans data.js
"q_histoire_2": {
  answer: [0, 1, 2]  // Indices dans l'ordre correct
}
```

**Items shufflés automatiquement au départ !**

### 5. **Association** (Relier deux colonnes)

```javascript
// Dans Supabase
{
  id: 'q_culture_2',
  question_text: 'Associe chaque pays à sa capitale',
  question_type: 'association',
  options: '{"left": ["France", "Allemagne"], "right": ["Paris", "Berlin", "Rome"]}'
}

// Dans data.js
"q_culture_2": {
  answer: {
    "France": "Paris",
    "Allemagne": "Berlin"
  }
}
```

**Colonnes shufflées indépendamment !**

### 6. **Glisser-Déposer** (Catégoriser)

```javascript
// Dans Supabase
{
  id: 'q_science_2',
  question_text: 'Classe ces animaux',
  question_type: 'glisser-deposer',
  options: '{"categories": ["Mammifères", "Reptiles"], "items": ["Chat", "Serpent"]}'
}

// Dans data.js
"q_science_2": {
  answer: {
    "Mammifères": ["Chat"],
    "Reptiles": ["Serpent"]
  }
}
```

**Items shufflés au départ !**

### 7. **Remplir-Blancs**

```javascript
// Dans Supabase
{
  id: 'q_culture_3',
  question_text: 'La tour Eiffel mesure ___ mètres.',
  question_type: 'remplir-blancs',
  options: null
}

// Dans data.js
"q_culture_3": {
  answer: ["324", "trois cent vingt-quatre"],
  validateFlexible: true
}
```

---

## 🎮 Utilisation

### Connexion

1. Ouvrez l'application
2. Entrez votre nom ou sélectionnez un utilisateur existant
3. Cliquez sur **Commencer** 🚀

### Jouer

1. Sélectionnez une **catégorie** (ou "Toutes")
2. Lisez la **question**
3. Répondez selon le type de question
4. Cliquez sur le bouton **💡 Besoin d'aide ?** si nécessaire (1 hint max)
5. Validez votre réponse

### Progression

- Les questions **correctes** sont sauvegardées et ne reviennent plus
- Les questions **incorrectes** seront reproposées plus tard
- Le **compteur** par catégorie indique combien de questions restantes
- Une **célébration** s'affiche quand une catégorie ou le jeu est terminé

---

## 📂 Structure du projet

```
cultures/
├── database/
│   └── schema.sql              # Schéma Supabase (tables + données)
├── css/
│   └── style.css               # Styles complets (tous types)
├── js/
│   ├── config.js               # Configuration (Supabase + IA)
│   ├── sessionManager.js       # Session partagée multi-apps
│   ├── userManager.js          # Gestion utilisateurs & cookies
│   ├── categories.js           # Définition des catégories
│   ├── data.js                 # Réponses correctes (frontend)
│   ├── supabaseService.js      # API Supabase
│   ├── questionManager.js      # Shuffle & validation
│   ├── incorrectTracker.js     # Re-proposition intelligente
│   ├── aiHintService.js        # Génération hints IA
│   ├── inputHandler.js         # Gestion tous types de réponses
│   ├── uiManager.js            # Interface utilisateur
│   ├── soundManager.js         # Gestion des sons
│   └── game.js                 # Orchestrateur principal
├── sounds/                     # Fichiers audio (optionnels)
├── index.html                  # Page principale
└── README.md                   # Cette documentation
```

---

## 🗄️ Base de données

### Tables Supabase

#### `cultures_categories`

| Colonne       | Type    | Description         |
| ------------- | ------- | ------------------- |
| id            | SERIAL  | ID unique           |
| key           | VARCHAR | Clé (ex: "culture") |
| name          | VARCHAR | Nom affiché         |
| icon          | VARCHAR | Emoji               |
| display_order | INT     | Ordre d'affichage   |

#### `cultures_questions`

| Colonne       | Type    | Description                        |
| ------------- | ------- | ---------------------------------- |
| id            | VARCHAR | ID unique (ex: "q_culture_1")      |
| question_text | TEXT    | Texte de la question               |
| category_id   | INT     | Référence à categories             |
| question_type | VARCHAR | Type (input, qcm, vrai-faux, etc.) |
| options       | JSONB   | Options pour QCM, ordre, etc.      |
| tags          | TEXT[]  | Tags pour recherche                |
| hint          | TEXT    | Hint généré par IA (nullable)      |
| is_active     | BOOLEAN | Actif ou non                       |

### Ajouter des questions

#### Dans Supabase

```sql
INSERT INTO cultures_questions (id, question_text, category_id, question_type, options, tags)
VALUES (
  'q_custom_1',
  'Votre question ici ?',
  1,  -- 1=culture, 2=science, 3=histoire
  'qcm',
  '["Option A", "Option B", "Option C"]',
  ARRAY['tag1', 'tag2']
);
```

#### Dans `js/data.js`

```javascript
const ANSWERS_DATA = {
  // ... autres réponses

  q_custom_1: {
    answer: "Option A",
  },
};
```

---

## 🛠️ Développement

### Ajouter un nouveau type de question

1. **Définir le type dans Supabase** (contrainte CHECK dans la table `questions`)
2. **Créer l'interface dans `uiManager.js`** :
   ```javascript
   createMonNouveauTypeInterface(questionData) {
     // Créer le HTML
   }
   ```
3. **Ajouter la gestion dans `inputHandler.js`** :
   ```javascript
   setupMonNouveauType() {
     // Attacher les event listeners
   }
   ```
4. **Ajouter la validation dans `questionManager.js`** :
   ```javascript
   validateMonNouveauType(userAnswer, correctAnswer) {
     // Logique de validation
   }
   ```
5. **Ajouter les styles dans `style.css`**

### Debug

Ouvrez la console du navigateur :

```javascript
// Réinitialiser les données de l'utilisateur
resetUserData();

// Voir l'état du jeu
console.log(gameInstance);

// Voir les questions chargées
console.log(gameInstance.questionManager.getAllQuestions());

// Voir la progression
console.log(gameInstance.userManager.getQuestionsAnswered());

// Voir les questions incorrectes
console.log(gameInstance.incorrectTracker.getStats());
```

---

## 🎨 Personnalisation

### Couleurs

Éditez les variables CSS dans `css/style.css` :

```css
:root {
  --primary: #667eea;
  --secondary: #764ba2;
  --success: #10b981;
  --error: #ef4444;
  /* ... */
}
```

### Sons

Placez vos fichiers audio dans `sounds/` et mettez à jour `js/soundManager.js` :

```javascript
this.soundList = {
  correct: "sounds/votre-son-correct.mp3",
  incorrect: "sounds/votre-son-incorrect.mp3",
  // ...
};
```

---

## 🐛 Résolution de problèmes

### Les questions ne se chargent pas

1. Vérifiez que Supabase est bien configuré dans `config.js`
2. Vérifiez que les tables `cultures_categories` et `cultures_questions` existent bien
3. Vérifiez que les **Row Level Security (RLS)** sont correctement configurées
4. Ouvrez la console du navigateur pour voir les erreurs

### Les hints ne se génèrent pas

1. Vérifiez que la clé API DeepSeek est valide dans `config.js`
2. Vérifiez votre quota API
3. Les hints de secours s'afficheront si l'API est indisponible

### Les réponses ne s'enregistrent pas

1. Vérifiez que les cookies sont activés dans votre navigateur
2. Vérifiez que l'utilisateur est bien connecté
3. Ouvrez la console et cherchez les erreurs

---

## 📄 Licence

Ce projet est libre d'utilisation pour un usage personnel et éducatif.

---

## 🤝 Contribution

Pour ajouter des questions, modifier l'interface ou corriger des bugs :

1. Modifiez les fichiers nécessaires
2. Testez en local
3. Documentez vos changements

---

## 🚀 Prochaines fonctionnalités

- [ ] Mode multijoueur
- [ ] Classement / Leaderboard
- [ ] Badges et achievements
- [ ] Export des statistiques
- [ ] Mode révision (questions échouées uniquement)
- [ ] Ajout de nouvelles catégories (géographie, sport, etc.)
- [ ] Support de plus de types de questions

---

**Bon jeu ! 🎮🎉**
