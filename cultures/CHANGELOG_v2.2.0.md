# 🎉 Cultures v2.2.0 - NOUVEAUX TYPES DE QUESTIONS !

**Date**: 19 octobre 2025

## 🚀 NOUVELLES FONCTIONNALITÉS MAJEURES

### 1. 🗺️ Type de question : MAP-CLICK (Carte interactive)

**Description** :

- L'enfant clique sur une carte pour localiser un pays, une ville, un océan, etc.
- Un marqueur 📍 apparaît à l'endroit du clic
- Validation automatique après 0.5 seconde

**Interface** :

- Image de carte cliquable
- Zones définies par coordonnées (x, y, width, height en %)
- Feedback visuel avec marqueur animé
- Curseur en forme de croix sur la carte

**Exemple de question** :

- "Clique sur la Belgique" (carte d'Europe)
- "Où se trouve Paris ?" (carte de France)
- "Clique sur l'océan Atlantique" (planisphère)

**Structure de données** :

```json
{
  "answer": "belgium",
  "options": {
    "mapImage": "url-de-la-carte.png",
    "zones": [
      {
        "id": "belgium",
        "name": "Belgique",
        "coords": { "x": 45, "y": 30, "width": 8, "height": 8 }
      }
    ]
  }
}
```

### 2. 📅 Type de question : TIMELINE (Ligne du temps visuelle)

**Description** :

- L'enfant glisse des événements sur une ligne du temps pour les ordonner
- Interface drag & drop intuitive
- Numérotation visuelle (1, 2, 3, 4...)
- Ligne du temps avec flèche et dégradé de couleur

**Interface** :

- Pool d'événements à glisser (cartes avec emoji + texte)
- Slots numérotés pour déposer les cartes
- Ligne horizontale avec flèche →
- Bouton "Valider l'ordre" quand toutes les cartes sont placées

**Exemple de question** :

- "Place le cycle de vie du papillon : Œuf 🥚 → Chenille 🐛 → Chrysalide 🧬 → Papillon 🦋"
- "Place les saisons dans l'ordre : Printemps 🌸 → Été ☀️ → Automne 🍂 → Hiver ❄️"
- "Place les moments de la journée : Lever du soleil 🌅 → Midi ☀️ → Coucher du soleil 🌇 → Minuit 🌙"

**Structure de données** :

```json
{
  "answer": ["evt_1", "evt_2", "evt_3", "evt_4"],
  "options": [
    { "id": "evt_1", "text": "Œuf", "emoji": "🥚" },
    { "id": "evt_2", "text": "Chenille", "emoji": "🐛" },
    { "id": "evt_3", "text": "Chrysalide", "emoji": "🧬" },
    { "id": "evt_4", "text": "Papillon", "emoji": "🦋" }
  ]
}
```

## 🔧 Modifications techniques

### Fichiers modifiés

#### `uiManager.js`

- ✅ `createMapClickInterface()` - Affiche la carte avec overlay SVG et marqueur
- ✅ `createTimelineInterface()` - Affiche le pool d'événements et les slots numérotés

#### `inputHandler.js`

- ✅ `setupMapClickType()` - Gère les clics sur la carte et détection de zones
- ✅ `setupTimelineType()` - Gère le drag & drop des événements
- ✅ Réactivation pour les deux types dans `reactivateInputs()`

#### `questionManager.js`

- ✅ `validateMapClick()` - Compare la zone cliquée avec la réponse
- ✅ `validateTimeline()` - Compare l'ordre des événements

#### `style.css`

- ✅ Styles pour `.map-click-container`, `.map-wrapper`, `.map-image`, `.map-click-marker`
- ✅ Styles pour `.timeline-container`, `.timeline-pool`, `.timeline-event-card`, `.timeline-slots`
- ✅ Animations bounce pour le marqueur
- ✅ États drag-over et filled pour les drop zones
- ✅ Responsive design pour mobile

### Questions d'exemple créées

**Script SQL** : `database/timeline_mapclick_examples.sql`

- 5 questions TIMELINE (cycle papillon, saisons, journée, croissance plante, vie humaine)
- 5 questions MAP-CLICK (Belgique, Paris, Afrique, Atlantique, Bruxelles)

## 🎨 Design

### Timeline

- Pool avec fond gris clair et bordure pointillée
- Cartes événements avec emoji + texte, bordure colorée
- Ligne du temps horizontale avec dégradé violet
- Slots numérotés avec cercles
- Effet de survol et drag

### Map-Click

- Image de carte centrée avec ombre
- Curseur en croix pour précision
- Marqueur 📍 animé (bounce)
- Instruction claire sous la carte

## 🎯 Bénéfices pédagogiques

### Timeline

- **Chronologie** : Comprendre l'ordre des événements
- **Logique** : Séquences cause-effet
- **Sciences** : Cycles de vie, processus naturels
- **Histoire** : Événements historiques

### Map-Click

- **Géographie** : Localisation spatiale
- **Repérage** : Coordonnées, orientation
- **Culture** : Connaissance du monde
- **Mémoire visuelle** : Association lieu-nom

## 📋 TODO pour production

Pour les questions MAP-CLICK, il faudra :

1. Créer ou trouver des images de cartes (Europe, France, Monde, Belgique)
2. Les héberger sur Supabase Storage
3. Mettre à jour les URLs dans la base de données
4. Ajuster les coordonnées des zones en fonction des vraies images

---

**Version**: 2.2.0  
**Statut**: ✅ Nouvelle version majeure !
