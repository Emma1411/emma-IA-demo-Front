import { useState } from "react";
import { Outlet } from "react-router-dom";
import AppHeader from "../components/header/AppHeader";
import Sidebar from "../components/sidebar/Sidebar";
import NouvelleDiscussionModal from "../components/discussion/Nouvellediscussionmodal";
import { useNouvelleDiscussion } from "../hooks/Usenouvellediscussion";
import { useVisualViewport } from "../hooks/useVisualViewport";


export default function MainLayout() {
  const [sidebarOuverte, setSidebarOuverte] = useState(false);
  const { demarrerNouvelleDiscussion, modalOuverte, confirmer, annuler } =
    useNouvelleDiscussion();

  return (
   <div className="app-shell bg-[#FAF8FF] font-sans">
  <div className="app-shell__header md:hidden">
    <AppHeader onOuvrirSidebar={() => setSidebarOuverte(true)} />
  </div>

  <div className="flex min-h-0 flex-1 overflow-hidden">
    <div className="hidden md:block">
      <Sidebar onNouvelleDiscussion={demarrerNouvelleDiscussion} />
    </div>

    {sidebarOuverte && (
      <div className="fixed inset-0 z-40 md:hidden">
        <div
          className="absolute inset-0 bg-black/40"
          onClick={() => setSidebarOuverte(false)}
        />
        <div className="relative z-50 h-full w-[280px]">
          <Sidebar
            onNouvelleDiscussion={demarrerNouvelleDiscussion}
            onFermer={() => setSidebarOuverte(false)}
          />
        </div>
      </div>
    )}

    <main className="min-h-0 flex-1 overflow-hidden">
      <Outlet />
    </main>
  </div>

  <NouvelleDiscussionModal
    ouverte={modalOuverte}
    onAnnuler={annuler}
    onConfirmer={confirmer}
  />
</div>
  );
}
