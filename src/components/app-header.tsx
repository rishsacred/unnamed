"use client";

import Link from "next/link";
import { SignedIn, SignedOut, UserButton } from "@clerk/nextjs";

import { PrimaryButton } from "@/components/primary-button";

export function AppHeader() {
  return (
    <header className="border-b border-slate-200 bg-white">
      <div className="mx-auto flex w-full max-w-6xl items-center justify-between px-6 py-4">
        <Link href="/" className="text-lg font-semibold text-slate-900">
          Verified Preparation Assistant
        </Link>
        <nav className="flex items-center gap-4 text-sm">
          <SignedOut>
            <Link href="/sign-in" className="text-slate-600 hover:text-slate-900">
              Sign in
            </Link>
            <PrimaryButton href="/sign-up">Get started</PrimaryButton>
          </SignedOut>
          <SignedIn>
            <Link href="/dashboard" className="text-slate-600 hover:text-slate-900">
              Dashboard
            </Link>
            <Link href="/admin" className="text-slate-600 hover:text-slate-900">
              Admin
            </Link>
            <UserButton afterSignOutUrl="/" />
          </SignedIn>
        </nav>
      </div>
    </header>
  );
}
