// Hook compuesto para gestión completa del formulario de obra
import { useEffect } from "react";
import { useFormulario } from "./useFormulario.js";
import { useCheckboxCondicional } from "./useCheckboxCondicional.js";
import { useCatalogosBase } from "./useCatalogosBase.js";

/**
 * Hook para gestionar el formulario de obra (crear/editar)
 * Combina formulario, checkboxes condicionales y catálogos
 *
 * @param {Object} obraInicial - Datos iniciales de la obra (null para crear nueva)
 * @returns {Object} Estado y funciones del formulario de obra
 *
 * @example
 * // Crear nueva obra
 * const obraForm = useObraForm(null);
 *
 * // Editar obra existente
 * const obraForm = useObraForm({
 *   cod: 'OB001',
 *   desc: 'Obra ejemplo',
 *   // ... más campos
 * });
 */
export const useObraForm = (obraInicial = null) => {
  const FORM_INICIAL = {
    cod: "",
    desc: "",
    fechaSeg: "",
    descSeg: "",
    tipoObra: "",
    facturable: "",
    estadoObra: "",
    fechaAlta: "",
    usuarioAlta: "",
    fechaFin: "",
    fechaOferta: "",
    horasPrevistas: 0,
    gastoPrevisto: 0,
    importe: 0,
    viabilidad: 100,
    empresa: "",
    contacto: "",
    edificio: "",
    observaciones: "",
    observacionesInternas: "",
  };

  const CAMPOS_NUMERICOS = [
    "tipoObra",
    "facturable",
    "estadoObra",
    "usuarioAlta",
    "horasPrevistas",
    "gastoPrevisto",
    "importe",
    "viabilidad",
    "empresa",
    "contacto",
    "edificio",
  ];

  // Hook de formulario
  const formulario = useFormulario(
    obraInicial || FORM_INICIAL,
    CAMPOS_NUMERICOS
  );

  // Hook de catálogos
  const { catalogos, loading: loadingCatalogos, fetchContactosEmpresa } =
    useCatalogosBase();

  // Checkbox "Ofertado"
  const ofertadoCheckbox = useCheckboxCondicional(
    obraInicial?.fechaOferta ? true : false,
    () => {
      // onCheck: establecer fecha actual si no hay fecha
      if (!formulario.formData.fechaOferta) {
        const fechaActual = new Date().toISOString().split("T")[0];
        formulario.updateField("fechaOferta", fechaActual);
      }
    },
    () => {
      // onUncheck: limpiar fecha de oferta
      formulario.updateField("fechaOferta", "");
    }
  );

  // Checkbox "En Seguimiento"
  const seguimientoCheckbox = useCheckboxCondicional(
    obraInicial?.fechaSeg ? true : false,
    () => {
      // onCheck: establecer fecha actual si no hay fecha
      if (!formulario.formData.fechaSeg) {
        const fechaActual = new Date().toISOString().split("T")[0];
        formulario.updateField("fechaSeg", fechaActual);
      }
    },
    () => {
      // onUncheck: limpiar fecha y descripción de seguimiento
      formulario.updateFields({
        fechaSeg: "",
        descSeg: "",
      });
    }
  );

  // Efecto para cargar contactos cuando cambia la empresa
  useEffect(() => {
    if (formulario.formData.empresa) {
      fetchContactosEmpresa(formulario.formData.empresa);
    }
  }, [formulario.formData.empresa, fetchContactosEmpresa]);

  /**
   * Handler personalizado para el formulario
   * Intercepta cambios de empresa para cargar contactos
   */
  const handleChange = (e) => {
    formulario.handleChange(e);
  };

  return {
    // Datos del formulario
    formObra: formulario.formData,
    setFormObra: formulario.setFormData,
    updateFields: formulario.updateFields,
    updateField: formulario.updateField,

    // Catálogos
    catalogos,
    loadingCatalogos,

    // Checkboxes
    ofertado: ofertadoCheckbox.checked,
    handleChangeOfertado: ofertadoCheckbox.handleToggle,
    setOfertado: ofertadoCheckbox.setValue,
    enSeguimiento: seguimientoCheckbox.checked,
    handleChangeSeguimiento: seguimientoCheckbox.handleToggle,
    setEnSeguimiento: seguimientoCheckbox.setValue,

    // Handlers
    handleChange,
    resetFormulario: formulario.resetForm,
    fetchContactosEmpresa,

    // Valores iniciales (útil para reset)
    FORM_INICIAL,
  };
};
