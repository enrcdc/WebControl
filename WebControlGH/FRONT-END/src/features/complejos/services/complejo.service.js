import { apiClient } from "Services/api/client";
import { API_ENDPOINTS } from "constants/api";

export const complejoService = {
  getAll: (filters = {}) =>
    apiClient.get(API_ENDPOINTS.EDIFICIO, { params: filters }),
};
