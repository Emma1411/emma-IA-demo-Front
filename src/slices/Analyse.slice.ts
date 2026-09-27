import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface AnalyseState {
  parConversation: Record<string, Record<string, unknown>>;
}

const initialState: AnalyseState = {
  parConversation: {},
};

const analyseSlice = createSlice({
  name: "analyse",
  initialState,
  reducers: {
    definirAnalyse: (
      state,
      action: PayloadAction<{
        conversationId: string;
        analyse: Record<string, unknown>;
      }>
    ) => {
      state.parConversation[action.payload.conversationId] =
        action.payload.analyse;
    },
  },
});

export const { definirAnalyse } = analyseSlice.actions;
export default analyseSlice.reducer;