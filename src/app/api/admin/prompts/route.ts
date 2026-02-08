import { NextResponse } from "next/server";

import { requireAdmin } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  await requireAdmin();

  const prompts = await prisma.prompt.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      user: {
        select: { email: true }
      },
      response: true
    }
  });

  return NextResponse.json({ prompts });
}
