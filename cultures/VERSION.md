# 📌 Historique des versions - Jeu Cultures

## v2.1.13 - 19/10/2025 🐛 CORRECTION CRITIQUE - Historique des Hints

### 🚨 Bugs critiques corrigés

#### 1. Format de clé incorrect

- **Problème** : Clé de sauvegarde `q_science_1_2` vs clé de recherche `q_science_1_hint_2`
- **Cause** : `hintKey = ${questionId}_${hintNumber}` au lieu de `${questionId}_hint_${hintNumber}`
- **Impact** : Les hints précédents n'étaient JAMAIS trouvés dans le cache
- **Solution** : Uniformisation du format de clé avec `_hint_`

#### 2. Hint 1 de la DB non mis en cache

- **Problème** : Le hint 1 depuis Supabase n'était pas sauvegardé dans le cache
- **Impact** : Les hints 2 et 3 ne pouvaient pas voir le hint 1 dans l'historique
- **Solution** : Ajout de `this.cache.set()` quand hint 1 vient de la DB

### ✅ Résultat

- L'historique des hints fonctionne maintenant CORRECTEMENT
- L'IA reçoit tous les hints précédents dans le payload
- Les hints sont progressifs et cohérents

---

## v2.1.12 - 19/10/2025 🔧 Correction Lecture Vocale

### 🐛 Bug critique corrigé

#### Erreur JavaScript avec les apostrophes

- **Problème** : La fonction `speakHint('...')` cassait quand le texte contenait des apostrophes (ex: "l'invention")
- **Cause** : Utilisation de `onclick` inline avec du texte non échappé correctement
- **Solution** : Remplacement par des `addEventListener` avec closures JavaScript

#### Nouvelle implémentation

- **Event Listeners** : Attachement dynamique sur chaque bouton 🔊
- **Closures** : Le texte est capturé dans la closure, pas besoin d'échappement
- **Support complet** : Fonctionne avec apostrophes, guillemets, emojis, caractères spéciaux
- **Plus propre** : Séparation HTML/JavaScript

---

## v2.1.11 - 19/10/2025 🔍 Debug Historique des Hints

### 🐛 Debug et amélioration des logs

#### Problème identifié

- **Historique manquant** : Lors du 3ème hint, les hints 1 et 2 n'apparaissaient pas dans le payload envoyé à l'IA
- **Logs détaillés** : Ajout de logs pour tracer la sauvegarde et récupération des hints du cache
- **Simplification** : Retrait des messages utilisateur intermédiaires dans l'historique

#### Nouveaux logs de debugging

- 💾 Log de la clé exacte lors de la sauvegarde dans le cache
- 📊 Log de la taille du cache après chaque sauvegarde
- 🔍 Log de la recherche des hints précédents
- 📦 Log du statut de chaque hint (trouvé ✅ ou manquant ❌)
- ✅ Log quand un hint est ajouté à l'historique des messages

---

## v2.1.10 - 19/10/2025 🔊 Lecture Vocale Sans Emojis

### 🔊 Amélioration de la lecture vocale

#### Filtrage automatique des emojis

- **Problème résolu** : Les emojis étaient lus lors de la lecture vocale, perturbant l'écoute
- **Solution** : Nouvelle fonction `removeEmojisFromText()` qui filtre tous les emojis
- **Regex Unicode complète** : Détecte et retire tous les types d'emojis
- **Affichage préservé** : Les emojis restent visibles à l'écran pour l'aspect visuel
- **Logs détaillés** : Console affiche le texte original ET le texte lu

### 📝 Exemple

- **Avant** : 🔊 "💡 Pense au roi qui a construit Versailles 🏰"
- **Maintenant** : 🔊 "Pense au roi qui a construit Versailles"

---

## v2.1.9 - 19/10/2025 🔧 Corrections de Syntaxe

### 🔧 Corrections de bugs critiques

#### Erreurs de syntaxe corrigées

- **Erreur ligne 175** : Problème avec les guillemets dans le message système de l'IA
- **Erreur ligne 468** : Fonction globale définie à l'intérieur de la classe
- **AIFintService non défini** : Erreur de référence corrigée

---

## v2.1.8 - 19/10/2025 🔧 Correction Bouton d'Aide

### 🔧 Corrections de bugs

#### Gestion du bouton d'aide améliorée

- **Problème résolu** : Le bouton "Besoin d'aide ?" restait actif après avoir terminé une question
- **Symptôme** : Les hints apparaissaient sur la question suivante pendant le chargement
- **Solution** : Désactivation automatique du bouton après réponse correcte

---

## v2.1.7 - 19/10/2025 🔊 Lecture Vocale des Hints

### 🔊 Nouvelles fonctionnalités

#### Lecture vocale des hints

- **Boutons 🔊** : Chaque hint a maintenant un bouton de lecture vocale
- **Synthèse vocale** : Utilise l'API Web Speech du navigateur
- **Configuration enfant** : Voix plus lente (0.8x) et plus aigüe (1.2x pitch)
- **Accessibilité** : Aide les enfants qui ont du mal à lire

---

## v2.1.6 - 19/10/2025 🎨 Hints Visuels avec Emojis

### 🎨 Améliorations IA

#### Système d'emojis pour hints visuels

- **Emojis obligatoires** : L'IA doit commencer TOUJOURS par "💡"
- **Illustrations visuelles** : Ajout d'emojis pertinents pour illustrer les propos
- **Exemples par catégorie** : 🌍 géographie, 🏛️ histoire, 🔬 science, 🎭 culture

---

## v2.1.5 - 19/10/2025 🔒 Hints Renforcés

### 🔒 Corrections IA

#### Interdictions strictes renforcées

- **Réponse précédente** : L'IA connaît maintenant ses hints précédents
- **Interdictions strictes** : Renforcement pour éviter les réponses complètes
- **Instructions détaillées** : Chaque hint a ses propres règles strictes

---

## v2.1.4 - 19/10/2025 💬 Contexte IA avec Historique des Messages

### 💬 Améliorations IA

#### Système de messages avec historique complet

- **Array de messages** : L'IA reçoit un historique complet de la conversation
- **Contexte maintenu** : Chaque hint garde le souvenir des hints précédents
- **Conversation naturelle** : Système de chat avec rôles (system, user, assistant)

---

## v2.1.3 - 19/10/2025 🧠 IA Hints Améliorée

### 🧠 Améliorations IA

#### Système d'analyse des hints renforcé

- **Analyse obligatoire** : L'IA doit d'abord comprendre la question
- **Progression logique** : Chaque hint PLUS PERTINENT que le précédent
- **Contexte historique** : L'IA connaît les hints précédents

---

## v2.1.2 - 19/10/2025 🔀 Shuffle Associations Corrigé

### 🔧 Corrections de bugs

#### Shuffle des questions d'association corrigé

- **Problème** : Les éléments d'association n'étaient pas mélangés
- **Cause** : L'interface utilisait `questionData.answer` au lieu de `questionData.options`
- **Solution** : Interface modifiée pour utiliser les données mélangées

---

## v2.1.1 - 19/10/2025 🔧 Correction Validation Associations

### 🔧 Corrections de bugs

#### Validation des questions d'association corrigée

- **Problème** : Les associations correctes étaient marquées comme fausses
- **Cause** : La fonction `validateAssociation` ne gérait pas correctement le format `answer.pairs`
- **Solution** : Conversion des `pairs` en objet pour validation correcte

---

## v2.1.0 - 19/10/2025 🎯 Questions d'Association

### ✨ Nouveautés principales

#### 🎯 40 Questions d'association ajoutées

- **10 questions Culture générale** : Fruits/couleurs, animaux/jeunes, métiers/outils, sports/équipements, etc.
- **10 questions Sciences** : Animaux/habitats, planètes/couleurs, organes/fonctions, saisons/températures, etc.
- **10 questions Histoire** : Civilisations/continents, rois/pays, inventions/inventeurs, monuments/villes, etc.
- **10 questions Géographie** : Capitales/pays, fleuves/pays, villes belges/régions, océans/caractéristiques, etc.

#### 🌍 Nouvelle catégorie Géographie

- Ajout de la catégorie "🌍 Géographie" dans l'interface
- Questions adaptées pour un enfant de 8 ans en Belgique
- Contenu spécifique belge (villes, régions, fleuves)

#### 🔧 Support complet des questions d'association

- Correction de `questionManager.js` pour gérer le format `answer.left/right/pairs`
- Correction de `uiManager.js` pour afficher l'interface d'association
- Validation des réponses d'association fonctionnelle
- Amélioration de l'espacement des colonnes (gap: 4rem)
- Alignement parfait en mobile (centrage des éléments)

### 📊 Statistiques v2.1.0

- **Total questions** : 130 (90 originales + 40 nouvelles)
- **Total catégories** : 5 (4 originales + Géographie)
- **Types de questions** : 7 (input, qcm, vrai-faux, ordre, association, glisser-deposer, remplir-blancs)

---

## v2.0.0 - 19/10/2025 🎮 Mise à jour MAJEURE

### ✨ Nouveautés principales

#### 🗄️ Architecture : Réponses dans Supabase

- **Champ `answer`** (JSONB) ajouté dans la table `cultures_questions`
- **Gestion centralisée** : Plus besoin de modifier le code pour ajouter des questions
- **60 nouvelles questions** adaptées aux enfants de 8 ans
- **Total : 90 questions** (30 originales + 60 nouvelles)

#### 📦 Interface Letter-Boxes (comme "Mots")

- **Cases individuelles** pour questions INPUT et REMPLIR-BLANCS
- **Validation EN TEMPS RÉEL** lettre par lettre :
  - 🟢 VERT : Lettre correcte à la bonne position (verrouillée)
  - 🟡 JAUNE : Lettre existe mais mauvaise position
  - 🔴 ROUGE : Lettre n'existe pas
- **Lettres vertes verrouillées** : Ne peuvent pas être effacées
- **Curseur intelligent** : Se positionne automatiquement
- **Support mobile** : Input invisible + clavier tactile

#### 🎯 Système d'essais amélioré

- **3 tentatives** par question
- **Compteur visuel** : "Encore X essais"
- **Affichage automatique** de la bonne réponse après 3 échecs
- Suppression des boutons "Réessayer/Passer" (inutiles)

#### 🧠 Validation intelligente

- **Ignore majuscules/minuscules** : "Paris" = "paris" = "PARIS"
- **Ignore les accents** : "éléphant" = "elephant"
- **Caractères spéciaux** : "œ" → "oe", "Cœur" = "Coeur"
- **Chiffres acceptés** : "8", "1989", "H2O", etc.

#### 💡 Hints améliorés

- **3 hints** pour INPUT/REMPLIR-BLANCS (au lieu de 2)
- **2 hints** pour autres types (au lieu de 1)
- **Prompt IA optimisé** : Réponse fournie à l'IA pour meilleurs indices
- **Hints progressifs** : Subtil → Précis → Très direct
- **Loader discret** : Petit spinner dans le bouton
- **Temperature : 0.8** | **Max tokens : 150**

### 🔧 Corrections de bugs

- ✅ Bouton "Déconnexion" maintenant visible
- ✅ Validation `false` (questions vrai/faux) corrigée
- ✅ Normalisation complète des réponses

### 📚 Contenu

- 20 questions Culture générale enfants
- 20 questions Science enfants
- 20 questions Histoire enfants
- Adaptées au niveau CE2/CM1 (8 ans)

---

## v1.0.2 - 18/10/2025 💡 Hints améliorés pour enfants

### ✨ Nouveautés

- ✅ **2 hints pour questions INPUT** : Progression général → précis
- ✅ **Prompts adaptés aux enfants** (7-12 ans) : Vocabulaire simple
- ✅ **Hints progressifs** : Hint 1 vague, Hint 2 plus direct
- ✅ **Affichage multiple** : Hints empilés visuellement
- ✅ **Bouton dynamique** : Affiche le compteur (ex: "Hint 2/2")

### 🎓 Amélioration pédagogique

- **Ton encourageant** : "Tu peux y arriver !"
- **Langage adapté** : Mots simples pour les enfants
- **Exemples concrets** : "Pense à la grande tour en métal"
- **Ne donne jamais la réponse** : L'enfant réfléchit

### 🔧 Technique

- `generateHint()` accepte maintenant `hintNumber` (1 ou 2)
- Système de clés `questionId_hintNumber` pour le cache
- Hint 1 sauvegardé en DB, Hint 2 en cache mémoire
- Fallback hints aussi en double pour INPUT

---

## v1.0.1 - 18/10/2025 ⚡ Cache Busting & Version Badge

### ✨ Nouveautés

- ✅ **Cache busting automatique** : Plus besoin de vider le cache manuellement
- ✅ **Badge de version** visible en haut à droite
- ✅ **Timestamp unique** pour forcer le rechargement des scripts et CSS
- ✅ **API DeepSeek configurée** avec la clé depuis math/

### 🔧 Améliorations techniques

- Scripts chargés dynamiquement avec `?v=${timestamp}`
- CSS chargé avec cache bust
- Meta tags anti-cache ajoutés
- Version affichée automatiquement dans le badge

### 🎯 Impact utilisateur

- **Mobile** : Mise à jour automatique sans vider le cache
- **Desktop** : Rafraîchissement (F5) suffit pour avoir la dernière version
- **Version visible** : Badge cliquable en haut à droite

---

## v1.0.0 - 18/10/2025 🎉 Version initiale

### ✨ Fonctionnalités principales

- **7 types de questions** : Input, QCM, Vrai/Faux, Ordre, Association, Glisser-Déposer, Remplir-blancs
- **3 catégories** : Culture générale (🎭), Science (🔬), Histoire (📜)
- **30 questions d'exemple** dans Supabase
- **Shuffle automatique** des réponses (QCM, Ordre, Association, Glisser-Déposer)
- **Validation flexible** pour les réponses textuelles

### 🤖 Intelligence Artificielle

- **Hints générés par IA** via DeepSeek
- **1 hint maximum** par question
- **Sauvegarde DB** pour économiser les appels API
- **Fallback** si API non configurée

### 👤 Gestion utilisateurs

- **Session partagée** avec math/, mots/, heures/, cathegories/
- **Mode anonyme** : Jouer sans connexion
- **Mode connecté** : Progression sauvegardée en cookies
- **Multi-utilisateurs** : Chacun sa progression
- **Persistance** au refresh de page

### 📊 Système de progression

- **Questions réussies** : Sauvegardées, ne reviennent pas
- **Questions échouées** : Reproposées après 5-30 min (délai aléatoire)
- **Compteurs** par catégorie
- **Célébrations** pour catégories et jeu complet

### 🎨 Interface

- **Design moderne** inspiré de math/
- **Inputs style** cathegories/
- **Responsive** mobile et desktop
- **Animations** fluides et confettis
- **Sons synthétiques** (Web Audio API, pas de fichiers requis)

### 🗄️ Base de données

- **Tables Supabase** : `cultures_categories`, `cultures_questions`
- **Fonctions SQL** : `get_questions_by_category()`, `update_question_hint()`
- **Vues** : Statistiques par catégorie
- **RLS** configuré

---

## 📝 Notes de version

### Comment vérifier votre version

1. Regardez le **badge en haut à droite** de l'écran
2. Ouvrez la **console** (F12) : `🎮 Jeu de Cultures - Version X.X.X`
3. Regardez le **footer** en bas de page

### Comment mettre à jour

Grâce au cache busting, **rechargez simplement la page** (F5) !

Plus besoin de :

- ❌ Vider le cache
- ❌ Ctrl + Shift + R
- ❌ Mode navigation privée

Un simple **F5** charge automatiquement la dernière version ! ✅

---

## 🔄 Prochaines versions prévues

### v1.1.0 (à venir)

- [ ] Ajout de catégories (Géographie, Sport, Art)
- [ ] Plus de questions (objectif : 100+)
- [ ] Mode révision (questions échouées uniquement)

### v1.2.0 (à venir)

- [ ] Statistiques détaillées
- [ ] Export de progression
- [ ] Mode challenge avec timer

### v2.0.0 (futur)

- [ ] Mode multijoueur
- [ ] Classement / Leaderboard
- [ ] Badges et achievements

---

**Version actuelle : v2.1.9** ✅
