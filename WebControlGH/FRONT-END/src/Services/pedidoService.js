import axios from "axios";
const BASE_URL = "http://localhost:3002/api";

export const pedidoService = {
  // PEDIDOS
  getPedidos: (idsObras) =>
    axios.post(`${BASE_URL}/ecoPedido/buscar`, { idsObras }),
  createPedido: (data) => axios.post(`${BASE_URL}/ecoPedido`, data),
  updatePedido: (id, data) => axios.put(`${BASE_URL}/ecoPedido/${id}`, data),
  deletePedido: (id) => axios.delete(`${BASE_URL}/ecoPedido/${id}`),
};
