import { NextResponse } from "next/server";

import { ensureUser } from "@/lib/auth";
import { openai } from "@/lib/openai";
import { prisma } from "@/lib/prisma";
import { searchVerifiedSources } from "@/lib/search";
import { promptSchema } from "@/lib/validation";

const MIN_SOURCES = 2;
const NOT_ENOUGH_MESSAGE =
  "Not enough verified sources found to answer reliably.";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { prompt } = promptSchema.parse(body);
    const user = await ensureUser();

    const sources = await searchVerifiedSources(prompt);
    const trimmedSources = sources.slice(0, 6);

    const promptRecord = await prisma.prompt.create({
      data: {
        userId: user.id,
        promptText: prompt
      }
    });

    if (trimmedSources.length < MIN_SOURCES) {
      const responseRecord = await prisma.generatedResponse.create({
        data: {
          userId: user.id,
          promptId: promptRecord.id,
          responseText: NOT_ENOUGH_MESSAGE,
          citationsJson: []
        }
      });

      await prisma.adminLog.create({
        data: {
          userId: user.id,
          action: "PLAN_GENERATION_INSUFFICIENT_SOURCES",
          metadata: {
            promptId: promptRecord.id,
            sourcesFound: trimmedSources.length
          }
        }
      });

      return NextResponse.json({
        response: responseRecord.responseText,
        citations: []
      });
    }

    const citations = trimmedSources.map((source, index) => ({
      id: index + 1,
      title: source.title,
      url: source.url,
      snippet: source.content
    }));

    const systemPrompt = `You are a verified preparation assistant. Only use the provided sources.\n\nIf the sources are insufficient to make a reliable preparation plan, respond exactly with: ${NOT_ENOUGH_MESSAGE}\n\nOtherwise, generate a structured plan with these sections: Overview, Preparation Timeline, Key Topics, Daily/Weekly Plan, and Verification Checklist.\nUse inline citations like [1], [2] that refer to the source list.`;

    const model = process.env.OPENAI_MODEL || "gpt-4o-mini";

    const completion = await openai.chat.completions.create({
      model,
      messages: [
        { role: "system", content: systemPrompt },
        {
          role: "user",
          content: `User prompt: ${prompt}\n\nSources:\n${citations
            .map(
              (source) =>
                `[${source.id}] ${source.title} - ${source.url}\n${source.snippet}`
            )
            .join("\n\n")}`
        }
      ],
      temperature: 0.2
    });

    const responseText = completion.choices[0]?.message?.content?.trim();

    if (!responseText || responseText === NOT_ENOUGH_MESSAGE) {
      return NextResponse.json({
        response: NOT_ENOUGH_MESSAGE,
        citations: []
      });
    }

    if (!responseText.includes("[1]")) {
      return NextResponse.json({
        response: NOT_ENOUGH_MESSAGE,
        citations: []
      });
    }

    await prisma.savedResource.createMany({
      data: citations.map((source) => ({
        promptId: promptRecord.id,
        title: source.title,
        url: source.url,
        snippet: source.snippet
      }))
    });

    const responseRecord = await prisma.generatedResponse.create({
      data: {
        userId: user.id,
        promptId: promptRecord.id,
        responseText,
        citationsJson: citations
      }
    });

    await prisma.adminLog.create({
      data: {
        userId: user.id,
        action: "PLAN_GENERATION_SUCCESS",
        metadata: {
          promptId: promptRecord.id,
          sourcesUsed: citations.length,
          model
        }
      }
    });

    return NextResponse.json({
      response: responseRecord.responseText,
      citations
    });
  } catch (error) {
    return NextResponse.json(
      { message: (error as Error).message },
      { status: 400 }
    );
  }
}
