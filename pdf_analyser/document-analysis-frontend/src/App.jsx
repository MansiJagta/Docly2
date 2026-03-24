import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import AppLayout from './components/layout/AppLayout';
import Landing from './pages/Landing';
import Workspace from './pages/Workspace';
import History from './pages/History';
import Settings from './pages/Settings';

export default function App() {
  const [modelStatus, setModelStatus] = useState(true);
  const [currentDocument, setCurrentDocument] = useState(null);

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route
          path="/workspace"
          element={
            <AppLayout modelStatus={modelStatus}>
              <Workspace 
                currentDocument={currentDocument}
                setCurrentDocument={setCurrentDocument}
              />
            </AppLayout>
          }
        />
        <Route
          path="/history"
          element={
            <AppLayout modelStatus={modelStatus}>
              <History setCurrentDocument={setCurrentDocument} />
            </AppLayout>
          }
        />
        <Route
          path="/settings"
          element={
            <AppLayout modelStatus={modelStatus}>
              <Settings setModelStatus={setModelStatus} />
            </AppLayout>
          }
        />
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Router>
  );
}