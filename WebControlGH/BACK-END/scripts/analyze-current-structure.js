import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

console.log('🔍 Analyzing current backend structure...\n');

const srcPath = path.join(__dirname, '../src');

const stats = {
  controllers: { total: 0, files: [] },
  models: { total: 0, files: [] },
  routes: { total: 0, files: [] },
  services: { total: 0, files: [] },
  other: { total: 0, files: [] },
  totalFiles: 0,
  namingInconsistencies: [],
};

function analyzeFile(filePath, relativePath) {
  const fileName = path.basename(filePath);
  const ext = path.extname(fileName);

  if (!['.js', '.mjs'].includes(ext)) return;

  stats.totalFiles++;

  const folder = relativePath.split(path.sep)[0];

  if (folder === 'controllers') {
    stats.controllers.files.push(fileName);
    stats.controllers.total++;

    // Detectar inconsistencias
    if (fileName.match(/^[A-Z]/)) {
      stats.namingInconsistencies.push({
        file: relativePath,
        issue: 'PascalCase in controller',
        suggestion: fileName.charAt(0).toLowerCase() + fileName.slice(1)
      });
    }
    if (!fileName.includes('controller') && !fileName.includes('Controller')) {
      stats.namingInconsistencies.push({
        file: relativePath,
        issue: 'Missing "controller" in name',
        suggestion: fileName.replace(ext, `.controller${ext}`)
      });
    }
  } else if (folder === 'models') {
    stats.models.files.push(fileName);
    stats.models.total++;

    if (fileName.match(/^[A-Z]/)) {
      stats.namingInconsistencies.push({
        file: relativePath,
        issue: 'PascalCase in model',
        suggestion: fileName.charAt(0).toLowerCase() + fileName.slice(1)
      });
    }
    if (!fileName.includes('model') && !fileName.includes('Model')) {
      stats.namingInconsistencies.push({
        file: relativePath,
        issue: 'Missing "model" in name',
        suggestion: fileName.replace(ext, `.model${ext}`)
      });
    }
  } else if (folder === 'routes') {
    stats.routes.files.push(fileName);
    stats.routes.total++;

    const hasRouter = fileName.includes('Router');
    const hasRoutes = fileName.includes('Routes') || fileName.includes('routes');

    if (hasRouter && !hasRoutes) {
      stats.namingInconsistencies.push({
        file: relativePath,
        issue: 'Uses "Router" instead of "routes"',
        suggestion: fileName.replace('Router', '.routes')
      });
    }
  } else if (folder === 'services') {
    stats.services.files.push(fileName);
    stats.services.total++;
  } else {
    stats.other.files.push(relativePath);
    stats.other.total++;
  }

  // Detectar .mjs
  if (ext === '.mjs') {
    stats.namingInconsistencies.push({
      file: relativePath,
      issue: 'Using .mjs extension',
      suggestion: fileName.replace('.mjs', '.js')
    });
  }
}

function walkDir(dir, relativePath = '') {
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
      walkDir(filePath, relPath);
    } else if (stat.isFile()) {
      analyzeFile(filePath, relPath);
    }
  });
}

walkDir(srcPath);

// Generar reporte
console.log('═'.repeat(70));
console.log('📊 BACKEND STRUCTURE ANALYSIS REPORT');
console.log('═'.repeat(70));

console.log('\n📈 FILES BY CATEGORY:');
console.log(`  Controllers:  ${stats.controllers.total} files`);
console.log(`  Models:       ${stats.models.total} files`);
console.log(`  Routes:       ${stats.routes.total} files`);
console.log(`  Services:     ${stats.services.total} files`);
console.log(`  Other:        ${stats.other.total} files`);
console.log(`  ─────────────────────────────`);
console.log(`  Total:        ${stats.totalFiles} files`);

console.log('\n⚠️  NAMING INCONSISTENCIES FOUND:');
console.log(`   Total issues: ${stats.namingInconsistencies.length}\n`);

// Agrupar por tipo de issue
const issuesByType = {};
stats.namingInconsistencies.forEach(item => {
  if (!issuesByType[item.issue]) {
    issuesByType[item.issue] = [];
  }
  issuesByType[item.issue].push(item);
});

Object.entries(issuesByType).forEach(([issue, items]) => {
  console.log(`  ${issue} (${items.length} files):`);
  items.slice(0, 3).forEach(item => {
    console.log(`    - ${item.file}`);
    console.log(`      → ${item.suggestion}`);
  });
  if (items.length > 3) {
    console.log(`    ... and ${items.length - 3} more`);
  }
  console.log('');
});

console.log('📋 FILES IN EACH CATEGORY:\n');

console.log('  CONTROLLERS:');
stats.controllers.files.forEach(f => console.log(`    - ${f}`));

console.log('\n  MODELS:');
stats.models.files.forEach(f => console.log(`    - ${f}`));

console.log('\n  ROUTES:');
stats.routes.files.forEach(f => console.log(`    - ${f}`));

if (stats.services.total > 0) {
  console.log('\n  SERVICES:');
  stats.services.files.forEach(f => console.log(`    - ${f}`));
} else {
  console.log('\n  SERVICES:');
  console.log('    ⚠️  No service layer found! This is a key improvement area.');
}

console.log('\n  OTHER FILES:');
stats.other.files.forEach(f => console.log(`    - ${f}`));

console.log('\n💡 RECOMMENDATIONS:\n');

if (stats.namingInconsistencies.length > 0) {
  console.log('  1. Run rename script to fix naming inconsistencies:');
  console.log('     node scripts/rename-backend-files.js\n');
}

if (stats.services.total === 0) {
  console.log('  2. Create service layer (missing - critical for best practices):');
  console.log('     - Separate business logic from controllers');
  console.log('     - Create src/services/ folder');
  console.log('     - Move logic from controllers to services\n');
}

console.log('  3. After renaming, update imports:');
console.log('     node scripts/update-imports.js\n');

console.log('  4. Validate everything works:');
console.log('     node scripts/validate-imports.js');
console.log('     npm run dev\n');

console.log('🎯 PRIORITY ACTIONS:\n');

const priorities = [];

if (stats.namingInconsistencies.length > 0) {
  priorities.push(`1. Fix ${stats.namingInconsistencies.length} naming inconsistencies`);
}

if (stats.services.total === 0) {
  priorities.push(`2. Create service layer (${stats.controllers.total} controllers need refactoring)`);
}

const mjsFiles = stats.namingInconsistencies.filter(i => i.issue === 'Using .mjs extension').length;
if (mjsFiles > 0) {
  priorities.push(`3. Convert ${mjsFiles} .mjs files to .js`);
}

priorities.forEach(p => console.log(`  ${p}`));

console.log('\n═'.repeat(70));
console.log('✓ Analysis complete!');
console.log('═'.repeat(70));

// Guardar reporte en archivo
const reportPath = path.join(__dirname, '../structure-analysis-report.txt');
const reportContent = `
BACKEND STRUCTURE ANALYSIS REPORT
Generated: ${new Date().toISOString()}

TOTAL STATISTICS:
- Controllers: ${stats.controllers.total}
- Models: ${stats.models.total}
- Routes: ${stats.routes.total}
- Services: ${stats.services.total}
- Other: ${stats.other.total}
- Total files: ${stats.totalFiles}

NAMING INCONSISTENCIES: ${stats.namingInconsistencies.length}

ISSUES BY TYPE:
${Object.entries(issuesByType)
  .map(([issue, items]) => `  ${issue}: ${items.length} files`)
  .join('\n')}

CONTROLLER FILES:
${stats.controllers.files.map(f => `  - ${f}`).join('\n')}

MODEL FILES:
${stats.models.files.map(f => `  - ${f}`).join('\n')}

ROUTE FILES:
${stats.routes.files.map(f => `  - ${f}`).join('\n')}

SERVICE FILES:
${stats.services.files.length > 0 ? stats.services.files.map(f => `  - ${f}`).join('\n') : '  (None found - needs to be created)'}

RECOMMENDATIONS:
${priorities.map(p => `  ${p}`).join('\n')}
`;

fs.writeFileSync(reportPath, reportContent);
console.log(`\n📄 Report saved to: structure-analysis-report.txt`);
