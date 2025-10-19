# 🔍 Cultures v2.1.11 - Debug Historique des Hints

**Date**: 19 octobre 2025

## 🐛 Corrections et Debug

### Problème identifié

- **Historique manquant** : Lors de la demande du 3ème hint, les hints 1 et 2 n'étaient pas inclus dans le payload envoyé à l'IA
- **Symptôme** : L'IA ne pouvait pas voir ses réponses précédentes, causant des répétitions ou des incohérences

### Améliorations du debugging

#### Logs détaillés du cache

- Ajout de logs lors de la **sauvegarde** des hints dans le cache
- Affichage de la **clé exacte** utilisée pour le stockage (format: `${questionId}_hint_${hintNumber}`)
- Log de la **taille du cache** après chaque sauvegarde

#### Logs détaillés de la récupération

- Ajout de logs lors de la **recherche** des hints précédents
- Affichage du **statut de chaque hint** (trouvé ✅ ou manquant ❌)
- Log quand un hint est **ajouté à l'historique** des messages

### Simplification de la structure des messages

#### Messages utilisateur intermédiaires retirés

- **Avant** : Après chaque hint de l'assistant, un message utilisateur était ajouté
- **Maintenant** : L'historique contient uniquement les hints de l'assistant (rôle: "assistant")
- **Résultat** : Structure plus claire et conforme aux attentes de l'API

## 🔧 Modifications techniques

### Dans `aiHintService.js`

```javascript
// Sauvegarde avec logs détaillés
this.cache.set(hintKey, hint);
console.log(`💾 Hint sauvegardé dans le cache avec la clé: "${hintKey}"`);
console.log(`📊 Taille du cache après sauvegarde: ${this.cache.size}`);

// Récupération avec logs détaillés
console.log(
  `🔍 Recherche des hints précédents pour ${questionId} (hint ${hintNumber})`
);
for (let i = 1; i < hintNumber; i++) {
  const previousHintKey = `${questionId}_hint_${i}`;
  const previousHint = this.cache.get(previousHintKey);
  console.log(
    `  📦 Cache ${previousHintKey}:`,
    previousHint ? `"${previousHint}"` : "❌ Non trouvé"
  );

  if (previousHint) {
    messages.push({
      role: "assistant",
      content: previousHint,
    });
    console.log(`  ✅ Hint ${i} ajouté à l'historique des messages`);
  }
}
```

## 📋 Prochaines étapes

Ces logs permettront d'identifier précisément pourquoi les hints précédents ne sont pas retrouvés lors de la demande du hint suivant.

**Scénarios possibles** :

1. Le cache est vidé entre deux demandes de hints
2. La clé de cache ne correspond pas (format différent)
3. L'objet `AIHintService` est réinstancié entre les hints

## ✅ Tests requis

1. Demander le **hint 1** → vérifier le log de sauvegarde
2. Demander le **hint 2** → vérifier si hint 1 est retrouvé
3. Demander le **hint 3** → vérifier si hints 1 et 2 sont retrouvés
4. Vérifier le **payload dans la console** pour confirmer la présence des messages "assistant"

---

**Version**: 2.1.11  
**Statut**: 🔍 Debug en cours
