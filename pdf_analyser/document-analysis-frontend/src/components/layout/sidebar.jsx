import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FileText, Sparkles, Shield, History, Settings, Circle } from 'lucide-react';

export default function Sidebar() {
  const navigate = useNavigate();
  const location = useLocation();
  
  const navItems = [
    { id: 'landing', path: '/', icon: Sparkles, label: 'Home' },
    { id: 'workspace', path: '/workspace', icon: FileText, label: 'Workspace' },
    { id: 'history', path: '/history', icon: History, label: 'History' },
    { id: 'settings', path: '/settings', icon: Settings, label: 'Settings' }
  ];
  
  return (
    <div className="w-64 bg-slate-900/30 border-r border-white/10 h-screen flex flex-col p-4">
      {/* Logo Section */}
      <div className="mb-8">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-cyan-500 to-purple-500 rounded-lg flex items-center justify-center">
            <Shield className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-lg font-bold text-white">PDF Analyzer</h1>
            <p className="text-xs text-gray-400">100% Local</p>
          </div>
        </div>
      </div>
      
      {/* Navigation */}
      <nav className="flex-1 space-y-2">
        {navItems.map(item => {
          const isActive = location.pathname === item.path;
          return (
            <motion.button
              key={item.id}
              whileHover={{ x: 4 }}
              onClick={() => navigate(item.path)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                isActive
                  ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 glow-cyan-soft'
                  : 'text-gray-400 hover:bg-white/5 hover:text-gray-300'
              }`}
            >
              <item.icon className="w-5 h-5" />
              <span className="font-medium">{item.label}</span>
            </motion.button>
          );
        })}
      </nav>
      
      {/* Status Footer */}
      <div className="mt-auto pt-4 border-t border-white/10">
        <div className="flex items-center gap-2 text-xs text-gray-400">
          <Circle className="w-2 h-2 fill-green-400 text-green-400 animate-pulse" />
          <span>Models: Online</span>
        </div>
        <p className="text-xs text-gray-500 mt-2">Local Processing Active</p>
      </div>
    </div>
  );
}