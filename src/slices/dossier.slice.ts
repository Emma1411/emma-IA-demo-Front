import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface DossierData {
  donnees_dossier: Record<string, unknown>;
  metriques_officielles_calculees: Record<string, unknown>;
  champs_obligatoires_pour_ce_produit: string[];
}

interface DossierState {
  parConversation: Record<string, DossierData>;
}

const initialState: DossierState = {
  parConversation: {},
};

const dossierSlice = createSlice({
  name: "dossier",
  initialState,
  reducers: {
    definirDossier: (
      state,
      action: PayloadAction<{
        conversationId: string;
        dossier: DossierData;
      }>
    ) => {
      state.parConversation[action.payload.conversationId] =
        action.payload.dossier;
    },
  },
});

export const { definirDossier } = dossierSlice.actions;
export default dossierSlice.reducer;

export const DOSSIER_VIDE: DossierData = {
  donnees_dossier: {},
  metriques_officielles_calculees: {},
  champs_obligatoires_pour_ce_produit: [],
};