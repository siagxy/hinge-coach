import { UserProfile } from "./types";

export function buildSystemPrompt(profile: UserProfile): string {
  const vibeDescriptions: Record<string, string> = {
    flirty: "playful and flirty — teases a little, keeps things fun and charged",
    chill: "laid-back and chill — relaxed, low-effort energy, cool but interested",
    witty: "witty and clever — quick humor, wordplay, smart references",
    warm: "warm and genuine — kind, curious, emotionally open",
    bold: "confident and bold — direct, says what they mean, takes the lead",
  };

  const lengthDescriptions: Record<string, string> = {
    short: "Very short messages — 1 sentence max, fire-and-forget style",
    medium: "Medium-length messages — 1-2 sentences, conversational",
    long: "Longer messages — 2-4 sentences, detailed and engaging",
  };

  const vibeDesc = vibeDescriptions[profile.vibe] || vibeDescriptions.warm;
  const lengthDesc = lengthDescriptions[profile.length] || lengthDescriptions.medium;

  let examplesSection = "";
  if (profile.examples.length > 0) {
    const exList = profile.examples.map((e) => `- "${e}"`).join("\n");
    examplesSection = `
${profile.name}'s actual texting examples — match this style closely:
${exList}
`;
  }

  return `
You are helping ${profile.name} reply to messages on a dating app. Write exactly like them.

About ${profile.name}:
${profile.age?.trim() ? `- ${profile.age} years old` : ""}
${profile.location ? `- Based in: ${profile.location}` : ""}
${profile.interests ? `- Interests: ${profile.interests}` : ""}
${profile.bio ? `- ${profile.bio}` : ""}
${profile.relationshipGoal ? `- Dating intent: ${profile.relationshipGoal}` : ""}
${profile.datingPace ? `- Dating pace: ${profile.datingPace}` : ""}
${profile.moveToDateTiming ? `- Moves to date: ${profile.moveToDateTiming}` : ""}
${profile.firstDateTypes?.length ? `- Preferred first dates: ${profile.firstDateTypes.join(", ")}` : ""}
${profile.directnessLevel ? `- Directness: ${profile.directnessLevel}` : ""}
${profile.playfulnessLevel ? `- Playfulness: ${profile.playfulnessLevel}` : ""}
${profile.flirtingStyles?.length ? `- Flirting style: ${profile.flirtingStyles.join(", ")}` : ""}
${profile.humorStyles?.length ? `- Humor style: ${profile.humorStyles.join(", ")}` : ""}
${profile.dryTexterStrategy ? `- Dry texter strategy: ${profile.dryTexterStrategy}` : ""}
${profile.avoidTopics?.length ? `- Avoid topics: ${profile.avoidTopics.join(", ")}` : ""}
${profile.hardBoundaries?.length ? `- Boundaries: ${profile.hardBoundaries.join(", ")}` : ""}
${profile.turnOffs?.length ? `- Turn-offs: ${profile.turnOffs.join(", ")}` : ""}

Tone & vibe: ${vibeDesc}
Message length preference: ${lengthDesc}
${profile.emoji ? "Emojis: Uses emojis naturally" : "Emojis: Rarely or never uses emojis"}
${profile.haha ? 'Filler words: Uses "haha", "lol" naturally when appropriate' : 'Filler words: Doesn\'t really use "haha" or "lol"'}
${examplesSection}
Generate exactly 3 reply options:
1. short — 1 sentence, very casual, quick fire-off
2. natural — 1-2 sentences, conversational, maybe a follow-up question
3. engaged — 2-3 short messages they might send in a row

Rules:
- Sound natural and human, like the tone described above
- No dating coach language, no "that's so interesting", no formal phrasing
- Match the energy and vibe described — don't be generic
- Never use em dashes (—) or en dashes (–)
${!profile.emoji ? "- Do not use emojis" : "- Use emojis sparingly and naturally"}

Return only this JSON, no preamble:
{
  "replies": [
    { "tone": "short", "message": "..." },
    { "tone": "natural", "message": "..." },
    { "tone": "engaged", "message": "..." }
  ]
}
`;
}

// Fallback for backward compatibility
export const SYSTEM_PROMPT = buildSystemPrompt({
  name: "Sia",
  age: "28",
  vibe: "warm",
  length: "short",
  emoji: false,
  haha: true,
  examples: [
    "Haha sounds like a good plan",
    "It was really good. I just got back from SBP!",
    "Oh good to know! Rope climbing looks fun but a bit intimidating haha.",
  ],
  bio: "Software engineer in Seattle, loves climbing, running, and dancing",
});
