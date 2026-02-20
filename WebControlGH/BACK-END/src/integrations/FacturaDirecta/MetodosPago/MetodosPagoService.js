import { fdClient } from "../client.js";

export const metodosPagoFDService = {
  getAllMetodos: (params) => fdClient.get("/paymentMethods", { params }),
  getMetodo: (id) => fdClient.get(`/paymentMethods/${id}`),
  createMetodo: (data) => fdClient.post("/paymentMethods", data),
  updateMetodo: (id, data) => fdClient.put(`/paymentMethods/${id}`, data),
  deleteMetodo: (id) => fdClient.delete(`/paymentMethods/${id}`),
};
