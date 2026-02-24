# Progreso del Proyecto — WebControl ERP

Log historico de trabajo completado. Para tareas pendientes, ver `TODO.md`. Para deuda tecnica, ver `DEUDA_TECNICA.md`.

**Rama de trabajo:** `refactor/project-structure`

---

## 1. Estado general del proyecto

### Features completadas

| Feature | Backend | Frontend | Notas |
|---------|---------|----------|-------|
| empresas | OK | OK | Con sync FD |
| proveedores | OK | OK | Con sync FD |
| complejos (edificios) | OK | OK | |
| contactos | OK | OK | |
| tipoGasto | OK | OK | Con filtro multi-IVA + busqueda por descripcion |
| tipoIva | OK (solo GET) | N/A | Catalogo, solo consumido por tipoGasto |
| pedidos | OK | OK | Estructura definitiva: GestionPedidos, CrearPedido, DetallePedido, FormPedido, ImprimirPedido |
| facturas | OK | OK | Estructura definitiva (solo lectura): GestionFacturas, DetalleFactura, FormFactura, ImprimirFacturas. Sin crear/editar (DN-1) |
| compras, gastos, horas, obras, almacen, rentabilidad | OK | Parcial | Frontend migrado pero pendiente estructura definitiva |

### Ultimas sesiones

| Fecha | Commits | Descripcion |
|-------|---------|-------------|
| 13/02/2026 | — | Backend: Iteracion 3 completada (pasos 1-5) |
| 17-18/02/2026 | — | Frontend: Features complejos + contactos completas |
| 19/02/2026 | `79d5e3d` | Frontend: GestionEmpresas refactorizada, DetalleEmpresa contactos editables, JSON_ARRAYAGG especificacion |
| 20/02/2026 | `296d366`, `b3205bc`, `4d406df` | Feature proveedores + tipoFactura + integracion FD primera iteracion |
| 23/02/2026 | `2d27fc4` | Feature tipogasto completa (backend + frontend) |
| 23/02/2026 | `790b281` | Resolucion deuda tecnica puntos 1-4 |
| 24/02/2026 | `519662e` | Docs: CONTEXTO_DESARROLLO_ACTUAL + rename boton importar facturas |

---

## 2. Backend — Iteracion 1: Capa de servicios (COMPLETADA)

Todos los modelos tienen service + controller + routes:

| Entidad | Notas |
|---------|-------|
| obra | Servicio completo con enrichment, alertas, estadisticas, transicion de estados |
| empresa | CRUD + sync FD |
| edificio | getAll + getById extendidos |
| contacto | CRUD + filtros empresa/edificio |
| gasto | buscarConFiltros con campo `tipo` obligatorio |
| factura-compra | CRUD completo, soft delete |
| hora | CRUD completo, filtros subordinados |
| pedido-obra | CRUD completo, soft delete |
| factura-obra | CRUD completo, JOIN con ecopedido |
| almacen | CRUD completo, soft delete |
| movimiento-almacen | CRUD completo, 5 LEFT JOINs |
| relacion-obra | Relaciones padre-hijo entre obras |
| rentabilidad | Solo lectura (getByIdObra) |
| responsable | Solo lectura (getSubordinados) |
| estado-obra, tipo-facturable, tipo-obra | Solo lectura (catalogos) |
| usuario | getAll + login |
| proveedor | CRUD + sync FD |
| tipo-gasto | CRUD + filtrar |
| tipo-iva | Solo getAll (catalogo) |

---

## 3. Backend — Iteracion 2: Migracion a Knex.js (COMPLETADA)

Todos los modelos migrados de `pool.query()` a Knex.js query builder con `getAll(filters = {})`.

| Entidad | Filtros principales |
|---------|-------------------|
| empresa | idsEmpresa, nombre, tipoEmpresa, mostrarBaja |
| edificio | idEdificio, nombre, mostrarBaja, idContacto |
| contacto | idContacto, nombre, idsEmpresa, idEdificio, mostrarBaja |
| gasto | idGasto, tipo, idsObra, codigoObra, descripcionObra, tipoGasto, usuarioAlta |
| obra | 15 filtros: idObra, empresa, complejo, estados, tipos (arrays), booleanos, fechas |
| factura-compra | idFactura, idObra, codigoObra, concepto, numFactura, mostrarBaja |
| hora | idHora, idsObra, usuario, manager, estadosObra, tiposObra, tareas, validadas, fechas |
| pedido-obra | idPedido, idsObra, codigoPedido, posicion, observaciones, mostrarBaja |
| factura-obra | idFactura, idsObra, codigoFactura, conceptos, codigoPedido, mostrarBaja |
| almacen | idProducto, descripcion, codigo, proveedor, familia, unidades, marca, minimo/maximo, mostrarBaja |
| movimiento-almacen | idMovimiento, idObra, idReferencia, tipoMovimiento, conceptoMovimiento, mostrarBaja |
| usuario | nombre, apellido, codigoFirma |

---

## 4. Backend — Iteracion 3: Consolidacion (COMPLETADA)

| Paso | Estado | Descripcion |
|------|--------|-------------|
| 1. Limpieza general | OK | Eliminados archivos vacios, corregidos typos, eliminado export pool |
| 2. ErrorHandler centralizado | OK | Registrado una vez en app.js, eliminado de 18 archivos de rutas |
| 3. Middleware Zod en rutas | OK | validate(schema) creado, aplicado en POST/PATCH, Zod retirado de modelos |
| 4. Paginacion | OK | applyPagination en 11 modelos, formato `{ data, pagination }` |
| 5. Auth JWT | OK | Middleware creado (no activado), endpoint `POST /api/auth/login` |
| 6. Seguridad | Pendiente | Para pre-produccion (helmet, rate-limit, CORS) |

---

## 5. Frontend — Iteracion 1: Infraestructura base (COMPLETADA)

| Paso | Descripcion |
|------|-------------|
| Cliente API centralizado | `Services/api/client.js` — axios con baseURL desde `.env`, interceptor JWT, interceptor 401 |
| Constantes | `constants/api.js` (endpoints) y `constants/routes.js` (rutas React Router) |
| Estructura de carpetas | `Components/ui/`, `Components/layout/`, `features/`, `hooks/`, `utils/`, `styles/` |
| `.env` | `REACT_APP_API_URL=http://localhost:3002/api` |

---

## 6. Frontend — Iteracion 2: Migracion feature by feature (COMPLETADA)

Todos los features migrados a la estructura feature-based:

| Feature | Ola | Notas |
|---------|-----|-------|
| auth | 1a | Service + Login.js + AuthContext + PrivateRoute |
| empresas | 1a | Service + 5 componentes (Gestion, Crear, Detalle, Form, ModalNuevoContacto) |
| almacen | 1a | Service (almacen + movimientoAlmacen) + GestionAlmacen |
| gastos | 2a | Service + GastosList (574 lineas monoliticas, pendiente split) |
| horas | 2a | Service (hora + user) + 3 componentes |
| compras | 2a | Service + 3 componentes |
| pedidos | 3a | Service + 4 componentes |
| facturas | 3a | Service + 4 componentes |
| rentabilidad | 3a | Service + ProfitabilityTable |
| obras | 4a | El mas complejo: 24 hooks, 26 componentes, 2 servicios |

App.js importa TODAS las features desde barrel exports. No quedan imports de estructura antigua (excepto Navbar en `Components/layout/`).

### Detalle de la 4a ola — obras

7 pasos: servicios → utils → 24 hooks (3 grupos) → 26 componentes → barrel export → App.js → documentacion.

Mapeo de nombres de metodos (old → new):
- `obraService`: getObra→getById, getAllObras→getAll, createObra→create, updateObra→update, deleteObra→delete
- `pedidoService`: getPedidos→getByObras, createPedido→create, updatePedido→update, deletePedido→delete([id])
- `facturaService`: getFacturas→getByObras, createFactura→create, updateFactura→update, deleteFactura→delete([id])
- `almacenService`: getMovimientosAlmacen→movimientoAlmacenService.getByObra, buscarProductos→almacenService.buscarPorDescripcion
- `compraService`: getFacturasCompras→getByObra, buscarFacturas→buscarPorConcepto
- `gastoService`: getGastos→getByObras
- `horaService`: getHoras→getByObras, getHorasExtra→getHorasExtra
- `rentabilidadService`: getRentabilidad→getByObra

---

## 7. Frontend — Iteracion 3: Limpieza y optimizacion (COMPLETADA)

| Paso | Estado |
|------|--------|
| Eliminar carpetas viejas | OK (manual, excepto Services/ parcial — quedan servicios legacy) |
| Componentes UI compartidos | OK (PaginationControl, SearchableSelect, SearchableMultiSelect, SearchDropdown) |
| Estilos (css/ → styles/) | OK (manual) |
| Hooks genericos a hooks/ global | OK (10 hooks atomicos movidos) |
| Utils genericos a utils/ global | OK (fechas.js global; calculos.js, filtrosHelpers.js en features/obras/utils/) |
| Path aliases | OK (jsconfig.json con baseUrl: "src") |

---

## 8. Features implementadas en estructura definitiva

### Feature empresas

**Backend:**
- `empresa.model.js` getAll: tipoEmpresa, porDefecto, contactosCount, filtros nombre/tipoEmpresa/mostrarBaja
- `empresa.model.js` getById: JSON_ARRAYAGG contactos, fd_contact_id
- `empresa.model.js` create/update: CRUD con _updateContactos y saveFdContactId
- `empresa.service.js`: sync FD en create/update

**Frontend (5 componentes + 1 servicio):**
- `GestionEmpresas.jsx` — useGestionEntidad + useSeleccionMultiple + filtro mostrarBaja + columna Estado. TIPOS_EMPRESA importado de FormEmpresa
- `CrearEmpresa.jsx` — useFormulario + useBusquedaMultiple + ModalNuevoContacto (diferido) + fdSyncWarning
- `DetalleEmpresa.jsx` — Contactos editables: useBusquedaMultiple + SearchableMultiSelect en edicion, ListGroup en lectura. Creacion inline + guardado diferido + orquestado + fdSyncWarning
- `FormEmpresa.jsx` — Compartido Crear/Detalle. Exporta TIPOS_EMPRESA
- `ModalNuevoContacto.jsx` — Modal simplificado + useFormulario
- `empresa.service.js` — CRUD + buscarPorNombre

### Feature complejos

**Backend:**
- `edificio.model.js` getAll: direccion, telefono1/2, email, observaciones, porDefecto, filtros mostrarBaja/idContacto
- `edificio.model.js` getById: JSON_ARRAYAGG contactos

**Frontend (5 componentes + 1 servicio):**
- `GestionComplejos.jsx` — useGestionEntidad, filtros busqueda + mostrarBaja
- `CrearComplejo.jsx` — useFormulario + useBusquedaMultiple contactos (min 1)
- `DetalleComplejo.jsx` — Fetch via getAll({idEdificio}), contactos editables
- `FormComplejo.jsx` — Compartido
- `complejo.service.js` — CRUD completo

### Feature contactos

**Backend:**
- `contacto.model.js` getAll: dni, telefono/2, email/2, direccion, observaciones, fecha_baja, idEmpresa, nombreEmpresas (GROUP_CONCAT), filtros idsEmpresa/idEdificio/mostrarBaja
- `contacto.model.js` getById: JSON_ARRAYAGG empresas + complejos

**Frontend (5 componentes + 1 servicio):**
- `GestionContactos.jsx` — useGestionEntidad + SearchableMultiSelect multi-empresa
- `CrearContacto.jsx` — SearchableSelect empresa (req.) + SearchableMultiSelect complejos (opt.)
- `DetalleContacto.jsx` — Empresa read-only (inmutable), complejos editables
- `FormContacto.jsx` — Compartido
- `contacto.service.js` — CRUD completo

### Feature proveedores

- Backend + Frontend completo con sync FD
- Mismos patrones que empresas

### Feature tipoGasto

**Backend:**
- `tipo-gasto.js` — getAll(filters) con descripcion LIKE, idsIva whereIn, mostrarBaja + getById + create + update + softDelete
- `tipo-iva.js` — catalogo solo getAll
- `POST /tipo-gasto/filtrar` registrado ANTES de `POST /tipo-gasto/`

**Frontend:**
- `GestionTipoGastos.jsx` — filtrar() + useBusquedaMultiple para multi-IVA (minLength: 1) + useGestionEntidad
- `FormTipoGasto.jsx` — Campos: etiqueta, descripcion, importe, porcentaje, tipoIva (Select), conHoras, esHoraExtra, observaciones
- `CrearTipoGasto.jsx` — fetch tiposIva al montar
- `DetalleTipoGasto.jsx` — mapTipoGastoToForm con mapeo de nombres

### Feature pedidos

**Backend:** Sin cambios (CRUD completo ya existente).

**Frontend (5 componentes + 1 servicio):**
- `GestionPedidos.jsx` — useGestionEntidad + useSeleccionMultiple + filtros (codigoPedido, fechaInicio/Fin, mostrarBaja)
- `CrearPedido.jsx` — useFormulario + useBusquedaEntidad (SearchableSelect obra) + FormPedido
- `DetallePedido.jsx` — useFormulario + mapPedidoToForm + editando toggle + obra read-only
- `FormPedido.jsx` — Compartido Crear/Detalle. Campos: codigoPedido, posicion, importe, fecha, observaciones
- `ImprimirPedido.jsx` — Tabla con campos correctos de BD (reemplaza legacy con campos incorrectos)
- `pedido.service.js` — Sin cambios

### Feature facturas

**Backend:** Anadido getById (ruta + controller + service + model con JOIN obras/pedidos), anadido deleteMany (model + service + controller + ruta). Frontend facturaService.delete actualizado a `{ idFacturas }`.

**Frontend (4 componentes + 1 servicio) — solo lectura (DN-1):**
- `GestionFacturas.jsx` — useGestionEntidad + useSeleccionMultiple + filtros (codigoFactura, mostrarBaja). Sin boton "Nueva Factura"
- `DetalleFactura.jsx` — Solo lectura, sin modo edicion. useFormulario + mapFacturaToForm + obra/pedido read-only + baja
- `FormFactura.jsx` — Display read-only. Campos: codigoFactura, posicion, importe, fecha, conceptoFactura, conceptoLinea, observaciones, cobrado/fechaCobro
- `ImprimirFacturas.jsx` — Tabla con campos correctos de BD
- `factura.service.js` — delete actualizado a `{ idFacturas }`

**No existe CrearFactura ni modo edicion:** las facturas se crean en FacturaDirecta (ver DECISIONES_NEGOCIO.md DN-1).

---

## 9. Rutas App.js actuales

```
/home/gestion-empresas               → GestionEmpresas
/home/nueva-empresa                  → CrearEmpresa
/home/gestion-empresas/detalle/:id   → DetalleEmpresa
/home/gestion-complejos              → GestionComplejos
/home/nuevo-complejo                 → CrearComplejo
/home/gestion-complejos/detalle/:id  → DetalleComplejo
/home/gestion-contactos              → GestionContactos
/home/nuevo-contacto                 → CrearContacto
/home/gestion-contactos/detalle/:id  → DetalleContacto
/home/gestion-proveedores            → GestionProveedores
/home/nuevo-proveedor                → CrearProveedor
/home/gestion-proveedores/detalle/:id → DetalleProveedor
/home/gestion-tipos-gasto            → GestionTipoGastos
/home/nuevo-tipo-gasto               → CrearTipoGasto
/home/gestion-tipos-gasto/detalle/:id → DetalleTipoGasto
/home/gestion-pedidos                → GestionPedidos
/home/nuevo-pedido                   → CrearPedido
/home/gestion-pedidos/detalle/:id    → DetallePedido
/home/imprimir-pedido                → ImprimirPedido
/home/gestion-facturas               → GestionFacturas (solo lectura)
/home/gestion-facturas/detalle/:id   → DetalleFactura (solo lectura)
/home/imprimir-factura               → ImprimirFacturas
(+ rutas legacy de obras, compras, horas, gastos, almacen, rentabilidad)
```

---

## 10. Deuda tecnica resuelta (sesion 23/02/2026)

**Punto 1 — id_empresa vs id en EmpresaModel.create():**
- create() ahora llama internamente a getById() y devuelve resultado normalizado

**Punto 2 — Contrato de respuesta FD:**
- Nuevo contrato: `{ data: entidad, sync: { ok, ... } }` (antes era `{ ...entidad, fdSync: { ... } }`)
- Afecto: empresa.service, proveedor.service, 4 componentes frontend

**Punto 3 — console.log eliminado** en empresa.service.js

**Punto 4 — Refactorizacion FDContactoSyncService:**
- Extraido metodo privado `static async #sync()` que centraliza logica comun
