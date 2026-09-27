import { useEffect, useRef, useState } from "react";

export function useTypewriter(
  texteFinal: string,
  actif: boolean,
  vitesseMs = 12
): string {
  const [texteAffiche, setTexteAffiche] = useState(actif ? "" : texteFinal);
  const indexRef = useRef(0);

  useEffect(() => {
    if (!actif) {
      setTexteAffiche(texteFinal);
      return;
    }

    indexRef.current = 0;
    setTexteAffiche("");

    const intervalle = setInterval(() => {
      indexRef.current += 1;
      setTexteAffiche(texteFinal.slice(0, indexRef.current));

      if (indexRef.current >= texteFinal.length) {
        clearInterval(intervalle);
      }
    }, vitesseMs);

    return () => clearInterval(intervalle);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [texteFinal, actif]);

  return texteAffiche;
}