# ⚡ QUICK START - Jeu Cultures

## 🚀 Démarrage en 30 secondes

### 1️⃣ Ouvrez le fichier
```
cultures/index.html
```

### 2️⃣ C'est tout ! 
Le jeu fonctionne immédiatement ✅

---

## 🎮 Comment jouer

### Sans connexion (Mode anonyme)
```
1. Page s'ouvre
2. Question s'affiche immédiatement
3. Répondez !
4. Progression NON sauvegardée ⚠️
```

### Avec connexion (Recommandé)
```
1. Entrez votre nom en haut
2. Cliquez "Se connecter"
3. Progression SAUVEGARDÉE ✅
4. Rechargez la page → Toujours connecté
```

---

## 📝 Ajouter des questions

### Dans Supabase
```sql
INSERT INTO cultures_questions 
(id, question_text, category_id, question_type, options, tags)
VALUES (
  'q_new',
  'Votre question ?',
  1,
  'qcm',
  '["A", "B", "C"]',
  ARRAY['tag']
);
```

### Dans js/data.js
```javascript
"q_new": {
  answer: "A"
}
```

### Rechargez la page
✅ Nouvelle question ajoutée !

---

## 🗄️ Supabase

**Projet** : `https://zmgfaiprgbawcernymqa.supabase.co`

**Tables** :
- `cultures_categories` (4 catégories)
- `cultures_questions` (30 questions)

**Accès** :
1. https://supabase.com
2. Votre projet
3. SQL Editor ou Table Editor

---

## 🔊 Sons

**Par défaut** : Sons synthétiques (beeps) ✅

**Pas de fichiers requis !**

Si vous voulez des MP3 :
- Mettez `useAudioFiles = true` dans `soundManager.js`
- Placez vos fichiers dans `sounds/`

---

## 💡 Debug

Console : `F12`

```javascript
// Réinitialiser données
resetUserData()

// Voir état du jeu
console.log(gameInstance)

// Voir questions
console.log(gameInstance.questionManager.getAllQuestions())
```

---

## 📚 Docs complètes

- `README.md` - Documentation détaillée
- `INSTALLATION.md` - Installation pas à pas
- `TEST_GUIDE.md` - Guide de test complet
- `CORRECTIONS_FINALES.md` - Corrections appliquées

---

**C'est parti ! 🎉**

