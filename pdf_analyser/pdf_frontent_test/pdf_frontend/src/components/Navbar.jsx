import { Link, useLocation } from "react-router-dom";
import { Copy, Plus, Menu, X, FileText } from "lucide-react";
import { useState } from "react";
import Button from "./Button";
import { cn } from "../utils/cn";

export default function Navbar() {
    const [isOpen, setIsOpen] = useState(false);
    const location = useLocation();

    const navLinks = [
        { name: "Dashboard", path: "/dashboard" },
        { name: "Upload", path: "/upload" },
    ];

    return (
        <nav className="fixed top-0 left-0 right-0 z-40 w-full border-b border-white/10 bg-[#020617]/90 backdrop-blur-2xl shadow-[0_10px_40px_rgba(15,23,42,0.9)]">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-10">
                <div className="flex items-center justify-between h-20">
                    {/* Logo */}
                    <Link to="/" className="flex items-center space-x-4 group">
                        <div className="w-11 h-11 rounded-2xl bg-linear-to-br from-blue-600 to-cyan-400 flex items-center justify-center shadow-[0_0_20px_rgba(59,130,246,0.8)] group-hover:scale-105 transition-all duration-300">
                            <FileText className="w-6 h-6 text-white" />
                        </div>
                        <div className="flex flex-col">
                            <span className="text-[26px] font-extrabold text-white tracking-wide leading-none">
                                DOCLY
                            </span>
                            <span className="text-[10px] uppercase tracking-[0.25em] text-blue-300/80 mt-1">
                                Docly
                            </span>
                        </div>
                    </Link>

                    {/* Desktop Nav */}
                    <div className="hidden md:flex items-center space-x-8">
                        {navLinks.map((link) => (
                            <Link
                                key={link.path}
                                to={link.path}
                                className={cn(
                                    "text-base font-semibold tracking-wide transition-colors hover:text-accent",
                                    location.pathname === link.path ? "text-accent" : "text-text-muted"
                                )}
                            >
                                {link.name}
                            </Link>
                        ))}
                        <Link to="/upload">
                            <Button size="md" icon={Plus} className="text-sm font-semibold px-5 py-2 rounded-full">
                                New Document
                            </Button>
                        </Link>
                    </div>

                    {/* Mobile Menu Button */}
                    <div className="md:hidden">
                        <button
                            onClick={() => setIsOpen(!isOpen)}
                            className="p-2 text-text-muted hover:text-white"
                        >
                            {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile Nav */}
            {isOpen && (
                <div className="md:hidden bg-surface border-t border-surface/50 animate-fade-in">
                    <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
                        {navLinks.map((link) => (
                            <Link
                                key={link.path}
                                to={link.path}
                                onClick={() => setIsOpen(false)}
                                className={cn(
                                    "block px-3 py-2 rounded-md text-base font-medium",
                                    location.pathname === link.path
                                        ? "bg-primary/10 text-accent"
                                        : "text-text-muted hover:text-white hover:bg-surface-hover"
                                )}
                            >
                                {link.name}
                            </Link>
                        ))}
                    </div>
                </div>
            )}
        </nav>
    );
}
