# WebControl ERP — Directrices para Claude Code

Rama de trabajo: `refactor/project-structure`

---

## Directriz 5: Decisiones de diseño

Cada vez que surja una situación que requiera una decisión de diseño, Claude Code debe:

1. **Identificar** que se trata de una decisión de diseño (no una simple implementación)
2. **Ofrecer recomendaciones** siguiendo los estándares de la industria para React + Express + Node.js + SQL
3. **Explicar los trade-offs** de cada opción (rendimiento, mantenibilidad, escalabilidad, complejidad)
4. **Recomendar una opción**, justificando por qué es la más adecuada para el contexto del proyecto
5. **Esperar confirmación** del desarrollador antes de implementar

---

## Directriz 6: Optimización de uso

1. **Cambios mecánicos y repetitivos**: Aplicar en UN archivo significativo como ejemplo + instrucciones para propagar
2. **Nueva lógica/funcionalidad propagable**: Implementar en UN archivo significativo como referencia + instrucciones para el resto
3. **Asesoramiento proactivo**: Aconsejar sobre cómo evitar uso excesivo en tareas simples

---

## Directriz 7: Actualización de documentación

Cada vez que Claude Code entregue código funcional (nuevo feature, refactorización, corrección, cambio de arquitectura), **antes de dar por finalizada la tarea**, debe actualizar los documentos afectados:

| Evento | Documentos a actualizar |
|--------|------------------------|
| **Nuevo feature o componente implementado** | `PROGRESO.md` (añadir al log), `SESION_ACTUAL.md` (cambios de la sesión), `TODO.md` (marcar como completado si aplica) |
| **Nueva convención, patrón o especificación consolidada** | `CONVENCIONES.md`, `CLAUDE.md` (si afecta a la referencia rápida) |
| **Cambio arquitectónico** (nueva capa, nueva integración, nuevo flujo) | `ARQUITECTURA.md` |
| **Deuda técnica identificada o resuelta** | `DEUDA_TECNICA.md` (añadir o mover a PROGRESO.md si se resuelve) |
| **Nuevo hook, componente UI o servicio reutilizable** | `CLAUDE.md` (tabla de referencia rápida), `CONVENCIONES.md` (API y uso) |
| **Decisión de diseño tomada** | `SESION_ACTUAL.md` (decisión + justificación) |
| **Decisión de negocio identificada** | `DECISIONES_NEGOCIO.md` (regla + implicaciones para el código) |

**Reglas:**
1. La actualización de documentación es **parte de la tarea**, no una tarea separada. No se considera completa una implementación sin su documentación correspondiente.
2. Ser conciso: añadir solo lo necesario para que un nuevo programador entienda qué se hizo y por qué.
3. No duplicar información entre documentos. Cada dato tiene un único hogar (ver tabla de documentos detallados al final).
4. `SESION_ACTUAL.md` es el diario de la sesión — todo cambio queda registrado ahí. Al final del día se archiva en `sesiones/`.

---

## Referencia rápida

### Path aliases (`jsconfig.json` con `baseUrl: "src"`)

- Cross-feature/globales: imports absolutos (`"Components/ui"`, `"Services/api/client"`, `"constants/api"`, `"hooks/useGestionEntidad"`)
- Dentro del mismo feature: imports relativos (`"../services/empresa.service"`, `"./FormEmpresa"`)

### Hooks globales (`hooks/`)

| Hook | Qué resuelve |
|------|-------------|
| `useGestionEntidad` | Fetch paginado con refreshKey. Recibe `fetchFunction` (useCallback). Devuelve `{ items, loading, error, pagination, refreshData }` |
| `useServerPagination` | Paginación server-side (limit/offset/total). Compatible con `PaginationControl` |
| `useSeleccionMultiple` | Checkboxes batch (select/selectAll/clear) |
| `useFormulario` | Estado de formulario + handleChange genérico |
| `useModal` | Toggle show/hide de modales |
| `useBusquedaEntidad` | Búsqueda + sugerencias + selección única. Compatible con `SearchableSelect` |
| `useBusquedaMultiple` | Búsqueda + sugerencias + selección múltiple. Compatible con `SearchableMultiSelect` |

### Componentes UI compartidos (`Components/ui/`)

| Componente | Qué resuelve |
|------------|-------------|
| `PaginationControl` | Navegación de páginas |
| `SearchableSelect` | Búsqueda + selección única |
| `SearchableMultiSelect` | Búsqueda + selección múltiple |

### Patrón de servicio estándar

```javascript
export const [entidad]Service = {
  getAll: (filters) => apiClient.get(ENDPOINT, { params: filters }),
  getById: (id) => apiClient.get(`${ENDPOINT}/${id}`),
  create: (data) => apiClient.post(ENDPOINT, data),
  update: (id, data) => apiClient.patch(`${ENDPOINT}/${id}`, data),
  delete: (ids) => apiClient.delete(ENDPOINT, { data: { ids } }),
};
```

### Contrato de respuesta FD vigente

```javascript
// Services devuelven: { data: entidad, sync: { ok, fdContactId?, skipped?, error? } }
// Controllers exponen: res.json({ success: true, data, sync })
// Frontend consume: res.data?.sync
```

### Prioridades al implementar

- Siempre revisar qué hooks globales existen antes de crear estado manual
- `useGestionEntidad` > patrón manual useState+useEffect+refreshKey
- `useBusquedaMultiple` para cualquier `SearchableMultiSelect` con búsqueda asíncrona
- `Form[Entidad].jsx` compartido entre Crear y Detalle (patrón validado)

---

## Documentos detallados

Ubicación: `Anotaciones y Documentos/`

| Documento | Contenido |
|-----------|-----------|
| `ARQUITECTURA.md` | Arquitectura del sistema (backend layers, frontend features, FD integration, auth) |
| `CONVENCIONES.md` | Convenciones de código, reglas, especificaciones técnicas |
| `PROGRESO.md` | Log de trabajo completado, iteraciones, features |
| `DEUDA_TECNICA.md` | Deuda técnica + roadmap (FD-2, migración DB, etc.) |
| `DECISIONES_NEGOCIO.md` | Decisiones de negocio de Control Cube que condicionan la implementación |
| `TODO.md` | Punto de continuación activo + próximos pasos |
| `SESION_ACTUAL.md` | Notas de la sesión en curso |
