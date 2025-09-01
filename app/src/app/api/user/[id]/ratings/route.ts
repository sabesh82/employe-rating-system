import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import privateRoute from "@/app/api/helpers/privateRoute";
import handleError from "@/app/api/helpers/handleError";

export async function GET(request: NextRequest) {
  return privateRoute(request, { permissions: [] }, async (user) => {
    try {
      // Fetch all ratings where the logged-in user is the employee
      const ratings = await prisma.rating.findMany({
        where: {
          employeeId: user.id,
        },
        include: {
          criteriaScores: {
            include: {
              Criteria: {
                select: {
                  name: true,
                },
              },
            },
          },
          Supervisor: {
            select: {
              firstName: true,
              lastName: true,
              email: true,
            },
          },
          Organization: {
            select: {
              name: true,
            },
          },
        },
        orderBy: {
          createdAt: "desc",
        },
      });

      return NextResponse.json(
        { success: true, data: ratings },
        { status: 200 },
      );
    } catch (error) {
      return handleError(error, "Failed to fetch employee ratings");
    }
  });
}
