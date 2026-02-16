# Contexto de Refactorización - Backend

Documento complementario al `PLAN_REORGANIZACION.md`.
Recoge todas las decisiones y especificaciones tomadas durante el progreso de refactorización.

**Última actualización:** 13/02/2026
**Rama de trabajo:** `refactor/project-structure`

---

## 1. Arquitectura de capas (Backend)

### Flujo de una petición

```
Request → Route → Middleware Zod (forma) → Controller → Service (negocio) → Model (solo BD)
```

### Responsabilidades de cada capa

| Capa | Responsabilidad | NO debe contener |
|------|----------------|------------------|
| **Route** | Definir endpoints, asignar middleware de validación Zod, delegar al controller | Lógica de negocio |
| **Middleware Zod** | Validar forma/estructura de datos (tipos, formatos, campos obligatorios) | Consultas a BD |
| **Controller** | Extraer datos del request (params, query, body), llamar al servicio, formatear respuesta HTTP | Lógica de negocio, validaciones, acceso a BD |
| **Service** | Validaciones de reglas de negocio (requieren BD o conocimiento del dominio) | Acceso directo a BD, manejo de HTTP |
| **Model** | Ejecutar queries SQL, devolver datos | Validaciones, lógica de negocio |

---

## 2. Validaciones: Zod vs Service

### Zod (carpeta `validations/`)
- Valida **forma y estructura** de los datos
- Campos obligatorios, tipos, formatos (email, teléfono, etc.)
- Se ejecuta **antes** del controller, como middleware en la ruta
- **No necesita** base de datos

### Service
- Valida **reglas de negocio**
- ¿La entidad existe en la BD? ¿Está dada de baja?
- ¿Se permite esta transición de estado?
- ¿El contacto pertenece a esa empresa?
- **Sí necesita** consultas a BD o conocimiento del dominio

### Middleware de validación Zod (TODO por implementar)

```javascript
// middlewares/validate.js
export const validate = (schema) => (req, res, next) => {
  const result = schema.safeParse(req.body);
  if (!result.success) {
    return next(new InvalidDataError("Datos inválidos", result.error.issues));
  }
  req.body = result.data;
  next();
};

// Uso en rutas:
obraRouter.post("/", validate(createObraSchema), ObraController.create);
```

### TODO: Retirar validaciones Zod de los modelos
Actualmente algunos modelos (como `factura-compra.model.js`) tienen validaciones Zod dentro del método create/update. Estas deben migrarse al middleware de validación en las rutas.

---

## 3. Errores genéricos (carpeta `errors/`)

Clases reutilizables para cualquier entidad. Reciben el nombre de la entidad como parámetro.

| Clase | Status Code | Uso |
|-------|------------|-----|
| `AppError` | 500 | Clase base |
| `NotFoundError` | 404 | Entidad no encontrada |
| `InvalidDataError` | 400 | Datos inválidos (negocio) |
| `AlreadyExistsError` | 409 | Entidad duplicada |
| `AlreadyDeletedError` | 410 | Entidad ya dada de baja |
| `ForbiddenError` | 403 | Acción no permitida |
| `UnauthorizedError` | 401 | No autenticado |

---

## 4. Utilidades genéricas (carpeta `utils/`)

Funciones reutilizables por cualquier servicio. Las funciones específicas de dominio se quedan como métodos privados dentro del servicio correspondiente.

**Archivos actuales:**
- `validation.utils.js` — validateId, validateNotEmpty, validateAndSanitizeString, validateDateNotFuture, validateDateRange, validateNumberRange
- `data-enrichment.utils.js` — calculateDaysBetween, calculatePercentage, calculateDeviation, countBy, sumBy
- `pagination.utils.js` — applyPagination (DEFAULT_LIMIT=200, clona query para COUNT, aplica limit/offset)

---

## 5. Patrón `buscarConFiltros` (DEPRECATED — ver sección 11)

> **NOTA:** Este patrón fue la primera iteración. La segunda iteración (sección 11) lo reemplaza
> por filtrado dinámico en SQL con Knex.js, que es más eficiente.

Cada servicio incluye un método genérico `buscarConFiltros(filtros)` que:
- Recibe un objeto con los filtros a aplicar
- Aplica filtros soportados mediante `if` encadenados
- Escala fácilmente añadiendo un `if` más por cada filtro nuevo
- **Los filtros de texto** usan `.toLowerCase().includes()`, nunca `===`
- El endpoint es **`POST /filtrar`** (no GET)
- Los métodos de búsqueda específicos (`getByNombre`, `getByEmpresa`, etc.) se mantienen temporalmente mientras el frontend los use, con un TODO para retirarlos

---

## 6. Rutas: Orden de definición

**Las rutas específicas siempre van ANTES que las parametrizadas.** Express evalúa en orden, y una ruta como `/:id` capturaría `/filtrar` si va primero.

```javascript
// CORRECTO
router.get("/", Controller.getAll);
router.post("/filtrar", Controller.buscarConFiltros);
router.get("/buscar/nombre", Controller.getByNombre);
router.get("/:id", Controller.getById);        // Parametrizada AL FINAL
router.post("/", Controller.create);
router.patch("/:id", Controller.update);
router.delete("/:id", Controller.delete);
```

---

## 7. Progreso de servicios

### Iteración 1: Capa de servicios — COMPLETADA ✅

| Entidad | Service | Controller | Routes | Notas |
|---------|---------|------------|--------|-------|
| obra | ✅ | ✅ | ✅ | Servicio completo con enrichment, alertas, estadísticas, transición de estados |
| empresa | ✅ | ✅ | ✅ | Entidad sencilla (getAll, getByNombre, buscarConFiltros) |
| edificio | ✅ | ✅ | ✅ | Misma estructura que empresa |
| contacto | ✅ | ✅ | ✅ | getAll, getByEmpresa, create, buscarConFiltros. Filtro por empresa usa nombre (no ID) |
| gasto | ✅ | ✅ | ✅ | buscarConFiltros requiere campo `tipo` obligatorio: "por-validar", "por-pagar", "por-obras" |
| factura-compra | ✅ | ✅ | ✅ | CRUD completo, soft delete, _getFacturaOrFail helper. Renombrada de "factura" |
| hora | ✅ | ✅ | ✅ | Bug corregido: create ya inserta en `horasobra`. Filtros y TODOs actualizados por el desarrollador |
| pedido-obra | ✅ | ✅ | ✅ | CRUD completo, soft delete, _getPedidoOrFail helper. PUT→PATCH |
| factura-obra | ✅ | ✅ | ✅ | CRUD completo, soft delete, _getFacturaOrFail helper. JOIN con ecopedido en getByObras. PUT→PATCH |
| almacen | ✅ | ✅ | ✅ | CRUD completo, soft delete, _getProductoOrFail. Zod retirado del modelo. Bug corregido: getById devolvía array. Bug corregido: ruta parametrizada antes de específica. PUT→PATCH |
| movimiento-almacen | ✅ | ✅ | ✅ | CRUD completo, soft delete, _getMovimientoOrFail. Clase renombrada a singular. PUT→PATCH |
| relacion-obra | ✅ | ✅ | ✅ | Relaciones padre-hijo entre obras. Bug corregido: getObrasHijas params extra. Model: operaciones atómicas separadas. Validación de auto-referencia |
| rentabilidad | ✅ | ✅ | ✅ | Solo lectura (getByIdObra). Subqueries para gastos_almacen y gastos_compras |
| responsable | ✅ | ✅ | ✅ | Solo lectura (getSubordinados). Clase renombrada a singular |
| estado-obra | ✅ | ✅ | ✅ | Solo lectura (getAll). Tabla catálogo |
| tipo-facturable | ✅ | ✅ | ✅ | Solo lectura (getAll). Tabla catálogo |
| tipo-obra | ✅ | ✅ | ✅ | Solo lectura (getAll). Tabla catálogo |
| usuario | ✅ | ✅ | ✅ | getAll + login. Lógica de autenticación movida de model a service |

### Iteración 2: Migración a Knex.js + filtrado dinámico en SQL — COMPLETADA ✅

Ver sección 11.

---

## 8. Renombramientos realizados

| Nombre anterior | Nombre actual | Razón |
|----------------|---------------|-------|
| eco-factura | factura-obra | Distinguir facturas asociadas a obras |
| eco-pedido | pedido-obra | Distinguir pedidos asociados a obras |
| factura | factura-compra | Distinguir facturas asociadas a compras |

---

## 9. Barrel exports implementados

- `errors/index.js` — Exporta todas las clases de error
- `utils/index.js` — Exporta todas las utilidades
- `routes/index.js` — Centraliza todas las rutas (TODO: actualizar con renombramientos)

---

## 10. Notas adicionales

- **Soft delete**: Las entidades que lo soportan usan `fecha_baja` en lugar de eliminación física
- **Controladores thin**: Solo manejan HTTP. Sin lógica de negocio, sin conversiones de tipo, sin validaciones
- **Los `console.log` de debug** se eliminan al refactorizar los controladores
- **Método `_getEntityOrFail`**: Patrón privado reutilizado en servicios con CRUD para verificar existencia + soft delete. Siempre usa `Model.getById()`, nunca `Model.getAll({id})`
- **`getAll` siempre devuelve array**: El método `getAll(filters)` debe devolver siempre un array, nunca un objeto suelto. No usar `.first()` dentro de `getAll`, ni siquiera como optimización de early return por ID. Para obtener un registro único, usar `getById`
- **`getById` en modelos**: Método estándar que devuelve un único objeto (o null). Usado por `_getEntityOrFail`. Todas las entidades con CRUD deben tenerlo
- **Delete en batch (Opción C)**: Las operaciones de borrado que reciben un array de IDs usan el patrón de éxito parcial con reporte. Clasifican cada ID en `{ eliminados, yaEliminados, noEncontrados }`, ejecutan el delete solo sobre los activos, y devuelven el objeto completo para que el frontend informe al usuario

---

## 11. Iteración 2: Migración a Knex.js + filtrado dinámico en SQL

### Problema detectado en la iteración 1

El patrón `buscarConFiltros` de la primera iteración usaba `getAll()` + `Array.filter()` en JavaScript:

```javascript
// ❌ INEFICIENTE — Iteración 1
static async buscarConFiltros(filtros) {
  let datos = await Model.getAll();  // Trae TODOS los registros a Node.js
  if (filtros.nombre) {
    datos = datos.filter(d => d.nombre?.toLowerCase().includes(filtros.nombre.toLowerCase()));
  }
  return datos;
}
```

**Problemas:**
- Gran tráfico de red entre Node.js y la base de datos
- Alto consumo de memoria en el servidor Node.js
- Ineficiente: las BBDD están diseñadas específicamente para buscar y filtrar mediante índices

### Solución: Filtrado dinámico en SQL con Knex.js

Los filtros deben aplicarse **siempre en la base de datos**, no en JavaScript. Se usa un único método `getAll(filters = {})` que construye la query dinámicamente:

```javascript
// ✅ EFICIENTE — Iteración 2
static async getAll(filters = {}) {
  const query = knex("tabla").select("*");

  if (filters.nombre) {
    query.where("nombre", "like", `%${filters.nombre}%`);
  }
  if (filters.idObra) {
    query.where("id_obra", filters.idObra);
  }

  return query;
}
```

### Query builder elegido: Knex.js

- Se integra nativamente con Node.js y MySQL
- Construye queries SQL de forma segura (previene SQL injection)
- Compatible con el patrón de filtrado dinámico
- No es un ORM completo: permite seguir escribiendo SQL cuando sea necesario

### Estrategia de endpoints para filtrado

| Tipo de filtro | Método HTTP | Ejemplo |
|---------------|-------------|---------|
| Filtros simples (texto, números) | `GET /` con query params | `GET /usuarios?nombre=Juan` |
| Filtros complejos (arrays de IDs) | `POST /filtrar` | `POST /gastos/filtrar` con `{ idsObra: [1,2,3] }` |

- `GET /` sin query params → devuelve todos los registros
- `GET /` con query params → devuelve filtrado
- El controller extrae filtros de `req.query` y los pasa al servicio/modelo
- `POST /filtrar` se mantiene solo para entidades con filtros complejos (arrays de IDs)

### Métodos `getByX` existentes

- Se mantienen temporalmente mientras el frontend los use
- Marcados con `// TODO: Eliminar cuando el frontend use getAll(filters)`
- Excepción: lookups internos como `getByUsername` (autenticación) se mantienen porque seleccionan campos diferentes (ej: password)

### Cambios necesarios

1. **Instalar Knex.js** y el driver MySQL correspondiente — ✅ Completado
2. **Configuración**: `config/database.js` exporta `db` (Knex) y `pool` (legacy) — ✅ Completado
3. **Modelos**: Migrar de `pool.query()` a `knex()` query builder con `getAll(filters = {})`
4. **Servicios**: `getAll(filters)` pasa los filtros al modelo, se elimina lógica de filtrado en JS
5. **Controllers**: `getAll` extrae filtros de `req.query`
6. **Eliminar** métodos `getByX` específicos cuando se migre el frontend

### Progreso de migración a Knex.js

| Entidad | Knex | Filtrado SQL | Notas |
|---------|------|-------------|-------|
| estado-obra | ✅ | N/A | Tabla catálogo, solo getAll sin filtros |
| tipo-facturable | ✅ | N/A | Tabla catálogo, solo getAll sin filtros |
| tipo-obra | ✅ | N/A | Tabla catálogo, solo getAll sin filtros |
| responsable | ✅ | N/A | Solo getSubordinadosByManager |
| usuario | ✅ | ✅ | getAll(filters) con nombre, apellido, codigoFirma. getByUsername se mantiene (auth). Controller usa req.query |
| rentabilidad | ✅ | N/A | Solo getByIdObra. Subqueries con db.raw() |
| empresa | ✅ | ✅ | getAll(filters) con idEmpresa, nombre. JSDoc añadido |
| edificio | ✅ | ✅ | getAll(filters) con idEdificio, nombre. JSDoc añadido |
| contacto | ✅ | ✅ | getAll(filters) con idContacto, nombre, apellido, empresa, idEmpresa. JOINs migrados a Knex. create y asignarComplejos migrados. JSDoc añadido |
| gasto | ✅ | ✅ | getAll(filters) con idGasto, tipo (por-validar/por-pagar), idsObra (whereIn), codigoObra, descripcionObra, tipoGasto, usuarioAlta. POST /filtrar para arrays. JSDoc añadido |
| obra | ✅ | ✅ | CRUD completo. getAll(filters) con 15 filtros: idObra, empresa, complejo (like), estados, tipos (whereIn arrays), enSeguimiento, ofertada, conPedidos, conFacturas, conHoras, conGastos, mostrarBaja (booleanos), fechaDesde/fechaHasta, relacionEntreObras (enum 6 opciones). 5 subqueries Knex para agregaciones. conAlertas se mantiene en JS (depende de enrichment). update usa fieldMap en vez de switch/case. Zod se mantiene en modelo con TODO. JSDoc añadido |
| factura-compra | ✅ | ✅ | CRUD completo. getAll(filters) con idFactura, idObra, codigoObra, concepto, numFactura, mostrarBaja. JOINs con obras y facturascompras. Zod se mantiene en modelo con TODO. JSDoc añadido |
| hora | ✅ | ✅ | getAll(filters) con idHora, idsObra (whereIn), usuario, manager, estadosObra (whereIn), tiposObra (whereIn), tareas (whereIn), validadas, fechaDesde, fechaHasta. Unifica getAllHoras + getByObra + getHorasBySubordinados. POST /filtrar para arrays. JSDoc añadido |
| pedido-obra | ✅ | ✅ | CRUD completo. getAll(filters) con idPedido, idsObra (whereIn), codigoPedido, posicion, observaciones, mostrarBaja. POST /filtrar para arrays. JSDoc añadido |
| factura-obra | ✅ | ✅ | CRUD completo. getAll(filters) con idFactura, idsObra (whereIn), codigoFactura, conceptoLinea, conceptoFactura, codigoPedido, mostrarBaja. JOIN con ecopedido. POST /filtrar para arrays. JSDoc añadido |
| almacen | ✅ | ✅ | CRUD completo. getAll(filters) con idProducto, descripcion, codigo, proveedor, familia, unidades, marca (like sobre JOINs), porDebajoMinimo/porEncimaMaximo (whereRaw comparando columnas), mostrarBaja. Sin POST /filtrar (no tiene arrays). JSDoc añadido |
| movimiento-almacen | ✅ | ✅ | CRUD completo. getAll(filters) con idMovimiento, idObra, idReferencia, tipoMovimiento, conceptoMovimiento (like sobre JOINs), mostrarBaja. 5 LEFT JOINs. Sin POST /filtrar (no tiene arrays). JSDoc añadido |
| relacion-obra | ✅ | N/A | No aplica getAll(filters) — siempre se consulta por idObra específico (padre/hijas). Migración directa de pool.query() a Knex. Bulk insert con db().insert([...]) |

---

## 12. Especificaciones para getAll(filters) en modelos

- **JSDoc obligatorio**: Cada método `getAll(filters = {})` debe documentar con JSDoc los filtros soportados y sus tipos
- **Filtro por ID siempre incluido**: Todas las entidades deben soportar filtro por su ID como filtro básico indispensable
- **Propagación futura**: Los JSDoc deberán propagarse a los servicios del frontend cuando se aborde esa fase

Ejemplo de referencia:
```javascript
/**
 * getAll recupera todos los registros según los filtros proporcionados.
 * Si no se especifica un filtro, devuelve todos los registros.
 * @param {Object} filters - El objeto de filtros.
 * @param {number} [filters.idEntidad] - filtrar por id
 * @param {string} [filters.nombre] - filtrar por nombre
 * @returns {Promise<Array>} Array de resultados de filtrado
 */
static async getAll(filters = {}) { ... }
```

---

## 13. Directriz para Claude Code: Decisiones de diseño

**Cada vez que durante el proceso de refactorización surja una situación que requiera una decisión de diseño**, Claude Code deberá:

1. **Identificar** que se trata de una decisión de diseño (no una simple implementación)
2. **Ofrecer recomendaciones** sobre cuáles son las mejores opciones, siguiendo los **estándares de la industria** para el desarrollo full-stack con React, Express, Node y SQL
3. **Explicar los trade-offs** de cada opción (rendimiento, mantenibilidad, escalabilidad, complejidad)
4. **Recomendar una opción**, justificando por qué es la más adecuada para el contexto del proyecto
5. **Esperar confirmación** del desarrollador antes de implementar

Esto evita iteraciones innecesarias sobre refactorizaciones ya realizadas.

---

## 14. TODO: Migración de contraseñas MD5 a bcrypt

### Contexto

Las contraseñas de la tabla `usuarios` están almacenadas como hashes MD5. MD5 es inseguro para contraseñas: es extremadamente rápido (facilita fuerza bruta), no usa salt (contraseñas iguales producen el mismo hash) y está criptográficamente roto.

bcrypt es el estándar actual: es deliberadamente lento (configurable), genera un salt aleatorio por cada contraseña, y dos usuarios con la misma contraseña producen hashes distintos.

### Estrategia elegida: Migración progresiva en login

No se pueden "convertir" hashes MD5 a bcrypt (los hashes son funciones de un solo sentido). La migración progresiva rehashea cada contraseña cuando el usuario hace login, sin necesidad de resetear contraseñas ni conocerlas de antemano.

**Cambios necesarios en la BD:**
- Añadir columna `password_migrated` (BOOLEAN, default FALSE) a la tabla `usuarios`

**Lógica en `usuario.service.js`:**

```javascript
static async login(username, password) {
  const usuario = await UsuarioModel.getByUsername({ username });
  if (!usuario) throw new UnauthorizedError("Credenciales inválidas");

  if (!usuario.password_migrated) {
    // Usuario aún con MD5 — verificar con MD5
    const md5Hash = crypto.createHash("md5").update(password).digest("hex");
    if (md5Hash !== usuario.password) {
      throw new UnauthorizedError("Credenciales inválidas");
    }

    // Credenciales correctas — migrar a bcrypt
    const bcryptHash = await bcrypt.hash(password, 12);
    await UsuarioModel.updatePassword(usuario.codigo_usuario, bcryptHash);
    // A partir de aquí, este usuario se verifica con bcrypt
  } else {
    // Usuario ya migrado — verificar con bcrypt
    const match = await bcrypt.compare(password, usuario.password);
    if (!match) throw new UnauthorizedError("Credenciales inválidas");
  }

  const { password: _, password_migrated: __, ...usuarioSinPassword } = usuario;
  return usuarioSinPassword;
}
```

**Modelo — nuevo método:**

```javascript
static async updatePassword(codigoUsuario, bcryptHash) {
  await db("usuarios")
    .where("codigo_usuario", codigoUsuario)
    .update({ password: bcryptHash, password_migrated: true });
}
```

### Cuándo implementar

Esta migración se abordará cuando se trabaje en la autenticación del frontend. No bloquea ninguna funcionalidad actual — el JWT ya funciona con la verificación MD5 existente. La dependencia `bcrypt` ya está instalada en `package.json`.

---

## 15. Iteración 3: Consolidación y hardening del backend

### Objetivo

Completar la estructura del backend antes de abordar el frontend. Tras la Iteración 1 (capa de servicios) y la Iteración 2 (Knex.js + filtrado SQL), quedan tareas de limpieza, centralización de errores, validación en rutas, paginación y seguridad.

### Auditoría del estado actual del backend

Se auditaron todas las carpetas del proyecto backend. Las capas `models/`, `services/`, `controllers/` y `routes/` ya están refactorizadas. Los hallazgos pendientes son:

| Carpeta/Archivo | Problema | Acción |
|-----------------|----------|--------|
| `config/database.js` | Todavía exporta `pool` (mysql2/promise) con TODO para eliminarlo | Eliminar `pool` y la dependencia `mysql2` |
| `config/constants.js` | Archivo vacío | Eliminar |
| `config/env.js` | TODO para modos test/producción | Pendiente para pre-producción |
| `middlewares/ErrorHandler.js` | No maneja todos los tipos de error; registrado individualmente en cada router en vez de una sola vez en `app.js` | Centralizar y ampliar |
| `validations/obrasValidator.js` | Typo "objetc" en línea 148 | Corregir |
| `validations/ValidationError.js` | Clase de error duplicada; ya existe `InvalidDataError` en `errors/` | Consolidar en `errors/` |
| `integrations/FacturaDirecta/FacturasVenta/FacturasVentaService.js` | Archivo vacío | Eliminar |
| `integrations/FacturaDirecta/MetodosPago/MetodosPagoService.js` | Comentario copy-paste incorrecto | Corregir |
| `routes/index.js` | Typo "aplicaciOn" | Corregir |

### Plan de ejecución

#### Paso 1: Limpieza general — COMPLETADO ✅

**Qué se hizo:**
- ✅ Eliminado export de `pool` e `import mysql` en `config/database.js` (la dependencia `mysql2` se mantiene en `package.json` porque Knex la usa como driver)
- ✅ Eliminado `config/constants.js` (vacío)
- ✅ Eliminado `integrations/FacturaDirecta/FacturasVenta/FacturasVentaService.js` (vacío) y la carpeta `FacturasVenta/` (quedó vacía)
- ✅ Corregido typo `objetc` → `object` en `validations/obrasValidator.js:148`
- ✅ Corregido typo `aplicaciOn` → `aplicación` en `routes/index.js:4`
- ✅ Corregido comentario copy-paste `Eliminar contacto` → `Eliminar método de pago` en `MetodosPagoService.js:33`
- ⏭️ `ValidationError` NO se consolida ahora — se eliminará en el Paso 3 cuando las validaciones Zod salgan de los modelos

#### Paso 2: ErrorHandler centralizado — COMPLETADO ✅

**Qué se hizo:**
- ✅ Reescrito `middlewares/ErrorHandler.js`: usa `instanceof AppError` como rama principal (maneja automáticamente todos los errores que hereden de `AppError` con su `statusCode`), ramas específicas para `ValidationError` (Zod) y `EmptyUpdateError`, y fallback 500 con mensaje seguro
- ✅ Registrado una sola vez en `app.js` después de todas las rutas: `app.use(errorHandler)`
- ✅ Eliminado `import { errorHandler }` y `.use(errorHandler)` de los 18 archivos de rutas
- ✅ Formato de respuesta consistente: `{ success, message, details }`

#### Paso 3: Middleware de validación Zod en rutas — COMPLETADO ✅

**Qué se hizo:**
- ✅ Creado `middlewares/validate.js` con la función `validate(schema)` — usa `InvalidDataError` (hereda de `AppError`, manejado automáticamente por el ErrorHandler)
- ✅ Exportados schemas `createObraSchema`/`updateObraSchema` desde `obrasValidator.js` y `createFacturaSchema`/`updateFacturaSchema` desde `facturasValidator.js`
- ✅ Aplicado middleware en rutas: `validate(createSchema)` en POST, `validate(updateSchema)` en PATCH para obra y factura-compra
- ✅ Retirado Zod de `obra.model.js`: eliminados imports de validator y ValidationError, create/update reciben datos ya validados
- ✅ Retirado Zod de `factura-compra.model.js`: misma limpieza
- ✅ Eliminado `validations/ValidationError.js` (ya no se importa en ningún sitio)
- ⏭️ `comprasValidator.js` se conserva para uso futuro (no se importa en ningún sitio actualmente)
- ✅ `productoValidator.js` adaptado al nuevo patrón: exporta `createProductoSchema`/`updateProductoSchema`
- ✅ Creados schemas Zod para el resto de entidades con CRUD:
  - `empresaValidator.js` → `createEmpresaSchema` (solo POST, no tiene PATCH)
  - `contactoValidator.js` → `createContactoSchema` (solo POST, no tiene PATCH)
  - `horaValidator.js` → `createHoraSchema` (solo POST, no tiene PATCH)
  - `pedidoObraValidator.js` → `createPedidoObraSchema` + `updatePedidoObraSchema` (update omite `idObra`)
  - `facturaObraValidator.js` → `createFacturaObraSchema` + `updateFacturaObraSchema` (update omite `idObra`)
  - `movimientoAlmacenValidator.js` → `createMovimientoAlmacenSchema` + `updateMovimientoAlmacenSchema` (update tiene `fechaMovimiento` en vez de `fechaAlta`)
- ✅ Aplicado `validate()` en todas las rutas POST/PATCH correspondientes
- ✅ Añadido método `create` al controller de empresa (faltaba)
- ⏭️ edificio y gasto no necesitan schema (no tienen operaciones POST/PATCH)

#### Paso 4: Paginación — COMPLETADO ✅

**Qué se hizo:**
- ✅ Creado `utils/pagination.utils.js` con función `applyPagination(query, filters)`:
  - `DEFAULT_LIMIT = 200` — se aplica cuando no se especifica `limit`
  - `limit=0` → sin paginación (devuelve todos los registros, `pagination: null`)
  - Clona la query para COUNT (`.clearSelect().clearOrder().count()`) y aplica `.limit().offset()` a la original
  - Devuelve `{ data, pagination: { total, limit, offset } }` o `{ data, pagination: null }`
- ✅ Exportado desde `utils/index.js` (barrel export)
- ✅ Aplicado en los 11 modelos con CRUD: empresa, edificio, contacto, gasto, hora, obra, pedido-obra, factura-obra, factura-compra, almacen, movimiento-almacen
  - Cambio: `return query` → `return applyPagination(query, filters)`
- ✅ Actualizados los 11 servicios para desestructurar `{ data, pagination }` del modelo y propagarlo
  - Caso especial `obra.service.js`: aplica enrichment sobre `data` antes de devolver
  - Caso especial `obra.service.js → getEstadisticas()`: usa `{ limit: 0 }` para obtener todos los registros
- ✅ Actualizados los 11 controladores: `const result = await Service.getAll(filters); res.json({ success: true, ...result })`
- ⏭️ Entidades auxiliares (estado-obra, tipo-facturable, tipo-obra, usuario, responsable, rentabilidad, relacion-obra) NO tienen paginación — son catálogos o consultas puntuales con pocos registros
- **Formato de respuesta API:**
  - Con paginación: `{ success: true, data: [...], pagination: { total, limit, offset } }`
  - Sin paginación (`limit=0`): `{ success: true, data: [...], pagination: null }`

#### Paso 5: Infraestructura de autenticación JWT — COMPLETADO ✅

**Qué se hizo:**
- ✅ Instalado `jsonwebtoken` como dependencia
- ✅ Actualizado `config/env.js`: añadido `jwt.expiresIn` (default `"8h"` — jornada laboral ERP)
- ✅ Creado `middlewares/auth.js`: verifica `Authorization: Bearer <token>`, decodifica JWT, inyecta `req.user`, lanza `UnauthorizedError` si falla
- ✅ Creado `loginWithToken()` en `usuario.service.js`: reutiliza `login()` existente, genera JWT con payload `{ codigoUsuario, nombreUsuario, codigoFirma }`
- ✅ Creado `controllers/auth.controller.js` y `routes/auth.routes.js` → `POST /api/auth/login`
- ✅ Registrado `authRouter` en `routes/index.js`
- ✅ Endpoint antiguo `POST /api/usuario/login` mantenido con TODO (el frontend aún lo usa)
- ⏭️ El middleware `auth` no se aplica a ninguna ruta todavía — se activará progresivamente cuando el frontend implemente JWT
- ⏭️ TODO: Migrar contraseñas de MD5 a bcrypt (requiere rehashear en BD)

#### Paso 6: Seguridad y hardening — TODO (pre-producción)

**Cuándo:** Cuando la aplicación esté lista para despliegue
**Qué incluye:**
- `helmet` para headers de seguridad HTTP
- `express-rate-limit` para protección contra abuso
- Configuración explícita de CORS (orígenes permitidos)
- Configuración de `config/env.js` para modos desarrollo/test/producción

### Secuencia y prioridades

```
┌─────────────────────────────────────────────────────────────────┐
│                    ANTES DEL FRONTEND                           │
│  Paso 1 (Limpieza) → Paso 2 (ErrorHandler) → Paso 3 (Zod)    │
│  → Paso 4 (Paginación)                                        │
├─────────────────────────────────────────────────────────────────┤
│                   PUENTE BACKEND ↔ FRONTEND                     │
│  Paso 5 (Auth JWT) — se implementa cuando el frontend lo       │
│  necesite para el login                                         │
├─────────────────────────────────────────────────────────────────┤
│                     PRE-PRODUCCIÓN                              │
│  Paso 6 (Seguridad) — helmet, rate limiting, CORS, env modes   │
└─────────────────────────────────────────────────────────────────┘
```

### Nota importante

Los pasos 1-4 completan el backend para empezar con el frontend. El paso 5 es un puente natural entre ambos. El paso 6 es para cuando la aplicación esté lista para despliegue. La integración con FacturaDirecta queda fuera de esta iteración y se abordará cuando sea necesario.

---

## Estado final de la refactorización del backend

**Fecha:** 13/02/2026
**Estado:** Iteración 3 completada (pasos 1-5). Paso 6 pendiente para pre-producción.

### Tareas pendientes (no bloqueantes):
- **Paso 6: Seguridad y hardening** — Implementar cuando la aplicación esté lista para despliegue (helmet, rate limiting, CORS, env modes)
- **Migración MD5 → bcrypt** — Implementar cuando se trabaje la autenticación del frontend (ver sección 14)
- **Eliminar métodos `getByX` legacy** — Cuando el frontend migre a `getAll(filters)`
- **Eliminar endpoint `POST /api/usuario/login`** — Cuando el frontend migre a `POST /api/auth/login`
- **Activar middleware `auth`** — Aplicar progresivamente a rutas cuando el frontend implemente JWT

### Nota:
La refactorización del frontend se documenta en un archivo separado: `CONTEXTO_REFACTORIZACION_FRONTEND.md`
