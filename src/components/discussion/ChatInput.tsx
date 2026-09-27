import { useRef, useState, KeyboardEvent, ChangeEvent } from "react";
import { FiArrowUp } from "react-icons/fi";

interface ChatInputProps {
  onEnvoyer: (contenu: string) => void;
  chargement?: boolean;
}

// Hauteur max du textarea avant apparition du scroll interne —
// différente sur mobile (écran plus petit en hauteur) que sur desktop.
function obtenirHauteurMax(): number {
  const estMobile = window.matchMedia("(max-width: 767px)").matches;
  return estMobile ? 100 : 200;
}

export default function ChatInput({
  onEnvoyer,
  chargement,
}: ChatInputProps) {
  const [valeur, setValeur] = useState("");
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const textePresent = valeur.trim().length > 0;
  const boutonActif = textePresent && !chargement;

  const ajusterHauteur = () => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    textarea.style.height = "auto";

    const hauteurMax = obtenirHauteurMax();
    textarea.style.height = `${Math.min(textarea.scrollHeight, hauteurMax)}px`;
    textarea.style.overflowY =
      textarea.scrollHeight > hauteurMax ? "auto" : "hidden";
  };

  const gererChangement = (e: ChangeEvent<HTMLTextAreaElement>) => {
    setValeur(e.target.value);
    requestAnimationFrame(ajusterHauteur);
  };

  const gererEnvoi = () => {
    const contenu = valeur.trim();
    if (!contenu || chargement) return;

    onEnvoyer(contenu);
    setValeur("");
    requestAnimationFrame(ajusterHauteur);
  };

  const gererTouche = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      gererEnvoi();
    }
  };

  return (
    <div className="shrink-0 border-emma-border bg-emma-lighter px-4 py-3">
      <div className="mx-auto flex max-w-2xl items-end gap-2 rounded-2xl border border-emma-border bg-white px-4 py-2 shadow-sm">
        <textarea
          ref={textareaRef}
          value={valeur}
          onChange={gererChangement}
          onKeyDown={gererTouche}
          placeholder="Écrivez votre message..."
          disabled={chargement}
          rows={1}
          className="
            min-h-[36px]
            flex-1
            resize-none
            overflow-y-hidden
            bg-transparent
            py-2
            text-base
            leading-5
            text-emma-navy
            placeholder:text-emma-muted
            focus:outline-none
            disabled:cursor-not-allowed
          "
        />

        <button
          type="button"
          onClick={gererEnvoi}
          disabled={!boutonActif}
          aria-label="Envoyer le message"
          className={`
            flex h-9 w-9 shrink-0 items-center justify-center rounded-full
            transition-all duration-200
            ${
              boutonActif
                ? "cursor-pointer bg-[#1099DB] text-white hover:bg-[#0d89c4] active:scale-90"
                : "cursor-not-allowed bg-[#c2c6c9] text-white"
            }
          `}
        >
          <FiArrowUp size={16} />
        </button>
      </div>
    </div>
  );
}