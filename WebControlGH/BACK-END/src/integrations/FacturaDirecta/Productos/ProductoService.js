// ESTE ARCHIVO TIENE TODOS LOS ENDPOINTS SOBRE PRODUCTOS DE LA API FACTURA DIRECTA

import axios from "axios";

// Función helper para obtener headers dinámicamente (se evalúan cuando se llaman, no al importar)
const getHeaders = () => ({
  "facturadirecta-api-key": process.env.FACTURADIRECTA_API_KEY,
  "Accept-Version": "1.0.8",
  "Content-Type": "application/json",
});

// Función helper para obtener la URL base
const getBaseURL = () =>
  `https://app.facturadirecta.com/api/${process.env.FACTURADIRECTA_COMPANY_ID}/products`;

export const productoService = {
  // Listar productos
  getAllProductos: () => axios.get(getBaseURL(), { headers: getHeaders() }),

  // Obtener un producto por ID
  getProducto: (id) =>
    axios.get(`${getBaseURL()}/${id}`, { headers: getHeaders() }),

  // Crear producto
  createProducto: (data) =>
    axios.post(getBaseURL(), data, { headers: getHeaders() }),

  // Actualizar producto
  updateProducto: (id, data) =>
    axios.put(`${getBaseURL()}/${id}`, data, { headers: getHeaders() }),

  // Eliminar producto
  deleteProducto: (id) =>
    axios.delete(`${getBaseURL()}/${id}`, { headers: getHeaders() }),
};
