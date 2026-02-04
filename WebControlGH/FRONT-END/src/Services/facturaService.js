import axios from "axios";
const BASE_URL = "http://localhost:3002/api";

export const facturaService = {
  // FACTURAS
  getFacturas: (idsObras) =>
    axios.post(`${BASE_URL}/ecoFactura/buscar`, { idsObras }),
  createFactura: (data) => axios.post(`${BASE_URL}/ecoFactura`, data),
  updateFactura: (id, data) => axios.put(`${BASE_URL}/ecoFactura/${id}`, data),
  deleteFactura: (id) => axios.delete(`${BASE_URL}/ecoFactura/${id}`),
};
