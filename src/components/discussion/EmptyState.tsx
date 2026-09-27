import { useNavigate } from "react-router-dom";
import logo from "../../assets/logo.png";

export default function EmptyState() {
  const navigate = useNavigate();

  return (
    <div className="flex h-full flex-col items-center justify-center px-4 text-center">
      <div className="flex h-14 w-14 items-center justify-center overflow-hidden rounded-2xl">
        <img src={logo} alt="Emma IA" className="h-full w-full object-contain" />
      </div>
      <p className="mt-2 max-w-sm text-sm text-emma-muted">
        Comment puis-je vous aider ?
      </p>
      <p className="mt-1 max-w-sm text-sm text-emma-muted">
        Votre assistante IA pour analyser, comprendre et traiter vos
        dossiers de credits.
      </p>
      <button
        onClick={() => navigate("/comment-tester")}
        type="button"
        className="mt-4 rounded-lg bg-emma-light px-4 py-2 text-xs font-semibold text-emma-primary hover:bg-emma-border"
      >
        Comment tester Emma.ia ?
      </button>
    </div>
  );
}