# 📌 Historique des versions - Jeu Cultures

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

**Version actuelle : v1.0.1** ✅

