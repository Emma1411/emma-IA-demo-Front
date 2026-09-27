import { useAppDispatch, useAppSelector } from "./reduxHooks";
import {
  ajouterMessage,
  definirTypingEnCours,
  mettreAJourStatutMessage,
} from "../slices/conversation.slice";
import { definirDossier, DOSSIER_VIDE } from "../slices/dossier.slice";
import { definirAnalyse } from "../slices/Analyse.slice";
import { Message } from "../interfaces/message.interface";
import { envoyerMessageEmma } from "../services/emmaApi";
import { extraireDossierDepuisTexte } from "../utils/detecterDossierJSON";

function genererIdMessage(): string {
  return `msg_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
}

export function useChatEmma() {
  const dispatch = useAppDispatch();
  const { conversations, activeConversationId } = useAppSelector(
    (state) => state.conversation
  );
  const dossiersParConversation = useAppSelector(
    (state) => state.dossier.parConversation
  );

  const envoyerMessage = async (contenuBrut: string) => {
    if (!activeConversationId) return;

    const conversation = conversations.find(
      (c) => c.id === activeConversationId
    );
    if (!conversation) return;

    // Le dossier de CETTE conversation, chargé une fois pour toutes
    // s'il a déjà été collé plus tôt, sinon vide.
    let dossierActuel =
      dossiersParConversation[activeConversationId] ?? DOSSIER_VIDE;

    // Détection : le message est-il un JSON de dossier plutôt qu'un
    // message conversationnel normal ?
    const dossierExtrait = extraireDossierDepuisTexte(contenuBrut);

    let contenuAffiche = contenuBrut;

    if (dossierExtrait) {
      dossierActuel = {
        donnees_dossier: dossierExtrait.donnees_dossier,
        metriques_officielles_calculees:
          dossierExtrait.metriques_officielles_calculees,
        champs_obligatoires_pour_ce_produit:
          dossierExtrait.champs_obligatoires_pour_ce_produit,
      };

      dispatch(
        definirDossier({
          conversationId: activeConversationId,
          dossier: dossierActuel,
        })
      );

      // On n'envoie pas le JSON brut comme historique de chat — ça
      // gonflerait inutilement chaque appel suivant. On garde tout
      // texte libre du visiteur (avant ET après le JSON) et on y
      // ajoute la confirmation de chargement.
      const confirmation = dossierExtrait.ticketId
        ? `📎 Dossier chargé (${dossierExtrait.ticketId}).`
        : "📎 Dossier chargé.";

      const partiesTexte = [
        dossierExtrait.texteAvant,
        confirmation,
        dossierExtrait.texteApres,
      ].filter(Boolean);

      contenuAffiche = partiesTexte.join("\n\n");
    }

    const messageUtilisateur: Message = {
      id: genererIdMessage(),
      role: "user",
      content: contenuAffiche,
      timestamp: new Date().toISOString(),
      status: "sent",
    };

    dispatch(
      ajouterMessage({
        conversationId: activeConversationId,
        message: messageUtilisateur,
      })
    );
    dispatch(definirTypingEnCours(true));

    const messagesPourApi = [...conversation.messages, messageUtilisateur].map(
      (m) => ({ role: m.role, content: m.content })
    );

    try {
      const resultat = await envoyerMessageEmma({
        donnees_dossier: dossierActuel.donnees_dossier,
        metriques_officielles_calculees:
          dossierActuel.metriques_officielles_calculees,
        champs_obligatoires_pour_ce_produit:
          dossierActuel.champs_obligatoires_pour_ce_produit,
        hypotheses_existantes: [],
        messages: messagesPourApi,
      });

      let contenuReponse: string;
      let affichage: Message["affichage"];

      if (resultat.mode === "chat") {
        contenuReponse = resultat.reponse.message;
      } else {
        // Analyse complète : on garde le JSON entier pour la page
        // détails, et on ajoute un bouton sous le texte de la bulle.
        dispatch(
          definirAnalyse({
            conversationId: activeConversationId,
            analyse: resultat.reponse,
          })
        );
        contenuReponse =
          resultat.reponse.synthese?.texte ?? "Analyse complète générée.";
        affichage = "carte_analyse";
      }

      const messageAssistant: Message = {
        id: genererIdMessage(),
        role: "assistant",
        content: contenuReponse,
        timestamp: new Date().toISOString(),
        affichage,
      };

      dispatch(
        ajouterMessage({
          conversationId: activeConversationId,
          message: messageAssistant,
        })
      );
    } catch {
      dispatch(
        mettreAJourStatutMessage({
          conversationId: activeConversationId,
          messageId: messageUtilisateur.id,
          status: "error",
        })
      );

      const messageErreur: Message = {
        id: genererIdMessage(),
        role: "assistant",
        content:
          "Une erreur est survenue en contactant Emma IA. Réessayez dans un instant.",
        timestamp: new Date().toISOString(),
        status: "error",
      };

      dispatch(
        ajouterMessage({
          conversationId: activeConversationId,
          message: messageErreur,
        })
      );
    } finally {
      dispatch(definirTypingEnCours(false));
    }
  };

  return { envoyerMessage, chargement: false };
}