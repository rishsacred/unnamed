"use client";

import { useState } from "react";

import { PromptInput } from "@/lib/validation";

type Citation = {
  id: number;
  title: string;
  url: string;
  snippet: string;
};

export function PromptForm() {
  const [prompt, setPrompt] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [response, setResponse] = useState<string | null>(null);
  const [citations, setCitations] = useState<Citation[]>([]);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsLoading(true);
    setError(null);
    setResponse(null);
    setCitations([]);

    try {
      const payload: PromptInput = { prompt };
      const res = await fetch("/api/plan", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message ?? "Request failed");
      }

      setResponse(data.response);
      setCitations(data.citations ?? []);
    } catch (submitError) {
      setError((submitError as Error).message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="rounded-2xl bg-white p-6 shadow-sm">
      <h2 className="text-lg font-semibold text-slate-900">
        Generate a verified preparation plan
      </h2>
      <p className="mt-2 text-sm text-slate-600">
        Example: “Prepare me for a Google STEP interview in 6 weeks.”
      </p>
      <form onSubmit={handleSubmit} className="mt-4 space-y-4">
        <textarea
          value={prompt}
          onChange={(event) => setPrompt(event.target.value)}
          className="min-h-[120px] w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500"
          placeholder="Enter your preparation prompt..."
          required
        />
        <button
          type="submit"
          disabled={isLoading}
          className="inline-flex items-center justify-center rounded-md bg-brand-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-brand-700 disabled:cursor-not-allowed disabled:bg-brand-300"
        >
          {isLoading ? "Generating..." : "Generate plan"}
        </button>
      </form>
      {error ? (
        <p className="mt-4 text-sm text-red-600">{error}</p>
      ) : null}
      {response ? (
        <div className="mt-6 space-y-4">
          <div className="prose max-w-none text-sm text-slate-800">
            <pre className="whitespace-pre-wrap font-sans">{response}</pre>
          </div>
          {citations.length > 0 ? (
            <div className="rounded-lg border border-slate-200 bg-slate-50 p-4">
              <h3 className="text-sm font-semibold text-slate-900">Sources</h3>
              <ul className="mt-2 space-y-2 text-sm text-slate-600">
                {citations.map((citation) => (
                  <li key={citation.id}>
                    <a href={citation.url} target="_blank" rel="noreferrer">
                      [{citation.id}] {citation.title}
                    </a>
                    <p className="text-xs text-slate-500">{citation.snippet}</p>
                  </li>
                ))}
              </ul>
            </div>
          ) : null}
        </div>
      ) : null}
    </div>
  );
}
