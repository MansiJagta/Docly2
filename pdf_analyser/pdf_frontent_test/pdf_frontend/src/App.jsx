import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Layout from "./layouts/Layout";
import Landing from "./pages/Landing";
import Dashboard from "./pages/Dashboard";
import Upload from "./pages/Upload";
import DocumentDetail from "./pages/DocumentDetail";
import AskQuestion from "./pages/AskQuestion";
import MultiDocumentAnalysis from "./pages/MultiDocumentAnalysis";
import Vault from "./pages/Vault";
import Settings from "./pages/Settings";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Landing />} />
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="upload" element={<Upload />} />
          <Route path="analyze" element={<MultiDocumentAnalysis />} />
          <Route path="documents/:id" element={<DocumentDetail />} />
          <Route path="documents/:id/ask" element={<AskQuestion />} />
          <Route path="documents/chat" element={<AskQuestion />} />
          <Route path="vault" element={<Vault />} />
          <Route path="settings" element={<Settings />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
