import React from 'react';
import { motion } from 'framer-motion';
import { Search, MoreVertical } from 'lucide-react';

const files = [
    { name: 'Financial_Report_Q1.pdf', size: '2.4 MB', date: '2 mins ago', type: 'Finance' },
    { name: 'Project_Alpha_Specs.pdf', size: '1.1 MB', date: '1 hour ago', type: 'Technical' },
    { name: 'Client_Meeting_Notes.pdf', size: '0.5 MB', date: '3 hours ago', type: 'Meeting' },
    { name: 'Research_Paper_AI.pdf', size: '4.2 MB', date: 'Yesterday', type: 'Research' },
    { name: 'Invoice_7732.pdf', size: '0.1 MB', date: 'Yesterday', type: 'Finance' },
];

const Library = () => {
    return (
        <div className="p-8 md:p-12 relative z-10 h-full flex flex-col">
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-4xl font-bold text-white">Library</h1>
                    <p className="text-gray-400">Manage your analyzed documents</p>
                </div>

                <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                    <input
                        type="text"
                        placeholder="Search files..."
                        className="pl-10 pr-4 py-2 bg-white/5 border border-white/10 rounded-full text-white focus:outline-none focus:border-primary/50 transition-colors w-64"
                    />
                </div>
            </div>

            {/* File List Overlay */}
            <div className="flex-1 overflow-y-auto pr-2 max-w-2xl bg-black/20 backdrop-blur-md rounded-2xl border border-white/5 p-4">
                <div className="space-y-2">
                    {files.map((file, i) => (
                        <motion.div
                            key={i}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: i * 0.1 }}
                            className="flex items-center justify-between p-4 rounded-xl hover:bg-white/5 transition-colors group cursor-pointer border border-transparent hover:border-white/10"
                        >
                            <div className="flex items-center gap-4">
                                <div className="w-10 h-10 rounded-lg bg-primary/20 flex items-center justify-center text-primary font-bold">
                                    PDF
                                </div>
                                <div>
                                    <h4 className="font-medium text-gray-200 group-hover:text-accent transition-colors">{file.name}</h4>
                                    <div className="flex gap-3 text-xs text-gray-500">
                                        <span>{file.size}</span>
                                        <span>•</span>
                                        <span>{file.date}</span>
                                    </div>
                                </div>
                            </div>

                            <button className="p-2 text-gray-400 hover:text-white rounded-full hover:bg-white/10">
                                <MoreVertical size={20} />
                            </button>
                        </motion.div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Library;
