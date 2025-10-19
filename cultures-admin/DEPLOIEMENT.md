# 🚀 Guide de Déploiement

## Options de déploiement

### 1. Vercel (Recommandé - Gratuit)

1. **Préparez votre projet**

   ```bash
   npm run build
   ```

2. **Installez Vercel CLI**

   ```bash
   npm install -g vercel
   ```

3. **Déployez**

   ```bash
   vercel
   ```

4. **Variables d'environnement**
   - Dans le dashboard Vercel, ajoutez vos variables d'environnement
   - Allez dans Settings > Environment Variables
   - Ajoutez:
     - `SUPABASE_URL`: votre URL Supabase
     - `SUPABASE_ANON_KEY`: votre clé anonyme

### 2. Netlify (Gratuit)

1. **Créez un fichier netlify.toml**

   ```toml
   [build]
     publish = "dist/cultures-admin/browser"
     command = "npm run build"

   [[redirects]]
     from = "/*"
     to = "/index.html"
     status = 200
   ```

2. **Déployez via CLI ou Git**

   - Connectez votre repo GitHub
   - Ou utilisez Netlify CLI: `netlify deploy --prod`

3. **Variables d'environnement**
   - Dans Netlify dashboard > Site settings > Environment variables
   - Ajoutez vos clés Supabase

### 3. Firebase Hosting

1. **Installez Firebase CLI**

   ```bash
   npm install -g firebase-tools
   firebase login
   firebase init hosting
   ```

2. **Configuration firebase.json**

   ```json
   {
     "hosting": {
       "public": "dist/cultures-admin/browser",
       "ignore": ["firebase.json", "**/.*", "**/node_modules/**"],
       "rewrites": [
         {
           "source": "**",
           "destination": "/index.html"
         }
       ]
     }
   }
   ```

3. **Déployez**
   ```bash
   npm run build
   firebase deploy
   ```

### 4. Serveur personnalisé (VPS, AWS, etc.)

1. **Build**

   ```bash
   npm run build
   ```

2. **Servir les fichiers statiques**

   - Les fichiers sont dans `dist/cultures-admin/browser`
   - Configurez votre serveur web (Nginx, Apache) pour servir ces fichiers
   - Important: Configurez les rewrites pour le routing Angular

3. **Exemple Nginx**

   ```nginx
   server {
     listen 80;
     server_name votre-domaine.com;
     root /var/www/cultures-admin/browser;
     index index.html;

     location / {
       try_files $uri $uri/ /index.html;
     }
   }
   ```

## 🔒 Sécurité en Production

### 1. Variables d'environnement

- Ne jamais commiter les fichiers `environment.ts` et `environment.prod.ts`
- Utilisez les variables d'environnement de votre plateforme

### 2. Supabase

- Activez RLS (Row Level Security) sur toutes les tables
- Configurez des politiques restrictives
- Limitez les permissions aux utilisateurs authentifiés uniquement

### 3. HTTPS

- Toujours utiliser HTTPS en production
- La plupart des plateformes (Vercel, Netlify) le font automatiquement

### 4. CORS

- Configurez les CORS dans Supabase si nécessaire
- Allez dans Settings > API > CORS

## 📝 Checklist de déploiement

- [ ] Tests locaux réussis
- [ ] Variables d'environnement configurées
- [ ] Build de production réussi (`npm run build`)
- [ ] RLS activé sur Supabase
- [ ] Politiques de sécurité configurées
- [ ] HTTPS activé
- [ ] Test de connexion en production
- [ ] Test CRUD catégories
- [ ] Test CRUD questions
- [ ] Vérification responsive (mobile/tablet)

## 🔄 Mises à jour

Pour mettre à jour votre application déployée:

1. **Testez localement**
2. **Committez vos changements**
3. **Build et redéployez**
   ```bash
   npm run build
   vercel --prod  # ou netlify deploy --prod, etc.
   ```

## 📊 Monitoring

- Utilisez Supabase Dashboard pour voir les logs
- Configurez Google Analytics si nécessaire
- Surveillez les erreurs avec Sentry (optionnel)

## 💡 Optimisations

1. **Lazy Loading**

   - Déjà implémenté avec les composants standalone

2. **Cache**

   - Configurez le cache HTTP sur votre serveur

3. **CDN**

   - Vercel et Netlify utilisent automatiquement un CDN

4. **Compression**
   - Activez gzip/brotli sur votre serveur

---

Bon déploiement ! 🎉
