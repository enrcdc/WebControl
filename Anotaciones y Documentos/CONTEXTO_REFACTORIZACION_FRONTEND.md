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

## 8. Estructura estándar de features (confirmada)

**Decisión:** Aplanar un nivel la estructura interna de cada feature. Eliminar la subcarpeta `Components/` intermedia, modales al mismo nivel, nombres simplificados.

**Estructura objetivo por feature:**
```
features/[nombre]/
├── components/
│   ├── Gestion.jsx           # (antes GestionObras/ o GestionPedidos/)
│   ├── Detalle.jsx           # (antes DetalleObra/ o DetallePedido/)
│   ├── Crear.jsx             # (si aplica)
│   ├── Imprimir.jsx          # (si aplica)
│   ├── TablaObras.jsx        # Sub-componentes presentacionales al mismo nivel
│   ├── ModalGasto.jsx        # Modales al mismo nivel (sin subcarpeta Modals/)
│   └── ...
├── hooks/
├── services/
├── utils/                    # (solo si tiene utils específicos de dominio)
└── index.js                  # Barrel export
```

**Reglas del patrón orchestrator:**
- **< 150 líneas** → archivo único (no split)
- **150-300 líneas** → evaluar si el split aporta claridad
- **> 300 líneas** → split obligatorio en orchestrator (`index.js`) + componentes presentacionales

**Nota:** Esta estructura se aplicará incrementalmente al tocar cada feature (no como refactorización masiva separada).

---

## TODO: Punto de continuación para el próximo chat

**Última sesión:** 16/02/2026
**Estado:** Iteraciones 1, 2 y 3 completadas. La estructura del frontend está definida y lista para escalar.

### Próximos pasos (por orden de prioridad):

#### Prioridad 1: Route guards (autenticación frontend)
- El backend ya tiene JWT implementado (`POST /api/auth/login` → `{ token, usuario }`)
- El frontend ya tiene `authService` y `apiClient` con interceptor JWT
- **Falta**: Proteger las rutas de `App.js` para que redirijan a `/login` si no hay token válido
- Opciones a evaluar: `<PrivateRoute>` wrapper vs middleware en el router vs contexto de autenticación
- Esto es prerequisito para que el flujo login → app funcione correctamente

#### Prioridad 2: Consumir backend + homogenizar features (incremental)
- Conectar cada feature al backend refactorizado (paginación server-side, filtros SQL, formato `{ success, data, pagination }`)
- Al tocar cada feature, aplicar simultáneamente:
  - Estructura estándar (sección 8 de este documento)
  - Propagación de componentes UI compartidos (PaginationControl, SearchableSelect/MultiSelect)
  - Imports absolutos donde aplique
- **Orden sugerido**: empezar por features simples (empresas, almacen) e ir hacia los complejos (obras)

#### Propagación pendiente (aplicar al tocar cada fichero):
- **PaginationControl** y **SearchableSelect/MultiSelect**: ver instrucciones detalladas en sección 7
- **Nota**: GastosList no tiene PaginationControl intencionalmente — su paginación se implementará cuando se refactorice el componente completo
- **Path aliases**: actualizar imports relativos profundos a absolutos progresivamente

### Contexto importante:
- El cliente API centralizado está en `Services/api/client.js` (capital S) — todos los servicios migrados lo usan
- Las constantes de endpoints están en `constants/api.js`
- Endpoints corregidos durante la migración: `/compras` → `/facturaCompra`, `/inventario` → `/almacen`, `/pedidos` y `/ecoPedido/` → `/pedidoObra`, `/api/facturas` y `/ecoFactura/` → `/facturaObra`
- El backend está completamente refactorizado (ver `CONTEXTO_REFACTORIZACION_BACKEND.md`)
- Seguir las **directrices 5, 6** de este documento
- `App.js` importa TODAS las features desde sus barrel exports. `Navbar` ya migrado a `Components/layout/`
- El `almacenService` incluye tanto operaciones de almacén como `movimientoAlmacenService` (ambos exportados desde el barrel)
- Dependencias cross-feature se resuelven con `apiClient` + `API_ENDPOINTS` directos — hay múltiples `// TODO: Dependencia cross-feature` en hooks de obras (catálogos: tipoObra, estadoObra, tipoFacturable, usuario, edificio, contacto)
- `Services/` aún contiene 5 servicios sin migrar (contacto, edificio, estadoObra, tipoFacturable, tipoObra) — se retirarán a medida que se implementen como features o se resuelvan como dependencias cross-feature
- Hooks genéricos (10 atómicos) ya en `hooks/` global. Hooks de dominio (14) se mantienen en `features/obras/hooks/`
- Utils genéricos (`fechas.js`) en `utils/` global. Utils de dominio (`calculos.js`, `filtrosHelpers.js`) en `features/obras/utils/`
- Componentes UI compartidos en `Components/ui/` con barrel export (PaginationControl, SearchableSelect, SearchableMultiSelect, SearchDropdown)

**Path aliases — Convención de imports absolutos (baseUrl: "src"):**
- `jsconfig.json` creado en `FRONT-END/` con `baseUrl: "src"`
- **Entre features o hacia carpetas globales** → import absoluto: `import { X } from "Components/ui"`, `import { apiClient } from "Services/api/client"`, `import { API_ENDPOINTS } from "constants/api"`, `import { usePaginacion } from "hooks/usePaginacion"`
- **Dentro del mismo feature** → import relativo: `import { obraService } from "../services/obra.service"`, `import TablaObras from "./Components/TablaObras"`
- **Retrocompatible**: los imports relativos existentes siguen funcionando. Actualizar progresivamente al tocar cada fichero.
- Ejemplo aplicado: `ModalGastoAlmacen.jsx` — `"../../../../../../Components/ui"` → `"Components/ui"`
