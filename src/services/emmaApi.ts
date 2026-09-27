const API_BASE_URL = import.meta.env.VITE_API_BASE_URL as string;

export interface MessageApi {
  role: "user" | "assistant";
  content: string;
}

export interface ChatApiPayload {
  donnees_dossier: Record<string, unknown>;
  metriques_officielles_calculees: Record<string, unknown>;
  champs_obligatoires_pour_ce_produit: string[];
  hypotheses_existantes: Record<string, unknown>[];
  messages: MessageApi[];
}

export interface ChatApiResponse {
  mode: "chat" | "analyse_complete";
  reponse: Record<string, any>;
}

export async function envoyerMessageEmma(
  payload: ChatApiPayload
): Promise<ChatApiResponse> {
  const reponse = await fetch(`${API_BASE_URL}/api/chat`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  if (!reponse.ok) {
    const erreur = await reponse.json().catch(() => null);
    throw new Error(erreur?.detail ?? `Erreur ${reponse.status}`);
  }

  return reponse.json();
}