import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class EmojiService {
  private emojiMap: {[key: string]: string[]} = {
    // Éducation
    'livre': ['📚', '📖', '📕', '📗', '📘'],
    'lecture': ['📚', '📖', '👓'],
    'ecole': ['🏫', '🎒', '✏️', '📝'],
    'etude': ['📚', '🎓', '📝'],
    
    // Culture
    'culture': ['🎭', '🎨', '🖼️', '🎪'],
    'art': ['🎨', '🖼️', '🖌️', '🎭'],
    'musique': ['🎵', '🎶', '🎸', '🎹', '🎤'],
    'cinema': ['🎬', '🎥', '📽️', '🍿'],
    'theatre': ['🎭', '🎪', '🎟️'],
    
    // Science
    'science': ['🔬', '🧪', '⚗️', '🧬'],
    'chimie': ['🧪', '⚗️', '🔬'],
    'physique': ['⚛️', '🔬', '⚗️'],
    'biologie': ['🧬', '🔬', '🦠'],
    'espace': ['🚀', '🌌', '🪐', '🌙', '⭐'],
    'planete': ['🪐', '🌍', '🌎', '🌏'],
    
    // Histoire
    'histoire': ['📜', '🏛️', '⏳', '📖'],
    'roi': ['👑', '🤴', '👸'],
    'chateau': ['🏰', '🏯'],
    'monument': ['🏛️', '🗿', '🗼'],
    'guerre': ['⚔️', '🛡️', '🏹'],
    
    // Géographie
    'geo': ['🌍', '🗺️', '🧭'],
    'geographie': ['🌍', '🗺️', '🧭', '🌎'],
    'monde': ['🌍', '🌎', '🌏', '🗺️'],
    'carte': ['🗺️', '🧭'],
    'pays': ['🌍', '🗺️', '🏳️'],
    'ville': ['🏙️', '🌆', '🏘️'],
    'mer': ['🌊', '🏖️', '⛵'],
    'ocean': ['🌊', '🐋', '🐠'],
    'montagne': ['⛰️', '🏔️', '🗻'],
    'riviere': ['🏞️', '🌊'],
    
    // Nature
    'nature': ['🌳', '🌿', '🍃', '🌱'],
    'arbre': ['🌳', '🌲', '🎄'],
    'fleur': ['🌸', '🌺', '🌻', '🌷'],
    'plante': ['🌱', '🌿', '🪴'],
    'animal': ['🐾', '🦁', '🐘', '🦒'],
    'oiseau': ['🦅', '🦜', '🐦', '🦉'],
    'poisson': ['🐠', '🐟', '🐡', '🦈'],
    'insecte': ['🐛', '🦋', '🐝', '🐞'],
    'foret': ['🌲', '🌳', '🏞️'],
    'jardin': ['🌻', '🌷', '🪴', '🦋'],
    
    // Sport
    'sport': ['⚽', '🏀', '🎾', '⚾'],
    'foot': ['⚽', '🥅'],
    'basket': ['🏀', '🏐'],
    'natation': ['🏊', '🏊‍♂️', '🏊‍♀️'],
    
    // Nombres
    'math': ['🔢', '➕', '➖', '✖️', '➗'],
    'nombre': ['🔢', '🔤'],
    'calcul': ['🧮', '🔢'],
    
    // Temps
    'temps': ['⏰', '⏳', '⌚', '🕐'],
    'heure': ['🕐', '⏰', '⌚'],
    'calendrier': ['📅', '📆'],
    'saison': ['🌸', '☀️', '🍂', '❄️'],
    
    // Alimentation
    'nourriture': ['🍽️', '🍴', '🥄'],
    'fruit': ['🍎', '🍊', '🍌', '🍇'],
    'legume': ['🥕', '🥦', '🥬'],
    
    // Général
    'question': ['❓', '❔'],
    'reponse': ['✅', '💡'],
    'jeu': ['🎮', '🎲', '🎯'],
    'quiz': ['❓', '🎯', '🧠']
  };

  searchEmojis(query: string): string[] {
    if (!query || query.trim().length < 2) return [];
    
    const searchTerm = this.normalizeString(query);
    const results: string[] = [];
    
    // Rechercher dans les clés
    Object.entries(this.emojiMap).forEach(([key, emojis]) => {
      if (this.normalizeString(key).includes(searchTerm)) {
        results.push(...emojis);
      }
    });
    
    // Retourner les premiers résultats uniques
    return [...new Set(results)].slice(0, 10);
  }

  private normalizeString(str: string): string {
    return str
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, ''); // Enlever accents
  }

  getPopularEmojis(): string[] {
    return ['📚', '🎭', '🔬', '📜', '🌍', '⚽', '🎨', '🎵', '🌳', '🐾', '🔢', '❓'];
  }
}

