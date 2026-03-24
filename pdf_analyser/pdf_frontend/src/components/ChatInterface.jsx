import { useState, useRef, useEffect } from "react";
import { Send, Bot, User, Sparkles, RefreshCw, Download } from "lucide-react";
import { cn } from "../utils/cn";
import { motion, AnimatePresence } from "framer-motion";
import { jsPDF } from "jspdf";

const PERSONAS = [
    { id: 'executive', name: 'Executive', icon: '👔' },
    { id: 'technical', name: 'Technical', icon: '🛠️' },
    { id: 'academic', name: 'Academic', icon: '🎓' },
    { id: 'creative', name: 'Creative', icon: '🎨' }
];

export default function ChatInterface({ docName, selectedPersona }) {
    const [messages, setMessages] = useState([
        { id: 1, role: "ai", content: `Hello! I'm ready to answer questions about **${docName}**.` }
    ]);
    const [input, setInput] = useState("");
    const [isTyping, setIsTyping] = useState(false);
    // Use prop persona if provided, otherwise default locally (for standalone usage)
    const [localPersona, setLocalPersona] = useState(PERSONAS[0]);
    const activePersona = selectedPersona || localPersona;

    const scrollRef = useRef(null);

    const handleExportPDF = () => {
        const docPDF = new jsPDF();
        docPDF.setFontSize(16);
        docPDF.text(`Summary Report for ${docName}`, 10, 10);
        docPDF.setFontSize(12);
        docPDF.text(`Persona: ${activePersona.name}`, 10, 20);

        let y = 30;
        messages.forEach((msg, i) => {
            const role = msg.role === 'ai' ? 'AI' : 'User';
            const text = `${role}: ${msg.content}`;
            const splitText = docPDF.splitTextToSize(text, 180);
            docPDF.text(splitText, 10, y);
            y += (splitText.length * 7) + 5;
        });

        docPDF.save(`${docName}_chat_export.pdf`);
    };

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [messages, isTyping]);

    const handleSend = async (e) => {
        e.preventDefault();
        if (!input.trim()) return;

        const userMsg = { id: Date.now(), role: "user", content: input };
        setMessages(prev => [...prev, userMsg]);
        setInput("");
        setIsTyping(true);

        setTimeout(() => {
            const aiMsg = {
                id: Date.now() + 1,
                role: "ai",
                content: "Here is the insight you requested. In a real scenario, this would be retrieved from the vector database based on your query context."
            };
            setMessages(prev => [...prev, aiMsg]);
            setIsTyping(false);
        }, 1200);
    };

    return (
        <div className="flex flex-col h-full cyber-card overflow-hidden shadow-2xl relative">

            {/* Chat Header */}
            <div className="p-4 border-b border-white/10 bg-[#0F172A]/80 backdrop-blur-md flex items-center justify-between z-10">
                <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 rounded-lg bg-blue-500/10 border border-blue-500/20 flex items-center justify-center shadow-[0_0_10px_rgba(59,130,246,0.2)]">
                        <Bot className="w-4 h-4 text-blue-400" />
                    </div>
                    <div>
                        <h3 className="font-bold text-white text-sm">Assistant</h3>
                        <p className="text-[10px] text-emerald-400 font-medium">Online</p>
                    </div>
                </div>
                <div className="flex items-center gap-2">
                    {/* Only show internal controls if not controlled externally */}
                    {!selectedPersona && (
                        <>
                            <div className="relative group">
                                <select
                                    className="bg-black/40 border border-white/10 text-[10px] text-white rounded-lg px-2 py-1 focus:outline-none focus:border-blue-500 appearance-none pr-6 cursor-pointer hover:bg-white/5 transition-colors"
                                    value={activePersona.id}
                                    onChange={(e) => setLocalPersona(PERSONAS.find(p => p.id === e.target.value))}
                                >
                                    {PERSONAS.map(p => (
                                        <option key={p.id} value={p.id}>{p.icon} {p.name}</option>
                                    ))}
                                </select>
                                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-white/50">
                                    <svg className="fill-current h-3 w-3" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" /></svg>
                                </div>
                            </div>
                            <button onClick={handleExportPDF} className="group/btn p-1.5 hover:bg-white/10 rounded-lg transition-colors" title="Export PDF">
                                <Download className="w-4 h-4 text-slate-500 group-hover/btn:text-blue-400" />
                            </button>
                        </>
                    )}
                    <button onClick={() => setMessages([])} className="group/btn p-1.5 hover:bg-white/10 rounded-lg transition-colors" title="Clear Chat">
                        <RefreshCw className="w-4 h-4 text-slate-500 group-hover/btn:text-red-400" />
                    </button>
                </div>
            </div>

            {/* Messages */}
            <div
                ref={scrollRef}
                className="flex-1 overflow-y-auto p-6 space-y-6 scroll-smooth bg-opacity-5"
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
                                    <p>{msg.content}</p>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </AnimatePresence>

                {isTyping && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} class="flex gap-3">
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
                            placeholder="Ask something..."
                            className="flex-1 bg-transparent text-white pl-4 pr-12 py-4 focus:outline-none placeholder:text-slate-600"
                        />
                        <div className="pr-2">
                            <button
                                type="submit"
                                disabled={!input.trim()}
                                className="p-2 bg-white/5 hover:bg-white text-slate-400 hover:text-black rounded-lg transition-all disabled:opacity-30 disabled:hover:bg-transparent disabled:hover:text-slate-400"
                            >
                                <Send className="w-4 h-4" />
                            </button>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    );
}
