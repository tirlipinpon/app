# 🎓 Cultures Admin - Interface d'Administration

Interface d'administration Angular pour gérer les catégories et questions du jeu éducatif Cultures.

## ✅ Fonctionnalités

### 🔐 Authentification

- Connexion sécurisée avec Supabase
- Routes protégées par guard
- Gestion de session

### 📚 Gestion des Catégories

- CRUD complet
- Recherche d'emojis intelligente (tapez "science", "nature", etc.)
- Interface moderne

### ❓ Gestion des Questions

**Types de questions supportés** :

- ✅ **Texte libre** (input)
- ✅ **QCM** (choix multiples)
- ✅ **Vrai/Faux**
- ✅ **Ordre** (chronologique)
- ✅ **Association** (relier 2 colonnes)
- ✅ **Glisser-Déposer** (catégoriser)
- ✅ **Remplir les blancs** (réponses multiples)
- ✅ **Carte clicable** (map-click avec upload d'image)
- ✅ **Chronologie** (timeline)

**Fonctionnalités** :

- Filtrage par catégorie ET par type
- Interface adaptée à chaque type de question
- Gestion visuelle des options/réponses
- Bouton "Auto-générer" pour gagner du temps
- Bouton "Remonter" pour navigation

### 🗺️ Map-Click (Nouvelle fonctionnalité)

- Upload d'image avec optimisation automatique (600x600, WebP, <400ko)
- Dessin de zones clicables à la souris (polygones)
- Plusieurs zones possibles (comme un QCM visuel)
- Une zone marquée comme correcte
- Stockage dans Supabase Storage

## 🚀 Démarrage

```bash
npm start
```

URL: http://localhost:4200

## 📦 Build

```bash
npm run deploy
```

Cette commande :

1. Incrémente la version automatiquement
2. Build le projet avec base-href pour jardin-iris.be
3. Génère les fichiers dans `dist/cultures-admin/browser/`

## 📤 Déploiement

Uploadez tout le contenu de `dist/cultures-admin/browser/` vers :
`/customers/b/7/2/jardin-iris.be/httpd.www/app/cultures-admin/`

URL finale : https://jardin-iris.be/app/cultures-admin/

## 🔧 Configuration

### Supabase

Les clés sont déjà configurées dans `src/environments/environment.ts` et `environment.prod.ts`

### Base de données

Exécuter si nécessaire : `SQL_AJOUTER_DESCRIPTION.sql`

## 📝 Version actuelle

**v1.0.20** - Map-click avec upload d'images et dessin de zones

## 🎨 Technologies

- Angular 20 (standalone components)
- Supabase (Auth + Database + Storage)
- TypeScript
- CSS moderne
- Canvas API pour optimisation images
- Signals pour state management

## 📞 Support

Vérifiez :

- Connexion Supabase OK
- Bucket "culture-app" existe dans Supabase Storage
- Politiques RLS configurées

---

Développé avec ❤️ pour l'éducation
