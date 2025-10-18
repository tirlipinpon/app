// ============================================
// SOUND MANAGER - Gestion des sons
// ============================================

class SoundManager {
  constructor() {
    this.isMuted = false;
    this.sounds = {};
    this.volume = 0.5; // Volume par défaut (50%)
    this.useAudioFiles = false; // Mettre à true pour utiliser des fichiers audio
    
    this.loadSoundPreferences();
    this.initializeSounds();
    
    console.log('🔊 SoundManager initialisé');
  }
  
  // Initialiser les sons
  initializeSounds() {
    if (this.useAudioFiles) {
      // Mode fichiers audio - Charge les MP3/WAV depuis le dossier sounds/
      this.initializeAudioFiles();
    } else {
      // Mode beeps synthétiques - Génération avec Web Audio API
      this.initializeSyntheticSounds();
    }
  }
  
  // Initialiser avec des fichiers audio (avec fallback sur beeps)
  initializeAudioFiles() {
    console.log('🎵 Chargement des fichiers audio avec fallback...');
    
    const soundConfig = {
      correct: { 
        file: 'sounds/correct.mp3',
        fallback: () => this.createBeep(800, 0.1, 'sine')
      },
      incorrect: { 
        file: 'sounds/incorrect.mp3',
        fallback: () => this.createBeep(200, 0.15, 'sawtooth')
      },
      click: { 
        file: 'sounds/click.mp3',
        fallback: () => this.createBeep(300, 0.05, 'sine')
      },
      hint: { 
        file: 'sounds/hint.mp3',
        fallback: () => this.createBeep(500, 0.1, 'triangle')
      },
      success: { 
        file: 'sounds/success.mp3',
        fallback: () => this.createMelody([600, 800, 1000], 0.15)
      },
      categoryComplete: { 
        file: 'sounds/category-complete.mp3',
        fallback: () => this.createMelody([800, 1000, 1200, 1500], 0.2)
      }
    };
    
    Object.keys(soundConfig).forEach(key => {
      this.sounds[key] = this.createAudioFileSound(
        soundConfig[key].file, 
        soundConfig[key].fallback()
      );
    });
  }
  
  // Créer un son à partir d'un fichier audio avec fallback
  createAudioFileSound(filePath, fallbackSound) {
    return () => {
      if (this.isMuted) return;
      
      try {
        const audio = new Audio(filePath);
        audio.volume = this.volume;
        
        audio.play().catch(e => {
          // Si le fichier n'existe pas ou erreur, jouer le fallback
          if (fallbackSound) {
            fallbackSound();
          }
        });
      } catch (e) {
        // Erreur de chargement, jouer le fallback
        if (fallbackSound) {
          fallbackSound();
        }
      }
    };
  }
  
  // Initialiser avec des sons synthétiques
  initializeSyntheticSounds() {
    console.log('🎵 Utilisation des sons synthétiques (Web Audio API)');
    
    this.sounds = {
      // ✅ Réponse correcte - Son joyeux et satisfaisant
      correct: this.createBeep(800, 0.1, 'sine'),
      
      // ❌ Réponse incorrecte - Son d'erreur doux
      incorrect: this.createBeep(200, 0.15, 'sawtooth'),
      
      // 🖱️ Click - Son de bouton très court
      click: this.createBeep(300, 0.05, 'sine'),
      
      // 💡 Hint - Son mystérieux
      hint: this.createBeep(500, 0.1, 'triangle'),
      
      // 🎉 Succès - Mélodie de victoire montante
      success: this.createMelody([600, 800, 1000], 0.15),
      
      // 🏆 Catégorie complétée - Grande fanfare
      categoryComplete: this.createMelody([800, 1000, 1200, 1500], 0.2)
    };
  }
  
  // Créer un beep simple
  createBeep(frequency, duration, type = 'sine') {
    return () => {
      if (this.isMuted) return;
      
      try {
        const audioContext = new (window.AudioContext || window.webkitAudioContext)();
        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();
        
        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);
        
        oscillator.frequency.value = frequency;
        oscillator.type = type;
        
        gainNode.gain.setValueAtTime(this.volume, audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + duration);
        
        oscillator.start(audioContext.currentTime);
        oscillator.stop(audioContext.currentTime + duration);
      } catch (e) {
        console.warn('⚠️ Impossible de jouer le son:', e);
      }
    };
  }
  
  // Créer une mélodie (plusieurs notes)
  createMelody(frequencies, noteDuration) {
    return () => {
      if (this.isMuted) return;
      
      try {
        const audioContext = new (window.AudioContext || window.webkitAudioContext)();
        
        frequencies.forEach((freq, index) => {
          const oscillator = audioContext.createOscillator();
          const gainNode = audioContext.createGain();
          
          oscillator.connect(gainNode);
          gainNode.connect(audioContext.destination);
          
          oscillator.frequency.value = freq;
          oscillator.type = 'sine';
          
          const startTime = audioContext.currentTime + (index * noteDuration);
          const stopTime = startTime + noteDuration;
          
          gainNode.gain.setValueAtTime(this.volume, startTime);
          gainNode.gain.exponentialRampToValueAtTime(0.01, stopTime);
          
          oscillator.start(startTime);
          oscillator.stop(stopTime);
        });
      } catch (e) {
        console.warn('⚠️ Impossible de jouer la mélodie:', e);
      }
    };
  }
  
  // Jouer un son spécifique
  play(soundName) {
    if (this.sounds[soundName]) {
      this.sounds[soundName]();
    } else {
      console.warn(`⚠️ Son inconnu: ${soundName}`);
    }
  }
  
  // Activer/désactiver le son
  toggleMute() {
    this.isMuted = !this.isMuted;
    this.saveSoundPreferences();
    console.log(this.isMuted ? '🔇 Sons désactivés' : '🔊 Sons activés');
    return this.isMuted;
  }
  
  // Définir le volume (0.0 à 1.0)
  setVolume(volume) {
    this.volume = Math.max(0, Math.min(1, volume));
    this.saveSoundPreferences();
    console.log(`🔊 Volume: ${Math.round(this.volume * 100)}%`);
  }
  
  // Vérifier si les sons sont activés
  isSoundEnabled() {
    return !this.isMuted;
  }
  
  // Sauvegarder les préférences sonores
  saveSoundPreferences() {
    const preferences = {
      isMuted: this.isMuted,
      volume: this.volume
    };
    localStorage.setItem('cultures_game_soundPreferences', JSON.stringify(preferences));
  }
  
  // Charger les préférences sonores
  loadSoundPreferences() {
    const saved = localStorage.getItem('cultures_game_soundPreferences');
    if (saved) {
      try {
        const preferences = JSON.parse(saved);
        this.isMuted = preferences.isMuted || false;
        this.volume = preferences.volume || 0.5;
        console.log('🔊 Préférences sonores chargées');
      } catch (e) {
        console.warn('⚠️ Erreur chargement préférences sonores:', e);
      }
    }
  }
}

