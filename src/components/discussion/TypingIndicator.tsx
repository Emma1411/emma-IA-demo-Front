import { useEffect, useState } from "react";


const ETAPES = [
  "Lecture du dossier...",
  "Analyse des données...",
  "Vérification des règles...",
  "Rédaction de la réponse...",
];

interface TypingIndicatorProps {
  tempsMs: number;
}

export default function TypingIndicator({ tempsMs }: TypingIndicatorProps) {
  const [etapeIndex, setEtapeIndex] = useState(0);

  useEffect(() => {
    const intervalle = setInterval(() => {
      setEtapeIndex((i) => (i + 1) % ETAPES.length);
    }, 1600);
    return () => clearInterval(intervalle);
  }, []);

  const secondes = (tempsMs / 1000).toFixed(1);

  return (
    <div className="flex justify-start">
      <div className="flex items-center gap-2 rounded-2xl border border-emma-border bg-white px-4 py-3 text-xs text-emma-muted">
        <span className="flex items-center gap-1">
          <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-emma-muted [animation-delay:-0.2s]" />
          <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-emma-muted [animation-delay:-0.1s]" />
          <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-emma-muted" />
        </span>
        <span>{ETAPES[etapeIndex]}</span>
        <span className="ml-1 tabular-nums">{secondes}s</span>
      </div>
    </div>
  );
}