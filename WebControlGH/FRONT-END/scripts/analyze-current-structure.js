import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

console.log('🔍 Analyzing current frontend structure...\n');

const srcPath = path.join(__dirname, '../src');

const stats = {
  folders: [],
  filesByExtension: {},
  filesByFolder: {},
  totalFiles: 0,
  potentialFeatures: []
};

// Lista de carpetas que parecen features
const featureFolders = ['Almacen', 'Compra', 'Factura', 'Gastos', 'Horas', 'Login',
                        'Obra', 'Pedido', 'Rentabilidad', 'Empresas', 'Modulos'];

function analyzeDirectory(dir, relativePath = '') {
  let files;
  try {
    files = fs.readdirSync(dir);
  } catch (error) {
    return;
  }

  files.forEach(file => {
    const filePath = path.join(dir, file);
    const relPath = path.join(relativePath, file);

    let stat;
    try {
      stat = fs.statSync(filePath);
    } catch {
      return;
    }

    if (stat.isDirectory() && file !== 'node_modules' && !file.startsWith('.')) {
      stats.folders.push(relPath);

      // Detectar posibles features
      if (relativePath === '' && featureFolders.includes(file)) {
        const featureFiles = countFilesInDir(filePath);
        stats.potentialFeatures.push({
          name: file,
          files: featureFiles,
          path: relPath
        });
      }

      analyzeDirectory(filePath, relPath);
    } else if (stat.isFile()) {
      stats.totalFiles++;

      const ext = path.extname(file);
      stats.filesByExtension[ext] = (stats.filesByExtension[ext] || 0) + 1;

      const folderName = relativePath || 'root';
      if (!stats.filesByFolder[folderName]) {
        stats.filesByFolder[folderName] = 0;
      }
      stats.filesByFolder[folderName]++;
    }
  });
}

function countFilesInDir(dir) {
  let count = 0;

  function walk(d) {
    try {
      const files = fs.readdirSync(d);
      files.forEach(file => {
        const filePath = path.join(d, file);
        try {
          const stat = fs.statSync(filePath);
          if (stat.isDirectory() && file !== 'node_modules') {
            walk(filePath);
          } else if (stat.isFile()) {
            count++;
          }
        } catch {}
      });
    } catch {}
  }

  walk(dir);
  return count;
}

analyzeDirectory(srcPath);

// Generar reporte
console.log('═'.repeat(70));
console.log('📊 FRONTEND STRUCTURE ANALYSIS REPORT');
console.log('═'.repeat(70));

console.log('\n📁 FOLDERS IN src/ (root level):');
const rootFolders = stats.folders.filter(f => !f.includes(path.sep));
rootFolders.forEach(folder => {
  const isFeature = featureFolders.includes(folder);
  const marker = isFeature ? '🎯' : '  ';
  console.log(`  ${marker} ${folder}`);
});

console.log('\n📈 FILES STATISTICS:');
console.log(`  Total files: ${stats.totalFiles}`);
console.log(`  Total folders: ${stats.folders.length}`);

console.log('\n📄 FILES BY EXTENSION:');
Object.entries(stats.filesByExtension)
  .sort((a, b) => b[1] - a[1])
  .forEach(([ext, count]) => {
    const extName = ext || '(no extension)';
    const percentage = ((count / stats.totalFiles) * 100).toFixed(1);
    console.log(`  ${extName.padEnd(15)} ${count.toString().padStart(4)} files (${percentage}%)`);
  });

console.log('\n🎯 POTENTIAL FEATURES TO MIGRATE:');
console.log('   (Folders that should become features/)\n');

stats.potentialFeatures
  .sort((a, b) => a.files - b.files)
  .forEach((feature, index) => {
    const complexity = feature.files < 5 ? 'Simple' : feature.files < 15 ? 'Medium' : 'Complex';
    console.log(`  ${(index + 1).toString().padStart(2)}. ${feature.name.padEnd(20)} ${feature.files.toString().padStart(3)} files  [${complexity}]`);
  });

console.log('\n💡 RECOMMENDATIONS:\n');

// Ordenar por complejidad
const sortedFeatures = [...stats.potentialFeatures].sort((a, b) => a.files - b.files);

console.log('  Migration order (simplest to most complex):');
sortedFeatures.forEach((feature, index) => {
  console.log(`    ${index + 1}. ${feature.name}`);
});

console.log('\n📝 TOP 5 FOLDERS BY FILE COUNT:');
Object.entries(stats.filesByFolder)
  .sort((a, b) => b[1] - a[1])
  .slice(0, 5)
  .forEach(([folder, count]) => {
    console.log(`  ${folder.padEnd(30)} ${count} files`);
  });

console.log('\n🚀 NEXT STEPS:\n');
console.log('  1. Create branch: git checkout -b refactor/project-structure');
console.log('  2. Create API client: node scripts/create-api-client.js');
console.log('  3. Start migrating features (in recommended order):');
console.log(`     node scripts/migrate-feature.js ${sortedFeatures[0]?.name} ${sortedFeatures[0]?.name.toLowerCase()}`);

console.log('\n═'.repeat(70));
console.log('✓ Analysis complete!');
console.log('═'.repeat(70));

// Guardar reporte en archivo
const reportPath = path.join(__dirname, '../structure-analysis-report.txt');
const reportContent = `
FRONTEND STRUCTURE ANALYSIS REPORT
Generated: ${new Date().toISOString()}

TOTAL STATISTICS:
- Total files: ${stats.totalFiles}
- Total folders: ${stats.folders.length}
- Potential features: ${stats.potentialFeatures.length}

FILES BY EXTENSION:
${Object.entries(stats.filesByExtension)
  .sort((a, b) => b[1] - a[1])
  .map(([ext, count]) => `  ${ext || '(no extension)'}: ${count} files`)
  .join('\n')}

POTENTIAL FEATURES (sorted by complexity):
${stats.potentialFeatures
  .sort((a, b) => a.files - b.files)
  .map((f, i) => `  ${i + 1}. ${f.name} (${f.files} files)`)
  .join('\n')}

RECOMMENDED MIGRATION ORDER:
${sortedFeatures.map((f, i) => `  ${i + 1}. ${f.name}`).join('\n')}
`;

fs.writeFileSync(reportPath, reportContent);
console.log(`\n📄 Report saved to: structure-analysis-report.txt`);
