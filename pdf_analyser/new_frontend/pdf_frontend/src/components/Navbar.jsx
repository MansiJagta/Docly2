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
        <nav className="sticky top-0 z-50 w-full border-b border-white/10 bg-[#0F172A]/80 backdrop-blur-xl">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">
                    {/* Logo */}
                    <Link to="/" className="flex items-center space-x-2 group">
                        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-600 to-cyan-400 flex items-center justify-center shadow-[0_0_10px_rgba(59,130,246,0.5)] group-hover:scale-105 transition-all duration-300">
                            <FileText className="w-5 h-5 text-white" />
                        </div>
                        <span className="text-lg font-bold text-white tracking-wide">
                            CYBER<span className="text-blue-400">VAULT</span>
                        </span>
                    </Link>

                    {/* Desktop Nav */}
                    <div className="hidden md:flex items-center space-x-6">
                        {navLinks.map((link) => (
                            <Link
                                key={link.path}
                                to={link.path}
                                className={cn(
                                    "text-sm font-medium transition-colors hover:text-accent",
                                    location.pathname === link.path ? "text-accent" : "text-text-muted"
                                )}
                            >
                                {link.name}
                            </Link>
                        ))}
                        <Link to="/upload">
                            <Button size="sm" icon={Plus}>New Document</Button>
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
