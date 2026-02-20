import { fdClient } from "../client.js";

export const albaranFDService = {
  getAllAlbaranes: (params) => fdClient.get("/deliveryNotes", { params }),
  getAlbaran: (id) => fdClient.get(`/deliveryNotes/${id}`),
  createAlbaran: (data) => fdClient.post("/deliveryNotes", data),
  updateAlbaran: (id, data) => fdClient.put(`/deliveryNotes/${id}`, data),
  updateEtiquetas: (id, data) => fdClient.put(`/deliveryNotes/${id}/tags`, data),
  enviarAlbaran: (id, data) => fdClient.put(`/deliveryNotes/${id}/send`, data),
  generarPDF: (id, data) => fdClient.put(`/deliveryNotes/${id}/pdf`, data),
  deleteAlbaran: (id) => fdClient.delete(`/deliveryNotes/${id}`),
};
