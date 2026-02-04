import axios from "axios";
const BASE_URL = "http://localhost:3002/api";

export const tipoObraService = {
  getTiposObra: () => axios.get(`${BASE_URL}/tipo-obra`),
};
