"use client";

import { useParams } from "next/navigation";
import InviteForm from "./InviteForm";

export default function InvitePage() {
  const params = useParams();
  const orgId = params?.id as string;

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100 p-6">
      <div className="w-full max-w-lg">
        <h1 className="mb-6 text-center text-2xl font-bold text-gray-800">
          Invite a Team Member
        </h1>
        <InviteForm organizationId={orgId} />
      </div>
    </div>
  );
}
