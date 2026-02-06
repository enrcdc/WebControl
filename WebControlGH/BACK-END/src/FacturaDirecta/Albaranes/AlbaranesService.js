// ESTE ARCHIVO TIENE TODOS LOS ENDPOINTS SOBRE ALBARANES DE LA API FACTURA DIRECTA

import axios from "axios";

// Función helper para obtener headers dinámicamente (se evalúan cuando se llaman, no al importar)
const getHeaders = () => ({
  "facturadirecta-api-key": process.env.FACTURADIRECTA_API_KEY,
  "Accept-Version": "1.0.8",
  "Content-Type": "application/json",
});

// Función helper para obtener la URL base
const getBaseURL = () =>
  `https://app.facturadirecta.com/api/${process.env.FACTURADIRECTA_COMPANY_ID}/deliveryNotes`;

export const albaranService = {
  // Listar Albaranes
  getAllAlbaranes: () => axios.get(getBaseURL(), { headers: getHeaders() }),

  // Obtener un Albaran por ID
  getAlbaran: (id) =>
    axios.get(`${getBaseURL()}/${id}`, { headers: getHeaders() }),

  // Crear Albaran
  createAlbaran: (data) =>
    axios.post(getBaseURL(), data, { headers: getHeaders() }),

  // Actualizar Albaran
  updateAlbaran: (id, data) =>
    axios.put(`${getBaseURL()}/${id}`, data, { headers: getHeaders() }),

  // Actualizar etiquetas de Albaran
  updateEtiquetas: (id, data) =>
    axios.put(`${getBaseURL()}/${id}/tags`, data, { headers: getHeaders() }),

  // Enviar Albaran por correo electrónico
  enviarAlbaran: (id, data) =>
    axios.put(`${getBaseURL()}/${id}/send`, data, { headers: getHeaders() }),

  // Generar el Albaran en formato PDF
  generarPDF: (id, data) =>
    axios.put(`${getBaseURL()}/${id}/pdf`, data, { headers: getHeaders() }),

  // Eliminar Albaran
  deleteAlbaran: (id) =>
    axios.delete(`${getBaseURL()}/${id}`, { headers: getHeaders() }),
};
