import { apiClient } from "../../../Services/api/client";
import { API_ENDPOINTS } from "../../../constants/api";

export const authService = {
  login: (username, password) =>
    apiClient.post(API_ENDPOINTS.AUTH_LOGIN, { username, password }),
};
