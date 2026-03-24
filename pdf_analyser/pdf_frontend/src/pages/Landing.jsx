import { useRef, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, FileText, Zap, Shield, Sparkles, UploadCloud, PieChart, Lock, ChevronRight } from "lucide-react";
import Button from "../components/Button";
import GlassCard from "../components/GlassCard";
import { motion, useScroll, useTransform, useSpring, useMotionValue } from "framer-motion";

export default function Landing() {
    const { scrollY } = useScroll();
    const yParallax = useTransform(scrollY, [0, 500], [0, -100]);

    return (
        <div className="flex flex-col min-h-screen bg-transparent text-white selection:bg-blue-500/30 overflow-x-hidden">

            {/* 1. HERO SECTION (3D Floating) */}
            <section className="relative min-h-[100vh] flex flex-col justify-center items-center pt-20 overflow-hidden">
                {/* Abstract Background Mesh */}
                <div className="absolute inset-0 z-0">
                    <div className="absolute top-[-20%] left-[-10%] w-[1000px] h-[1000px] bg-indigo-900/10 rounded-full blur-[150px] animate-pulse-soft" />
                    <div className="absolute bottom-[-20%] right-[-10%] w-[800px] h-[800px] bg-cyan-900/10 rounded-full blur-[150px] animate-pulse-soft" style={{ animationDelay: '2s' }} />
                </div>

                <div className="container max-w-7xl mx-auto px-6 grid lg:grid-cols-2 gap-16 items-center relative z-10">

                    {/* Text Content */}
                    <motion.div
                        initial={{ opacity: 0, x: -50 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.8, ease: "easeOut" }}
                        className="space-y-8 text-left"
                    >
                        <div className="inline-flex items-center space-x-2 bg-white/5 border border-white/10 rounded-full px-4 py-1.5 backdrop-blur-sm">
                            <span className="relative flex h-2 w-2">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-2 w-2 bg-cyan-500"></span>
                            </span>
                            <span className="text-sm font-medium text-slate-300">AI Logic Core v2.4</span>
                        </div>

                        <h1 className="text-6xl md:text-7xl font-bold leading-tight tracking-tight">
                            Unlock Data <br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-600">Securely. Instantly.</span>
                        </h1>

                        <p className="text-xl text-slate-400 max-w-lg leading-relaxed">
                            The enterprise-grade AI that transforms static PDFs into interactive databases. Private. Secure. Instant.
                        </p>

                        <div className="flex flex-wrap gap-4 pt-4">
                            <Link to="/documents/chat">
                                <Button size="lg" className="h-14 px-8 text-lg font-semibold shadow-[0_0_20px_rgba(59,130,246,0.4)] transition-all hover:scale-105">
                                    Access Vault
                                    <ArrowRight className="ml-2 w-5 h-5" />
                                </Button>
                            </Link>
                            <Button variant="ghost" size="lg" className="h-14 px-8 text-lg text-slate-300 border border-white/10 hover:bg-white/5 hover:border-blue-500/50">
                                System Demo
                            </Button>
                        </div>

                        <div className="pt-8 flex items-center space-x-6 text-sm text-slate-500 font-medium">
                            <div className="flex items-center"><Shield className="w-4 h-4 mr-2" /> SOC2 Compliant</div>
                            <div className="flex items-center"><Lock className="w-4 h-4 mr-2" /> End-to-End Encrypted</div>
                        </div>
                    </motion.div>

                    {/* 3D Visual - Floating Stack */}
                    <div className="relative h-[600px] w-full perspective-1000 hidden lg:block">
                        <FloatingCardStack />
                    </div>
                </div>
            </section>

            {/* 2. HOW IT WORKS (Connected Steps) */}
            <section className="py-32 bg-[#12141a] border-y border-white/5 relative">
                <div className="container max-w-7xl mx-auto px-6">
                    <div className="text-center mb-24 max-w-3xl mx-auto">
                        <h2 className="text-4xl font-heading font-bold mb-6">From Static to Intelligent in Seconds</h2>
                        <p className="text-slate-400 text-lg">Our vectorization pipeline breaks down complex documents into semantic meaning.</p>
                    </div>

                    <div className="grid md:grid-cols-3 gap-12 relative">
                        {/* Connecting Line */}
                        <div className="absolute top-12 left-0 w-full h-0.5 bg-gradient-to-r from-transparent via-white/10 to-transparent hidden md:block" />

                        {[
                            { icon: UploadCloud, title: "Ingest", desc: "Drag & drop any PDF. We support OCR for scanned files.", color: "text-cyan-400" },
                            { icon: PieChart, title: "Vectorize", desc: "Content is chunked and embedded into a high-dim vector space.", color: "text-indigo-400" },
                            { icon: Zap, title: "Interact", desc: "Chat with your data. Extract tables, summaries, and risks instantly.", color: "text-emerald-400" }
                        ].map((step, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: i * 0.2 }}
                                className="relative z-10 text-center group"
                            >
                                <div className="w-24 h-24 mx-auto cyber-card flex items-center justify-center mb-8 hover:border-blue-500/50 hover:shadow-[0_0_20px_rgba(59,130,246,0.2)] transition-all relative overflow-hidden">
                                    <div className={`absolute inset-0 bg-gradient-to-br from-blue-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity`} />
                                    <step.icon className={`w-10 h-10 ${step.color}`} />
                                </div>
                                <h3 className="text-2xl font-bold mb-4 text-white">{step.title}</h3>
                                <p className="text-slate-400 leading-relaxed px-4">{step.desc}</p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* 3. FEATURE SHOWCASE (Alternating) */}
            <section className="py-32 container max-w-7xl mx-auto px-6 space-y-32">
                {/* Feature 1 */}
                <div className="grid lg:grid-cols-2 gap-16 items-center">
                    <div className="order-2 lg:order-1 relative group">
                        <div className="absolute -inset-1 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-2xl blur opacity-20 group-hover:opacity-40 transition duration-1000" />
                        <div className="relative rounded-xl border border-white/10 bg-[#181b21] overflow-hidden shadow-2xl">
                            {/* Mock UI */}
                            <div className="h-8 bg-white/5 border-b border-white/5 flex items-center px-4 space-x-2">
                                <div className="w-3 h-3 rounded-full bg-slate-600" />
                                <div className="w-3 h-3 rounded-full bg-slate-600" />
                            </div>
                            <div className="p-8 space-y-4">
                                <div className="flex gap-4">
                                    <div className="w-10 h-10 rounded-full bg-indigo-500/20 flex-shrink-0" />
                                    <div className="space-y-2 w-full">
                                        <div className="h-3 bg-white/10 rounded w-3/4" />
                                        <div className="h-3 bg-white/10 rounded w-1/2" />
                                    </div>
                                </div>
                                <div className="p-4 bg-white/5 rounded-lg border border-white/5 text-sm text-slate-300 font-mono">
                                    &gt; Analysis detected 3 high-priority clauses...
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="order-1 lg:order-2 space-y-6">
                        <div className="w-12 h-12 rounded-lg bg-cyan-900/20 flex items-center justify-center">
                            <Zap className="w-6 h-6 text-cyan-400" />
                        </div>
                        <h2 className="text-4xl font-bold">Lightning Fast Insights</h2>
                        <p className="text-xl text-slate-400 leading-relaxed">
                            Don't wait for cloud queues. Our local-first engine processes documents on your device, delivering detailed insights in milliseconds.
                        </p>
                        <ul className="space-y-3 pt-4">
                            {['Local Processing', 'Zero Latency', 'Offline Capable'].map(item => (
                                <li key={item} className="flex items-center text-slate-300">
                                    <div className="w-1.5 h-1.5 rounded-full bg-cyan-500 mr-3" />
                                    {item}
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
            </section>

            {/* 4. CTA */}
            <section className="py-24 relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-b from-[#12141a] to-[#0f1115]" />
                <div className="container max-w-4xl mx-auto px-6 relative z-10 text-center space-y-8">
                    <h2 className="text-5xl font-heading font-bold tracking-tight">
                        Ready to upgrade your workflow?
                    </h2>
                    <p className="text-xl text-slate-400">Join the professionals saving 10+ hours a week.</p>
                    <div className="pt-4">
                        <Link to="/upload">
                            <Button size="lg" className="h-16 px-12 text-xl bg-white text-black hover:bg-slate-200 border-0 shadow-[0_0_40px_rgba(255,255,255,0.15)] rounded-2xl transition-transform hover:-translate-y-1">
                                Launch Workspace
                            </Button>
                        </Link>
                    </div>
                </div>
            </section>

            <footer className="py-8 text-center text-slate-600 text-sm border-t border-white/5">
                <p>© {new Date().getFullYear()} DocAnalyze AI. Enterprise Grade.</p>
            </footer>
        </div>
    );
}

// 3D Floating Stack Component
function FloatingCardStack() {
    const mouseX = useMotionValue(0);
    const mouseY = useMotionValue(0);

    const rotateX = useSpring(useTransform(mouseY, [-0.5, 0.5], [10, -10]), { stiffness: 150, damping: 20 });
    const rotateY = useSpring(useTransform(mouseX, [-0.5, 0.5], [-10, 10]), { stiffness: 150, damping: 20 });

    function handleMouseMove(e) {
        const rect = e.currentTarget.getBoundingClientRect();
        mouseX.set((e.clientX - rect.left) / rect.width - 0.5);
        mouseY.set((e.clientY - rect.top) / rect.height - 0.5);
    }

    return (
        <div onMouseMove={handleMouseMove} className="w-full h-full flex items-center justify-center perspective-1000">
            <motion.div
                style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
                className="relative w-[400px] h-[500px]"
            >
                {/* Back Card */}
                <div className="absolute top-0 left-10 w-full h-full bg-[#181b21] border border-white/5 rounded-2xl shadow-2xl opacity-40 transform translate-z-[-50px] scale-90" />

                {/* Middle Card */}
                <div className="absolute top-5 left-5 w-full h-full bg-[#181b21] border border-white/10 rounded-2xl shadow-2xl opacity-70 transform translate-z-[-25px] scale-95" />

                {/* Front Card (Main) */}
                <div className="absolute inset-0 bg-[#0F172A] border border-blue-500/30 rounded-2xl shadow-[0_0_30px_rgba(59,130,246,0.15)] overflow-hidden transform translate-z-[20px]">
                    <div className="h-32 bg-gradient-to-b from-indigo-900/20 to-transparent p-6 relative">
                        <div className="w-12 h-12 rounded-xl bg-indigo-500 flex items-center justify-center shadow-lg mb-4">
                            <FileText className="w-6 h-6 text-white" />
                        </div>
                        <h3 className="text-xl font-bold text-white">Financial_Q3.pdf</h3>
                        <p className="text-sm text-slate-400">Processed • 4.2 MB</p>
                    </div>

                    <div className="p-6 space-y-4">
                        <div className="flex gap-3">
                            <div className="w-8 h-8 rounded-full bg-cyan-500/20 flex-shrink-0" />
                            <div className="flex-1 space-y-2">
                                <div className="p-3 bg-white/5 rounded-lg rounded-tl-none border border-white/5 text-sm text-slate-300">
                                    Revenue is up 12% driven by enterprise adoption.
                                </div>
                            </div>
                        </div>
                        <div className="flex gap-3 flex-row-reverse">
                            <div className="w-8 h-8 rounded-full bg-indigo-500/20 flex-shrink-0" />
                            <div className="flex-1 space-y-2">
                                <div className="p-3 bg-indigo-500/10 rounded-lg rounded-tr-none border border-indigo-500/20 text-sm text-indigo-300 ml-auto">
                                    Show me the risk factors.
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Floating Elements */}
                    <motion.div
                        animate={{ y: [0, -10, 0] }}
                        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                        className="absolute -right-8 top-20 bg-[#2d3342] p-4 rounded-xl border border-white/10 shadow-xl"
                    >
                        <div className="flex items-center gap-2 text-emerald-400 font-bold text-sm">
                            <Zap className="w-4 h-4" /> 98% Accuracy
                        </div>
                    </motion.div>
                </div>
            </motion.div>
        </div>
    );
}
