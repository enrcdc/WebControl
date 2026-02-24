# Convenciones y Especificaciones — WebControl ERP

Documento de referencia para convenciones de codigo, reglas y especificaciones tecnicas del proyecto.

---

## 1. Convenciones de naming

### Archivos

- `.jsx` para archivos con JSX (componentes, modales)
- `.js` para logica pura (hooks, services, utils, barrel exports)
- Los componentes **incluyen el nombre de la entidad**: `GestionPedidos.jsx`, no `Gestion.jsx`
- Services: `[nombre].service.js`
- Hooks: `use[Concepto].js`

### Entidades backend

- Controllers: `entidad.controller.js`
- Services: `entidad.service.js`
- Models: `entidad.model.js`
- Routes: `entidad.routes.js`
- Validators: `entidadValidator.js`

---

## 2. Imports

### Path aliases (`jsconfig.json` con `baseUrl: "src"`)

- Cross-feature/globales → absoluto: `"Components/ui"`, `"Services/api/client"`, `"constants/api"`, `"hooks/useGestionEntidad"`
- Dentro del mismo feature → relativo: `"../services/complejo.service"`, `"./FormComplejo"`

---

## 3. Validaciones: Zod vs Service

### Zod (carpeta `validations/`)
- Valida **forma y estructura** de los datos
- Campos obligatorios, tipos, formatos (email, telefono, etc.)
- Se ejecuta **antes** del controller, como middleware en la ruta
- **No necesita** base de datos

### Service
- Valida **reglas de negocio**
- La entidad existe en BD? Esta dada de baja?
- Se permite esta transicion de estado?
- **Si necesita** consultas a BD o conocimiento del dominio

---

## 4. Rutas: orden de definicion

Las rutas especificas siempre van **ANTES** que las parametrizadas. Express evalua en orden.

```javascript
router.get("/", Controller.getAll);
router.post("/filtrar", Controller.buscarConFiltros);
router.get("/buscar/nombre", Controller.getByNombre);
router.get("/:id", Controller.getById);        // Parametrizada AL FINAL
router.post("/", Controller.create);
router.patch("/:id", Controller.update);
router.delete("/:id", Controller.delete);
```

---

## 5. Reglas del backend

- **Soft delete**: Las entidades usan `fecha_baja` en lugar de eliminacion fisica
- **Controladores thin**: Solo manejan HTTP. Sin logica de negocio, sin conversiones de tipo, sin validaciones
- **`getAll` siempre devuelve array**: Nunca usar `.first()` dentro de `getAll`
- **`getById` en modelos**: Metodo estandar que devuelve un unico objeto (o null). Usado por `_getEntityOrFail`
- **`_getEntityOrFail`**: Patron privado en servicios con CRUD para verificar existencia + soft delete. Siempre usa `Model.getById()`
- **Delete en batch (Opcion C)**: Recibe array de IDs, clasifica en `{ eliminados, yaEliminados, noEncontrados }`, ejecuta delete solo sobre activos
- **Los `console.log` de debug** se eliminan al refactorizar

---

## 6. Especificacion: getAll(filters) en modelos

- **JSDoc obligatorio**: Cada `getAll(filters = {})` debe documentar filtros soportados y tipos
- **Filtro por ID siempre incluido**: Todas las entidades deben soportar filtro por su ID
- **Propagacion futura**: Los JSDoc se propagaran a servicios del frontend

```javascript
/**
 * getAll recupera todos los registros segun filtros proporcionados.
 * @param {Object} filters - El objeto de filtros.
 * @param {number} [filters.idEntidad] - filtrar por id
 * @param {string} [filters.nombre] - filtrar por nombre
 * @returns {Promise<Array>} Array de resultados
 */
static async getAll(filters = {}) { ... }
```

---

## 7. Especificacion: JSON_ARRAYAGG en modelos backend

### Regla general

- **`getById`**: Incluir `JSON_ARRAYAGG` + `JSON_OBJECT` para relaciones M:N con pocos elementos (contactos de empresa, empresas de contacto, contactos de complejo). Embebe la entidad relacionada como array de objetos.
- **`getAll`**: **NO** incluir arrays JSON. Usar datos escalares:
  - `COUNT(*)` subquery → cuando solo se necesita el total (ej: `contactosCount` en GestionEmpresas)
  - `GROUP_CONCAT(DISTINCT ... SEPARATOR ', ')` → cuando se necesitan nombres para display (ej: `nombreEmpresas` en GestionContactos)
  - Nada → cuando la vista lista no muestra relaciones

### Relaciones NO candidatas a JSON_ARRAYAGG

Relaciones 1:N con muchos elementos que tienen endpoints paginados propios:

| Tabla | Relacion | Razon |
|---|---|---|
| `ecopedido` | pedidos de obra | 10-100+ items |
| `ecofactura` | facturas de obra | 10-100+ items |
| `horasobra` | horas de obra | 50-500+ items |
| `gastosobra` | gastos de obra | 10-100+ items |
| `facturascompras_obra` | facturas compra | 10-100+ items |
| `movimiento_almacen` | movimientos almacen | muchos items |

### Modelos actuales

| Modelo | `getAll` | `getById` |
|---|---|---|
| `empresa.model.js` | `contactosCount` (COUNT) | `contactos` (JSON_ARRAYAGG: id, nombre, apellido1, apellido2) |
| `edificio.model.js` | Sin relaciones | `contactos` (JSON_ARRAYAGG) |
| `contacto.model.js` | `nombreEmpresas` (GROUP_CONCAT) | `empresas` + `complejos` (JSON_ARRAYAGG) |

### Candidatas pendientes

| Tabla | Donde aplicar | Estado |
|---|---|---|
| `relacionobras` | Solo `obra.model.js getById` (padre: 0-1, hijas: 0-10) | TODO |
| `tareas_tipoobra` | `getAll` y `getById` (pocos items, catalogo) | TODO |

---

## 8. Convencion async/await en useEffect

Todo fetch asincrono en `useEffect` usa **async/await**, nunca `.then().catch()`.

```js
// MAL — useEffect espera funcion que retorne undefined o cleanup
useEffect(async () => { ... }, []);

// BIEN — funcion interna async + llamada inmediata
useEffect(() => {
  const fetchData = async () => {
    try {
      const res = await apiClient.get(url);
      setState(res.data ?? []);
    } catch {}
  };
  fetchData();
}, [deps]);
```

Si hay multiples peticiones independientes, usar `Promise.all`:

```js
useEffect(() => {
  const fetchData = async () => {
    try {
      const [resA, resB] = await Promise.all([
        apiClient.get(API_ENDPOINTS.TIPO_FACTURA),
        servicioX.getUltimoCodigo(),
      ]);
      setTiposFactura(resA.data.data ?? []);
      setCodigo(resB.data.data.siguienteCodigo);
    } catch {}
  };
  fetchData();
}, []);
```

**Excepcion:** `reportWebVitals.js` usa `import().then()` (dynamic import de CRA).

---

## 9. Cuando crear hooks de feature

- **NO** crear hooks preventivamente — es abstraccion prematura
- Extraer hooks cuando: (1) componente supera ~300 lineas, (2) logica se reutiliza entre componentes del mismo feature, o (3) logica es testeable independientemente
- Features simples (empresas, almacen) no necesitan hooks
- Features complejas (horas, gastos, obras) si los necesitan

### Reglas del patron orchestrator

- **< 150 lineas** → archivo unico, sin split
- **150-300 lineas** → evaluar si el split aporta claridad
- **> 300 lineas** → split obligatorio en orchestrator (`index.js` dentro de subcarpeta) + componentes presentacionales

---

## 10. Hooks globales — API y uso

### `useGestionEntidad`

```javascript
// El componente crea fetchFunction con useCallback capturando sus filtros.
// El hook llama fetchFunction({ limit, offset }) cuando fetchFunction, paginacion o refreshKey cambian.
const fetchComplejos = useCallback(
  ({ limit, offset }) => complejoService.getAll({ limit, offset, nombre: searchTerm }),
  [searchTerm]
);
const { items, loading, error, setError, pagination, refreshData } =
  useGestionEntidad(fetchComplejos, 20);

// pagination expone: currentPage, totalPaginas, limit, offset, handlePageChange,
//                    resetToFirstPage, startPage, endPage, paginasVisibles
// refreshData() incrementa refreshKey → refetch sin cambiar pagina
```

- Cambio de filtro → nueva referencia de `fetchFunction` → useEffect re-ejecuta
- Busqueda/filtro: llamar `pagination.resetToFirstPage()` ANTES o en el mismo batch que el cambio de filtro

### `useServerPagination`

```javascript
const {
  currentPage, totalPaginas, limit, offset,
  startPage, endPage, paginasVisibles,
  handlePageChange, resetToFirstPage,
} = useServerPagination(total, defaultLimit);
```

Compatible con `PaginationControl`. Se mantiene `usePaginacion` (client-side) para features legacy.

### `useBusquedaMultiple`

```javascript
const contactos = useBusquedaMultiple(
  (nombre) => apiClient.get(API_ENDPOINTS.CONTACTO, { params: { nombre, limit: 10 } }),
  { minLength: 2, keyField: "id" }
);
// → contactos.busqueda, .sugerencias, .seleccionados, .handleBuscar, .seleccionar, .remover, .limpiar
```

Incluye race condition protection (`requestRef`). Compatible con `SearchableMultiSelect`.

### `useCrudEntidad` (modales CRUD en DetalleObra)

```javascript
const hook = useCrudEntidad({
  fetchFunction, fetchParams,
  createFunction, updateFunction, deleteFunction,
  initialForm: { /* campos del formulario */ },
  camposNumericos: ["idObra", "importe"],  // Coercion automatica antes de enviar al API
  transformBeforeSave: (data) => ({        // Mapeo nombres formulario → nombres API
    fecha: data.fechaPedido,
    ...data,
  }),
  transformAfterFetch: (items) => items.map(/* BD → formulario */),
  validarForm: (form) => null,             // null = OK, string = error
  confirmDelete: "¿Seguro?",
});
```

**Reglas:**
- **`camposNumericos`**: Obligatorio si el formulario incluye IDs o importes. `handleGuardar` aplica `Number()` automaticamente antes de enviar al API. Resuelve el problema de `useParams()` devolviendo strings y de valores iniciales que no pasan por `handleChange`.
- **`transformBeforeSave`**: Obligatorio si los nombres de campo del formulario difieren de los que espera el validator Zod. Ejemplo: formulario usa `fechaPedido` pero el validator espera `fecha`.
- **`transformAfterFetch`**: Para mapear nombres de BD (snake_case) a nombres de formulario (camelCase) al editar.

### `SearchableMultiSelect` vs `SearchableSelect`

- `SearchableMultiSelect`: `selectedItems` (array), `onRemove(item)` recibe item completo, renderiza `ListGroup` con boton "Quitar"
- `SearchableSelect`: `selected` (object), `onRemove()` sin argumentos

---

## 11. Patrones de componentes

### Patron Gestion (listado)

1. `useGestionEntidad(fetchFunction, defaultLimit)` para fetch paginado
2. Busqueda: `searchInput` (input local) + `searchTerm` (enviado al backend) + `handleSearch`
3. Filtros dropdown con `resetToFirstPage()`
4. `useSeleccionMultiple` para checkboxes batch
5. `PaginationControl` para navegacion
6. Barra acciones: Nueva/Baja/Imprimir
7. `Table striped bordered hover`
8. Loading/Error: `Spinner` centrado + `Alert dismissible`

### Patron Creacion

1. `useFormulario(INITIAL_FORM)` para estado del formulario
2. `useEffect` al montar para cargar catalogos (tipoFactura, tipoIva, etc.)
3. `handleGuardar` con validacion, build payload, `service.create()`, navigate
4. Botones Guardar + Cancelar con `useNavigate()`
5. `Card` con `Form` > `Row`/`Col` > `Form.Group`

### Patron Detalle (edicion)

1. `useParams()` + `service.getById(id)` al montar
2. Toggle `editando` (read-only por defecto → click "Editar" → editables)
3. `service.update(id, payload)` + revert a `formOriginal` si cancela
4. `service.delete([id])` con confirmacion + navigate
5. `Form[Entidad].jsx` compartido entre Crear y Detalle
6. Relaciones editables: `useBusquedaMultiple` + `SearchableMultiSelect` en edicion / `ListGroup` en lectura
7. Creacion inline: `useModal` + `ModalNuevoContacto` + guardado diferido (`_tempId` + `Badge "nuevo"`)

### Patron Servicio

```javascript
export const [entidad]Service = {
  getAll: (filters) => apiClient.get(ENDPOINT, { params: filters }),
  getById: (id) => apiClient.get(`${ENDPOINT}/${id}`),
  create: (data) => apiClient.post(ENDPOINT, data),
  update: (id, data) => apiClient.patch(`${ENDPOINT}/${id}`, data),
  delete: (ids) => apiClient.delete(ENDPOINT, { data: { ids } }),
};
```

---

## 12. Catalogos cross-feature

- Mantener `apiClient` + `API_ENDPOINTS` para lookups de catalogos (tipoObra, estadoObra, etc.)
- Los servicios legacy en `Services/` (estadoObra, tipoFacturable, tipoObra) se eliminaran
- Si en el futuro se necesita reutilizar logica de catalogos, crear un `services/catalog.service.js` global
