import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import privateRoute from "@/app/api/helpers/privateRoute";
import handleError from "@/app/api/helpers/handleError";
import { createRatingSchema } from "@/schemas/rating.schema";

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
      permissions: ["RATING:*:*", "RATING:CREATE:*", "RATING:CREATE:ASSIGNED"],
    },
    async (user) => {
      try {
        // 1. Validate request body
        const parsed = createRatingSchema.parse(body);
        const { employeeId, periodStart, periodEnd, feedback, criteriaScores } =
          parsed;

        // 2. Check if employee being rated is a member of the organization
        const employeeMembership = await prisma.organizationMember.findFirst({
          where: {
            userId: employeeId,
            organizationId: organizationId,
          },
          include: {
            User: true,
          },
        });

        if (!employeeMembership) {
          return NextResponse.json(
            {
              success: false,
              error: {
                code: "EMPLOYEE_NOT_IN_ORG",
                message: "The employee is not part of this organization",
              },
            },
            { status: 400 },
          );
        }

        const orgMembership = user.organizations.find(
          (org) => org.organizationId === organizationId,
        );

        const isOwner = orgMembership?.role === "OWNER";

        const employeeRole = employeeMembership.role;

        // 3. Determine if supervisor is allowed
        let isAllowed = false;

        if (isOwner) {
          isAllowed = true; // Owner can rate anyone
        } else if (
          orgMembership?.role === "SUPERVISOR" &&
          employeeRole === "EMPLOYEE"
        ) {
          // Supervisor can only rate assigned employees
          const isSupervisor = await prisma.organizationMember.findFirst({
            where: {
              userId: employeeId,
              supervisorId: user.id,
            },
          });

          if (isSupervisor) isAllowed = true;
        }

        if (!isAllowed) {
          return NextResponse.json(
            {
              success: false,
              error: {
                code: "NOT_AUTHORIZED",
                message: "You are not authorized to rate this employee",
                debug: {
                  userId: user.id,
                  employeeId,
                  userRole: user.role,
                  employeeRole,
                  isOwner,
                  organizationId,
                },
              },
            },
            { status: 403 },
          );
        }

        // 4. Validate criteria belong to the organization
        const criteriaIds = criteriaScores.map((cs) => cs.criteriaId);

        const criteria = await prisma.criteria.findMany({
          where: {
            id: { in: criteriaIds },
            orgId: organizationId,
          },
          select: { id: true },
        });

        if (criteria.length !== criteriaScores.length) {
          const validIds = new Set(criteria.map((c) => c.id));

          const missingIds = criteriaScores
            .filter((cs) => !validIds.has(cs.criteriaId))
            .map((cs) => cs.criteriaId);

          return NextResponse.json(
            {
              success: false,
              error: {
                code: "INVALID_CRITERIA",
                message: `The following criteria do not belong to this organization: ${missingIds.join(", ")}`,
              },
            },
            { status: 400 },
          );
        }

        // 5. Calculate score
        const maxOverallScore = criteriaScores.reduce(
          (sum, cs) => sum + cs.score,
          0,
        );

        // 6. Create rating
        const newRating = await prisma.rating.create({
          data: {
            periodStart: new Date(periodStart),
            periodEnd: new Date(periodEnd),
            feedback,
            overallScore: maxOverallScore,
            maxOverallScore,
            employeeId,
            supervisorId: user.id,
            organizationId,
            criteriaScores: {
              create: criteriaScores.map((cs) => ({
                criteriaId: cs.criteriaId,
                score: cs.score,
              })),
            },
          },
          include: {
            criteriaScores: true,
          },
        });

        return NextResponse.json(
          { success: true, data: newRating },
          { status: 201 },
        );
      } catch (error) {
        return handleError(error, "Failed to create rating");
      }
    },
  );
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id: organizationId } = await params;

  return privateRoute(
    request,
    {
      organizationId,
      permissions: ["RATING:*:*", "RATING:READ:*"],
    },
    async (user) => {
      try {
        const ratings = await prisma.rating.findMany({
          where: {
            organizationId,
            ...(user.role === "SUPERVISOR" && { supervisorId: user.id }),
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
            Employee: {
              select: {
                firstName: true,
                lastName: true,
                email: true,
              },
            },
            Supervisor: {
              select: {
                firstName: true,
                lastName: true,
                email: true,
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
        return handleError(error, "Failed to fetch ratings");
      }
    },
  );
}
