"use client";

import { useParams } from "next/navigation";
import InviteForm from "./InviteForm";

export default function InvitePage() {
  const params = useParams();
  const orgId = params?.id as string;

  return (
    <div className="p-4">
      <h1 className="mb-4 text-xl font-bold">Invite a Team Member</h1>
      <InviteForm organizationId={orgId} />
    </div>
  );
}
