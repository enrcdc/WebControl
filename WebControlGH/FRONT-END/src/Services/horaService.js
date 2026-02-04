import axios from "axios";
const BASE_URL = "http://localhost:3002/api";

export const horaService = {
  // HORAS
  getHoras: (idsObra) => axios.post(`${BASE_URL}/horas/buscar`, { idsObra }),
  getHorasExtra: (idsObra) =>
    axios.post(`${BASE_URL}/gastos/horas-extra/buscar`, { idsObra }),
};
