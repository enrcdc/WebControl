import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Mapa de reemplazos de imports
const importReplacements = [
  // Controllers
  { from: './ObraController.mjs', to: './obra.controller.js' },
  { from: './almacenController.mjs', to: './almacen.controller.js' },
  { from: './contactoController.mjs', to: './contacto.controller.js' },
  { from: './ecoFacturaController.mjs', to: './eco-factura.controller.js' },
  { from: './ecoPedidoController.mjs', to: './eco-pedido.controller.js' },
  { from: './edificioController.mjs', to: './edificio.controller.js' },
  { from: './empresaController.mjs', to: './empresa.controller.js' },
  { from: './estadoObraController.mjs', to: './estado-obra.controller.js' },
  { from: './FacturasController.mjs', to: './factura.controller.js' },
  { from: './gastoController.mjs', to: './gasto.controller.js' },
  { from: './horasController.mjs', to: './hora.controller.js' },
  { from: './MovimientosAlmacenController.mjs', to: './movimiento-almacen.controller.js' },
  { from: './relacionObrasController.mjs', to: './relacion-obra.controller.js' },
  { from: './rentabilidadController.mjs', to: './rentabilidad.controller.js' },
  { from: './ResponsablesController.mjs', to: './responsable.controller.js' },
  { from: './tipoFacturableController.mjs', to: './tipo-facturable.controller.js' },
  { from: './tipoObraController.mjs', to: './tipo-obra.controller.js' },
  { from: './usuarioController.mjs', to: './usuario.controller.js' },

  // Models
  { from: './ObraModel.mjs', to: './obra.model.js' },
  { from: './almacenModel.mjs', to: './almacen.model.js' },
  { from: './contactoModel.mjs', to: './contacto.model.js' },
  { from: './ecoFacturaModel.mjs', to: './eco-factura.model.js' },
  { from: './ecoPedidoModel.mjs', to: './eco-pedido.model.js' },
  { from: './edificioModel.mjs', to: './edificio.model.js' },
  { from: './empresaModel.mjs', to: './empresa.model.js' },
  { from: './estadoObraModel.mjs', to: './estado-obra.model.js' },
  { from: './Facturas.mjs', to: './factura.model.js' },
  { from: './gastoModel.mjs', to: './gasto.model.js' },
  { from: './horasModel.mjs', to: './hora.model.js' },
  { from: './MovimientosAlmacenModel.mjs', to: './movimiento-almacen.model.js' },
  { from: './relacionObrasModel.mjs', to: './relacion-obra.model.js' },
  { from: './rentabilidadModel.mjs', to: './rentabilidad.model.js' },
  { from: './ResponsablesModel.mjs', to: './responsable.model.js' },
  { from: './tipoFacturableModel.mjs', to: './tipo-facturable.model.js' },
  { from: './tipoObraModel.mjs', to: './tipo-obra.model.js' },
  { from: './usuarioModel.mjs', to: './usuario.model.js' },

  // Routes
  { from: './routes/obraRoutes.mjs', to: './routes/obra.routes.js' },
  { from: './routes/almacenRoutes.mjs', to: './routes/almacen.routes.js' },
  { from: './routes/contactoRoutes.mjs', to: './routes/contacto.routes.js' },
  { from: './routes/ecoFacturaRoutes.mjs', to: './routes/eco-factura.routes.js' },
  { from: './routes/ecoPedidoRoutes.mjs', to: './routes/eco-pedido.routes.js' },
  { from: './routes/edificioRoutes.mjs', to: './routes/edificio.routes.js' },
  { from: './routes/empresaRoutes.mjs', to: './routes/empresa.routes.js' },
  { from: './routes/estadoObraRoutes.mjs', to: './routes/estado-obra.routes.js' },
  { from: './routes/FacturasRouter.mjs', to: './routes/factura.routes.js' },
  { from: './routes/gastoRouter.mjs', to: './routes/gasto.routes.js' },
  { from: './routes/horasRoutes.mjs', to: './routes/hora.routes.js' },
  { from: './routes/MovimientosAlmacenRoutes.mjs', to: './routes/movimiento-almacen.routes.js' },
  { from: './routes/relacionObrasRouter.mjs', to: './routes/relacion-obra.routes.js' },
  { from: './routes/rentabilidadRoutes.mjs', to: './routes/rentabilidad.routes.js' },
  { from: './routes/ResponsablesRouter.mjs', to: './routes/responsable.routes.js' },
  { from: './routes/tipoFacturableRoutes.mjs', to: './routes/tipo-facturable.routes.js' },
  { from: './routes/tipoObraRoutes.mjs', to: './routes/tipo-obra.routes.js' },
  { from: './routes/usuarioRoutes.mjs', to: './routes/usuario.routes.js' },
];

function updateImportsInFile(filePath) {
  let content = fs.readFileSync(filePath, 'utf-8');
  let modified = false;
  const changes = [];

  importReplacements.forEach(({ from, to }) => {
    const escapedFrom = from.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const regex = new RegExp(escapedFrom, 'g');

    if (regex.test(content)) {
      content = content.replace(regex, to);
      modified = true;
      changes.push(`${from} → ${to}`);
    }
  });

  if (modified) {
    fs.writeFileSync(filePath, content);
    const relPath = path.relative(path.join(__dirname, '../src'), filePath);
    console.log(`  ✓ ${relPath}`);
    changes.forEach(change => console.log(`    - ${change}`));
    return 1;
  }

  return 0;
}

function walkDir(dir, stats = { updated: 0, scanned: 0 }) {
  const files = fs.readdirSync(dir);

  files.forEach(file => {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);

    if (stat.isDirectory() && file !== 'node_modules' && file !== '.git') {
      walkDir(filePath, stats);
    } else if (file.endsWith('.js') || file.endsWith('.mjs')) {
      stats.scanned++;
      stats.updated += updateImportsInFile(filePath);
    }
  });

  return stats;
}

console.log('🚀 Updating imports in backend files...\n');

const srcPath = path.join(__dirname, '../src');
const stats = walkDir(srcPath);

console.log('\n' + '═'.repeat(50));
console.log(`✓ Import update complete!`);
console.log(`  Files scanned: ${stats.scanned}`);
console.log(`  Files updated: ${stats.updated}`);
console.log('═'.repeat(50));

if (stats.updated > 0) {
  console.log('\n⚠️  Next steps:');
  console.log('  1. Run: node scripts/validate-imports.js');
  console.log('  2. Test the application');
}
