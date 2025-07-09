"use client";
import { useMutation } from "@tanstack/react-query";
import { UserLoginInput } from "./types";
import { useApi } from "@/providers/ApiProvider";

const useLogin = () => {
  const { jsonApiClient } = useApi();
  const loginFn = async (loginInput: UserLoginInput) => {
    const response = await jsonApiClient.post("/auth/login", loginInput);
    return response.data;
  };

  return useMutation({
    mutationFn: loginFn,
  });
};

export default useLogin;
