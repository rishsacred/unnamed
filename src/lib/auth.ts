import { auth, currentUser } from "@clerk/nextjs/server";

import { prisma } from "@/lib/prisma";

const adminEmails = (process.env.ADMIN_EMAILS ?? "")
  .split(",")
  .map((email) => email.trim().toLowerCase())
  .filter(Boolean);

export async function ensureUser() {
  const { userId } = auth();
  if (!userId) {
    throw new Error("Unauthorized");
  }

  const clerkUser = await currentUser();
  if (!clerkUser) {
    throw new Error("Unauthorized");
  }

  const email = clerkUser.emailAddresses[0]?.emailAddress;
  if (!email) {
    throw new Error("No email associated with account.");
  }

  const name = [clerkUser.firstName, clerkUser.lastName].filter(Boolean).join(" ");
  const isAdmin = adminEmails.includes(email.toLowerCase());

  const user = await prisma.user.upsert({
    where: { clerkId: userId },
    create: {
      clerkId: userId,
      email,
      name: name || null,
      role: isAdmin ? "ADMIN" : "USER"
    },
    update: {
      email,
      name: name || null,
      role: isAdmin ? "ADMIN" : undefined
    }
  });

  return user;
}

export async function requireAdmin() {
  const user = await ensureUser();
  if (user.role !== "ADMIN") {
    throw new Error("Forbidden");
  }
  return user;
}
