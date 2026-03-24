// import React from 'react';
// import { motion } from 'framer-motion';
// import { User, Brain, Scale } from 'lucide-react';
// import Card from '../ui/Card';

// export default function PersonaSelector({ selectedPersona, setSelectedPersona }) {
//   const personas = [
//     { 
//       id: 'executive', 
//       icon: User, 
//       label: 'Executive', 
//       color: 'cyan', 
//       desc: 'High-level insights',
//       features: 'Strategic summaries, KPIs, action items'
//     },
//     { 
//       id: 'researcher', 
//       icon: Brain, 
//       label: 'Researcher', 
//       color: 'purple', 
//       desc: 'Deep analysis',
//       features: 'Detailed findings, methodology, citations'
//     },
//     { 
//       id: 'legal', 
//       icon: Scale, 
//       label: 'Legal', 
//       color: 'green', 
//       desc: 'Compliance focus',
//       features: 'Risk assessment, obligations, clauses'
//     }
//   ];
  
//   return (
//     <Card>
//       <h3 className="text-lg font-semibold text-white mb-4">Analysis Persona</h3>
//       <p className="text-sm text-gray-400 mb-4">
//         Choose how the AI should analyze your document
//       </p>
      
//       <div className="grid grid-cols-3 gap-3">
//         {personas.map(persona => {
//           const isSelected = selectedPersona === persona.id;
//           return (
//             <motion.button
//               key={persona.id}
//               whileHover={{ scale: 1.05, y: -2 }}
//               whileTap={{ scale: 0.98 }}
//               onClick={() => setSelectedPersona(persona.id)}
//               className={`p-4 rounded-lg border transition-all ${
//                 isSelected
//                   ? 'bg-cyan-500/20 border-cyan-500/50 text-cyan-300 glow-cyan-soft'
//                   : 'bg-white/5 border-white/10 text-gray-400 hover:border-white/20'
//               }`}
//             >
//               <persona.icon className={`w-6 h-6 mx-auto mb-2 ${
//                 isSelected ? 'text-cyan-400' : 'text-gray-500'
//               }`} />
//               <p className="text-sm font-medium mb-1">{persona.label}</p>
//               <p className="text-xs opacity-70">{persona.desc}</p>
//             </motion.button>
//           );
//         })}
//       </div>
      
//       {/* Selected Persona Details */}
//       <div className="mt-4 p-4 bg-white/5 rounded-lg border border-white/10">
//         <p className="text-xs text-gray-400 mb-1">Active Mode:</p>
//         <p className="text-sm text-white font-medium">
//           {personas.find(p => p.id === selectedPersona)?.features}
//         </p>
//       </div>
//     </Card>
//   );
// }












import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ChevronDown, User, Scale, Brain, Settings, 
  Apple, ShieldCheck, TrendingUp, Stethoscope, 
  PenTool, Search, Info 
} from 'lucide-react';
import Card from '../ui/Card';

export default function PersonaSelector({ selectedPersona, setSelectedPersona }) {
  const [isOpen, setIsOpen] = useState(false);

  const personas = [
    { id: 'executive', icon: User, label: 'Executive', desc: 'Bottom-line & action items', color: 'text-blue-400' },
    { id: 'legal', icon: Scale, label: 'Legal Reviewer', desc: 'Risks & obligations', color: 'text-red-400' },
    { id: 'researcher', icon: Brain, label: 'Academic Researcher', desc: 'Methodology & evidence', color: 'text-purple-400' },
    { id: 'tech', icon: Settings, label: 'Technical Lead', desc: 'Specs & constraints', color: 'text-orange-400' },
    { id: 'teacher', icon: Apple, label: 'Educational Tutor', desc: 'Simple ELI5 explanations', color: 'text-green-400' },
    { id: 'compliance', icon: ShieldCheck, label: 'Compliance Officer', desc: 'Regulatory gaps & safety', color: 'text-yellow-400' },
    { id: 'finance', icon: TrendingUp, label: 'Financial Analyst', desc: 'Revenue & metrics', color: 'text-emerald-400' },
    { id: 'medical', icon: Stethoscope, label: 'Medical Specialist', desc: 'Clinical findings', color: 'text-rose-400' },
    { id: 'writer', icon: PenTool, label: 'Content Creator', desc: 'Creative hooks & themes', color: 'text-pink-400' },
    { id: 'journalist', icon: Search, label: 'Investigative Journalist', desc: 'Hidden facts & stories', color: 'text-cyan-400' },
  ];

  const currentPersona = personas.find(p => p.id === selectedPersona) || personas[0];

  return (
    <Card className="relative overflow-visible">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-lg font-semibold text-white">Analysis Persona</h3>
          <p className="text-sm text-gray-400">Select an expert lens for your document</p>
        </div>
        <div className="bg-blue-500/10 p-2 rounded-full">
          <Info size={16} className="text-blue-400" />
        </div>
      </div>

      {/* Custom Dropdown Trigger */}
      <div className="relative">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="w-full flex items-center justify-between p-4 bg-white/5 border border-white/10 rounded-xl hover:bg-white/10 transition-all text-left"
        >
          <div className="flex items-center gap-3">
            <currentPersona.icon className={`w-5 h-5 ${currentPersona.color}`} />
            <div>
              <p className="text-sm font-medium text-white">{currentPersona.label}</p>
              <p className="text-xs text-gray-400">{currentPersona.desc}</p>
            </div>
          </div>
          <ChevronDown className={`transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} />
        </button>

        {/* Dropdown Menu */}
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              className="absolute z-50 w-full mt-2 bg-[#1E293B] border border-white/10 rounded-xl shadow-2xl max-h-80 overflow-y-auto custom-scrollbar"
            >
              {personas.map((persona) => (
                <button
                  key={persona.id}
                  onClick={() => {
                    setSelectedPersona(persona.id);
                    setIsOpen(false);
                  }}
                  className={`w-full flex items-center gap-3 p-3 hover:bg-white/5 transition-colors border-l-4 ${
                    selectedPersona === persona.id ? 'border-blue-500 bg-blue-500/5' : 'border-transparent'
                  }`}
                >
                  <persona.icon className={`w-5 h-5 flex-shrink-0 ${persona.color}`} />
                  <div className="text-left">
                    <p className="text-sm font-medium text-white">{persona.label}</p>
                    <p className="text-xs text-gray-400">{persona.desc}</p>
                  </div>
                </button>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Accuracy Tip */}
      <div className="mt-4 flex gap-2 items-start p-3 bg-blue-500/5 rounded-lg border border-blue-500/20">
        <div className="mt-0.5">🚀</div>
        <p className="text-xs text-blue-200/70 leading-relaxed">
          <strong>Tip:</strong> The <span className="text-blue-300">{currentPersona.label}</span> persona uses optimized prompts tailored for offline analysis to ensure the highest accuracy.
        </p>
      </div>
    </Card>
  );
}
