// ESTE ARCHIVO TIENE TODOS LOS ENDPOINTS SOBRE PRESUPUESTOS DE LA API FACTURA DIRECTA

import axios from "axios";

// Función helper para obtener headers dinámicamente (se evalúan cuando se llaman, no al importar)
const getHeaders = () => ({
  "facturadirecta-api-key": process.env.FACTURADIRECTA_API_KEY,
  "Accept-Version": "1.0.8",
  "Content-Type": "application/json",
});

// Función helper para obtener la URL base
const getBaseURL = () =>
  `https://app.facturadirecta.com/api/${process.env.FACTURADIRECTA_COMPANY_ID}/estimates`;

export const presupuestoService = {
  // Listar presupuestos
  getAllPresupuestos: () => axios.get(getBaseURL(), { headers: getHeaders() }),

  // Obtener un presupuesto por ID
  getPresupuesto: (id) =>
    axios.get(`${getBaseURL()}/${id}`, { headers: getHeaders() }),

  // Crear presupuesto
  createPresupuesto: (data) =>
    axios.post(getBaseURL(), data, { headers: getHeaders() }),

  // Actualizar presupuesto
  updatePresupuesto: (id, data) =>
    axios.put(`${getBaseURL()}/${id}`, data, { headers: getHeaders() }),

  // Actualizar etiquetas de presupuesto
  updateEtiquetas: (id, data) =>
    axios.put(`${getBaseURL()}/${id}/tags`, data, { headers: getHeaders() }),

  // Enviar presupuesto por correo electrónico
  enviarPresupuesto: (id, data) =>
    axios.put(`${getBaseURL()}/${id}/send`, data, { headers: getHeaders() }),

  // Generar el presupuesto en formato PDF
  generarPDF: (id, data) =>
    axios.put(`${getBaseURL()}/${id}/pdf`, data, { headers: getHeaders() }),

  // Eliminar presupuesto
  deletePresupuesto: (id) =>
    axios.delete(`${getBaseURL()}/${id}`, { headers: getHeaders() }),
};
