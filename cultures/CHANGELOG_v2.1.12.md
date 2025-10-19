# 🔧 Cultures v2.1.12 - Correction Lecture Vocale

**Date**: 19 octobre 2025

## 🐛 Problème résolu

### Erreur JavaScript lors de la lecture vocale des hints

**Symptôme** :

```
speakHint('💡🏛️ Cette invention révolutionnaire est née en Europe au 15ème siècle...
```

La fonction ne s'exécutait pas complètement à cause d'apostrophes dans le texte.

**Cause** :

- Utilisation de `onclick="speakHint('...')"` avec des apostrophes non échappées dans le texte
- Le texte contenait des apostrophes (ex: "l'invention", "d'Europe") qui cassaient la chaîne JavaScript
- La méthode `.replace(/'/g, "\\'")` ne suffisait pas dans tous les cas

## ✅ Solution implémentée

### Event Listeners au lieu de onclick inline

**Avant** (❌ CASSÉ) :

```javascript
hintDiv.innerHTML = `
  <button onclick="speakHint('${hintText.replace(/'/g, "\\'")}')">
    🔊
  </button>
`;
```

**Maintenant** (✅ FONCTIONNE) :

```javascript
hintDiv.innerHTML = `
  <button class="hint-speak-btn" title="Lire à haute voix">
    🔊
  </button>
`;

// Attacher l'event listener avec le texte en closure
const speakBtn = hintDiv.querySelector(".hint-speak-btn");
speakBtn.addEventListener("click", () => {
  if (window.aiHintService) {
    window.aiHintService.speakText(hintText);
  }
});
```

## 🎯 Avantages de cette approche

1. **Pas d'échappement nécessaire** : Le texte est passé directement via la closure JavaScript
2. **Support de tous les caractères** : Apostrophes, guillemets, emojis, etc.
3. **Plus propre** : Séparation du HTML et de la logique JavaScript
4. **Plus sûr** : Pas d'injection de code possible via le texte

## 🔧 Modifications techniques

### Dans `uiManager.js`

- **Modifié** : `displayHint()` - utilise maintenant `addEventListener` au lieu de `onclick`
- **Supprimé** : `window.speakHint` - fonction globale plus nécessaire

## ✅ Tests

La lecture vocale fonctionne maintenant avec tous les textes, même ceux contenant :

- Des apostrophes : "l'invention", "d'Europe"
- Des guillemets : "la «révolution»"
- Des emojis : 💡🏛️📜✨
- Des caractères spéciaux : accents, ponctuation, etc.

---

**Version**: 2.1.12  
**Statut**: ✅ Corrigé
