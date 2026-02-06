import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const renameRules = {
  controllers: [
    { from: 'ObraController.mjs', to: 'obra.controller.js' },
    { from: 'almacenController.mjs', to: 'almacen.controller.js' },
    { from: 'contactoController.mjs', to: 'contacto.controller.js' },
    { from: 'ecoFacturaController.mjs', to: 'eco-factura.controller.js' },
    { from: 'ecoPedidoController.mjs', to: 'eco-pedido.controller.js' },
    { from: 'edificioController.mjs', to: 'edificio.controller.js' },
    { from: 'empresaController.mjs', to: 'empresa.controller.js' },
    { from: 'estadoObraController.mjs', to: 'estado-obra.controller.js' },
    { from: 'FacturasController.mjs', to: 'factura.controller.js' },
    { from: 'gastoController.mjs', to: 'gasto.controller.js' },
    { from: 'horasController.mjs', to: 'hora.controller.js' },
    { from: 'MovimientosAlmacenController.mjs', to: 'movimiento-almacen.controller.js' },
    { from: 'relacionObrasController.mjs', to: 'relacion-obra.controller.js' },
    { from: 'rentabilidadController.mjs', to: 'rentabilidad.controller.js' },
    { from: 'ResponsablesController.mjs', to: 'responsable.controller.js' },
    { from: 'tipoFacturableController.mjs', to: 'tipo-facturable.controller.js' },
    { from: 'tipoObraController.mjs', to: 'tipo-obra.controller.js' },
    { from: 'usuarioController.mjs', to: 'usuario.controller.js' },
  ],
  models: [
    { from: 'ObraModel.mjs', to: 'obra.model.js' },
    { from: 'almacenModel.mjs', to: 'almacen.model.js' },
    { from: 'contactoModel.mjs', to: 'contacto.model.js' },
    { from: 'ecoFacturaModel.mjs', to: 'eco-factura.model.js' },
    { from: 'ecoPedidoModel.mjs', to: 'eco-pedido.model.js' },
    { from: 'edificioModel.mjs', to: 'edificio.model.js' },
    { from: 'empresaModel.mjs', to: 'empresa.model.js' },
    { from: 'estadoObraModel.mjs', to: 'estado-obra.model.js' },
    { from: 'Facturas.mjs', to: 'factura.model.js' },
    { from: 'gastoModel.mjs', to: 'gasto.model.js' },
    { from: 'horasModel.mjs', to: 'hora.model.js' },
    { from: 'MovimientosAlmacenModel.mjs', to: 'movimiento-almacen.model.js' },
    { from: 'relacionObrasModel.mjs', to: 'relacion-obra.model.js' },
    { from: 'rentabilidadModel.mjs', to: 'rentabilidad.model.js' },
    { from: 'ResponsablesModel.mjs', to: 'responsable.model.js' },
    { from: 'tipoFacturableModel.mjs', to: 'tipo-facturable.model.js' },
    { from: 'tipoObraModel.mjs', to: 'tipo-obra.model.js' },
    { from: 'usuarioModel.mjs', to: 'usuario.model.js' },
  ],
  routes: [
    { from: 'obraRoutes.mjs', to: 'obra.routes.js' },
    { from: 'almacenRoutes.mjs', to: 'almacen.routes.js' },
    { from: 'contactoRoutes.mjs', to: 'contacto.routes.js' },
    { from: 'ecoFacturaRoutes.mjs', to: 'eco-factura.routes.js' },
    { from: 'ecoPedidoRoutes.mjs', to: 'eco-pedido.routes.js' },
    { from: 'edificioRoutes.mjs', to: 'edificio.routes.js' },
    { from: 'empresaRoutes.mjs', to: 'empresa.routes.js' },
    { from: 'estadoObraRoutes.mjs', to: 'estado-obra.routes.js' },
    { from: 'FacturasRouter.mjs', to: 'factura.routes.js' },
    { from: 'gastoRouter.mjs', to: 'gasto.routes.js' },
    { from: 'horasRoutes.mjs', to: 'hora.routes.js' },
    { from: 'MovimientosAlmacenRoutes.mjs', to: 'movimiento-almacen.routes.js' },
    { from: 'relacionObrasRouter.mjs', to: 'relacion-obra.routes.js' },
    { from: 'rentabilidadRoutes.mjs', to: 'rentabilidad.routes.js' },
    { from: 'ResponsablesRouter.mjs', to: 'responsable.routes.js' },
    { from: 'tipoFacturableRoutes.mjs', to: 'tipo-facturable.routes.js' },
    { from: 'tipoFacturableRoutes.js', to: 'tipo-facturable.routes.js.bak' }, // Duplicado
    { from: 'tipoObraRoutes.mjs', to: 'tipo-obra.routes.js' },
    { from: 'usuarioRoutes.mjs', to: 'usuario.routes.js' },
  ]
};

const srcPath = path.join(__dirname, '../src');
let totalRenamed = 0;
let totalErrors = 0;

console.log('🚀 Starting backend file renaming process...\n');

Object.entries(renameRules).forEach(([folder, rules]) => {
  console.log(`📁 Processing ${folder}/`);

  rules.forEach(({ from, to }) => {
    const oldPath = path.join(srcPath, folder, from);
    const newPath = path.join(srcPath, folder, to);

    if (fs.existsSync(oldPath)) {
      try {
        fs.renameSync(oldPath, newPath);
        console.log(`  ✓ ${from} → ${to}`);
        totalRenamed++;
      } catch (error) {
        console.error(`  ✗ Error renaming ${from}: ${error.message}`);
        totalErrors++;
      }
    } else {
      console.log(`  ⊘ ${from} (not found, skipping)`);
    }
  });

  console.log('');
});

console.log('═'.repeat(50));
console.log(`✓ Renaming complete!`);
console.log(`  Files renamed: ${totalRenamed}`);
console.log(`  Errors: ${totalErrors}`);
console.log('═'.repeat(50));

if (totalRenamed > 0) {
  console.log('\n⚠️  Next steps:');
  console.log('  1. Run: node scripts/update-imports.js');
  console.log('  2. Run: node scripts/validate-imports.js');
  console.log('  3. Test the application');
}
