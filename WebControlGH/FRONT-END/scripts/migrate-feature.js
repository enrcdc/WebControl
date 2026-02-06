import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Uso: node scripts/migrate-feature.js Horas horas
const args = process.argv.slice(2);

if (args.length === 0 || args.includes('--help') || args.includes('-h')) {
  console.log(`
📦 Feature Migration Tool
========================

Usage: node scripts/migrate-feature.js <OldFolder> [newFeatureName]

Examples:
  node scripts/migrate-feature.js Horas horas
  node scripts/migrate-feature.js Login auth
  node scripts/migrate-feature.js Obra obras

Arguments:
  OldFolder        - Name of existing folder in src/ (e.g., Horas, Login, Obra)
  newFeatureName   - Name for new feature folder (optional, defaults to lowercase OldFolder)

This script will:
  1. Create the feature folder structure in src/features/
  2. Analyze files in the old folder
  3. Provide guidance on which files go where
  4. Generate a migration report

Note: This script does NOT move files automatically. It creates the structure
and provides recommendations. You should review and move files manually.
`);
  process.exit(0);
}

const [oldFolder, newFeatureName] = args;
const featureName = newFeatureName || oldFolder.toLowerCase();

const srcPath = path.join(__dirname, '../src');
const oldPath = path.join(srcPath, oldFolder);
const newPath = path.join(srcPath, 'features', featureName);

console.log('🚀 Starting feature migration analysis...\n');
console.log(`   Old folder: src/${oldFolder}`);
console.log(`   New feature: src/features/${featureName}\n`);

// Validar que existe la carpeta vieja
if (!fs.existsSync(oldPath)) {
  console.error(`❌ Error: Folder "${oldFolder}" does not exist in src/`);
  console.error(`   Looked for: ${oldPath}\n`);

  // Mostrar carpetas disponibles
  const availableFolders = fs.readdirSync(srcPath)
    .filter(f => {
      const stat = fs.statSync(path.join(srcPath, f));
      return stat.isDirectory() && !f.startsWith('.') && f !== 'node_modules';
    });

  console.log('Available folders in src/:');
  availableFolders.forEach(f => console.log(`   - ${f}`));

  process.exit(1);
}

// Crear estructura de carpetas
console.log('📁 Creating feature structure...\n');

const folders = [
  'components',
  'hooks',
  'services',
  'utils',
  'constants'
];

folders.forEach(folder => {
  const folderPath = path.join(newPath, folder);
  if (!fs.existsSync(folderPath)) {
    fs.mkdirSync(folderPath, { recursive: true });
    console.log(`   ✓ Created: features/${featureName}/${folder}/`);
  }
});

// Analizar archivos en la carpeta vieja
console.log('\n📊 Analyzing files in old folder...\n');

const filesByType = {
  components: [],
  services: [],
  hooks: [],
  utils: [],
  styles: [],
  other: []
};

function analyzeFiles(dir, relativePath = '') {
  const files = fs.readdirSync(dir);

  files.forEach(file => {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    const relPath = path.join(relativePath, file);

    if (stat.isDirectory()) {
      analyzeFiles(filePath, relPath);
    } else {
      // Categorizar archivo
      if (file.endsWith('.jsx') || file.endsWith('.js')) {
        const content = fs.readFileSync(filePath, 'utf-8');

        if (file.startsWith('use') && /export\s+(default\s+)?function\s+use/.test(content)) {
          filesByType.hooks.push(relPath);
        } else if (/Service\.js$/.test(file) || /service\.js$/i.test(file)) {
          filesByType.services.push(relPath);
        } else if (/Component\.jsx?$/.test(file) || /^[A-Z]/.test(file)) {
          filesByType.components.push(relPath);
        } else if (/utils?\.js$/i.test(file) || /helpers?\.js$/i.test(file)) {
          filesByType.utils.push(relPath);
        } else {
          filesByType.other.push(relPath);
        }
      } else if (file.endsWith('.css') || file.endsWith('.scss')) {
        filesByType.styles.push(relPath);
      } else {
        filesByType.other.push(relPath);
      }
    }
  });
}

analyzeFiles(oldPath);

// Generar reporte
console.log('📋 Migration Report\n');
console.log('═'.repeat(70));

Object.entries(filesByType).forEach(([type, files]) => {
  if (files.length > 0) {
    console.log(`\n${type.toUpperCase()} (${files.length} files):`);

    let targetFolder;
    switch (type) {
      case 'components':
        targetFolder = `features/${featureName}/components/`;
        break;
      case 'hooks':
        targetFolder = `features/${featureName}/hooks/`;
        break;
      case 'services':
        targetFolder = `features/${featureName}/services/`;
        break;
      case 'utils':
        targetFolder = `features/${featureName}/utils/`;
        break;
      case 'styles':
        targetFolder = `features/${featureName}/components/ (CSS Modules or move to styles/)`;
        break;
      default:
        targetFolder = `features/${featureName}/ (review location)`;
    }

    console.log(`   Target: ${targetFolder}\n`);

    files.forEach(file => {
      console.log(`   📄 ${file}`);
    });
  }
});

console.log('\n' + '═'.repeat(70));

// Crear archivo index.js con barrel exports
const indexPath = path.join(newPath, 'index.js');
const indexContent = `// Barrel exports for ${featureName} feature

// Services
// export * from './services/${featureName}.service';

// Hooks
// export * from './hooks/use${featureName.charAt(0).toUpperCase() + featureName.slice(1)}';

// Components
// export * from './components/${featureName.charAt(0).toUpperCase() + featureName.slice(1)}List';
// export * from './components/${featureName.charAt(0).toUpperCase() + featureName.slice(1)}Form';
// export * from './components/${featureName.charAt(0).toUpperCase() + featureName.slice(1)}Detail';

// Utils
// export * from './utils/${featureName}.utils';
`;

fs.writeFileSync(indexPath, indexContent);
console.log(`\n✓ Created barrel export file: features/${featureName}/index.js`);

// Generar comandos para mover archivos
console.log('\n📝 Suggested commands to move files:\n');
console.log('# Run these commands from the FRONT-END directory\n');

Object.entries(filesByType).forEach(([type, files]) => {
  if (files.length > 0 && type !== 'other') {
    const targetDir = `src/features/${featureName}/${type === 'styles' ? 'components' : type}`;

    files.forEach(file => {
      const source = `src/${oldFolder}/${file}`;
      const target = `${targetDir}/${path.basename(file)}`;
      console.log(`mv "${source}" "${target}"`);
    });
    console.log('');
  }
});

console.log('═'.repeat(70));
console.log('\n⚠️  Next steps:\n');
console.log('  1. Review the migration report above');
console.log('  2. Manually move files using the suggested commands');
console.log('  3. Update imports in the moved files');
console.log('  4. Update barrel exports in features/' + featureName + '/index.js');
console.log('  5. Update imports in App.js and other files that use this feature');
console.log('  6. Test the feature');
console.log('  7. Delete the old folder: src/' + oldFolder);
console.log('\n✓ Feature structure created successfully!\n');
