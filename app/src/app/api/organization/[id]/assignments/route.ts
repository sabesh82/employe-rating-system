import privateRoute from "@/app/api/helpers/privateRoute";
import { NextRequest, NextResponse } from "next/server";
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
      permissions: ["ASSIGNMENT:READ:*", "ASSIGNMENT:*:*"],
    },
    async (authUser) => {
      const orgMembership = authUser.organizations.find(
        (org) => org.organizationId === organizationId,
      );

      if (
        !orgMembership ||
        !orgMembership.permissions.some((p) =>
          ["ASSIGNMENT:READ:*", "ASSIGNMENT:*:*"].includes(p),
        )
      ) {
        return NextResponse.json(
          {
            error:
              "Forbidden: You don't have permission to perform this action",
          },
          { status: 403 },
        );
      }

      const supervisors = await prisma.organizationMember.findMany({
        where: {
          organizationId,
          role: "SUPERVISOR",
        },
        include: {
          User: true,
        },
      });

      const [assignments] = await Promise.all(
        supervisors.map(async (supervisor) => {
          const employees = await prisma.organizationMember.findMany({
            where: {
              organizationId,
              role: "EMPLOYEE",
              supervisorId: supervisor.userId,
            },
            include: {
              User: true,
            },
          });

          return {
            supervisor: {
              id: supervisor.id,
              firstName: supervisor.User.firstName,
              lastName: supervisor.User.lastName,
              email: supervisor.User.email,
            },
            employees: employees.map((emp) => ({
              id: emp.id,
              firstName: emp.User.firstName,
              lastName: emp.User.lastName,
              email: emp.User.email,
            })),
          };
        }),
      );
      console.log(JSON.stringify(assignments, null, 2));

      return NextResponse.json(assignments);
    },
  );
}
