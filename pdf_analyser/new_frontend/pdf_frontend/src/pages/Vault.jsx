import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Shield, Lock, Fingerprint, Key, ArrowRight, FileText, Download, CheckCircle } from "lucide-react";
import Button from "../components/Button";
import { DOCUMENTS } from "../data/mock";

export default function Vault() {
    const [isLocked, setIsLocked] = useState(true);
    const [authStep, setAuthStep] = useState("biometric"); // biometric, pin, success
    const navigate = useNavigate();

    // Theme: Deep Navy (#0a2463) to Dark Navy (#020b1f)
    // Accents: Royal Blue (#3e92cc)

    const handleUnlock = () => {
        setAuthStep("processing");
        setTimeout(() => {
            setAuthStep("success");
            setTimeout(() => {
                setIsLocked(false);
            }, 1000);
        }, 1500);
    };

    if (isLocked) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-[linear-gradient(135deg,#0a2463_0%,#020b1f_100%)] p-6">
                <motion.div
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="w-full max-w-md bg-white/5 backdrop-blur-xl border border-white/10 p-8 rounded-3xl shadow-[0_0_50px_rgba(10,36,99,0.5)] text-center space-y-8"
                >
                    <div className="mx-auto w-24 h-24 rounded-full bg-gradient-to-br from-blue-600 to-cyan-500 flex items-center justify-center mb-6 shadow-lg shadow-blue-500/30">
                        {authStep === "success" ? (
                            <CheckCircle className="w-10 h-10 text-white animate-bounce" />
                        ) : (
                            <Shield className="w-10 h-10 text-white" />
                        )}
                    </div>

                    <div>
                        <h1 className="text-3xl font-bold text-white mb-2">Privacy Vault</h1>
                        <p className="text-slate-400">Restricted Access. Identity Verification Required.</p>
                    </div>

                    <div className="space-y-4">
                        <div className="p-4 bg-black/20 rounded-xl border border-white/5 flex items-center justify-between group cursor-pointer hover:border-blue-500/50 transition-colors" onClick={handleUnlock}>
                            <div className="flex items-center">
                                <Fingerprint className="w-6 h-6 text-blue-400 mr-4" />
                                <div className="text-left">
                                    <h3 className="text-white font-medium">Biometric Scan</h3>
                                    <p className="text-xs text-slate-500">Touch ID / Face ID</p>
                                </div>
                            </div>
                            <div className="w-3 h-3 rounded-full bg-slate-600 group-hover:bg-blue-500 transition-colors" />
                        </div>

                        <div className="p-4 bg-black/20 rounded-xl border border-white/5 flex items-center justify-between group cursor-pointer hover:border-blue-500/50 transition-colors" onClick={handleUnlock}>
                            <div className="flex items-center">
                                <Key className="w-6 h-6 text-blue-400 mr-4" />
                                <div className="text-left">
                                    <h3 className="text-white font-medium">Master Key</h3>
                                    <p className="text-xs text-slate-500">Enter secure password</p>
                                </div>
                            </div>
                            <div className="w-3 h-3 rounded-full bg-slate-600 group-hover:bg-blue-500 transition-colors" />
                        </div>
                    </div>

                    <div className="pt-4">
                        <Link to="/">
                            <Button variant="ghost" className="text-slate-500 hover:text-white">Cancel Authentication</Button>
                        </Link>
                    </div>
                </motion.div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#0f1115] p-6 md:p-12 animate-fade-in">
            <div className="max-w-7xl mx-auto space-y-8">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold text-white flex items-center gap-3">
                            <Shield className="w-8 h-8 text-blue-400" />
                            Vault Storage
                        </h1>
                        <p className="text-slate-400 mt-2">Secure, encrypted document storage.</p>
                    </div>
                    <Link to="/upload">
                        <Button className="bg-blue-600 hover:bg-blue-500 shadow-[0_0_20px_rgba(59,130,246,0.5)]">
                            <Lock className="w-4 h-4 mr-2" /> Encrypt New File
                        </Button>
                    </Link>
                </div>

                {/* Secure Grid */}
                <div className="grid md:grid-cols-3 lg:grid-cols-4 gap-6">
                    {DOCUMENTS.map((doc) => (
                        <motion.div
                            key={doc.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="bg-[#181b21] border border-blue-500/20 rounded-2xl p-6 hover:shadow-[0_0_20px_rgba(0,0,0,0.5)] transition-all group relative overflow-hidden"
                        >
                            <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-bl from-blue-500/10 to-transparent -mr-10 -mt-10 rounded-full blur-2xl group-hover:from-blue-500/20 transition-all" />

                            <div className="w-12 h-12 rounded-xl bg-blue-900/20 flex items-center justify-center mb-4 text-blue-400">
                                <FileText className="w-6 h-6" />
                            </div>

                            <h3 className="text-lg font-bold text-white mb-2 truncate">{doc.name}</h3>
                            <div className="flex items-center justify-between text-xs text-slate-500 mt-4">
                                <span className="bg-blue-500/10 text-blue-400 px-2 py-1 rounded border border-blue-500/20">AES-256</span>
                                <span>{doc.size}</span>
                            </div>

                            <div className="mt-6 flex gap-2">
                                <Link to={`/documents/${doc.id}`} className="flex-1">
                                    <Button variant="outline" size="sm" className="w-full border-white/10 hover:bg-white/5">Open</Button>
                                </Link>
                                <Button variant="ghost" size="sm" className="px-2 text-slate-500 hover:text-white"><Download className="w-4 h-4" /></Button>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </div>
    );
}
