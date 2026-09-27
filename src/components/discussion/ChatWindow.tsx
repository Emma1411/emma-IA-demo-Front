import { useEffect, useRef } from "react";
import { useAppSelector } from "../../hooks/reduxHooks";
import { useElapsedTimer } from "../../hooks/useElapsedTimer";
import ChatBubble from "./ChatBubble";
import TypingIndicator from "./TypingIndicator";
import EmptyState from "./EmptyState";

export default function ChatWindow() {
  const { conversations, activeConversationId, isTyping } = useAppSelector(
    (state) => state.conversation
  );
  const conversation = conversations.find(
    (c) => c.id === activeConversationId
  );
  const bottomRef = useRef<HTMLDivElement>(null);
  const tempsMs = useElapsedTimer(isTyping);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [conversation?.messages.length, isTyping]);

  if (!conversation || conversation.messages.length === 0) {
    return <EmptyState />;
  }

  return (
    <div className="px-4 py-6">
      <div className="mx-auto flex max-w-2xl flex-col gap-4">
        {conversation.messages.map((message, index) => (
          <ChatBubble
            key={message.id}
            message={message}
            animer={
              index === conversation.messages.length - 1 &&
              message.role === "assistant"
            }
          />
        ))}
        {isTyping && <TypingIndicator tempsMs={tempsMs} />}
        <div ref={bottomRef} />
      </div>
    </div>
  );
}