import { BrowserRouter, Routes, Route } from "react-router-dom";

import Landing from "./pages/Landing";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import UploadDocuments from "./pages/UploadDocuments";
import AIExtraction from "./pages/AIExtraction";
import DraftPreview from "./pages/DraftPreview";
import ReviewProject from "./pages/ReviewProject";
import CertificationSuccess from "./pages/CertificationSuccess";
import ComplianceReport from "./pages/ComplianceReport";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>

        <Route path="/" element={<Landing />} />

        <Route path="/login" element={<Login />} />

        <Route path="/dashboard" element={<Dashboard />} />

        <Route path="/upload" element={<UploadDocuments />} />

        <Route path="/extract" element={<AIExtraction />} />

        <Route path="/draft" element={<DraftPreview />} />

        <Route path="/review" element={<ReviewProject />} />

        <Route path="/success" element={<CertificationSuccess />} />

        <Route path="/compliance" element={<ComplianceReport />} />
      </Routes>
    </BrowserRouter>
  );
}