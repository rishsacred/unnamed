import { tavily } from "@tavily/core";

const client = tavily({ apiKey: process.env.TAVILY_API_KEY ?? "" });

export type SearchResult = {
  title: string;
  url: string;
  content: string;
};

export async function searchVerifiedSources(query: string) {
  if (!process.env.TAVILY_API_KEY) {
    throw new Error("Missing TAVILY_API_KEY");
  }

  const response = await client.search({
    query,
    searchDepth: "advanced",
    maxResults: 6,
    includeAnswer: false,
    includeImages: false
  });

  return response.results
    .filter((result) => result.url && result.content)
    .map((result) => ({
      title: result.title || result.url,
      url: result.url,
      content: result.content
    }));
}
