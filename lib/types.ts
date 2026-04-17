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

export type Conversation = {
  id: string;
  name: string;
  history: Message[];
  flags?: Flag[];
};

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
