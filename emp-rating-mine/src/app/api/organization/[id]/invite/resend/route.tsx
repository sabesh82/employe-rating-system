import privateRoute from "@/app/api/helpers/privateRoute";
import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { OrganizationStatus, UserStatus } from "@prisma/client";
import generateInviteToken from "../generateInviteToken";
import InviteUser from "@/email-templates/InviteUser";
import handleError from "@/app/api/helpers/handleError";
import { render } from "@react-email/components";
import { sendEmail } from "@/lib/nodemailer";
import { ResendInviteSchema } from "@/schemas/user.schema";

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id: organizationId } = await params;
  const body = await request.json();

  return privateRoute(
    request,
    {
      organizationId,
      permissions: ["ORGANIZATION:*:*", "ORGANIZATION:INVITE:*"],
    },
    async (inviter) => {
      try {
        const { id: invitedUserId } = ResendInviteSchema.parse(body);

        const [organization, invitedUser] = await Promise.all([
          prisma.organization.findUnique({
            where: {
              id: organizationId,
            },
            select: {
              id: true,
              name: true,
              ownerId: true,
            },
          }),
          prisma.user.findUnique({
            where: {
              id: invitedUserId,
            },
            include: {
              OrganizationMembers: {
                where: {
                  organizationId,
                  status: UserStatus.INVITED,
                },
              },
            },
          }),
        ]);
        if (!invitedUser || invitedUser.OrganizationMembers.length === 0) {
          return NextResponse.json(
            {
              success: false,
              error: {
                code: "INVITATION_NOT_FOUND",
                message: "This user has not been invited to the organization.",
              },
            },
            { status: 404 },
          );
        }

        if (!organization || organization.ownerId !== inviter.id) {
          return NextResponse.json(
            {
              success: false,
              error: {
                code: "ORGANIZATION_NOT_FOUND",
                message: "Organization is not found or inactive.",
              },
            },
            { status: 404 },
          );
        }

        /*
        const member = await prisma.organizationMember.findFirst({
          where: {
            userId,
            organizationId,
            status: UserStatus.INVITED,
          },
          include: {
            User: true,
          },
        });
        
        if (!member) {
          return NextResponse.json(
            {
              success: false,
              error: {
                code: "INVITED_MEMBER_NOT_FOUND",
                message:
                  "User is either not part of this organization or has not been invited.",
              },
            },
            { status: 404 },
          );
        }
        */

        const token = generateInviteToken({
          id: invitedUser.id,
          organizationId,
        });

        const inviteLink = `${process.env.NEXT_PUBLIC_HOST_URL}/accept-invite?token=${token}`;

        const emailHtml = await render(
          <InviteUser
            invitedByUsername={inviter.firstName || inviter.email}
            teamName={organization.name}
            username={invitedUser.firstName || invitedUser.email}
            invitedByEmail={inviter.email}
            inviteLink={inviteLink}
          />,
        );

        await sendEmail({
          to: invitedUser.email,
          subject: `Reminder: Join ${organization.name}`,
          html: emailHtml,
        });

        return NextResponse.json(
          {
            success: true,
            message: "Invitation resent successfully.",
            data: {
              userId: invitedUser.id,
              email: invitedUser.email,
              organization: {
                id: organization.id,
                name: organization.name,
              },
              inviteResent: true,
            },
          },
          { status: 200 },
        );
      } catch (error) {
        return handleError(error, "Failed to resend invitation");
      }
    },
  );
}
