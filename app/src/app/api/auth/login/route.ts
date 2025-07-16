import { LoginUserSchema } from "@/schemas/user.schema";
import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { verify } from "argon2";
import generateToken, { IJWTPayload } from "../../helpers/generateToken";
import handleError from "../../helpers/handleError";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const loginInput = LoginUserSchema.parse(body);
    const { email, password } = loginInput;

    const user = await prisma.user.findUnique({
      where: {
        email,
      },
      include: {
        OrganizationMembers: true,
      },
    });

    const invalidCredientialsResponse = NextResponse.json(
      {
        success: false,
        error: {
          code: "INVALID_CREDIENTIALS",
          message: "invalid email or password",
        },
      },
      { status: 401 },
    );

    //verify user
    if (!user) {
      return invalidCredientialsResponse;
    }

    //verify password
    const isPassowordValid = await verify(user.password, password);

    if (!isPassowordValid) {
      return invalidCredientialsResponse;
    }

    //generate jwt token
    const token = generateToken<IJWTPayload>({
      id: user.id,
      organizations: user.OrganizationMembers,
    });

    //prepare response without password
    const { password: _, ...userData } = user;

    return NextResponse.json(
      {
        success: true,
        data: {
          user: userData,
          token,
        },
      },
      { status: 200 },
    );
  } catch (error) {
    return handleError(error, "failed to authenticate user");
  }
}
