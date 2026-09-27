import { useEffect, useRef } from "react";
import { useAppDispatch, useAppSelector } from "../hooks/reduxHooks";
import { creerNouvelleConversation } from "../slices/conversation.slice";
import { useChatEmma } from "../hooks/useChatEmma";
import ChatWindow from "../components/discussion/ChatWindow";
import ChatInput from "../components/discussion/ChatInput";

export default function DiscussionPage() {
  const dispatch = useAppDispatch();
  const { conversations, activeConversationId } = useAppSelector(
    (state) => state.conversation,
  );
  const { envoyerMessage, chargement } = useChatEmma();
  const dejaInitialise = useRef(false);

  useEffect(() => {
    if (dejaInitialise.current) return;
    dejaInitialise.current = true;

    if (conversations.length === 0) {
      dispatch(creerNouvelleConversation());
    }
  }, []);

return (
  <div className="flex h-full min-h-0 flex-col overflow-hidden">
    <div className="min-h-0 flex-1 overflow-y-auto">
      <ChatWindow />
    </div>
    {activeConversationId && (
      <div className="shrink-0">
        <ChatInput onEnvoyer={envoyerMessage} chargement={chargement} />
      </div>
    )}
  </div>
);
}
