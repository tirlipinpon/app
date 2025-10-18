# 📝 Changelog - Jeu Cultures

## Version 1.0.2 - 18/10/2025

### 💡 Système de hints amélioré

**Nouveautés** :

- **2 hints pour questions INPUT** : Les questions à réponse libre sont plus difficiles, maintenant 2 indices progressifs
- **Prompts adaptés enfants** : Langage simple pour 7-12 ans
- **Hints progressifs** : Hint 1 général, Hint 2 plus précis
- **Affichage amélioré** : Hints empilés avec numéro visible
- **Bouton dynamique** : Affiche "Hint 2/2" ou "Hints utilisés (2/2)"

**Exemples** :

```
Question INPUT : "Quelle est la capitale de la France ?"

Hint 1 : 💡 Pense à la plus grande ville de France, celle qu'on voit dans les films !
Hint 2 : 💡 Cette ville est connue pour sa grande tour en métal et elle est sur la Seine
```

---

## Version 1.0.1 - 18/10/2025

### ⚡ Cache busting & Version

**Nouveautés** :

- Cache busting automatique (F5 suffit)
- Badge de version visible
- API DeepSeek configurée

---

## Version 1.0.0 - 18/10/2025

### ✨ Fonctionnalités initiales

- **7 types de questions** : Input, QCM, Vrai/Faux, Ordre, Association, Glisser-Déposer, Remplir-blancs
- **3 catégories** : Culture générale, Science, Histoire
- **30 questions d'exemple** dans Supabase
- **Shuffle automatique** des réponses pour éviter la mémorisation
- **Hints IA** générés par DeepSeek (1 par question)
- **Re-proposition intelligente** des questions échouées
- **Session partagée** avec les autres jeux (math, mots, etc.)
- **Mode anonyme** : Jouer sans connexion
- **Sauvegarde automatique** de la progression en cookies

### 🗄️ Base de données

- Tables Supabase avec préfixe `cultures_` :
  - `cultures_categories`
  - `cultures_questions`
- Fonctions SQL :
  - `get_questions_by_category()`
  - `update_question_hint()`
- Vues :
  - `v_cultures_questions_with_category`
  - `v_cultures_category_stats`

### 🔧 Configuration

- Supabase configuré : `https://zmgfaiprgbawcernymqa.supabase.co`
- Support DeepSeek AI pour hints (optionnel)
- Retry delays configurables

### 🎮 Gameplay

- **Mode anonyme** : Jouer sans se connecter (progression non sauvegardée)
- **Mode connecté** : Progression sauvegardée dans cookies
- Connexion inline (pas de page séparée)
- Navigation fluide entre catégories
- Célébrations pour catégories et jeu complet

### 📊 Progression

- Questions réussies → Ne reviennent jamais
- Questions échouées → Reproposées après délai aléatoire (5-30 min)
- Compteur de progression par catégorie
- Préférences sauvegardées (catégorie sélectionnée)

### 🎨 Interface

- Design moderne inspiré de math/
- Inputs style cathegories/
- Responsive mobile
- Animations fluides
- Confettis pour célébrations

---

## 🔄 Modifications techniques

### Préfixage des tables (18/10/2025)

- `categories` → `cultures_categories`
- `questions` → `cultures_questions`
- Toutes les références mises à jour dans le code

### Mode sans connexion obligatoire (18/10/2025)

- Suppression de la page de connexion séparée
- Formulaire de connexion inline
- Jeu jouable immédiatement sans compte
- Message incitatif pour se connecter et sauvegarder

---

## 🚀 Prochaines améliorations

- [ ] Ajouter plus de questions (objectif : 100+)
- [ ] Ajouter d'autres catégories (géographie, sport, etc.)
- [ ] Mode révision (questions échouées uniquement)
- [ ] Statistiques détaillées
- [ ] Export de la progression
- [ ] Mode challenge (timer)
