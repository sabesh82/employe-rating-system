import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import privateRoute from "@/app/api/helpers/privateRoute";
import handleError from "@/app/api/helpers/handleError";
import { CriteriaSchema } from "@/schemas/criteria.schema";

// PATCH: Update a specific criteria
export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string; criteriaId: string } },
) {
  const { id: organizationId, criteriaId } = params;
  const body = await request.json();

  return privateRoute(
    request,
    {
      organizationId,
      permissions: ["ORGANIZATION:CRITERIA:UPDATE", "ORGANIZATION:*:*"],
    },
    async () => {
      try {
        const validatedData = CriteriaSchema.partial().parse(body);

        const existingCriteria = await prisma.criteria.findUnique({
          where: { id: criteriaId },
          select: {
            id: true,
            orgId: true,
          },
        });

        if (!existingCriteria) {
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

        if (existingCriteria.orgId !== organizationId) {
          return NextResponse.json(
            {
              success: false,
              error: {
                code: "FORBIDDEN",
                message: "Criteria does not belong to this organization",
              },
            },
            { status: 403 },
          );
        }

        const updated = await prisma.criteria.update({
          where: { id: criteriaId },
          data: validatedData,
        });

        return NextResponse.json(
          {
            success: true,
            data: updated,
          },
          { status: 200 },
        );
      } catch (error) {
        return handleError(error, "Failed to update criteria");
      }
    },
  );
}

// DELETE: Delete a specific criteria
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string; criteriaId: string } },
) {
  const { id: organizationId, criteriaId } = params;

  return privateRoute(
    request,
    {
      organizationId,
      permissions: ["ORGANIZATION:CRITERIA:DELETE", "ORGANIZATION:*:*"],
    },
    async () => {
      try {
        const existingCriteria = await prisma.criteria.findUnique({
          where: { id: criteriaId },
        });

        if (!existingCriteria || existingCriteria.orgId !== organizationId) {
          return NextResponse.json(
            {
              success: false,
              error: {
                code: "CRITERIA_NOT_FOUND",
                message: "Criteria not found in this organization",
              },
            },
            { status: 404 },
          );
        }

        // Delete related CriteriaScore records first!
        await prisma.criteriaScore.deleteMany({
          where: { criteriaId },
        });

        // Now safely delete the Criteria
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
