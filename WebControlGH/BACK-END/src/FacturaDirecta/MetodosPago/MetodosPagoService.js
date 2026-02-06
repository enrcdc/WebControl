// ESTE ARCHIVO TIENE TODOS LOS ENDPOINTS SOBRE MÉTODOS DE PAGO DE LA API FACTURA DIRECTA

import axios from "axios";

// Función helper para obtener los headers comunes a todas las peticiones
const getHeaders = () => ({
  "facturadirecta-api-key": process.env.FACTURADIRECTA_API_KEY,
  "Accept-Version": "1.0.8",
  "Content-Type": "application/json",
});

// Función para obtener la URL base
const getBaseURL = () =>
  `https://app.facturadirecta.com/api/${process.env.FACTURADIRECTA_COMPANY_ID}/paymentMethods`;

export const metodosPagoService = {
  // Listar métodos de pago
  getAllMetodos: () => axios.get(getBaseURL(), { headers: getHeaders() }),

  // Obtener un método de pago por ID
  getMetodo: (id) =>
    axios.get(`${getBaseURL()}/${id}`, { headers: getHeaders() }),

  // Crear método de pago
  createMetodo: (data) =>
    axios.post(getBaseURL(), data, { headers: getHeaders() }),

  // Actualizar método de pago
  updateMetodo: (id, data) =>
    axios.put(`${getBaseURL()}/${id}`, data, { headers: getHeaders() }),

  // Eliminar contacto
  deleteMetodo: (id) =>
    axios.delete(`${getBaseURL()}/${id}`, { headers: getHeaders() }),
};
