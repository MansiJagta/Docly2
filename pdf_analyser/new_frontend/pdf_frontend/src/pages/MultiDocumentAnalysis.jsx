import { useState, useRef, useEffect } from "react";
import { useLocation, Link } from "react-router-dom";
import { FileText, ArrowLeft, Send, Bot, User, Sparkles, RefreshCw, Download, ChevronDown, Zap } from "lucide-react";
import { cn } from "../utils/cn";
import { motion, AnimatePresence } from "framer-motion";
import { jsPDF } from "jspdf";

const PERSONAS = [
    { id: 'executive', name: 'Executive', icon: '👔' },
    { id: 'technical', name: 'Technical', icon: '🛠️' },
    { id: 'academic', name: 'Academic', icon: '🎓' },
    { id: 'creative', name: 'Creative', icon: '🎨' }
];

export default function MultiDocumentAnalysis() {
    const location = useLocation();
    
    // Get files from location state, or use empty array as fallback
    const uploadedFiles = location.state?.files || [];
    const [selectedDocIndex, setSelectedDocIndex] = useState(0);
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState("");
    const [isTyping, setIsTyping] = useState(false);
    const [persona, setPersona] = useState(PERSONAS[0]);
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const scrollRef = useRef(null);
    const dropdownRef = useRef(null);

    const selectedDoc = uploadedFiles[selectedDocIndex];

    // Initialize with welcome message
    useEffect(() => {
        if (uploadedFiles.length > 0 && messages.length === 0) {
            const welcomeMsg = {
                id: Date.now(),
                role: "ai",
                content: `Hello! I'm ready to answer questions about your ${uploadedFiles.length} uploaded document${uploadedFiles.length > 1 ? 's' : ''}. Select a document from the dropdown to ask questions about it.`
            };
            setMessages([welcomeMsg]);
        }
    }, [uploadedFiles.length]);

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsDropdownOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [messages, isTyping]);

    const handleSend = async (e) => {
        e.preventDefault();
        if (!input.trim() || !selectedDoc) return;

        const userMsg = { 
            id: Date.now(), 
            role: "user", 
            content: input,
            documentName: selectedDoc.name
        };
        setMessages(prev => [...prev, userMsg]);
        setInput("");
        setIsTyping(true);

        setTimeout(() => {
            const aiMsg = {
                id: Date.now() + 1,
                role: "ai",
                content: `Based on **${selectedDoc.name}**, here is the insight you requested. In a real scenario, this would be retrieved from the vector database based on your query context for this specific document.`,
                documentName: selectedDoc.name
            };
            setMessages(prev => [...prev, aiMsg]);
            setIsTyping(false);
        }, 1200);
    };

    const handleExportPDF = () => {
        const docPDF = new jsPDF();
        docPDF.setFontSize(16);
        docPDF.text(`Multi-Document Analysis Report`, 10, 10);
        docPDF.setFontSize(12);
        docPDF.text(`Persona: ${persona.name}`, 10, 20);
        docPDF.text(`Documents: ${uploadedFiles.map(f => f.name).join(', ')}`, 10, 30, { maxWidth: 180 });

        let y = 45;
        messages.forEach((msg) => {
            const role = msg.role === 'ai' ? 'AI' : 'User';
            const docInfo = msg.documentName ? ` [${msg.documentName}]` : '';
            const text = `${role}${docInfo}: ${msg.content}`;
            const splitText = docPDF.splitTextToSize(text, 180);
            docPDF.text(splitText, 10, y);
            y += (splitText.length * 7) + 5;
        });

        docPDF.save(`multi_document_analysis.pdf`);
    };

    if (uploadedFiles.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-4">
                <p className="text-slate-400">No documents uploaded.</p>
                <Link to="/upload">
                    <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-500">
                        Go to Upload
                    </button>
                </Link>
            </div>
        );
    }

    return (
        <div className="h-[calc(100vh-6rem)] md:h-[calc(100vh-5rem)] flex flex-col w-full max-w-[1600px] mx-auto animate-fade-in">
            {/* Top Navigation Bar */}
            <div className="flex items-center justify-between pb-4 px-2">
                <Link to="/upload" className="flex items-center text-sm text-slate-400 hover:text-white transition-colors group">
                    <ArrowLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform" />
                    Back to Upload
                </Link>
            </div>

            <div className="flex-1 grid lg:grid-cols-12 gap-6 min-h-0">
                {/* LEFT PANEL: Document Summary */}
                <div className="lg:col-span-5 flex flex-col gap-6 overflow-y-auto pr-2 custom-scrollbar">
                    {/* Document Selector Dropdown */}
                    <div className="bg-[#181b21] border border-white/5 rounded-2xl p-4">
                        <div className="relative" ref={dropdownRef}>
                            <button
                                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                                className="w-full flex items-center justify-between p-3 bg-black/40 border border-white/10 rounded-xl text-white hover:bg-white/5 transition-colors"
                            >
                                <div className="flex items-center space-x-3">
                                    <FileText className="w-4 h-4 text-blue-400" />
                                    <span className="text-sm font-medium truncate">
                                        {selectedDoc ? selectedDoc.name : 'Select a document'}
                                    </span>
                                </div>
                                <ChevronDown className={cn("w-4 h-4 transition-transform", isDropdownOpen && "rotate-180")} />
                            </button>

                            <AnimatePresence>
                                {isDropdownOpen && (
                                    <motion.div
                                        initial={{ opacity: 0, y: -10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: -10 }}
                                        className="absolute z-50 w-full mt-2 bg-[#22262e] border border-white/10 rounded-xl shadow-2xl overflow-hidden"
                                    >
                                        {uploadedFiles.map((file, index) => (
                                            <button
                                                key={`${file.name}-${index}`}
                                                onClick={() => {
                                                    setSelectedDocIndex(index);
                                                    setIsDropdownOpen(false);
                                                }}
                                                className={cn(
                                                    "w-full flex items-center space-x-3 p-3 text-left hover:bg-white/5 transition-colors",
                                                    index === selectedDocIndex && "bg-blue-500/10 border-l-2 border-blue-500"
                                                )}
                                            >
                                                <FileText className="w-4 h-4 text-blue-400 flex-shrink-0" />
                                                <div className="flex-1 min-w-0">
                                                    <p className="text-sm font-medium text-white truncate">{file.name}</p>
                                                    <p className="text-xs text-slate-500">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
                                                </div>
                                                {index === selectedDocIndex && (
                                                    <div className="w-2 h-2 rounded-full bg-blue-400 flex-shrink-0" />
                                                )}
                                            </button>
                                        ))}
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                    </div>

                    {/* Header Info */}
                    {selectedDoc && (
                        <>
                            <div className="bg-[#181b21] border border-white/5 rounded-2xl p-6">
                                <div className="flex items-center gap-4 mb-6">
                                    <div className="w-12 h-12 rounded-xl bg-[#22262e] flex items-center justify-center text-white border border-white/5">
                                        <FileText className="w-6 h-6" />
                                    </div>
                                    <div>
                                        <h1 className="text-xl font-bold text-white leading-tight">{selectedDoc.name}</h1>
                                        <p className="text-xs text-slate-500 mt-1">
                                            {(selectedDoc.size / 1024 / 1024).toFixed(2)} MB • {new Date().toLocaleDateString()}
                                        </p>
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-3">
                                    <div className="p-3 bg-white/5 rounded-lg border border-white/5">
                                        <span className="text-xs text-slate-500 block mb-1">Status</span>
                                        <span className="text-emerald-400 text-sm font-medium flex items-center">
                                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 mr-2" /> Ready
                                        </span>
                                    </div>
                                    <div className="p-3 bg-white/5 rounded-lg border border-white/5">
                                        <span className="text-xs text-slate-500 block mb-1">Tokens</span>
                                        <span className="text-white text-sm font-medium">
                                            {Math.floor(selectedDoc.size / 1024 * 2.5).toLocaleString()}
                                        </span>
                                    </div>
                                </div>
                            </div>

                            {/* AI Summary */}
                            <div className="bg-[#181b21] border border-white/5 rounded-2xl flex-1 flex flex-col overflow-hidden relative">
                                <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-cyan-400 to-indigo-500" />

                                <div className="p-4 border-b border-white/5 bg-[#22262e] flex items-center justify-between">
                                    <h3 className="font-bold text-white text-sm flex items-center">
                                        <Zap className="w-4 h-4 text-cyan-400 mr-2" /> AI Executive Summary
                                    </h3>
                                    <div className="flex items-center gap-2">
                                        {/* Visible Persona Selector */}
                                        <div className="relative">
                                            <select
                                                className="bg-white text-black text-xs font-semibold rounded-lg pl-8 pr-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none cursor-pointer shadow-lg"
                                                value={persona.id}
                                                onChange={(e) => setPersona(PERSONAS.find(p => p.id === e.target.value))}
                                            >
                                                {PERSONAS.map(p => (
                                                    <option key={p.id} value={p.id}>{p.name}</option>
                                                ))}
                                            </select>
                                            <User className="absolute left-2 top-1.5 w-3.5 h-3.5 text-black/70 pointer-events-none" />
                                        </div>
                                        <button
                                            onClick={handleExportPDF}
                                            className="p-1.5 bg-white/10 hover:bg-white/20 text-white rounded-lg transition-colors"
                                            title="Export Summary PDF"
                                        >
                                            <Download className="w-4 h-4" />
                                        </button>
                                    </div>
                                </div>

                                <div className="p-6 text-slate-300 space-y-4 text-sm leading-relaxed overflow-y-auto">
                                    <p className="bg-indigo-500/10 p-4 rounded-lg border border-indigo-500/20 text-indigo-200">
                                        <strong className="block text-indigo-400 mb-1 text-xs uppercase tracking-wide">Key Insight</strong>
                                        This document has been processed and is ready for analysis. Key insights will be generated based on the selected persona and document content.
                                    </p>

                                    <div>
                                        <h4 className="font-semibold text-white mb-2">Detailed Points</h4>
                                        <ul className="list-disc pl-4 space-y-2 marker:text-slate-600">
                                            <li>Document has been successfully uploaded and processed.</li>
                                            <li>AI analysis is ready for this document.</li>
                                            <li>You can ask questions about the content using the chat interface.</li>
                                        </ul>
                                    </div>
                                </div>
                            </div>
                        </>
                    )}

                    {!selectedDoc && (
                        <div className="bg-[#181b21] border border-white/5 rounded-2xl p-6 flex items-center justify-center min-h-[200px]">
                            <p className="text-slate-400 text-center">Select a document to view its summary</p>
                        </div>
                    )}
                </div>

                {/* RIGHT PANEL: Chat */}
                <div className="lg:col-span-7 h-full flex flex-col">
                    <div className="flex flex-col h-full cyber-card overflow-hidden shadow-2xl relative">
                        {/* Chat Header */}
                        <div className="p-4 border-b border-white/10 bg-[#0F172A]/80 backdrop-blur-md flex items-center justify-between z-10">
                            <div className="flex items-center space-x-3">
                                <div className="w-8 h-8 rounded-lg bg-blue-500/10 border border-blue-500/20 flex items-center justify-center shadow-[0_0_10px_rgba(59,130,246,0.2)]">
                                    <Bot className="w-4 h-4 text-blue-400" />
                                </div>
                                <div>
                                    <h3 className="font-bold text-white text-sm">
                                        {selectedDoc ? `Analyzing: ${selectedDoc.name}` : 'Select a document'}
                                    </h3>
                                    <p className="text-[10px] text-emerald-400 font-medium">Online</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-2">
                                <div className="relative group">
                                    <select
                                        className="bg-black/40 border border-white/10 text-[10px] text-white rounded-lg px-2 py-1 focus:outline-none focus:border-blue-500 appearance-none pr-6 cursor-pointer hover:bg-white/5 transition-colors"
                                        value={persona.id}
                                        onChange={(e) => setPersona(PERSONAS.find(p => p.id === e.target.value))}
                                    >
                                        {PERSONAS.map(p => (
                                            <option key={p.id} value={p.id}>{p.icon} {p.name}</option>
                                        ))}
                                    </select>
                                </div>
                                <button onClick={handleExportPDF} className="group/btn p-1.5 hover:bg-white/10 rounded-lg transition-colors" title="Export PDF">
                                    <Download className="w-4 h-4 text-slate-500 group-hover/btn:text-blue-400" />
                                </button>
                                <button onClick={() => setMessages([])} className="group/btn p-1.5 hover:bg-white/10 rounded-lg transition-colors" title="Clear Chat">
                                    <RefreshCw className="w-4 h-4 text-slate-500 group-hover/btn:text-red-400" />
                                </button>
                            </div>
                        </div>

                        {/* Messages */}
                        <div
                            ref={scrollRef}
                            className="flex-1 overflow-y-auto p-6 space-y-6 scroll-smooth bg-[url('/noise.png')] bg-opacity-5"
                        >
                            <AnimatePresence initial={false}>
                                {messages.map((msg) => (
                                    <motion.div
                                        key={msg.id}
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        className={cn("flex w-full", msg.role === "ai" ? "justify-start" : "justify-end")}
                                    >
                                        <div className={cn("max-w-[85%]", msg.role === "ai" ? "flex gap-3" : "")}>
                                            {msg.role === "ai" && (
                                                <div className="w-8 h-8 rounded-full bg-[#0F172A] border border-blue-500/20 flex items-center justify-center flex-shrink-0 mt-1 shadow-[0_0_10px_rgba(59,130,246,0.1)]">
                                                    <Sparkles className="w-4 h-4 text-blue-400" />
                                                </div>
                                            )}

                                            <div className={cn(
                                                "p-4 rounded-2xl text-sm leading-relaxed shadow-sm",
                                                msg.role === "ai"
                                                    ? "bg-[#0F172A]/80 border border-white/5 text-slate-200"
                                                    : "bg-gradient-to-br from-blue-600 to-cyan-500 text-white shadow-[0_0_15px_rgba(59,130,246,0.3)]"
                                            )}>
                                                {msg.documentName && (
                                                    <div className="text-xs text-blue-400 mb-1 font-medium">
                                                        📄 {msg.documentName}
                                                    </div>
                                                )}
                                                <p>{msg.content}</p>
                                            </div>
                                        </div>
                                    </motion.div>
                                ))}
                            </AnimatePresence>

                            {isTyping && (
                                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex gap-3">
                                    <div className="w-8 h-8 rounded-full bg-[#22262e] border border-white/5 flex items-center justify-center flex-shrink-0">
                                        <Bot className="w-4 h-4 text-slate-500" />
                                    </div>
                                    <div className="bg-[#22262e] border border-white/5 p-3 rounded-2xl rounded-tl-none flex items-center gap-1">
                                        <span className="w-1.5 h-1.5 bg-slate-500 rounded-full animate-bounce" />
                                        <span className="w-1.5 h-1.5 bg-slate-500 rounded-full animate-bounce delay-100" />
                                        <span className="w-1.5 h-1.5 bg-slate-500 rounded-full animate-bounce delay-200" />
                                    </div>
                                </motion.div>
                            )}
                        </div>

                        {/* Input Area */}
                        <div className="p-5 bg-[#0F172A]/50 border-t border-white/10 backdrop-blur-md">
                            <form onSubmit={handleSend} className="relative group">
                                <div className="relative flex items-center bg-black/40 border border-white/10 rounded-xl overflow-hidden focus-within:ring-1 focus-within:ring-blue-500/50 focus-within:border-blue-500/50 transition-all">
                                    <input
                                        type="text"
                                        value={input}
                                        onChange={(e) => setInput(e.target.value)}
                                        placeholder={selectedDoc ? `Ask about ${selectedDoc.name}...` : "Select a document first..."}
                                        disabled={!selectedDoc}
                                        className="flex-1 bg-transparent text-white pl-4 pr-12 py-4 focus:outline-none placeholder:text-slate-600 disabled:opacity-50"
                                    />
                                    <div className="pr-2">
                                        <button
                                            type="submit"
                                            disabled={!input.trim() || !selectedDoc}
                                            className="p-2 bg-white/5 hover:bg-white text-slate-400 hover:text-black rounded-lg transition-all disabled:opacity-30 disabled:hover:bg-transparent disabled:hover:text-slate-400"
                                        >
                                            <Send className="w-4 h-4" />
                                        </button>
                                    </div>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

