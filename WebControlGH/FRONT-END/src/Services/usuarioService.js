import axios from "axios";
const BASE_URL = "http://localhost:3002/api";

export const usuarioService = {
  getUsuarios: () => axios.get(`${BASE_URL}/usuario`),
};
