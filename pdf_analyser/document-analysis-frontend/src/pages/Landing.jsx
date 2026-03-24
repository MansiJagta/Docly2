// import React from 'react';
// import { useNavigate } from 'react-router-dom';
// import { motion } from 'framer-motion';
// import { Upload, Shield, Zap, Brain, Lock, Cpu, Database } from 'lucide-react';
// import Button from '../components/ui/Button';
// import Card from '../components/ui/Card';

// export default function Landing() {
//   const navigate = useNavigate();
  
//   const features = [
//     { 
//       icon: Shield, 
//       title: 'Privacy First', 
//       desc: 'Your data never leaves your device. Zero cloud, zero tracking.' 
//     },
//     { 
//       icon: Zap, 
//       title: 'Lightning Fast', 
//       desc: 'Local LLMs with instant response. No network delays.' 
//     },
//     { 
//       icon: Brain, 
//       title: 'AI Powered', 
//       desc: 'Smart summaries & contextual Q&A. Multiple analysis modes.' 
//     }
//   ];
  
//   const techStack = [
//     { icon: Lock, label: 'End-to-End Local' },
//     { icon: Cpu, label: 'Local LLMs (360M/1B)' },
//     { icon: Database, label: 'SQLite-vec' }
//   ];
  
//   return (
//     <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 flex items-center justify-center p-8">
//       <div className="max-w-5xl w-full">
//         {/* Hero Section */}
//         <motion.div
//           initial={{ opacity: 0, y: 20 }}
//           animate={{ opacity: 1, y: 0 }}
//           className="text-center mb-12"
//         >
//           <h1 className="text-6xl font-bold text-white mb-4">
//             Local PDF{' '}
//             <span className="bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">
//               Intelligence
//             </span>
//           </h1>
//           <p className="text-xl text-gray-400 mb-2">
//             100% Offline. Zero Cloud. Total Privacy.
//           </p>
//           <p className="text-sm text-gray-500">
//             Enterprise-grade PDF analysis powered by local AI models
//           </p>
//         </motion.div>
        
//         {/* Main CTA - Drop Zone */}
//         <motion.div
//           initial={{ opacity: 0, scale: 0.95 }}
//           animate={{ opacity: 1, scale: 1 }}
//           transition={{ delay: 0.2 }}
//           className="mb-12"
//         >
//           <Card className="bg-gradient-to-br from-cyan-500/10 to-purple-500/10 glow-cyan hover:glow-purple transition-all duration-500">
//             <div className="flex flex-col items-center py-8">
//               <Upload className="w-20 h-20 text-cyan-400 mb-4" />
//               <p className="text-xl font-medium text-white mb-2">
//                 Drop Your PDFs Here
//               </p>
//               <p className="text-sm text-gray-400 mb-6">
//                 All processing happens locally on your machine
//               </p>
//               <Button onClick={() => navigate('/workspace')}>
//                 <Zap className="w-5 h-5" />
//                 Start Analyzing
//               </Button>
//             </div>
//           </Card>
//         </motion.div>
        
//         {/* Features Grid */}
//         <div className="grid grid-cols-3 gap-6 mb-12">
//           {features.map((feature, idx) => (
//             <motion.div
//               key={idx}
//               initial={{ opacity: 0, y: 20 }}
//               animate={{ opacity: 1, y: 0 }}
//               transition={{ delay: 0.3 + idx * 0.1 }}
//             >
//               <Card hover>
//                 <feature.icon className="w-10 h-10 text-cyan-400 mx-auto mb-4" />
//                 <h3 className="font-semibold text-white text-center mb-2">
//                   {feature.title}
//                 </h3>
//                 <p className="text-sm text-gray-400 text-center leading-relaxed">
//                   {feature.desc}
//                 </p>
//               </Card>
//             </motion.div>
//           ))}
//         </div>
        
//         {/* Tech Stack */}
//         <motion.div
//           initial={{ opacity: 0 }}
//           animate={{ opacity: 1 }}
//           transition={{ delay: 0.6 }}
//           className="flex items-center justify-center gap-8 text-sm text-gray-500"
//         >
//           {techStack.map((tech, idx) => (
//             <div key={idx} className="flex items-center gap-2">
//               <tech.icon className="w-4 h-4 text-cyan-400" />
//               <span>{tech.label}</span>
//             </div>
//           ))}
//         </motion.div>
//       </div>
//     </div>
//   );
// }















// import React, { useState } from 'react';
// import { useNavigate } from 'react-router-dom';
// import { motion } from 'framer-motion';
// import { 
//   Upload, Shield, Zap, Brain, Lock, Cpu, Database, 
//   ArrowRight, CheckCircle, Sparkles, FileText, 
//   MessageSquare, BarChart3, Github, Twitter, Mail,
//   Globe, Server, HardDrive
// } from 'lucide-react';
// import Button from '../components/ui/Button';
// import Card from '../components/ui/Card';

// export default function Landing() {
//   const navigate = useNavigate();
//   const [hoveredFeature, setHoveredFeature] = useState(null);
  
//   const features = [
//     { 
//       icon: Shield, 
//       title: 'Privacy First', 
//       desc: 'Your data never leaves your device. Zero cloud, zero tracking, zero compromises.',
//       gradient: 'from-cyan-500 to-blue-500'
//     },
//     { 
//       icon: Zap, 
//       title: 'Lightning Fast', 
//       desc: 'Local LLMs with instant response. No network delays, no waiting.',
//       gradient: 'from-yellow-500 to-orange-500'
//     },
//     { 
//       icon: Brain, 
//       title: 'AI Powered', 
//       desc: 'Smart summaries & contextual Q&A. Multiple analysis personas for every use case.',
//       gradient: 'from-purple-500 to-pink-500'
//     }
//   ];
  
//   const capabilities = [
//     { icon: FileText, label: 'Document Analysis', desc: 'Extract insights from any PDF' },
//     { icon: MessageSquare, label: 'Contextual Q&A', desc: 'Ask questions, get grounded answers' },
//     { icon: BarChart3, label: 'Smart Summaries', desc: 'Persona-based summaries' },
//     { icon: Lock, label: 'Full Privacy', desc: '100% offline processing' }
//   ];
  
//   const techStack = [
//     { icon: Cpu, label: 'Local LLMs', detail: '360M/1B Models' },
//     { icon: Database, label: 'SQLite-vec', detail: 'Vector Database' },
//     { icon: Server, label: 'FastAPI', detail: 'Local Backend' },
//     { icon: HardDrive, label: 'Tauri', detail: 'Desktop App' }
//   ];
  
//   const stats = [
//     { value: '100%', label: 'Local Processing' },
//     { value: '0ms', label: 'Network Latency' },
//     { value: '∞', label: 'Documents' }
//   ];
  
//   return (
//     <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
//       {/* Hero Section */}
//       <section className="relative min-h-screen flex items-center justify-center px-8 py-20 overflow-hidden">
//         {/* Animated Background Elements */}
//         <div className="absolute inset-0 overflow-hidden pointer-events-none">
//           <motion.div
//             animate={{
//               scale: [1, 1.2, 1],
//               opacity: [0.3, 0.5, 0.3]
//             }}
//             transition={{ duration: 8, repeat: Infinity }}
//             className="absolute top-20 left-20 w-96 h-96 bg-cyan-500/20 rounded-full blur-3xl"
//           />
//           <motion.div
//             animate={{
//               scale: [1.2, 1, 1.2],
//               opacity: [0.3, 0.5, 0.3]
//             }}
//             transition={{ duration: 10, repeat: Infinity }}
//             className="absolute bottom-20 right-20 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl"
//           />
//         </div>
        
//         <div className="max-w-6xl w-full relative z-10">
//           {/* Main Hero Content */}
//           <motion.div
//             initial={{ opacity: 0, y: 30 }}
//             animate={{ opacity: 1, y: 0 }}
//             transition={{ duration: 0.8 }}
//             className="text-center mb-16"
//           >
//             <motion.div
//               initial={{ opacity: 0, scale: 0.9 }}
//               animate={{ opacity: 1, scale: 1 }}
//               transition={{ delay: 0.2 }}
//               className="inline-flex items-center gap-2 px-4 py-2 bg-cyan-500/10 border border-cyan-500/30 rounded-full mb-6"
//             >
//               <Sparkles className="w-4 h-4 text-cyan-400" />
//               <span className="text-sm text-cyan-300 font-medium">100% Local AI Processing</span>
//             </motion.div>
            
//             <h1 className="text-7xl font-bold text-white mb-6 leading-tight">
//               Analyze PDFs with
//               <br />
//               <span className="bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-400 bg-clip-text text-transparent">
//                 Private AI Intelligence
//               </span>
//             </h1>
            
//             <p className="text-2xl text-gray-300 mb-4 max-w-3xl mx-auto leading-relaxed">
//               Enterprise-grade document analysis powered by local AI models. 
//               <br />
//               <span className="text-gray-400">Your data stays on your machine. Always.</span>
//             </p>
            
//             <div className="flex items-center justify-center gap-6 text-sm text-gray-500 mb-12">
//               <div className="flex items-center gap-2">
//                 <CheckCircle className="w-4 h-4 text-green-400" />
//                 <span>No Cloud</span>
//               </div>
//               <div className="flex items-center gap-2">
//                 <CheckCircle className="w-4 h-4 text-green-400" />
//                 <span>No Tracking</span>
//               </div>
//               <div className="flex items-center gap-2">
//                 <CheckCircle className="w-4 h-4 text-green-400" />
//                 <span>No Limits</span>
//               </div>
//             </div>
//           </motion.div>
          
//           {/* CTA Drop Zone */}
//           <motion.div
//             initial={{ opacity: 0, y: 20 }}
//             animate={{ opacity: 1, y: 0 }}
//             transition={{ delay: 0.4 }}
//             className="mb-16"
//           >
//             <Card className="bg-gradient-to-br from-cyan-500/10 via-purple-500/10 to-pink-500/10 border-2 border-cyan-500/30 hover:border-cyan-500/50 transition-all duration-500 glow-cyan">
//               <div className="flex flex-col items-center py-12">
//                 <motion.div
//                   animate={{ y: [-5, 5, -5] }}
//                   transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
//                 >
//                   <div className="w-24 h-24 bg-gradient-to-br from-cyan-500 to-purple-500 rounded-2xl flex items-center justify-center mb-6 glow-cyan">
//                     <Upload className="w-12 h-12 text-white" />
//                   </div>
//                 </motion.div>
                
//                 <h3 className="text-2xl font-bold text-white mb-2">
//                   Drop Your PDFs Here
//                 </h3>
//                 <p className="text-gray-400 mb-8 max-w-md text-center">
//                   All processing happens locally on your machine. No uploads, no cloud storage.
//                 </p>
                
//                 <div className="flex gap-4">
//                   <Button 
//                     onClick={() => navigate('/workspace')}
//                     className="!px-8 !py-4 text-lg"
//                   >
//                     <Zap className="w-5 h-5" />
//                     Start Analyzing
//                     <ArrowRight className="w-5 h-5" />
//                   </Button>
//                   <Button 
//                     variant="outline"
//                     className="!px-8 !py-4 text-lg"
//                   >
//                     View Demo
//                   </Button>
//                 </div>
//               </div>
//             </Card>
//           </motion.div>
          
//           {/* Stats */}
//           <motion.div
//             initial={{ opacity: 0 }}
//             animate={{ opacity: 1 }}
//             transition={{ delay: 0.6 }}
//             className="grid grid-cols-3 gap-8 mb-16"
//           >
//             {stats.map((stat, idx) => (
//               <div key={idx} className="text-center">
//                 <div className="text-4xl font-bold bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent mb-2">
//                   {stat.value}
//                 </div>
//                 <div className="text-gray-400 text-sm">{stat.label}</div>
//               </div>
//             ))}
//           </motion.div>
//         </div>
//       </section>
      
//       {/* Features Section */}
//       <section className="px-8 py-20 relative">
//         <div className="max-w-6xl mx-auto">
//           <motion.div
//             initial={{ opacity: 0, y: 20 }}
//             whileInView={{ opacity: 1, y: 0 }}
//             viewport={{ once: true }}
//             className="text-center mb-16"
//           >
//             <h2 className="text-4xl font-bold text-white mb-4">
//               Why Choose Local Processing?
//             </h2>
//             <p className="text-xl text-gray-400">
//               Security, speed, and privacy without compromise
//             </p>
//           </motion.div>
          
//           <div className="grid grid-cols-3 gap-8">
//             {features.map((feature, idx) => (
//               <motion.div
//                 key={idx}
//                 initial={{ opacity: 0, y: 30 }}
//                 whileInView={{ opacity: 1, y: 0 }}
//                 viewport={{ once: true }}
//                 transition={{ delay: idx * 0.1 }}
//                 onMouseEnter={() => setHoveredFeature(idx)}
//                 onMouseLeave={() => setHoveredFeature(null)}
//               >
//                 <Card 
//                   hover 
//                   className={`h-full transition-all duration-500 ${
//                     hoveredFeature === idx ? 'border-cyan-500/50 glow-cyan' : ''
//                   }`}
//                 >
//                   <div className={`w-16 h-16 bg-gradient-to-br ${feature.gradient} rounded-xl flex items-center justify-center mb-6`}>
//                     <feature.icon className="w-8 h-8 text-white" />
//                   </div>
//                   <h3 className="text-xl font-semibold text-white mb-3">
//                     {feature.title}
//                   </h3>
//                   <p className="text-gray-400 leading-relaxed">
//                     {feature.desc}
//                   </p>
//                 </Card>
//               </motion.div>
//             ))}
//           </div>
//         </div>
//       </section>
      
//       {/* Capabilities Section */}
//       <section className="px-8 py-20 bg-slate-900/30">
//         <div className="max-w-6xl mx-auto">
//           <motion.div
//             initial={{ opacity: 0, y: 20 }}
//             whileInView={{ opacity: 1, y: 0 }}
//             viewport={{ once: true }}
//             className="text-center mb-16"
//           >
//             <h2 className="text-4xl font-bold text-white mb-4">
//               Powerful Capabilities
//             </h2>
//             <p className="text-xl text-gray-400">
//               Everything you need for intelligent document analysis
//             </p>
//           </motion.div>
          
//           <div className="grid grid-cols-2 gap-6">
//             {capabilities.map((capability, idx) => (
//               <motion.div
//                 key={idx}
//                 initial={{ opacity: 0, x: idx % 2 === 0 ? -20 : 20 }}
//                 whileInView={{ opacity: 1, x: 0 }}
//                 viewport={{ once: true }}
//                 transition={{ delay: idx * 0.1 }}
//               >
//                 <Card hover className="flex items-start gap-4">
//                   <div className="w-12 h-12 bg-cyan-500/20 rounded-lg flex items-center justify-center flex-shrink-0">
//                     <capability.icon className="w-6 h-6 text-cyan-400" />
//                   </div>
//                   <div>
//                     <h4 className="text-lg font-semibold text-white mb-1">
//                       {capability.label}
//                     </h4>
//                     <p className="text-gray-400 text-sm">{capability.desc}</p>
//                   </div>
//                 </Card>
//               </motion.div>
//             ))}
//           </div>
//         </div>
//       </section>
      
//       {/* Tech Stack Section */}
//       <section className="px-8 py-20">
//         <div className="max-w-6xl mx-auto">
//           <motion.div
//             initial={{ opacity: 0, y: 20 }}
//             whileInView={{ opacity: 1, y: 0 }}
//             viewport={{ once: true }}
//             className="text-center mb-12"
//           >
//             <h2 className="text-3xl font-bold text-white mb-4">
//               Built on Modern Technology
//             </h2>
//             <p className="text-gray-400">
//               Enterprise-grade stack for local AI processing
//             </p>
//           </motion.div>
          
//           <div className="grid grid-cols-4 gap-6">
//             {techStack.map((tech, idx) => (
//               <motion.div
//                 key={idx}
//                 initial={{ opacity: 0, scale: 0.9 }}
//                 whileInView={{ opacity: 1, scale: 1 }}
//                 viewport={{ once: true }}
//                 transition={{ delay: idx * 0.1 }}
//               >
//                 <Card hover className="text-center">
//                   <tech.icon className="w-10 h-10 text-cyan-400 mx-auto mb-3" />
//                   <h4 className="font-semibold text-white mb-1">{tech.label}</h4>
//                   <p className="text-xs text-gray-500">{tech.detail}</p>
//                 </Card>
//               </motion.div>
//             ))}
//           </div>
//         </div>
//       </section>
      
//       {/* CTA Section */}
//       <section className="px-8 py-20 bg-gradient-to-br from-cyan-500/10 to-purple-500/10">
//         <div className="max-w-4xl mx-auto text-center">
//           <motion.div
//             initial={{ opacity: 0, scale: 0.95 }}
//             whileInView={{ opacity: 1, scale: 1 }}
//             viewport={{ once: true }}
//           >
//             <h2 className="text-5xl font-bold text-white mb-6">
//               Ready to Analyze Privately?
//             </h2>
//             <p className="text-xl text-gray-300 mb-8">
//               Start processing your PDFs with complete privacy and zero cloud dependency
//             </p>
//             <Button 
//               onClick={() => navigate('/workspace')}
//               className="!px-10 !py-5 text-xl"
//             >
//               <Zap className="w-6 h-6" />
//               Get Started Now
//               <ArrowRight className="w-6 h-6" />
//             </Button>
//           </motion.div>
//         </div>
//       </section>
      
//       {/* Footer */}
//       <footer className="border-t border-white/10 px-8 py-12">
//         <div className="max-w-6xl mx-auto">
//           <div className="grid grid-cols-4 gap-8 mb-8">
//             {/* Brand Column */}
//             <div className="col-span-2">
//               <div className="flex items-center gap-3 mb-4">
//                 <div className="w-10 h-10 bg-gradient-to-br from-cyan-500 to-purple-500 rounded-lg flex items-center justify-center">
//                   <Shield className="w-6 h-6 text-white" />
//                 </div>
//                 <div>
//                   <h3 className="text-lg font-bold text-white">PDF Analyzer</h3>
//                   <p className="text-xs text-gray-500">Local AI Intelligence</p>
//                 </div>
//               </div>
//               <p className="text-sm text-gray-400 mb-4 max-w-sm">
//                 Enterprise-grade PDF analysis with 100% local processing. Your data never leaves your device.
//               </p>
//               <div className="flex gap-3">
//                 <a href="#" className="w-9 h-9 bg-white/5 hover:bg-white/10 rounded-lg flex items-center justify-center transition-colors">
//                   <Github className="w-4 h-4 text-gray-400" />
//                 </a>
//                 <a href="#" className="w-9 h-9 bg-white/5 hover:bg-white/10 rounded-lg flex items-center justify-center transition-colors">
//                   <Twitter className="w-4 h-4 text-gray-400" />
//                 </a>
//                 <a href="#" className="w-9 h-9 bg-white/5 hover:bg-white/10 rounded-lg flex items-center justify-center transition-colors">
//                   <Mail className="w-4 h-4 text-gray-400" />
//                 </a>
//               </div>
//             </div>
            
//             {/* Product Column */}
//             <div>
//               <h4 className="text-white font-semibold mb-4">Product</h4>
//               <ul className="space-y-2 text-sm">
//                 <li><a href="#" className="text-gray-400 hover:text-cyan-400 transition-colors">Features</a></li>
//                 <li><a href="#" className="text-gray-400 hover:text-cyan-400 transition-colors">Documentation</a></li>
//                 <li><a href="#" className="text-gray-400 hover:text-cyan-400 transition-colors">Pricing</a></li>
//                 <li><a href="#" className="text-gray-400 hover:text-cyan-400 transition-colors">Roadmap</a></li>
//               </ul>
//             </div>
            
//             {/* Resources Column */}
//             <div>
//               <h4 className="text-white font-semibold mb-4">Resources</h4>
//               <ul className="space-y-2 text-sm">
//                 <li><a href="#" className="text-gray-400 hover:text-cyan-400 transition-colors">Blog</a></li>
//                 <li><a href="#" className="text-gray-400 hover:text-cyan-400 transition-colors">Guides</a></li>
//                 <li><a href="#" className="text-gray-400 hover:text-cyan-400 transition-colors">Support</a></li>
//                 <li><a href="#" className="text-gray-400 hover:text-cyan-400 transition-colors">Privacy Policy</a></li>
//               </ul>
//             </div>
//           </div>
          
//           {/* Bottom Bar */}
//           <div className="pt-8 border-t border-white/10 flex items-center justify-between text-sm text-gray-500">
//             <p>© 2025 PDF Analyzer. All rights reserved.</p>
//             <div className="flex items-center gap-2">
//               <Globe className="w-4 h-4" />
//               <span>100% Local Processing</span>
//             </div>
//           </div>
//         </div>
//       </footer>
//     </div>
//   );
// }
















import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  Upload, Shield, Zap, Brain, Lock, Cpu, Database, 
  ArrowRight, CheckCircle, Sparkles, FileText, 
  MessageSquare, BarChart3, Github, Twitter, Mail, Globe
} from 'lucide-react';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';

export default function Landing() {
  const navigate = useNavigate();
  const [hoveredFeature, setHoveredFeature] = useState(null);
  
  const features = [
    { 
      icon: Shield, 
      title: 'Privacy First', 
      desc: 'Your data never leaves your device. Zero cloud, zero tracking.',
      gradient: 'from-cyan-500 to-blue-500'
    },
    { 
      icon: Zap, 
      title: 'Lightning Fast', 
      desc: 'Local LLMs with instant response. No network delays.',
      gradient: 'from-yellow-500 to-orange-500'
    },
    { 
      icon: Brain, 
      title: 'AI Powered', 
      desc: 'Smart summaries & Q&A. Multiple analysis personas.',
      gradient: 'from-purple-500 to-pink-500'
    }
  ];
  
  const capabilities = [
    { icon: FileText, label: 'Document Analysis', desc: 'Extract insights from any PDF' },
    { icon: MessageSquare, label: 'Contextual Q&A', desc: 'Get grounded answers' },
    { icon: BarChart3, label: 'Smart Summaries', desc: 'Persona-based analysis' },
    { icon: Lock, label: 'Full Privacy', desc: '100% offline processing' }
  ];
  
  const techStack = [
    { icon: Cpu, label: 'Local LLMs', detail: '360M/1B' },
    { icon: Database, label: 'SQLite-vec', detail: 'Vector DB' },
    { icon: Shield, label: 'FastAPI', detail: 'Local API' },
    { icon: Lock, label: 'Tauri', detail: 'Desktop' }
  ];
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center px-8 py-20 overflow-hidden">
        {/* Animated Background */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <motion.div
            animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.5, 0.3] }}
            transition={{ duration: 8, repeat: Infinity }}
            className="absolute top-20 left-20 w-96 h-96 bg-cyan-500/20 rounded-full blur-3xl"
          />
          <motion.div
            animate={{ scale: [1.2, 1, 1.2], opacity: [0.3, 0.5, 0.3] }}
            transition={{ duration: 10, repeat: Infinity }}
            className="absolute bottom-20 right-20 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl"
          />
        </div>
        
        <div className="max-w-6xl w-full relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-16"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 }}
              className="inline-flex items-center gap-2 px-4 py-2 bg-cyan-500/10 border border-cyan-500/30 rounded-full mb-6"
            >
              <Sparkles className="w-4 h-4 text-cyan-400" />
              <span className="text-sm text-cyan-300 font-medium">100% Local AI Processing</span>
            </motion.div>
            
            <h1 className="text-7xl font-bold text-white mb-6 leading-tight">
              Analyze PDFs with
              <br />
              <span className="bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-400 bg-clip-text text-transparent">
                Private AI Intelligence
              </span>
            </h1>
            
            <p className="text-2xl text-gray-300 mb-4 max-w-3xl mx-auto">
              Enterprise-grade document analysis powered by local AI.
              <br />
              <span className="text-gray-400">Your data stays on your machine. Always.</span>
            </p>
            
            <div className="flex items-center justify-center gap-6 text-sm text-gray-500 mb-12">
              {['No Cloud', 'No Tracking', 'No Limits'].map((text, i) => (
                <div key={i} className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-400" />
                  <span>{text}</span>
                </div>
              ))}
            </div>
          </motion.div>
          
          {/* CTA Drop Zone */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="mb-16"
          >
            <Card className="bg-gradient-to-br from-cyan-500/10 via-purple-500/10 to-pink-500/10 border-2 border-cyan-500/30 hover:border-cyan-500/50 glow-cyan">
              <div className="flex flex-col items-center py-12">
                <motion.div animate={{ y: [-5, 5, -5] }} transition={{ duration: 3, repeat: Infinity }}>
                  <div className="w-24 h-24 bg-gradient-to-br from-cyan-500 to-purple-500 rounded-2xl flex items-center justify-center mb-6 glow-cyan">
                    <Upload className="w-12 h-12 text-white" />
                  </div>
                </motion.div>
                
                <h3 className="text-2xl font-bold text-white mb-2">Drop Your PDFs Here</h3>
                <p className="text-gray-400 mb-8">All processing happens locally on your machine</p>
                
                <div className="flex gap-4">
                  <Button onClick={() => navigate('/workspace')} className="!px-8 !py-4 text-lg">
                    <Zap className="w-5 h-5" />
                    Start Analyzing
                    <ArrowRight className="w-5 h-5" />
                  </Button>
                  <Button variant="outline" className="!px-8 !py-4 text-lg">View Demo</Button>
                </div>
              </div>
            </Card>
          </motion.div>
        </div>
      </section>
      
      {/* Features */}
      <section className="px-8 py-20">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold text-white mb-4">Why Local Processing?</h2>
            <p className="text-xl text-gray-400">Security, speed, and privacy</p>
          </motion.div>
          
          <div className="grid grid-cols-3 gap-8">
            {features.map((feature, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
                onMouseEnter={() => setHoveredFeature(idx)}
                onMouseLeave={() => setHoveredFeature(null)}
              >
                <Card hover className={`h-full ${hoveredFeature === idx ? 'border-cyan-500/50 glow-cyan' : ''}`}>
                  <div className={`w-16 h-16 bg-gradient-to-br ${feature.gradient} rounded-xl flex items-center justify-center mb-6`}>
                    <feature.icon className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-xl font-semibold text-white mb-3">{feature.title}</h3>
                  <p className="text-gray-400 leading-relaxed">{feature.desc}</p>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
      
      {/* Capabilities */}
      <section className="px-8 py-20 bg-slate-900/30">
        <div className="max-w-6xl mx-auto">
          <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} className="text-center mb-16">
            <h2 className="text-4xl font-bold text-white mb-4">Powerful Capabilities</h2>
          </motion.div>
          
          <div className="grid grid-cols-2 gap-6">
            {capabilities.map((cap, idx) => (
              <motion.div key={idx} initial={{ opacity: 0, x: idx % 2 ? 20 : -20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}>
                <Card hover className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-cyan-500/20 rounded-lg flex items-center justify-center">
                    <cap.icon className="w-6 h-6 text-cyan-400" />
                  </div>
                  <div>
                    <h4 className="text-lg font-semibold text-white mb-1">{cap.label}</h4>
                    <p className="text-gray-400 text-sm">{cap.desc}</p>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
      
      {/* Tech Stack */}
      <section className="px-8 py-20">
        <div className="max-w-6xl mx-auto">
          <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} className="text-center mb-12">
            <h2 className="text-3xl font-bold text-white mb-4">Built on Modern Technology</h2>
          </motion.div>
          
          <div className="grid grid-cols-4 gap-6">
            {techStack.map((tech, idx) => (
              <motion.div key={idx} initial={{ opacity: 0, scale: 0.9 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }}>
                <Card hover className="text-center">
                  <tech.icon className="w-10 h-10 text-cyan-400 mx-auto mb-3" />
                  <h4 className="font-semibold text-white mb-1">{tech.label}</h4>
                  <p className="text-xs text-gray-500">{tech.detail}</p>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
      
      {/* Footer */}
      <footer className="border-t border-white/10 px-8 py-12">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-4 gap-8 mb-8">
            <div className="col-span-2">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-gradient-to-br from-cyan-500 to-purple-500 rounded-lg flex items-center justify-center">
                  <Shield className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white">PDF Analyzer</h3>
                  <p className="text-xs text-gray-500">Local AI Intelligence</p>
                </div>
              </div>
              <p className="text-sm text-gray-400 mb-4">100% local PDF analysis</p>
              <div className="flex gap-3">
                {[Github, Twitter, Mail].map((Icon, i) => (
                  <a key={i} href="#" className="w-9 h-9 bg-white/5 hover:bg-white/10 rounded-lg flex items-center justify-center">
                    <Icon className="w-4 h-4 text-gray-400" />
                  </a>
                ))}
              </div>
            </div>
            
            <div>
              <h4 className="text-white font-semibold mb-4">Product</h4>
              <ul className="space-y-2 text-sm">
                {['Features', 'Documentation', 'Pricing', 'Roadmap'].map(item => (
                  <li key={item}><a href="#" className="text-gray-400 hover:text-cyan-400">{item}</a></li>
                ))}
              </ul>
            </div>
            
            <div>
              <h4 className="text-white font-semibold mb-4">Resources</h4>
              <ul className="space-y-2 text-sm">
                {['Blog', 'Guides', 'Support', 'Privacy'].map(item => (
                  <li key={item}><a href="#" className="text-gray-400 hover:text-cyan-400">{item}</a></li>
                ))}
              </ul>
            </div>
          </div>
          
          <div className="pt-8 border-t border-white/10 flex justify-between text-sm text-gray-500">
            <p>© 2025 PDF Analyzer</p>
            <div className="flex items-center gap-2">
              <Globe className="w-4 h-4" />
              <span>100% Local Processing</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}