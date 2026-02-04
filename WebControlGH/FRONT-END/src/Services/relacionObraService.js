import axios from "axios";
const BASE_URL = "http://localhost:3002/api";

export const relacionObraService = {
  // RELACIONES OBRA
  getObraPadre: (idObra) =>
    axios.get(`${BASE_URL}/relacion-obras/padre/${idObra}`),
  getObrasHijas: (idObra) =>
    axios.get(`${BASE_URL}/relacion-obras/hijas/${idObra}`),
  setObraPadre: (data) => axios.post(`${BASE_URL}/relacion-obras/padre`, data),
  setObrasHijas: (data) => axios.post(`${BASE_URL}/relacion-obras/hijas`, data),
};
