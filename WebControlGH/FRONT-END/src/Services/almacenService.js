import axios from "axios";
const BASE_URL = "http://localhost:3002/api";

export const almacenService = {
  // ALMACEN
  getMovimientosAlmacen: (idObra) =>
    axios.get(`${BASE_URL}/movimientos-almacen/obra/${idObra}`),
  createMovimientoAlmacen: (data) =>
    axios.post(`${BASE_URL}/movimientos-almacen`, data),
  updateMovimientoAlmacen: (id, data) =>
    axios.put(`${BASE_URL}/movimientos-almacen/${id}`, data),
  deleteMovimientoAlmacen: (id) =>
    axios.delete(`${BASE_URL}/movimientos-almacen/${id}`),
  buscarProductos: (descripcion) =>
    axios.get(
      `${BASE_URL}/almacen/buscar/descripcion?descripcion=${descripcion}`,
    ),
};
