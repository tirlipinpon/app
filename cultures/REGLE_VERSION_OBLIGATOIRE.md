# 🚨 RÈGLE OBLIGATOIRE - MISE À JOUR VERSION

## ⚠️ RÈGLE CRITIQUE ⚠️

**À CHAQUE MODIFICATION DE CODE, JE DOIS TOUJOURS :**

1. ✅ **MODIFIER `GAME_VERSION`** dans `cultures/js/game.js`
2. ✅ **MODIFIER le footer** dans `cultures/index.html`
3. ✅ **METTRE À JOUR `VERSION.md`**
4. ✅ **CRÉER un `CHANGELOG`** si nécessaire

## 🔥 ORDRE STRICT :

1. **MODIFIER LE CODE** (questionManager.js, uiManager.js, etc.)
2. **IMMÉDIATEMENT APRÈS** → METTRE À JOUR LA VERSION
3. **JAMAIS OUBLIER** → Cette règle est OBLIGATOIRE

## 📝 EXEMPLE :

```javascript
// 1. Modifier le code
search_replace(file_path, old_string, new_string);

// 2. IMMÉDIATEMENT mettre à jour la version
search_replace(
  file_path,
  "const GAME_VERSION = '2.1.3';",
  "const GAME_VERSION = '2.1.4';"
);
search_replace(file_path, "v2.1.3", "v2.1.4");
```

## 🚨 RAPPEL CONSTANT :

L'utilisateur me demande DEPUIS 4 FOIS de faire cela automatiquement !
JE NE DOIS JAMAIS OUBLIER CETTE RÈGLE !

---

**Cette règle est CRITIQUE et OBLIGATOIRE ! 🚨**
