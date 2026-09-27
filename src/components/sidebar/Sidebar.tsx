import { FiPlus, FiUser, FiMessageCircle } from "react-icons/fi";
import { useAppDispatch, useAppSelector } from "../../hooks/reduxHooks";
import { selectionnerConversation } from "../../slices/conversation.slice";
import logo from "../../assets/logo.png";

interface SidebarProps {
  onNouvelleDiscussion: () => void;
  onFermer?: () => void;
}
  
export default function Sidebar({
  onNouvelleDiscussion,
  onFermer,
}: SidebarProps) {
  const dispatch = useAppDispatch();
  const { conversations, activeConversationId } = useAppSelector(
    (state) => state.conversation,
  );

  return (
    <aside className="flex h-full w-[280px] flex-col border-r border-emma-border bg-white px-2">
      <div className=" flex justify-center mt-2 items-center space-x-1">
        <div className="mt-2 flex items-center justify-center gap-2">
          <img src={logo} alt="Emma IA" className="h-8 w-8 object-contain" />
          <p className="font-semibold text-emma-navy">Emma</p>
        </div>
      </div>
      <div className=" py-1">
        <button
          onClick={() => {
            onNouvelleDiscussion();
            onFermer?.();
          }}
          className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#0d89c4]  px-4 py-2.5 text-sm font-semibold text-black hover:bg-emma-primaryDark"
          type="button"
        >
          <FiPlus size={16} />
          Nouvelle discussion
        </button>
      </div>

      <div className="flex-1 overflow-y-auto px-3">
        <p className="mb-2 px-2 text-xs font-medium uppercase tracking-wide text-emma-muted">
          Discussions récentes
        </p>

        {conversations.length === 0 && (
          <p className="px-2 text-sm text-emma-muted">
            Aucune discussion pour le moment.
          </p>
        )}

        <div className="space-y-1">
          {conversations.map((conv) => (
            <button
              key={conv.id}
              onClick={() => {
                dispatch(selectionnerConversation(conv.id));
                onFermer?.();
              }}
              type="button"
              className={`flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left text-sm transition-colors ${
                conv.id === activeConversationId
                  ? "bg-emma-light font-medium text-emma-primary"
                  : "text-emma-navy hover:bg-emma-lighter"
              }`}
            >
              <FiMessageCircle size={15} className="shrink-0" />
              <span className="truncate">{conv.title}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="flex items-center gap-2 border-t border-emma-border p-4">
        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-emma-light text-emma-primary">
          <FiUser size={16} />
        </div>
        <span className="text-sm font-medium text-emma-navy">Analyste</span>
      </div>
    </aside>
  );
}
