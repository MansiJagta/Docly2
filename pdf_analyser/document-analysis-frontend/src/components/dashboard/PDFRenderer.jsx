import React from 'react';
import { FileText, ZoomIn, ZoomOut, Download } from 'lucide-react';
import Card from '../ui/Card';
import Button from '../ui/Button';

export default function PDFRenderer({ fileName }) {
  return (
    <Card className="h-full flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <FileText className="w-5 h-5 text-cyan-400" />
          <h3 className="text-lg font-semibold text-white truncate">
            {fileName || 'No Document Loaded'}
          </h3>
        </div>
        
        {fileName && (
          <div className="flex items-center gap-2">
            <Button variant="ghost" className="!p-2">
              <ZoomOut className="w-4 h-4" />
            </Button>
            <Button variant="ghost" className="!p-2">
              <ZoomIn className="w-4 h-4" />
            </Button>
            <Button variant="ghost" className="!p-2">
              <Download className="w-4 h-4" />
            </Button>
          </div>
        )}
      </div>
      
      {/* PDF Viewer Placeholder */}
      <div className="bg-slate-950/50 rounded-lg flex-1 flex items-center justify-center border border-white/10">
        {fileName ? (
          <div className="text-center">
            <FileText className="w-16 h-16 text-gray-600 mx-auto mb-4" />
            <p className="text-gray-400">PDF Viewer Integration</p>
            <p className="text-sm text-gray-500 mt-2">
              Implement with PDF.js or similar library
            </p>
          </div>
        ) : (
          <p className="text-gray-500">Upload a PDF to view</p>
        )}
      </div>
    </Card>
  );
}