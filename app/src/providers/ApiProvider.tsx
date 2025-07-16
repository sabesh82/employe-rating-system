"use client";

import createApiClient from "@/app/api-client/baseApi";
import { useAuth, useAuthActions } from "@/stores/authStore";
import { AxiosInstance } from "axios";
import { createContext, ReactNode, useCallback, useContext } from "react";

interface IApiContext {
  jsonApiClient: AxiosInstance;
}

const ApiContext = createContext<IApiContext | null>(null);

const ApiProvider = ({ children }: { children: ReactNode }) => {
  const { authToken } = useAuth();
  const { logout } = useAuthActions();

  const getAccessToken = useCallback(() => authToken ?? null, [authToken]);

  const jsonApiClient = createApiClient({
    baseURL: process.env.NEXT_PUBLIC_API_BASE_URL || "",
    getToken: getAccessToken,
    logout: logout,
  });

  return (
    <ApiContext.Provider value={{ jsonApiClient }}>
      {children}
    </ApiContext.Provider>
  );
};

const useApi = () => {
  const context = useContext(ApiContext);

  if (!context) {
    throw new Error("useAPI must be used within an APIProvider");
  }

  return context;
};

export { ApiProvider, useApi };
