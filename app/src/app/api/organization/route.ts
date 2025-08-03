import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { OrganizationStatus, UserRole, UserStatus } from "@prisma/client";
import { OWNER_PERMISSIONS } from "../auth/permission";
import privateRoute from "../helpers/privateRoute";
import generateToken, { IJWTPayload } from "../helpers/generateToken";
import handleError from "../helpers/handleError";
import { CreateOrganizationSchema } from "@/schemas/organization.schema";

export async function POST(request: NextRequest) {
  return privateRoute(request, { permissions: [] }, async (curruser) => {
    try {
      const body = await request.json();
      const validatedData = CreateOrganizationSchema.parse(body);
      const { name } = validatedData;

      if (!name) {
        return NextResponse.json(
          {
            success: false,
            error: {
              code: "ORG_NAME_REQUIRED",
              message: "Organization name is required",
            },
          },
          { status: 400 },
        );
      }

      const existing = await prisma.organization.findUnique({
        where: { name },
      });
      if (existing) {
        return NextResponse.json(
          {
            success: false,
            error: {
              code: "ORG_EXISTS",
              message: "Organization already exists",
            },
          },
          { status: 409 },
        );
      }

      const result = await prisma.$transaction(async (tx) => {
        // Create the organization
        const organization = await tx.organization.create({
          data: {
            name,
            status: OrganizationStatus.ACTIVE,
            Owner: {
              connect: { id: curruser.id },
            },
          },
        });

        // Create owner as member of the org
        await tx.organizationMember.create({
          data: {
            organizationId: organization.id,
            userId: curruser.id,
            role: UserRole.OWNER,
            permissions: OWNER_PERMISSIONS,
            status: UserStatus.ACTIVE,
          },
        });

        // Get updated user with organization memberships
        const user = await tx.user.findUnique({
          where: { id: curruser.id },
          include: {
            OrganizationMembers: true,
          },
        });

        return { organization, user };
      });

      const token = generateToken<IJWTPayload>({
        id: curruser.id,
        organizations: result.user?.OrganizationMembers || [],
      });

      return NextResponse.json(
        {
          success: true,
          data: {
            organization: result.organization.id,
            name: result.organization.name,
          },
          token,
        },
        { status: 200 },
      );
    } catch (error) {
      return handleError(error, "Failed to create organization");
    }
  });
}

export async function GET(request: NextRequest) {
  return privateRoute(request, { permissions: [] }, async (curruser) => {
    try {
      const organizations = await prisma.organization.findMany({
        where: {
          ownerId: curruser.id,
        },
        select: {
          id: true,
          name: true,
          createdAt: true,
          Owner: true,
          status: true,
        },
        orderBy: {
          createdAt: "asc",
        },
      });

      return NextResponse.json(
        {
          success: true,
          organizations,
        },
        { status: 200 },
      );
    } catch (error) {
      return NextResponse.json(
        {
          success: false,
          message: "Failed to fetch organizations.",
        },
        { status: 500 },
      );
    }
  });
}
