import axios from "axios";
const BASE_URL = "http://localhost:3002/api";

export const estadoObraService = {
  getEstadosObra: () => axios.get(`${BASE_URL}/estado-obra`),
};
