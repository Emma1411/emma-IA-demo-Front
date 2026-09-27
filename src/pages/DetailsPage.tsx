import { useNavigate } from "react-router-dom";
import {
  FiArrowLeft,
  FiDownload,
  FiCheckCircle,
  FiAlertTriangle,
  FiShield,
} from "react-icons/fi";
import { useAppSelector } from "../hooks/reduxHooks";

// ---------- Helpers génériques (aucune donnée métier codée en dur) ----------

function formaterValeur(v: unknown): string {
  if (v === null || v === undefined || v === "") return "—";
  if (typeof v === "number") return v.toLocaleString("fr-CA");
  if (typeof v === "boolean") return v ? "Oui" : "Non";
  return String(v);
}

function formaterCle(cle: string): string {
  return cle.replace(/_/g, " ");
}

function formaterPourcentage(v: unknown): string | null {
  if (typeof v !== "number") return null;
  // Les ratios officiels arrivent en fraction (0.31) ou déjà en % (31)
  const pct = v <= 1 ? v * 100 : v;
  return `${pct.toFixed(1)}%`;
}

const STATUT_STYLES: Record<string, string> = {
  complet: "bg-emerald-50 text-emma-green",
  incomplet: "bg-amber-50 text-amber-700",
  a_verifier: "bg-emma-light text-emma-primary",
};

const POSITION_LABELS: Record<string, string> = {
  favorable: "Favorable",
  favorable_avec_conditions: "Favorable sous conditions",
  defavorable: "Défavorable",
  non_determinable: "Non déterminable",
};

const COULEURS_DETTES = [
  "#2f5bea",
  "#7ea1ff",
  "#f0c766",
  "#34d399",
  "#f87171",
  "#a78bfa",
  "#22d3ee",
];

// Le titre s'adapte à l'objet réel de la demande — pas seulement à
// un scénario de consolidation.
function titreSectionDettes(demande: Record<string, any>): string {
  if (demande.objectif === "consolidation_dettes") return "Dettes à consolider";
  return "Dettes existantes";
}


export default function DetailsPage() {
  const navigate = useNavigate();
  const { activeConversationId } = useAppSelector((s) => s.conversation);
  const analyses = useAppSelector((s) => s.analyse.parConversation);
  const analyse = activeConversationId ? analyses[activeConversationId] : undefined;

  if (!analyse) {
    return (
      <div className="flex h-full flex-col items-center justify-center gap-4 p-6 text-center">
        <p className="text-sm text-emma-muted">
          Aucune analyse complète disponible pour cette conversation.
        </p>
        <button
          onClick={() => navigate("/")}
          type="button"
          className="rounded-lg bg-emma-primary px-4 py-2 text-sm font-semibold text-white"
        >
          Retour à la discussion
        </button>
      </div>
    );
  }

  const infos = (analyse.informations_verifiees ?? {}) as Record<string, any>;
  const metriques = (analyse.metriques_officielles ?? {}) as Record<string, any>;
  const manquantes = (analyse.informations_manquantes ?? []) as any[];
  const satisfaits = (analyse.champs_obligatoires_satisfaits ?? []) as any[];
  const patterns = (analyse.patterns_detectes ?? []) as string[];
  const dettes = (infos.dettes ?? []) as any[];
  const historique = (infos.historique_credit ?? {}) as Record<string, any>;
  const bureauCredit = (analyse.bureau_credit_analyse ?? {}) as Record<string, any>;
  const commentairesBureau = (bureauCredit.commentaires ?? []) as string[];
  const dettesClientUniquement = (bureauCredit.dettes_declarees_client_uniquement ??
    []) as any[];
  const demande = (infos.demande ?? {}) as Record<string, any>;
  const demandeur = (infos.demandeur ?? {}) as Record<string, any>;
  const validations = (analyse.validation_humaine_requise ?? []) as string[];
  const synthese = (analyse.synthese ?? {}) as Record<string, any>;

  const manquantesBloquantes = manquantes.filter((m) => m.obligatoire);
  const totalActionsRequises = manquantesBloquantes.length + validations.length;

  const totalSoldeDettes = dettes.reduce(
    (acc, d) => acc + (typeof d.solde === "number" ? d.solde : 0),
    0
  );
  const totalMensualites = dettes.reduce(
    (acc, d) => acc + (typeof d.mensualite === "number" ? d.mensualite : 0),
    0
  );

  const abd = formaterPourcentage(metriques.abd_ratio);
  const atd = formaterPourcentage(metriques.atd_ratio);
  const maxAbd = formaterPourcentage(metriques.max_abd_ratio);
  const maxAtd = formaterPourcentage(metriques.max_atd_ratio);

  return (
    <div className="h-full overflow-y-auto bg-emma-lighter">
      <div className="mx-auto max-w-6xl px-4 py-6">
        <button
          onClick={() => navigate("/")}
          type="button"
          className="mb-4 flex items-center gap-1 text-sm font-medium text-emma-primary"
        >
          <FiArrowLeft size={16} /> Retour à la discussion
        </button>

        {/* En-tête */}
        <div className="mb-4 flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-emma-border bg-white px-5 py-4">
          <div className="text-sm text-emma-navy">
            <span className="font-semibold">
              Dossier {formaterValeur(demandeur.id)}
            </span>
            {demande.type_credit && (
              <span className="text-emma-muted"> · {formaterValeur(demande.type_credit)}</span>
            )}
            {demande.montant_demande && (
              <span className="text-emma-muted">
                {" "}
                · Montant sollicité {formaterValeur(demande.montant_demande)} CAD
              </span>
            )}
          </div>
          <div className="flex gap-2">
            <button
              type="button"
              className="flex items-center gap-1.5 rounded-lg border border-emma-border px-3 py-1.5 text-xs font-semibold text-emma-navy"
            >
              <FiDownload size={13} /> Exporter
            </button>
            <button
              type="button"
              className="flex items-center gap-1.5 rounded-lg bg-emma-primary px-3 py-1.5 text-xs font-semibold text-white"
            >
              <FiShield size={13} /> Décider du dossier
            </button>
          </div>
        </div>

        {/* Bandeau statut */}
        <div className="mb-6 flex flex-wrap items-center gap-3">
          <span
            className={`rounded-full px-3 py-1 text-xs font-bold uppercase ${
              STATUT_STYLES[analyse.statut_dossier as string] ??
              "bg-emma-light text-emma-primary"
            }`}
          >
            {formaterValeur(analyse.statut_dossier)}
            {totalActionsRequises > 0 && ` — ${totalActionsRequises} validation(s) requise(s)`}
          </span>
          {synthese.position && (
            <span className="text-sm text-emma-navy">
              Recommandation :{" "}
              <span className="font-semibold text-emma-primary">
                {POSITION_LABELS[synthese.position] ?? synthese.position}
              </span>
            </span>
          )}
        </div>

        {/* Détails de la demande — priorité d'affichage juste après le statut */}
        {(Object.keys(demande).length > 0 || Object.keys(demandeur).length > 0) && (
          <div className="mb-6 rounded-2xl border border-emma-border bg-white p-5">
            <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
              <h3 className="text-sm font-semibold text-emma-navy">Détails de la demande</h3>
              {demandeur.id && (
                <span className="rounded-full bg-emma-light px-3 py-1 text-xs font-bold text-emma-primary">
                  {formaterValeur(demandeur.id)}
                </span>
              )}
            </div>

            <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
              {Object.entries({ ...demandeur, ...demande })
                .filter(([cle]) => cle !== "id")
                .map(([cle, valeur]) => (
                  <div key={cle} className="rounded-xl bg-emma-lighter p-3">
                    <div className="mb-1 text-[11px] uppercase text-emma-muted">
                      {formaterCle(cle)}
                    </div>
                    <div className="text-sm font-bold text-emma-navy">
                      {formaterValeur(valeur)}
                    </div>
                  </div>
                ))}
            </div>
          </div>
        )}

        {/* Métriques officielles */}
        {Object.keys(metriques).length > 0 && (
          <div className="mb-6 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
            {Object.entries(metriques).map(([cle, valeur]) => (
              <div key={cle} className="rounded-2xl border border-emma-border bg-white p-4">
                <div className="mb-1 text-[11px] uppercase text-emma-muted">
                  {formaterCle(cle)}
                </div>
                <div className="text-2xl font-bold text-emma-navy">
                  {formaterValeur(valeur)}
                </div>
              </div>
            ))}
          </div>
        )}

        <div className="grid gap-6 lg:grid-cols-[2fr_1fr]">
          {/* Colonne principale */}
          <div className="space-y-6">
            {/* Synthèse */}
            {synthese.texte && (
              <div className="rounded-2xl border border-emma-border bg-white p-5">
                <div className="mb-3 flex items-center justify-between">
                  <h3 className="text-sm font-semibold text-emma-navy">
                    Synthèse d'arbitrage Emma.ia
                  </h3>
                  {synthese.position && (
                    <span className="rounded-lg bg-emma-light px-3 py-1 text-xs font-bold text-emma-primary">
                      {POSITION_LABELS[synthese.position] ?? synthese.position}
                    </span>
                  )}
                </div>
                <p className="mb-4 text-sm text-emma-navy">{synthese.texte}</p>

                {patterns.length > 0 && (
                  <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
                    {patterns.map((p, i) => (
                      <div
                        key={i}
                        className="rounded-lg border border-emma-border p-3 text-xs text-emma-navy"
                      >
                        {p}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Ratios prudentiels — uniquement si vraiment fournis */}
            {(abd || atd) && (
              <div className="rounded-2xl border border-emma-border bg-white p-5">
                <div className="mb-3 flex items-center justify-between">
                  <h3 className="text-sm font-semibold text-emma-navy">
                    Ratios officiels d'endettement
                  </h3>
                  <span className="rounded-lg bg-emerald-50 px-3 py-1 text-xs font-semibold text-emma-green">
                    Métriques officielles
                  </span>
                </div>
                <div className="grid gap-4 sm:grid-cols-2">
                  {abd && (
                    <div className="rounded-xl bg-emma-lighter p-4">
                      <div className="mb-1 flex items-baseline justify-between text-sm">
                        <span className="font-semibold text-emma-navy">
                          ABD (amortissement brut)
                        </span>
                        <span className="font-bold text-emma-primary">
                          {abd} {maxAbd && <span className="text-emma-muted">/ max {maxAbd}</span>}
                        </span>
                      </div>
                      <div className="h-2 w-full rounded-full bg-emma-border">
                        <div
                          className="h-2 rounded-full bg-emma-primary"
                          style={{ width: abd }}
                        />
                      </div>
                    </div>
                  )}
                  {atd && (
                    <div className="rounded-xl bg-emma-lighter p-4">
                      <div className="mb-1 flex items-baseline justify-between text-sm">
                        <span className="font-semibold text-emma-navy">
                          ATD (amortissement total)
                        </span>
                        <span className="font-bold text-emma-primary">
                          {atd} {maxAtd && <span className="text-emma-muted">/ max {maxAtd}</span>}
                        </span>
                      </div>
                      <div className="h-2 w-full rounded-full bg-emma-border">
                        <div
                          className="h-2 rounded-full bg-emma-primary"
                          style={{ width: atd }}
                        />
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Dettes — titre et nombre de cartes adaptatifs */}
            {dettes.length > 0 && (
              <div className="rounded-2xl border border-emma-border bg-white p-5">
                <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
                  <h3 className="text-sm font-semibold text-emma-navy">
                    {titreSectionDettes(demande)}
                  </h3>
                  <span className="text-xs text-emma-muted">
                    {dettes.length} encours · Total {formaterValeur(totalSoldeDettes)} CAD
                    {totalMensualites > 0 &&
                      ` · Mensualités ${formaterValeur(totalMensualites)} CAD/mois`}
                  </span>
                </div>

                {totalSoldeDettes > 0 && (
                  <div className="mb-4 flex h-2 w-full overflow-hidden rounded-full">
                    {dettes.map((d, i) => (
                      <div
                        key={i}
                        style={{
                          width: `${((d.solde ?? 0) / totalSoldeDettes) * 100}%`,
                          backgroundColor: COULEURS_DETTES[i % COULEURS_DETTES.length],
                        }}
                      />
                    ))}
                  </div>
                )}

                <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                  {dettes.map((d, i) => (
                    <div key={i} className="rounded-xl border border-emma-border p-3">
                      <div className="mb-1 flex items-center justify-between text-xs">
                        <span className="font-semibold text-emma-navy">
                          {d.creancier ?? formaterCle(d.type ?? "Dette")}
                        </span>
                        <span
                          className={`rounded-md px-2 py-0.5 text-[10px] font-bold ${
                            d.statut_verification === "verifie"
                              ? "bg-emerald-50 text-emma-green"
                              : "bg-amber-50 text-amber-700"
                          }`}
                        >
                          {d.statut_verification === "verifie" ? "Vérifié" : "À vérifier"}
                        </span>
                      </div>
                      <div className="text-lg font-bold text-emma-navy">
                        {formaterValeur(d.solde)} {d.devise ?? "CAD"}
                      </div>
                      {d.mensualite && (
                        <div className="text-xs text-emma-muted">
                          Mensualité {formaterValeur(d.mensualite)} / mois
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Bureau de crédit — section enrichie (v3.2), préférée si présente */}
            {Object.keys(bureauCredit).length > 0 ? (
              <div className="rounded-2xl border border-emma-border bg-white p-5">
                <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
                  <h3 className="text-sm font-semibold text-emma-navy">
                    Bureau de crédit{bureauCredit.bureau && ` — ${bureauCredit.bureau}`}
                  </h3>
                  {bureauCredit.statut_global && (
                    <span className="rounded-lg bg-emerald-50 px-3 py-1 text-xs font-bold text-emma-green">
                      {formaterCle(bureauCredit.statut_global)}
                    </span>
                  )}
                </div>

                <div className="mb-4 grid grid-cols-2 gap-3 text-xs sm:grid-cols-4">
                  {bureauCredit.score !== undefined && (
                    <div>
                      <div className="uppercase text-emma-muted">Score</div>
                      <div className="font-semibold text-emma-navy">
                        {formaterValeur(bureauCredit.score)}
                      </div>
                    </div>
                  )}
                  {bureauCredit.taux_remboursement !== undefined && (
                    <div>
                      <div className="uppercase text-emma-muted">Taux remboursement</div>
                      <div className="font-semibold text-emma-navy">
                        {formaterValeur(bureauCredit.taux_remboursement)}
                      </div>
                    </div>
                  )}
                  {bureauCredit.nombre_retards !== undefined && (
                    <div>
                      <div className="uppercase text-emma-muted">Retards</div>
                      <div className="font-semibold text-emma-navy">
                        {formaterValeur(bureauCredit.nombre_retards)}
                      </div>
                    </div>
                  )}
                  {bureauCredit.date_rapport && (
                    <div>
                      <div className="uppercase text-emma-muted">Date du rapport</div>
                      <div className="font-semibold text-emma-navy">
                        {formaterValeur(bureauCredit.date_rapport)}
                      </div>
                    </div>
                  )}
                </div>

                {commentairesBureau.length > 0 && (
                  <ul className="mb-3 list-disc space-y-1 pl-4 text-xs text-emma-navy">
                    {commentairesBureau.map((c, i) => (
                      <li key={i}>{c}</li>
                    ))}
                  </ul>
                )}

                {dettesClientUniquement.length > 0 && (
                  <div className="rounded-lg border border-amber-200 bg-amber-50 p-3 text-xs text-amber-800">
                    <span className="font-bold">
                      {dettesClientUniquement.length} dette(s) déclarée(s) par le client
                    </span>{" "}
                    uniquement, non confirmée(s) par le bureau de crédit.
                  </div>
                )}
              </div>
            ) : (
              Object.keys(historique).length > 0 && (
                <div className="rounded-2xl border border-emma-border bg-white p-5">
                  <h3 className="mb-3 text-sm font-semibold text-emma-navy">
                    Historique de crédit
                    {historique.bureau && ` — Bureau ${historique.bureau}`}
                  </h3>
                  <div className="grid grid-cols-2 gap-3 text-xs sm:grid-cols-4">
                    {Object.entries(historique).map(([cle, valeur]) => (
                      <div key={cle}>
                        <div className="uppercase text-emma-muted">{formaterCle(cle)}</div>
                        <div className="font-semibold text-emma-navy">
                          {formaterValeur(valeur)}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Actions requises — bloquants + à vérifier + fournis, tout fusionné */}
            <div className="rounded-2xl border border-emma-border bg-white p-5">
              <div className="mb-3 flex items-center justify-between">
                <h3 className="text-sm font-semibold text-emma-navy">Actions requises</h3>
                {totalActionsRequises > 0 && (
                  <span className="rounded-full bg-amber-50 px-2.5 py-0.5 text-xs font-bold text-amber-700">
                    {totalActionsRequises}
                  </span>
                )}
              </div>

              {manquantesBloquantes.map((m, i) => (
                <div
                  key={`bloquant-${i}`}
                  className="mb-3 rounded-xl border border-red-200 bg-red-50 p-3"
                >
                  <div className="mb-1 flex items-center gap-1.5 text-xs font-bold uppercase text-emma-red">
                    <FiAlertTriangle size={12} /> Bloquant
                  </div>
                  <div className="text-sm font-semibold text-emma-navy">{m.champ}</div>
                  <p className="text-xs text-emma-muted">{m.impact}</p>
                </div>
              ))}

              {validations.map((v, i) => (
                <div
                  key={`verif-${i}`}
                  className="mb-3 rounded-xl border border-amber-200 bg-amber-50 p-3"
                >
                  <div className="mb-1 text-xs font-bold uppercase text-amber-700">
                    À vérifier
                  </div>
                  <p className="text-xs text-emma-navy">{v}</p>
                </div>
              ))}

              {satisfaits.length > 0 && (
                <div className="mt-4 border-t border-emma-border pt-3">
                  <p className="mb-2 text-xs font-bold uppercase text-emma-green">
                    Documents fournis ({satisfaits.length})
                  </p>
                  {satisfaits.map((s, i) => (
                    <div
                      key={i}
                      className="mb-2 flex items-start gap-1.5 text-xs text-emma-navy"
                    >
                      <FiCheckCircle size={13} className="mt-0.5 shrink-0 text-emma-green" />
                      <span>
                        <span className="font-semibold">{s.champ}</span>
                        {s.justification && (
                          <span className="text-emma-muted"> — {s.justification}</span>
                        )}
                      </span>
                    </div>
                  ))}
                </div>
              )}

              {totalActionsRequises === 0 && satisfaits.length === 0 && (
                <p className="text-xs text-emma-muted">Aucune action en attente.</p>
              )}
            </div>

            {/* Méta */}
            <div className="rounded-2xl border border-emma-border bg-white p-5 text-xs">
              <div className="flex justify-between border-b border-emma-border py-2">
                <span className="text-emma-muted">Statut dossier</span>
                <span className="font-semibold text-emma-navy">
                  {formaterValeur(analyse.statut_dossier)}
                </span>
              </div>
              <div className="flex justify-between py-2">
                <span className="text-emma-muted">Niveau de confiance</span>
                <span className="font-semibold text-emma-navy">
                  {formaterValeur(analyse.niveau_confiance)}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}