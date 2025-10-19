# 🎓 Cultures Admin - Interface d'Administration

Interface d'administration Angular pour gérer les catégories et questions du jeu éducatif Cultures.

## 📋 Fonctionnalités

- 🔐 **Authentification sécurisée** avec Supabase
- 📚 **Gestion des catégories** (CRUD complet)
- ❓ **Gestion des questions** (CRUD complet)
- 🎨 **Interface moderne et responsive**
- 🔒 **Routes protégées** par authentification

## 🛠️ Prérequis

- Node.js 18+ et npm
- Un compte Supabase (gratuit)
- Navigateur web moderne

## 📦 Installation

1. **Installer les dépendances**

```bash
npm install
```

2. **Configurer Supabase**

   a. Créez un projet sur [Supabase](https://supabase.com)

   b. Copiez vos clés API (URL et anon key)

   c. Modifiez `src/environments/environment.ts`:

   ```typescript
   export const environment = {
     production: false,
     supabase: {
       url: 'VOTRE_URL_SUPABASE',
       anonKey: 'VOTRE_ANON_KEY_SUPABASE',
     },
   };
   ```

3. **Créer les tables dans Supabase**

   Exécutez ce SQL dans l'éditeur SQL de Supabase:

   ```sql
   -- Table des catégories
   CREATE TABLE categories (
     id BIGSERIAL PRIMARY KEY,
     name TEXT NOT NULL,
     description TEXT,
     icon TEXT,
     created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
     updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
   );

   -- Table des questions
   CREATE TABLE questions (
     id BIGSERIAL PRIMARY KEY,
     category_id BIGINT REFERENCES categories(id) ON DELETE CASCADE,
     question_text TEXT NOT NULL,
     question_type TEXT NOT NULL CHECK (question_type IN ('qcm', 'text', 'vrai_faux', 'association', 'timeline', 'mapclick')),
     correct_answer TEXT NOT NULL,
     wrong_answers TEXT[],
     difficulty TEXT CHECK (difficulty IN ('facile', 'moyen', 'difficile')),
     hint TEXT,
     explanation TEXT,
     created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
     updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
   );

   -- Fonction pour mettre à jour updated_at automatiquement
   CREATE OR REPLACE FUNCTION update_updated_at_column()
   RETURNS TRIGGER AS $$
   BEGIN
     NEW.updated_at = NOW();
     RETURN NEW;
   END;
   $$ LANGUAGE plpgsql;

   -- Trigger pour categories
   CREATE TRIGGER update_categories_updated_at
     BEFORE UPDATE ON categories
     FOR EACH ROW
     EXECUTE FUNCTION update_updated_at_column();

   -- Trigger pour questions
   CREATE TRIGGER update_questions_updated_at
     BEFORE UPDATE ON questions
     FOR EACH ROW
     EXECUTE FUNCTION update_updated_at_column();

   -- Index pour améliorer les performances
   CREATE INDEX idx_questions_category_id ON questions(category_id);
   CREATE INDEX idx_questions_type ON questions(question_type);
   CREATE INDEX idx_questions_difficulty ON questions(difficulty);
   ```

4. **Configurer les politiques RLS (Row Level Security)**

   Dans Supabase, allez dans Authentication > Policies et créez les politiques nécessaires pour sécuriser vos tables.

   Exemple simple (à adapter selon vos besoins):

   ```sql
   -- Activer RLS
   ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
   ALTER TABLE questions ENABLE ROW LEVEL SECURITY;

   -- Permettre toutes les opérations pour les utilisateurs authentifiés
   CREATE POLICY "Les utilisateurs authentifiés peuvent tout faire sur categories"
     ON categories FOR ALL
     TO authenticated
     USING (true)
     WITH CHECK (true);

   CREATE POLICY "Les utilisateurs authentifiés peuvent tout faire sur questions"
     ON questions FOR ALL
     TO authenticated
     USING (true)
     WITH CHECK (true);
   ```

5. **Créer un utilisateur admin dans Supabase**

   Allez dans Authentication > Users > Add user et créez votre compte admin.

## 🚀 Démarrage

```bash
# Mode développement
npm start

# L'application sera accessible sur http://localhost:4200
```

## 🏗️ Build pour production

```bash
npm run build

# Les fichiers seront générés dans le dossier dist/
```

## 📱 Utilisation

1. **Connexion**

   - Accédez à http://localhost:4200
   - Connectez-vous avec votre email et mot de passe Supabase

2. **Gérer les catégories**

   - Créez des catégories avec nom, description et icône
   - Modifiez ou supprimez les catégories existantes

3. **Gérer les questions**
   - Créez des questions par catégorie
   - Choisissez le type (QCM, texte, vrai/faux, etc.)
   - Ajoutez des indices et explications
   - Définissez la difficulté

## 🔧 Structure du projet

```
cultures-admin/
├── src/
│   ├── app/
│   │   ├── components/       # Composants Angular
│   │   │   ├── login/        # Composant de connexion
│   │   │   ├── admin/        # Layout admin
│   │   │   ├── categories/   # Gestion catégories
│   │   │   └── questions/    # Gestion questions
│   │   ├── services/         # Services
│   │   │   ├── supabase.service.ts
│   │   │   ├── auth.service.ts
│   │   │   └── data.service.ts
│   │   ├── models/           # Interfaces TypeScript
│   │   ├── guards/           # Guards de route
│   │   └── app.routes.ts     # Configuration des routes
│   ├── environments/         # Configuration environnement
│   └── styles.css           # Styles globaux
└── README.md
```

## 🎨 Types de questions supportés

- **QCM**: Questions à choix multiples
- **Texte**: Réponse libre
- **Vrai/Faux**: Question binaire
- **Association**: Lier des éléments
- **Timeline**: Ordonner chronologiquement
- **MapClick**: Cliquer sur une carte

## 🔐 Sécurité

- Authentification via Supabase Auth
- Routes protégées par guard
- RLS (Row Level Security) sur les tables
- Variables d'environnement pour les clés sensibles

## 📝 Notes importantes

- Ne commitez JAMAIS vos clés Supabase dans Git
- Utilisez les variables d'environnement pour la production
- Configurez correctement les politiques RLS dans Supabase
- Testez toujours en local avant de déployer

## 🆘 Support

Pour toute question ou problème:

1. Vérifiez que Supabase est bien configuré
2. Vérifiez la console du navigateur pour les erreurs
3. Consultez la documentation de [Supabase](https://supabase.com/docs)
4. Consultez la documentation d'[Angular](https://angular.dev)

## 📄 Licence

Ce projet est développé pour l'application Cultures.

---

Développé avec ❤️ pour faciliter la gestion du contenu éducatif
