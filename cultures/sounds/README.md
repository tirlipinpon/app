# 🔊 Dossier des Sons

Ce dossier est destiné à contenir les fichiers sonores du jeu.

## 📝 Mode actuel

Pour l'instant, le jeu utilise des **sons générés par Web Audio API** (beeps synthétiques).

**✅ Aucun fichier requis** : Le jeu fonctionne parfaitement sans fichiers MP3 !

---

## 🎵 Comment utiliser TES PROPRES fichiers audio (optionnel)

### **Étape 1 : Télécharger des sons** 📥

Sites gratuits recommandés :

- [Freesound.org](https://freesound.org/) - Sons libres de droits
- [Zapsplat.com](https://www.zapsplat.com/) - Effets sonores gratuits
- [Mixkit.co](https://mixkit.co/free-sound-effects/) - Sons de qualité
- [Pixabay](https://pixabay.com/sound-effects/) - Sons et musiques

### **Étape 2 : Placer tes fichiers ici** 📁

Copie tes fichiers dans ce dossier `sounds/` avec ces noms **EXACTEMENT** :

```
sounds/
├── correct.mp3           ✅ Son réponse correcte (ding joyeux)
├── incorrect.mp3         ❌ Son réponse incorrecte (erreur douce)
├── click.mp3             🖱️ Son pour boutons (petit clic)
├── hint.mp3              💡 Son pour l'aide (mystérieux)
├── success.mp3           🎉 Son victoire (applaudissements)
└── category-complete.mp3 🏆 Son catégorie terminée (fanfare)
```

**⚠️ IMPORTANT:** Les noms doivent être **exactement** comme indiqué.

### **Étape 3 : Activer le mode fichiers audio** ⚙️

1. Ouvre le fichier `js/soundManager.js`
2. Trouve la ligne 7 :
   ```javascript
   this.useAudioFiles = false;
   ```
3. Change-la en :
   ```javascript
   this.useAudioFiles = true;
   ```
4. Sauvegarde le fichier

### **✨ Système de Fallback Automatique**

Tu n'as **pas besoin d'avoir tous les fichiers** !

- ✅ Si `correct.mp3` existe → Joue ton fichier MP3
- ✅ Si `correct.mp3` n'existe pas → Joue le beep par défaut
- ✅ Tu peux n'avoir que **quelques fichiers**, le reste utilise les beeps
- ✅ L'utilisateur **entend toujours un son**, jamais de silence

### **Étape 4 : Tester** 🎮

1. Rafraîchis le navigateur : **Ctrl + Shift + R**
2. Joue au jeu
3. Tes sons personnalisés devraient se jouer !

---

## 🎵 Recommandations techniques

### **Format de fichier**

- **MP3** ✅ (meilleure compatibilité tous navigateurs)
- **WAV** ✅ (meilleure qualité, fichiers plus gros)
- **OGG** ✅ (bon compromis qualité/taille)

### **Caractéristiques audio**

- **Durée:** 0.1 à 2 secondes max (courts et réactifs)
- **Taille:** < 100 Ko par fichier (chargement rapide)
- **Volume:** Normalisés (pas trop forts ni trop faibles)
- **Bitrate:** 128 kbps suffit
- **Licence:** Creative Commons CC0 ou domaine public

### **Suggestions de recherche**

Sur Freesound.org, cherche ces termes :

- ✅ **"ding"**, **"correct"**, **"success beep"** → réponse correcte
- ❌ **"wrong"**, **"error soft"**, **"buzz"** → réponse incorrecte
- 🎉 **"success"**, **"win"**, **"cheer"** → victoire
- 🏆 **"fanfare"**, **"victory"**, **"triumph"** → catégorie terminée
- 🖱️ **"click"**, **"button"**, **"tap"** → boutons
- 💡 **"hint"**, **"mystery"**, **"question"** → aide

---

## 🎯 Résumé rapide

**Par défaut** : Sons synthétiques (beeps) → Aucune action nécessaire ✅

**Si tu veux des fichiers MP3** :
1. 📥 Télécharge les fichiers son
2. 📁 Place-les dans `sounds/` avec les bons noms
3. ⚙️ Change `useAudioFiles = true` dans `soundManager.js`
4. 🔄 Rafraîchis le navigateur
5. 🎮 Profite de tes sons personnalisés !
