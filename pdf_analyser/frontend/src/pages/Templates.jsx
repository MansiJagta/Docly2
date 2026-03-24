import React from 'react';
import { motion } from 'framer-motion';
import { Layout, FileText, Briefcase, GraduationCap } from 'lucide-react';

const templates = [
    { title: 'Invoice Standard', category: 'Finance', icon: FileText, color: 'text-blue-400' },
    { title: 'Project Proposal', category: 'Business', icon: Briefcase, color: 'text-purple-400' },
    { title: 'Academic Paper', category: 'Education', icon: GraduationCap, color: 'text-green-400' },
    { title: 'Resume Modern', category: 'Personal', icon: Layout, color: 'text-pink-400' },
];

const Templates = () => {
    return (
        <div className="p-8 md:p-12 relative z-10 h-full overflow-y-auto">
            <h1 className="text-4xl font-bold mb-8">Templates</h1>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {templates.map((template, i) => (
                    <motion.div
                        key={i}
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: i * 0.1 }}
                        className="p-6 bg-white/5 backdrop-blur-lg border border-white/10 rounded-2xl hover:bg-white/10 transition-all cursor-pointer group"
                    >
                        <div className={`w-12 h-12 rounded-xl bg-white/5 flex items-center justify-center mb-4 ${template.color} group-hover:scale-110 transition-transform`}>
                            <template.icon size={24} />
                        </div>
                        <h3 className="text-lg font-bold mb-1">{template.title}</h3>
                        <p className="text-sm text-gray-400">{template.category}</p>
                    </motion.div>
                ))}

                {/* Add New Placeholder */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.4 }}
                    className="p-6 border border-dashed border-white/20 rounded-2xl flex flex-col items-center justify-center text-gray-500 hover:text-white hover:border-white/50 transition-all cursor-pointer min-h-[160px]"
                >
                    <div className="text-4xl mb-2">+</div>
                    <span className="text-sm font-medium">Create New</span>
                </motion.div>
            </div>
        </div>
    );
};

export default Templates;
