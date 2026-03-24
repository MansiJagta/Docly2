import React from 'react';
import { FileText, ExternalLink } from 'lucide-react';
import Badge from '../ui/Badge';

export default function SourceCard({ pageNumber, className = '' }) {
  return (
    <div className={`flex items-center justify-between p-2 bg-slate-800/50 rounded border border-white/10 ${className}`}>
      <div className="flex items-center gap-2">
        <FileText className="w-4 h-4 text-cyan-400" />
        <span className="text-xs text-gray-300">Grounded Source</span>
      </div>
      
      <div className="flex items-center gap-2">
        <Badge variant="default">Page {pageNumber}</Badge>
        <button className="text-cyan-400 hover:text-cyan-300 transition-colors">
          <ExternalLink className="w-3 h-3" />
        </button>
      </div>
    </div>
  );
}