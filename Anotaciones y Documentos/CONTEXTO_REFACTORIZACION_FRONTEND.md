# Contexto de Refactorización - Frontend

Documento complementario al `PLAN_REORGANIZACION.md`.
Recoge todas las decisiones y especificaciones tomadas durante el progreso de refactorización del frontend.

**Última actualización:** 13/02/2026
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

## 6. Progreso de la refactorización

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

### Iteración 3: Limpieza y optimización — PENDIENTE

| Paso | Estado |
|------|--------|
| Eliminar carpetas viejas | ⬜ |
| Componentes UI compartidos | ⬜ |
| Estilos | ⬜ |
| Path aliases | ⬜ |

---

## TODO: Punto de continuación para el próximo chat

**Última sesión:** 13/02/2026
**Estado:** Iteración 1 completada. Iteración 2 completada (4 olas). Próximo: Iteración 3 (limpieza y optimización).

### Próxima tarea:

1. **Iteración 3: Limpieza y optimización** — Requiere discusión de diseño (directriz 5). Pasos previstos:
   - **Paso 1**: Eliminar carpetas viejas (`Almacen/`, `Compra/`, `Factura/`, `Gastos/`, `Horas/`, `Login/`, `Obra/`, `Pedido/`, `Rentabilidad/`, `Empresas/`, `Services/` antiguos). Incluye `Factura/FacturaDetalle.js` (huérfano) y `Obra/CrearObra/NuevoObra.js` (legacy, 28.6 KB).
   - **Paso 2**: Componentes UI compartidos — extraer a `components/ui/` componentes reutilizables + extracción de lógica a hooks genéricos. Discutir en detalle.
   - **Paso 3**: Estilos — renombrar `css/` a `styles/`, organizar
   - **Paso 4**: Path aliases — configurar `jsconfig.json` para `@features/`, `@components/`, etc.

### Contexto importante:
- El cliente API centralizado está en `Services/api/client.js` (capital S) — todos los servicios migrados lo usan
- Las constantes de endpoints están en `constants/api.js`
- Endpoints corregidos durante la migración: `/compras` → `/facturaCompra`, `/inventario` → `/almacen`, `/pedidos` y `/ecoPedido/` → `/pedidoObra`, `/api/facturas` y `/ecoFactura/` → `/facturaObra`
- El backend está completamente refactorizado (ver `CONTEXTO_REFACTORIZACION_BACKEND.md`)
- Seguir la **directriz 5** de este documento: presentar decisiones de diseño antes de implementar
- `App.js` importa TODAS las features desde sus barrel exports. Solo `Navbar` usa la estructura antigua (`../Navbar/Navbar`)
- El `almacenService` incluye tanto operaciones de almacén como `movimientoAlmacenService` (ambos exportados desde el barrel)
- Dependencias cross-feature se resuelven con `apiClient` + `API_ENDPOINTS` directos — hay múltiples `// TODO: Dependencia cross-feature` en hooks de obras (catálogos: tipoObra, estadoObra, tipoFacturable, usuario, edificio, contacto)
- Iteración 3 paso 2: No solo extracción presentacional (JSX), sino también extracción de lógica a hooks genéricos o específicos
- Ficheros a eliminar en Iteración 3: `Factura/FacturaDetalle.js` (huérfano), `Obra/CrearObra/NuevoObra.js` (legacy)
- Obras tiene 24 hooks con arquitectura de 3 niveles (Atómicos → Compuestos → Dominio) — candidatos para extracción en paso 2
