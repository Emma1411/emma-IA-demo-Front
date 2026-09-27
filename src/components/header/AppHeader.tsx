import { FiMenu, FiUser } from "react-icons/fi";

interface AppHeaderProps {
  onOuvrirSidebar: () => void;
}

export default function AppHeader({ onOuvrirSidebar }: AppHeaderProps) {
  return (
    <header className="flex items-center justify-between border-b border-emma-border bg-white px-4 py-3">
      <div className="flex items-center gap-3">
        <button
          onClick={onOuvrirSidebar}
          className="rounded-lg p-2 text-emma-navy hover:bg-emma-light md:hidden"
          type="button"
        >
          <FiMenu size={20} />
        </button>

        <div className="flex items-center gap-2">
          <span className="hidden font-semibold text-emma-navy md:inline">
            Emma.ia
          </span>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <span className="font-semibold text-emma-navy">Emma IA</span>
      </div>

      <div className="flex items-center gap-2">
        
      </div>
    </header>
  );
}