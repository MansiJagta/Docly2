import { useState, useRef, useEffect } from "react";
import { useParams, Link, Navigate } from "react-router-dom";
import { Send, User, Bot, ArrowLeft } from "lucide-react";
import { jsPDF } from "jspdf";
import Button from "../components/Button";
import { cn } from "../utils/cn";
import { getDocument } from "../data/mock";

const PERSONAS = [
    { id: 'executive', name: 'Executive', icon: '👔' },
    { id: 'technical', name: 'Technical', icon: '🛠️' },
    { id: 'academic', name: 'Academic', icon: '🎓' },
    { id: 'creative', name: 'Creative', icon: '🎨' }
];

// Chat Message Component
function ChatMessage({ message }) {
    const isAI = message.role === "ai";

    return (
        <div className={cn("flex w-full mb-6", isAI ? "justify-start" : "justify-end")}>
            <div className={cn(
                "flex max-w-[80%] md:max-w-[70%]",
                isAI ? "flex-row" : "flex-row-reverse"
            )}>
                {/* Avocado/Icon */}
                <div className={cn(
                    "flex-shrink-0 w-8 h-8 rounded-lg flex items-center justify-center mt-1",
                    isAI ? "bg-primary/20 mr-3" : "bg-accent/20 ml-3"
                )}>
                    {isAI ? <Bot className="w-5 h-5 text-primary" /> : <User className="w-5 h-5 text-accent" />}
                </div>

                {/* Bubble */}
                <div className={cn(
                    "p-4 rounded-2xl text-sm leading-relaxed shadow-sm",
                    isAI
                        ? "bg-surface border border-surface-hover text-text-muted rounded-tl-none"
                        : "bg-gradient-to-br from-primary to-accent text-white rounded-tr-none"
                )}>
                    {message.content}
                </div>
            </div>
        </div>
    );
}

export default function AskQuestion() {
    const { id } = useParams();
    // If no ID, use a generic "General Assistant" doc context
    const doc = id ? getDocument(id) : { name: "General Assistant", id: "general", chatHistory: [] };

    const [input, setInput] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [persona, setPersona] = useState(PERSONAS[0]);
    const messagesEndRef = useRef(null);

    const handleExportPDF = () => {
        const docPDF = new jsPDF();
        docPDF.setFontSize(16);
        docPDF.text(`Summary Report for ${doc?.name}`, 10, 10);
        docPDF.setFontSize(12);
        docPDF.text(`Persona: ${persona.name}`, 10, 20);

        let y = 30;
        messages.forEach((msg, i) => {
            const role = msg.role === 'ai' ? 'AI' : 'User';
            const text = `${role}: ${msg.content}`;
            const splitText = docPDF.splitTextToSize(text, 180);
            docPDF.text(splitText, 10, y);
            y += (splitText.length * 7) + 5;
        });

        docPDF.save(`${doc?.name}_summary.pdf`);
    };

    // Use mock history or default
    const [messages, setMessages] = useState(() => {
        if (doc?.chatHistory?.length) return doc.chatHistory;
        return [{ id: 1, role: "ai", content: `Hello! I am ready to assist you as a **${persona.name}** expert. Ask me anything about ${doc?.name === 'General Assistant' ? 'your tasks' : doc?.name}.` }];
    });

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    // if (!doc) return <Navigate to="/dashboard" />; // Removed redirect to allow general chat

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!input.trim() || isLoading) return;

        const userMsg = { id: Date.now(), role: "user", content: input };
        setMessages(prev => [...prev, userMsg]);
        setInput("");
        setIsLoading(true);

        // Mock AI Response
        setTimeout(() => {
            const aiMsg = {
                id: Date.now() + 1,
                role: "ai",
                content: `[${persona.name} Perspective]: Based on your query about ${doc.name}, here is a tailored response. In a real application, I would use the ${persona.name} system prompt to analyze the vector embeddings.`
            };
            setMessages(prev => [...prev, aiMsg]);
            setIsLoading(false);
        }, 1500);
    };

    return (
        <div className="flex flex-col h-[calc(100vh-140px)] animate-fade-in">
            {/* Header */}
            <div className="flex items-center justify-between pb-4 border-b border-surface/50 mb-4 px-4 pt-4">
                <div className="flex items-center">
                    <Link to={id ? `/documents/${id}` : "/dashboard"} className="mr-4 text-text-muted hover:text-white">
                        <ArrowLeft className="w-5 h-5" />
                    </Link>
                    <div>
                        <h1 className="text-xl font-bold text-white flex items-center gap-2">
                            {doc.name}
                            <span className="text-xs bg-blue-500/20 text-blue-400 px-2 py-0.5 rounded-full border border-blue-500/30">
                                {persona.name}
                            </span>
                        </h1>
                        <p className="text-xs text-text-muted">AI Analysis Mode</p>
                    </div>
                </div>

                <div className="flex items-center gap-3">
                    {/* Persona Selector */}
                    <select
                        className="bg-surface/50 border border-white/10 text-xs text-white rounded-lg px-2 py-1.5 focus:outline-none focus:border-blue-500"
                        value={persona.id}
                        onChange={(e) => {
                            const p = PERSONAS.find(p => p.id === e.target.value);
                            setPersona(p);
                            // Optional: Reset chat or announce persona change
                        }}
                    >
                        {PERSONAS.map(p => (
                            <option key={p.id} value={p.id}>{p.icon} {p.name}</option>
                        ))}
                    </select>

                    <Button variant="outline" size="sm" onClick={handleExportPDF} className="hidden md:flex">
                        Export PDF
                    </Button>
                    <Button variant="ghost" size="sm" onClick={() => setMessages([])} className="text-slate-400">
                        Clear
                    </Button>
                </div>
            </div>

            {/* Messages Area */}
            <div className="flex-grow overflow-y-auto custom-scrollbar pr-2 py-2">
                {messages.map((msg) => (
                    <ChatMessage key={msg.id} message={msg} />
                ))}
                {isLoading && (
                    <div className="flex w-full mb-6 justify-start">
                        <div className="flex max-w-[80%] flex-row">
                            <div className="flex-shrink-0 w-8 h-8 rounded-lg bg-primary/20 mr-3 flex items-center justify-center mt-1">
                                <Bot className="w-5 h-5 text-primary" />
                            </div>
                            <div className="p-4 rounded-2xl bg-surface border border-surface-hover rounded-tl-none flex items-center space-x-2">
                                <div className="w-2 h-2 bg-text-muted/50 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                                <div className="w-2 h-2 bg-text-muted/50 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                                <div className="w-2 h-2 bg-text-muted/50 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                            </div>
                        </div>
                    </div>
                )}
                <div ref={messagesEndRef} />
            </div>

            {/* Input Area */}
            <div className="pt-4 border-t border-surface/50 mt-2">
                <form onSubmit={handleSubmit} className="relative">
                    <input
                        type="text"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        placeholder="Ask a question about this document..."
                        className="w-full bg-surface/50 border border-surface-hover focus:border-accent text-white rounded-xl pl-4 pr-12 py-3.5 shadow-sm transition-all focus:ring-1 focus:ring-accent/50 focus:outline-none"
                        disabled={isLoading}
                    />
                    <button
                        type="submit"
                        disabled={!input.trim() || isLoading}
                        className="absolute right-2 top-2 p-1.5 bg-gradient-to-r from-primary to-accent rounded-lg text-white hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed transition-opacity"
                    >
                        <Send className="w-4 h-4" />
                    </button>
                </form>
            </div>
        </div>
    );
}
