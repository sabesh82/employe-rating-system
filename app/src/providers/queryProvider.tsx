"use client";
import queryClient from "@/app/api-client/QueryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { ReactNode } from "react";

const QueryProvider = ({ children }: { children: ReactNode }) => {
  return (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
};
export default QueryProvider;
