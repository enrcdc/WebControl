import { useBusquedaEntidad } from "./useBusquedaEntidad";
import { edificioService } from "../../Services/edificioService";
import { useCrudEntidad } from "./useCrudEntidad";
import { contactoService } from "../../Services/contactoService";

/**
 * Hook para gestión completa de contactos (CRUD)
 *
 *
 * @returns {Object} Estado y funciones para gestionar contactos
 *
 */

export const useContactos = (empresa) => {
  // Extracción del id y el nombre de la empresa a la que pertenece el contacto
  const { idEmpresa = "", nombreEmpresa = "" } = empresa;

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
      direccion: "",
      email: "",
      telefono2: "",
      email2: "",
      porDefecto: "",
      fechaBaja: "",
      observaciones: "",
      idEmpresa: idEmpresa,
      empresa: nombreEmpresa,
    },
  });

  // Hook useModal que proporciona las operaciones comunes de una modal
  const { show, handleOpen, handleClose } = useModal();

  // Hook de búsqueda de entidad (complejo en este caso)
  const {
    busquedaComplejo,
    sugerenciasComplejos,
    complejoSeleccionado,
    handleBuscar,
    seleccionarComplejo,
    eliminarSeleccion,
    limpiar,
  } = useBusquedaEntidad(
    (termino) => edificioService.buscarPorNombre(termino),
    { minLength: 3 },
  );

  return {
    show,
    handleOpen,
    handleClose,
    busquedaComplejo,
    sugerenciasComplejos,
    complejoSeleccionado,
    handleBuscar,
    seleccionarComplejo,
    eliminarSeleccion,
    limpiar,
  };
};
