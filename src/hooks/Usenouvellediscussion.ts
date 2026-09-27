import { useState } from "react";
import { useAppDispatch, useAppSelector } from "./reduxHooks";
import {
  creerNouvelleConversation,
  supprimerConversation,
} from "../slices/conversation.slice";

/**
 * Logique de création d'une nouvelle discussion (sidebar desktop
 * uniquement pour l'instant — voir Sidebar.tsx).
 *
 * Règles :
 * - discussion active avec des messages -> confirmation avant de
 *   l'effacer ;
 * - discussion active déjà vide (aucun message) -> ne rien faire,
 *   on ne crée pas une deuxième discussion vide inutilement ;
 * - aucune discussion active -> création directe.
 */
export function useNouvelleDiscussion() {
  const dispatch = useAppDispatch();
  const { conversations, activeConversationId } = useAppSelector(
    (state) => state.conversation
  );
  const [modalOuverte, setModalOuverte] = useState(false);

  const conversationActive = conversations.find(
    (c) => c.id === activeConversationId
  );

  const demarrerNouvelleDiscussion = () => {
    if (conversationActive) {
      if (conversationActive.messages.length > 0) {
        setModalOuverte(true);
      }
      // Discussion active déjà vide : on ne fait rien, elle reste
      // affichée telle quelle.
      return;
    }

    dispatch(creerNouvelleConversation());
  };

  const confirmer = () => {
    if (conversationActive) {
      dispatch(supprimerConversation(conversationActive.id));
    }
    dispatch(creerNouvelleConversation());
    setModalOuverte(false);
  };

  const annuler = () => setModalOuverte(false);

  return { demarrerNouvelleDiscussion, modalOuverte, confirmer, annuler };
}