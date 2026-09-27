import { useNavigate } from "react-router-dom";
import { FiArrowRight } from "react-icons/fi";
import { Message } from "../../interfaces/message.interface";
import { useTypewriter } from "../../hooks/useTypewriter";

interface ChatBubbleProps {
  message: Message;
  animer?: boolean;
}

function formaterHeure(timestamp: string): string {
  return new Date(timestamp).toLocaleTimeString("fr-CA", {
    hour: "2-digit",
    minute: "2-digit",
  });
}

export default function ChatBubble({ message, animer = false }: ChatBubbleProps) {
  const navigate = useNavigate();
  const estUtilisateur = message.role === "user";
  const texteAffiche = useTypewriter(message.content, animer && !estUtilisateur);

  return (
    <div className={`flex ${estUtilisateur ? "justify-end" : "justify-start"}`}>
      <div
        className={`max-w-[80%] rounded-2xl px-4 py-3 text-sm ${
          estUtilisateur
            ? "bg-emma-primary text-white bg-[#2563EB]"
            : "border border-emma-border bg-white text-emma-navy"
        }`}
      >
        <p className="whitespace-pre-wrap">{texteAffiche}</p>

        {message.affichage === "carte_analyse" && (
          <button
            type="button"
            onClick={() => navigate("/details")}
            className="mt-3 flex items-center gap-1.5 rounded-lg bg-emma-primary px-3 py-2 text-xs font-semibold text-white transition-colors hover:bg-emma-primaryDark"
          >
            Voir l'analyse détaillée
            <FiArrowRight size={13} />
          </button>
        )}

        <div
          className={`mt-1 text-right text-[11px] ${
            estUtilisateur ? "text-white/70" : "text-emma-muted"
          }`}
        >
          {formaterHeure(message.timestamp)}
          {message.status === "error" && (
            <span className="ml-1 text-emma-red">· erreur</span>
          )}
        </div>
      </div>
    </div>
  );
}