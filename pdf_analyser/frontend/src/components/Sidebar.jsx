import React from 'react';
import { NavLink } from 'react-router-dom';
import {
    Home,
    LayoutDashboard,
    Library,
    BrainCircuit,
    Factory,
    ShieldCheck,
    FileText,
    Settings
} from 'lucide-react';

const navItems = [
    { name: 'Home', path: '/', icon: Home },
    { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
    { name: 'Library', path: '/library', icon: Library },
    { name: 'Analysis Lab', path: '/analysis', icon: BrainCircuit },
    { name: 'Batch Processor', path: '/batch', icon: Factory },
    { name: 'Privacy Vault', path: '/vault', icon: ShieldCheck },
    { name: 'Templates', path: '/templates', icon: FileText },
    { name: 'Settings', path: '/settings', icon: Settings },
];

const Sidebar = () => {
    return (
        <aside className="fixed left-0 top-0 h-screen w-20 md:w-64 backdrop-blur-xl bg-background/30 border-r border-primary/20 z-50 flex flex-col justify-between transition-all duration-300">
            <div className="p-4 md:p-6 flex flex-col gap-8">
                {/* Logo Area */}
                <div className="flex items-center justify-center md:justify-start gap-3">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary to-accent animate-pulse" />
                    <span className="hidden md:block font-bold text-xl tracking-wider text-transparent bg-clip-text bg-gradient-to-r from-primary to-accent">
                        NANO AI
                    </span>
                </div>

                {/* Navigation */}
                <nav className="flex flex-col gap-2">
                    {navItems.map((item) => (
                        <NavLink
                            key={item.path}
                            to={item.path}
                            className={({ isActive }) =>
                                `flex items-center gap-3 p-3 rounded-xl transition-all duration-300 group relative overflow-hidden ${isActive
                                    ? 'bg-primary/20 text-accent shadow-[0_0_15px_rgba(124,58,237,0.3)] border border-primary/50'
                                    : 'text-gray-400 hover:text-white hover:bg-white/5'
                                }`
                            }
                        >
                            {({ isActive }) => (
                                <>
                                    <item.icon
                                        size={24}
                                        className={`transition-transform duration-300 ${isActive ? 'scale-110' : 'group-hover:scale-110'
                                            }`}
                                    />
                                    <span className="hidden md:block font-medium">{item.name}</span>
                                    {isActive && (
                                        <div className="absolute left-0 top-0 w-1 h-full bg-accent shadow-[0_0_10px_#22D3EE]" />
                                    )}
                                </>
                            )}
                        </NavLink>
                    ))}
                </nav>
            </div>

            <div className="p-4 text-center hidden md:block text-xs text-gray-500">
                v1.0.0 Offline Mode
            </div>
        </aside>
    );
};

export default Sidebar;
