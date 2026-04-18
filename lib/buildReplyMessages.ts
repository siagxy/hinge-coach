import type { MessageParam } from "@anthropic-ai/sdk/resources/messages";
import type { ContentBlockParam } from "@anthropic-ai/sdk/resources/messages";

export type MatchContextImagePayload = {
  mediaType: "image/jpeg";
  data: string;
};

export type MatchContextPayload = {
  matchName: string;
  matchProfileText?: string;
  priorChatText?: string;
  matchProfileImages?: MatchContextImagePayload[];
  priorChatImages?: MatchContextImagePayload[];
};

const MAX_TEXT = 6000;

function truncate(text: string, max: number): string {
  if (text.length <= max) return text;
  return `${text.slice(0, max)}\n[truncated]`;
}

/**
 * Merges per-match context into the first user message so we keep strict user/assistant alternation.
 * If there are images, the first user message becomes multimodal (text + image blocks).
 */
export function buildMessagesWithMatchContext(
  history: { role: string; content: string }[],
  match?: MatchContextPayload | null
): MessageParam[] {
  const base = history.map((m) => ({
    role: m.role as "user" | "assistant",
    content: m.content,
  })) as MessageParam[];

  if (!match) return base;

  const profileText = match.matchProfileText?.trim() ?? "";
  const priorText = match.priorChatText?.trim() ?? "";
  const profileImgs = match.matchProfileImages ?? [];
  const priorImgs = match.priorChatImages ?? [];
  const hasText = profileText.length > 0 || priorText.length > 0;
  const hasImages = profileImgs.length + priorImgs.length > 0;

  if (!hasText && !hasImages) return base;
  if (base.length === 0) return base;

  const first = base[0];
  if (first.role !== "user" || typeof first.content !== "string") {
    return base;
  }

  const original = first.content;
  const textBlocks: string[] = [
    `Optional context for this match (${match.matchName}). Use it to personalize replies; do not invent facts beyond it.`,
  ];
  if (profileText) {
    textBlocks.push(`--- His profile (pasted text) ---\n${truncate(profileText, MAX_TEXT)}`);
  }
  if (priorText) {
    textBlocks.push(`--- Prior conversation (pasted text) ---\n${truncate(priorText, MAX_TEXT)}`);
  }
  textBlocks.push("--- Live thread (reply to the latest message from him) ---");

  if (!hasImages) {
    const merged = `${textBlocks.join("\n\n")}\n\n${original}`;
    return [{ role: "user", content: merged }, ...base.slice(1)];
  }

  const content: ContentBlockParam[] = [
    { type: "text", text: textBlocks.join("\n\n") },
  ];

  for (const img of profileImgs) {
    content.push({
      type: "image",
      source: {
        type: "base64",
        media_type: img.mediaType,
        data: img.data,
      },
    });
  }
  if (profileImgs.length > 0 && priorImgs.length > 0) {
    content.push({
      type: "text",
      text: "--- Prior conversation (screenshots) ---",
    });
  }
  for (const img of priorImgs) {
    content.push({
      type: "image",
      source: {
        type: "base64",
        media_type: img.mediaType,
        data: img.data,
      },
    });
  }

  content.push({ type: "text", text: original });

  return [{ role: "user", content }, ...base.slice(1)];
}
