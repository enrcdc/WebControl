# Deuda Tecnica y Roadmap — WebControl ERP

Deuda tecnica identificada y plan de futuras iteraciones. Los items resueltos se mueven a `PROGRESO.md`.

---

## 1. Deuda tecnica pendiente

### Punto 5 — `codigo_usuario_baja` hardcoded

**Problema:** El campo `codigo_usuario_baja` esta hardcodeado a `67` en al menos 6 modelos al hacer soft delete:
- `factura-obra.model.js`
- `factura-compra.model.js`
- `pedido-obra.model.js`
- `movimiento-almacen.model.js`
- `almacen.model.js`
- `obra.model.js`

**Solucion futura:** Cuando el middleware `auth` este activo, `req.user.codigoUsuario` estara disponible. Los servicios recibiran el ID del usuario como parametro.

**Dependencia:** Requiere que el frontend implemente JWT y que el middleware `auth` se active.

---

### Punto 6 — Naming inconsistente en `contacto.mapper.js`

**Problema:** El mapper de FD usa `nombre_contacto ?? nombre` para obtener el nombre del contacto. El modelo devuelve el campo con dos nombres distintos segun el contexto.

**Solucion futura:** Unificar el alias del campo en `contacto.model.js`. Actualizar `contacto.mapper.js`.

---

### Punto 7 — Patron `GET /tipo-gasto` + `POST /tipo-gasto/filtrar` no documentado

**Problema:** tipoGasto tiene dos endpoints de listado. El frontend usa siempre `filtrar()`, nunca `getAll()` directamente.

**Solucion futura:** Documentar en convenciones que cuando una entidad tiene filtros de array, el frontend siempre llama a `POST /filtrar`.

---

### Punto 10 — `DEFAULT_LIMIT = 200` en paginacion

**Problema:** `pagination.utils.js` tiene `DEFAULT_LIMIT = 200`. Para entidades con muchos registros puede ser excesivo.

**Solucion futura:** Revisar limite por entidad. Opciones: reducir global a 50, permitir limite por servicio, o confiar en que el frontend controla el limite enviado.

**Nota:** El frontend ya establece su propio `defaultLimit` via `useGestionEntidad` (20-50 segun feature).

---

### Punto 11 — CRUD incompleto en entidades legacy

| Entidad | Estado actual | Pendiente |
|---------|--------------|-----------|
| edificio (complejo) | getAll + getById | create, update, softDelete |
| gasto | getAll + getById | create, update, softDelete |
| responsable | getSubordinados | create, update, softDelete |
| usuario | getAll + login | create, update, softDelete |
| hora | CRUD completo | Revisar TODOs en el modelo |

---

### Migracion MD5 → bcrypt

Las contrasenas estan almacenadas como hashes MD5 (inseguro). Estrategia elegida: **migracion progresiva en login** (rehashear a bcrypt cuando el usuario hace login).

**Cambios necesarios en BD:**
- Anadir columna `password_migrated` (BOOLEAN, default FALSE) a `usuarios`

**Cuando:** Cuando se trabaje en la autenticacion del frontend. No bloquea funcionalidad actual.

**Dependencia:** `bcrypt` ya instalado en `package.json`.

---

### Seguridad pre-produccion (Backend Paso 6)

- `helmet` para headers de seguridad HTTP
- `express-rate-limit` para proteccion contra abuso
- Configuracion explicita de CORS (origenes permitidos)
- Configuracion de `config/env.js` para modos desarrollo/test/produccion

**Cuando:** Cuando la aplicacion este lista para despliegue.

---

### Servicios legacy en `Services/`

Quedan 4 servicios legacy: estadoObra, tipoFacturable, tipoObra (+ contacto, ya eliminable).

- El servicio de contacto puede eliminarse ahora que existe `features/contactos/services/contacto.service.js`
- Los demas se eliminaran cuando los features que los usan se migren a estructura definitiva

---

### Convenio de IDs de entidad

TODO en `empresa.service.js`: establecer convenio para acceder a IDs de entidades (`id` vs `id_entidad`).

---

### Baja FD

TODO en `FDContactoSyncService.js`: Pendiente decision del cliente sobre como compatibilizar soft delete ERP con delete permanente FD.

---

### Metodos `getByX` legacy en backend

Se mantienen temporalmente mientras el frontend los use. Marcados con `// TODO: Eliminar cuando el frontend use getAll(filters)`.

Excepcion: `getByUsername` (autenticacion) se mantiene permanentemente.

---

### Endpoint `POST /api/usuario/login` legacy

Se mantiene mientras el frontend lo use. Eliminar cuando migre a `POST /api/auth/login`.

---

### Propagacion pendiente de PaginationControl

| Feature | Estado |
|---------|--------|
| GestionFacturas.jsx | COMPLETADO (24/02/2026) |
| HorasList.js | Pendiente (modo completo, ~L892-918) |
| GestionPedidos.jsx | COMPLETADO (ya usaba server-side) |
| GestionCompras.js | Pendiente (modo simple) |
| GastosList.js | Pendiente (migrar cuando se refactorice su paginacion) |

---

### Propagacion pendiente de SearchableSelect

| Componente | Estado |
|------------|--------|
| `ModalCompra.jsx` (obras) | Pendiente |
| `InformacionGeneral.jsx` (obras) | Pendiente |
| `ModalContacto.jsx` (obras) | Pendiente (2 instancias) |

---

## 2. Roadmap — Iteracion FD-2: Importacion de facturas desde FacturaDirecta

### Contexto de negocio

Control Cube gestiona sus facturas en FacturaDirecta, no en el ERP. El ERP actua como sistema de gestion de proyectos/obras. Objetivo: importar las facturas creadas en FD al ERP para asociarlas a obras y pedidos.

**Operaciones sobre facturas desde el ERP: solo GET.** No hay creacion, edicion ni eliminacion desde el ERP.

**Tipos de factura:**
- Facturas de obras (prioridad, esta iteracion): endpoint FD `/sales-invoices`
- Facturas de compras (iteracion posterior): endpoint FD diferente

### Estructura de pedidos

```
Numero de pedido: 4508338748
Posiciones:
  4508338748-10   (primera posicion)
  4508338748-20   (segunda posicion)
  ...
```

Las posiciones empiezan en `-10` e incrementan de 10 en 10. Una factura puede cubrir todas o algunas posiciones.

### Limitacion de FD

FD no permite adjuntar metadatos de obra ni pedido. La informacion se codifica en las lineas de factura:

| Campo FD | Valor | Descripcion |
|----------|-------|-------------|
| Articulo | `SAT` | Identificador de linea de servicio |
| Descripcion | `NPos. 000010` | Numero de posicion del pedido |
| Notas | `4508338748` | Numero de pedido |

### Flujo de importacion (6 pasos)

```
[1] Usuario pulsa "Importar facturas desde FacturaDirecta"
[2] ERP consulta FD (GET /facturas), filtra las que aun no estan en DB local
    → Las nuevas se guardan con estado "sin proyecto asignado"
[3] Facturas importadas aparecen en GestionFacturas (estado pendiente)
[4] Usuario accede al detalle y asigna obra/proyecto
[5] ERP muestra pedidos asociados a la obra
    → Usuario selecciona pedidos y posiciones que cubre la factura
[6] ERP actualiza el registro de la factura
```

### Decisiones de diseno

- **D1:** Asignacion manual por ahora (auto-parsing revisable si FD garantiza estructura)
- **D2:** Usar tabla `ecofactura` como base, anadir campos FD
- **D3:** Criterio de deduplicacion pendiente (fecha vs fd_invoice_id)
- **D4:** Refactorizar lo minimo necesario de pedidos/facturas para FD-2
- **D5:** Primero facturas de venta (obras), compras en iteracion posterior

### Pasos propuestos

**Paso 1 — Refactorizar features `pedidos` y `facturas`:**
- Adaptar GestionPedidos, DetallePedido, GestionFacturas, DetalleFactura a estructura definitiva
- Eliminar NuevoFactura / actualizar para que no permitan crear
- Aplicar useGestionEntidad, useFormulario, filtros y paginacion server-side

**Paso 2 — Infraestructura FD para facturas de obras:**
- Nueva subcarpeta `integrations/FacturaDirecta/Facturas/`
- Nuevo endpoint: `POST /facturaObra/importar`
- Migracion DB si necesaria (fd_invoice_id, estado_asignacion)

---

## 3. Migracion de base de datos (proxima)

**Tipo:** Migracion de esquema + migracion de infraestructura.
**Estado:** Planificada. Pendiente de ejecutar.
**Impacto esperado en codigo:** Minimo.

**Accion requerida al ejecutar:**
- Revisar nombres de tablas/columnas en modelos Knex si cambian
- Revisar scripts SQL en `BACK-END/src/migrations/`
- Revisar variables de entorno de conexion

---

## 4. Features pendientes de estructura definitiva

| Feature | Estado actual | Prioridad |
|---------|-------------|-----------|
| pedidos | **Estructura definitiva COMPLETADA** (24/02/2026) | — |
| facturas | **Estructura definitiva COMPLETADA** (24/02/2026, solo lectura DN-1) | — |
| compras | Migrado, sin estructura definitiva | Media |
| gastos | Monolitico (574 lineas), necesita split | Media |
| horas | 3 componentes (962+209+132 lineas), necesita hooks | Media |
| rentabilidad | Skeleton con datos demo | Baja |
| obras | 14 hooks, 3 niveles nesting, aplanar + server-side | Baja (el mas complejo, al final) |
| almacen | Service corregido, falta estructura definitiva | Baja |
