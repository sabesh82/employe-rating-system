import axios, { AxiosError, CreateAxiosDefaults, ResponseType } from "axios";

type method = "get" | "post" | "patch" | "put" | "delete";

const toastService = {
  error: (_message: string) => {},
};

const createApiClient = ({
  baseURL,
  responseType = "json",
  headers,
  method,
  getToken,
  logout,
  options,
}: {
  baseURL: string;
  responseType?: ResponseType;
  getToken: () => string | null;
  logout: () => void;
  headers?: CreateAxiosDefaults["headers"];
  method?: method;
  options?: Omit<
    CreateAxiosDefaults,
    "baseURL" | "method" | "responseType" | "headers"
  >;
}) => {
  const apiClient = axios.create({
    baseURL: baseURL,
    responseType: responseType,
    headers: headers ?? { "Content-Type": "application/json" },
    method: method,
    ...options,
  });

  apiClient.interceptors.request.use(
    (config) => {
      const token = getToken();

      if (token) {
        config.headers["Authorization"] = `Bearer ${token}`;
      }

      return config;
    },
    (error) => Promise.reject(error),
  );

  apiClient.interceptors.response.use(
    (response) => response,
    (error: AxiosError) => {
      const status = error.response?.status;
      if (status === 401) {
        logout();
        toastService.error("You have no access.");
      }
      return Promise.reject(error);
    },
  );

  return apiClient;
};

export default createApiClient;
