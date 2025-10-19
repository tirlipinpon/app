// ============================================
// MAP SVGs - Cartes SVG pour questions map-click
// ============================================
// Cartes simplifiées et colorées pour enfants de 8-9 ans

const MAP_SVGS = {
  // Carte d'Europe simplifiée
  europe: `
    <svg viewBox="0 0 400 300" xmlns="http://www.w3.org/2000/svg">
      <!-- Fond mer -->
      <rect width="400" height="300" fill="#B3D9FF"/>
      
      <!-- France -->
      <path d="M 120 140 L 100 160 L 110 200 L 150 210 L 170 180 L 160 140 Z" 
            fill="#FFB6C1" stroke="#333" stroke-width="2" data-zone="france"/>
      
      <!-- Belgique -->
      <path d="M 165 120 L 155 140 L 170 145 L 185 135 L 180 115 Z" 
            fill="#FFD700" stroke="#333" stroke-width="2" data-zone="belgium"/>
      
      <!-- Pays-Bas -->
      <path d="M 175 95 L 165 115 L 180 120 L 195 105 L 190 85 Z" 
            fill="#FFA07A" stroke="#333" stroke-width="2" data-zone="netherlands"/>
      
      <!-- Allemagne -->
      <path d="M 190 115 L 185 140 L 210 160 L 240 150 L 235 110 L 210 100 Z" 
            fill="#98FB98" stroke="#333" stroke-width="2" data-zone="germany"/>
      
      <!-- Espagne -->
      <path d="M 80 200 L 70 240 L 120 260 L 140 230 L 115 205 Z" 
            fill="#FFC0CB" stroke="#333" stroke-width="2" data-zone="spain"/>
      
      <!-- Italie -->
      <path d="M 180 180 L 185 220 L 200 250 L 210 230 L 205 190 Z" 
            fill="#FFDAB9" stroke="#333" stroke-width="2" data-zone="italy"/>
      
      <!-- Labels -->
      <text x="130" y="175" font-size="12" font-weight="bold" fill="#333">France</text>
      <text x="165" y="130" font-size="10" font-weight="bold" fill="#333">🇧🇪</text>
      <text x="175" y="105" font-size="10" font-weight="bold" fill="#333">NL</text>
      <text x="210" y="130" font-size="12" font-weight="bold" fill="#333">Allemagne</text>
      <text x="95" y="230" font-size="12" font-weight="bold" fill="#333">Espagne</text>
      <text x="190" y="215" font-size="12" font-weight="bold" fill="#333">Italie</text>
    </svg>
  `,
  
  // Planisphère simplifié
  world: `
    <svg viewBox="0 0 500 300" xmlns="http://www.w3.org/2000/svg">
      <!-- Fond océan -->
      <rect width="500" height="300" fill="#B3E5FC"/>
      
      <!-- Amérique -->
      <path d="M 50 80 L 40 120 L 60 180 L 90 200 L 110 180 L 100 140 L 120 100 L 100 70 Z" 
            fill="#90EE90" stroke="#333" stroke-width="2" data-zone="america"/>
      
      <!-- Europe -->
      <path d="M 220 70 L 210 100 L 230 120 L 260 115 L 270 80 L 250 65 Z" 
            fill="#FFD700" stroke="#333" stroke-width="2" data-zone="europe"/>
      
      <!-- Afrique -->
      <path d="M 230 125 L 220 160 L 235 210 L 275 220 L 290 180 L 280 130 Z" 
            fill="#FFA07A" stroke="#333" stroke-width="2" data-zone="africa"/>
      
      <!-- Asie -->
      <path d="M 280 60 L 270 100 L 290 140 L 350 150 L 400 120 L 410 80 L 380 50 L 320 55 Z" 
            fill="#FFB6C1" stroke="#333" stroke-width="2" data-zone="asia"/>
      
      <!-- Océanie -->
      <path d="M 380 180 L 370 210 L 390 230 L 420 220 L 425 195 Z" 
            fill="#DDA0DD" stroke="#333" stroke-width="2" data-zone="oceania"/>
      
      <!-- Labels -->
      <text x="70" y="140" font-size="14" font-weight="bold" fill="#333">Amérique</text>
      <text x="235" y="95" font-size="14" font-weight="bold" fill="#333">Europe</text>
      <text x="245" y="170" font-size="14" font-weight="bold" fill="#333">Afrique</text>
      <text x="330" y="100" font-size="14" font-weight="bold" fill="#333">Asie</text>
      <text x="385" y="210" font-size="12" font-weight="bold" fill="#333">Océanie</text>
    </svg>
  `,
  
  // Carte de France simplifiée
  france: `
    <svg viewBox="0 0 300 350" xmlns="http://www.w3.org/2000/svg">
      <!-- Fond mer -->
      <rect width="300" height="350" fill="#B3E5FC"/>
      
      <!-- France -->
      <path d="M 50 80 L 40 150 L 60 250 L 120 320 L 200 310 L 250 280 L 280 220 L 270 150 L 240 100 L 200 70 L 150 60 L 100 65 Z" 
            fill="#E8F5E9" stroke="#333" stroke-width="2"/>
      
      <!-- Paris (région) -->
      <circle cx="150" cy="100" r="15" fill="#FF6B6B" stroke="#333" stroke-width="2" data-zone="paris"/>
      
      <!-- Lyon (région) -->
      <circle cx="180" cy="180" r="12" fill="#4ECDC4" stroke="#333" stroke-width="2" data-zone="lyon"/>
      
      <!-- Marseille (région) -->
      <circle cx="190" cy="260" r="12" fill="#95E1D3" stroke="#333" stroke-width="2" data-zone="marseille"/>
      
      <!-- Bordeaux (région) -->
      <circle cx="80" cy="200" r="12" fill="#F9CA24" stroke="#333" stroke-width="2" data-zone="bordeaux"/>
      
      <!-- Labels -->
      <text x="140" y="95" font-size="12" font-weight="bold" fill="white">Paris</text>
      <text x="170" y="175" font-size="11" font-weight="bold" fill="white">Lyon</text>
      <text x="175" y="255" font-size="11" font-weight="bold" fill="white">Marseille</text>
      <text x="65" y="195" font-size="11" font-weight="bold" fill="white">Bordeaux</text>
      
      <!-- Titre -->
      <text x="150" y="30" font-size="16" font-weight="bold" fill="#333" text-anchor="middle">🇫🇷 France</text>
    </svg>
  `,
  
  // Carte de Belgique simplifiée
  belgium: `
    <svg viewBox="0 0 300 250" xmlns="http://www.w3.org/2000/svg">
      <!-- Fond -->
      <rect width="300" height="250" fill="#E3F2FD"/>
      
      <!-- Belgique -->
      <path d="M 60 80 L 50 140 L 80 180 L 150 190 L 220 170 L 250 130 L 240 90 L 200 70 L 130 65 Z" 
            fill="#FFE082" stroke="#333" stroke-width="2"/>
      
      <!-- Bruxelles (centre) -->
      <circle cx="140" cy="120" r="18" fill="#E74C3C" stroke="#333" stroke-width="2" data-zone="brussels"/>
      
      <!-- Anvers (nord) -->
      <circle cx="150" cy="85" r="14" fill="#3498DB" stroke="#333" stroke-width="2" data-zone="antwerp"/>
      
      <!-- Liège (est) -->
      <circle cx="200" cy="130" r="14" fill="#2ECC71" stroke="#333" stroke-width="2" data-zone="liege"/>
      
      <!-- Bruges (ouest) -->
      <circle cx="80" cy="95" r="14" fill="#9B59B6" stroke="#333" stroke-width="2" data-zone="bruges"/>
      
      <!-- Labels -->
      <text x="125" y="125" font-size="11" font-weight="bold" fill="white">Bruxelles</text>
      <text x="138" y="90" font-size="10" font-weight="bold" fill="white">Anvers</text>
      <text x="188" y="135" font-size="10" font-weight="bold" fill="white">Liège</text>
      <text x="68" y="100" font-size="10" font-weight="bold" fill="white">Bruges</text>
      
      <!-- Titre -->
      <text x="150" y="30" font-size="18" font-weight="bold" fill="#333" text-anchor="middle">🇧🇪 Belgique</text>
    </svg>
  `
};

// Fonction pour obtenir une carte SVG
function getMapSvg(mapKey) {
  return MAP_SVGS[mapKey] || '';
}

// Définir les zones cliquables pour chaque carte
const MAP_ZONES = {
  europe: [
    { id: 'belgium', name: 'Belgique', coords: { x: 39, y: 38, width: 7, height: 8 } },
    { id: 'france', name: 'France', coords: { x: 25, y: 45, width: 15, height: 25 } },
    { id: 'germany', name: 'Allemagne', coords: { x: 46, y: 33, width: 14, height: 20 } },
    { id: 'netherlands', name: 'Pays-Bas', coords: { x: 42, y: 28, width: 7, height: 8 } },
    { id: 'spain', name: 'Espagne', coords: { x: 18, y: 65, width: 15, height: 20 } },
    { id: 'italy', name: 'Italie', coords: { x: 45, y: 60, width: 8, height: 30 } }
  ],
  
  world: [
    { id: 'america', name: 'Amérique', coords: { x: 8, y: 25, width: 16, height: 45 } },
    { id: 'europe', name: 'Europe', coords: { x: 42, y: 23, width: 12, height: 17 } },
    { id: 'africa', name: 'Afrique', coords: { x: 44, y: 42, width: 15, height: 32 } },
    { id: 'asia', name: 'Asie', coords: { x: 54, y: 17, width: 30, height: 33 } },
    { id: 'oceania', name: 'Océanie', coords: { x: 74, y: 60, width: 12, height: 18 } }
  ],
  
  france: [
    { id: 'paris', name: 'Paris', coords: { x: 45, y: 25, width: 10, height: 10 } },
    { id: 'lyon', name: 'Lyon', coords: { x: 55, y: 48, width: 8, height: 8 } },
    { id: 'marseille', name: 'Marseille', coords: { x: 58, y: 72, width: 8, height: 8 } },
    { id: 'bordeaux', name: 'Bordeaux', coords: { x: 22, y: 55, width: 8, height: 8 } }
  ],
  
  belgium: [
    { id: 'brussels', name: 'Bruxelles', coords: { x: 40, y: 42, width: 12, height: 12 } },
    { id: 'antwerp', name: 'Anvers', coords: { x: 44, y: 30, width: 10, height: 10 } },
    { id: 'liege', name: 'Liège', coords: { x: 62, y: 48, width: 10, height: 10 } },
    { id: 'bruges', name: 'Bruges', coords: { x: 22, y: 35, width: 10, height: 10 } }
  ]
};

// Fonction pour obtenir les zones d'une carte
function getMapZones(mapKey) {
  return MAP_ZONES[mapKey] || [];
}

console.log('🗺️ Cartes SVG chargées');

