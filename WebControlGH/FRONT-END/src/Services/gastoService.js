import axios from "axios";
const BASE_URL = "http://localhost:3002/api";

export const gastoService = {
  // GASTOS
  getGastos: (idsObra) => axios.post(`${BASE_URL}/gastos/buscar`, { idsObra }),
};
