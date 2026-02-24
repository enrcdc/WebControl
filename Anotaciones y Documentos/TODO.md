# TODO — Punto de Continuacion

**Ultima sesion:** 24/02/2026
**Estado:** Features pedidos y facturas completadas (estructura definitiva).

---

## Proximos pasos (en orden)

1. **Migración de BBDD** — ejecutar cuando esté lista. Revisar impacto en modelos.
2. ~~**Refactorizar features `pedidos` y `facturas`**~~ — COMPLETADO (24/02/2026). Paso 1 de FD-2 cumplido.
3. **Infraestructura FD para facturas de obras** — Paso 2 de FD-2. Siguiente tarea de desarrollo.
4. **Features `compras`, `gastos`, `horas`, `obras`** — pendientes de estructura definitiva (ver DEUDA_TECNICA.md seccion 4).
5. **`ImprimirEmpresa.jsx`** — placeholder pendiente de requisitos.
6. **Baja FD** — pendiente decision del cliente (soft delete ERP vs delete permanente FD).

---

## Contexto tecnico importante

- Contrato de respuesta FD vigente: `{ data: entidad, sync: { ok, ... } }`
- `FDContactoSyncService` usa metodo privado `#sync()` — no lanza excepcion, siempre devuelve `{ ok: bool }`
- `useGestionEntidad` es el hook estandar para vistas de listado paginado con filtros
- Path aliases activos: `baseUrl: "src"` — usar imports absolutos para cross-feature/globales
- Servicios legacy en `Services/` (estadoObra, tipoFacturable, tipoObra): pendientes de eliminar
- App.js importa TODAS las features desde barrel exports
- **Facturas son solo lectura en el ERP** (ver DECISIONES_NEGOCIO.md DN-1)

---

## Items pendientes menores

- [ ] Identificar patrones de modales CRUD reutilizables (ModalPedido, ModalFactura, ModalNuevoContacto)
- [ ] Propagar PaginationControl a features legacy (ver DEUDA_TECNICA.md)
- [ ] Propagar SearchableSelect a modales de obras (ver DEUDA_TECNICA.md)
- [ ] Eliminar servicio legacy de contacto en `Services/` (ya existe en features/contactos/)
- [ ] JSON_ARRAYAGG en `relacionobras` y `tareas_tipoobra` (ver CONVENCIONES.md seccion 7)
