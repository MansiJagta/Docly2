import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import MainLayout from './layouts/MainLayout';
import Home from './pages/Home';
import Dashboard from './pages/Dashboard';
import Library from './pages/Library';
import Analysis from './pages/Analysis';
import Batch from './pages/Batch';
import Vault from './pages/Vault';
import Templates from './pages/Templates';
import Settings from './pages/Settings';

function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<MainLayout />}>
                    <Route index element={<Home />} />
                    <Route path="dashboard" element={<Dashboard />} />
                    <Route path="library" element={<Library />} />
                    <Route path="analysis" element={<Analysis />} />
                    <Route path="batch" element={<Batch />} />
                    <Route path="vault" element={<Vault />} />
                    <Route path="templates" element={<Templates />} />
                    <Route path="settings" element={<Settings />} />
                    <Route path="*" element={<Navigate to="/" replace />} />
                </Route>
            </Routes>
        </BrowserRouter>
    );
}

export default App;
