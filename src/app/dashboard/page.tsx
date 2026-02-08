import Link from "next/link";

import { ensureUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { PromptForm } from "@/app/dashboard/prompt-form";

export default async function DashboardPage() {
  const user = await ensureUser();
  const prompts = await prisma.prompt.findMany({
    where: { userId: user.id },
    orderBy: { createdAt: "desc" },
    include: { response: true, savedResources: true }
  });

  return (
    <div className="space-y-10">
      <section className="rounded-2xl bg-white p-6 shadow-sm">
        <h1 className="text-2xl font-semibold text-slate-900">Welcome back</h1>
        <p className="mt-2 text-sm text-slate-600">
          Keep your preparation on track with verified, citation-backed plans.
        </p>
      </section>

      <PromptForm />

      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-slate-900">Past prompts</h2>
          <Link href="/admin" className="text-sm text-brand-600">
            View admin insights
          </Link>
        </div>
        <div className="space-y-4">
          {prompts.length === 0 ? (
            <div className="rounded-2xl bg-white p-6 text-sm text-slate-500 shadow-sm">
              No prompts yet. Submit your first prompt to generate a plan.
            </div>
          ) : (
            prompts.map((prompt) => (
              <div
                key={prompt.id}
                className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"
              >
                <p className="text-sm text-slate-500">
                  {prompt.createdAt.toLocaleDateString()}
                </p>
                <h3 className="mt-2 text-base font-semibold text-slate-900">
                  {prompt.promptText}
                </h3>
                {prompt.response ? (
                  <div className="mt-4 space-y-3 text-sm text-slate-700">
                    <pre className="whitespace-pre-wrap font-sans">
                      {prompt.response.responseText}
                    </pre>
                    {prompt.savedResources.length > 0 ? (
                      <div>
                        <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                          Sources
                        </p>
                        <ul className="mt-2 space-y-1 text-xs text-slate-600">
                          {prompt.savedResources.map((resource) => (
                            <li key={resource.id}>
                              <a
                                href={resource.url}
                                target="_blank"
                                rel="noreferrer"
                              >
                                {resource.title}
                              </a>
                            </li>
                          ))}
                        </ul>
                      </div>
                    ) : null}
                  </div>
                ) : (
                  <p className="mt-4 text-sm text-slate-500">
                    No response generated yet.
                  </p>
                )}
              </div>
            ))
          )}
        </div>
      </section>
    </div>
  );
}
