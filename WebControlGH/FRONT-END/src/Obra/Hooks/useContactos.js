import { useBusquedaEntidad } from "./useBusquedaEntidad";
import { edificioService } from "../../Services/edificioService";
import { empresaService } from "../../Services/empresaService";
import { contactoService } from "../../Services/contactoService";
import { useCrudEntidad } from "./useCrudEntidad";

/**
 * Hook para gestión completa de contactos (CRUD)
 *
 *
 * @returns {Object} Estado y funciones para gestionar contactos
 *
 */

export const useContactos = () => {
  // Hook para operaciones CRUD y modal
  const contactosHook = useCrudEntidad({
    fetchFunction: () => contactoService.getAll(),

    // Configuración de operaciones CRUD (TODO: Faltan más)
    createFunction: contactoService.createContacto,

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
    // Una vez creado el usuario con éxito, cargamos los contactos otra vez (TODO: Corregir)
    //onSuccessCreate: () => contactoService.getContactosEmpresa(idEmpresa),
  });

  // Hook de búsqueda de entidad (complejo y empresa en este caso)
  const buscadorComplejos = useBusquedaEntidad(
    (termino) => edificioService.buscarPorNombre(termino),
    { minLength: 3 },
  );

  const buscadorEmpresas = useBusquedaEntidad(
    (termino) => empresaService.buscarPorNombre(termino),
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
