// Hook refactorizado para gestionar obras relacionadas (padre e hijas)
import { useState, useEffect } from "react";
import { useBusquedaEntidad } from "../../../hooks/useBusquedaEntidad.js";
import { useBusquedaMultiple } from "hooks/useBusquedaMultiple.js";
import { obraService, relacionObraService } from "../services/obra.service.js";

/**
 * Hook para gestionar obras relacionadas (padre e hijas)
 * Usa useBusquedaEntidad dos veces para reutilizar la lógica de búsqueda
 *
 * @param {number|null} idObra - ID de la obra (null si es creación)
 * @returns {Object} Estado y funciones de obras relacionadas
 */
export const useObrasRelacionadas = (idObra = null) => {
  // Obras cargadas desde el servidor
  const [obraPadre, setObraPadre] = useState(null);
  const [obrasHijas, setObrasHijas] = useState([]);

  // Búsqueda de obra padre
  const busquedaPadre = useBusquedaEntidad(
    (termino) => obraService.buscarPorDescripcion(termino),
    { minLength: 3, keyField: "id_obra" },
  );

  // Búsqueda de obras hijas
  const busquedaHijas = useBusquedaMultiple(
    (termino) => obraService.buscarPorDescripcion(termino),
    { minLength: 3, keyField: "id_obra" },
  );

  /**
   * Carga la obra padre desde el servidor
   */
  const fetchObraPadre = async () => {
    if (!idObra) return;

    try {
      const res = await relacionObraService.getObraPadre(idObra);
      if (res.data.data && res.data.data.length > 0) {
        const padre = res.data.data[0];
        setObraPadre(padre);
        busquedaPadre.setEntidadSeleccionada(padre);
      } else {
        setObraPadre(null);
        busquedaPadre.setEntidadSeleccionada(null);
      }
    } catch (error) {
      console.error(`Error al obtener la obra padre - ${error}`);
    }
  };

  /**
   * Carga las obras hijas desde el servidor
   */
  const fetchObrasHijas = async () => {
    if (!idObra) return;

    try {
      const res = await relacionObraService.getObrasHijas(idObra);
      setObrasHijas(res.data.data || []);
    } catch (error) {
      console.error(`Error al obtener las obras hijas - ${error}`);
    }
  };

  /**
   * Selecciona una obra padre
   */
  const seleccionarObraPadre = (obra) => {
    setObraPadre(obra);
    busquedaPadre.seleccionar(obra);
  };

  /**
   * Elimina la obra padre seleccionada
   */
  const eliminarObraPadre = () => {
    setObraPadre(null);
    busquedaPadre.eliminarSeleccion();
  };

  /**
   * Agrega una obra hija
   */
  const agregarObraHija = (obra) => {
    // Verificar que no esté ya en la lista
    if (!obrasHijas.some((o) => o.id_obra === obra.id_obra)) {
      setObrasHijas([...obrasHijas, obra]);
    }
    busquedaHijas.seleccionar(obra);
  };

  /**
   * Elimina una obra hija
   */
  const eliminarObraHija = (obraHija) => {
    setObrasHijas(obrasHijas.filter((o) => o.id_obra !== obraHija.id_obra));
    busquedaHijas.remover(obraHija);
  };

  /**
   * Guarda las relaciones en el backend
   */
  const handleGuardarRelaciones = async () => {
    if (!idObra) {
      console.warn("No se puede guardar relaciones sin idObra");
      return;
    }

    try {
      // Guardar obra padre
      const idObraPadre = obraPadre ? obraPadre.id_obra : null;
      await relacionObraService.setObraPadre({
        idObraPadre,
        idObraHija: idObra,
      });

      // Guardar obras hijas
      const idsObrasHijas =
        obrasHijas.length > 0 ? obrasHijas.map((obra) => obra.id_obra) : [];
      await relacionObraService.setObrasHijas({
        idObraPadre: idObra,
        idsObrasHijas,
      });

      return true;
    } catch (error) {
      console.error(`Error al guardar las relaciones de obras - ${error}`);
      return false;
    }
  };

  /**
   * Cancela cambios y recarga desde el servidor
   */
  const handleCancelarRelaciones = () => {
    fetchObraPadre();
    fetchObrasHijas();
    busquedaPadre.limpiar();
    busquedaHijas.limpiar();
  };

  // Cargar datos iniciales si hay idObra
  useEffect(() => {
    if (idObra) {
      fetchObraPadre();
      fetchObrasHijas();
    }
  }, [idObra]);

  return {
    // Obra padre
    obraPadre,
    busquedaPadre: busquedaPadre.busqueda,
    sugerenciasPadre: busquedaPadre.sugerencias,
    handleBuscarPadre: busquedaPadre.handleBuscar,
    seleccionarObraPadre,
    eliminarObraPadre,

    // Obras hijas
    obrasHijas,
    busquedaHijas: busquedaHijas.busqueda,
    sugerenciasHijas: busquedaHijas.sugerencias,
    handleBuscarHija: busquedaHijas.handleBuscar,
    agregarObraHija,
    eliminarObraHija,

    // Operaciones
    handleGuardarRelaciones,
    handleCancelarRelaciones,
    fetchObraPadre,
    fetchObrasHijas,
  };
};
