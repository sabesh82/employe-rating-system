import { useApi } from "@/providers/ApiProvider";
import { useCreateMutation } from "../apiFactory";
import { OrganizationNameInput } from "@/app/api/auth/types";

export interface CreateOrganizationResponse {
  data: {
    organization: string; // org ID
    name: string;
  };
  token: string;
}

export const useCreateOrganization = ({
  invalidateQueryKey,
}: {
  invalidateQueryKey?: unknown[];
}) => {
  const { jsonApiClient } = useApi();

  return useCreateMutation<
    Record<string, any>,
    OrganizationNameInput, // Body of the POST request
    CreateOrganizationResponse, // Expected response
    never
  >({
    apiClient: jsonApiClient,
    method: "post",
    url: "/auth/organization",
    errorMessage: "Failed to create organization.",
    invalidateQueryKey,
    mutationOptions: {},
  });
};
