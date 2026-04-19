import type { UserProfile } from "./types";
import { DEFAULT_USER_DISPLAY_NAME } from "./types";

/**
 * Minimal profile when the user skips full style onboarding.
 * Warm/medium defaults match lib/prompts.ts fallbacks.
 */
export function createSkippedStyleProfile(): UserProfile {
  return {
    name: DEFAULT_USER_DISPLAY_NAME,
    age: "",
    bio: "",
    vibe: "warm",
    length: "medium",
    emoji: false,
    haha: false,
    examples: [],
  };
}
