// Hook refactorizado para cargar y gestionar datos de una obra
import { useState, useEffect, useCallback } from "react";
import { useObraForm } from "./useObraForm.js";
import { useApiRequest } from "./useApiRequest.js";
import { obraService } from "../../Services/obraService.js";
import { rentabilidadService } from "../../Services/rentabilidadService.js";
import { normalizarFecha } from "../Utils/fechas";

/**
 * Hook para gestión completa de datos de una obra (ver/editar)
 * Refactorizado usando useObraForm y useApiRequest
 *
 * @param {number} idObra - ID de la obra
 * @returns {Object} Estado y funciones para gestionar la obra
 */
export const useObraData = (idObra) => {
  const [obra, setObra] = useState({});
  const [rentabilidad, setRentabilidad] = useState({});
  const [editarObra, setEditarObra] = useState(false);

  // Hook de peticiones API
  const apiRequest = useApiRequest();

  // Hook del formulario de obra (inicialmente null, se cargará después)
  const obraForm = useObraForm(null);

  /**
   * Carga los datos de la obra
   */
  const fetchObra = useCallback(async () => {
    try {
      const res = await apiRequest.execute(() => obraService.getObra(idObra));
      if (!res) return;

      const obraData = res[0];
      setObra(obraData);

      // Actualizar formulario con datos de la obra
      const formData = {
        cod: obraData.codigo_obra,
        desc: obraData.descripcion_obra,
        fechaSeg: normalizarFecha(obraData.fecha_seg),
        descSeg: obraData.descripcion_seg,
        tipoObra: Number(obraData.tipo_obra),
        facturable: Number(obraData.facturable),
        estadoObra: Number(obraData.estado_obra),
        fechaAlta: normalizarFecha(obraData.fecha_alta),
        usuarioAlta: Number(obraData.codigo_usuario_alta),
        fechaFin: normalizarFecha(obraData.fecha_prevista_fin),
        fechaOferta: normalizarFecha(obraData.fecha_oferta),
        horasPrevistas: Number(obraData.horas_previstas),
        gastoPrevisto: Number(obraData.gasto_previsto),
        importe: Number(obraData.importe),
        viabilidad: Number(obraData.viabilidad),
        empresa: Number(obraData.id_empresa),
        contacto: Number(obraData.id_contacto),
        edificio: Number(obraData.id_edificio),
        observaciones: obraData.observaciones,
        observacionesInternas: obraData.observaciones_internas,
      };

      obraForm.setFormObra(formData);

      // Actualizar checkboxes basados en las fechas
      obraForm.setEnSeguimiento(!!obraData.fecha_seg, false);
      obraForm.setOfertado(!!obraData.fecha_oferta, false);
    } catch (err) {
      console.error(`Error al obtener la obra - ${err}`);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [idObra]);

  /**
   * Carga la rentabilidad
   */
  const fetchRentabilidad = useCallback(async () => {
    try {
      const res = await apiRequest.execute(() =>
        rentabilidadService.getRentabilidad(idObra),
      );
      if (res) {
        setRentabilidad(res);
      }
    } catch (err) {
      console.error(`Error al obtener la rentabilidad - ${err}`);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [idObra]);

  /**
   * Guarda los cambios de la obra
   */
  const handleGuardarObra = async () => {
    try {
      // Transformar datos antes de enviar: convertir null a string vacío para fechas
      const dataToSend = {
        ...obraForm.formObra,
        fechaOferta: obraForm.formObra.fechaOferta || "",
        fechaSeg: obraForm.formObra.fechaSeg || "",
      };

      console.log("Datos del formulario a enviar:", dataToSend);
      await apiRequest.execute(() =>
        obraService.updateObra(idObra, dataToSend),
      );
      await fetchObra();
      setEditarObra(false);
      return true;
    } catch (error) {
      console.error(`Error al guardar la obra - ${error}`);
      return false;
    }
  };

  /**
   * Cancela la edición
   */
  const handleCancelarObra = () => {
    fetchObra();
    setEditarObra(false);
  };

  /**
   * Elimina la obra
   */
  const handleBajarObra = async (navigate) => {
    if (window.confirm("¿Estás seguro de querer eliminar esta obra?")) {
      try {
        await apiRequest.execute(() => obraService.deleteObra(idObra));
        alert("Obra eliminada correctamente");
        navigate(-1);
        return true;
      } catch (error) {
        alert("Error al eliminar la obra");
        console.error("Error al eliminar la obra", error);
        return false;
      }
    }
    return false;
  };

  // Cargar datos iniciales
  useEffect(() => {
    const loadData = async () => {
      await Promise.all([fetchObra(), fetchRentabilidad()]);
    };
    loadData();
  }, [fetchObra, fetchRentabilidad]);

  return {
    // Datos de la obra
    obra,
    rentabilidad,
    loading: apiRequest.loading,
    error: apiRequest.error,

    // Estado de edición
    editarObra,
    setEditarObra,

    // Formulario (desde useObraForm)
    formObra: obraForm.formObra,
    catalogos: obraForm.catalogos,
    enSeguimiento: obraForm.enSeguimiento,
    ofertado: obraForm.ofertado,
    handleChangeFormObra: obraForm.handleChange,
    handleChangeSeguimiento: obraForm.handleChangeSeguimiento,
    handleChangeOfertado: obraForm.handleChangeOfertado,

    // Operaciones
    handleGuardarObra,
    handleCancelarObra,
    handleBajarObra,
    fetchObra,
  };
};
