import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Conversation } from "../interfaces/Conversation.interface";
import { Message } from "../interfaces/message.interface";

interface ConversationState {
  conversations: Conversation[];
  activeConversationId: string | null;
  isTyping: boolean;
}

const initialState: ConversationState = {
  conversations: [],
  activeConversationId: null,
  isTyping: false,
};

function genererId(): string {
  return `conv_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
}

const conversationSlice = createSlice({
  name: "conversation",
  initialState,
  reducers: {
    creerNouvelleConversation: (state) => {
      const nouvelle: Conversation = {
        id: genererId(),
        title: "Nouvelle discussion",
        messages: [],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      state.conversations.unshift(nouvelle);
      state.activeConversationId = nouvelle.id;
    },

    selectionnerConversation: (state, action: PayloadAction<string>) => {
      state.activeConversationId = action.payload;
    },

    supprimerConversation: (state, action: PayloadAction<string>) => {
      state.conversations = state.conversations.filter(
        (c) => c.id !== action.payload
      );
      if (state.activeConversationId === action.payload) {
        state.activeConversationId = state.conversations[0]?.id ?? null;
      }
    },

    ajouterMessage: (
      state,
      action: PayloadAction<{ conversationId: string; message: Message }>
    ) => {
      const conv = state.conversations.find(
        (c) => c.id === action.payload.conversationId
      );
      if (!conv) return;

      conv.messages.push(action.payload.message);
      conv.updatedAt = new Date().toISOString();

      if (
        conv.title === "Nouvelle discussion" &&
        action.payload.message.role === "user"
      ) {
        conv.title = action.payload.message.content.slice(0, 40);
      }
    },

    mettreAJourStatutMessage: (
      state,
      action: PayloadAction<{
        conversationId: string;
        messageId: string;
        status: Message["status"];
      }>
    ) => {
      const conv = state.conversations.find(
        (c) => c.id === action.payload.conversationId
      );
      const msg = conv?.messages.find(
        (m) => m.id === action.payload.messageId
      );
      if (msg) msg.status = action.payload.status;
    },

    definirTypingEnCours: (state, action: PayloadAction<boolean>) => {
      state.isTyping = action.payload;
    },
  },
});

export const {
  creerNouvelleConversation,
  selectionnerConversation,
  supprimerConversation,
  ajouterMessage,
  mettreAJourStatutMessage,
  definirTypingEnCours,
} = conversationSlice.actions;

export default conversationSlice.reducer;