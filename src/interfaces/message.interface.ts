export type MessageRole = "user" | "assistant";
export type MessageStatus = "sending" | "sent" | "error";
export type MessageAffichage = "texte" | "carte_analyse";

export interface Message {
  id: string;
  role: MessageRole;
  content: string;
  timestamp: string;
  status?: MessageStatus;
  affichage?: MessageAffichage;
}