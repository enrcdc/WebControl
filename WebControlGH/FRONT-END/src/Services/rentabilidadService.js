import axios from "axios";
const BASE_URL = "http://localhost:3002/api";

export const rentabilidadService = {
  // RENTABILIDAD
  getRentabilidad: (idObra) => axios.get(`${BASE_URL}/rentabilidad/${idObra}`),
};
