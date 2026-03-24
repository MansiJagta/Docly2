import { FileText, Clock, MoreVertical, Play, Eye } from "lucide-react";
import Button from "./Button";
import { cn } from "../utils/cn";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

export default function DocumentCard({ doc, index = 0 }) {
    const statusConfig = {
        uploaded: { color: "text-slate-400", bg: "bg-white/5 border border-white/10", label: "Uploaded" },
        processing: { color: "text-amber-400", bg: "bg-amber-500/10 border border-amber-500/20", label: "Processing" },
        processed: { color: "text-blue-400", bg: "bg-blue-500/10 border border-blue-500/20 shadow-[0_0_10px_rgba(59,130,246,0.2)]", label: "Ready" },
        error: { color: "text-red-400", bg: "bg-red-500/10 border border-red-500/20", label: "Error" },
    };

    const status = statusConfig[doc.status] || statusConfig.uploaded;

    return (
        <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
            className="group relative"
        >
            <div className="h-full flex flex-col cyber-card p-5 hover:border-blue-500/50 hover:shadow-[0_0_20px_rgba(59,130,246,0.15)] transition-all duration-300">

                {/* Header */}
                <div className="flex justify-between items-start mb-6">
                    <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 rounded-lg bg-blue-900/20 border border-blue-500/30 flex items-center justify-center text-blue-400 shadow-[0_0_10px_rgba(59,130,246,0.2)]">
                            <FileText className="w-5 h-5" />
                        </div>
                        <div className="flex flex-col">
                            <h3 className="text-white font-semibold truncate max-w-[140px]" title={doc.name}>{doc.name}</h3>
                            <span className="text-xs text-slate-500">{doc.date}</span>
                        </div>
                    </div>
                    <button className="text-slate-600 hover:text-white transition-colors">
                        <MoreVertical className="w-5 h-5" />
                    </button>
                </div>

                {/* Content Preview / Info */}
                <div className="flex-1 space-y-3 mb-6">
                    <div className="flex items-center text-xs text-slate-400 bg-white/5 rounded-md px-3 py-2 w-fit border border-white/5">
                        <Clock className="w-3 h-3 mr-2" />
                        {doc.size}
                    </div>
                    {/* Status Badge */}
                    <div className={cn("text-xs font-medium px-2 py-1 rounded w-fit", status.color, status.bg)}>
                        {status.label}
                    </div>
                </div>

                {/* Actions */}
                <div className="grid grid-cols-2 gap-3 pt-4 border-t border-white/5">
                    <Link to={`/documents/${doc.id}`} className="w-full">
                        <Button variant="ghost" size="sm" className="w-full text-slate-400 hover:text-white bg-white/5 hover:bg-white/10 border-0">
                            View
                        </Button>
                    </Link>
                    <div className="w-full">
                        {doc.status === 'processed' ? (
                            <Link to={`/documents/${doc.id}`}>
                                <Button size="sm" className="w-full bg-white text-black hover:bg-slate-200 border-0">
                                    Chat
                                </Button>
                            </Link>
                        ) : (
                            <Button size="sm" className="w-full opacity-50 cursor-not-allowed" disabled>
                                Analyze
                            </Button>
                        )}
                    </div>
                </div>

            </div>
        </motion.div>
    );
}
