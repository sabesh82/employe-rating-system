import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import privateRoute from "@/app/api/helpers/privateRoute";
import handleError from "@/app/api/helpers/handleError";
import { CriteriaSchema } from "@/schemas/criteria.schema";

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ criteriaId: string }> },
) {
  const { criteriaId } = await params;
  const body = await request.json();

  return privateRoute(
    request,
    {
      permissions: ["ORGANIZATION:CRITERIA:UPDATE", "ORGANIZATION:*:*"],
    },
    async () => {
      try {
        //PATCH is a partial update, so you don't always want to require all fields. If you want to update just the name, you send { name: "New Name" }, no need to send maxScore. Using .partial() on your schema makes that validation easy and safe.
        const validatedData = CriteriaSchema.partial().parse(body); // allow partial update

        // Find criteria with orgId and owner info
        const criteria = await prisma.criteria.findUnique({
          where: { id: criteriaId },
          select: {
            orgId: true,
            Organization: {
              select: {
                ownerId: true,
              },
            },
          },
        });

        if (!criteria) {
          return NextResponse.json(
            {
              success: false,
              error: {
                code: "CRITERIA_NOT_FOUND",
                message: "Criteria not found",
              },
            },
            { status: 404 },
          );
        }

        // Update criteria
        const updatedCriteria = await prisma.criteria.update({
          where: { id: criteriaId },
          data: validatedData,
        });

        return NextResponse.json(
          {
            success: true,
            data: updatedCriteria,
          },
          { status: 200 },
        );
      } catch (error) {
        return handleError(error, "Failed to update criteria");
      }
    },
  );
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ criteriaId: string }> },
) {
  const { criteriaId } = await params;

  return privateRoute(
    request,
    {
      permissions: ["ORGANIZATION:CRITERIA:DELETE", "ORGANIZATION:*:*"],
    },
    async () => {
      try {
        const criteria = await prisma.criteria.findUnique({
          where: {
            id: criteriaId,
          },
        });

        if (!criteria) {
          return NextResponse.json(
            {
              success: false,
              error: {
                code: "CRITERIA_NOT_FOUND",
                message: "criteria not found",
              },
            },
            { status: 404 },
          );
        }

        // Delete criteria
        await prisma.criteria.delete({
          where: { id: criteriaId },
        });

        return NextResponse.json(
          {
            success: true,
            message: "Criteria deleted successfully",
          },
          { status: 200 },
        );
      } catch (error) {
        return handleError(error, "Failed to delete criteria");
      }
    },
  );
}
