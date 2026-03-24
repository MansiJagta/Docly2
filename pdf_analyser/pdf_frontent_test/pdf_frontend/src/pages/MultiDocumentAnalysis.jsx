import { useState, useRef, useEffect, useMemo } from "react";
import { useLocation, Link } from "react-router-dom";
import { FileText, ArrowLeft, Send, Bot, User, Sparkles, RefreshCw, Download, ChevronDown, Zap } from "lucide-react";
import { cn } from "../utils/cn";
import { motion, AnimatePresence } from "framer-motion";
import { jsPDF } from "jspdf";
import { askDocument, fetchDocumentSummary, fetchWorkspaceStatus, fetchCombinedSummary } from "../services/backendApi";

const PERSONAS = [
    { id: 'executive', name: 'Executive', icon: '👔' },
    { id: 'technical', name: 'Technical', icon: '🛠️' },
    { id: 'academic', name: 'Academic', icon: '🎓' },
    { id: 'creative', name: 'Creative', icon: '🎨' }
];

const COMBINED_PROCESSING_PLACEHOLDER = "Processing....";

export default function MultiDocumentAnalysis() {
    const location = useLocation();
    const workspaceFromLocation = useMemo(() => {
        if (location.state?.workspace) return location.state.workspace;
        try {
            const raw = localStorage.getItem("activeAnalysisWorkspace");
            return raw ? JSON.parse(raw) : null;
        } catch {
            return null;
        }
    }, [location.state]);

    const [workspaceHistory, setWorkspaceHistory] = useState(() => {
        try {
            const raw = localStorage.getItem("analysisWorkspaceHistory");
            return raw ? JSON.parse(raw) : [];
        } catch {
            return [];
        }
    });
    const [activeWorkspace, setActiveWorkspace] = useState(workspaceFromLocation);
    const uploadedFiles = activeWorkspace?.documents || [];

    const [selectedDocIndex, setSelectedDocIndex] = useState(0);
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState("");
    const [isTyping, setIsTyping] = useState(false);
    const [persona, setPersona] = useState(PERSONAS[0]);
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [summaryByDocId, setSummaryByDocId] = useState({});
    const [summaryLoading, setSummaryLoading] = useState(false);
    const [summaryError, setSummaryError] = useState("");
    const [combinedSummaryText, setCombinedSummaryText] = useState("");
    const [combinedSummaryLoading, setCombinedSummaryLoading] = useState(false);
    const [combinedSummaryError, setCombinedSummaryError] = useState("");
    const scrollRef = useRef(null);
    const dropdownRef = useRef(null);

    const selectedDoc = uploadedFiles[selectedDocIndex];
    const effectiveBackendWorkspaceId =
        activeWorkspace?.backendWorkspaceId || uploadedFiles.find((d) => d?.workspace_id)?.workspace_id || null;

    const persistWorkspaceUpdate = (workspaceId, updater) => {
        if (!workspaceId || typeof updater !== "function") return;

        setWorkspaceHistory((prev) => {
            const next = prev.map((item) => (item?.id === workspaceId ? updater(item) : item));
            localStorage.setItem("analysisWorkspaceHistory", JSON.stringify(next));
            return next;
        });

        const activeRaw = localStorage.getItem("activeAnalysisWorkspace");
        if (activeRaw) {
            try {
                const activeStored = JSON.parse(activeRaw);
                if (activeStored?.id === workspaceId) {
                    const updated = updater(activeStored);
                    localStorage.setItem("activeAnalysisWorkspace", JSON.stringify(updated));
                }
            } catch {
                // Ignore malformed storage payloads.
            }
        }
    };

    async function fetchSummaryWithRetries(docId, activeRef, personaId, options = {}) {
        const maxAttempts = options.maxAttempts ?? 20;
        const waitMs = options.waitMs ?? 3000;
        let attempts = 0;

        while (activeRef() && attempts < maxAttempts) {
            const summaryResponse = await fetchDocumentSummary(docId, personaId);
            const status = summaryResponse?.status || "unknown";

            if (summaryResponse?.summary) {
                return summaryResponse.summary;
            }

            const message = summaryResponse?.message || "No summary available.";
            if (status !== "processing") {
                return message;
            }

            attempts += 1;
            await new Promise((resolve) => setTimeout(resolve, waitMs));
        }

        return "Summary is still generating. Please check again shortly.";
    }

    useEffect(() => {
        if (!workspaceFromLocation) return;
        setActiveWorkspace(workspaceFromLocation);
        localStorage.setItem("activeAnalysisWorkspace", JSON.stringify(workspaceFromLocation));
        setWorkspaceHistory((prev) => {
            const next = [workspaceFromLocation, ...prev.filter((item) => item?.id !== workspaceFromLocation.id)].slice(0, 20);
            localStorage.setItem("analysisWorkspaceHistory", JSON.stringify(next));
            return next;
        });
    }, [workspaceFromLocation]);

    useEffect(() => {
        setSelectedDocIndex(0);
        setSummaryByDocId({});
        setSummaryError("");
        const cached = activeWorkspace?.combinedSummaries?.[persona.id] || "";
        setCombinedSummaryText(cached);
        setCombinedSummaryError("");
    }, [activeWorkspace?.id, persona.id]);

    // Initialize with welcome message
    useEffect(() => {
        if (uploadedFiles.length > 0 && messages.length === 0) {
            const welcomeMsg = {
                id: Date.now(),
                role: "ai",
                content: `Welcome to ${activeWorkspace?.name || "your analysis workspace"}. I can answer questions for any of your ${uploadedFiles.length} document${uploadedFiles.length > 1 ? "s" : ""}. Select one from the dropdown to continue.`,
            };
            setMessages([welcomeMsg]);
        }
    }, [uploadedFiles.length, activeWorkspace?.name]);

    // Load summaries one by one in this single workspace section
    useEffect(() => {
        if (!uploadedFiles.length) return;

        let active = true;
        const isActive = () => active;
        async function loadSummariesSequentially() {
            setSummaryLoading(true);
            setSummaryError("");

            for (const doc of uploadedFiles) {
                if (!active || !doc?.id) continue;
                try {
                    const summaryText = await fetchSummaryWithRetries(doc.id, isActive, persona.id);
                    if (!active) return;
                    setSummaryByDocId((prev) => ({
                        ...prev,
                        [doc.id]: summaryText,
                    }));
                } catch (error) {
                    if (!active) return;
                    setSummaryByDocId((prev) => ({
                        ...prev,
                        [doc.id]: `Summary unavailable: ${error.message || "Unknown error"}`,
                    }));
                    setSummaryError("Some summaries could not be loaded.");
                }
            }

            if (active) setSummaryLoading(false);
        }

        loadSummariesSequentially();
        return () => {
            active = false;
        };
    }, [uploadedFiles, persona.id]);

        // Poll workspace completion then fetch combined super-summary
        useEffect(() => {
            const backendId = effectiveBackendWorkspaceId;
            const canShowCombined =
                activeWorkspace?.combinedSummary || Boolean(activeWorkspace?.combinedSummaries);
            if (!canShowCombined || !backendId) return;

            let active = true;
            (async () => {
                setCombinedSummaryLoading(true);
                setCombinedSummaryError("");

                const workspaceId = activeWorkspace?.id;
                const cachedPersonaSummary = activeWorkspace?.combinedSummaries?.[persona.id];
                if (!cachedPersonaSummary) {
                    setCombinedSummaryText(COMBINED_PROCESSING_PLACEHOLDER);

                    setActiveWorkspace((prev) => {
                        if (!prev) return prev;
                        const updated = {
                            ...prev,
                            combinedSummary: true,
                            combinedSummaries: {
                                ...(prev.combinedSummaries || {}),
                                [persona.id]: COMBINED_PROCESSING_PLACEHOLDER,
                            },
                        };
                        localStorage.setItem("activeAnalysisWorkspace", JSON.stringify(updated));
                        return updated;
                    });

                    persistWorkspaceUpdate(workspaceId, (item) => ({
                        ...item,
                        combinedSummary: true,
                        combinedSummaries: {
                            ...(item?.combinedSummaries || {}),
                            [persona.id]: COMBINED_PROCESSING_PLACEHOLDER,
                        },
                    }));
                }
                try {
                    let finished = false;
                    let attempts = 0;
                    while (!finished && active && attempts < 40) {
                        const statusRes = await fetchWorkspaceStatus(backendId);
                        if (statusRes?.is_finished) { finished = true; break; }
                        attempts++;
                        await new Promise((r) => setTimeout(r, 3000));
                    }
                    if (!active) return;
                    if (!finished) {
                        setCombinedSummaryError("Timed out waiting for documents to complete processing.");
                        return;
                    }
                    const result = await fetchCombinedSummary(backendId, persona.id);
                    if (active) {
                        const combined = result?.combined_summary || "No combined summary generated.";
                        setCombinedSummaryText(combined);

                        // Persist per-persona combined summary so it survives workspace switches.
                        setActiveWorkspace((prev) => {
                            if (!prev) return prev;
                            const updated = {
                                ...prev,
                                combinedSummary: true,
                                combinedSummaries: {
                                    ...(prev.combinedSummaries || {}),
                                    [persona.id]: combined,
                                },
                            };
                            localStorage.setItem("activeAnalysisWorkspace", JSON.stringify(updated));
                            return updated;
                        });

                        persistWorkspaceUpdate(workspaceId, (item) => ({
                            ...item,
                            combinedSummary: true,
                            combinedSummaries: {
                                ...(item?.combinedSummaries || {}),
                                [persona.id]: combined,
                            },
                        }));
                    }
                } catch (err) {
                    if (active) setCombinedSummaryError(err.message || "Failed to generate combined summary.");
                } finally {
                    if (active) setCombinedSummaryLoading(false);
                }
            })();
            return () => { active = false; };
        }, [activeWorkspace?.combinedSummary, effectiveBackendWorkspaceId, persona.id]);

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

        const questionText = input;

        const userMsg = { 
            id: Date.now(), 
            role: "user", 
            content: questionText,
            documentName: selectedDoc.name
        };
        setMessages(prev => [...prev, userMsg]);
        setInput("");
        setIsTyping(true);

        try {
            const answer = await askDocument(
                selectedDoc.id,
                questionText,
                { document_name: selectedDoc.name, persona: persona.id }
            );

            const aiMsg = {
                id: Date.now() + 1,
                role: "ai",
                content: answer || "No response received.",
                documentName: selectedDoc.name
            };
            setMessages(prev => [...prev, aiMsg]);
        } catch (error) {
            setMessages(prev => [...prev, {
                id: Date.now() + 1,
                role: "ai",
                content: `Request failed: ${error.message || "Unknown error"}`,
                documentName: selectedDoc.name,
            }]);
        } finally {
            setIsTyping(false);
        }
    };

    const handleExportPDF = () => {
        const docPDF = new jsPDF();
        docPDF.setFontSize(16);
        docPDF.text(`${activeWorkspace?.name || "Multi-Document Analysis Report"}`, 10, 10);
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

    const writeWrappedText = (docPDF, text, yStart, options = {}) => {
        const x = options.x ?? 10;
        const lineHeight = options.lineHeight ?? 6;
        const maxWidth = options.maxWidth ?? 190;
        const pageHeight = options.pageHeight ?? 285;

        const lines = docPDF.splitTextToSize(text || "", maxWidth);
        let y = yStart;

        lines.forEach((line) => {
            if (y > pageHeight) {
                docPDF.addPage();
                y = 15;
            }
            docPDF.text(line, x, y);
            y += lineHeight;
        });

        return y;
    };

    const handleExportCombinedSummaryPDF = () => {
        const docPDF = new jsPDF();
        docPDF.setFontSize(16);
        docPDF.text("Combined Super-Summary", 10, 12);
        docPDF.setFontSize(11);
        docPDF.text(`Workspace: ${activeWorkspace?.name || "Analysis Workspace"}`, 10, 20);
        docPDF.text(`Documents: ${uploadedFiles.length}`, 10, 27);
        docPDF.text(`Generated: ${new Date().toLocaleString()}`, 10, 34);

        docPDF.setFontSize(12);
        let y = 44;
        const body = combinedSummaryText || "No combined summary generated yet.";
        y = writeWrappedText(docPDF, body, y, { x: 10, maxWidth: 190, lineHeight: 6 });

        if (y > 280) {
            docPDF.addPage();
            y = 15;
        }
        docPDF.setFontSize(9);
        docPDF.text("Generated from Combined Super-Summary panel", 10, y + 6);

        const workspaceLabel = (activeWorkspace?.name || "workspace").replace(/[^a-z0-9_-]+/gi, "_");
        docPDF.save(`${workspaceLabel}_combined_summary.pdf`);
    };

    const handleExportIndividualSummariesPDF = () => {
        const docPDF = new jsPDF();
        docPDF.setFontSize(16);
        docPDF.text("Individual Document Summaries", 10, 12);
        docPDF.setFontSize(11);
        docPDF.text(`Workspace: ${activeWorkspace?.name || "Analysis Workspace"}`, 10, 20);
        docPDF.text(`Documents: ${uploadedFiles.length}`, 10, 27);
        docPDF.text(`Generated: ${new Date().toLocaleString()}`, 10, 34);

        let y = 44;
        uploadedFiles.forEach((file, index) => {
            if (y > 270) {
                docPDF.addPage();
                y = 15;
            }

            docPDF.setFontSize(12);
            docPDF.text(`${index + 1}. ${file.name || `Document ${index + 1}`}`, 10, y);
            y += 7;

            docPDF.setFontSize(10);
            const content = summaryByDocId[file.id] || "Pending summary...";
            y = writeWrappedText(docPDF, content, y, { x: 12, maxWidth: 186, lineHeight: 5.5 });
            y += 6;
        });

        const workspaceLabel = (activeWorkspace?.name || "workspace").replace(/[^a-z0-9_-]+/gi, "_");
        docPDF.save(`${workspaceLabel}_individual_summaries.pdf`);
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
                <div className="text-xs text-slate-400">
                    {activeWorkspace?.name || "Analysis Workspace"}
                </div>
            </div>

            <div className="flex-1 grid lg:grid-cols-12 gap-6 min-h-0">
                {/* LEFT PANEL: Document Summary (wider) */}
                <div className="lg:col-span-7 flex flex-col gap-6 overflow-y-auto pr-2 custom-scrollbar">
                    {/* Combined Super-Summary Panel — shown when combined mode was selected on upload */}
                    {(activeWorkspace?.combinedSummary || activeWorkspace?.combinedSummaries) && (
                        <div className="bg-[#181b21] border border-purple-500/30 rounded-2xl overflow-hidden relative">
                            <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-purple-400 to-pink-500" />
                            <div className="p-4 border-b border-purple-900/40 bg-purple-900/20 flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <Sparkles className="w-4 h-4 text-purple-400" />
                                    <h3 className="font-bold text-white text-sm">Combined Super-Summary</h3>
                                </div>
                                <div className="flex items-center gap-2">
                                    <span className="text-xs text-purple-300 bg-purple-500/20 px-2 py-0.5 rounded-full">
                                        {uploadedFiles.length} docs
                                    </span>
                                    <button
                                        onClick={handleExportCombinedSummaryPDF}
                                        className="p-1.5 bg-white/10 hover:bg-white/20 text-white rounded-lg transition-colors"
                                        title="Download Combined Summary PDF"
                                    >
                                        <Download className="w-4 h-4" />
                                    </button>
                                </div>
                            </div>
                            <div className="p-5 text-sm leading-relaxed max-h-[34rem] overflow-y-auto custom-scrollbar">
                                {combinedSummaryLoading && (
                                    <div className="space-y-2">
                                        <div className="flex items-center gap-3 text-purple-300 animate-pulse">
                                            <RefreshCw className="w-4 h-4 animate-spin" />
                                            <span>Waiting for all documents to finish, then generating super-summary…</span>
                                        </div>
                                        <p className="text-purple-200">{COMBINED_PROCESSING_PLACEHOLDER}</p>
                                    </div>
                                )}
                                {combinedSummaryError && (
                                    <p className="text-red-400">{combinedSummaryError}</p>
                                )}
                                {!combinedSummaryLoading && !combinedSummaryError && combinedSummaryText && (
                                    <p className="text-slate-200 whitespace-pre-wrap">{combinedSummaryText}</p>
                                )}
                                {!combinedSummaryLoading && !combinedSummaryError && !combinedSummaryText && (
                                    <p className="text-slate-500 italic">Combined summary will appear here once all documents complete.</p>
                                )}
                            </div>
                        </div>
                    )}

                    {/* Individual Summaries Panel — always visible in the same workspace */}
                    <div className="bg-[#181b21] border border-cyan-500/20 rounded-2xl overflow-hidden relative">
                        <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-cyan-400 to-indigo-500" />
                        <div className="p-4 border-b border-white/5 bg-[#22262e] flex items-center justify-between">
                            <h3 className="font-bold text-white text-sm">Individual Document Summaries</h3>
                            <div className="flex items-center gap-2">
                                <span className="text-xs text-cyan-300 bg-cyan-500/10 px-2 py-0.5 rounded-full">
                                    {uploadedFiles.length} docs
                                </span>
                                <button
                                    onClick={handleExportIndividualSummariesPDF}
                                    className="p-1.5 bg-white/10 hover:bg-white/20 text-white rounded-lg transition-colors"
                                    title="Download Individual Summaries PDF"
                                >
                                    <Download className="w-4 h-4" />
                                </button>
                            </div>
                        </div>
                        <div className="p-4 space-y-3 max-h-[38rem] overflow-y-auto custom-scrollbar">
                            {summaryLoading && <p className="text-xs text-slate-400">Loading summaries one by one...</p>}
                            {summaryError && <p className="text-xs text-amber-400">{summaryError}</p>}
                            {uploadedFiles.map((doc) => (
                                <div key={doc.id || doc.name} className="bg-white/5 border border-white/10 rounded-lg p-3">
                                    <p className="text-xs text-cyan-300 mb-1">{doc.name}</p>
                                    <p className="text-xs text-slate-300 whitespace-pre-wrap">
                                        {summaryByDocId[doc.id] || "Pending summary..."}
                                    </p>
                                </div>
                            ))}
                        </div>
                    </div>

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
                                                    <p className="text-xs text-slate-500">
                                                        {typeof file.size === "number" && file.size > 0
                                                            ? `${(file.size / 1024 / 1024).toFixed(2)} MB`
                                                            : (file.status || "uploaded")}
                                                    </p>
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
                                            {typeof selectedDoc.size === "number" && selectedDoc.size > 0
                                                ? `${(selectedDoc.size / 1024 / 1024).toFixed(2)} MB`
                                                : "Size unknown"} • {new Date().toLocaleDateString()}
                                        </p>
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-3">
                                    <div className="p-3 bg-white/5 rounded-lg border border-white/5">
                                        <span className="text-xs text-slate-500 block mb-1">Status</span>
                                        <span className="text-emerald-400 text-sm font-medium flex items-center capitalize">
                                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 mr-2" /> {selectedDoc.status || "processing"}
                                        </span>
                                    </div>
                                    <div className="p-3 bg-white/5 rounded-lg border border-white/5">
                                        <span className="text-xs text-slate-500 block mb-1">Tokens</span>
                                        <span className="text-white text-sm font-medium">
                                            {typeof selectedDoc.size === "number" && selectedDoc.size > 0
                                                ? Math.floor(selectedDoc.size / 1024 * 2.5).toLocaleString()
                                                : "-"}
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
                                        {summaryByDocId[selectedDoc.id] || "Summary is being generated..."}
                                    </p>
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

                {/* RIGHT PANEL: Chat (narrower) */}
                <div className="lg:col-span-5 h-full min-h-0 flex flex-col">
                    <div className="flex flex-col h-full min-h-0 cyber-card overflow-hidden shadow-2xl relative">
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
                            className="flex-1 min-h-0 overflow-y-auto custom-scrollbar p-6 space-y-6 scroll-smooth bg-[url('/noise.png')] bg-opacity-5"
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

