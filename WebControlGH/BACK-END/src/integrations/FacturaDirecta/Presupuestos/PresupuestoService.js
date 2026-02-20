import { fdClient } from "../client.js";

export const presupuestoFDService = {
  getAllPresupuestos: (params) => fdClient.get("/estimates", { params }),
  getPresupuesto: (id) => fdClient.get(`/estimates/${id}`),
  createPresupuesto: (data) => fdClient.post("/estimates", data),
  updatePresupuesto: (id, data) => fdClient.put(`/estimates/${id}`, data),
  updateEtiquetas: (id, data) => fdClient.put(`/estimates/${id}/tags`, data),
  enviarPresupuesto: (id, data) => fdClient.put(`/estimates/${id}/send`, data),
  generarPDF: (id, data) => fdClient.put(`/estimates/${id}/pdf`, data),
  deletePresupuesto: (id) => fdClient.delete(`/estimates/${id}`),
};
