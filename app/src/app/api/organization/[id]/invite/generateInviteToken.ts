import generateToken from "@/app/api/helpers/generateToken";

export const INVITE_TOKEN_TYPE = "ACCEPT_INVITE";

export interface IJWTInvitePayload extends Record<string, any> {
  id: string; //the ID of the user we’re inviting
  organizationId: string; //the org they’re being invited to
  type: typeof INVITE_TOKEN_TYPE; //which should always be "ACCEPT_INVITE"
}

export default function generateInviteToken(payload: {
  id: string;
  organizationId: string;
}) {
  return generateToken<IJWTInvitePayload>(
    {
      ...payload,
      type: INVITE_TOKEN_TYPE,
    },
    {
      expiresIn: "1h",
    },
  );
}
