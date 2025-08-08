import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import privateRoute from "@/app/api/helpers/privateRoute";

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ id: string }> },
) {
  const { id: organizationId } = await context.params;

  return privateRoute(
    request,
    {
      organizationId,
      permissions: ["USER:READ:*", "USER:*:*"],
    },
    async () => {
      const members = await prisma.organizationMember.findMany({
        where: {
          organizationId,
          status: "ACTIVE",
        },
        select: {
          userId: true,
          role: true,
          User: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
            },
          },
        },
      });

      const data = members.map((m) => ({
        id: m.userId,
        name: `${m.User.firstName} ${m.User.lastName}`,
        role: m.role,
      }));

      return NextResponse.json({ success: true, data });
    },
  );
}
