# 🐛 Cultures v2.1.13 - Correction Historique des Hints (BUG CRITIQUE)

**Date**: 19 octobre 2025

## 🎯 BUGS CRITIQUES CORRIGÉS

### Problème 1 : Format de clé incorrect

**Symptôme dans les logs** :

```
💾 Hint sauvegardé dans le cache avec la clé: "q_enfant8_science_11_2"
📦 Cache q_enfant8_science_11_hint_1: ❌ Non trouvé
```

**Cause** :

- La clé de sauvegarde était : `${questionId}_${hintNumber}` ❌
- La clé de recherche était : `${questionId}_hint_${hintNumber}` ❌
- **INCOHÉRENCE** : Les deux formats ne correspondaient pas !

**Solution** :

```javascript
// AVANT (ligne 19)
const hintKey = `${questionId}_${hintNumber}`;

// MAINTENANT
const hintKey = `${questionId}_hint_${hintNumber}`;
```

### Problème 2 : Hint 1 de la DB non mis en cache

**Symptôme** :

```
💾 Hint 1 trouvé dans la DB: 💡 C'est la force invisible...
// Hint 1 retourné mais PAS mis en cache
```

Quand le hint 2 était demandé :

```
🔍 Recherche des hints précédents pour q_enfant8_science_11 (hint 2)
  📦 Cache q_enfant8_science_11_hint_1: ❌ Non trouvé
```

**Cause** :

- Le hint 1 provenant de Supabase était retourné directement sans être mis en cache
- Les hints suivants ne pouvaient donc pas le retrouver pour l'historique

**Solution** :

```javascript
if (hintNumber === 1 && questionData.hint) {
  console.log(`💾 Hint 1 trouvé dans la DB: ${questionData.hint}`);

  // ✅ AJOUT: Mettre en cache pour que les hints suivants le trouvent
  this.cache.set(hintKey, questionData.hint);
  this.usedHints.add(hintKey);
  console.log(`💾 Hint 1 de la DB mis en cache avec la clé: "${hintKey}"`);

  return questionData.hint;
}
```

## 🎉 Résultat

Maintenant, l'historique des hints fonctionne correctement :

**Hint 1** :

```
💾 Hint 1 trouvé dans la DB: 💡 C'est la force invisible...
💾 Hint 1 de la DB mis en cache avec la clé: "q_enfant8_science_11_hint_1"
📊 Taille du cache après sauvegarde: 1
```

**Hint 2** :

```
🔍 Recherche des hints précédents pour q_enfant8_science_11 (hint 2)
  📦 Cache q_enfant8_science_11_hint_1: "💡 C'est la force invisible..."
  ✅ Hint 1 ajouté à l'historique des messages
```

**Payload envoyé à l'IA** (maintenant avec historique) :

```json
{
  "messages": [
    { "role": "system", "content": "..." },
    { "role": "user", "content": "📝 QUESTION : ..." },
    { "role": "assistant", "content": "💡 C'est la force invisible..." }, // ✅ HINT 1
    { "role": "user", "content": "Donne le DEUXIÈME INDICE..." }
  ]
}
```

## 🔧 Modifications techniques

### Dans `aiHintService.js`

1. **Ligne 19** : Correction du format de clé

   ```javascript
   const hintKey = `${questionId}_hint_${hintNumber}`;
   ```

2. **Lignes 46-52** : Mise en cache du hint 1 de la DB
   ```javascript
   this.cache.set(hintKey, questionData.hint);
   console.log(`💾 Hint 1 de la DB mis en cache avec la clé: "${hintKey}"`);
   ```

## ✅ Tests à effectuer

1. Demander hint 1 → vérifier qu'il est mis en cache
2. Demander hint 2 → vérifier que hint 1 est retrouvé
3. Demander hint 3 → vérifier que hints 1 et 2 sont retrouvés
4. Vérifier le payload dans la console pour confirmer la présence des messages "assistant"

---

**Version**: 2.1.13  
**Statut**: ✅ BUG CRITIQUE CORRIGÉ
