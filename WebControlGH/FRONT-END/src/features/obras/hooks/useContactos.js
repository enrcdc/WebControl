import { useBusquedaEntidad } from "../../../hooks/useBusquedaEntidad.js";
import { useCrudEntidad } from "../../../hooks/useCrudEntidad.js";
import { apiClient } from "../../../Services/api/client.js";
import { API_ENDPOINTS } from "../../../constants/api";

// TODO: Dependencias cross-feature — edificio, empresa, contacto se migrarán a sus features propias

/**
 * Hook para gestión completa de contactos (CRUD)
 *
 * @returns {Object} Estado y funciones para gestionar contactos
 */
export const useContactos = () => {
  // Hook para operaciones CRUD y modal
  const contactosHook = useCrudEntidad({
    fetchFunction: () => apiClient.get(API_ENDPOINTS.CONTACTO),

    // Configuración de operaciones CRUD (TODO: Faltan más)
    createFunction: (data) => apiClient.post(API_ENDPOINTS.CONTACTO, data),

    // Formulario inicial
    initialForm: {
      nombre: "",
      apellido1: "",
      apellido2: "",
      dni: "",
      telefono: "",
      telefono2: "",
      email: "",
      email2: "",
      direccion: "",
      observaciones: "",
      empresa: null,
      complejos: [],
    },
  });

  // Hook de búsqueda de entidad (complejo y empresa en este caso)
  const buscadorComplejos = useBusquedaEntidad(
    (termino) =>
      apiClient.get(API_ENDPOINTS.EDIFICIO, {
        params: { nombre: termino, limit: 10 },
      }),
    { minLength: 3 },
  );

  const buscadorEmpresas = useBusquedaEntidad(
    (termino) =>
      apiClient.get(API_ENDPOINTS.EMPRESA, {
        params: { nombre: termino, limit: 10 },
      }),
    { minLength: 3 },
  );

  const agregarEmpresa = (empresa) => {
    contactosHook.updateField("empresa", empresa);
    buscadorEmpresas.seleccionar(empresa);
  };

  const eliminarEmpresa = () => {
    contactosHook.updateField("empresa", null);
    buscadorEmpresas.eliminarSeleccion();
  };

  const agregarComplejo = (complejo) => {
    const complejos = contactosHook.getFieldValue("complejos");
    if (!complejos.some((c) => c.id === complejo.id)) {
      contactosHook.updateField("complejos", complejos.concat(complejo));
    }
    buscadorComplejos.limpiar();
  };

  const eliminarComplejo = (complejo) => {
    const complejos = contactosHook.getFieldValue("complejos");
    contactosHook.updateField(
      "complejos",
      complejos.filter((c) => c.id !== complejo.id),
    );
  };

  const handleGuardar = () => {
    contactosHook.handleGuardar();
    limpiar();
  };

  const handleClose = () => {
    contactosHook.setShowModal(false);
    limpiar();
  };

  const limpiar = () => {
    buscadorComplejos.limpiar();
    buscadorEmpresas.limpiar();
  };

  return {
    showModal: contactosHook.showModal,
    formData: contactosHook.formData,

    // Complejos
    busquedaComplejos: buscadorComplejos.busqueda,
    sugerenciasComplejos: buscadorComplejos.sugerencias,
    handleBuscarComplejo: buscadorComplejos.handleBuscar,
    agregarComplejo,
    eliminarComplejo,

    // Empresa
    busquedaEmpresa: buscadorEmpresas.busqueda,
    sugerenciasEmpresas: buscadorEmpresas.sugerencias,
    handleBuscarEmpresa: buscadorEmpresas.handleBuscar,
    agregarEmpresa,
    eliminarEmpresa,

    setShowModal: contactosHook.setShowModal,
    // Para abrir la modal
    handleAgregar: contactosHook.handleAgregar,
    handleChangeForm: contactosHook.handleChangeForm,
    handleGuardar: handleGuardar,
    handleClose,
  };
};
