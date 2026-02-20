import { fdClient } from "../client.js";

export const contactoFDService = {
  getAllContactos: (params) => fdClient.get("/contacts", { params }),
  getContacto: (id) => fdClient.get(`/contacts/${id}`),
  createContacto: (data) => fdClient.post("/contacts", data),
  updateContacto: (id, data) => fdClient.put(`/contacts/${id}`, data),
  deleteContacto: (id) => fdClient.delete(`/contacts/${id}`),
};
