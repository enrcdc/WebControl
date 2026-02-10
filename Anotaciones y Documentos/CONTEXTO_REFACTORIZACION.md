# Contexto de Refactorización - Backend

Documento complementario al `PLAN_REORGANIZACION.md`.
Recoge todas las decisiones y especificaciones tomadas durante el progreso de refactorización.

**Última actualización:** 10/02/2026
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

### Iteración 2: Migración a Knex.js + filtrado dinámico en SQL — EN PROGRESO

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
- **Método `_getEntityOrFail`**: Patrón privado reutilizado en servicios con CRUD para verificar existencia + soft delete

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
| empresa | | | |
| edificio | | | |
| contacto | | | |
| obra | | | |
| gasto | | | |
| factura-compra | | | |
| hora | | | |
| pedido-obra | | | |
| factura-obra | | | |
| almacen | | | |
| movimiento-almacen | | | |
| relacion-obra | | | |
| responsable (subordinados) | | | |

---

## 12. Directriz para Claude Code: Decisiones de diseño

**Cada vez que durante el proceso de refactorización surja una situación que requiera una decisión de diseño**, Claude Code deberá:

1. **Identificar** que se trata de una decisión de diseño (no una simple implementación)
2. **Ofrecer recomendaciones** sobre cuáles son las mejores opciones, siguiendo los **estándares de la industria** para el desarrollo full-stack con React, Express, Node y SQL
3. **Explicar los trade-offs** de cada opción (rendimiento, mantenibilidad, escalabilidad, complejidad)
4. **Recomendar una opción**, justificando por qué es la más adecuada para el contexto del proyecto
5. **Esperar confirmación** del desarrollador antes de implementar

Esto evita iteraciones innecesarias sobre refactorizaciones ya realizadas.
