export interface DossierExtrait {
  ticketId?: string;
  texteAvant: string;
  texteApres: string;
  donnees_dossier: Record<string, unknown>;
  metriques_officielles_calculees: Record<string, unknown>;
  champs_obligatoires_pour_ce_produit: string[];
}

type DossierBrut = Omit<DossierExtrait, "texteAvant" | "texteApres">;

function tenterExtraire(candidat: string): DossierBrut | null {
  let parsed: unknown;

  try {
    parsed = JSON.parse(candidat);
  } catch {
    return null;
  }

  if (
    !parsed ||
    typeof parsed !== "object" ||
    !("donnees_dossier" in parsed)
  ) {
    return null;
  }

  const objet = parsed as Record<string, unknown>;
  const donneesDossier = objet.donnees_dossier;

  if (!donneesDossier || typeof donneesDossier !== "object") {
    return null;
  }

  return {
    ticketId: typeof objet.ticket_id === "string" ? objet.ticket_id : undefined,
    donnees_dossier: donneesDossier as Record<string, unknown>,
    metriques_officielles_calculees:
      (objet.metriques_officielles_calculees as Record<string, unknown>) ?? {},
    champs_obligatoires_pour_ce_produit:
      (objet.champs_obligatoires_pour_ce_produit as string[]) ?? [],
  };
}


export function extraireDossierDepuisTexte(
  texte: string
): DossierExtrait | null {
  for (let debut = 0; debut < texte.length; debut++) {
    if (texte[debut] !== "{") continue;

    let profondeur = 0;

    for (let fin = debut; fin < texte.length; fin++) {
      if (texte[fin] === "{") {
        profondeur++;
      } else if (texte[fin] === "}") {
        profondeur--;

        if (profondeur === 0) {
          const candidat = texte.slice(debut, fin + 1);
          const resultat = tenterExtraire(candidat);

          if (resultat) {
            return {
              ...resultat,
              texteAvant: texte.slice(0, debut).trim(),
              texteApres: texte.slice(fin + 1).trim(),
            };
          }

          break; 
        }
      }
    }
  }

  return null;
}