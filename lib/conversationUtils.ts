import type { Conversation } from "./types";

export function hasSavedMatchContext(c: Conversation): boolean {
  return Boolean(
    c.matchProfileText?.trim() ||
      (c.matchProfileImages && c.matchProfileImages.length > 0) ||
      c.priorChatText?.trim() ||
      (c.priorChatImages && c.priorChatImages.length > 0)
  );
}

export function profileNotesBadgeCount(c: Conversation): number {
  return (c.flags?.length ?? 0) + (hasSavedMatchContext(c) ? 1 : 0);
}
