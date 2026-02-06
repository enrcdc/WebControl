/**
 * Barrel Export para Rutas
 *
 * Este archivo centraliza todas las rutas de la aplicaciOn.
 */

import express from 'express';

// Importar todas las rutas
import almacenRouter from './almacen.routes.js';
import facturasRouter from './factura.routes.js';
import contactoRouter from './contacto.routes.js';
import edificioRouter from './edificio.routes.js';
import empresaRouter from './empresa.routes.js';
import estadoObraRouter from './estado-obra.routes.js';
import tipoFacturableRouter from './tipo-facturable.routes.js';
import tipoObraRouter from './tipo-obra.routes.js';
import usuarioRouter from './usuario.routes.js';
import relacionObrasRouter from './relacion-obra.routes.js';
import obraRouter from './obra.routes.js';
import rentabilidadRouter from './rentabilidad.routes.js';
import ecoFacturaRouter from './eco-factura.routes.js';
import ecoPedidoRouter from './eco-pedido.routes.js';
import gastoRouter from './gasto.routes.js';
import horasRouter from './hora.routes.js';
import movimientosAlmacenRouter from './movimiento-almacen.routes.js';
import responsablesRouter from './responsable.routes.js';

/**
 * Crear un router principal que agrupa todas las rutas
 */
const router = express.Router();

// ============================================
// SECCION: Entidades Principales
// ============================================

router.use('/obra', obraRouter);
router.use('/facturas', facturasRouter);
router.use('/gastos', gastoRouter);
router.use('/horas', horasRouter);

// ============================================
// SECCION: Compras y Pedidos
// ============================================

router.use('/ecoPedido', ecoPedidoRouter);
router.use('/ecoFactura', ecoFacturaRouter);

// ============================================
// SECCION: Almacen
// ============================================

router.use('/almacen', almacenRouter);
router.use('/movimientos-almacen', movimientosAlmacenRouter);

// ============================================
// SECCION: Catalogos y Configuracion
// ============================================

router.use('/tipo-obra', tipoObraRouter);
router.use('/tipo-facturable', tipoFacturableRouter);
router.use('/estado-obra', estadoObraRouter);
router.use('/responsables', responsablesRouter);

// ============================================
// SECCION: Entidades de Negocio
// ============================================

router.use('/empresa', empresaRouter);
router.use('/edificio', edificioRouter);
router.use('/contacto', contactoRouter);

// ============================================
// SECCION: Relaciones
// ============================================

router.use('/relacion-obras', relacionObrasRouter);

// ============================================
// SECCION: Reportes
// ============================================

router.use('/rentabilidad', rentabilidadRouter);

// ============================================
// SECCION: Usuarios y Autenticacion
// ============================================

router.use('/usuario', usuarioRouter);

/**
 * Ruta de health check (verificar que el servidor esta funcionando)
 */
router.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
  });
});

export default router;
