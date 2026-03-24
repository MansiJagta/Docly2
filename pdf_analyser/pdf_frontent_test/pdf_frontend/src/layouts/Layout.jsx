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

    return (
        <div className="min-h-screen text-white font-sans selection:bg-blue-500/30 selection:text-white flex flex-col">
            {/* Global Background Atmosphere */}
            <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
                <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-blue-900/20 rounded-full blur-[150px] opacity-40 mix-blend-screen" />
                <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] bg-blue-800/20 rounded-full blur-[150px] opacity-30 mix-blend-screen" />
            </div>

            {/* Layout for landing page: navbar on top, no sidebar */}
            {isLanding ? (
                <>
                    <div className="relative z-40">
                        <Navbar />
                    </div>
                    <div className="relative z-10 flex flex-1 pt-16 md:pt-20">
                        <main className="relative z-10 flex-1 px-3 sm:px-4 md:px-8 pb-8 w-full">
                            <div className="max-w-7xl mx-auto px-0">
                                <Outlet />
                            </div>
                        </main>
                    </div>
                </>
            ) : (
                <div className="relative z-10 flex flex-1">
                    {/* Sidebar only on inner pages */}
                    <div className={`fixed top-0 bottom-0 left-0 z-30 transform transition-transform duration-300 ease-in-out overflow-hidden ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
                        <Sidebar />
                    </div>

                    {/* Sidebar Toggle Button (Floating) */}
                    <>
                        <button
                            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                            className={`fixed z-40 top-4 left-4 p-2 rounded-lg bg-black/60 text-white border border-white/10 hover:bg-blue-600 hover:border-blue-500 transition-all ${isSidebarOpen ? 'hidden' : 'block'}`}
                        >
                            <Menu className="w-5 h-5" />
                        </button>
                        <button
                            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                            className={`fixed z-40 top-4 left-64 ml-2 p-2 rounded-lg bg-black/60 text-white border border-white/10 hover:bg-blue-600 transition-all ${isSidebarOpen ? 'block' : 'hidden'}`}
                        >
                            <ChevronLeft className="w-5 h-5" />
                        </button>
                    </>

                    {/* Page Content */}
                    <main
                        className={`relative z-10 flex-1 p-4 sm:p-6 md:p-10 transition-all duration-300 w-full ${
                            isSidebarOpen ? 'md:ml-64' : ''
                        }`}
                    >
                        <div className="max-w-7xl mx-auto">
                            <Outlet />
                        </div>
                    </main>
                </div>
            )}

            {/* Global Footer */}
            <footer className="relative z-10 border-t border-white/10 bg-black/60 backdrop-blur-xl">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-10 py-4 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs sm:text-sm text-slate-500">
                    <div className="flex items-center gap-2">
                        <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 shadow-[0_0_12px_rgba(52,211,153,0.9)]" />
                        <span>© {new Date().getFullYear()} Docly</span>
                    </div>
                    <div className="flex items-center gap-4 text-[11px] uppercase tracking-[0.18em]">
                        <span className="text-slate-500">No Cloud Uploads</span>
                        <span className="hidden sm:inline-block text-slate-600">•</span>
                        <span className="text-slate-500">Local‑First Analytics</span>
                    </div>
                </div>
            </footer>
        </div>
    );
}
