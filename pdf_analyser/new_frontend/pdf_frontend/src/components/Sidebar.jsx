import { Link, useLocation } from "react-router-dom";
import { FileText, UploadCloud, LayoutDashboard, Settings, Home, Shield } from "lucide-react";
import { cn } from "../utils/cn";
import { motion } from "framer-motion";

export default function Sidebar() {
    const location = useLocation();

    const navItems = [
        { name: "Home", path: "/", icon: Home },
        { name: "My Workspace", path: "/dashboard", icon: LayoutDashboard },
        { name: "Privacy Vault", path: "/upload", icon: Shield },
        { name: "Upload File", path: "/upload", icon: UploadCloud },
    ];

    return (
        <motion.aside
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex flex-col w-64 h-screen glass-panel transition-all duration-300"
        >
            {/* Logo */}
            <div className="p-8 pb-4">
                <Link to="/" className="flex items-center space-x-3 group">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-600 to-cyan-400 flex items-center justify-center shadow-[0_0_15px_rgba(59,130,246,0.5)] group-hover:scale-105 transition-transform duration-300">
                        <FileText className="w-6 h-6 text-white" />
                    </div>
                    <div>
                        <span className="block text-lg font-bold text-white tracking-wide">
                            CYBER<span className="text-blue-400">VAULT</span>
                        </span>
                        <span className="text-[10px] text-blue-400/80 font-mono tracking-[0.2em] uppercase">Secure Access</span>
                    </div>
                </Link>
            </div>

            {/* Navigation */}
            <nav className="flex-1 px-4 py-8 space-y-2">
                <p className="px-4 text-xs font-semibold text-text-muted uppercase tracking-wider mb-4">Navigation</p>

                {navItems.map((item) => {
                    const isActive = location.pathname === item.path;
                    return (
                        <Link key={item.path} to={item.path}>
                            <div className={cn(
                                "relative flex items-center px-4 py-3 rounded-xl transition-all duration-300 group overflow-hidden border border-transparent",
                                isActive
                                    ? "bg-blue-600/10 text-white border-blue-500/30 shadow-[0_0_10px_rgba(59,130,246,0.2)]"
                                    : "text-gray-400 hover:text-white hover:bg-white/5"
                            )}>
                                {isActive && (
                                    <motion.div
                                        layoutId="activeNav"
                                        className="absolute left-0 w-1 h-8 bg-primary rounded-r-full"
                                    />
                                )}
                                <item.icon className={cn(
                                    "w-5 h-5 mr-3 transition-colors",
                                    isActive ? "text-blue-400" : "text-gray-500 group-hover:text-white"
                                )} />
                                <span className="font-medium">{item.name}</span>

                                {/* Hover Glow */}
                                {isActive && (
                                    <div className="absolute inset-0 bg-primary/5 blur-xl -z-10" />
                                )}
                            </div>
                        </Link>
                    );
                })}
            </nav>

            {/* Footer / Settings (Minimal) */}
            <div className="p-4 border-t border-border-glass">
                <Link to="/settings" className="w-full flex items-center p-3 rounded-xl hover:bg-white/5 transition-colors text-slate-400 hover:text-white">
                    <Settings className="w-5 h-5 mr-3" />
                    <span className="text-sm font-medium">Settings</span>
                </Link>
            </div>
        </motion.aside>
    );
}


