import Anthropic from "@anthropic-ai/sdk";
import { buildMessagesWithMatchContext, type MatchContextPayload } from "@/lib/buildReplyMessages";
import { buildSystemPrompt, SYSTEM_PROMPT } from "@/lib/prompts";
import { UserProfile } from "@/lib/types";

const client = new Anthropic();

export async function POST(req: Request) {
  try {
    const { history, profile, matchContext } = await req.json();

    const systemPrompt = profile
      ? buildSystemPrompt(profile as UserProfile)
      : SYSTEM_PROMPT;

    const messages = buildMessagesWithMatchContext(
      history as { role: string; content: string }[],
      matchContext as MatchContextPayload | null | undefined
    );

    const response = await client.messages.create({
      model: "claude-sonnet-4-6",
      max_tokens: 1024,
      system: systemPrompt,
      messages,
    });

    const content = response.content[0];
    if (content.type !== "text") {
      return Response.json({ error: "Unexpected response type" }, { status: 500 });
    }

    const clean = content.text.replace(/```json\n?|\n?```/g, "").trim();
    const parsed = JSON.parse(clean);
    return Response.json(parsed);
  } catch (err) {
    console.error("API error:", err);
    return Response.json({ error: "Something went wrong" }, { status: 500 });
  }
}
