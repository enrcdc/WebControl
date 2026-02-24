# Decisiones de Negocio — Control Cube / WebControl ERP

Decisiones adoptadas por Control Cube que afectan al diseno y funcionalidad del ERP. Este documento es la fuente de verdad para reglas de negocio que condicionan la implementacion.

---

## DN-1: Facturas se gestionan en FacturaDirecta, no en el ERP

**Fecha:** 24/02/2026
**Contexto:** Control Cube gestiona sus facturas en FacturaDirecta (FD). El ERP actua como sistema de gestion de proyectos/obras.
**Decision:** Las operaciones sobre facturas desde el ERP son **solo de lectura**. No hay creacion, edicion ni eliminacion de facturas desde el ERP. Las facturas se crean y editan exclusivamente desde FD.
**Implicaciones:**
- El frontend de facturas no tiene componente `CrearFactura` ni modo edicion en `DetalleFactura`
- `GestionFacturas` no tiene boton "Nueva Factura"
- La unica operacion de escritura permitida es **baja administrativa** (soft delete) para gestionar el estado en el ERP
- La importacion de facturas desde FD (iteracion FD-2) sera la unica via de entrada de facturas al ERP

---

## DN-2: Estructura de pedidos con posiciones

**Fecha:** 24/02/2026 (documentada, decision previa)
**Decision:** Los pedidos usan un sistema de posiciones incrementales (10, 20, 30...). Una factura puede cubrir una o varias posiciones de un pedido.
**Formato:** `[numero_pedido]-[posicion]` (ej: `4508338748-10`)

---

## DN-3: Informacion de obra/pedido en facturas FD

**Fecha:** 24/02/2026 (documentada, decision previa)
**Decision:** FD no permite adjuntar metadatos de obra ni pedido. La informacion se codifica en las lineas de factura:
- **Articulo:** `SAT` (identificador de linea de servicio)
- **Descripcion:** `NPos. 000010` (numero de posicion del pedido)
- **Notas:** `4508338748` (numero de pedido)
**Implicacion:** La asignacion obra/pedido-factura se hace manualmente en el ERP tras la importacion.

---

## DN-4: Tipos de factura

**Fecha:** 24/02/2026 (documentada, decision previa)
**Decision:** Existen dos tipos de factura relevantes:
- **Facturas de obras** (venta): prioridad, tabla `ecofactura`, endpoint FD `/sales-invoices`
- **Facturas de compras**: iteracion posterior, tabla `ecofacturacompra`, endpoint FD diferente
