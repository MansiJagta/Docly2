import React, { useState, useRef } from 'react';
import { Upload } from 'lucide-react';
import { motion } from 'framer-motion';
import Card from '../ui/Card';
import Button from '../ui/Button';

export default function FileUploader({ onFileUpload }) {
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef(null);
  
  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };
  
  const handleDragLeave = () => {
    setIsDragging(false);
  };
  
  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    
    const file = e.dataTransfer.files[0];
    if (file && file.type === 'application/pdf') {
      onFileUpload(file);
    } else {
      alert('Please upload a PDF file');
    }
  };
  
  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (file && file.type === 'application/pdf') {
      onFileUpload(file);
    } else {
      alert('Please upload a PDF file');
    }
  };
  
  return (
    <Card className="h-full flex items-center justify-center">
      <motion.div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={`w-full h-64 border-2 border-dashed rounded-xl flex flex-col items-center justify-center gap-4 transition-all ${
          isDragging 
            ? 'border-cyan-500 bg-cyan-500/10 glow-cyan' 
            : 'border-white/20 hover:border-cyan-500/50'
        }`}
      >
        <motion.div
          animate={isDragging ? { scale: 1.1 } : { scale: 1 }}
          transition={{ duration: 0.2 }}
        >
          <Upload className="w-12 h-12 text-cyan-400" />
        </motion.div>
        
        <div className="text-center">
          <p className="text-lg font-medium text-white mb-1">
            {isDragging ? 'Drop PDF Here' : 'Drag & Drop PDF'}
          </p>
          <p className="text-sm text-gray-400">or click to browse</p>
          <p className="text-xs text-gray-500 mt-2">100% Local Processing</p>
        </div>
        
        <input
          ref={fileInputRef}
          type="file"
          accept="application/pdf"
          onChange={handleFileSelect}
          className="hidden"
        />
        
        <Button 
          variant="ghost" 
          onClick={() => fileInputRef.current?.click()}
        >
          Select File
        </Button>
      </motion.div>
    </Card>
  );
}