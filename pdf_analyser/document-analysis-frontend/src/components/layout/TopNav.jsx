import React from 'react';
import { Search } from 'lucide-react';
import Badge from '../ui/Badge';

export default function TopNav({ modelStatus = true }) {
  return (
    <div className="bg-slate-900/30 border-b border-white/10 px-6 py-4 flex items-center justify-between">
      {/* Search Bar */}
      <div className="flex-1 max-w-xl">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search documents..."
            className="w-full bg-white/5 border border-white/10 rounded-lg pl-10 pr-4 py-2 text-gray-300 placeholder-gray-500 focus:border-cyan-500/50 transition-colors"
          />
        </div>
      </div>
      
      {/* System Health */}
      <div className="flex items-center gap-4">
        <Badge variant={modelStatus ? 'green' : 'yellow'}>
          {modelStatus ? '✓ Models Ready' : '⏳ Loading Models...'}
        </Badge>
        <div className="flex items-center gap-2 text-sm text-gray-400">
          <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
          <span>Local</span>
        </div>
      </div>
    </div>
  );
}