import axios from "axios";

const FD_API_VERSION = "1.0.8";

/**
 * Cliente HTTP centralizado para la API de FacturaDirecta.
 * La API key se inyecta en cada petición vía interceptor para que
 * el valor se lea de process.env en tiempo de llamada (no de importación).
 */
export const fdClient = axios.create({
  baseURL: `https://app.facturadirecta.com/api/${process.env.FACTURADIRECTA_COMPANY_ID}`,
  headers: {
    "Content-Type": "application/json",
    "Accept-Version": FD_API_VERSION,
  },
});

fdClient.interceptors.request.use((config) => {
  config.headers["facturadirecta-api-key"] = process.env.FACTURADIRECTA_API_KEY;
  return config;
});
