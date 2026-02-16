// Hook refactorizado para operaciones sobre obras (finalizar, borrar, copiar, imprimir)
import { useNavigate } from "react-router-dom";
import { useApiRequest } from "./useApiRequest.js";
import { obraService } from "../services/obra.service.js";
import { normalizarFecha } from "../utils/fechas.js";

/**
 * Hook para operaciones CRUD de obras (no confundir con el CRUD de entidades individuales)
 * Refactorizado usando useApiRequest
 *
 * @param {Function} fetchObras - Función para recargar obras
 * @param {Function} clearSelections - Función para limpiar selecciones
 * @param {Function} setCurrentPage - Función para cambiar página
 * @param {Function} setObraFacturadaSelec - Función para limpiar selección de obra facturada
 * @returns {Object} Funciones de operaciones sobre obras
 */
export const useOperacionesObras = (
  fetchObras,
  clearSelections,
  setCurrentPage,
  setObraFacturadaSelec = null
) => {
  const navigate = useNavigate();
  const apiRequest = useApiRequest();

  /**
   * Navega a crear nueva obra
   */
  const handleAgregarObra = () => {
    setCurrentPage(1);
    navigate("/home/nuevo-obra");
  };

  /**
   * Finaliza una obra (cambia estado a Finalizada)
   */
  const handleFinalizarObra = async (idObra) => {
    const update = { estadoObra: 4 }; // TODO: No debería estar hardcodeado

    try {
      await apiRequest.execute(() => obraService.update(idObra, update));
      await fetchObras();
      if (setObraFacturadaSelec) {
        setObraFacturadaSelec(null);
      }
      return true;
    } catch (error) {
      console.error(`Error al finalizar la obra - ${error}`);
      return false;
    }
  };

  /**
   * Elimina múltiples obras
   */
  const handleBajaObras = async (selectedObras) => {
    if (selectedObras.length === 0) {
      alert("Por favor, selecciona al menos una obra para dar de baja");
      return false;
    }

    if (!window.confirm("¿Estás seguro de dar de baja las obras seleccionadas?")) {
      return false;
    }

    try {
      // Eliminar obras en paralelo
      const deletePromises = selectedObras.map((id) =>
        obraService.delete(id)
      );
      await Promise.all(deletePromises);

      await fetchObras();
      clearSelections();
      alert("Obras dadas de baja correctamente");
      return true;
    } catch (error) {
      console.error(
        "Error al dar de baja las obras:",
        error.response?.data || error.message
      );
      alert("Error al dar de baja las obras seleccionadas");
      return false;
    }
  };

  /**
   * Copia múltiples obras
   */
  const handleCopiarObras = async (selectedObras, allObras) => {
    if (selectedObras.length === 0) {
      alert("Por favor, selecciona al menos una obra para copiar.");
      return false;
    }

    try {
      // Copiar obras en paralelo
      const copyPromises = selectedObras.map(async (id) => {
        const obra = allObras.find((o) => o.id_obra === id);
        if (!obra) return null;

        const data = {
          cod: obra.codigo_obra,
          desc: obra.descripcion_obra,
          fechaSeg: normalizarFecha(obra.fecha_seg),
          descSeg: obra.descripcion_seg,
          tipoObra: obra.tipo_obra,
          facturable: obra.facturable,
          estadoObra: obra.estado_obra,
          fechaAlta: normalizarFecha(obra.fecha_alta),
          usuarioAlta: obra.codigo_usuario_alta,
          fechaFin: normalizarFecha(obra.fecha_prevista_fin),
          fechaOferta: normalizarFecha(obra.fecha_oferta),
          horasPrevistas: obra.horas_previstas,
          gastoPrevisto: obra.gasto_previsto,
          importe: obra.importe,
          viabilidad: obra.viabilidad,
          empresa: obra.id_empresa,
          contacto: obra.id_contacto,
          edificio: obra.id_edificio,
          observaciones: obra.observaciones,
          observacionesInternas: obra.observaciones_internas,
        };

        return obraService.create(data);
      });

      await Promise.all(copyPromises);
      await fetchObras();
      clearSelections();
      alert("Obras copiadas correctamente");
      return true;
    } catch (error) {
      console.error(`Error al copiar las obras - ${error}`);
      alert("Error al copiar las obras");
      return false;
    }
  };

  /**
   * Navega a impresión de obras
   */
  const handleImprimirObras = (selectedObras) => {
    if (selectedObras.length === 0) {
      alert("Por favor, selecciona al menos una obra para imprimir.");
      return false;
    }

    navigate("/home/imprimir-obra", {
      state: { selectedObras: selectedObras },
    });
    return true;
  };

  return {
    handleAgregarObra,
    handleFinalizarObra,
    handleBajaObras,
    handleCopiarObras,
    handleImprimirObras,
  };
};
