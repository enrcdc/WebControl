# Arquitectura del Sistema — WebControl ERP

Referencia de arquitectura del proyecto. Este documento describe la estructura y diseño del sistema, no las convenciones de código (ver `CONVENCIONES.md`).

**Rama de trabajo:** `refactor/project-structure`

---

## 1. Backend — Arquitectura de capas

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

### Estructura de carpetas del backend

```
BACK-END/src/
├── config/
│   ├── database.js          # Knex instance (exporta `db`)
│   └── env.js               # Variables de entorno centralizadas
├── controllers/              # Archivos: entidad.controller.js
├── services/                 # Archivos: entidad.service.js
├── models/                   # Archivos: entidad.model.js
├── routes/
│   ├── index.js              # Centralizador de rutas
│   └── entidad.routes.js
├── middlewares/
│   ├── auth.js               # JWT verify → req.user (creado, no activado aún)
│   ├── ErrorHandler.js       # Centralizado: AppError, ValidationError, fallback 500
│   └── validate.js           # validate(schema) → middleware Zod
├── validations/              # Schemas Zod: entidadValidator.js
├── errors/                   # AppError, NotFoundError, InvalidDataError, etc.
├── integrations/
│   └── FacturaDirecta/       # Ver sección 5
├── utils/
│   ├── validation.utils.js
│   ├── data-enrichment.utils.js
│   └── pagination.utils.js   # applyPagination(query, filters)
├── migrations/               # Scripts SQL
└── app.js
```

### Errores genéricos (`errors/`)

| Clase | Status Code | Uso |
|-------|------------|-----|
| `AppError` | 500 | Clase base |
| `NotFoundError` | 404 | Entidad no encontrada |
| `InvalidDataError` | 400 | Datos inválidos (negocio) |
| `AlreadyExistsError` | 409 | Entidad duplicada |
| `AlreadyDeletedError` | 410 | Entidad ya dada de baja |
| `ForbiddenError` | 403 | Acción no permitida |
| `UnauthorizedError` | 401 | No autenticado |

### Utilidades genéricas (`utils/`)

- `validation.utils.js` — validateId, validateNotEmpty, validateAndSanitizeString, validateDateNotFuture, validateDateRange, validateNumberRange
- `data-enrichment.utils.js` — calculateDaysBetween, calculatePercentage, calculateDeviation, countBy, sumBy
- `pagination.utils.js` — `applyPagination(query, filters)`: DEFAULT_LIMIT=200, clona query para COUNT, aplica limit/offset. Devuelve `{ data, pagination: { total, limit, offset } }` o `{ data, pagination: null }` si limit=0

### Barrel exports

- `errors/index.js` — Todas las clases de error
- `utils/index.js` — Todas las utilidades
- `routes/index.js` — Todas las rutas centralizadas

### Renombramientos de entidades

| Nombre anterior | Nombre actual | Razón |
|----------------|---------------|-------|
| eco-factura | factura-obra | Distinguir facturas asociadas a obras |
| eco-pedido | pedido-obra | Distinguir pedidos asociados a obras |
| factura | factura-compra | Distinguir facturas asociadas a compras |

---

## 2. Backend — Knex.js y filtrado dinámico en SQL

### Query builder

Knex.js se usa como query builder (no ORM). Construye queries SQL de forma segura (previene SQL injection).

### Patrón de filtrado

Los filtros se aplican **siempre en la base de datos**, nunca en JavaScript:

```javascript
static async getAll(filters = {}) {
  const query = db("tabla").select("*");
  if (filters.nombre) {
    query.where("nombre", "like", `%${filters.nombre}%`);
  }
  return applyPagination(query, filters);
}
```

### Estrategia de endpoints

| Tipo de filtro | Método HTTP | Ejemplo |
|---------------|-------------|---------|
| Filtros simples (texto, números) | `GET /` con query params | `GET /empresa?nombre=Juan` |
| Filtros complejos (arrays de IDs) | `POST /filtrar` | `POST /gastos/filtrar` con `{ idsObra: [1,2,3] }` |

### Formato de respuesta API

```javascript
// Con paginación:
{ success: true, data: [...], pagination: { total, limit, offset } }
// Sin paginación (limit=0):
{ success: true, data: [...], pagination: null }
```

---

## 3. Backend — ErrorHandler centralizado

Registrado una sola vez en `app.js` después de todas las rutas: `app.use(errorHandler)`.

- Rama principal: `instanceof AppError` (maneja automáticamente todos los errores que hereden de `AppError`)
- Rama `ValidationError` (Zod)
- Rama `EmptyUpdateError`
- Fallback 500 con mensaje seguro
- Formato: `{ success, message, details }`

### Middleware de validación Zod en rutas

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
router.post("/", validate(createSchema), Controller.create);
router.patch("/:id", validate(updateSchema), Controller.update);
```

---

## 4. Backend — Autenticación JWT

### Infraestructura (creada, no activada en rutas)

- `middlewares/auth.js`: verifica `Authorization: Bearer <token>`, decodifica JWT, inyecta `req.user`, lanza `UnauthorizedError`
- `usuario.service.js → loginWithToken()`: genera JWT con payload `{ codigoUsuario, nombreUsuario, codigoFirma }`
- `controllers/auth.controller.js` + `routes/auth.routes.js` → `POST /api/auth/login`
- `config/env.js`: `jwt.expiresIn = "8h"` (jornada laboral ERP)

### Pendiente de activación

- El middleware `auth` no se aplica a rutas todavía — se activará cuando el frontend implemente JWT completo
- Endpoint antiguo `POST /api/usuario/login` se mantiene (el frontend aún lo usa)

---

## 5. Integración FacturaDirecta

### Estructura de la capa de integración

```
BACK-END/src/integrations/FacturaDirecta/
├── client.js                          ← axios instance (baseURL + API key via config/env.js)
├── index.js                           ← barrel export
├── Contactos/
│   ├── ContactoService.js             ← CRUD contactos FD
│   ├── contacto.mapper.js             ← mapeo ERP camelCase → payload FD
│   └── FDContactoSyncService.js       ← orquestación sync (nunca lanza, siempre {ok, ...})
├── Albaranes/AlbaranesService.js
├── Presupuestos/PresupuestoService.js
├── Productos/ProductoService.js
└── MetodosPago/MetodosPagoService.js
```

### Flujo de sincronización (primera iteración)

**Disparador**: creación o actualización de empresa/proveedor **si tiene CIF**.

1. ERP persiste en DB (empresa o proveedor)
2. ERP llama a `FDContactoSyncService.syncEmpresa` / `syncProveedor`
3. Si FD tiene `fd_contact_id` → PUT, si no → POST
4. Si OK → guardar `fd_contact_id` en DB via `saveFdContactId`
5. Service devuelve `{ data, sync: { ok, fdContactId?, skipped?, error? } }`
6. Frontend muestra Alert warning si `sync.ok === false` (no bloquea el flujo)

**Sin CIF** → `sync = { ok: true, skipped: true }` → sin warning.

### Dato critico de la API de FD

El UUID del contacto creado/actualizado se devuelve en **`result.data.content.uuid`** (no en `result.data.id`).

### Mapeo empresa → FD (contacto cliente)

| ERP | FD | Notas |
|---|---|---|
| nombre | main.name | |
| cif | main.fiscalId | trigger de sync |
| email | main.email | |
| telefono1 | main.phone | |
| direccion | main.address | |
| cp | main.zipcode | |
| poblacion | main.city | |
| provincia | main.region | |
| *(hardcoded)* | main.country = "ES" | |
| *(hardcoded)* | main.currency = "EUR" | |
| *(hardcoded)* | accounts.client = "430000" | PGC |
| contactos[].nombre + apellido1 | persons[].name | |

### Mapeo proveedor → FD (contacto proveedor)

Igual que empresa, con diferencias:
- `codigo` → `main.providerCode`
- `accounts.provider = "400000"` (en lugar de client)
- `proveedor.id` → `persons[].id`

### Gestión de errores

`FDContactoSyncService` nunca lanza excepción. Siempre devuelve `{ ok: bool }`.
- Frontend: `Alert variant="warning"` dismissible si `sync.ok === false`
- Crear: al cerrar warning, navega a la lista
- Detalle: warning se cierra sin navegar

### Variables de entorno

```
FACTURADIRECTA_API_KEY=...
FACTURADIRECTA_COMPANY_ID=com_sandbox_...
```

Consumidas via `config/env.js` (no `process.env` directo).

### DB: columnas añadidas

```sql
ALTER TABLE empresas   ADD COLUMN fd_contact_id VARCHAR(50) NULL;
ALTER TABLE proveedores ADD COLUMN fd_contact_id VARCHAR(50) NULL;
```

---

## 6. Frontend — Estructura objetivo

```
FRONT-END/src/
├── App/
│   └── App.js
├── Components/
│   ├── ui/                        # Componentes reutilizables
│   │   └── index.js
│   └── layout/                    # Navbar
│       └── index.js
├── features/                      # Arquitectura feature-based
│   ├── auth/
│   ├── almacen/
│   ├── complejos/
│   ├── compras/
│   ├── contactos/
│   ├── empresas/
│   ├── facturas/
│   ├── gastos/
│   ├── horas/
│   ├── obras/
│   ├── pedidos/
│   ├── proveedores/
│   ├── rentabilidad/
│   └── tipoGasto/
├── Services/
│   └── api/
│       └── client.js              # Cliente axios centralizado
├── hooks/                         # Custom hooks globales
├── utils/                         # Utilidades globales
├── constants/                     # Constantes (endpoints, rutas)
├── styles/                        # Estilos globales
├── index.js
└── reportWebVitals.js
```

### Tecnologias

- React 18 con react-scripts (CRA)
- React Router DOM v6
- React Bootstrap + Bootstrap 5
- Axios (cliente centralizado)
- Lodash
- Zod (validaciones)

### Conexion con el backend

- **Paginacion**: `{ data, pagination: { total, limit, offset } }` — consumido via `useServerPagination`
- **JWT**: `POST /api/auth/login` → `{ token, usuario }` → `localStorage` → header `Authorization: Bearer`
- **Filtrado SQL**: `GET /entidad?filtro=valor` y `POST /entidad/filtrar` para arrays
- **Formato de respuesta**: `{ success, data, pagination? }`

---

## 7. Frontend — Estructura definitiva por feature

```
features/[nombre]/
├── components/
│   ├── Gestion[Nombre].jsx          # Vista lista
│   ├── Detalle[Nombre].jsx          # Vista detalle/edicion
│   ├── Crear[Nombre].jsx            # Formulario de creacion
│   ├── Imprimir[Nombre].jsx         # Vista impresion (si aplica)
│   ├── Form[Nombre].jsx             # Formulario compartido Crear/Detalle
│   ├── Modal[Entidad].jsx           # Modales al mismo nivel
│   └── ...
├── hooks/                            # Solo si se necesita
│   └── use[Concepto].js
├── services/
│   └── [nombre].service.js
├── utils/                            # Solo si tiene utils de dominio
│   └── [dominio].js
└── index.js                          # Barrel export
```

---

## 8. Frontend — Autenticacion (Route Guards)

### Implementacion

- `features/auth/AuthContext.js` — `AuthProvider` (React state + localStorage) + `useAuth()` → `{ user, token, isAuthenticated, login, logout }`
- `features/auth/components/PrivateRoute.js` — Comprueba `isAuthenticated`, redirige a `/login`

### Flujo

1. Acceso a `/home/*` sin token → `PrivateRoute` redirige a `/login`
2. Login exitoso → `login(token, usuario)` guarda en state + localStorage → navega a `/home/gestion-obras`
3. Token invalido → interceptor 401 de `apiClient` limpia localStorage y redirige
4. Cualquier componente: `const { user, logout } = useAuth()`
