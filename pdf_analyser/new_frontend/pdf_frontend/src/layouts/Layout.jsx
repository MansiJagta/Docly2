import { Outlet, useLocation } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import { useState, useEffect } from "react";
import { ChevronRight, ChevronLeft, Menu } from "lucide-react";

export default function Layout() {
    const location = useLocation();
    const isLanding = location.pathname === "/";
    const isFocusMode = location.pathname.includes("/ask"); // Auto-collapse on chat/ask pages

    const [isSidebarOpen, setIsSidebarOpen] = useState(!isFocusMode);

    useEffect(() => {
        // Only auto-collapse on focus mode pages, but don't force open on other pages
        // This allows manual toggle on non-focus pages
        if (isFocusMode) {
            setIsSidebarOpen(false);
        }
    }, [isFocusMode]);

    if (isLanding) {
        return (

            <div className="min-h-screen text-white font-sans selection:bg-blue-500/30 selection:text-white">
                {/* Global Atmosphere is handled by body styles in index.css */}
                <Navbar />
                <main className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    <Outlet />
                </main>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-background text-text font-sans selection:bg-primary/30 selection:text-white flex">
            {/* Background Ambience */}
            {/* Additional Cyber Atmosphere */}
            <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
                <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-blue-900/20 rounded-full blur-[150px] opacity-40 mix-blend-screen" />
                <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] bg-blue-800/20 rounded-full blur-[150px] opacity-30 mix-blend-screen" />
            </div>

            <div className={`fixed inset-y-0 left-0 z-30 transform transition-transform duration-300 ease-in-out overflow-hidden ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
                <Sidebar />
            </div>

            {/* Sidebar Toggle Button (Floating) */}
            <button
                onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                className={`fixed z-40 top-4 left-4 p-2 rounded-lg bg-black/50 text-white border border-white/10 hover:bg-blue-600 hover:border-blue-500 transition-all ${isSidebarOpen ? 'hidden' : 'block'}`}
            >
                <Menu className="w-5 h-5" />
            </button>
            <button
                onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                className={`fixed z-40 top-4 left-64 ml-2 p-2 rounded-lg bg-black/50 text-white border border-white/10 hover:bg-blue-600 transition-all ${isSidebarOpen ? 'block' : 'hidden'}`}
            >
                <ChevronLeft className="w-5 h-5" />
            </button>

            <main className={`relative z-10 flex-1 p-6 md:p-10 transition-all duration-300 ${isSidebarOpen ? 'md:ml-64' : 'ml-0'}`}>
                <div className="max-w-7xl mx-auto">
                    <Outlet />
                </div>
            </main>
        </div>
    );
}
