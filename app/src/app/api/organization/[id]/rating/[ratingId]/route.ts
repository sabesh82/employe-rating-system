import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import privateRoute from "@/app/api/helpers/privateRoute";
import handleError from "@/app/api/helpers/handleError";
import { createRatingSchema } from "@/schemas/rating.schema"; // reuse validation schema, or create a partial one for PATCH

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string; ratingId: string }> },
) {
  const { id: organizationId, ratingId } = await params;
  const body = await request.json();

  return privateRoute(
    request,
    {
      organizationId,
      permissions: ["RATING:*:*", "RATING:UPDATE:*"],
    },
    async (user) => {
      try {
        // Partial validation for PATCH (you can create a separate schema if needed)
        const parsed = createRatingSchema.partial().parse(body);
        const { employeeId, periodStart, periodEnd, feedback, criteriaScores } =
          parsed;

        // Fetch existing rating and verify ownership and org
        const existingRating = await prisma.rating.findUnique({
          where: { id: ratingId },
          include: { criteriaScores: true },
        });

        if (!existingRating) {
          return NextResponse.json(
            {
              success: false,
              error: { code: "RATING_NOT_FOUND", message: "Rating not found" },
            },
            { status: 404 },
          );
        }

        if (existingRating.organizationId !== organizationId) {
          return NextResponse.json(
            {
              success: false,
              error: {
                code: "FORBIDDEN",
                message: "Rating does not belong to this organization",
              },
            },
            { status: 403 },
          );
        }

        // Check permission: Owner can update any; Supervisor can update only their ratings
        const orgMembership = user.organizations.find(
          (org) => org.organizationId === organizationId,
        );
        const isOwner = orgMembership?.role === "OWNER";

        if (!isOwner && existingRating.supervisorId !== user.id) {
          return NextResponse.json(
            {
              success: false,
              error: {
                code: "NOT_AUTHORIZED",
                message: "Not authorized to update this rating",
              },
            },
            { status: 403 },
          );
        }

        // If criteriaScores are provided, validate their organization
        if (criteriaScores) {
          const criteriaIds = criteriaScores.map((cs) => cs.criteriaId);
          const criteria = await prisma.criteria.findMany({
            where: { id: { in: criteriaIds }, orgId: organizationId },
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
                  message: `Invalid criteria IDs: ${missingIds.join(", ")}`,
                },
              },
              { status: 400 },
            );
          }
        }

        // Calculate new overallScore if criteriaScores provided
        const overallScore =
          criteriaScores?.reduce((sum, cs) => sum + cs.score, 0) ??
          existingRating.overallScore;
        const maxOverallScore = overallScore; // You can adjust if needed

        // Update rating and related criteriaScores transactionally
        const updatedRating = await prisma.$transaction(async (tx) => {
          // Update rating core fields
          const updated = await tx.rating.update({
            where: { id: ratingId },
            data: {
              periodStart: periodStart ? new Date(periodStart) : undefined,
              periodEnd: periodEnd ? new Date(periodEnd) : undefined,
              feedback,
              overallScore,
              maxOverallScore,
              employeeId,
              // supervisorId should not be changed here
            },
          });

          if (criteriaScores) {
            // Delete old criteriaScores
            await tx.criteriaScore.deleteMany({ where: { ratingId } });
            // Create new criteriaScores
            await tx.criteriaScore.createMany({
              data: criteriaScores.map((cs) => ({
                ratingId,
                criteriaId: cs.criteriaId,
                score: cs.score,
              })),
            });
          }

          return updated;
        });

        return NextResponse.json(
          { success: true, data: updatedRating },
          { status: 200 },
        );
      } catch (error) {
        return handleError(error, "Failed to update rating");
      }
    },
  );
}

// DELETE: Delete a rating by id
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string; ratingId: string }> },
) {
  const { id: organizationId, ratingId } = await params;

  return privateRoute(
    request,
    {
      organizationId,
      permissions: ["RATING:*:*", "RATING:DELETE:*"],
    },
    async (user) => {
      try {
        const existingRating = await prisma.rating.findUnique({
          where: { id: ratingId },
        });

        if (!existingRating) {
          return NextResponse.json(
            {
              success: false,
              error: { code: "RATING_NOT_FOUND", message: "Rating not found" },
            },
            { status: 404 },
          );
        }

        if (existingRating.organizationId !== organizationId) {
          return NextResponse.json(
            {
              success: false,
              error: {
                code: "FORBIDDEN",
                message: "Rating does not belong to this organization",
              },
            },
            { status: 403 },
          );
        }

        // Check permission: Owner can delete any; Supervisor can delete their own ratings only
        const orgMembership = user.organizations.find(
          (org) => org.organizationId === organizationId,
        );
        const isOwner = orgMembership?.role === "OWNER";

        if (!isOwner && existingRating.supervisorId !== user.id) {
          return NextResponse.json(
            {
              success: false,
              error: {
                code: "NOT_AUTHORIZED",
                message: "Not authorized to delete this rating",
              },
            },
            { status: 403 },
          );
        }

        // Delete dependent criteriaScores first to avoid FK constraint
        await prisma.criteriaScore.deleteMany({
          where: { ratingId },
        });

        // Then delete the rating itself
        await prisma.rating.delete({
          where: { id: ratingId },
        });

        return NextResponse.json(
          { success: true, message: "Rating deleted successfully" },
          { status: 200 },
        );
      } catch (error) {
        return handleError(error, "Failed to delete rating");
      }
    },
  );
}
