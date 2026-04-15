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