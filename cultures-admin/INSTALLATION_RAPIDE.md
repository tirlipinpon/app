# 🚀 Installation Rapide

## 1. Configuration Supabase (5 minutes)

### A. Créer un compte

1. Allez sur https://supabase.com
2. Créez un compte gratuit
3. Créez un nouveau projet

### B. Créer les tables

1. Dans Supabase, allez dans "SQL Editor"
2. Copiez-collez ce SQL:

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
  question_type TEXT NOT NULL,
  correct_answer TEXT NOT NULL,
  wrong_answers TEXT[],
  difficulty TEXT,
  hint TEXT,
  explanation TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Activer RLS
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE questions ENABLE ROW LEVEL SECURITY;

-- Politiques RLS (autoriser tout pour utilisateurs authentifiés)
CREATE POLICY "auth_all_categories" ON categories FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "auth_all_questions" ON questions FOR ALL TO authenticated USING (true) WITH CHECK (true);
```

3. Cliquez sur "Run"

### C. Créer un utilisateur admin

1. Dans Supabase, allez dans "Authentication" > "Users"
2. Cliquez sur "Add user" > "Create new user"
3. Entrez un email et mot de passe
4. Cliquez sur "Create user"

### D. Récupérer vos clés API

1. Allez dans "Settings" > "API"
2. Copiez:
   - **Project URL** (commence par https://xxx.supabase.co)
   - **anon public** key (clé longue)

## 2. Configuration du projet (2 minutes)

1. **Ouvrir le fichier de configuration**

   ```
   src/environments/environment.ts
   ```

2. **Remplacer les valeurs**

   ```typescript
   export const environment = {
     production: false,
     supabase: {
       url: 'COLLEZ_VOTRE_PROJECT_URL_ICI',
       anonKey: 'COLLEZ_VOTRE_ANON_KEY_ICI',
     },
   };
   ```

3. **Sauvegarder le fichier**

## 3. Démarrer l'application

```bash
npm start
```

## 4. Se connecter

1. Ouvrez http://localhost:4200 dans votre navigateur
2. Connectez-vous avec l'email et mot de passe créés dans Supabase
3. Vous êtes dans l'admin ! 🎉

## ✅ Checklist

- [ ] Compte Supabase créé
- [ ] Tables créées via SQL Editor
- [ ] Utilisateur admin créé
- [ ] Clés API copiées dans environment.ts
- [ ] Application démarrée avec `npm start`
- [ ] Connexion réussie

## 🆘 Problèmes courants

### "Invalid login credentials"

- Vérifiez que vous utilisez bien l'email/mot de passe créé dans Supabase
- Vérifiez que votre anon key est correcte

### "Failed to fetch"

- Vérifiez que votre Project URL est correcte
- Vérifiez votre connexion internet

### Les tables n'apparaissent pas

- Vérifiez que le SQL s'est bien exécuté sans erreur
- Rafraîchissez la page "Table Editor" dans Supabase

## 📞 Besoin d'aide ?

Consultez le README.md complet pour plus de détails.
