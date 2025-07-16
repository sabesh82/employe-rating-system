import { useApi } from "@/providers/ApiProvider";

import { User } from "@prisma/client";
import { useCreateMutation } from "../apiFactory";
import { LoginInput } from "@/app/api/auth/types";

export const useLogin = ({
  invalidateQueryKey,
}: {
  invalidateQueryKey?: unknown[];
}) => {
  const { jsonApiClient } = useApi();

  return useCreateMutation<
    Record<string, any>,
    LoginInput,
    { data: { user: User; token: string } },
    { data: { user: User; token: string } }
  >({
    apiClient: jsonApiClient,
    method: "post",
    url: "/auth/login",
    errorMessage: "Failed to login.",
    invalidateQueryKey,
    mutationOptions: {},
  });
};

{
  /*"use client";
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
*/
}
