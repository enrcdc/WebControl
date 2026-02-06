import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const errors = [];
const warnings = [];
let totalImports = 0;

function validateImportsInFile(filePath) {
  const content = fs.readFileSync(filePath, 'utf-8');
  const lines = content.split('\n');

  // Regex para capturar imports relativos
  const importRegex = /from ['"](\.[^'"]+)['"]/g;
  let match;

  while ((match = importRegex.exec(content)) !== null) {
    totalImports++;
    const importPath = match[1];
    const lineNumber = content.substring(0, match.index).split('\n').length;

    // Resolver la ruta relativa
    const baseDir = path.dirname(filePath);
    let resolvedPath = path.resolve(baseDir, importPath);

    // Si no tiene extensión, intentar agregarla
    const hasExtension = /\.(js|mjs|json)$/.test(importPath);

    const possiblePaths = [];
    if (hasExtension) {
      possiblePaths.push(resolvedPath);
    } else {
      possiblePaths.push(resolvedPath + '.js');
      possiblePaths.push(resolvedPath + '.mjs');
      possiblePaths.push(resolvedPath + '.json');
      possiblePaths.push(path.join(resolvedPath, 'index.js'));
      possiblePaths.push(path.join(resolvedPath, 'index.mjs'));
    }

    const exists = possiblePaths.some(p => {
      try {
        return fs.existsSync(p);
      } catch {
        return false;
      }
    });

    if (!exists) {
      errors.push({
        file: path.relative(path.join(__dirname, '../src'), filePath),
        import: importPath,
        line: lineNumber,
        tried: possiblePaths.map(p => path.relative(path.join(__dirname, '..'), p))
      });
    }

    // Advertencias para archivos con extensión .mjs
    if (importPath.endsWith('.mjs')) {
      warnings.push({
        file: path.relative(path.join(__dirname, '../src'), filePath),
        import: importPath,
        line: lineNumber,
        message: 'Still using .mjs extension'
      });
    }
  }
}

function walkDir(dir) {
  let files;
  try {
    files = fs.readdirSync(dir);
  } catch (error) {
    return;
  }

  files.forEach(file => {
    const filePath = path.join(dir, file);
    let stat;

    try {
      stat = fs.statSync(filePath);
    } catch {
      return;
    }

    if (stat.isDirectory() && file !== 'node_modules' && file !== '.git') {
      walkDir(filePath);
    } else if (file.endsWith('.js') || file.endsWith('.mjs')) {
      try {
        validateImportsInFile(filePath);
      } catch (error) {
        errors.push({
          file: path.relative(path.join(__dirname, '../src'), filePath),
          import: 'N/A',
          line: 0,
          message: `Error reading file: ${error.message}`
        });
      }
    }
  });
}

console.log('🚀 Validating imports in backend files...\n');

const srcPath = path.join(__dirname, '../src');
walkDir(srcPath);

console.log('═'.repeat(70));

if (errors.length > 0) {
  console.log('❌ Found broken imports:\n');
  errors.forEach(err => {
    console.log(`  📄 ${err.file}:${err.line}`);
    console.log(`     Import: "${err.import}"`);
    if (err.message) {
      console.log(`     Error: ${err.message}`);
    }
    if (err.tried) {
      console.log(`     Tried:`);
      err.tried.forEach(p => console.log(`       - ${p}`));
    }
    console.log('');
  });
} else {
  console.log('✓ All imports are valid!\n');
}

if (warnings.length > 0) {
  console.log('⚠️  Warnings:\n');
  warnings.forEach(warn => {
    console.log(`  📄 ${warn.file}:${warn.line}`);
    console.log(`     Import: "${warn.import}"`);
    console.log(`     ${warn.message}\n`);
  });
}

console.log('═'.repeat(70));
console.log(`📊 Summary:`);
console.log(`   Total imports checked: ${totalImports}`);
console.log(`   Broken imports: ${errors.length}`);
console.log(`   Warnings: ${warnings.length}`);
console.log('═'.repeat(70));

if (errors.length > 0) {
  process.exit(1);
} else {
  console.log('\n✓ Validation passed!');
}
