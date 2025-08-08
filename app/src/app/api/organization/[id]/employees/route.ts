import { NextRequest, NextResponse } from "next/server";
import privateRoute from "@/app/api/helpers/privateRoute";
import prisma from "@/lib/prisma";

export async function GET(
  req: NextRequest,
  context: { params: Promise<{ id: string }> },
) {
  const { id: organizationId } = await context.params;

  return privateRoute(
    req,
    {
      organizationId,
      permissions: ["USER:READ:*", "USER:*:*"],
    },
    async (user, token) => {
      console.log("Authenticated user:", user);
      console.log("Requested organizationId:", organizationId);

      const employees = await prisma.organizationMember.findMany({
        where: {
          organizationId,
          role: "EMPLOYEE",
        },
        include: {
          User: true,
        },
      });

      return NextResponse.json({
        success: true,
        data: employees,
      });
    },
  );
}
