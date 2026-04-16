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

export type Conversation = {
  id: string;
  name: string;
  history: Message[];
};

export type UserProfile = {
  name: string;
  age: string;
  vibe: string;        // e.g. "flirty", "chill", "witty", "warm"
  length: string;      // e.g. "short", "medium", "long"
  emoji: boolean;
  haha: boolean;
  examples: string[];  // user-provided example texts
  bio: string;         // short free-text about themselves
};
