import { Plus, Search, FileText, CheckCircle, Clock, Zap, ArrowUpRight, Filter, Eye } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import DocumentCard from "../components/DocumentCard";
import Button from "../components/Button";
import { fetchDocuments } from "../services/backendApi";

export default function Dashboard() {
    const navigate = useNavigate();
    const [searchTerm, setSearchTerm] = useState("");
    const [documents, setDocuments] = useState([]);
    const [workspaceHistory, setWorkspaceHistory] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const loadWorkspaceHistory = () => {
        try {
            const raw = localStorage.getItem("analysisWorkspaceHistory");
            const parsed = raw ? JSON.parse(raw) : [];
            setWorkspaceHistory(Array.isArray(parsed) ? parsed : []);
        } catch {
            setWorkspaceHistory([]);
        }
    };

    useEffect(() => {
        let mounted = true;

        async function loadDocuments() {
            try {
                setLoading(true);
                setError("");
                const docs = await fetchDocuments();
                if (mounted) setDocuments(docs);
            } catch (err) {
                if (mounted) setError(err.message || "Failed to load documents.");
            } finally {
                if (mounted) setLoading(false);
            }
        }

        loadDocuments();
        loadWorkspaceHistory();
        return () => {
            mounted = false;
        };
    }, []);

    useEffect(() => {
        const handleStorage = (event) => {
            if (event.key === "analysisWorkspaceHistory") {
                loadWorkspaceHistory();
            }
        };

        window.addEventListener("storage", handleStorage);
        return () => window.removeEventListener("storage", handleStorage);
    }, []);

    const openWorkspace = (workspace) => {
        localStorage.setItem("activeAnalysisWorkspace", JSON.stringify(workspace));
        navigate("/analyze", { state: { workspace } });
    };

    const filteredDocs = documents.filter(doc =>
        doc.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
    const hasDocs = filteredDocs.length > 0;

    // Dashboard Stats - Balanced Colors
    const stats = [
        {
            label: "Total Documents",
            value: documents.length,
            icon: FileText,
            color: "text-blue-400",
            bg: "bg-blue-400/10",
            border: "border-blue-400/20"
        },
        {
            label: "Processed",
            value: documents.filter(d => d.status === 'processed').length,
            icon: CheckCircle,
            color: "text-emerald-400",
            bg: "bg-emerald-400/10",
            border: "border-emerald-400/20"
        },
        {
            label: "Processing",
            value: documents.filter(d => d.status === 'processing').length,
            icon: Clock,
            color: "text-amber-400",
            bg: "bg-amber-400/10",
            border: "border-amber-400/20"
        },
        {
            label: "Insights",
            value: "128",
            icon: Zap,
            color: "text-purple-400",
            bg: "bg-purple-400/10",
            border: "border-purple-400/20"
        },
    ];

    return (
        <div className="space-y-12 animate-fade-in w-full max-w-7xl mx-auto pb-12">

            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                <div>
                    <h1 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-white to-slate-400 mb-2">
                        Welcome back, Agent
                    </h1>
                    <p className="text-slate-400 text-lg">
                        Secure Vault Access Granted.
                    </p>
                </div>

                <div className="flex items-center gap-4">
                    {/* Search Input */}
                    <div className="relative group">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 group-focus-within:text-white transition-colors" />
                        <input
                            type="text"
                            placeholder="Search Vault..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="bg-black/40 border border-white/10 rounded-xl outline-none text-sm text-white placeholder-slate-600 w-64 pl-10 pr-4 py-3 focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/20 transition-all shadow-inner"
                        />
                    </div>
                    <Link to="/vault">
                        <Button size="lg" icon={Plus} className="shadow-[0_0_15px_rgba(59,130,246,0.4)]">
                            Secure Upload
                        </Button>
                    </Link>
                </div>
            </div>

            {/* 1. OVERVIEW STATS */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                {stats.map((stat, i) => (
                    <div key={i} className="cyber-card p-6 relative overflow-hidden group hover:border-blue-500/40 transition-all duration-300 hover:transform hover:-translate-y-1 hover:shadow-[0_0_15px_rgba(59,130,246,0.1)]">
                        <div className={`absolute top-0 right-0 p-3 opacity-50 group-hover:opacity-100 transition-opacity`}>
                            <ArrowUpRight className="w-5 h-5 text-slate-500" />
                        </div>

                        <div className={`w-12 h-12 rounded-xl ${stat.bg} ${stat.border} border flex items-center justify-center mb-6`}>
                            <stat.icon className={`w-6 h-6 ${stat.color}`} />
                        </div>

                        <div>
                            <p className="text-3xl font-heading font-bold text-white mb-1">{stat.value}</p>
                            <p className="text-sm font-medium text-slate-500">{stat.label}</p>
                        </div>
                    </div>
                ))}
            </div>

            {/* 2. WORKSPACE HISTORY */}
            <div className="space-y-6">
                <div className="flex items-center justify-between border-b border-white/5 pb-4">
                    <h2 className="text-xl font-bold text-white">Workspace History</h2>
                    <span className="text-sm text-slate-400">{workspaceHistory.length} saved</span>
                </div>

                {workspaceHistory.length === 0 ? (
                    <div className="rounded-2xl border border-dashed border-white/10 p-8 text-center text-slate-400">
                        No workspace history yet. Upload documents to create your first workspace.
                    </div>
                ) : (
                    <div className="grid grid-cols-1 gap-4">
                        {workspaceHistory.map((workspace) => (
                            <div
                                key={workspace.id}
                                className="cyber-card p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4"
                            >
                                <div className="min-w-0">
                                    <p className="text-white font-semibold truncate">{workspace.name || "Untitled Workspace"}</p>
                                    <p className="text-sm text-slate-400 mt-1">
                                        {(workspace.documents || []).length} docs
                                        {workspace.createdAt ? ` • ${new Date(workspace.createdAt).toLocaleString()}` : ""}
                                    </p>
                                </div>

                                <Button
                                    size="sm"
                                    icon={Eye}
                                    onClick={() => openWorkspace(workspace)}
                                    className="sm:w-auto w-full"
                                >
                                    View
                                </Button>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* 3. DOCUMENT LIST */}
            <div className="space-y-6">
                <div className="flex items-center justify-between border-b border-white/5 pb-4">
                    <h2 className="text-xl font-bold text-white">Recent Documents</h2>
                    <div className="flex gap-2">
                        <Button variant="ghost" size="sm" className="text-slate-400 hover:text-white" icon={Filter}>Filter</Button>
                    </div>
                </div>

                {loading && <p className="text-slate-400">Loading documents...</p>}
                {!loading && error && <p className="text-red-400">{error}</p>}

                {!loading && !error && hasDocs ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {filteredDocs.map((doc, index) => (
                            <DocumentCard key={doc.id} doc={doc} index={index} />
                        ))}

                        {/* Upload Card */}
                        <Link to="/vault" className="group min-h-[240px]">
                            <div className="h-full rounded-2xl border-2 border-dashed border-blue-500/20 flex flex-col items-center justify-center p-8 hover:bg-blue-500/5 hover:border-blue-500/50 transition-all cursor-pointer">
                                <div className="w-14 h-14 rounded-full bg-blue-500/10 border border-blue-500/20 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform shadow-[0_0_10px_rgba(59,130,246,0.2)]">
                                    <Plus className="w-6 h-6 text-blue-400 group-hover:text-white" />
                                </div>
                                <p className="text-slate-400 font-medium group-hover:text-white transition-colors">Add to Vault</p>
                            </div>
                        </Link>
                    </div>
                ) : (
                    /* Empty State */
                    <div className="py-24 rounded-3xl border border-dashed border-white/10 flex flex-col items-center justify-center text-center">
                        <div className="w-20 h-20 rounded-full bg-[#181b21] flex items-center justify-center mb-6">
                            <FileText className="w-8 h-8 text-slate-600" />
                        </div>
                        <h3 className="text-xl font-bold text-white mb-2">No documents yet</h3>
                        <p className="text-slate-500 mb-8">Upload your first PDF to get started.</p>
                        <Link to="/upload">
                            <Button variant="primary">Upload Now</Button>
                        </Link>
                    </div>
                )}
            </div>
        </div>
    );
}
