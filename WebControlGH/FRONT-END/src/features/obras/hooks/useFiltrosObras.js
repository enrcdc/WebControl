import { useState, useCallback } from "react";
import { useSessionStorage } from "../../../hooks/useSessionStorage.js";
import {
  aplicarFiltroPorFecha,
  aplicarFiltroPorComplejo,
  aplicarFiltroPorEmpresa,
  aplicarFiltroPorSeguimiento,
  aplicarFiltroPorEstado,
  aplicarFiltroPorTipo,
  aplicarFiltroPorOfertada,
  aplicarFiltroPorPedido,
  aplicarFiltroPorFactura,
  aplicarFiltroPorHoras,
  aplicarFiltroPorGastos,
  aplicarFiltroPorRelacion,
  aplicarFiltroPorBaja,
  aplicarFiltroPorCodigo,
} from "../utils/filtrosHelpers.js";

const defaultForm = {
  fechaInicio: "",
  fechaFin: "",
  complejo: "",
  empresa: "",
  enSeguimiento: "",
  estadoObra: "",
  tipoObra: "",
  ofertada: "",
  conPedido: "",
  conFactura: "",
  conHoras: "",
  conGastos: "",
  relacionEntreObras: "",
  obrasDadasDeBaja: false,
};

export const useFiltrosObras = (allObras, setFilteredObras) => {
  const [formData, setFormData] = useSessionStorage("formData", defaultForm);
  const [searchTerm, setSearchTerm] = useState("");

  // Handler para cambios en el formulario
  const handleChangeForm = (e) => {
    if (e.target.type === "checkbox") {
      setFormData((prev) => ({
        ...prev,
        [e.target.name]: e.target.checked,
      }));
    } else {
      setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    }
  };

  // Función principal de búsqueda/filtrado
  const handleSearch = useCallback(
    (obras = allObras) => {
      let filtered = obras;

      // Aplicar filtros en secuencia
      filtered = aplicarFiltroPorFecha(
        filtered,
        formData.fechaInicio,
        formData.fechaFin,
      );
      filtered = aplicarFiltroPorComplejo(filtered, formData.complejo);
      filtered = aplicarFiltroPorEmpresa(filtered, formData.empresa);
      filtered = aplicarFiltroPorSeguimiento(filtered, formData.enSeguimiento);
      filtered = aplicarFiltroPorEstado(filtered, formData.estadoObra);
      filtered = aplicarFiltroPorTipo(filtered, formData.tipoObra);
      filtered = aplicarFiltroPorOfertada(filtered, formData.ofertada);
      filtered = aplicarFiltroPorPedido(filtered, formData.conPedido);
      filtered = aplicarFiltroPorFactura(filtered, formData.conFactura);
      filtered = aplicarFiltroPorHoras(filtered, formData.conHoras);
      filtered = aplicarFiltroPorGastos(filtered, formData.conGastos);
      filtered = aplicarFiltroPorRelacion(
        filtered,
        formData.relacionEntreObras,
      );
      filtered = aplicarFiltroPorBaja(filtered, formData.obrasDadasDeBaja);
      filtered = aplicarFiltroPorCodigo(filtered, searchTerm);

      setFilteredObras(filtered);
    },
    [allObras, formData, searchTerm, setFilteredObras],
  );

  // Resetear filtros
  const resetFiltros = () => {
    setFormData(defaultForm);
    setSearchTerm("");
    setFilteredObras(allObras);
  };

  return {
    formData,
    searchTerm,
    setSearchTerm,
    handleChangeForm,
    handleSearch,
    resetFiltros,
  };
};
