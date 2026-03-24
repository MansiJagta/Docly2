import { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { UploadCloud, File, X, AlertCircle, CheckCircle, Zap } from 'lucide-react';
import { cn } from '../utils/cn';
import Button from './Button';
import GlassCard from './GlassCard';
import { motion, AnimatePresence } from 'framer-motion';

export default function UploadDropzone({ onFilesSelected }) {
    const [files, setFiles] = useState([]);
    const [error, setError] = useState(null);

    const onDrop = useCallback((acceptedFiles, rejectedFiles) => {
        if (rejectedFiles.length > 0) {
            setError("Some files were rejected. Please upload only PDF, PNG, or JPG files.");
        } else {
            setError(null);
        }

        setFiles(prev => [...prev, ...acceptedFiles]);
        if (onFilesSelected) {
            onFilesSelected(acceptedFiles);
        }
    }, [onFilesSelected]);

    const removeFile = (fileToRemove) => {
        setFiles(files.filter(file => file !== fileToRemove));
    };

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        accept: {
            'application/pdf': ['.pdf'],
            'image/png': ['.png'],
            'image/jpeg': ['.jpg', '.jpeg']
        }
    });

    return (
        <div className="w-full max-w-2xl mx-auto space-y-8">

            {/* Drop Area */}
            <GlassCard className="p-0 overflow-hidden relative group">
                <div
                    {...getRootProps()}
                    className={cn(
                        "relative p-12 text-center cursor-pointer transition-all duration-300 border-2 border-dashed border-white/10 hover:border-primary/50",
                        isDragActive ? "bg-primary/5 border-primary" : "bg-transparent"
                    )}
                >
                    <input {...getInputProps()} />

                    <div className="absolute inset-0 bg-gradient-to-tr from-primary/5 to-secondary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                    <div className="relative z-10 flex flex-col items-center justify-center space-y-4">
                        <motion.div
                            animate={{ y: isDragActive ? -10 : 0 }}
                            className={cn(
                                "w-20 h-20 rounded-2xl flex items-center justify-center transition-all duration-300 shadow-2xl",
                                isDragActive ? "bg-primary text-white shadow-primary/30" : "bg-surface-glass border border-white/10 text-primary"
                            )}
                        >
                            <UploadCloud className={cn(
                                "w-10 h-10 transition-colors duration-300",
                                isDragActive ? "text-white" : "text-primary"
                            )} />
                        </motion.div>

                        <div className="space-y-2">
                            <p className="text-xl font-heading font-semibold text-white">
                                {isDragActive ? "Drop to upload" : "Click or drag files here"}
                            </p>
                            <p className="text-sm text-text-muted max-w-xs mx-auto">
                                Support for PDF, PNG, and JPG. Max file size 10MB.
                            </p>
                        </div>
                    </div>
                </div>
            </GlassCard>

            {/* Error Message */}
            <AnimatePresence>
                {error && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="flex items-center p-4 text-sm text-error bg-error/10 border border-error/20 rounded-xl"
                    >
                        <AlertCircle className="w-4 h-4 mr-2 flex-shrink-0" />
                        {error}
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Selected Files List */}
            <AnimatePresence>
                {files.length > 0 && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="space-y-4"
                    >
                        <div className="flex items-center justify-between px-2">
                            <h3 className="text-sm font-semibold text-text-muted uppercase tracking-wider">Ready to Process ({files.length})</h3>
                            <Button variant="ghost" size="sm" onClick={(e) => { e.stopPropagation(); setFiles([]); }} className="text-error hover:text-white hover:bg-error/20">Clear All</Button>
                        </div>

                        <div className="space-y-3">
                            {files.map((file, index) => (
                                <motion.div
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: index * 0.1 }}
                                    key={`${file.name}-${index}`}
                                    className="flex items-center justify-between p-4 bg-white/5 border border-white/5 rounded-xl group hover:border-primary/20 transition-all"
                                >
                                    <div className="flex items-center space-x-4 overflow-hidden">
                                        <div className="p-2.5 bg-gradient-to-br from-primary/20 to-secondary/20 rounded-lg text-primary">
                                            <File className="w-5 h-5" />
                                        </div>
                                        <div className="min-w-0">
                                            <p className="text-sm font-medium text-white truncate group-hover:text-primary transition-colors">{file.name}</p>
                                            <p className="text-xs text-text-muted">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center space-x-2">
                                        <span className="w-2 h-2 rounded-full bg-success" />
                                        <button
                                            onClick={(e) => { e.stopPropagation(); removeFile(file); }}
                                            className="p-1.5 text-text-muted hover:text-error hover:bg-error/10 rounded-lg transition-colors"
                                        >
                                            <X className="w-4 h-4" />
                                        </button>
                                    </div>
                                </motion.div>
                            ))}
                        </div>

                        <div className="pt-4 flex justify-end">
                            <Button size="lg" className="w-full sm:w-auto shadow-xl shadow-primary/20" icon={Zap}>
                                Start Analysis
                            </Button>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
