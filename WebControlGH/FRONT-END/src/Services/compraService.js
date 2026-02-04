import axios from "axios";
const BASE_URL = "http://localhost:3002/api";

export const compraService = {
  // COMPRAS
  getFacturasCompras: (idObra) =>
    axios.get(`${BASE_URL}/facturas/obra/${idObra}`),
  createFacturaCompra: (data) => axios.post(`${BASE_URL}/facturas`, data),
  updateFacturaCompra: (id, data) =>
    axios.patch(`${BASE_URL}/facturas/${id}`, data),
  deleteFacturaCompra: (id) => axios.delete(`${BASE_URL}/facturas/${id}`),
  buscarFacturas: (concepto) =>
    axios.get(`${BASE_URL}/facturas/buscar/concepto?concepto=${concepto}`),
};
