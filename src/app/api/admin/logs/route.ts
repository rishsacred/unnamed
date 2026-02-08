import { NextResponse } from "next/server";

import { requireAdmin } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  await requireAdmin();

  const logs = await prisma.adminLog.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      user: {
        select: { email: true }
      }
    }
  });

  return NextResponse.json({ logs });
}
