import { useEffect, useRef, useState } from "react";


export function useElapsedTimer(actif: boolean): number {
  const [tempsMs, setTempsMs] = useState(0);
  const debutRef = useRef<number | null>(null);

  useEffect(() => {
    if (!actif) {
      setTempsMs(0);
      debutRef.current = null;
      return;
    }

    debutRef.current = Date.now();

    const intervalle = setInterval(() => {
      if (debutRef.current) {
        setTempsMs(Date.now() - debutRef.current);
      }
    }, 100);

    return () => clearInterval(intervalle);
  }, [actif]);

  return tempsMs;
}