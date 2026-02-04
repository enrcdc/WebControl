import axios from "axios";
const BASE_URL = "http://localhost:3002/api";

export const empresaService = {
  getEmpresas: () => axios.get(`${BASE_URL}/empresa`),
};
