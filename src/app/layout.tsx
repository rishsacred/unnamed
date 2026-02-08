import "./globals.css";

import { ClerkProvider } from "@clerk/nextjs";
import type { Metadata } from "next";
import { Inter } from "next/font/google";

import { AppFooter } from "@/components/app-footer";
import { AppHeader } from "@/components/app-header";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Verified Preparation Assistant",
  description: "Evidence-backed preparation plans with verified sources."
};

export default function RootLayout({
  children
}: {
  children: React.ReactNode;
}) {
  return (
    <ClerkProvider>
      <html lang="en" className={inter.className}>
        <body>
          <AppHeader />
          <main className="mx-auto flex w-full max-w-6xl flex-1 flex-col px-6 py-10">
            {children}
          </main>
          <AppFooter />
        </body>
      </html>
    </ClerkProvider>
  );
}
