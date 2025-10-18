# 🧪 Guide de Test - Jeu Cultures

## ✅ Checklist de vérification

### 1. Configuration Supabase

- [ ] Le fichier `js/config.js` contient bien vos identifiants Supabase
- [ ] URL : `https://zmgfaiprgbawcernymqa.supabase.co`
- [ ] Anon Key configurée

### 2. Base de données Supabase

- [ ] Connectez-vous sur https://supabase.com
- [ ] Allez dans votre projet
- [ ] Cliquez sur **Table Editor**
- [ ] Vérifiez que ces tables existent :
  - ✅ `cultures_categories` (4 lignes)
  - ✅ `cultures_questions` (30 lignes)

### 3. Test du jeu

#### A. Mode ANONYME (sans connexion)

1. Ouvrez `cultures/index.html`
2. **Vérification console** :
   - ✅ `📡 Supabase configuré: true`
   - ✅ `✅ 30 questions chargées depuis Supabase`
   - ✅ `✅ Jeu initialisé avec succès`
3. Une question devrait s'afficher immédiatement
4. Répondez à la question
5. ✅ Message : "Connecte-toi pour sauvegarder ta progression"
6. La question suivante s'affiche
7. Rechargez la page (F5)
8. ✅ Nouvelle question (progression non sauvegardée)

#### B. Mode CONNECTÉ (avec sauvegarde)

1. Dans le formulaire en haut, entrez votre nom : `Test`
2. Cliquez sur **"Se connecter"**
3. ✅ Message : "Bienvenue Test ! Ta progression sera sauvegardée."
4. Répondez à plusieurs questions
5. Rechargez la page (F5)
6. ✅ Votre nom apparaît automatiquement (session restaurée)
7. ✅ Les questions déjà répondues ne reviennent pas

#### C. Test des types de questions

- [ ] **Input** : `q_culture_1` - "Quelle est la capitale de la France ?"
  - Tapez "Paris" → ✅ Correct
  - Tapez "paris" → ✅ Correct (insensible casse)
- [ ] **QCM** : `q_culture_4` - "Qui a peint la Joconde ?"
  - Cliquez sur une option → ✅ Validation immédiate
  - ✅ Options mélangées (pas toujours au même endroit)
- [ ] **Vrai-Faux** : `q_science_1` - "L'eau bout à 100°C..."
  - Cliquez sur "Vrai" → ✅ Correct
- [ ] **Ordre** : `q_histoire_2` - "Classe ces événements..."
  - Glissez-déposez les items → ✅ Drag & drop fonctionne
  - Cliquez "Valider" → ✅ Vérification
- [ ] **Association** : `q_culture_2` - "Associe chaque pays..."
  - Cliquez gauche puis droite → ✅ Ligne apparaît
  - Complétez toutes → Cliquez "Valider" → ✅ Vérification
- [ ] **Glisser-Déposer** : `q_science_2` - "Classe ces animaux..."
  - Glissez items dans catégories → ✅ Drag & drop fonctionne
  - Cliquez "Valider" → ✅ Vérification
- [ ] **Remplir-blancs** : `q_culture_3` - "La tour Eiffel mesure..."
  - Tapez "324" → ✅ Correct

#### D. Test des hints IA

1. Sur n'importe quelle question, cliquez **"💡 Besoin d'aide ?"**
2. Si API configurée :
   - ✅ Loader s'affiche : "L'assistant réfléchit..."
   - ✅ Hint généré par IA apparaît
   - ✅ Bouton désactivé : "Hint utilisé"
3. Si API non configurée :
   - ✅ Hint générique s'affiche
   - ✅ Bouton désactivé

#### E. Test des catégories

1. Changez de catégorie dans le menu déroulant
2. ✅ Questions filtrées selon la catégorie
3. Répondez à toutes les questions d'une catégorie
4. ✅ Célébration : "Catégorie terminée !"
5. ✅ Retour automatique à "Toutes"

#### F. Test multi-utilisateurs

1. Connectez-vous avec "User1"
2. Répondez à quelques questions
3. Déconnectez-vous
4. ✅ Message : "Tu peux continuer à jouer sans sauvegarder"
5. Connectez-vous avec "User2"
6. ✅ Questions déjà répondues par User1 sont disponibles pour User2
7. Rechargez la page
8. ✅ Le menu déroulant affiche User1 et User2

### 4. Tests de persistance

- [ ] **Refresh (F5)** :

  - ✅ Session restaurée si connecté
  - ✅ Progression conservée
  - ✅ Catégorie sélectionnée conservée

- [ ] **Fermeture onglet puis réouverture** :

  - ✅ Session perdue (comportement attendu)
  - ✅ Progression conservée dans les cookies
  - ✅ Peut se reconnecter avec le même nom

- [ ] **Autre onglet** :
  - Ouvrez `math/index.html` dans un autre onglet
  - Connectez-vous avec le même nom
  - ✅ Nom partagé entre les applications

### 5. Test des sons

- [ ] Cliquez sur le bouton 🔊 en haut
- [ ] ✅ Passage à 🔇 (sons désactivés)
- [ ] Re-cliquez
- [ ] ✅ Retour à 🔊 (sons activés)
- [ ] Préférence sauvegardée dans localStorage

---

## 🐛 Vérifications en cas de problème

### Console Browser (F12)

Vérifiez ces messages :

```
✅ ⚙️ Configuration chargée
✅ 📡 Supabase configuré: true
✅ 🗂️ 4 catégories chargées
✅ 📚 30 réponses chargées
✅ 🎮 Jeu de Cultures - Version 1.0.0
✅ 🔐 SessionManager : Initialisation...
✅ 🔊 6 sons préchargés
✅ 🚀 Initialisation du jeu...
✅ ✅ 30 questions chargées depuis Supabase
✅ ✅ 4 catégories chargées
✅ ✅ Jeu initialisé avec succès
```

### Erreurs communes

❌ `Supabase configuré: false`
→ Vérifiez `js/config.js`

❌ `Aucune question chargée depuis Supabase`
→ Vérifiez que le script SQL a été exécuté

❌ `Son non trouvé`
→ Normal, les sons sont optionnels

---

## 🎯 Résultat attendu

Si tout fonctionne :

1. ✅ Page charge sans erreur
2. ✅ 30 questions disponibles
3. ✅ Shuffle des réponses fonctionne
4. ✅ Peut jouer sans connexion
5. ✅ Peut se connecter pour sauvegarder
6. ✅ Session partagée avec autres jeux
7. ✅ Hints générés (si API configurée)
8. ✅ Re-proposition des erreurs fonctionne

---

**Si tous les tests passent, le jeu est prêt ! 🎉**
