# Contexto de Refactorización - Frontend

Documento complementario al `PLAN_REORGANIZACION.md`.
Recoge todas las decisiones y especificaciones tomadas durante el progreso de refactorización del frontend.

**Última actualización:** 16/02/2026
**Rama de trabajo:** `refactor/project-structure`

> Para decisiones y especificaciones del backend, consultar `CONTEXTO_REFACTORIZACION_BACKEND.md`

---

## 1. Estado actual del frontend

### Estructura de carpetas (antes de refactorizar)

```
FRONT-END/src/
├── Almacen/
├── App/
│   └── App.js
├── Components/
├── Compra/
├── css/
├── Empresas/
├── Factura/
├── Gastos/
├── Horas/
├── Login/
├── Modulos/
├── Navbar/
├── Obra/
├── Pedido/
├── Rentabilidad/
├── Services/
│   ├── almacenService.js
│   ├── compraService.js
│   ├── contactoService.js
│   ├── edificioService.js
│   ├── empresaService.js
│   ├── estadoObraService.js
│   ├── facturaService.js
│   ├── gastoService.js
│   ├── horaService.js
│   ├── obraService.js
│   ├── pedidoService.js
│   ├── relacionObraService.js
│   ├── rentabilidadService.js
│   ├── tipoFacturableService.js
│   ├── tipoObraService.js
│   └── usuarioService.js
├── index.js
└── reportWebVitals.js
```

### Tecnologías y dependencias

- **React 18** con react-scripts (Create React App)
- **React Router DOM v6** para enrutamiento
- **React Bootstrap** + Bootstrap 5 para UI
- **Axios** para llamadas HTTP
- **Lodash** para utilidades
- **Zod** para validaciones

### Problemas detectados

- Estructura plana por carpeta de módulo (no feature-based)
- Servicios en carpeta `Services/` global sin cliente API centralizado
- Cada servicio configura axios directamente con URL hardcodeada
- Sin custom hooks para separar lógica de estado de los componentes
- Sin barrel exports
- Nombres de carpetas inconsistentes (PascalCase: `Almacen/`, `Services/`, `Components/`)
- Sin constantes centralizadas
- Sin interceptor de autenticación JWT

---

## 2. Estructura objetivo

```
FRONT-END/src/
├── app/
│   └── App.js
├── components/
│   ├── ui/                        # Componentes reutilizables (Modal, Table, etc.)
│   │   └── index.js
│   └── layout/                    # Navbar, Sidebar, Footer
│       └── index.js
├── features/                      # Arquitectura feature-based
│   ├── almacen/
│   │   ├── components/
│   │   ├── hooks/
│   │   ├── services/
│   │   └── index.js
│   ├── auth/
│   ├── compras/
│   ├── empresas/
│   ├── facturas/
│   ├── gastos/
│   ├── horas/
│   ├── obras/
│   ├── pedidos/
│   └── rentabilidad/
├── services/
│   └── api/
│       └── client.js              # Cliente axios centralizado con interceptors
├── hooks/                         # Custom hooks globales
├── utils/                         # Utilidades globales
├── constants/                     # Constantes globales (rutas, endpoints)
├── styles/                        # Estilos globales (renombrar de css/)
├── index.js
└── reportWebVitals.js
```

---

## 3. Plan de refactorización del frontend

### Iteración 1: Infraestructura base

**Objetivo:** Crear la base sobre la que migrar los módulos.

| Paso | Qué incluye |
|------|-------------|
| **1. Cliente API centralizado** | Crear `services/api/client.js` con axios, baseURL, interceptor JWT (Bearer token), interceptor de errores (401 → redirect login) |
| **2. Constantes** | Crear `constants/api.js` (endpoints) y `constants/routes.js` (rutas del router) |
| **3. Estructura de carpetas** | Crear las carpetas vacías de `features/`, `components/ui/`, `components/layout/`, `hooks/`, `utils/`, `styles/` |

### Iteración 2: Migración feature by feature

**Objetivo:** Migrar cada módulo a la estructura feature-based, del menos al más complejo.

**Patrón por feature:**
```
features/[nombre]/
├── components/           # Componentes específicos del feature
├── hooks/                # Custom hooks (useNombre, useNombreForm)
├── services/             # Llamadas API usando el client centralizado
└── index.js              # Barrel export
```

**Orden de migración:**

| Ola | Features | Razón del orden |
|-----|----------|-----------------|
| **1a ola** | auth, empresas, almacen | Módulos más simples, pocas dependencias |
| **2a ola** | gastos, horas, compras | Complejidad intermedia |
| **3a ola** | pedidos, facturas, rentabilidad | Dependen de obras |
| **4a ola** | obras | El más complejo, muchas subdependencias |

### Iteración 3: Limpieza y optimización

| Paso | Qué incluye |
|------|-------------|
| **1. Eliminar carpetas viejas** | Borrar las carpetas originales una vez migradas |
| **2. Componentes UI compartidos** | Extraer a `components/ui/` los componentes reutilizables |
| **3. Estilos** | Renombrar `css/` a `styles/`, organizar |
| **4. Path aliases** | Configurar `jsconfig.json` para `@features/`, `@components/`, etc. |

---

## 4. Conexión con el backend refactorizado

El backend ya tiene:
- **Paginación**: `{ data, pagination: { total, limit, offset } }` — el frontend deberá consumir este formato
- **JWT**: `POST /api/auth/login` devuelve `{ token, usuario }` — el frontend deberá almacenar el token y enviarlo en el header `Authorization: Bearer <token>`
- **Filtrado SQL**: `GET /entidad?filtro=valor` y `POST /entidad/filtrar` para arrays — los servicios del frontend deberán usar estos endpoints
- **Formato de respuesta**: `{ success, data, pagination? }` — consistente en todos los endpoints

---

## 5. Directriz para Claude Code: Decisiones de diseño

**Cada vez que durante el proceso de refactorización surja una situación que requiera una decisión de diseño**, Claude Code deberá:

1. **Identificar** que se trata de una decisión de diseño (no una simple implementación)
2. **Ofrecer recomendaciones** sobre cuáles son las mejores opciones, siguiendo los **estándares de la industria** para el desarrollo full-stack con React, Express, Node y SQL
3. **Explicar los trade-offs** de cada opción (rendimiento, mantenibilidad, escalabilidad, complejidad)
4. **Recomendar una opción**, justificando por qué es la más adecuada para el contexto del proyecto
5. **Esperar confirmación** del desarrollador antes de implementar

Esto evita iteraciones innecesarias sobre refactorizaciones ya realizadas.

---

## 6. Directriz para Claude Code: Optimización de uso

**Para maximizar el aprovechamiento de Claude Code y evitar consumo excesivo en tareas mecánicas**, Claude Code deberá:

1. **Cambios mecánicos y repetitivos**: Aplicar el cambio en UN archivo significativo como ejemplo, y proporcionar instrucciones claras para que el desarrollador replique el patrón en el resto de archivos afectados.
2. **Nueva lógica/funcionalidad propagable**: Implementar la lógica en UN archivo significativo como referencia, y dar instrucciones para propagar esa lógica al resto de archivos que lo requieran.
3. **Asesoramiento proactivo**: Cuando la situación lo requiera, aconsejar al desarrollador sobre cómo aprovechar mejor Claude Code y evitar uso excesivo en tareas simples (ej: copias mecánicas, renombrados masivos, cambios de imports repetitivos).

---

## 7. Progreso de la refactorización

### Iteración 1: Infraestructura base — COMPLETADA ✅

| Paso | Estado | Notas |
|------|--------|-------|
| Cliente API centralizado | ✅ | `services/api/client.js` — axios con baseURL desde `.env`, interceptor JWT (Bearer token en `localStorage`), interceptor 401 (redirect a `/login`) |
| Constantes | ✅ | `constants/api.js` (endpoints del backend) y `constants/routes.js` (rutas del React Router) |
| Estructura de carpetas | ✅ | Creadas: `components/ui/`, `components/layout/`, `features/`, `hooks/`, `utils/`, `styles/` con `.gitkeep` |
| `.env` | ✅ | `REACT_APP_API_URL=http://localhost:3002/api` (ya ignorado por `.gitignore` raíz) |

### Iteración 2: Migración feature by feature — EN PROGRESO

| Feature | Estado | Notas |
|---------|--------|-------|
| auth | ✅ | `features/auth/` — service (usa `apiClient` + `AUTH_LOGIN`), Login.js (migrado: usa `authService`, guarda JWT en `localStorage`), barrel export |
| empresas | ✅ | `features/empresas/` — service (CRUD con `apiClient` + `EMPRESA`), GestionEmpresas.js (migrado: usa `empresaService`; componente aún en desarrollo temprano), barrel export |
| almacen | ✅ | `features/almacen/` — service (`almacenService` + `movimientoAlmacenService`), GestionAlmacen.js (migrado: corregido endpoint de `/inventario` a `/almacen`), barrel export |
| gastos | ✅ | `features/gastos/` — service (CRUD con `apiClient` + `GASTOS`), GastosList.js (migrado: usa `gastoService` + `apiClient` para cross-feature: tipos-gasto, usuario, obra), barrel export |
| horas | ✅ | `features/horas/` — `hora.service.js` (CRUD + subordinados), `user.service.js` (migrado de `Horas/Services/userService.js`, usa `apiClient` + `RESPONSABLES`), 3 componentes (HorasList, DetalleHora, NuevaHora), barrel export. Cross-feature: estado-obra, tipo-obra, obra via `apiClient` |
| compras | ✅ | `features/compras/` — service (CRUD con `apiClient` + `FACTURA_COMPRA`; **corregido** de `/compras` y `/facturas/` a `/facturaCompra`), 3 componentes (GestionCompras, NuevaCompra, DetalleCompra), barrel export. **DetalleCompra arreglado**: añadido `useEffect` + fetch real en vez de `[].find()` |
| pedidos | ✅ | `features/pedidos/` — service (CRUD con `apiClient` + `PEDIDO_OBRA`; **corregido** de `/pedidos` y `/ecoPedido/` a `/pedidoObra`), 4 componentes (GestionPedidos, DetallePedido, NuevoPedido, ImprimirPedido), barrel export. Delete refactorizado a batch. |
| facturas | ✅ | `features/facturas/` — service (CRUD con `apiClient` + `FACTURA_OBRA`; **corregido** de `/api/facturas` y `/ecoFactura/` a `/facturaObra`), 4 componentes (GestionFacturas, DetalleFactura, NuevaFactura, ImprimirFacturas), barrel export. Delete refactorizado a batch. `Factura/FacturaDetalle.js` (huérfano, no importado en App.js) → se eliminará en Iteración 3. |
| rentabilidad | ✅ | `features/rentabilidad/` — service (`rentabilidadService`), ProfitabilityTable.js (migrado estructura; usa datos simulados, sin API aún), barrel export |
| obras | ✅ | `features/obras/` — El feature más complejo (53 ficheros originales, 24 hooks, 16 dependencias de servicio). Migrado en 7 pasos incrementales. Ver detalles abajo. |

**Cambios en App.js (1a ola):**
- `Login` → importado desde `features/auth`
- `GestionAlmacen` → importado desde `features/almacen`
- (empresas no se usa aún en rutas)

**Cambios en App.js (2a ola):**
- `GestionCompras`, `DetalleCompra`, `NuevaCompra` → importados desde `features/compras`
- `HorasList`, `DetalleHora`, `NuevaHora` → importados desde `features/horas`
- `GastosList` → importado desde `features/gastos`

**Cambios en App.js (3a ola):**
- `GestionPedidos`, `DetallePedido`, `NuevoPedido`, `ImprimirPedido` → importados desde `features/pedidos`
- `GestionFacturas`, `DetalleFactura`, `NuevaFactura`, `ImprimirFacturas` → importados desde `features/facturas`
- `ProfitabilityTable` → importado desde `features/rentabilidad`
- Eliminadas rutas duplicadas (gestion-almacen, gestion-pedidos, gestion-compras, gestion-obras/detalle aparecían dos veces)

**Cambios en App.js (4a ola):**
- `ListaObras`, `DetalleObra`, `CrearObra`, `ImprimirObras` → importados desde `features/obras`
- Se usa `GestionObras as ListaObras` para mantener compatibilidad con el JSX existente en rutas
- **App.js ya no importa ningún módulo desde la estructura antigua** (excepto `Navbar`)

**Detalle de la 4a ola — obras (7 pasos):**

| Paso | Descripción | Ficheros |
|------|-------------|----------|
| 1. Servicios | `obra.service.js` con `obraService` (CRUD + buscarPorDescripcion) y `relacionObraService` (padre/hijas) | 1 |
| 2. Utils | `calculos.js`, `fechas.js`, `filtrosHelpers.js` — funciones puras, sin cambios | 3 |
| 3. Hooks | 24 hooks migrados en 3 grupos: A (12 sin cambios), B (2 con ruta utils actualizada), C (10 con imports de servicios + nombres de métodos actualizados) | 24 |
| 4. Componentes | 4 orchestrators + 17 sub-componentes + 5 modales. ImprimirObra migrado de axios directo a obraService. NuevoObra.js (legacy) NO migrado. | 26 |
| 5. Barrel export | `features/obras/index.js` — exporta 4 componentes + 2 servicios | 1 |
| 6. App.js | 4 imports actualizados a barrel export | - |
| 7. Documento | Esta actualización | - |

**Decisiones de diseño (4a ola):**
1. **Estructura interna**: Respetar la estructura existente de 3 niveles de hooks (Atómicos → Compuestos → Dominio)
2. **obra.service.js**: Un solo fichero con `obraService` + `relacionObraService`
3. **Catálogos** (tipoObra, estadoObra, tipoFacturable, usuario, edificio, contacto): Usar `apiClient` + `API_ENDPOINTS` directamente con `// TODO: Dependencia cross-feature`
4. **Features ya migradas** (pedidos, facturas, almacen, compras, gastos, horas, rentabilidad): Importar desde sus barrel exports
5. **ImprimirObra.js**: Migrado de `axios.get("http://localhost:3002/api/obra/${id}")` a `obraService.getById(id)`
6. **NuevoObra.js** (28.6 KB legacy): NO migrar, eliminar en Iteración 3
7. **Batch delete**: Hooks que llaman `deleteFunction(id)` wrapean como `(id) => service.delete([id])` para compatibilidad con servicios migrados

**Mapeo de nombres de métodos (servicios old → new):**
- `obraService`: `getObra`→`getById`, `getAllObras`→`getAll`, `createObra`→`create`, `updateObra`→`update`, `deleteObra`→`delete`, `buscarObrasPorDescripcion`→`buscarPorDescripcion`
- `pedidoService`: `getPedidos`→`getByObras`, `createPedido`→`create`, `updatePedido`→`update`, `deletePedido`→`delete([id])`
- `facturaService`: `getFacturas`→`getByObras`, `createFactura`→`create`, `updateFactura`→`update`, `deleteFactura`→`delete([id])`
- `almacenService`: `getMovimientosAlmacen`→`movimientoAlmacenService.getByObra`, `buscarProductos`→`almacenService.buscarPorDescripcion`
- `compraService`: `getFacturasCompras`→`getByObra`, `buscarFacturas`→`buscarPorConcepto`
- `gastoService`: `getGastos`→`getByObras`
- `horaService`: `getHoras`→`getByObras`, `getHorasExtra`→`getHorasExtra`
- `rentabilidadService`: `getRentabilidad`→`getByObra`

**Patrón de dependencias cross-feature (2a ola):**
- Cuando un componente necesita datos de otra entidad (ej: GastosList necesita usuarios y obras), se usa `apiClient` + `API_ENDPOINTS` directamente en el componente, con un `// TODO: Dependencia cross-feature` para migrar cuando esa feature tenga su servicio.
- `Horas/Services/userService.js` migrado a `features/horas/services/user.service.js` — cuando se cree la feature de usuario/responsable, se refactorizará.

### Iteración 3: Limpieza y optimización — EN PROGRESO

| Paso | Estado |
|------|--------|
| Eliminar carpetas viejas | ✅ (realizado manualmente por el desarrollador, excepto `Services/` parcial — quedan servicios sin migrar: contacto, edificio, estadoObra, tipoFacturable, tipoObra) |
| Componentes UI compartidos | ✅ (4 componentes creados en `Components/ui/`: PaginationControl, SearchableSelect, SearchableMultiSelect, SearchDropdown. ActionButtonGroup descartado por abstracción prematura.) |
| Estilos (`css/` → `styles/`) | ✅ (realizado manualmente por el desarrollador) |
| Hooks genéricos a `hooks/` global | ✅ (realizado manualmente por el desarrollador — 10 hooks atómicos movidos) |
| Utils genéricos a `utils/` global | ✅ (`fechas.js` movido a `utils/` global; `calculos.js` y `filtrosHelpers.js` se mantienen en `features/obras/utils/` por ser específicos de dominio) |
| Path aliases | ✅ (`jsconfig.json` con `baseUrl: "src"`. Imports absolutos aplicables progresivamente.) |

**Componentes UI compartidos — Progreso:**

| Componente | Estado | Ubicación |
|------------|--------|-----------|
| `PaginationControl` | ✅ Creado | `Components/ui/PaginationControl.jsx` |
| `SearchableSelect` | ✅ Creado | `Components/ui/SearchableSelect.jsx` (selección única) |
| `SearchableMultiSelect` | ✅ Creado | `Components/ui/SearchableMultiSelect.jsx` (selección múltiple) |
| `SearchDropdown` | ✅ Creado | `Components/ui/SearchDropdown.jsx` (base compartida interna — no usar directamente) |
| `ActionButtonGroup` | ❌ Descartado | Los botones de acción (barras de lista, footers de modales, detalle) son 2-4 líneas de JSX simple con labels/handlers variables. Extraerlos añadiría indirección sin ganancia real. La clase `custom-button` se unificará en el paso de estilos. |

**Instrucciones de propagación pendientes:**

**PaginationControl** — Reemplazar paginación inline por `<PaginationControl>` importado desde `Components/ui`:
- `features/obras/components/GestionObras/index.js` → ✅ Aplicado (ejemplo). Eliminar `PaginacionObras.jsx` (ya no se usa).
- `features/facturas/components/GestionFacturas.js` → Modo completo (con `paginasVisibles`, `startPage`, `endPage`). Reemplazar bloque `<Pagination>` (~L482-500).
- `features/horas/components/HorasList.js` → Modo completo. Reemplazar bloque `<Pagination>` (~L892-918).
- `features/pedidos/components/GestionPedidos.js` → Modo simple (`simple` prop). Reemplazar bloque `<Pagination>` (~L341-351).
- `features/compras/components/GestionCompras.js` → Modo simple. Mismo patrón que GestionPedidos.
- `features/gastos/components/GastosList.js` → Usa botones HTML propios. Migrar cuando se refactorice su paginación a `usePaginacion`.
- **Nota**: Los features en modo simple (pedidos, compras) deberían migrar su lógica de paginación al hook `usePaginacion` global para consistencia. Actualmente calculan paginación inline.

**SearchableSelect** — Reemplazar bloques `<div position-relative>...(input + sugerencias + seleccionado)...</div>` por `<SearchableSelect>`:
- `features/obras/components/DetalleObra/Components/Modals/ModalGastoAlmacen.jsx` → ✅ Aplicado (ejemplo).
- `features/obras/components/DetalleObra/Components/Modals/ModalCompra.jsx` → Misma carpeta. Props: `placeholder="Buscar factura por concepto..."`, `suggestions={sugerenciasFacturas}`, `renderSuggestion={(f) => f.Concepto}`, `selected={facturaSeleccionada}`, `renderSelected={(f) => <><strong>Factura:</strong> {f.Concepto}</>}`.
- `features/obras/components/CrearObra/Components/SelectorObrasRelacionadas.jsx` → ✅ Aplicado (ejemplo). Usa `SearchableSelect` para obra padre (single) + `SearchableMultiSelect` para obras hijas (multi).
- `features/obras/components/DetalleObra/Components/InformacionGeneral.jsx` → Tiene búsqueda de obras relacionadas (padre + hijas). Mismos componentes que SelectorObrasRelacionadas, con `keyField="id_obra"`.
- `features/obras/components/CrearObra/Components/Modals/ModalContacto.jsx` → 2 instancias. Complejos: `SearchableMultiSelect` (selección múltiple de complejos). Empresa: `SearchableSelect` (selección única de empresa).

**SearchableMultiSelect** — Props clave vs SearchableSelect:
- `selectedItems` (array) en vez de `selected` (object)
- `onRemove(item)` recibe el item completo en vez de no recibir argumentos
- Renderiza `ListGroup` con cada item + botón "Quitar"

---

## 8. Estructura definitiva de features (confirmada)

### Contexto histórico

Discrepancia entre la feature `obras` (orchestrator + presentacionales + 14 hooks + 3 niveles de nesting) y el resto de features (archivos .js monolíticos, 0 hooks, estructura plana). La causa: obras creció hasta ~3000 líneas y se refactorizó; el resto no.

### Decisión de estrategia de migración

**Opción elegida: Una sola pasada, estructura primero.**

En vez de hacer dos pasadas (1. conectar al backend → 2. reestructurar), se define primero la estructura definitiva y se implementa cada feature una sola vez en su forma final. Esto evita trabajo descartable y es más eficiente.

### Estructura definitiva por feature

```
features/[nombre]/
├── components/
│   ├── Gestion[Nombre].jsx          # Vista lista
│   ├── Detalle[Nombre].jsx          # Vista detalle/edición
│   ├── Crear[Nombre].jsx            # Formulario de creación (si aplica)
│   ├── Imprimir[Nombre].jsx         # Vista impresión (si aplica)
│   ├── Tabla[Nombre].jsx            # Presentacionales al mismo nivel
│   ├── Filtros[Nombre].jsx          # Panel de filtros (si aplica)
│   ├── Modal[Entidad].jsx           # Modales al mismo nivel (sin subcarpeta)
│   └── ...
├── hooks/                            # Solo si se necesita (ver regla abajo)
│   └── use[Concepto].js
├── services/
│   └── [nombre].service.js
├── utils/                            # Solo si tiene utils de dominio
│   └── [dominio].js
└── index.js                          # Barrel export
```

### Convenciones confirmadas

**1. Nombres de archivo (Decisión 1):**
- Los componentes INCLUYEN el nombre de la entidad: `GestionPedidos.jsx`, no `Gestion.jsx`
- Razón: diferenciación en pestañas del editor cuando hay múltiples features abiertas

**2. Extensiones de archivo (Decisión 2):**
- `.jsx` para archivos con JSX (componentes, modales)
- `.js` para archivos de lógica pura (hooks, services, utils, barrel exports)
- Señaliza visualmente qué archivos tienen UI

**3. Cuándo crear hooks de feature (Decisión 3):**
- **NO** crear hooks preventivamente — es abstracción prematura
- Extraer hooks cuando: (1) componente supera ~300 líneas, (2) lógica se reutiliza entre componentes del mismo feature, o (3) lógica es testeable independientemente
- Features simples (empresas, almacen) no necesitan hooks
- Features medianas/complejas (horas, gastos, obras) sí los necesitarán

**4. Catálogos cross-feature (Decisión 4):**
- Mantener `apiClient` + `API_ENDPOINTS` para lookups de catálogos (tipoObra, estadoObra, etc.)
- Los 5 servicios legacy en `Services/` (contacto, edificio, estadoObra, tipoFacturable, tipoObra) se eliminarán
- Si en el futuro se necesita reutilizar lógica de catálogos, crear un `services/catalog.service.js` global

### Reglas del patrón orchestrator

- **< 150 líneas** → archivo único, sin split
- **150-300 líneas** → evaluar si el split aporta claridad
- **> 300 líneas** → split obligatorio en orchestrator (`index.js` dentro de subcarpeta) + componentes presentacionales `.jsx` al mismo nivel
- Orchestrators solo se crean cuando el split es necesario. Componentes simples se quedan como archivo único (`GestionAlmacen.jsx`)

### Orden de migración

Cada feature se implementa una sola vez en su forma definitiva (estructura + consumo backend + paginación):

| Ola | Feature | Razón |
|-----|---------|-------|
| 1 | empresas | Skeleton, CRUD simple, sin cross-feature deps. Establece template |
| 2 | compras, pedidos | Complejidad media, CRUD completo, estructura similar |
| 3 | facturas | Similar a pedidos/compras pero con filtros parciales |
| 4 | gastos | 574 líneas monolíticas, filtrado complejo, necesita split |
| 5 | horas | 962 líneas, el más complejo tras obras, necesita hooks |
| 6 | rentabilidad | Skeleton con datos demo, conectar a API real |
| 7 | obras | El más complejo. Aplanar nesting, migrar a server-side pagination |

### Proceso por feature

1. **Analizar** el estado actual del componente y el backend disponible
2. **Implementar** con la estructura definitiva (service corregido + componentes .jsx + paginación server-side + imports absolutos)
3. **Extraer** hooks/utils/componentes reutilizables si surgen durante el proceso
4. **Directriz 6**: Implementar UN feature como ejemplo, dar instrucciones para features similares

---

## 9. Autenticación frontend (Route Guards)

### Implementación — COMPLETADA ✅

**Opción elegida:** AuthContext + PrivateRoute (estándar de la industria para React + JWT)

**Archivos creados:**
- `features/auth/AuthContext.js` — `AuthProvider` (gestiona estado auth en React state + localStorage) + hook `useAuth()` que expone `{ user, token, isAuthenticated, login, logout }`
- `features/auth/components/PrivateRoute.js` — Comprueba `isAuthenticated` vía `useAuth()`, redirige a `/login` si no hay sesión

**Archivos modificados:**
- `features/auth/index.js` — Añadidos exports de `AuthProvider`, `useAuth`, `PrivateRoute`
- `features/auth/components/Login.js` — Usa `useAuth().login()` en vez de `localStorage` directo
- `App/App.js` — `AuthProvider` envuelve toda la app, `PrivateRoute` protege `/home/*`

**Flujo:**
1. Acceso a `/home/*` sin token → `PrivateRoute` redirige a `/login`
2. Login exitoso → `login(token, usuario)` guarda en state + localStorage → navega a `/home/gestion-obras`
3. Token inválido durante uso → interceptor 401 de `apiClient` limpia localStorage y redirige
4. Cualquier componente accede al usuario con `const { user, logout } = useAuth()`

**Propagación pendiente:** Componentes que leen `JSON.parse(localStorage.getItem("user"))` directamente pueden migrar a `useAuth().user` progresivamente.

---

## 10. Paginación server-side

### Hook `useServerPagination` — CREADO ✅

**Ubicación:** `hooks/useServerPagination.js`

**Diferencia con `usePaginacion` (client-side):**
- `usePaginacion`: recibe todos los items, pagina con `.slice()` en JS
- `useServerPagination`: el backend pagina con `LIMIT`/`OFFSET`, devuelve `{ total, limit, offset }`

**API del hook:**
```javascript
const {
  currentPage, totalPaginas, limit, offset,
  startPage, endPage, paginasVisibles,
  handlePageChange, resetToFirstPage,
} = useServerPagination(total, defaultLimit);
// total: viene de res.data.pagination.total
// defaultLimit: registros por página (default 50)
```

**Patrón de uso en componentes:**
```javascript
// 1. Hook provee limit/offset
const { limit, offset, ... } = useServerPagination(total);
// 2. Componente pasa limit/offset al service
const res = await service.getAll({ ...filters, limit, offset });
// 3. Backend devuelve { data, pagination: { total, limit, offset } }
setItems(res.data.data);
setTotal(res.data.pagination?.total ?? 0);
// 4. PaginationControl muestra la navegación
```

**Compatible con `PaginationControl`:** Devuelve las mismas props (`paginasVisibles`, `startPage`, `endPage`, `handlePageChange`).

`usePaginacion` se mantiene para features que aún usen paginación client-side. Se retirará cuando todas migren.

---

## 11. Progreso de migración de features

### Checklist por feature

Al implementar cada feature en su forma definitiva, verificar:
- [ ] Servicio: endpoints correctos, `res.data.data` para array, delete single-item por URL param
- [ ] Componentes: `.jsx`, nombres con entidad, paginación server-side, loading/error
- [ ] Hooks: reutilizar hooks globales (`useFormulario`, `useModal`, `useSeleccionMultiple`, `useBusquedaMultiple`, `useServerPagination`) antes de crear estado manual
- [ ] Imports: absolutos para cross-feature/globales
- [ ] Barrel export: `index.js` exporta componentes públicos + servicios
- [ ] Estructura: acorde a sección 8 (split si >300 líneas, hooks si necesario)

### Progreso

| Feature | Estado | Notas |
|---------|--------|-------|
| almacen | Parcial | Service corregido y componente consume backend, pero **NO tiene estructura definitiva**. Falta: separar en módulos (Gestion/Crear/Detalle/Imprimir), renombrar `.js` → `.jsx`. Se completará en su ola correspondiente. |
| empresas | En progreso | GestionEmpresas + CrearEmpresa + DetalleEmpresa + FormEmpresa (compartido) + ModalNuevoContacto completados. Falta: ImprimirEmpresa (placeholder). Ola 1. |
| compras | Pendiente | 3 componentes (412+166+164 líneas). Ola 2. |
| pedidos | Pendiente | 3-4 componentes (354+178+242 líneas). Ola 2. |
| facturas | Pendiente | 3-4 componentes (469+110+225 líneas). Filtros parciales. Ola 3. |
| gastos | Pendiente | 1 componente monolítico (574 líneas). Necesita split. Ola 4. |
| horas | Pendiente | 3 componentes (962+209+132 líneas). Necesita hooks. Ola 5. |
| rentabilidad | Pendiente | Skeleton con datos demo. Ola 6. |
| obras | Pendiente | El más complejo (14 hooks, 3 niveles nesting). Aplanar + server-side. Ola 7. |

---

## 12. Feature empresas — EN PROGRESO

### Decisiones de diseño confirmadas

**Creación de contactos desde CrearEmpresa (Opción A: Modal simplificado + guardado diferido):**
- El backend `POST /contacto` requiere `empresa: { id }`, pero al crear una nueva empresa aún no existe ID → problema circular
- Solución: modal simplificado (solo campos del contacto, sin campo empresa) + guardado diferido
- Contactos nuevos se acumulan en estado local con indicador visual "(nuevo)"
- Al guardar empresa: (1) `POST /empresa` con IDs existentes, (2) `POST /contacto` con `empresa: { id: nuevaEmpresaId }` para cada contacto nuevo
- Descartada Opción B (reutilizar ModalContacto de obras) por UX confuso (obligaría a seleccionar empresa existente)

### Cambios realizados — GestionEmpresas

**Backend (ajuste menor):**
- `empresa.model.js` getAll: añadido `tipoEmpresa`, `porDefecto`, subquery `contactosCount` al SELECT. Añadido filtro `tipoEmpresa`

**Frontend:**
- `empresa.service.js` reescrito: imports absolutos, `delete({ idEmpresas })` corregido, añadidos `getById` y `buscarPorNombre`
- `constants/api.js`: añadido `TIPO_FACTURA: "/tipo-factura"`
- `GestionEmpresas.jsx` creado (~210 líneas): tabla con columnas Nombre/Tipo/Teléfono/Email/Contactos/PorDefecto/Acción, búsqueda por nombre, filtro tipoEmpresa (dropdown hardcodeado), selección batch con checkbox, acciones (Nueva/Baja/Imprimir), `useServerPagination(20)`, `PaginationControl`, loading/error states
- `App.js`: añadida ruta `gestion-empresas` + import de `GestionEmpresas`
- Eliminado `GestionEmpresas.js` (antiguo skeleton)

**Constantes hardcodeadas (TODO para futuro):**
```javascript
const TIPOS_EMPRESA = [
  { id: 1, descripcion: "Sin Especificar" },
  { id: 3, descripcion: "Cliente" },
];
```

### Cambios realizados — CrearEmpresa

- `ModalNuevoContacto.jsx` creado (~80 líneas): modal simplificado, prop-driven, estado interno con `useFormulario`
- `CrearEmpresa.jsx` creado (~290 líneas): form completo, SearchableMultiSelect para contactos, guardado orquestado
- `App.js`: ruta `nueva-empresa`, import `CrearEmpresa`

### Refactorización de hooks — COMPLETADA ✅

**Problema detectado:** Los componentes de empresas no reutilizaban los hooks globales existentes. Esto impediría escalar el patrón a complejos, proveedores, contactos y tipos de gasto.

**Nuevo hook creado: `useBusquedaMultiple`** (`hooks/useBusquedaMultiple.js`, ~100 líneas):
- Búsqueda + sugerencias + selección múltiple + filtrado automático de ya seleccionados
- Compatible directamente con las props de `SearchableMultiSelect`
- Incluye race condition protection (`requestRef`)
- Reutilizable en: CrearEmpresa (contactos), CrearObra (obras hijas, complejos), CrearContacto (empresas, complejos), etc.

```javascript
// API del hook:
const contactos = useBusquedaMultiple(
  (nombre) => apiClient.get(API_ENDPOINTS.CONTACTO, { params: { nombre, limit: 10 } }),
  { minLength: 2, keyField: "id" }
);
// → contactos.busqueda, .sugerencias, .seleccionados, .handleBuscar, .seleccionar, .remover, .limpiar
```

**Hooks reutilizados en componentes:**

| Hook | Componente | Reemplaza |
|------|-----------|-----------|
| `useFormulario` | CrearEmpresa | `formData`, `setFormData`, `handleInputChange` manual |
| `useFormulario` | ModalNuevoContacto | `form`, `setForm`, `handleChange`, reset manual |
| `useModal` | CrearEmpresa | `showModalContacto`, `setShowModalContacto` |
| `useBusquedaMultiple` | CrearEmpresa | búsqueda, sugerencias, seleccionados (~40 líneas) |
| `useSeleccionMultiple` | GestionEmpresas | `selectedIds`, `handleSelectAll`, `handleSelectOne` |
| `useServerPagination` | GestionEmpresas | ya estaba desde la creación |

**Hooks evaluados que NO aplican (y por qué):**
- `useCrudEntidad`: diseñado para CRUD modal, no para navegación a páginas ni guardado orquestado
- `useCrudConBusqueda`: extiende useCrudEntidad, mismas limitaciones
- `useApiRequest`: demasiado genérico para fetch paginado con filtros
- `useCheckboxCondicional`: los checkboxes de empresa no tienen side-effects
- `useBusquedaEntidad`: solo soporta selección única, no múltiple (reemplazado por `useBusquedaMultiple`)

### Módulos pendientes

| Módulo | Estado | Notas |
|--------|--------|-------|
| GestionEmpresas.jsx | ✅ | Lista + useServerPagination + useSeleccionMultiple |
| CrearEmpresa.jsx | ✅ | Form + useFormulario + useModal + useBusquedaMultiple |
| ModalNuevoContacto.jsx | ✅ | Modal simplificado + useFormulario |
| FormEmpresa.jsx | ✅ | Componente presentacional compartido — campos del form con prop `readOnly` y slot `children` |
| DetalleEmpresa.jsx | ✅ | Fetch por ID + mapeo snake_case→camelCase + toggle editar/cancelar + guardar + baja. Contactos en read-only (ListGroup). |
| ImprimirEmpresa.jsx | Pendiente | Placeholder/TODO |

---

## 13. Código reutilizable entre features (seguimiento)

Esta sección identifica código que se repite o puede reutilizarse entre features, para evitar duplicación y escalar de manera consistente.

### Hooks globales ya existentes

| Hook | Qué resuelve | Compatible con | Usado en |
|------|-------------|----------------|----------|
| `useServerPagination` | Paginación server-side (limit/offset/total) | `PaginationControl` | GestionEmpresas, GestionAlmacen |
| `useSeleccionMultiple` | Checkboxes batch (select/selectAll/clear) | — | GestionEmpresas, GestionObras |
| `useFormulario` | Estado de formulario + handleChange genérico | `Form.Control` | CrearEmpresa, ModalNuevoContacto |
| `useModal` | Toggle show/hide de modales | `Modal` | CrearEmpresa |
| `useBusquedaEntidad` | Búsqueda + sugerencias + selección única | `SearchableSelect` | obras (obraPadre, producto, factura) |
| `useBusquedaMultiple` | Búsqueda + sugerencias + selección múltiple | `SearchableMultiSelect` | CrearEmpresa (contactos) |

### Patrones de Gestión (listado) — reutilizables entre features

Detectado en `GestionEmpresas.jsx` y `GestionObras/index.js`. Patrón común:

1. **Fetch con useEffect** — depende de `[searchTerm, filtro, offset, limit, refreshKey]`
2. **Búsqueda** — `searchInput` (input local) + `searchTerm` (enviado al backend) + `handleSearch` (submit) + `handleClearSearch`
3. **Filtros dropdown** — `tipoFiltro` + `handleTipoChange` + `resetToFirstPage()`
4. **Selección batch** — `useSeleccionMultiple` para checkboxes de tabla
5. **Paginación** — `useServerPagination` + `PaginationControl`
6. **Barra de acciones** — botones Nueva/Baja/Imprimir con navegación y confirmación
7. **Tabla** — `Table striped bordered hover` con columnas específicas de la entidad
8. **Loading/Error** — `Spinner` centrado + `Alert dismissible`

**Candidato a hook futuro:** `useGestionEntidad` — encapsularía los puntos 1-3 (fetch, búsqueda, filtros, refresh). No crear aún — validar con 2-3 features antes de abstraer (Decisión 3, sección 8).

### Patrones de Creación — reutilizables entre features

Detectado en `CrearEmpresa.jsx` y `CrearObra/index.js`. Patrón común:

1. **useFormulario** — con `INITIAL_FORM` constante
2. **Fetch de catálogos** — useEffect al montar para cargar dropdowns (tipoEmpresa, tipoFactura, tipoObra, etc.)
3. **Guardado** — `handleGuardar` con validación, build payload, `service.create()`, navigate a gestión
4. **Loading/Error** — mismo patrón que Gestión
5. **Navegación** — botones Guardar + Cancelar con `useNavigate()`
6. **Layout** — `Card` con `Form` > `Row`/`Col` > `Form.Group`

### Patrones de Detalle (edición) — por validar

Detectado en `DetalleObra/index.js`. Patrón anticipado para DetalleEmpresa:

1. **Fetch por ID** — `useParams()` + `service.getById(id)` al montar
2. **Modo lectura/edición** — toggle `editarEntidad` (read-only por defecto → click "Editar" → campos editables)
3. **Guardar/Cancelar** — `service.update(id, payload)` + revert a datos originales
4. **Baja** — `service.delete([id])` con confirmación + navigate a gestión
5. **Reutilización de form** — los campos del form son idénticos a Crear → candidato a componente compartido `Form[Entidad].jsx`

**Patrón validado:** `FormEmpresa.jsx` extraído y compartido entre CrearEmpresa y DetalleEmpresa. Props: `formData`, `handleChange`, `readOnly`, `tiposFactura`, `children`. Replicar patrón `Form[Entidad].jsx` en features que tengan Crear + Detalle con campos idénticos.

### Patrones de Servicio — ya estandarizados

Todos los servicios siguen la misma estructura:
```javascript
export const [entidad]Service = {
  getAll: (filters) => apiClient.get(ENDPOINT, { params: filters }),
  getById: (id) => apiClient.get(`${ENDPOINT}/${id}`),
  create: (data) => apiClient.post(ENDPOINT, data),
  update: (id, data) => apiClient.patch(`${ENDPOINT}/${id}`, data),
  delete: (ids) => apiClient.delete(ENDPOINT, { data: { ids } }),
};
```

### Componentes UI compartidos — ya existentes

| Componente | Qué resuelve | Compatible con hooks |
|------------|-------------|---------------------|
| `PaginationControl` | Navegación de páginas | `useServerPagination`, `usePaginacion` |
| `SearchableSelect` | Búsqueda + selección única | `useBusquedaEntidad` |
| `SearchableMultiSelect` | Búsqueda + selección múltiple | `useBusquedaMultiple` |

### Próximas detecciones pendientes

- [ ] Validar si `useGestionEntidad` es viable tras migrar compras/pedidos (ola 2)
- [x] ~~Evaluar `Form[Entidad].jsx` compartido tras implementar DetalleEmpresa~~ → Validado. Patrón replicable.
- [ ] Identificar patrones de modales CRUD reutilizables (ModalPedido, ModalFactura, ModalNuevoContacto)

---

## TODO: Punto de continuación para el próximo chat

**Última sesión:** 18/02/2026
**Estado:** Feature empresas casi completa (falta ImprimirEmpresa placeholder). Eliminación completa de endpoints legacy `/buscar/` en backend y frontend. Todas las búsquedas ahora usan `getAll + filters`.

### Tareas completadas esta sesión:
- DetalleEmpresa.jsx + FormEmpresa.jsx (componente compartido Crear/Detalle)
- Sección 13 (código reutilizable entre features)
- **Eliminación de búsquedas especializadas** — backend (rutas, controllers, services, models) y frontend (services, hooks, callers) para obra, empresa, facturaCompra, edificio. `Services/edificioService.js` eliminado.
- Backend: añadido filtro `descripcion` a `obra.model.js` getAll

### Próximo paso:

**Feature `empresas` — ImprimirEmpresa.jsx**: Placeholder/TODO. Pendiente de confirmar requisitos con la empresa.
Luego: **Ola 2 — compras + pedidos** siguiendo la estructura definitiva (sección 8).

### Orden de migración restante:
1. ~~almacen~~ Parcial (consume backend, falta estructura definitiva con módulos)
2. **empresas** ← en progreso (GestionEmpresas ✅, CrearEmpresa ✅, DetalleEmpresa ✅, falta ImprimirEmpresa)
3. compras + pedidos (ola 2, estructura similar)
4. facturas (ola 3)
5. gastos (ola 4, necesita split >574 líneas)
6. horas (ola 5, necesita hooks >962 líneas)
7. rentabilidad (ola 6, skeleton con demo data)
8. obras (ola 7, aplanar nesting + server-side pagination)

### Contexto importante:
- **Estructura definitiva**: Sección 8 — nombres con entidad, `.jsx` componentes / `.js` lógica, hooks por necesidad, catálogos via `apiClient`
- **Directrices 5 y 6**: Decisiones de diseño + optimización de uso (implementar uno, instrucciones para replicar)
- Cliente API en `Services/api/client.js`, endpoints en `constants/api.js`
- `App.js` importa TODAS las features desde barrel exports
- Hooks globales (11) en `hooks/` — incluye `useServerPagination` para paginación server-side
- Componentes UI compartidos en `Components/ui/` (PaginationControl, SearchableSelect, SearchableMultiSelect)
- `Services/` aún tiene 4 servicios legacy (contacto, estadoObra, tipoFacturable, tipoObra) — eliminar cuando se resuelvan como catálogos cross-feature. `edificioService.js` ya eliminado.
- Backend completamente refactorizado (ver `CONTEXTO_REFACTORIZACION_BACKEND.md`)

**Path aliases (baseUrl: "src"):**
- Cross-feature/globales → absoluto: `"Components/ui"`, `"Services/api/client"`, `"constants/api"`, `"hooks/useServerPagination"`
- Dentro del mismo feature → relativo: `"../services/obra.service"`, `"./TablaObras"`
