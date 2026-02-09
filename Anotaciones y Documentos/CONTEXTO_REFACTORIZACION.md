# Contexto de Refactorización - Backend

Documento complementario al `PLAN_REORGANIZACION.md`.
Recoge todas las decisiones y especificaciones tomadas durante el progreso de refactorización.

**Última actualización:** 09/02/2026
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

## 5. Patrón `buscarConFiltros`

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

### Completados

| Entidad | Service | Controller | Routes | Notas |
|---------|---------|------------|--------|-------|
| obra | ✅ | ✅ | ✅ | Servicio completo con enrichment, alertas, estadísticas, transición de estados |
| empresa | ✅ | ✅ | ✅ | Entidad sencilla (getAll, getByNombre, buscarConFiltros) |
| edificio | ✅ | ✅ | ✅ | Misma estructura que empresa |
| contacto | ✅ | ✅ | ✅ | getAll, getByEmpresa, create, buscarConFiltros. Filtro por empresa usa nombre (no ID) |
| gasto | ✅ | ✅ | ✅ | buscarConFiltros requiere campo `tipo` obligatorio: "por-validar", "por-pagar", "por-obras" |
| factura-compra | ✅ | ✅ | ✅ | CRUD completo, soft delete, _getFacturaOrFail helper. Renombrada de "factura" |
| hora | ✅ | ✅ | ✅ | Bug detectado: modelo create inserta en tabla `obras` (código copiado sin adaptar) |

### Pendientes

| Entidad | Notas |
|---------|-------|
| pedido-obra | Renombrada de "eco-pedido" |
| factura-obra | Renombrada de "eco-factura" |
| almacen | |
| movimiento-almacen | |
| relacion-obra | |
| rentabilidad | |
| responsable | |
| estado-obra | |
| tipo-facturable | |
| tipo-obra | |
| usuario | |

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
