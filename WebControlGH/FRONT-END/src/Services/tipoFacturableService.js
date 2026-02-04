import axios from "axios";
const BASE_URL = "http://localhost:3002/api";

export const tipoFacturableService = {
  getTiposFacturables: () => axios.get(`${BASE_URL}/tipo-facturable`),
};
