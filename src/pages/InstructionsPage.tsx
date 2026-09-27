import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  FiArrowLeft,
  FiCopy,
  FiCheck,
  FiChevronDown,
  FiFileText,
  FiDatabase,
  FiZap,
  FiCode,
  FiCreditCard,
  FiHome,
  FiTruck,
  FiDollarSign,
} from "react-icons/fi";
import { DOSSIERS_EXEMPLES } from "../data/dossiersExemples";

const ICONES = [FiDollarSign, FiHome, FiTruck, FiHome, FiCreditCard];
const COULEURS = [
  { bg: "bg-emma-light", text: "text-emma-primary" },
  { bg: "bg-emerald-50", text: "text-emma-green" },
  { bg: "bg-amber-50", text: "text-amber-700" },
  { bg: "bg-indigo-50", text: "text-indigo-600" },
  { bg: "bg-rose-50", text: "text-rose-600" },
];

export default function InstructionsPage() {
  const navigate = useNavigate();
  const [ouvertId, setOuvertId] = useState<string | null>(null);
  const [copieId, setCopieId] = useState<string | null>(null);

  const copier = async (id: string, dossier: Record<string, unknown>) => {
    try {
      await navigator.clipboard.writeText(JSON.stringify(dossier, null, 2));
      setCopieId(id);
      setTimeout(() => setCopieId(null), 1500);
    } catch {
      // silencieux — le navigateur peut refuser sans HTTPS ; rien de
      // critique à afficher, l'utilisateur peut copier manuellement.
    }
  };

  return (
    <div className="h-full overflow-y-auto bg-emma-lighter">
      <div className="mx-auto max-w-4xl px-4 py-8">
        <button
          onClick={() => navigate("/")}
          type="button"
          className="mb-6 flex items-center gap-1 text-sm font-medium text-emma-primary"
        >
          <FiArrowLeft size={16} /> Retour à la discussion
        </button>

        {/* Hero */}
        <div className="mb-8 rounded-3xl bg-gradient-to-br from-emma-primary to-indigo-600 p-8 text-white">
          <h1 className="mb-2 text-2xl font-bold">Comment tester Emma.ia</h1>
          <p className="max-w-2xl text-sm text-white/85">
            Cette démo vous permet de discuter directement avec Emma, l'assistante
            d'analyse de crédit de SecureFinance-RAG. Elle structure les dossiers,
            identifie les éléments favorables et les points d'attention, et
            produit une analyse traçable sans jamais prendre de décision
            automatique à votre place.
          </p>
        </div>

        {/* Pourquoi un JSON et pas un PDF */}
        <div className="mb-8 rounded-2xl border border-emma-border bg-white p-6">
          <div className="mb-3 flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-emma-light text-emma-primary">
              <FiFileText size={16} />
            </div>
            <h2 className="text-base font-semibold text-emma-navy">
              Pourquoi coller un JSON plutôt qu'un PDF ?
            </h2>
          </div>
          <p className="mb-3 text-sm leading-relaxed text-emma-navy">
            Dans la version complète du SaaS, un analyste importe directement les
            documents du client pièce d'identité, talons de paie, relevés
            bancaires, etc. Un système d'extraction lit ces documents, structure
            leur contenu et le stocke en base de données, avant de le transmettre
            à Emma sous une forme structurée. C'est cette étape d'extraction qui
            accélère le temps de réponse d'Emma, puisqu'elle n'a jamais à
            interpréter un document brut elle-même.
          </p>
          <p className="text-sm leading-relaxed text-emma-navy">
            <strong>
              Cette partie du produit l'upload et l'extraction de documents
              sera dans le SaaS.
            </strong>{" "}
            Cette démo publique vous fait donc sauter directement à l'étape
            suivante : coller le JSON structuré qu'Emma recevrait normalement
            après extraction, pour que vous puissiez tester exactement son
            raisonnement d'analyse, sans le pipeline de documents.
          </p>

          <div className="mt-4 flex flex-wrap items-center gap-3 text-xs">
            <div className="flex items-center gap-1.5 rounded-lg bg-emma-lighter px-3 py-1.5 text-emma-muted">
              <FiFileText size={13} /> Documents (SaaS)
            </div>
            <span className="text-emma-muted">→</span>
            <div className="flex items-center gap-1.5 rounded-lg bg-emma-lighter px-3 py-1.5 text-emma-muted">
              <FiDatabase size={13} /> Extraction + BD (SaaS)
            </div>
            <span className="text-emma-muted">→</span>
            <div className="flex items-center gap-1.5 rounded-lg bg-emma-light px-3 py-1.5 font-semibold text-emma-primary">
              <FiZap size={13} /> JSON → Emma (ce que vous testez ici)
            </div>
          </div>
        </div>

        {/* Structure du JSON */}
        <div className="mb-8 rounded-2xl border border-emma-border bg-white p-6">
          <div className="mb-4 flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-emma-light text-emma-primary">
              <FiCode size={16} />
            </div>
            <h2 className="text-base font-semibold text-emma-navy">
              Comprendre la structure du JSON
            </h2>
          </div>
          <p className="mb-4 text-sm text-emma-navy">
            Chaque dossier suit toujours la même structure, quel que soit le
            type de crédit. Voici ce que contient chaque clé.
          </p>

          <div className="space-y-4">
            <div className="rounded-xl border-l-4 border-emma-primary bg-emma-lighter p-4">
              <code className="text-xs font-bold text-emma-primary">ticket_id</code>
              <p className="mt-1 text-xs text-emma-navy">
                Identifiant du dossier, choisi librement pour le distinguer dans
                l'historique de conversation (ex. "TEST-HYPO-001").
              </p>
            </div>

            <div className="rounded-xl border-l-4 border-emma-primary bg-emma-lighter p-4">
              <code className="text-xs font-bold text-emma-primary">donnees_dossier</code>
              <p className="mt-1 text-xs text-emma-navy">
                Toutes les données brutes du dossier — c'est le seul objet
                qu'Emma peut réellement lire et analyser.
              </p>
              <div className="mt-3 space-y-2 border-l-2 border-emma-border pl-3">
                <div>
                  <code className="text-[11px] font-semibold text-emma-navy">
                    demandeur.id
                  </code>
                  <p className="text-[11px] text-emma-muted">
                    Identifiant anonymisé du client — jamais de nom réel.
                  </p>
                </div>
                <div>
                  <code className="text-[11px] font-semibold text-emma-navy">demande</code>
                  <p className="text-[11px] text-emma-muted">
                    Montant, durée, type de crédit, objectif — et les champs
                    propres au produit (ex. mise_de_fonds et valeur_propriete
                    pour un prêt hypothécaire).
                  </p>
                </div>
                <div>
                  <code className="text-[11px] font-semibold text-emma-navy">revenus</code>
                  <p className="text-[11px] text-emma-muted">
                    Montant, périodicité, devise, source (talon_paie,
                    déclaration...) et statut de vérification.
                  </p>
                </div>
                <div>
                  <code className="text-[11px] font-semibold text-emma-navy">dettes</code>
                  <p className="text-[11px] text-emma-muted">
                    Liste des dettes existantes — type, solde, mensualité,
                    source et statut de vérification pour chacune.
                  </p>
                </div>
                <div>
                  <code className="text-[11px] font-semibold text-emma-navy">
                    dettes_confirmees_completes
                  </code>
                  <p className="text-[11px] text-emma-muted">
                    true si le client a confirmé que la liste ci-dessus est
                    exhaustive — sinon Emma le signale comme à vérifier.
                  </p>
                </div>
                <div>
                  <code className="text-[11px] font-semibold text-emma-navy">
                    historique_credit
                  </code>
                  <p className="text-[11px] text-emma-muted">
                    Score du bureau de crédit, taux de remboursement, nombre de
                    retards.
                  </p>
                </div>
              </div>
            </div>

            <div className="rounded-xl border-l-4 border-emma-green bg-emma-lighter p-4">
              <code className="text-xs font-bold text-emma-green">
                metriques_officielles_calculees
              </code>
              <p className="mt-1 text-xs text-emma-navy">
                Les ratios déjà calculés par le moteur de règles du système —
                selon le produit : <code className="text-[11px]">ratio_endettement</code>{" "}
                (un ratio global) ou <code className="text-[11px]">abd_ratio</code>/
                <code className="text-[11px]">atd_ratio</code> (pour un produit
                hypothécaire). Emma les utilise telles quelles ; elle ne les
                recalcule jamais elle-même.
              </p>
            </div>

            <div className="rounded-xl border-l-4 border-amber-400 bg-emma-lighter p-4">
              <code className="text-xs font-bold text-amber-700">
                champs_obligatoires_pour_ce_produit
              </code>
              <p className="mt-1 text-xs text-emma-navy">
                La liste des documents réellement requis pour ce type de crédit
                précis. C'est la seule source qu'Emma utilise pour décider
                qu'un document manquant est "obligatoire" — retirez-en un pour
                voir Emma ne plus le signaler comme bloquant.
              </p>
            </div>
          </div>
        </div>

        {/* Comment tester */}
        <div className="mb-8 rounded-2xl border border-emma-border bg-white p-6">
          <h2 className="mb-4 text-base font-semibold text-emma-navy">Comment tester</h2>
          <ol className="space-y-3 text-sm text-emma-navy">
            <li className="flex gap-3">
              <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-emma-light text-xs font-bold text-emma-primary">
                1
              </span>
             Choisissez un type de crédit ci-dessous et copiez son JSON d'exemple ou construisez votre propre dossier de test en suivant simplement ce même format.
            </li>
            <li className="flex gap-3">
              <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-emma-light text-xs font-bold text-emma-primary">
                2
              </span>
              Collez-le dans le chat avec ou sans phrase d'accompagnement,
              n'importe où dans le message.
            </li>
            <li className="flex gap-3">
              <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-emma-light text-xs font-bold text-emma-primary">
                3
              </span>
              Posez une question ponctuelle, ou demandez directement une "analyse
              complète" pour obtenir le rapport structuré et accéder à la page
              détails.
            </li>
          </ol>
        </div>

        {/* Types de crédit */}
        <h2 className="mb-4 text-base font-semibold text-emma-navy">
          Types de crédit pris en charge
        </h2>
        <div className="space-y-3">
          {DOSSIERS_EXEMPLES.map((d, i) => {
            const Icone = ICONES[i % ICONES.length];
            const couleur = COULEURS[i % COULEURS.length];
            const estOuvert = ouvertId === d.id;

            return (
              <div
                key={d.id}
                className="overflow-hidden rounded-2xl border border-emma-border bg-white"
              >
                <button
                  type="button"
                  onClick={() => setOuvertId(estOuvert ? null : d.id)}
                  className="flex w-full items-center justify-between gap-3 p-4 text-left"
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${couleur.bg} ${couleur.text}`}
                    >
                      <Icone size={17} />
                    </div>
                    <div>
                      <div className="text-sm font-semibold text-emma-navy">{d.titre}</div>
                      <div className="text-xs text-emma-muted">{d.description}</div>
                    </div>
                  </div>
                  <FiChevronDown
                    size={18}
                    className={`shrink-0 text-emma-muted transition-transform ${
                      estOuvert ? "rotate-180" : ""
                    }`}
                  />
                </button>

                {estOuvert && (
                  <div className="border-t border-emma-border p-4">
                    <div className="mb-3 flex items-center justify-between">
                      <span className="text-xs font-semibold uppercase text-emma-muted">
                        JSON d'exemple
                      </span>
                      <button
                        type="button"
                        onClick={() => copier(d.id, d.dossier)}
                        className="flex items-center gap-1.5 rounded-lg bg-emma-primary px-3 py-1.5 text-xs font-semibold text-white hover:bg-emma-primaryDark"
                      >
                        {copieId === d.id ? (
                          <>
                            <FiCheck size={13} /> Copié
                          </>
                        ) : (
                          <>
                            <FiCopy size={13} /> Copier
                          </>
                        )}
                      </button>
                    </div>
                    <pre className="max-h-72 overflow-auto rounded-xl bg-emma-navy p-4 text-[11px] leading-relaxed text-emerald-100">
                      {JSON.stringify(d.dossier, null, 2)}
                    </pre>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}