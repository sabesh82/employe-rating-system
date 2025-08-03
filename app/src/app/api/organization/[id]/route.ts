import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import privateRoute from "../../helpers/privateRoute";

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } },
) {
  return privateRoute(request, { permissions: [] }, async (curruser) => {
    try {
      const organizationId = params.id;

      // Check if the organization exists and belongs to the current user
      const org = await prisma.organization.findUnique({
        where: { id: organizationId },
        select: { ownerId: true },
      });

      if (!org) {
        return NextResponse.json(
          {
            success: false,
            error: { code: "ORG_NOT_FOUND", message: "Organization not found" },
          },
          { status: 404 },
        );
      }

      if (org.ownerId !== curruser.id) {
        return NextResponse.json(
          {
            success: false,
            error: {
              code: "UNAUTHORIZED",
              message: "You do not have permission to delete this organization",
            },
          },
          { status: 403 },
        );
      }

      // Delete related OrganizationMembers first
      await prisma.organizationMember.deleteMany({
        where: { organizationId: organizationId },
      });

      // Delete related Criteria for this organization
      await prisma.criteria.deleteMany({
        where: { orgId: organizationId },
      });

      // delete CriteriaScore and Rating related to this org here too if needed

      // Finally, delete the organization itself
      await prisma.organization.delete({
        where: { id: organizationId },
      });

      return NextResponse.json(
        {
          success: true,
          message: "Organization deleted successfully",
        },
        { status: 200 },
      );
    } catch (error) {
      console.error("Failed to delete organization:", error);
      return NextResponse.json(
        {
          success: false,
          error: {
            code: "SERVER_ERROR",
            message: "Failed to delete organization",
          },
        },
        { status: 500 },
      );
    }
  });
}
