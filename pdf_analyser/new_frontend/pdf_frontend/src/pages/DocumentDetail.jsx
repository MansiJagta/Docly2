import { useState, useEffect } from "react";
import { useParams, Link, Navigate } from "react-router-dom";
import { FileText, ArrowLeft, ShieldCheck, Zap, Maximize2, Download, User } from "lucide-react";
import Button from "../components/Button";
import ChatInterface from "../components/ChatInterface";
import { getDocument } from "../data/mock";
import { motion, AnimatePresence } from "framer-motion";
import { jsPDF } from "jspdf";

const PERSONAS = [
    { id: 'executive', name: 'Executive', icon: '👔' },
    { id: 'technical', name: 'Technical', icon: '🛠️' },
    { id: 'academic', name: 'Academic', icon: '🎓' },
    { id: 'creative', name: 'Creative', icon: '🎨' }
];

export default function DocumentDetail() {
    const { id } = useParams();
    const doc = getDocument(id);
    const [showChat, setShowChat] = useState(doc?.status === "processed");
    const [persona, setPersona] = useState(PERSONAS[0]);

    const handleExportSummary = () => {
        const docPDF = new jsPDF();
        docPDF.setFontSize(16);
        docPDF.text(`Executive Summary: ${doc?.name}`, 10, 10);
        docPDF.setFontSize(12);
        docPDF.text(`Persona: ${persona.name}`, 10, 20);
        docPDF.text(doc?.summary || "No summary available.", 10, 30, { maxWidth: 180 });
        docPDF.save(`${doc?.name}_summary.pdf`);
    };

    if (!doc) return <Navigate to="/dashboard" />;

    return (
        <div className="h-[calc(100vh-6rem)] md:h-[calc(100vh-5rem)] flex flex-col w-full max-w-[1600px] mx-auto animate-fade-in">

            {/* Top Navigation Bar */}
            <div className="flex items-center justify-between pb-4 px-2">
                <Link to="/dashboard" className="flex items-center text-sm text-slate-400 hover:text-white transition-colors group">
                    <ArrowLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform" />
                    Back to Dashboard
                </Link>
                <div className="flex items-center gap-3">
                    <span className="flex items-center px-3 py-1 bg-[#181b21] rounded-full text-xs text-emerald-400 border border-white/5">
                        <ShieldCheck className="w-3 h-3 mr-1.5" /> Secure Session
                    </span>
                    <Link to={`/documents/${id}/ask`}>
                        <Button variant="ghost" size="sm" className="text-slate-400 hover:text-blue-400 hover:bg-blue-500/10">
                            <Maximize2 className="w-4 h-4 mr-2" /> Start Analysis
                        </Button>
                    </Link>
                </div>
            </div>

            <div className="flex-1 grid lg:grid-cols-12 gap-6 min-h-0">

                {/* LEFT PANEL: Document Summary */}
                <div className="lg:col-span-5 flex flex-col gap-6 overflow-y-auto pr-2 custom-scrollbar">

                    {/* Header Info */}
                    <div className="bg-[#181b21] border border-white/5 rounded-2xl p-6">
                        <div className="flex items-center gap-4 mb-6">
                            <div className="w-12 h-12 rounded-xl bg-[#22262e] flex items-center justify-center text-white border border-white/5">
                                <FileText className="w-6 h-6" />
                            </div>
                            <div>
                                <h1 className="text-xl font-bold text-white leading-tight">{doc.name}</h1>
                                <p className="text-xs text-slate-500 mt-1">{doc.date} • {doc.size}</p>
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
                                <span className="text-white text-sm font-medium">4,521</span>
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
                                    onClick={handleExportSummary}
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
                                {doc.summary || "The document highlights a significant 14% revenue increase in the enterprise sector..."}
                            </p>

                            <div>
                                <h4 className="font-semibold text-white mb-2">Detailed Points</h4>
                                <ul className="list-disc pl-4 space-y-2 marker:text-slate-600">
                                    <li>Operational overhead was reduced by implementing automation.</li>
                                    <li>New compliance standards (ISO 27001) are mandatory for Q4.</li>
                                    <li>Risks identified in the supply chain logistics module.</li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>

                {/* RIGHT PANEL: Chat */}
                <div className="lg:col-span-7 h-full flex flex-col">
                    <ChatInterface docName={doc.name} selectedPersona={persona} />
                </div>

            </div>
        </div>
    );
}
