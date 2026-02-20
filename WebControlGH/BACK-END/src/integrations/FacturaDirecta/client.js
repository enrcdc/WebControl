import axios from "axios";
import { config as configuration } from "../../config/env.js";

/**
 * Cliente HTTP centralizado para la API de FacturaDirecta.
 * La API key se inyecta en cada petición vía interceptor para que
 * el valor se lea de process.env en tiempo de llamada (no de importación).
 */
export const fdClient = axios.create({
  baseURL: configuration.facturaDirecta.baseURL,
  headers: {
    "Content-Type": "application/json",
    "Accept-Version": configuration.facturaDirecta.apiVersion,
  },
});

fdClient.interceptors.request.use((config) => {
  config.headers["facturadirecta-api-key"] =
    configuration.facturaDirecta.apiKey;
  return config;
});
