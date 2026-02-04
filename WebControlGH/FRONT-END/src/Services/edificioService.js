import axios from "axios";
const BASE_URL = "http://localhost:3002/api";

export const edificioService = {
  getEdificios: () => axios.get(`${BASE_URL}/edificio`),
  buscarPorNombre: (nombre) =>
    axios.get(`${BASE_URL}/edificio/buscar/nombre?nombre=${nombre}`),
};
