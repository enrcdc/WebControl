// Hook refactorizado para orquestar la creación de una obra
import { useNavigate } from "react-router-dom";
import { useApiRequest } from "../../../hooks/useApiRequest.js";
import { obraService, relacionObraService } from "../services/obra.service.js";

/**
 * Hook para orquestar el proceso completo de creación de obra
 * Refactorizado usando useApiRequest
 *
 * @returns {Object} Estado y funciones para crear obra
 */
export const useCrearObra = () => {
  const navigate = useNavigate();
  const apiRequest = useApiRequest();

  /**
   * Proceso completo de creación de obra (obra + relaciones)
   */
  const crearObraCompleta = async (
    formObra,
    obraPadreSeleccionada,
    obrasHijasSeleccionadas,
  ) => {
    try {
      // 1. Crear la obra
      const nuevaObra = await apiRequest.execute(() =>
        obraService.create(formObra),
      );

      if (!nuevaObra) {
        throw new Error("No se pudo crear la obra");
      }

      const idNuevaObra = nuevaObra.id_obra;

      // 2. Guardar relación con obra padre
      const idObraPadre = obraPadreSeleccionada
        ? obraPadreSeleccionada.id_obra
        : null;
      await relacionObraService.setObraPadre({
        idObraPadre,
        idObraHija: idNuevaObra,
      });

      // 3. Guardar relaciones con obras hijas
      const idsObrasHijas =
        obrasHijasSeleccionadas.length > 0
          ? obrasHijasSeleccionadas.map((obra) => obra.id_obra)
          : [];
      await relacionObraService.setObrasHijas({
        idObraPadre: idNuevaObra,
        idsObrasHijas,
      });

      return nuevaObra;
    } catch (error) {
      console.error(`Error al guardar la obra - ${error}`);
      throw error;
    }
  };

  /**
   * Cancela y vuelve a la lista
   */
  const handleCancelar = () => {
    navigate("/home/gestion-obras");
  };

  /**
   * Guarda la obra y vuelve a la lista
   */
  const handleGuardar = async (
    formObra,
    obraPadreSeleccionada,
    obrasHijasSeleccionadas,
  ) => {
    try {
      await crearObraCompleta(
        formObra,
        obraPadreSeleccionada,
        obrasHijasSeleccionadas,
      );
      alert("Obra guardada con éxito");
      navigate("/home/gestion-obras");
      return true;
    } catch (error) {
      alert("Error al guardar la obra");
      return false;
    }
  };

  return {
    loading: apiRequest.loading,
    error: apiRequest.error,
    handleGuardar,
    handleCancelar,
  };
};
