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
            <section className="relative min-h-screen flex flex-col justify-center items-center pt-10 md:pt-16 overflow-hidden">
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
                        <div className="inline-flex items-center space-x-2 bg-white/5 border border-white/10 rounded-full px-4 py-1.5 backdrop-blur-sm shadow-[0_0_25px_rgba(59,130,246,0.35)]">
                            <span className="relative flex h-2 w-2">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-2 w-2 bg-cyan-500"></span>
                            </span>
                            <span className="text-sm font-medium text-slate-300">Docly</span>
                        </div>

                        <h1 className="text-5xl md:text-7xl font-bold leading-tight tracking-tight">
                            Your PDFs,
                            <br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-blue-500 to-indigo-500">
                                Supercharged Offline.
                            </span>
                        </h1>

                        <p className="text-xl text-slate-400 max-w-lg leading-relaxed">
                            Turn static PDFs into an interactive, searchable knowledge base that runs 100% on your device.
                            No cloud uploads. No data leaving your machine.
                        </p>

                        <div className="flex flex-wrap gap-4 pt-6">
                            <Link to="/upload">
                                <Button size="lg" className="h-14 px-8 text-lg font-semibold shadow-[0_0_20px_rgba(59,130,246,0.4)] transition-all hover:scale-105">
                                    Start Analyzing PDFs
                                    <ArrowRight className="ml-2 w-5 h-5" />
                                </Button>
                            </Link>
                            <Link to="/dashboard">
                                <Button
                                    variant="ghost"
                                    size="lg"
                                    className="h-14 px-8 text-lg text-slate-300 border border-white/10 hover:bg-white/5 hover:border-blue-500/50"
                                >
                                    Open Offline Workspace
                                </Button>
                            </Link>
                        </div>

                        <div className="pt-8 flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-slate-500 font-medium">
                            <div className="flex items-center">
                                <Shield className="w-4 h-4 mr-2" /> 100% Local Processing
                            </div>
                            <div className="flex items-center">
                                <Lock className="w-4 h-4 mr-2" /> No Cloud • No Uploads
                            </div>
                            <div className="flex items-center">
                                <Sparkles className="w-4 h-4 mr-2" /> Optimized for Large PDF Vaults
                            </div>
                        </div>
                    </motion.div>

                    {/* 3D Visual - Analytic Panel */}
                    <div className="relative h-[580px] w-full hidden lg:flex items-center justify-center">
                        <motion.div
                            initial={{ opacity: 0, y: 40, scale: 0.96 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            transition={{ duration: 0.8, ease: "easeOut" }}
                            className="relative w-full max-w-md cyber-card border-blue-500/30 shadow-[0_0_35px_rgba(59,130,246,0.25)] overflow-hidden"
                        >
                            {/* Top bar */}
                            <div className="flex items-center justify-between px-5 py-3 bg-gradient-to-r from-slate-900/80 to-slate-900/40 border-b border-white/10">
                                <div className="flex items-center gap-2">
                                    <div className="w-8 h-8 rounded-lg bg-blue-600/80 flex items-center justify-center shadow-md">
                                        <FileText className="w-4 h-4 text-white" />
                                    </div>
                                    <div>
                                        <p className="text-xs uppercase tracking-[0.2em] text-slate-400">Active Document</p>
                                        <p className="text-sm font-semibold text-white">Annual_Report_2024.pdf</p>
                                    </div>
                                </div>
                                <span className="text-[11px] px-2 py-1 rounded-full bg-emerald-500/10 text-emerald-300 border border-emerald-500/30">
                                    Offline • Encrypted
                                </span>
                            </div>

                            {/* Content */}
                            <div className="p-5 space-y-5 bg-[#020617]/80">
                                {/* Search / Ask bar */}
                                <div className="rounded-xl border border-white/10 bg-slate-900/70 px-4 py-3 flex items-center justify-between gap-3">
                                    <div className="flex flex-col">
                                        <span className="text-[11px] uppercase tracking-[0.25em] text-slate-500">Ask your vault</span>
                                        <span className="text-sm text-slate-200">
                                            “Show me all clauses about termination notice period.”
                                        </span>
                                    </div>
                                    <Button size="sm" className="text-xs px-3 py-1.5 rounded-full">
                                        Analyze
                                    </Button>
                                </div>

                                {/* Two column layout: key metrics + insights */}
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-3">
                                        <div className="rounded-xl border border-blue-500/40 bg-blue-950/40 px-4 py-3">
                                            <p className="text-[11px] text-blue-300 uppercase tracking-[0.18em] mb-1">Vault Overview</p>
                                            <p className="text-2xl font-bold text-white">238</p>
                                            <p className="text-xs text-slate-400">Documents indexed locally</p>
                                        </div>
                                        <div className="rounded-xl border border-white/10 bg-slate-900/60 px-4 py-3 space-y-2">
                                            <div className="flex items-center justify-between text-xs text-slate-300">
                                                <span>Legal</span>
                                                <span className="text-slate-500">72 docs</span>
                                            </div>
                                            <div className="h-1.5 rounded-full bg-slate-800 overflow-hidden">
                                                <div className="h-full w-3/4 bg-gradient-to-r from-blue-500 to-cyan-400"></div>
                                            </div>
                                            <div className="flex items-center justify-between text-xs text-slate-300">
                                                <span>Finance</span>
                                                <span className="text-slate-500">91 docs</span>
                                            </div>
                                            <div className="h-1.5 rounded-full bg-slate-800 overflow-hidden">
                                                <div className="h-full w-2/3 bg-gradient-to-r from-emerald-400 to-teal-400"></div>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="space-y-3">
                                        <div className="rounded-xl border border-white/10 bg-slate-900/70 px-4 py-3">
                                            <p className="text-[11px] text-slate-400 uppercase tracking-[0.18em] mb-1">Instant insight</p>
                                            <p className="text-xs text-slate-200 leading-relaxed">
                                                “Across 238 PDFs, the average termination notice period is{" "}
                                                <span className="text-cyan-400 font-semibold">45 days</span> with{" "}
                                                <span className="text-emerald-400 font-semibold">12 outliers</span> below 30 days.
                                            </p>
                                        </div>
                                        <div className="rounded-xl border border-emerald-500/30 bg-emerald-900/20 px-4 py-3 flex items-center justify-between">
                                            <div className="space-y-1">
                                                <p className="text-[11px] uppercase tracking-[0.18em] text-emerald-300">Risk scanner</p>
                                                <p className="text-xs text-emerald-100">3 high‑risk clauses flagged</p>
                                            </div>
                                            <div className="text-right">
                                                <p className="text-xl font-bold text-emerald-300">98%</p>
                                                <p className="text-[11px] text-emerald-200/80">local match accuracy</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Bottom chips */}
                                <div className="flex flex-wrap gap-2 pt-1">
                                    {["No internet required", "Works with scanned PDFs", "Keeps compliance data local"].map((chip) => (
                                        <span
                                            key={chip}
                                            className="text-[11px] px-3 py-1 rounded-full bg-slate-900/70 border border-slate-700/70 text-slate-300"
                                        >
                                            {chip}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* 2. HOW IT WORKS (Connected Steps) */}
            <section className="py-32 bg-[#12141a] border-y border-white/5 relative">
                <div className="container max-w-7xl mx-auto px-6">
                    <div className="text-center mb-24 max-w-3xl mx-auto">
                        <h2 className="text-4xl font-heading font-bold mb-6">Docly in Three Steps</h2>
                        <p className="text-slate-400 text-lg">
                            A local-first pipeline that keeps your contracts, reports, and research exactly where they belong — on your machine.
                        </p>
                    </div>

                    <div className="grid md:grid-cols-3 gap-12 relative">
                        {/* Connecting Line */}
                        <div className="absolute top-12 left-0 w-full h-0.5 bg-gradient-to-r from-transparent via-white/10 to-transparent hidden md:block" />

                        {[
                            {
                                icon: UploadCloud,
                                title: "Drop PDFs Locally",
                                desc: "Drag & drop single files or whole folders. We support multi‑document offline analysis.",
                                color: "text-cyan-400"
                            },
                            {
                                icon: PieChart,
                                title: "Index on Your Device",
                                desc: "Text, tables, and structure are vectorized into a private, high‑dimensional index that never leaves disk.",
                                color: "text-indigo-400"
                            },
                            {
                                icon: Zap,
                                title: "Ask Anything Offline",
                                desc: "Query across thousands of pages, extract key clauses, and generate summaries — even with no internet.",
                                color: "text-emerald-400"
                            }
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

            {/* 3. FEATURE SHOWCASE (Lightning Fast Offline) */}
            <section className="py-24 md:py-32">
                <div className="container max-w-7xl mx-auto px-6">
                    <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
                        {/* Left: Highlight Card */}
                        <div className="order-2 lg:order-1 relative">
                            <div className="absolute -inset-1 bg-linear-to-r from-cyan-500/40 via-blue-500/40 to-transparent rounded-3xl blur-2xl opacity-40 pointer-events-none" />
                            <div className="relative rounded-3xl border border-white/10 bg-[#050816]/90 shadow-[0_40px_120px_rgba(15,23,42,0.9)] overflow-hidden">
                                <div className="px-6 py-4 border-b border-white/10 flex items-center justify-between bg-black/40">
                                    <div className="flex items-center gap-3">
                                        <div className="w-9 h-9 rounded-xl bg-blue-600/80 flex items-center justify-center shadow-[0_0_18px_rgba(37,99,235,0.8)]">
                                            <Zap className="w-5 h-5 text-white" />
                                        </div>
                                        <div>
                                            <p className="text-[11px] uppercase tracking-[0.22em] text-slate-400">Realtime analysis</p>
                                            <p className="text-sm font-semibold text-white">High‑priority clause detector</p>
                                        </div>
                                    </div>
                                    <span className="text-[11px] px-2 py-1 rounded-full bg-emerald-500/10 text-emerald-300 border border-emerald-500/40">
                                        Offline • 98% match
                                    </span>
                                </div>

                                <div className="p-6 md:p-7 space-y-5">
                                    {/* Analysis message */}
                                    <div className="rounded-2xl bg-indigo-500/10 border border-indigo-500/30 px-5 py-4 text-sm text-indigo-100 font-mono">
                                        <span className="block text-[11px] uppercase tracking-[0.18em] text-indigo-300 mb-2">
                                            Analysis stream
                                        </span>
                                        <p>
                                            &gt; Analysis detected <span className="text-emerald-300 font-semibold">3 high‑priority clauses</span>{' '}
                                            related to termination, liability caps, and data retention.
                                        </p>
                                    </div>

                                    {/* OS + document type grid */}
                                    <div className="grid sm:grid-cols-3 gap-3">
                                        {[
                                            { label: "Runs on", value: "Windows", sub: "11 / 10", accent: "text-sky-300" },
                                            { label: "Also on", value: "macOS", sub: "Intel / M‑Series", accent: "text-fuchsia-300" },
                                            { label: "And", value: "Linux", sub: "Ubuntu / Debian", accent: "text-emerald-300" }
                                        ].map((item) => (
                                            <div
                                                key={item.value}
                                                className="rounded-2xl bg-white/5 border border-white/10 px-4 py-3 text-xs text-slate-300"
                                            >
                                                <p className="text-[10px] uppercase tracking-[0.2em] text-slate-500 mb-1">{item.label}</p>
                                                <p className={`text-sm font-semibold ${item.accent}`}>{item.value}</p>
                                                <p className="text-[11px] text-slate-400 mt-0.5">{item.sub}</p>
                                            </div>
                                        ))}
                                    </div>

                                    {/* Bullet list */}
                                    <div className="mt-2 space-y-2 text-sm text-slate-300">
                                        <div className="flex items-start gap-2">
                                            <span className="mt-1 h-1.5 w-1.5 rounded-full bg-cyan-400" />
                                            <p>Designed for long technical & legal PDFs – thousands of pages, parsed locally.</p>
                                        </div>
                                        <div className="flex items-start gap-2">
                                            <span className="mt-1 h-1.5 w-1.5 rounded-full bg-emerald-400" />
                                            <p>Keeps compliance and contract data strictly inside your perimeter.</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Right: Text + chips */}
                        <div className="order-1 lg:order-2 space-y-6">
                            <p className="text-[13px] font-semibold uppercase tracking-[0.32em] text-slate-400">
                                PERFORMANCE • SECURITY • CONTROL
                            </p>
                            <h2 className="text-3xl md:text-4xl font-bold leading-tight">
                                Lightning fast,
                                <span className="text-transparent bg-clip-text bg-linear-to-r from-cyan-400 via-blue-400 to-indigo-400">
                                    {' '}completely offline.
                                </span>
                            </h2>
                            <p className="text-base md:text-xl text-slate-400 leading-relaxed">
                                Skip upload bars, API limits, and vendor lock‑in. Every token of analysis runs on your own hardware,
                                so even massive PDF vaults stay responsive and private.
                            </p>

                            <div className="grid sm:grid-cols-2 gap-4 pt-2">
                                <div className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3">
                                    <p className="text-[11px] uppercase tracking-[0.2em] text-slate-400 mb-1">Latency</p>
                                    <p className="text-lg font-semibold text-white">Sub‑second responses</p>
                                    <p className="text-xs text-slate-500 mt-1">On typical contract and policy packs.</p>
                                </div>
                                <div className="rounded-2xl border border-emerald-500/30 bg-emerald-500/5 px-4 py-3">
                                    <p className="text-[11px] uppercase tracking-[0.2em] text-emerald-300 mb-1">Data boundary</p>
                                    <p className="text-lg font-semibold text-emerald-200">Zero cloud copies</p>
                                    <p className="text-xs text-emerald-300/80 mt-1">Nothing leaves your machine – ever.</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* (Global footer lives in Layout – no extra CTA section here to keep things clean) */}
        </div>
    );
}

// (FloatingCardStack removed – new analytic panel is the primary visual)
