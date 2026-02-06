// ESTE ARCHIVO TIENE TODOS LOS ENDPOINTS SOBRE CONTACTOS DE LA API FACTURA DIRECTA

import axios from "axios";

// Función helper para obtener los headers comunes a todas las peticiones
const getHeaders = () => ({
  "facturadirecta-api-key": process.env.FACTURADIRECTA_API_KEY,
  "Accept-Version": "1.0.8",
  "Content-Type": "application/json",
});

// Función para obtener la URL base
const getBaseURL = () =>
  `https://app.facturadirecta.com/api/${process.env.FACTURADIRECTA_COMPANY_ID}/contacts`;

export const contactoService = {
  // Listar contactos
  getAllContactos: () => axios.get(getBaseURL(), { headers: getHeaders() }),

  // Obtener un contacto por ID
  getContacto: (id) =>
    axios.get(`${getBaseURL()}/${id}`, { headers: getHeaders() }),

  // Crear contacto
  createContacto: (data) =>
    axios.post(getBaseURL(), data, { headers: getHeaders() }),

  // Actualizar contacto
  updateContacto: (id, data) =>
    axios.put(`${getBaseURL()}/${id}`, data, { headers: getHeaders() }),

  // Eliminar contacto
  deleteContacto: (id) =>
    axios.delete(`${getBaseURL()}/${id}`, { headers: getHeaders() }),
};
