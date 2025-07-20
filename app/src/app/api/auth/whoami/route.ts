import { NextRequest, NextResponse } from "next/server";
import privateRoute from "../../helpers/privateRoute";
import prisma from "@/lib/prisma";
import { UserWithRelations } from "../types";
import handleError from "../../helpers/handleError";

export async function GET(request: NextRequest) {
  return privateRoute(
    request,
    { permissions: [] }, //no specific permissions required beyond authentication
    async (currentUser) => {
      try {
        const user = await prisma.user.findUnique({
          where: {
            id: currentUser.id,
          },
          select: {
            id: true,
            email: true,
            firstName: true,
            lastName: true,
            createdAt: true,
            updatedAt: true,
            OrganizationMembers: {
              include: {
                Organization: true,
                Supervisor: true,
                Employees: true,
              },
            },
            OwnedOrganizations: true,

            ReceivedRatings: {
              include: {
                Supervisor: true,
                criteriaScores: true,
              },
            },

            GivenRatings: {
              include: {
                Employee: true,
                criteriaScores: true,
              },
            },
          },
        });

        if (!user) {
          return NextResponse.json(
            {
              success: false,
              error: {
                code: "USER_NOT_FOUND",
                message: "user not found",
              },
            },
            { status: 404 },
          );
        }

        const responseData: UserWithRelations = {
          ...user,
        };

        return NextResponse.json(
          {
            success: true,
            data: responseData,
          },
          { status: 200 },
        );
      } catch (error) {
        return handleError(error, "failed to fetch user details");
      }
    },
  );
}
