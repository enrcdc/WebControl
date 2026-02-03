# Arquitectura de Hooks - Módulo Obra

Este documento describe la arquitectura de hooks refactorizada para el módulo de Obras del sistema WebControl.

## Índice

1. [Visión General](#visión-general)
2. [Arquitectura de 3 Niveles](#arquitectura-de-3-niveles)
3. [Hooks Atómicos (Nivel 1)](#hooks-atómicos-nivel-1)
4. [Hooks Compuestos (Nivel 2)](#hooks-compuestos-nivel-2)
5. [Hooks de Dominio (Nivel 3)](#hooks-de-dominio-nivel-3)
6. [Guía de Uso](#guía-de-uso)
7. [Migraciones desde Hooks Obsoletos](#migraciones-desde-hooks-obsoletos)

---

## Visión General

La refactorización de hooks sigue una arquitectura de **separación de responsabilidades** basada en 3 niveles:

- **Nivel 1 (Atómicos)**: Hooks de responsabilidad única y máxima reutilización
- **Nivel 2 (Compuestos)**: Composición de hooks atómicos para patrones comunes
- **Nivel 3 (Dominio)**: Lógica de negocio específica usando hooks compuestos

### Beneficios

- ✅ **Reducción de código**: Hasta 56% menos líneas en hooks complejos
- ✅ **Reutilización**: Un hook puede usarse en múltiples contextos
- ✅ **Mantenibilidad**: Cambios en un lugar se propagan a todos los usos
- ✅ **Testabilidad**: Hooks más pequeños y fáciles de testear
- ✅ **Documentación**: JSDoc completo con ejemplos de uso

---

## Arquitectura de 3 Niveles

```
┌─────────────────────────────────────────────────────────┐
│                   Nivel 3: Dominio                      │
│  useObraData, useObrasLista, usePedidos, useFacturas... │
└───────────────────────┬─────────────────────────────────┘
                        │
┌───────────────────────▼─────────────────────────────────┐
│                 Nivel 2: Compuestos                     │
│    useCrudEntidad, useObraForm, useObrasRelacionadas    │
└───────────────────────┬─────────────────────────────────┘
                        │
┌───────────────────────▼─────────────────────────────────┐
│                  Nivel 1: Atómicos                      │
│  useApiRequest, useFormulario, useModal, useBusqueda... │
└─────────────────────────────────────────────────────────┘
```

---

## Hooks Atómicos (Nivel 1)

### useApiRequest.js

**Propósito**: Gestión genérica de peticiones HTTP con estados de carga y error.

**Uso**:




```javascript
import { useApiRequest } from "./useApiRequest.js";

const MiComponente = () => {
  const apiRequest = useApiRequest();

  const cargarDatos = async () => {

    const resultado = await apiRequest.execute(() =>
      miServicio.obtenerDatos()
    );

    const resultado = await apiRequest.execute(() => miServicio.obtenerDatos());

    if (resultado) {
      console.log("Datos cargados:", resultado);
    }
  };

  return (
    <div>
      {apiRequest.loading && <p>Cargando...</p>}
      {apiRequest.error && <p>Error: {apiRequest.error}</p>}
      <button onClick={cargarDatos}>Cargar</button>
    </div>
  );
};
```

**API**:




- `execute(apiFunction, options)`: Ejecuta petición con manejo de estados
- `loading`: Estado de carga
- `error`: Mensaje de error
- `data`: Datos de respuesta
- `reset()`: Limpia todos los estados

---

### useFormulario.js

**Propósito**: Gestión de estado de formularios con manejo automático de campos.

**Uso**:




```javascript
import { useFormulario } from "./useFormulario.js";

const FormularioObra = () => {
  const { formData, handleChange } = useFormulario(
    { codigo: "", descripcion: "", horas: 0 },
    ["horas"] // campos numéricos
  );

  return (
    <form>
      <input name="codigo" value={formData.codigo} onChange={handleChange} />

      <input name="descripcion" value={formData.descripcion} onChange={handleChange} />
      <input name="horas" type="number" value={formData.horas} onChange={handleChange} />

      <input
        name="descripcion"
        value={formData.descripcion}
        onChange={handleChange}
      />
      <input
        name="horas"
        type="number"
        value={formData.horas}
        onChange={handleChange}
      />

    </form>
  );
};
```

**API**:




- `formData`: Objeto con valores del formulario
- `handleChange(e)`: Handler para inputs
- `updateFields(objeto)`: Actualiza múltiples campos
- `updateField(nombre, valor)`: Actualiza un campo
- `resetForm()`: Resetea al estado inicial
- `resetFormTo(nuevosDatos)`: Resetea a nuevos datos

---

### useModal.js

**Propósito**: Gestión de estado de modales con modo edición.

**Uso**:




```javascript
import { useModal } from "./useModal.js";

const ListaConModal = () => {
  const modal = useModal();

  return (
    <>
      <button onClick={modal.handleOpen}>Crear nuevo</button>
      <button onClick={() => modal.handleOpenEdit(123)}>Editar #123</button>

      <Modal show={modal.show} onHide={modal.handleClose}>
        <h3>{modal.isEditMode() ? "Editar" : "Crear"}</h3>
      </Modal>
    </>
  );
};
```

**API**:




- `show`: Boolean de visibilidad
- `editID`: ID en modo edición (null en modo creación)
- `handleOpen()`: Abre modal en modo creación
- `handleOpenEdit(id)`: Abre modal en modo edición
- `handleClose()`: Cierra modal
- `isEditMode()`: Retorna true si está editando

---

### useBusquedaEntidad.js

**Propósito**: Búsqueda genérica con autocompletado y selección.

**Uso**:




```javascript
import { useBusquedaEntidad } from "./useBusquedaEntidad.js";
import { obraService } from "../Services/obraService.js";

const BuscadorObras = () => {
  const busqueda = useBusquedaEntidad(
    (termino) => obraService.searchObras(termino),
    { minLength: 3 }
  );

  return (
    <div>
      <input
        value={busqueda.busqueda}
        onChange={busqueda.handleBuscar}
        placeholder="Buscar obra..."
      />
      <ul>

        {busqueda.sugerencias.map(obra => (

        {busqueda.sugerencias.map((obra) => (

          <li key={obra.id_obra} onClick={() => busqueda.seleccionar(obra)}>
            {obra.codigo_obra} - {obra.descripcion_obra}
          </li>
        ))}
      </ul>
      {busqueda.entidadSeleccionada && (
        <div>
          Seleccionada: {busqueda.entidadSeleccionada.codigo_obra}
          <button onClick={busqueda.eliminarSeleccion}>✕</button>
        </div>
      )}
    </div>
  );
};
```

**API**:




- `busqueda`: Término de búsqueda actual
- `sugerencias`: Array de resultados
- `entidadSeleccionada`: Entidad seleccionada (o null)
- `handleBuscar(e)`: Handler del input de búsqueda
- `seleccionar(entidad)`: Selecciona una entidad
- `eliminarSeleccion()`: Limpia la selección
- `limpiar()`: Limpia todo (búsqueda + sugerencias + selección)

---

### useSeleccionMultiple.js

**Propósito**: Gestión de selección múltiple con checkboxes.

**Uso**:




```javascript
import { useSeleccionMultiple } from "./useSeleccionMultiple.js";

const ListaObras = ({ obras }) => {
  const seleccion = useSeleccionMultiple("id_obra");

  return (
    <>
      <input
        type="checkbox"
        checked={seleccion.selectAll}
        onChange={() => seleccion.handleSelectAll(obras)}
      />

      {obras.map(obra => (

      {obras.map((obra) => (

        <div key={obra.id_obra}>
          <input
            type="checkbox"
            checked={seleccion.isSelected(obra.id_obra)}
            onChange={() => seleccion.handleSelect(obra.id_obra)}
          />
          {obra.codigo_obra}
        </div>
      ))}
      <p>Seleccionadas: {seleccion.getSelectedCount()}</p>
      <button disabled={!seleccion.hasSelection()}>Eliminar</button>
    </>
  );
};
```

**API**:




- `selected`: Array de IDs seleccionados
- `selectAll`: Estado del checkbox "seleccionar todo"
- `handleSelect(id)`: Toggle selección de un item
- `handleSelectAll(items)`: Toggle selección de todos
- `clearSelections()`: Limpia todas las selecciones
- `isSelected(id)`: Verifica si un item está seleccionado
- `getSelectedCount()`: Número de items seleccionados
- `hasSelection()`: Retorna true si hay al menos 1 seleccionado

---

### useCheckboxCondicional.js

**Propósito**: Checkbox que ejecuta acciones al marcar/desmarcar.

**Uso**:




```javascript
import { useCheckboxCondicional } from "./useCheckboxCondicional.js";

const FormularioObra = () => {
  const ofertado = useCheckboxCondicional(
    false,
    () => console.log("Obra marcada como ofertada"),
    () => console.log("Obra desmarcada como ofertada")
  );

  return (
    <input
      type="checkbox"
      checked={ofertado.checked}
      onChange={ofertado.handleToggle}
    />
  );
};
```

**API**:




- `checked`: Estado actual del checkbox
- `handleToggle()`: Cambia estado y ejecuta callbacks
- `setValue(valor)`: Establece valor sin ejecutar callbacks
- `check()`: Marca checkbox y ejecuta onCheck
- `uncheck()`: Desmarca checkbox y ejecuta onUncheck

---

### useCatalogosBase.js

**Propósito**: Carga de catálogos/dropdowns para formularios de obra.

**Uso**:




```javascript
import { useCatalogosBase } from "./useCatalogosBase.js";

const FormularioObra = () => {
  const { catalogos, loading, fetchContactosEmpresa } = useCatalogosBase();

  useEffect(() => {
    if (idEmpresa) {
      fetchContactosEmpresa(idEmpresa);
    }
  }, [idEmpresa]);

  return (
    <>
      {loading && <p>Cargando catálogos...</p>}
      <select>

        {catalogos.tiposObra.map(tipo => (

        {catalogos.tiposObra.map((tipo) => (

          <option key={tipo.id_tipo_obra} value={tipo.id_tipo_obra}>
            {tipo.descripcion}
          </option>
        ))}
      </select>
    </>
  );
};
```

**API**:




- `catalogos`: Objeto con todos los catálogos
  - `tiposObra`, `estadosObra`, `empresas`, `edificios`, `contactos`, `usuarios`
- `loading`: Estado de carga
- `fetchContactosEmpresa(idEmpresa)`: Carga contactos de una empresa

---

## Hooks Compuestos (Nivel 2)

### useCrudEntidad.js ⭐

**Propósito**: Patrón CRUD genérico que elimina código repetitivo.

**Caso de uso**: Cualquier entidad con operaciones CRUD (pedidos, facturas, gastos, etc.)

**Uso básico**:




```javascript
import { useCrudEntidad } from "./useCrudEntidad.js";
import { pedidoService } from "../Services/pedidoService.js";

const usePedidos = (idObra) => {
  const crud = useCrudEntidad({
    fetchFunction: (ids) => pedidoService.getPedidos(ids),
    fetchParams: [[idObra]],
    createFunction: pedidoService.createPedido,
    updateFunction: pedidoService.updatePedido,
    deleteFunction: pedidoService.deletePedido,
    initialForm: {
      fechaPedido: "",
      codigoPedido: "",
      importe: "",

      idObra: idObra

      idObra: idObra,

    },
    camposNumericos: ["importe"],
    validarForm: (form) => {
      if (!form.codigoPedido || !form.importe) {
        return "Faltan campos obligatorios";
      }
      return null;
    },

    confirmDelete: "¿Eliminar este pedido?"

    confirmDelete: "¿Eliminar este pedido?",

  });

  return {
    pedidos: crud.items,
    loading: crud.loading,
    showModal: crud.showModal,
    formData: crud.formData,
    handleAgregar: crud.handleAgregar,
    handleEditar: crud.handleEditar,
    handleGuardar: crud.handleGuardar,
    handleEliminar: crud.handleEliminar,
    handleChangeForm: crud.handleChangeForm,
    fetchPedidos: crud.fetchItems,

    handleCloseModal: crud.handleCloseModal

    handleCloseModal: crud.handleCloseModal,

  };
};
```

**Configuración completa**:




```javascript
{
  // REQUERIDOS
  fetchFunction: async (...params) => Response,  // Obtener items
  createFunction: async (data) => Response,      // Crear item
  updateFunction: async (id, data) => Response,  // Actualizar item
  deleteFunction: async (id) => Response,        // Eliminar item
  initialForm: {},                               // Formulario vacío

  // OPCIONALES
  fetchParams: [],                               // Parámetros para fetchFunction
  camposNumericos: [],                           // Campos numéricos del form
  validarForm: (formData) => errorMsg | null,    // Validación personalizada
  confirmDelete: "Mensaje",                      // Mensaje de confirmación
  transformBeforeSave: (data) => transformedData, // Transformar antes de guardar
  transformAfterFetch: (data) => transformedData, // Transformar después de obtener
  onSuccessCreate: (data) => void,               // Callback después de crear
  onSuccessUpdate: (data) => void,               // Callback después de actualizar
  onSuccessDelete: (id) => void                  // Callback después de eliminar
}
```

**Reducción de código**: Hasta 70% menos líneas vs implementación manual

---

### useCrudConBusqueda.js

**Propósito**: CRUD + búsqueda de entidades (productos, facturas, etc.)

**Uso**:




```javascript
import { useCrudConBusqueda } from "./useCrudConBusqueda.js";

const useGastosAlmacen = (idObra) => {
  const gastosAlmacen = useCrudConBusqueda({
    // Configuración CRUD
    fetchFunction: (ids) => obraService.getGastosAlmacen(ids),
    fetchParams: [[idObra]],
    createFunction: obraService.createGastoAlmacen,
    updateFunction: obraService.updateGastoAlmacen,
    deleteFunction: obraService.deleteGastoAlmacen,
    initialForm: {
      cantidad: 0,
      precio: 0,
      idProducto: null,

      idObra: idObra

      idObra: idObra,

    },

    // Configuración de búsqueda
    buscarFunction: (termino) => productoService.searchProductos(termino),
    minLength: 3,

    // Callbacks para sincronizar form con búsqueda
    onSeleccionarEntidad: (producto, updateField) => {
      updateField("idProducto", producto.id_producto);
      updateField("precio", producto.precio);
    },
    onEliminarSeleccion: (updateField) => {
      updateField("idProducto", null);
      updateField("precio", 0);

    }

    },

  });

  return {
    gastos: gastosAlmacen.items,
    // ... resto de propiedades CRUD
    busquedaProducto: gastosAlmacen.busqueda,
    sugerenciasProducto: gastosAlmacen.sugerencias,
    productoSeleccionado: gastosAlmacen.entidadSeleccionada,
    handleBuscarProducto: gastosAlmacen.handleBuscar,
    handleSeleccionarProducto: gastosAlmacen.handleSeleccionar,

    handleEliminarProducto: gastosAlmacen.handleEliminarSeleccion

    handleEliminarProducto: gastosAlmacen.handleEliminarSeleccion,

  };
};
```

---

### useObraForm.js

**Propósito**: Gestión completa del formulario de obra (datos + catálogos + checkboxes).

**Uso**:




```javascript
import { useObraForm } from "./useObraForm.js";

const CrearObra = () => {
  const {
    formObra,
    catalogos,
    ofertado,
    enSeguimiento,
    handleChange,
    handleChangeOfertado,
    handleChangeSeguimiento,

    fetchContactosEmpresa

    fetchContactosEmpresa,

  } = useObraForm();

  return (
    <form>
      <input name="cod" value={formObra.cod} onChange={handleChange} />
      <input
        type="checkbox"
        checked={ofertado.checked}
        onChange={ofertado.handleToggle}
      />
      <select name="tipoObra" value={formObra.tipoObra} onChange={handleChange}>

        {catalogos.tiposObra.map(tipo => (

        {catalogos.tiposObra.map((tipo) => (

          <option key={tipo.id_tipo_obra} value={tipo.id_tipo_obra}>
            {tipo.descripcion}
          </option>
        ))}
      </select>
    </form>
  );
};
```

**API**:




- `formObra`: Datos del formulario
- `catalogos`: Todos los catálogos cargados
- `ofertado`: Hook del checkbox "Ofertado"
- `enSeguimiento`: Hook del checkbox "En seguimiento"
- `handleChange`: Handler para campos del formulario
- `handleChangeOfertado`: Handler para checkbox ofertado
- `handleChangeSeguimiento`: Handler para checkbox seguimiento
- `updateObraFields`: Actualizar múltiples campos
- `resetObraForm`: Resetear formulario
- `fetchContactosEmpresa`: Cargar contactos de empresa

---

### useObrasRelacionadas.js

**Propósito**: Gestión de relaciones padre-hijos entre obras.

**Uso en creación**:




```javascript
import { useObrasRelacionadas } from "./useObrasRelacionadas.js";

const CrearObra = () => {
  const obrasRelacionadas = useObrasRelacionadas(null); // null = modo creación

  return (
    <>
      {/* Búsqueda obra padre */}
      <input
        value={obrasRelacionadas.obraPadreBusqueda}
        onChange={obrasRelacionadas.handleObraPadreBusqueda}
      />

      {obrasRelacionadas.sugerenciasPadre.map(obra => (

      {obrasRelacionadas.sugerenciasPadre.map((obra) => (

        <div onClick={() => obrasRelacionadas.seleccionarObraPadre(obra)}>
          {obra.codigo_obra}
        </div>
      ))}

      {/* Búsqueda obras hijas */}
      <input
        value={obrasRelacionadas.obraHijaBusqueda}
        onChange={obrasRelacionadas.handleObraHijaBusqueda}
      />

      {obrasRelacionadas.sugerenciasHijas.map(obra => (

      {obrasRelacionadas.sugerenciasHijas.map((obra) => (

        <div onClick={() => obrasRelacionadas.agregarObraHija(obra)}>
          {obra.codigo_obra}
        </div>
      ))}
    </>
  );
};
```

**Uso en edición**:




```javascript
const EditarObra = ({ idObra }) => {
  const obrasRelacionadas = useObrasRelacionadas(idObra); // Carga relaciones existentes

  // Automáticamente carga obra padre y obras hijas
  // El resto del código es igual
};
```

**API**:




- `obraPadreBusqueda`: Término de búsqueda del padre
- `sugerenciasPadre`: Sugerencias de obras padre
- `obraPadreSeleccionada`: Obra padre seleccionada
- `handleObraPadreBusqueda`: Handler búsqueda padre
- `seleccionarObraPadre`: Seleccionar obra padre
- `eliminarObraPadre`: Eliminar selección padre
- `obraHijaBusqueda`: Término de búsqueda hijas
- `sugerenciasHijas`: Sugerencias de obras hijas
- `obrasHijasSeleccionadas`: Array de obras hijas
- `handleObraHijaBusqueda`: Handler búsqueda hijas
- `agregarObraHija`: Agregar obra hija
- `eliminarObraHija`: Eliminar obra hija

---

## Hooks de Dominio (Nivel 3)

### useObraData.js

**Propósito**: Gestión de datos completos de una obra individual (vista/edición).

**Uso**:




```javascript
import { useObraData } from "./useObraData.js";

const DetalleObra = ({ idObra }) => {
  const {
    obra,
    loading,
    formObra,
    catalogos,
    ofertado,
    enSeguimiento,
    obrasRelacionadas,
    handleChange,
    handleChangeOfertado,
    handleChangeSeguimiento,
    handleGuardarCambios,

    fetchObra

    fetchObra,

  } = useObraData(idObra);

  if (loading) return <p>Cargando...</p>;

  return (
    <form onSubmit={handleGuardarCambios}>
      {/* Formulario completo de obra */}
    </form>
  );
};
```

**Reducción**: 275 → 150 líneas (45% menos)

---

### useObrasLista.js

**Propósito**: Gestión de lista de obras con paginación y selección múltiple.

**Uso**:




```javascript
import { useObrasLista } from "./useObrasLista.js";

const GestionObras = () => {
  const {
    obras,
    loading,
    error,
    totalPages,
    currentPage,
    itemsPerPage,
    criteriosBusqueda,
    selectedObras,
    selectAll,
    handlePageChange,
    handleItemsPerPageChange,
    handleCriterioChange,
    handleSelect,
    handleSelectAll,
    handleBuscar,
    clearFilters,
    clearSelections,

    fetchObras

    fetchObras,

  } = useObrasLista();

  return (
    <>
      {/* Filtros de búsqueda */}
      {/* Tabla de obras */}
      {/* Paginación */}
    </>
  );
};
```

**Reducción**: 124 → 100 líneas (19% menos)

---

### usePedidos.js

**Propósito**: Gestión CRUD de pedidos de una obra.

**Uso**:




```javascript
import { usePedidos } from "./usePedidos.js";

const PedidosObra = ({ idObra }) => {
  const {
    pedidos,
    loading,
    showModal,
    formData,
    handleAgregar,
    handleEditar,
    handleGuardar,
    handleEliminar,
    handleChangeForm,

    handleCloseModal

    handleCloseModal,

  } = usePedidos(idObra);

  return (
    <>
      <button onClick={handleAgregar}>Nuevo pedido</button>
      <table>

        {pedidos.map(pedido => (

        {pedidos.map((pedido) => (

          <tr key={pedido.id_pedido}>
            <td>{pedido.codigo_pedido}</td>
            <td>{pedido.importe}€</td>
            <td>

              <button onClick={() => handleEditar(pedido.id_pedido)}>Editar</button>
              <button onClick={() => handleEliminar(pedido.id_pedido)}>Eliminar</button>

              <button onClick={() => handleEditar(pedido.id_pedido)}>
                Editar
              </button>
              <button onClick={() => handleEliminar(pedido.id_pedido)}>
                Eliminar
              </button>

            </td>
          </tr>
        ))}
      </table>

      <Modal show={showModal} onHide={handleCloseModal}>
        {/* Formulario de pedido */}
      </Modal>
    </>
  );
};
```

**Reducción**: 122 → 90 líneas (26% menos)

---

### useFacturas.js

**Propósito**: Gestión CRUD de facturas de una obra.

Similar a usePedidos pero con funcionalidad adicional de autocompletar importe desde pedidos.

**Reducción**: 155 → 100 líneas (35% menos)

---

### useGastos.js

**Propósito**: Gestión de gastos (almacén + compras) con búsqueda de productos/facturas.

**Uso**:




```javascript
import { useGastos } from "./useGastos.js";

const GastosObra = ({ idObra }) => {
  const {
    // Gastos Almacén
    gastosAlmacen,
    showModalAlmacen,
    formAlmacen,
    busquedaProducto,
    productoSeleccionado,
    handleAgregarAlmacen,
    handleEditarAlmacen,
    handleGuardarAlmacen,
    handleEliminarAlmacen,
    handleChangeAlmacen,
    handleBuscarProducto,

    // Gastos Compras
    gastosCompras,
    showModalCompras,
    formCompras,
    busquedaFactura,
    facturaSeleccionada,
    handleAgregarCompras,
    handleEditarCompras,
    handleGuardarCompras,
    handleEliminarCompras,
    handleChangeCompras,

    handleBuscarFactura

    handleBuscarFactura,

  } = useGastos(idObra);

  return (
    <>
      {/* Sección Gastos Almacén */}
      {/* Sección Gastos Compras */}
    </>
  );
};
```

**Reducción**: 386 → 170 líneas (56% menos) 🏆

---

### useOperacionesObras.js

**Propósito**: Operaciones sobre múltiples obras (finalizar, borrar, copiar, imprimir).

**Uso**:

```javascript
import { useOperacionesObras } from "./useOperacionesObras.js";

const BarraHerramientas = ({ selectedObras, obras, fetchObras, clearSelections }) => {


```javascript
import { useOperacionesObras } from "./useOperacionesObras.js";

const BarraHerramientas = ({
  selectedObras,
  obras,
  fetchObras,
  clearSelections,
}) => {

  const {
    handleAgregarObra,
    handleFinalizarObra,
    handleBajaObras,
    handleCopiarObras,

    handleImprimirObras

    handleImprimirObras,

  } = useOperacionesObras(fetchObras, clearSelections, setCurrentPage);

  return (
    <>
      <button onClick={handleAgregarObra}>Nueva obra</button>
      <button onClick={() => handleBajaObras(selectedObras)}>Eliminar</button>

      <button onClick={() => handleCopiarObras(selectedObras, obras)}>Copiar</button>
      <button onClick={() => handleImprimirObras(selectedObras)}>Imprimir</button>

      <button onClick={() => handleCopiarObras(selectedObras, obras)}>
        Copiar
      </button>
      <button onClick={() => handleImprimirObras(selectedObras)}>
        Imprimir
      </button>

    </>
  );
};
```

**Reducción**: 140 → 125 líneas (11% menos)

---

### useCrearObra.js

**Propósito**: Orquestación del proceso completo de creación de obra.

**Uso**:




```javascript
import { useCrearObra } from "./useCrearObra.js";

const CrearObra = () => {
  const { loading, handleGuardar, handleCancelar } = useCrearObra();
  const obraForm = useObraForm();
  const obrasRelacionadas = useObrasRelacionadas(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    await handleGuardar(
      obraForm.formObra,
      obrasRelacionadas.obraPadreSeleccionada,
      obrasRelacionadas.obrasHijasSeleccionadas
    );
  };

  return (
    <form onSubmit={handleSubmit}>
      {/* Formulario */}

      <button type="submit" disabled={loading}>Guardar</button>

      <button type="submit" disabled={loading}>
        Guardar
      </button>

      <button onClick={handleCancelar}>Cancelar</button>
    </form>
  );
};
```

---

## Guía de Uso

### ¿Qué hook usar según tu caso?

#### Caso 1: Necesito un formulario simple

✅ Usar: `useFormulario`

```javascript
const { formData, handleChange } = useFormulario({ nombre: "", edad: 0 }, ["edad"]);


✅ Usar: `useFormulario`

```javascript
const { formData, handleChange } = useFormulario({ nombre: "", edad: 0 }, [
  "edad",
]);

```

---

#### Caso 2: Necesito CRUD completo de una entidad




✅ Usar: `useCrudEntidad`

```javascript
const crud = useCrudEntidad({
  fetchFunction: miServicio.getAll,
  createFunction: miServicio.create,
  updateFunction: miServicio.update,
  deleteFunction: miServicio.delete,

  initialForm: { /* campos */ }

  initialForm: {
    /* campos */
  },

});
```

---

#### Caso 3: Necesito CRUD + búsqueda/selección de otra entidad




✅ Usar: `useCrudConBusqueda`

Ejemplo: Gastos de almacén que requieren buscar productos

---

#### Caso 4: Necesito buscar y seleccionar una entidad

✅ Usar: `useBusquedaEntidad`

```javascript
const busqueda = useBusquedaEntidad(
  (termino) => servicioObras.search(termino)
);


✅ Usar: `useBusquedaEntidad`

```javascript
const busqueda = useBusquedaEntidad((termino) => servicioObras.search(termino));

```

---

#### Caso 5: Necesito selección múltiple con checkboxes




✅ Usar: `useSeleccionMultiple`

```javascript
const { selected, handleSelect, handleSelectAll } = useSeleccionMultiple();
```

---

#### Caso 6: Necesito un modal de crear/editar

✅ Usar: `useModal`

```javascript
const { show, editID, handleOpen, handleOpenEdit, handleClose, isEditMode } = useModal();


✅ Usar: `useModal`

```javascript
const { show, editID, handleOpen, handleOpenEdit, handleClose, isEditMode } =
  useModal();

```

---

#### Caso 7: Necesito hacer peticiones HTTP




✅ Usar: `useApiRequest`

```javascript
const { data, loading, error, execute } = useApiRequest();
```

---

## Migraciones desde Hooks Obsoletos

Los siguientes hooks han sido movidos a `_obsoletos/` y reemplazados:

### useCatalogos.js → useCatalogosBase.js

**Antes**:




```javascript
import { useCatalogos } from "./useCatalogos.js";

const { catalogos, fetchContactosEmpresa } = useCatalogos();
```

**Ahora**:




```javascript
import { useCatalogosBase } from "./useCatalogosBase.js";

const { catalogos, fetchContactosEmpresa } = useCatalogosBase();
```

---

### useFormObra.js → useObraForm.js

**Antes**:




```javascript
import { useFormObra } from "./useFormObra.js";

const {
  formObra,
  ofertado,
  enSeguimiento,
  handleChange,
  handleChangeOfertado,

  handleChangeSeguimiento

  handleChangeSeguimiento,

} = useFormObra();
```

**Ahora**:




```javascript
import { useObraForm } from "./useObraForm.js";

const {
  formObra,
  catalogos, // ⬅️ NUEVO: catálogos incluidos
  ofertado,
  enSeguimiento,
  handleChange,
  handleChangeOfertado,

  handleChangeSeguimiento

  handleChangeSeguimiento,

} = useObraForm();
```

**Cambio principal**: `useObraForm` incluye los catálogos, eliminando necesidad de `useCatalogos` por separado.

---

### useObrasRelacionadasCreacion.js → useObrasRelacionadas.js

**Antes (solo creación)**:




```javascript
import { useObrasRelacionadasCreacion } from "./useObrasRelacionadasCreacion.js";

const obrasRel = useObrasRelacionadasCreacion();
```

**Ahora (creación + edición)**:




```javascript
import { useObrasRelacionadas } from "./useObrasRelacionadas.js";

// Modo creación
const obrasRel = useObrasRelacionadas(null);

// Modo edición (carga relaciones existentes)
const obrasRel = useObrasRelacionadas(idObra);
```

**Cambio principal**: Un solo hook para creación y edición. Pasa `null` para creación, `idObra` para edición.

---

## Resumen de Mejoras


| Hook Refactorizado | Líneas Antes | Líneas Después | Reducción |
|--------------------|--------------|----------------|-----------|
| useGastos          | 386          | 170            | **56%** 🏆 |
| useObraData        | 275          | 150            | **45%** |
| useFacturas        | 155          | 100            | **35%** |
| usePedidos         | 122          | 90             | **26%** |
| useObrasLista      | 124          | 100            | **19%** |
| useOperacionesObras| 140          | 125            | **11%** |

| Hook Refactorizado  | Líneas Antes | Líneas Después | Reducción  |
| ------------------- | ------------ | -------------- | ---------- |
| useGastos           | 386          | 170            | **56%** 🏆 |
| useObraData         | 275          | 150            | **45%**    |
| useFacturas         | 155          | 100            | **35%**    |
| usePedidos          | 122          | 90             | **26%**    |
| useObrasLista       | 124          | 100            | **19%**    |
| useOperacionesObras | 140          | 125            | **11%**    |


**Total**: ~1,202 líneas → ~735 líneas = **39% reducción global**

---

## Convenciones y Buenas Prácticas

### 1. Nomenclatura




- Hooks atómicos: `use` + acción genérica (`useFormulario`, `useModal`)
- Hooks compuestos: `use` + patrón (`useCrudEntidad`, `useCrudConBusqueda`)
- Hooks de dominio: `use` + entidad (`useObrasLista`, `usePedidos`)

### 2. Documentación




- Todos los hooks públicos tienen JSDoc completo
- Incluyen ejemplos de uso
- Documentan todos los parámetros y retornos

### 3. Testing




- Los hooks atómicos son fáciles de testear aisladamente
- Los hooks compuestos pueden mockearse con sus dependencias
- Los hooks de dominio testean la integración completa

### 4. Composición sobre Herencia




- Preferir composición de hooks pequeños
- Evitar hooks gigantes con demasiadas responsabilidades
- Cada hook debe tener una única razón para cambiar

---

## Soporte y Contribuciones

Para dudas o mejoras sobre la arquitectura de hooks:

1. Revisa este README primero
2. Consulta el JSDoc del hook específico
3. Revisa los ejemplos de uso en hooks de dominio
4. Si necesitas crear un nuevo hook, sigue la arquitectura de 3 niveles

**Principio clave**: Antes de escribir código nuevo, pregúntate si puedes reutilizar o componer hooks existentes.

---

📝 Última actualización: 2025-10-30
