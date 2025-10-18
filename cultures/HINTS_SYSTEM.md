# 💡 Système de Hints - Jeu Cultures

## 🎯 Fonctionnement

### Règles selon le type de question

| Type de question          | Nombre de hints | Raison                                      |
| ------------------------- | --------------- | ------------------------------------------- |
| **Input** (réponse libre) | **2 hints** 🔥  | Questions difficiles, l'enfant doit deviner |
| QCM                       | 1 hint          | Les options sont déjà visibles              |
| Vrai-Faux                 | 1 hint          | Seulement 2 choix possibles                 |
| Ordre                     | 1 hint          | Les éléments sont visibles                  |
| Association               | 1 hint          | Les paires sont visibles                    |
| Glisser-Déposer           | 1 hint          | Les items sont visibles                     |
| Remplir-blancs            | 1 hint          | Contexte dans la phrase                     |

---

## 📚 Exemple : Question INPUT

### Question

```
"Quelle est la capitale de la France ?"
```

### Bouton hint initial

```
[💡 Besoin d'aide ?]
```

### Premier clic → Hint 1 (général)

**Prompt envoyé à l'IA** :

```
Tu es un assistant pédagogique TRÈS bienveillant pour des ENFANTS (7-12 ans)

CONTEXTE :
- Public : Enfants de 7 à 12 ans
- Question : "Quelle est la capitale de la France ?"
- Indice numéro : 1

CONSIGNES :
- Donne un PREMIER indice général et encourageant
- Oriente dans la bonne direction SANS donner la réponse
- Reste vague et pédagogique
- Maximum 20 mots
- Vocabulaire SIMPLE adapté aux enfants
```

**Réponse IA** :

```
💡 Pense à la plus grande ville de France, celle qu'on voit dans les films !
```

**Affichage** :

```
┌──────────────────────────────────────┐
│ Indice 1/2                           │
│ 💡 Pense à la plus grande ville de  │
│    France, celle qu'on voit dans     │
│    les films !                       │
└──────────────────────────────────────┘

[💡 Hint 2/2]  ← Bouton actif
```

---

### Deuxième clic → Hint 2 (précis)

**Prompt envoyé à l'IA** :

```
CONTEXTE :
- Indice numéro : 2

CONSIGNES :
- C'est le DEUXIÈME indice, sois plus PRÉCIS
- Donne plus de détails pour vraiment aider
- Tu peux être plus direct, mais NE DONNE PAS la réponse exacte
```

**Réponse IA** :

```
💡 Cette ville est connue pour sa grande tour en métal et elle est sur la Seine
```

**Affichage** :

```
┌──────────────────────────────────────┐
│ Indice 1/2                           │
│ 💡 Pense à la plus grande ville...  │
└──────────────────────────────────────┘

┌──────────────────────────────────────┐
│ Indice 2/2                           │
│ 💡 Cette ville est connue pour sa   │
│    grande tour en métal et elle est  │
│    sur la Seine                      │
└──────────────────────────────────────┘

[💡 Hints utilisés (2/2)]  ← Bouton désactivé
```

---

## 🎨 Affichage visuel

### Progression des hints

```
Question INPUT :
[💡 Besoin d'aide ?]  →  Clic 1  →  [💡 Hint 2/2]  →  Clic 2  →  [💡 Hints utilisés (2/2)]
     ↓                                    ↓                               ↓
  Hint 1 affiché                      Hint 2 affiché                 Plus de hints

Question QCM :
[💡 Besoin d'aide ?]  →  Clic 1  →  [💡 Hints utilisés (1/1)]
     ↓                                    ↓
  Hint 1 affiché                      Plus de hints
```

---

## 🤖 Prompts adaptés aux enfants (7-12 ans)

### Caractéristiques

✅ **Vocabulaire simple** : Pas de mots compliqués  
✅ **Phrases courtes** : Maximum 20 mots  
✅ **Ton encourageant** : "Tu peux y arriver !"  
✅ **Progressif** : Hint 1 vague → Hint 2 précis  
✅ **Jamais la réponse** : L'enfant doit réfléchir

### Exemples de prompts

#### Pour une question de Culture

```
Question : "Qui a peint la Joconde ?"

Hint 1 (général) :
💡 C'est un artiste très célèbre de la Renaissance italienne, il peignait et inventait des machines !

Hint 2 (précis) :
💡 Son prénom est Léonard, et son nom c'est comme la ville de Vinci. Pense à Léonard de...
```

#### Pour une question de Science

```
Question : "Quelle est la formule de l'eau ?"

Hint 1 (général) :
💡 C'est une formule avec H et O, pense à ce que tu bois tous les jours !

Hint 2 (précis) :
💡 H2O : 2 lettres H (hydrogène) et 1 lettre O (oxygène). Le 2 est en petit !
```

#### Pour une question d'Histoire

```
Question : "En quelle année a eu lieu la Révolution française ?"

Hint 1 (général) :
💡 C'est à la fin du 18ème siècle, les gens voulaient plus de liberté

Hint 2 (précis) :
💡 C'est en 1789, l'année de la prise de la Bastille. Pense à 17 et 89 !
```

---

## 💾 Sauvegarde intelligente

### Hint 1

- ✅ Sauvegardé dans **Supabase** (colonne `hint`)
- ✅ Réutilisé pour tous les utilisateurs
- ✅ **Économie d'appels API**

### Hint 2

- ✅ Sauvegardé en **cache mémoire** (session)
- ⚠️ Pas en DB (trop spécifique)
- ✅ Régénéré si nécessaire

---

## 🎮 Expérience utilisateur

### Pour l'enfant

1. **Question difficile** (type input)
2. Clic 1 : **Hint général** → "Ah oui, je vois !"
3. Toujours bloqué ?
4. Clic 2 : **Hint précis** → "Maintenant je comprends !"
5. L'enfant trouve **par lui-même** ✅

### Avantages

✅ **Progressif** : Pas tout d'un coup  
✅ **Pédagogique** : L'enfant réfléchit  
✅ **Adaptatif** : 2 hints si difficile, 1 si facile  
✅ **Encourageant** : Ton positif

---

## 🔄 Cycle complet

```
1. Question INPUT affichée
   ↓
2. [💡 Besoin d'aide ?]
   ↓
3. Clic → Loader "L'assistant réfléchit..."
   ↓
4. Appel API DeepSeek (Hint 1 général)
   ↓
5. Affichage : "Indice 1/2"
   ↓
6. Bouton : [💡 Hint 2/2]
   ↓
7. Clic → Loader
   ↓
8. Appel API DeepSeek (Hint 2 précis)
   ↓
9. Affichage : "Indice 2/2"
   ↓
10. Bouton : [💡 Hints utilisés (2/2)] (désactivé)
```

---

## 🎯 Résumé

- ✅ **Questions INPUT** : 2 hints progressifs (général → précis)
- ✅ **Autres questions** : 1 hint seulement
- ✅ **Prompts adaptés** aux enfants (7-12 ans)
- ✅ **Vocabulaire simple** et encourageant
- ✅ **Progression pédagogique** : L'enfant réfléchit par étapes
- ✅ **Affichage multiple** : Hints empilés visuellement
- ✅ **Sauvegarde intelligente** : Hint 1 en DB, Hint 2 en cache

---

**Version : 1.0.2** - Système de hints amélioré ! 🎉
