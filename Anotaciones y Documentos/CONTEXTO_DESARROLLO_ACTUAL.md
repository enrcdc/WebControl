# Contexto de Desarrollo Actual

Documento de referencia para el estado activo del proyecto, la deuda técnica pendiente y las próximas iteraciones planificadas. Complementa los documentos de refactorización (`CONTEXTO_REFACTORIZACION_BACKEND.md` y `CONTEXTO_REFACTORIZACION_FRONTEND.md`).

**Última actualización:** 23/02/2026
**Rama de trabajo:** `refactor/project-structure`

> **TODO:** Reorganizar los documentos de sesión en una estructura más granular. Actualmente toda la información está concentrada en pocos archivos grandes. Definir criterio de separación (por dominio, por iteración, por tipo de contenido).

---

## 1. Estado actual del proyecto

### Últimas sesiones completadas

| Fecha | Commits | Descripción |
|-------|---------|-------------|
| 20/02/2026 | `296d366`, `b3205bc`, `4d406df` | Feature proveedores completa + tipoFactura + integración FD primera iteración |
| 23/02/2026 | `2d27fc4` | Feature `tipogasto` completa (backend + frontend) |
| 23/02/2026 | `790b281` | Refactorización: resolución deuda técnica previa a iteración FD-2 (puntos 1-4) |

### Features completadas

| Feature | Backend | Frontend | Notas |
|---------|---------|----------|-------|
| empresas | ✅ | ✅ | Con sync FD |
| proveedores | ✅ | ✅ | Con sync FD |
| complejos (edificios) | ✅ | ✅ | |
| contactos | ✅ | ✅ | |
| tipoGasto | ✅ | ✅ | Con filtro multi-IVA + búsqueda por descripción |
| tipoIva | ✅ (solo GET) | N/A | Catálogo, solo consumido por tipoGasto |
| compras, pedidos, facturas, gastos, horas, obras, almacen, rentabilidad | ✅ | Parcial | Frontend migrado pero pendiente estructura definitiva |

---

## 2. Cambios de la sesión 23/02/2026

### Commit `2d27fc4` — Feature tipogasto

**Backend:**
- `BACK-END/src/models/tipo-gasto.js` — nuevo modelo Knex con `getAll(filters)` (descripción LIKE, idsIva whereIn, mostrarBaja), `getById`, `create`, `update`, `softDelete`. Usa `applyPagination`.
- `BACK-END/src/models/tipo-iva.js` — nuevo modelo catálogo (solo `getAll`). Campos: `id_tipoiva as id`, `descripcion`, `porcentaje`.
- `BACK-END/src/services/tipo-gasto.service.js` — CRUD completo + delete con patrón `{ eliminados, yaEliminados, noEncontrados }`.
- `BACK-END/src/services/tipo-iva.service.js` — solo `getAll()`.
- `BACK-END/src/controllers/tipo-gasto.controller.js` — método `filtrar` (lee de `req.body`) + CRUD estándar.
- `BACK-END/src/controllers/tipo-iva.controller.js` — solo `getAll`.
- `BACK-END/src/routes/tipo-gasto.routes.js` — `POST /filtrar` registrado **antes** de `POST /` para evitar conflicto Express.
- `BACK-END/src/routes/tipo-iva.routes.js` — solo `GET /`.
- `BACK-END/src/routes/index.js` — añadidos `tipoGastoRouter` y `tipoIvaRouter`.

**Frontend:**
- `constants/api.js` — añadidos `TIPO_GASTO: "/tipo-gasto"` y `TIPO_IVA: "/tipo-iva"`.
- `features/tipoGasto/services/tipoGasto.service.js` — incluye `filtrar(filters)` como `POST /tipo-gasto/filtrar`.
- `features/tipoGasto/components/GestionTipoGastos.jsx` — usa `filtrar()` + `useBusquedaMultiple` para multi-IVA (minLength: 1, carga catálogo completo) + `useGestionEntidad`.
- `features/tipoGasto/components/FormTipoGasto.jsx` — compartido entre Crear y Detalle. Campos: etiqueta*, descripcion*, importe*, porcentaje, tipoIva (Select del catálogo), conHoras, esHoraExtra, observaciones.
- `features/tipoGasto/components/CrearTipoGasto.jsx` — fetch tiposIva al montar + build payload con `Number()` para numéricos.
- `features/tipoGasto/components/DetalleTipoGasto.jsx` — `mapTipoGastoToForm` con mapeo de nombres (`id_tipoiva` → `tipoIva`, `conhoras` → `conHoras`, `eshoraextra` → `esHoraExtra`).
- `features/tipoGasto/index.js` — barrel export.
- `App/App.js` — rutas: `gestion-tipos-gasto`, `nuevo-tipo-gasto`, `gestion-tipos-gasto/detalle/:id`.
- `Components/layout/Navbar.js` — link de navegación.

### Commit `790b281` — Deuda técnica puntos 1-4

**Punto 1 — `id_empresa` vs `id` en EmpresaModel.create():**
- `BACK-END/src/models/empresa.model.js`: `create()` ahora llama internamente a `getById({ idEmpresa })` y devuelve el resultado normalizado (`{ id, ... }` en lugar de `{ id_empresa, ... }` del raw INSERT).
- `BACK-END/src/services/empresa.service.js`: eliminada la segunda llamada redundante a `getById()` que existía en el servicio. Usa `nuevaEmpresa.id` (antes `nuevaEmpresa.id_empresa`).

**Punto 2 — Contrato de respuesta FD:**
- Nuevo contrato: services devuelven `{ data: entidad, sync: { ok, fdContactId?, skipped?, error? } }`.
- Controllers exponen al cliente: `res.json({ success: true, data, sync })`.
- Reemplaza el contrato anterior (`{ ...entidad, fdSync: { ... } }`).
- Afectó: `empresa.service.js`, `proveedor.service.js`, `empresa.controller.js`, `proveedor.controller.js`.
- Frontend: `res.data?.sync` en lugar de `res.data?.data?.fdSync` en los cuatro componentes: `CrearEmpresa.jsx`, `DetalleEmpresa.jsx`, `CrearProveedor.jsx`, `DetalleProveedor.jsx`.

**Punto 3 — console.log eliminado:**
- `BACK-END/src/services/empresa.service.js`: eliminado `console.log("Creación de empresa satisfactoria")`.

**Punto 4 — Refactorización FDContactoSyncService:**
- `BACK-END/src/integrations/FacturaDirecta/Contactos/FDContactoSyncService.js`: extraído método privado `static async #sync(entityName, mapFn, cif, fdContactId)` que centraliza la lógica común. `syncEmpresa` y `syncProveedor` lo delegan.

> **Nota:** La sección 16 del documento `CONTEXTO_REFACTORIZACION_FRONTEND.md` describe el contrato anterior `{ ...entidad, fdSync }`. El contrato vigente es `{ data, sync }` como se describe en el punto 2 anterior.

---

## 3. Deuda técnica pendiente

Detectada durante la sesión 23/02/2026. No bloquea el desarrollo actual. Se abordará en iteraciones futuras.

### Punto 5 — `codigo_usuario_baja` hardcoded

**Problema:** El campo `codigo_usuario_baja` está hardcodeado a `67` en al menos 6 modelos al hacer soft delete:
- `factura-obra.model.js`
- `factura-compra.model.js`
- `pedido-obra.model.js`
- `movimiento-almacen.model.js`
- `almacen.model.js`
- `obra.model.js`

**Solución futura:** Cuando el middleware `auth` esté activo en las rutas, `req.user.codigoUsuario` estará disponible. Los servicios deberán recibir el ID del usuario como parámetro y pasarlo al modelo.

**Dependencia:** Requiere que el frontend implemente JWT y que el middleware `auth` se active en rutas protegidas. Ver sección 15 del backend doc (Paso 5 — Auth JWT).

---

### Punto 6 — Naming inconsistente en `contacto.mapper.js`

**Problema:** El mapper de FacturaDirecta usa `nombre_contacto ?? nombre` para obtener el nombre del contacto. Esto indica que el modelo de contactos devuelve el campo con dos nombres distintos según el contexto (getAll vs getById, o con/sin JOIN).

**Solución futura:** Unificar el alias del campo en `contacto.model.js` para que siempre se llame igual. Actualizar `contacto.mapper.js` para usar un único nombre de campo.

---

### Punto 7 — Patrón `GET /tipo-gasto` + `POST /tipo-gasto/filtrar` no documentado

**Problema:** El feature `tipoGasto` tiene dos endpoints de listado:
- `GET /tipo-gasto` → devuelve todos (sin filtros complejos)
- `POST /tipo-gasto/filtrar` → filtros con arrays (`idsIva`)

El frontend usa **siempre** `filtrar()`, nunca `getAll()` directamente. Esto es correcto funcionalmente pero el patrón no está documentado en las convenciones del proyecto.

**Solución futura:** Documentar explícitamente en `CONTEXTO_REFACTORIZACION_BACKEND.md` sección 11 que cuando una entidad tiene filtros de array, el frontend **siempre** llama a `POST /filtrar` y el `GET /` queda como endpoint secundario (por ejemplo, para integraciones externas o testing).

---

### Punto 10 — `DEFAULT_LIMIT = 200` en paginación

**Problema:** `pagination.utils.js` tiene `DEFAULT_LIMIT = 200`. Para entidades con muchos registros (horas, movimientos de almacén) este valor puede ser excesivo y generar respuestas lentas.

**Solución futura:** Revisar el límite por entidad. Opciones:
- Reducir `DEFAULT_LIMIT` global a 50.
- Permitir que cada servicio especifique su límite por defecto.
- El frontend ya establece su propio `defaultLimit` vía `useGestionEntidad` (actualmente 20-50 según el feature).

**Nota:** El frontend controla el límite real enviado al backend, por lo que el impacto es bajo mientras no se llame sin `limit` explícito.

---

### Punto 11 — CRUD incompleto en entidades legacy

**Problema:** Varias entidades tienen solo lectura o CRUD parcial. Documentadas para implementar cuando el cliente lo requiera:

| Entidad | Estado actual | Pendiente |
|---------|--------------|-----------|
| `edificio` (complejo) | getAll + getById | create, update, softDelete |
| `gasto` | getAll + getById | create, update, softDelete |
| `responsable` | getSubordinados | create, update, softDelete |
| `usuario` | getAll + login | create, update, softDelete |
| `hora` | CRUD completo | Revisar TODOs en el modelo |

---

## 4. Iteración FD-2 — Importación de facturas desde FacturaDirecta

### Contexto de negocio

Control Cube gestiona sus facturas **en FacturaDirecta**, no en el ERP. El ERP actúa como sistema de gestión de proyectos/obras. Objetivo de esta iteración: importar las facturas creadas en FD al ERP para poder asociarlas a obras y pedidos.

**Operaciones sobre facturas desde el ERP: solo GET.** No hay creación, edición ni eliminación de facturas desde el ERP — esas operaciones ocurren en FD.

**Tipos de factura afectadas:**
- **Facturas de obras** (prioridad en esta iteración)
- **Facturas de compras** (iteración posterior)

---

### Estructura de pedidos

Los pedidos tienen la siguiente estructura de numeración:

```
Número de pedido: 4508338748
Posiciones:
  4508338748-10   (primera posición)
  4508338748-20   (segunda posición)
  4508338748-30   (tercera posición)
  ...
```

- Las posiciones siempre empiezan en `-10` e incrementan de 10 en 10.
- Una factura puede cubrir **todas las posiciones** de un pedido o solo **algunas**.

---

### Limitación de FacturaDirecta

FD no permite adjuntar explícitamente metadatos de obra ni de pedido/posición a una factura. La información se codifica en las **líneas de la factura** con el siguiente formato:

| Campo FD | Valor | Descripción |
|----------|-------|-------------|
| Artículo | `SAT` | Identificador de línea de servicio |
| Descripción | `NºPos. 000010` | Número de posición del pedido (con ceros a la izquierda) |
| Notas | `4508338748` | Número de pedido |

---

### Soluciones adoptadas

**Asignación de obra:** Manual. El usuario, tras importar las facturas, asigna manualmente cada factura a un proyecto/obra en el ERP.

**Asignación de pedido/posición:** Manual. Una vez asignada la obra, el ERP muestra los pedidos asociados a esa obra. El usuario selecciona manualmente los pedidos y posiciones que cubre la factura.

---

### Flujo de importación (6 pasos)

```
[1] Usuario pulsa "Importar facturas desde FacturaDirecta"
        ↓
[2] ERP consulta FD (GET /facturas) y filtra las que aún no están en la DB local
    → Las nuevas facturas se guardan en DB como estado "sin proyecto asignado"
        ↓
[3] Las facturas importadas aparecen en la lista de GestionFacturas (estado pendiente)
        ↓
[4] Usuario accede al detalle de una factura importada y asigna obra/proyecto
        ↓
[5] El ERP muestra los pedidos asociados a esa obra
    → Usuario selecciona manualmente los pedidos y posiciones que cubre la factura
        ↓
[6] ERP actualiza el registro de la factura con obra + pedidos/posiciones asignados
```

---

### Módulos afectados

| Módulo | Acción | Notas |
|--------|--------|-------|
| `GestionFacturas` | Añadir botón "Importar facturas desde FD" + columna estado | Estado: "pendiente asignación" / "asignada" |
| `DetalleFactura` | Añadir selector de obra + selector de pedidos/posiciones | Solo editables estos campos, el resto read-only (vienen de FD) |
| **No hay** `CrearFactura` | No aplica | Las facturas solo se crean en FD |
| Backend: `factura-obra.model.js` | Nuevo método `importFromFD(facturas[])` | Inserta múltiples facturas con estado "pendiente" |
| Backend: `factura-obra.service.js` | Método `importarDesde FD()` + `asignarObra(id, obraId)` + `asignarPedidos(id, pedidosIds)` | |
| Backend: nueva integración FD | `GET /facturas` de FD + filtrado de nuevas | Nueva subcarpeta en `integrations/FacturaDirecta/Facturas/` |

---

### Decisiones de diseño discutidas (23/02/2026)

**D1 — Auto-parsing de líneas FD vs. asignación manual**
Las líneas de factura en FD ya codifican pedido y posición. La automatización es deseable pero no se puede depender de una estructura que no está garantizada por FD. **Decisión: asignación manual por ahora.** TODO: revisarlo con el cliente cuando se aborde el paso — si FD garantiza la estructura, automatizar.

**D2 — ¿Facturas FD = misma entidad que `factura-obra` del ERP?**
En principio sí, son la misma entidad (`ecofactura`). Sin embargo, no hay correspondencia 1:1 entre ambas y hay detalles pendientes de concretar. La migración de BBDD pendiente tiene precisamente como objetivo homogeneizar las entidades FD con las del ERP. **Decisión: usar `ecofactura` como base, añadir campos FD.** Concretar cuando se detalle el paso.

**D3 — Criterio para identificar facturas nuevas (deduplicación)**
Opciones barajadas:
- ~~Selección manual por el usuario~~ — descartada por ser tediosa
- **Por fecha**: guardar la fecha de la última importación y traer solo las facturas de FD con fecha de creación posterior → válido y eficiente
- Por `fd_invoice_id`: comparar IDs ya almacenados en DB con los que devuelve FD
**Decisión: pendiente de concretar con el cliente.** La opción de fecha es buena candidata. Discutir criterio exacto cuando se aborde el paso.

**D4 — ¿Refactorizar pedidos/facturas completo antes de FD-2?**
No es necesario refactorizar todo. **Decisión: refactorizar lo mínimo necesario** para que encaje con FD-2. Las features tienen estructura legacy y necesitan al menos una pasada básica antes de añadir nueva funcionalidad.

**D5 — ¿Facturas de obras y de compras usan el mismo endpoint FD?**
No. FD distingue entre:
- **Facturas de venta** (`/sales-invoices`) → corresponden a las `factura-obra` del ERP
- **Facturas de compra y tickets** (endpoint diferente en FD) → corresponden a las `factura-compra` del ERP
**Decisión: implementar primero la importación de facturas de venta (obras). Compras en iteración posterior.**

---

### Pasos propuestos para esta iteración

**Paso 1 — Refactorizar features `pedidos` y `facturas`:**
- Adaptar `GestionPedidos`, `DetallePedido`, `GestionFacturas`, `DetalleFactura` a la estructura definitiva (sección 8 del doc frontend).
- Eliminar módulos `NuevoFactura` / actualizar para que no permitan crear (solo importar).
- Aplicar `useGestionEntidad`, `useFormulario`, filtros server-side, paginación server-side.

**Paso 2 — Infraestructura FD para facturas de obras:**
- Nueva subcarpeta `integrations/FacturaDirecta/Facturas/` con:
  - `FacturasService.js` — cliente FD para `GET /sales-invoices` (facturas de venta en FD).
  - `factura.mapper.js` — mapeo respuesta FD → modelo ERP.
  - `FDFacturaSyncService.js` — orquestación de importación (nunca lanza, siempre devuelve `{ ok, importadas, omitidas, errores }`).
- Nuevo endpoint backend: `POST /facturaObra/importar` → llama a FD, filtra nuevas, inserta en DB.
- Migración de DB si es necesaria (nuevo campo `fd_invoice_id` o `estado_asignacion` en tabla `ecofactura`).

**Pendiente para iteración posterior:** Facturas de compras (`factura-compra`). Mismo patrón pero distinta tabla y distinto endpoint FD.

---

## 5. Migración de base de datos (próxima)

**Tipo:** Migración de esquema + migración de infraestructura.

**Estado:** Planificada. Pendiente de ejecutar.

**Impacto esperado en código:** Mínimo. Los cambios se diseñarán para que no afecten significativamente al código existente.

**Acción requerida:** Cuando se ejecute la migración, revisar:
- Nombres de tablas/columnas en los modelos Knex si cambian.
- Scripts SQL en `BACK-END/src/migrations/`.
- Variables de entorno de conexión en `.env` / `config/env.js`.

---

## 6. TODO: Punto de continuación

**Última sesión:** 23/02/2026
**Estado:** Feature `tipogasto` completa. Deuda técnica puntos 1-4 resuelta. Iteración FD-2 planificada.

### Próximos pasos (en orden):

1. **Migración de BBDD** — ejecutar cuando esté lista. Revisar impacto en modelos.
2. **Refactorizar features `pedidos` y `facturas`** — estructura definitiva (Paso 1 de FD-2).
3. **Infraestructura FD para facturas de obras** — Paso 2 de FD-2.
4. **Features `compras`, `gastos`, `horas`, `obras`** — pendientes de estructura definitiva (ver sección 11 del doc frontend).
5. **`ImprimirEmpresa.jsx`** — placeholder pendiente de requisitos.
6. **Baja FD** — pendiente decisión del cliente (soft delete ERP vs delete permanente FD).

### Contexto técnico importante:

- Contrato de respuesta FD vigente: `{ data: entidad, sync: { ok, ... } }` (ver sección 2, punto 2)
- `FDContactoSyncService` usa método privado `#sync()` — no lanza excepción, siempre devuelve `{ ok: bool }`
- `useGestionEntidad` es el hook estándar para vistas de listado paginado con filtros
- Path aliases activos: `baseUrl: "src"` — usar imports absolutos para cross-feature/globales
- Servicios legacy en `Services/` (estadoObra, tipoFacturable, tipoObra): pendientes de eliminar
