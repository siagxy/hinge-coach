export type Message = {
  role: "user" | "assistant";
  content: string;
  display?: {
    sender: "him" | "her";
    text: string;
  };
};

export type Reply = {
  tone: "witty" | "warm" | "bold";
  message: string;
};

export type Flag = {
  id: string;
  label: string;
  type: "green" | "red";
};

/** JPEG base64 (no data: prefix), for localStorage + API vision */
export type MatchContextImage = {
  id: string;
  mediaType: "image/jpeg";
  data: string;
};

export type Conversation = {
  id: string;
  name: string;
  history: Message[];
  /** Optional photo for this match (story, list, chat header). */
  avatarImage?: MatchContextImage;
  flags?: Flag[];
  /** Pasted text about his dating profile */
  matchProfileText?: string;
  /** Screenshots of his profile (compressed JPEG) */
  matchProfileImages?: MatchContextImage[];
  /** Pasted prior chat with him */
  priorChatText?: string;
  /** Screenshots of prior conversation */
  priorChatImages?: MatchContextImage[];
};

/** Default display name when none is set during onboarding (header + AI prompts). */
export const DEFAULT_USER_DISPLAY_NAME = "Sia";

export type UserProfile = {
  name: string;
  age: string;
  location?: string;
  interests?: string;
  currentCity?: string;
  currentCountry?: string;
  homeCountry?: string;
  workMode?: string;
  socialEnergy?: string;
  relationshipGoal?: string;
  datingPace?: string;
  moveToDateTiming?: string;
  firstDateTypes?: string[];
  emojiUsage?: string;
  emojiStyle?: string[];
  fillerWords?: string[];
  capitalizationStyle?: string;
  punctuationStyle?: string;
  directnessLevel?: string;
  playfulnessLevel?: string;
  flirtingStyles?: string[];
  humorStyles?: string[];
  dryTexterStrategy?: string;
  avoidTopics?: string[];
  hardBoundaries?: string[];
  turnOffs?: string[];
  vibe: string;        // e.g. "flirty", "chill", "witty", "warm"
  length: string;      // e.g. "short", "medium", "long"
  emoji: boolean;
  haha: boolean;
  examples: string[];  // user-provided example texts
  bio: string;         // short free-text about themselves
};
