# 🐛 Cultures v2.1.14 - Correction Format Clé (Suite)

**Date**: 19 octobre 2025

## 🚨 BUG CRITIQUE CORRIGÉ

### Problème : Hints toujours au numéro 1

**Symptôme** :

- Quand on cliquait 3 fois sur "Besoin d'aide ?", on obtenait 3 fois le **hint 1**
- Les payloads envoyés à l'IA étaient identiques (tous demandaient le PREMIER INDICE)
- Le système ne progressait jamais vers hint 2, puis hint 3

**Cause** :
La fonction `getUsedHintCount()` utilisait un **mauvais format de clé** :

```javascript
// ❌ MAUVAIS
if (this.usedHints.has(`${questionId}_${i}`)) {
  count++;
}
```

Alors que les hints étaient enregistrés avec :

```javascript
this.usedHints.add(`${questionId}_hint_${hintNumber}`);
```

**Résultat** :

- Le système ne trouvait JAMAIS les hints déjà utilisés
- `getUsedHintCount()` retournait toujours `{ used: 0, max: 3 }`
- `getNextHintNumber()` retournait toujours `0 + 1 = 1`
- **Toujours le hint 1 !**

## ✅ Solution

### Corrections dans `aiHintService.js`

#### 1. Ligne 35 - Vérification des hints utilisés dans `generateHint()`

```javascript
// AVANT
if (this.usedHints.has(`${questionId}_${i}`)) {

// MAINTENANT
if (this.usedHints.has(`${questionId}_hint_${i}`)) {
```

#### 2. Ligne 591 - Fonction `getUsedHintCount()`

```javascript
// AVANT
if (this.usedHints.has(`${questionId}_${i}`)) {

// MAINTENANT
if (this.usedHints.has(`${questionId}_hint_${i}`)) {
```

## 🎉 Résultat attendu

Maintenant, quand tu cliques sur "Besoin d'aide ?" :

**1er clic** → Hint 1 :

```
getUsedHintCount() → { used: 0, max: 3 }
getNextHintNumber() → 1
```

**2ème clic** → Hint 2 :

```
getUsedHintCount() → { used: 1, max: 3 }  ✅ Trouve hint 1
getNextHintNumber() → 2  ✅ Demande hint 2
```

**3ème clic** → Hint 3 :

```
getUsedHintCount() → { used: 2, max: 3 }  ✅ Trouve hints 1 et 2
getNextHintNumber() → 3  ✅ Demande hint 3
```

**Payload envoyé à l'IA pour hint 3** :

```json
{
  "messages": [
    {"role": "system", "content": "..."},
    {"role": "user", "content": "📝 QUESTION : ..."},
    {"role": "assistant", "content": "💡 Hint 1..."},  ✅
    {"role": "assistant", "content": "💡 Hint 2..."},  ✅
    {"role": "user", "content": "Donne le TROISIÈME INDICE..."}
  ]
}
```

## 📋 Historique des bugs de format de clé

Ce bug complète la correction de v2.1.13 :

- **v2.1.13** : Correction de `hintKey` dans `generateHint()` (ligne 19)
- **v2.1.14** : Correction de `hintKey` dans `getUsedHintCount()` (lignes 35 et 591)

**Les 3 endroits utilisent maintenant le même format** : `${questionId}_hint_${i}` ✅

---

**Version**: 2.1.14  
**Statut**: ✅ BUG CRITIQUE CORRIGÉ
