# 📘 Respuestas a Dudas sobre Servicios

## Resumen de Cambios

Has identificado correctamente que el servicio original estaba **sobrecargado**. Aquí están las respuestas a tus dudas con la solución implementada.

---

## 1️⃣ ERRORES PERSONALIZADOS - ¿Genéricos o Específicos?

### ✅ **RESPUESTA: Genéricos en carpeta separada**

**Tienes 100% de razón.** Los errores deben ser genéricos y reutilizables.

### Estructura Implementada:

```
BACK-END/src/
├── errors/                          ← Nueva carpeta
│   ├── AppError.js                 ← Error base
│   ├── NotFoundError.js            ← Genérico
│   ├── InvalidDataError.js         ← Genérico
│   ├── AlreadyExistsError.js       ← Genérico
│   ├── AlreadyDeletedError.js      ← Genérico
│   ├── ForbiddenError.js           ← Genérico
│   ├── UnauthorizedError.js        ← Genérico
│   └── index.js                    ← Barrel export
```

### Comparación:

#### ❌ ANTES (Específicos en el servicio):
```javascript
// En obra.service.js
export class ObraNotFoundError extends Error {
  constructor(id) {
    super(`Obra con ID ${id} no encontrada`);
    this.name = "ObraNotFoundError";
    this.statusCode = 404;
  }
}

export class InvalidObraDataError extends Error {
  constructor(message, details) {
    super(message);
    this.name = "InvalidObraDataError";
    this.statusCode = 400;
    this.details = details;
  }
}
```

**Problemas:**
- 🔴 Cada servicio duplica errores similares
- 🔴 No reutilizables
- 🔴 Sobrecarga los archivos de servicio

#### ✅ DESPUÉS (Genéricos reutilizables):
```javascript
// En errors/NotFoundError.js
export class NotFoundError extends AppError {
  constructor(entityName, identifier = null, details = null) {
    const message = identifier
      ? `${entityName} con identificador "${identifier}" no encontrado(a)`
      : `${entityName} no encontrado(a)`;

    super(message, 404, true, details);
    this.name = 'NotFoundError';
    this.entityName = entityName;
    this.identifier = identifier;
  }
}

// Uso en obra.service.js
import { NotFoundError } from '../errors/index.js';

throw new NotFoundError('Obra', id);
// Mensaje: "Obra con identificador "123" no encontrada"
```

**Ventajas:**
- ✅ Un solo error para todas las entidades
- ✅ Reutilizable en todos los servicios
- ✅ Consistencia en toda la aplicación
- ✅ Fácil de mantener

### Uso en Diferentes Servicios:

```javascript
// En obra.service.js
throw new NotFoundError('Obra', id);

// En usuario.service.js
throw new NotFoundError('Usuario', email);

// En empresa.service.js
throw new NotFoundError('Empresa', id);

// En factura.service.js
throw new NotFoundError('Factura', numeroFactura);
```

### ¿Cuándo crear errores específicos?

Solo cuando tengan **lógica única** no aplicable a otras entidades:

```javascript
// Ejemplo: Error específico de obras
export class ObraConFacturasError extends AppError {
  constructor(obraId, numFacturas) {
    super(
      `No se puede eliminar la obra ${obraId} porque tiene ${numFacturas} facturas asociadas`,
      400
    );
    this.name = 'ObraConFacturasError';
    this.obraId = obraId;
    this.numFacturas = numFacturas;
  }
}
```

Este error **sí** puede estar en el servicio porque es muy específico del dominio de obras.

---

## 2️⃣ HELPERS Y UTILIDADES - ¿Dónde ponerlos?

### ✅ **RESPUESTA: Separar en `utils/` lo genérico, dejar lo específico**

### Estructura Implementada:

```
BACK-END/src/
├── utils/                           ← Nueva carpeta
│   ├── validation.utils.js         ← Validaciones genéricas
│   ├── data-enrichment.utils.js    ← Cálculos genéricos
│   └── index.js                    ← Barrel export
├── services/
│   └── obra.service.js             ← Solo lógica específica de obras
```

### Clasificación de Helpers:

| Helper Original | ¿Genérico? | Ubicación Final |
|----------------|------------|-----------------|
| `validateId()` | ✅ Sí | `utils/validation.utils.js` |
| `validateNotEmpty()` | ✅ Sí | `utils/validation.utils.js` |
| `validateDateRange()` | ✅ Sí | `utils/validation.utils.js` |
| `calculatePercentage()` | ✅ Sí | `utils/data-enrichment.utils.js` |
| `calculateDaysBetween()` | ✅ Sí | `utils/data-enrichment.utils.js` |
| `countBy()` | ✅ Sí | `utils/data-enrichment.utils.js` |
| `sumBy()` | ✅ Sí | `utils/data-enrichment.utils.js` |
| **`_validateEstadoTransition()`** | ❌ No | **Queda en `obra.service.js`** |
| **`_calculateRentabilidad()`** | ❌ No | **Queda en `obra.service.js`** |
| **`_checkAlertas()`** | ❌ No | **Queda en `obra.service.js`** |

### Ejemplos:

#### ✅ GENÉRICO → `utils/validation.utils.js`

```javascript
/**
 * Validar que un ID sea válido
 * Reutilizable para obras, usuarios, empresas, etc.
 */
export function validateId(id, fieldName = 'id') {
  if (!id || isNaN(Number(id))) {
    throw new InvalidDataError(
      `${fieldName} inválido`,
      { field: fieldName, value: id }
    );
  }
  return Number(id);
}

// Uso en cualquier servicio:
// validateId(obraId, 'ID de obra');
// validateId(usuarioId, 'ID de usuario');
```

#### ❌ ESPECÍFICO → Queda en `obra.service.js`

```javascript
/**
 * Validar transición de estado (ESPECÍFICO de obras)
 * Cada entidad tiene su propia máquina de estados
 */
static _validateEstadoTransition(estadoActual, nuevoEstado) {
  // Transiciones válidas ESPECÍFICAS de obras
  const transicionesValidas = {
    1: [2, 3, 4], // Oferta → En curso, Parada, Rechazada
    2: [3, 5],    // En curso → Parada, Finalizada
    3: [2, 5],    // Parada → En curso, Finalizada
    4: [],        // Rechazada es final
    5: []         // Finalizada es final
  };

  // Lógica específica...
}
```

**¿Por qué queda en el servicio?**
- Las transiciones de estado son únicas de obras
- Usuarios, facturas, pedidos tendrán sus propias transiciones
- No es reutilizable genéricamente

#### ❌ ESPECÍFICO → Queda en `obra.service.js`

```javascript
/**
 * Calcular alertas (ESPECÍFICO de obras)
 * Cada entidad tiene sus propias alertas
 */
static _checkAlertas(obra) {
  const alertas = [];

  // Alerta específica de obras: horas excedidas
  if (obra.horas_previstas && obra.total_horas) {
    if (Number(obra.total_horas) > Number(obra.horas_previstas)) {
      alertas.push({
        tipo: 'HORAS_EXCEDIDAS',
        severidad: 'WARNING',
        mensaje: `Horas reales superan previstas`
      });
    }
  }

  // Más alertas específicas de obras...
  return alertas;
}
```

**¿Por qué queda en el servicio?**
- Las alertas son específicas del dominio de obras
- Facturas tendrán alertas diferentes (ej: "factura vencida")
- Usuarios tendrán alertas diferentes (ej: "contraseña expira pronto")

---

## 3️⃣ CONTROLADOR - ¿Qué debe contener?

### ✅ **RESPUESTA: SOLO manejo HTTP, nada de lógica de negocio**

### Principio: Thin Controllers, Fat Services

```
Controller (Delgado)         Service (Gordo)
- Extraer datos del request  - Validaciones de negocio
- Llamar al servicio         - Transformaciones de datos
- Formatear respuesta        - Coordinación de modelos
- Delegar errores            - Cálculos complejos
```

### Comparación:

#### ❌ ANTES (Controller con lógica):

```javascript
// controllers/ObraController.mjs
export class ObraController {
  static async getById(req, res, next) {
    try {
      const { idObra } = req.params;

      // ❌ Validación de negocio en el controller
      if (!idObra || isNaN(Number(idObra))) {
        const error = new Error("ID inválido");
        error.name = "ValidationError";
        throw error;
      }

      // ❌ Llamada directa al modelo (sin pasar por servicio)
      const obra = await ObraModel.getById({ idObra });

      // ❌ Lógica de negocio en el controller
      if (!obra) {
        const error = new Error("Obra no encontrada");
        error.name = "NotFoundError";
        throw error;
      }

      res.json({ success: true, data: obra });
    } catch (error) {
      next(error);
    }
  }
}
```

**Problemas:**
- 🔴 Controller tiene validaciones de negocio
- 🔴 Controller llama directamente al modelo
- 🔴 Difícil de testear
- 🔴 Lógica duplicada en otros controllers

#### ✅ DESPUÉS (Thin Controller):

```javascript
// controllers/obra.controller.REFACTORIZADO.js
export class ObraController {
  /**
   * GET /api/obra/:idObra
   */
  static async getById(req, res, next) {
    try {
      // 1. Extraer datos del request
      const { idObra } = req.params;

      // 2. Llamar al servicio (toda la lógica está ahí)
      const obra = await ObraService.getById(idObra);

      // 3. Formatear respuesta HTTP
      res.json({
        success: true,
        data: obra
      });
    } catch (error) {
      // 4. Delegar error al middleware
      next(error);
    }
  }
}
```

**Ventajas:**
- ✅ Controller solo maneja HTTP
- ✅ Toda la lógica en el servicio
- ✅ Fácil de testear (mock del servicio)
- ✅ Controller muy simple y consistente

### Patrón del Controller:

```javascript
static async [metodo](req, res, next) {
  try {
    // 1. EXTRAER datos (params, query, body)
    const { id } = req.params;
    const { filtro } = req.query;
    const datos = req.body;

    // 2. LLAMAR al servicio (un método, máximo dos)
    const resultado = await Service.metodo(id, datos);

    // 3. FORMATEAR respuesta
    res.status(200).json({
      success: true,
      data: resultado
    });
  } catch (error) {
    // 4. DELEGAR error
    next(error);
  }
}
```

### ¿Qué NO debe hacer el controller?

- ❌ Validar datos de negocio
- ❌ Transformar datos
- ❌ Hacer cálculos
- ❌ Llamar a múltiples modelos
- ❌ Manejar transacciones
- ❌ Lógica condicional compleja

### ¿Qué SÍ debe hacer el controller?

- ✅ Extraer datos del request
- ✅ Llamar al servicio
- ✅ Formatear respuesta (status code, JSON)
- ✅ Delegar errores al middleware
- ✅ Agregar headers si es necesario
- ✅ Manejar paginación en la respuesta

---

## 📊 COMPARACIÓN DE TAMAÑOS

### Servicio Original vs Refactorizado

| Aspecto | Original | Refactorizado | Reducción |
|---------|----------|---------------|-----------|
| **Líneas totales** | 700 | 340 | -51% |
| **Errores** | 4 clases (50 líneas) | Importados | -100% |
| **Validaciones genéricas** | En servicio | En utils/ | -80 líneas |
| **Helpers genéricos** | En servicio | En utils/ | -60 líneas |
| **Lógica específica** | 600 líneas | 340 líneas | -43% |

### Controller Original vs Refactorizado

| Aspecto | Original | Refactorizado |
|---------|----------|---------------|
| **Líneas totales** | 98 | 155 |
| **Lógica de negocio** | Sí (validaciones) | No (solo HTTP) |
| **Llamadas directas a modelo** | Sí | No (siempre via servicio) |
| **Métodos adicionales** | No | Sí (estadísticas, filtros) |

*El refactorizado tiene más líneas porque agregamos métodos adicionales (estadísticas, filtros) que no estaban en el original.

---

## 🎯 ESTRUCTURA FINAL RECOMENDADA

```
BACK-END/src/
│
├── errors/                          ← Errores genéricos
│   ├── AppError.js
│   ├── NotFoundError.js
│   ├── InvalidDataError.js
│   ├── AlreadyExistsError.js
│   ├── AlreadyDeletedError.js
│   ├── ForbiddenError.js
│   ├── UnauthorizedError.js
│   └── index.js
│
├── utils/                           ← Helpers genéricos
│   ├── validation.utils.js
│   ├── data-enrichment.utils.js
│   └── index.js
│
├── services/
│   └── obra.service.js              ← Solo lógica específica (340 líneas)
│       - CRUD methods
│       - Validaciones específicas de obras
│       - Cálculos específicos de obras
│       - Helpers específicos de obras
│
├── controllers/
│   └── obra.controller.js           ← Solo HTTP (155 líneas)
│       - Extraer datos
│       - Llamar servicio
│       - Formatear respuesta
│
├── models/
│   └── obra.model.js                ← Solo SQL
│
├── routes/
│   └── obra.routes.js               ← Solo definición de rutas
│
└── middlewares/
    └── error-handler.middleware.js  ← Manejo global de errores
```

---

## ✅ CHECKLIST: ¿Dónde va cada cosa?

### En `errors/` (Genérico):
- [x] NotFoundError
- [x] InvalidDataError
- [x] AlreadyExistsError
- [x] AlreadyDeletedError
- [x] ForbiddenError
- [x] UnauthorizedError

### En `utils/` (Genérico):
- [x] validateId
- [x] validateNotEmpty
- [x] validateAndSanitizeString
- [x] validateDateNotFuture
- [x] validateDateRange
- [x] validateNumberRange
- [x] calculateDaysBetween
- [x] calculatePercentage
- [x] calculateDeviation
- [x] groupBy, countBy, sumBy, averageBy

### En `service` (Específico):
- [x] Métodos CRUD (getAll, getById, create, update, delete)
- [x] Métodos adicionales del dominio (getEstadisticas, buscarConFiltros)
- [x] Validaciones de negocio específicas (_validateObraBusinessRules)
- [x] Máquina de estados específica (_validateEstadoTransition)
- [x] Cálculos específicos (_calculateRentabilidad, _checkAlertas)
- [x] Helpers específicos (_enrichObraData, _getObraOrFail)

### En `controller` (Solo HTTP):
- [x] Extraer datos (params, query, body)
- [x] Llamar al servicio
- [x] Formatear respuesta JSON
- [x] Delegar errores con next()

---

## 📝 RESUMEN DE RESPUESTAS

### 1. Errores Personalizados
**✅ Sí, deben ser genéricos en `errors/`**
- Crear errores reutilizables (NotFoundError, InvalidDataError, etc.)
- Solo crear específicos si tienen lógica única del dominio

### 2. Helpers y Utilidades
**✅ Separar genéricos en `utils/`, dejar específicos en servicio**
- Validaciones genéricas → `utils/validation.utils.js`
- Cálculos genéricos → `utils/data-enrichment.utils.js`
- Lógica específica del dominio → Queda en el servicio

### 3. Controlador
**✅ Solo operaciones HTTP, TODA la lógica en el servicio**
- Controller: Thin (delgado)
- Service: Fat (gordo)
- Patrón: Extraer → Llamar servicio → Formatear → Delegar error

---

## 🚀 ARCHIVOS CREADOS

1. **`BACK-END/src/errors/`** - 7 errores genéricos
2. **`BACK-END/src/utils/`** - Helpers reutilizables
3. **`obra.service.REFACTORIZADO.js`** - Servicio optimizado (340 líneas)
4. **`obra.controller.REFACTORIZADO.js`** - Controller limpio (155 líneas)
5. **`RESPUESTAS_DUDAS_SERVICIOS.md`** - Este documento

---

¿Quieres que reemplace los archivos originales con las versiones refactorizadas?
