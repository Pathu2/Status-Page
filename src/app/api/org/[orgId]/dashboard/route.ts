import { db } from "@/db";
import { eq, and, param } from "drizzle-orm";
import { auth } from "@clerk/nextjs/server";
import { orgMembers, organizations, services } from "@/db/schema";

export async function GET(
  req: Request,
  context: { params: { orgId: string } }
) {
  const { userId } = await auth();
  const orgId = context.params.orgId;
  if (!userId) {
    return new Response("Unauthorized", { status: 401 });
  }

  const member = await db.query.orgMembers.findFirst({
    where: and(eq(orgMembers.orgId, orgId), eq(orgMembers.userId, userId)),
  });

  if (!member) {
    return new Response("Forbidden", { status: 403 });
  }

  const [org] = await db
    .select()
    .from(organizations)
    .where(eq(organizations.id, orgId));

  const orgServices = await db
    .select()
    .from(services)
    .where(eq(services.orgId, orgId));

  return Response.json({
    organization: org,
    services: orgServices,
    role: member.role,
  });
}
