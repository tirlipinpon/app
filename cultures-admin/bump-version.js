const fs = require('fs');
const path = require('path');

// Lire le fichier version.ts
const versionFilePath = path.join(__dirname, 'src', 'app', 'version.ts');
let versionContent = fs.readFileSync(versionFilePath, 'utf8');

// Extraire la version actuelle
const versionMatch = versionContent.match(/APP_VERSION = '(\d+)\.(\d+)\.(\d+)'/);

if (versionMatch) {
  let [, major, minor, patch] = versionMatch;
  
  // Incrémenter le patch
  patch = parseInt(patch) + 1;
  
  const newVersion = `${major}.${minor}.${patch}`;
  
  // Mettre à jour le contenu
  versionContent = versionContent.replace(
    /APP_VERSION = '.*'/,
    `APP_VERSION = '${newVersion}'`
  );
  
  versionContent = versionContent.replace(
    /BUILD_DATE = .*/,
    `BUILD_DATE = new Date().toISOString();`
  );
  
  // Écrire le nouveau fichier
  fs.writeFileSync(versionFilePath, versionContent);
  
  console.log(`✅ Version mise à jour: ${newVersion}`);
  console.log(`📅 Date de build: ${new Date().toISOString()}`);
} else {
  console.error('❌ Impossible de trouver la version dans version.ts');
  process.exit(1);
}

