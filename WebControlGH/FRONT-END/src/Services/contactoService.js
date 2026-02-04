import axios from "axios";
const BASE_URL = "http://localhost:3002/api";

export const contactoService = {
  getAll: () => axios.get(`${BASE_URL}/contacto`),
  getContactosEmpresa: (idEmpresa) =>
    axios.get(`${BASE_URL}/contacto/${idEmpresa}`),
  createContacto: (data) => axios.post(`${BASE_URL}/contacto`, data),
  // TODO: Añadir el resto de servicios
};
