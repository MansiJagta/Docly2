import React from 'react';
import { Outlet, useLocation, Link } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import BackgroundCanvas from '../components/BackgroundCanvas';
import { Shield } from 'lucide-react';

const MainLayout = () => {
    const location = useLocation();
    const isHome = location.pathname === '/';

    const performScroll = (id) => {
        const element = document.getElementById(id);
        if (element) element.scrollIntoView({ behavior: 'smooth' });
    };

    return (
        <div className="min-h-screen bg-transparent text-text font-sans selection:bg-primary/30 selection:text-accent">

            {/* Conditional Navigation */}
            {isHome ? (
                // Home Navbar
                <nav className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-8 py-6 bg-transparent">
                    <div className="flex items-center gap-2">
                        <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                            <Shield size={20} className="text-white" />
                        </div>
                        <span className="text-xl font-bold tracking-tight text-white">Nano AI</span>
                    </div>

                    <div className="flex items-center gap-8 bg-black/30 backdrop-blur-md px-6 py-3 rounded-full border border-white/5">
                        <button onClick={() => performScroll('about')} className="text-sm font-medium text-gray-300 hover:text-white transition-colors">About</button>
                        <button onClick={() => performScroll('features')} className="text-sm font-medium text-gray-300 hover:text-white transition-colors">Features</button>
                        <Link to="/vault" className="text-sm font-medium text-gray-300 hover:text-white transition-colors flex items-center gap-2">
                            Privacy Vault
                        </Link>
                    </div>

                    <div>
                        <Link to="/analysis" className="px-5 py-2 bg-primary text-white rounded-full font-bold text-sm hover:bg-primary/80 transition-colors">
                            Launch App
                        </Link>
                    </div>
                </nav>
            ) : (
                // App Sidebar
                <Sidebar />
            )}

            {/* Main Content Area */}
            {/* Remove margin on home page, keep for app pages */}
            <main className={`${isHome ? '' : 'ml-20 md:ml-64'} relative min-h-screen z-10 transition-all duration-300`}>
                <Outlet />
            </main>

            <div className="fixed inset-0 z-0 h-screen w-screen pointer-events-none">
                <BackgroundCanvas />
            </div>
        </div>
    );
};

export default MainLayout;
