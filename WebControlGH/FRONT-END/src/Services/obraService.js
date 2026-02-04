// ESTE ARCHIVO TIENE TODAS LAS LLAMADAS A LAS APIs que necesita el módulo Obra
import axios from "axios";
const BASE_URL = "http://localhost:3002/api";

export const obraService = {
  // OBRA
  getObra: (idObra) => axios.get(`${BASE_URL}/obra/${idObra}`),
  getAllObras: () => axios.get(`${BASE_URL}/obra`),
  createObra: (data) => axios.post(`${BASE_URL}/obra`, data),
  updateObra: (idObra, data) => axios.put(`${BASE_URL}/obra/${idObra}`, data),
  deleteObra: (idObra) => axios.delete(`${BASE_URL}/obra/${idObra}`),
  buscarObrasPorDescripcion: (descripcion) =>
    axios.get(
      `${BASE_URL}/obra/buscar/descripcion?descripcionObra=${descripcion}`,
    ),
};
