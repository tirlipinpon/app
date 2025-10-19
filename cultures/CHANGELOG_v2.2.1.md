# 🔧 Cultures v2.2.1 - Correction Timeline & Map-Click

**Date**: 19 octobre 2025

## 🐛 Corrections pour nouveaux types

### Problème : Questions timeline/map-click ne se chargeaient pas

**Erreur** :

```
❌ Pas de réponse trouvée pour: q_timeline_2
❌ Impossible de préparer la question
```

**Cause** :

- `prepareQuestion()` cherchait `answer.value` pour tous les types sauf `association`
- Pour `timeline` et `map-click`, l'answer est **directement la valeur** (pas dans `.value`)

### Solution implémentée

#### 1. Gestion des formats d'answer dans `prepareQuestion()`

```javascript
if (questionData.question_type === "association") {
  // answer = {left, right, pairs}
  finalAnswer = questionData.answer;
} else if (
  questionData.question_type === "timeline" ||
  questionData.question_type === "map-click"
) {
  // answer = valeur directe (array ou string)
  finalAnswer = questionData.answer;
} else {
  // answer = {value, validateFlexible}
  finalAnswer = questionData.answer.value;
}
```

#### 2. Shuffle pour timeline ajouté

```javascript
shuffleTimeline(question) {
  const events = [...question.originalOptions];
  this.shuffleArray(events);
  question.options = events;
}
```

#### 3. Map-click sans shuffle

```javascript
case 'map-click':
  // Les zones de la carte sont fixes
  question.options = question.originalOptions;
  break;
```

## 🔧 Modifications

### Dans `questionManager.js`

- **Modifié** : `prepareQuestion()` - Gestion de 3 formats d'answer différents
- **Ajouté** : `shuffleTimeline()` - Mélange les événements à chaque affichage
- **Ajouté** : Cas `map-click` dans `applyShuffleByType()`

## ✅ Résultat

Les questions timeline et map-click se chargent maintenant correctement !

**Timeline** :

- Les événements sont mélangés à chaque affichage
- L'ordre correct est stocké dans `answer`

**Map-click** :

- Les zones restent fixes
- La zone correcte est stockée dans `answer`

---

**Version**: 2.2.1  
**Statut**: ✅ Corrigé
