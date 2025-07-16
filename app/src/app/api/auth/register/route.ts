import { RegisterUserSchema } from "@/schemas/user.schema";
import { NextRequest, NextResponse } from "next/server";
import handleError from "../../helpers/handleError";
import { hash } from "argon2";
import prisma from "@/lib/prisma";
import { OWNER_PERMISSIONS } from "../permission";
import generateToken, { IJWTPayload } from "../../helpers/generateToken";
import { UserRole } from "@prisma/client";

/**
 * @route POST /api/blog-posts
 * @desc Create a new blog post
 * @access Public
 */

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const validatedData = RegisterUserSchema.parse(body);

    const isUserExist = await prisma.user.findUnique({
      where: { email: validatedData.email },
    });

    if (isUserExist) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: "USER_ALREADY_EXISTS",
            message: "User is already exist",
          },
        },
        { status: 409 },
      );
    }

    const isOrganizationExist = await prisma.organization.findUnique({
      where: { name: validatedData.organizationName },
    });

    if (isOrganizationExist) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: "ORGANIZATION_NAME_ALREADY_EXISTS",
            message: "Organization name is already exist",
          },
        },
        { status: 409 },
      );
    }

    const { firstName, lastName, email, password, organizationName } =
      validatedData;

    const hashedPassword = await hash(password);

    const result = await prisma.$transaction(async (tx) => {
      const user = await tx.user.create({
        data: {
          firstName,
          lastName,
          email,
          password: hashedPassword,
        },
      });

      const organization = await tx.organization.create({
        data: {
          name: organizationName,
          Owner: {
            connect: {
              id: user.id,
            },
          },
        },
      });

      const organizationMember = await tx.organizationMember.create({
        data: {
          organizationId: organization.id,
          userId: user.id,
          role: UserRole.OWNER,
          permissions: OWNER_PERMISSIONS,
        },
      });

      return { user, organization, organizationMember };
    });

    const token = generateToken<IJWTPayload>({
      id: result.user.id,
      organizations: [result.organizationMember],
    });

    /*const userResponse = {
      id: result.user.id,
      email: result.user.email,
      firstName: result.user.firstName,
      lastName: result.user.lastName,
      token,
    };*/

    const { password: _, ...userResponse } = result.user;
    
    const { ...orgResponse } = result.organization;

    return NextResponse.json(
      {
        success: true,
        data: {
          user: userResponse,
          organization: orgResponse,
          token,
        },
      },
      { status: 201 },
    );
  } catch (error) {
    return handleError(error, "Failed to register user");
  }
}
