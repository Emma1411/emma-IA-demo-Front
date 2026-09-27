import { combineReducers } from "@reduxjs/toolkit";
import conversationReducer from "./slices/conversation.slice";
import dossierReducer from "./slices/dossier.slice";
import analyseReducer from "./slices/Analyse.slice";

const rootReducer = combineReducers({
  conversation: conversationReducer,
  dossier: dossierReducer,
  analyse: analyseReducer,
});

export default rootReducer;
export type RootReducerState = ReturnType<typeof rootReducer>;