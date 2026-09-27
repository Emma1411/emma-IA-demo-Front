import { Routes, Route } from "react-router-dom";
import MainLayout from "../layouts/MainLayout";
import DiscussionPage from "../pages/DiscussionPage";
import DetailsPage from "../pages/DetailsPage";
import InstructionsPage from "../pages/InstructionsPage";

export default function AppRoutes() {
  return (
    <Routes>
      <Route element={<MainLayout />}>
        <Route path="/" element={<DiscussionPage />} />
        <Route path="/details" element={<DetailsPage />} />
        <Route path="/comment-tester" element={<InstructionsPage />} />
      </Route>
    </Routes>
  );
}