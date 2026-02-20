import { fdClient } from "../client.js";

export const productoFDService = {
  getAllProductos: (params) => fdClient.get("/products", { params }),
  getProducto: (id) => fdClient.get(`/products/${id}`),
  createProducto: (data) => fdClient.post("/products", data),
  updateProducto: (id, data) => fdClient.put(`/products/${id}`, data),
  deleteProducto: (id) => fdClient.delete(`/products/${id}`),
};
