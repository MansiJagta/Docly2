import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Upload, Send, FileText, CheckCircle, Search, Settings } from 'lucide-react';

const Analysis = () => {
    const [messages, setMessages] = useState([
        { type: 'bot', text: 'Hello! Upload a PDF to get started with AI-powered analysis. I can provide summaries, answer questions, and extract insights based on your selected persona.' }
    ]);
    const [input, setInput] = useState('');
    const [file, setFile] = useState(null);

    const handleSend = () => {
        if (!input.trim()) return;
        setMessages([...messages, { type: 'user', text: input }]);
        setInput('');
        setTimeout(() => {
            setMessages(prev => [...prev, { type: 'bot', text: 'Please upload a document first so I can analyze it.' }]);
        }, 1000);
    };

    const handleFileUpload = (e) => {
        const uploaded = e.target.files?.[0]; // Mock upload
        if (uploaded) {
            setFile(uploaded);
            setMessages(prev => [...prev, { type: 'bot', text: `Analyzing ${uploaded.name}... Ready for questions.` }]);
        }
    };

    return (
        <div className="flex h-screen pt-4 pb-4 pr-4 pl-20 md:pl-64 gap-4 overflow-hidden absolute inset-0 pointer-events-none">
            {/* Note: Sidebar padding handled by Layout usually, but we need absolute positioning for the split pane to work well with 3D bg */}

            {/* Left Panel: Upload / Workspace */}
            <div className="flex-1 bg-black/40 backdrop-blur-xl border border-white/10 rounded-3xl flex flex-col pointer-events-auto overflow-hidden">
                {/* Header */}
                <div className="p-4 border-b border-white/10 flex justify-between items-center">
                    <div className="flex items-center gap-2">
                        <div className="bg-primary p-2 rounded-lg"><FileText size={18} className="text-white" /></div>
                        <div>
                            <h2 className="font-bold text-white">Workspace</h2>
                            <p className="text-xs text-green-400 flex items-center gap-1"><span className="w-2 h-2 bg-green-500 rounded-full"></span> 100% Local</p>
                        </div>
                    </div>
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={14} />
                        <input type="text" placeholder="Search documents..." className="bg-black/20 border border-white/5 rounded-lg pl-9 pr-3 py-1.5 text-sm text-white focus:outline-none" />
                    </div>
                </div>

                {/* Main Upload Area */}
                <div className="flex-1 flex flex-col items-center justify-center p-8 relative">
                    {!file ? (
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            className="w-full max-w-md aspect-[4/3] border-2 border-dashed border-white/10 rounded-2xl flex flex-col items-center justify-center hover:bg-white/5 transition-colors cursor-pointer relative group"
                        >
                            <input type="file" className="absolute inset-0 opacity-0 cursor-pointer" onChange={handleFileUpload} />
                            <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-6 text-primary group-hover:scale-110 transition-transform">
                                <Upload size={32} />
                            </div>
                            <h3 className="text-xl font-bold mb-2">Drag & Drop PDF</h3>
                            <p className="text-gray-400 mb-6">or click to browse</p>
                            <span className="px-4 py-2 bg-white/10 rounded-lg text-sm font-medium hover:bg-white/20 transition-colors">Select File</span>
                        </motion.div>
                    ) : (
                        <div className="text-center">
                            <CheckCircle size={64} className="text-green-500 mx-auto mb-4" />
                            <h3 className="text-2xl font-bold">{file.name}</h3>
                            <p className="text-gray-400">Analysis Active</p>
                        </div>
                    )}
                </div>
            </div>

            {/* Right Panel: Chat / Q&A */}
            <div className="w-full md:w-[450px] bg-black/40 backdrop-blur-xl border border-white/10 rounded-3xl flex flex-col pointer-events-auto overflow-hidden">
                <div className="p-4 border-b border-white/10 bg-yellow-500/10 border-l-4 border-l-yellow-500 flex items-center gap-3">
                    <div className="text-yellow-500"><Settings size={16} /></div>
                    <span className="text-sm text-yellow-500 font-medium">Upload a PDF to enable Q&A</span>
                </div>

                <div className="flex-1 p-4 space-y-4 overflow-y-auto">
                    {messages.map((msg, i) => (
                        <motion.div
                            key={i}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className={`flex gap-3 ${msg.type === 'user' ? 'flex-row-reverse' : ''}`}
                        >
                            <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${msg.type === 'bot' ? 'bg-gradient-to-br from-primary to-accent' : 'bg-gray-700'}`}>
                                {msg.type === 'bot' ? <FileText size={14} /> : <div className="w-2 h-2 bg-white rounded-full" />}
                            </div>
                            <div className={`p-3 rounded-2xl max-w-[80%] text-sm ${msg.type === 'bot' ? 'bg-white/10 text-gray-200 rounded-tl-none' : 'bg-primary text-white rounded-tr-none'}`}>
                                {msg.text}
                            </div>
                        </motion.div>
                    ))}
                </div>

                <div className="p-4 border-t border-white/10">
                    <div className="relative">
                        <input
                            type="text"
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                            placeholder="Ask anything about this PDF..."
                            className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-4 pr-12 text-white focus:outline-none focus:border-primary/50 transition-colors"
                        />
                        <button
                            onClick={handleSend}
                            className="absolute right-2 top-1/2 -translate-y-1/2 p-2 bg-primary text-white rounded-lg hover:bg-primary/80 transition-colors"
                        >
                            <Send size={16} />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Analysis;
