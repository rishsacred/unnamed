import Link from "next/link";

import { PrimaryButton } from "@/components/primary-button";

export default function Home() {
  return (
    <div className="flex flex-col gap-16">
      <section className="rounded-2xl bg-white p-10 shadow-sm">
        <div className="max-w-3xl space-y-6">
          <p className="text-sm font-semibold uppercase tracking-wide text-brand-600">
            Verified preparation plans
          </p>
          <h1 className="text-3xl font-semibold text-slate-900 md:text-4xl">
            Evidence-backed preparation plans from trusted sources.
          </h1>
          <p className="text-lg text-slate-600">
            Submit a preparation goal, we search the web for high-credibility sources,
            and generate a structured plan with citations so you can focus on the prep,
            not the research.
          </p>
          <div className="flex flex-wrap gap-3">
            <PrimaryButton href="/sign-up">Create your account</PrimaryButton>
            <Link
              href="/dashboard"
              className="inline-flex items-center justify-center rounded-md border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700 hover:border-slate-400"
            >
              Go to dashboard
            </Link>
          </div>
        </div>
      </section>
      <section className="grid gap-6 md:grid-cols-3">
        {[
          {
            title: "Verified sources",
            description:
              "We only use content from the sources we retrieve. Citations are required for every plan."
          },
          {
            title: "Structured plans",
            description:
              "Get daily or weekly preparation plans with milestones, resources, and next steps."
          },
          {
            title: "Account history",
            description:
              "Save and revisit every prompt, response, and resource list from your dashboard."
          }
        ].map((item) => (
          <div key={item.title} className="rounded-2xl bg-white p-6 shadow-sm">
            <h3 className="text-lg font-semibold text-slate-900">{item.title}</h3>
            <p className="mt-2 text-sm text-slate-600">{item.description}</p>
          </div>
        ))}
      </section>
    </div>
  );
}
