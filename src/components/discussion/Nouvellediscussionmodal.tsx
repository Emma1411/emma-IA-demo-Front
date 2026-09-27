interface NouvelleDiscussionModalProps {
  ouverte: boolean;
  onAnnuler: () => void;
  onConfirmer: () => void;
}

export default function NouvelleDiscussionModal({
  ouverte,
  onAnnuler,
  onConfirmer,
}: NouvelleDiscussionModalProps) {
  if (!ouverte) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
      <div className="w-full max-w-sm rounded-2xl bg-white p-6 shadow-lg">
        <h3 className="text-base font-semibold text-emma-navy">
          Commencer une nouvelle discussion ?
        </h3>
        <p className="mt-2 text-sm text-emma-muted">
          La discussion actuelle sera effacée de la session. Cette action
          ne pourra pas être annulée.
        </p>
        <div className="mt-5 flex gap-3">
          <button
            onClick={onAnnuler}
            type="button"
            className="flex-1 rounded-lg border border-emma-border py-2 text-sm font-medium text-emma-navy hover:bg-emma-lighter"
          >
            Annuler
          </button>
          <button
            onClick={onConfirmer}
            type="button"
            className="flex-1 rounded-lg bg-emma-primary py-2 text-sm font-medium text-white hover:bg-emma-primaryDark"
          >
            Nouvelle discussion
          </button>
        </div>
      </div>
    </div>
  );
}