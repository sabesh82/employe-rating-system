import { CreateOrganizationSchema } from "@/schemas/organization.schema";
import { LoginUserSchema, RegisterUserSchema } from "@/schemas/user.schema";
import { Prisma, User } from "@prisma/client";
import { z } from "zod";

export type UserWithToken = User & { token: string };

export type LoginInput = z.infer<typeof LoginUserSchema>;

export type RegisterInput = z.infer<typeof RegisterUserSchema>;

export type OrganizationNameInput = z.infer<typeof CreateOrganizationSchema>;

export type UserWithOrgMembers = Prisma.UserGetPayload<{
  include: { OrganizationMembers: true };
}>;

export type UserWithRelations = Prisma.UserGetPayload<{
  select: {
    id: true;
    email: true;
    firstName: true;
    lastName: true;
    createdAt: true;
    updatedAt: true;
    OrganizationMembers: true;
    OwnedOrganizations: true;
    ReceivedRatings: true;
    GivenRatings: true;
  };
}>;
