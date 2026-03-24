import React from 'react';
import { motion } from 'framer-motion';
import { Play, Pause, RefreshCw, X } from 'lucide-react';

const queueItems = [
    { id: 1, name: 'Invoice_Jun.pdf', status: 'Processing', progress: 45 },
    { id: 2, name: 'Invoice_Jul.pdf', status: 'Pending', progress: 0 },
    { id: 3, name: 'Invoice_Aug.pdf', status: 'Pending', progress: 0 },
    { id: 4, name: 'Contract_2024.pdf', status: 'Pending', progress: 0 },
];

const Batch = () => {
    return (
        <div className="p-8 md:p-12 relative z-10 h-full flex flex-col items-end">

            <div className="w-full max-w-md bg-black/30 backdrop-blur-xl border border-white/10 rounded-2xl overflow-hidden shadow-2xl">
                <div className="p-6 border-b border-white/5 flex justify-between items-center">
                    <div>
                        <h2 className="text-xl font-bold">Batch Processor</h2>
                        <p className="text-xs text-gray-400">Automated Pipeline Active</p>
                    </div>
                    <div className="flex gap-2">
                        <button className="p-2 bg-primary/20 text-primary rounded-lg hover:bg-primary/30 transition-colors">
                            <Play size={16} />
                        </button>
                        <button className="p-2 bg-white/5 text-gray-400 rounded-lg hover:bg-white/10 transition-colors">
                            <RefreshCw size={16} />
                        </button>
                    </div>
                </div>

                <div className="p-4 space-y-3">
                    {queueItems.map((item) => (
                        <div key={item.id} className="bg-white/5 rounded-lg p-3 flex items-center justify-between group hover:bg-white/10 transition-colors">
                            <div className="flex-1">
                                <div className="flex justify-between mb-1">
                                    <span className="text-sm font-medium">{item.name}</span>
                                    <span className="text-xs text-accent">{item.status}</span>
                                </div>
                                <div className="h-1.5 bg-gray-800 rounded-full overflow-hidden">
                                    <div
                                        className="h-full bg-accent"
                                        style={{ width: `${item.progress}%` }}
                                    />
                                </div>
                            </div>
                            <button className="ml-3 text-gray-500 hover:text-red-400">
                                <X size={16} />
                            </button>
                        </div>
                    ))}
                </div>

                <div className="p-4 bg-white/5 text-center text-xs text-gray-500 cursor-pointer hover:bg-white/10 transition-colors">
                    + Add Files to Queue
                </div>
            </div>

        </div>
    );
};

export default Batch;
