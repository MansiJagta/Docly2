// import React, { useState } from 'react';
// import FileUploader from '../components/dashboard/FileUploader';
// import PDFRenderer from '../components/dashboard/PDFRenderer';
// import PersonaSelector from '../components/dashboard/PersonaSelector';
// import ChatWindow from '../components/chat/ChatWindow';
// import ChatInput from '../components/chat/ChatInput';
// import Card from '../components/ui/Card';
// import { MessageSquare } from 'lucide-react';
// import { useLocalAI } from '../hooks/useLocalAI';

// export default function Workspace({ currentDocument, setCurrentDocument }) {
//   const [selectedPersona, setSelectedPersona] = useState('executive');
//   const [messages, setMessages] = useState([
//     { 
//       role: 'ai', 
//       content: 'Hello! Upload a PDF to get started with AI-powered analysis. I can provide summaries, answer questions, and extract insights based on your selected persona.',
//       source: null 
//     }
//   ]);
  
//   const { processDocument, askQuestion } = useLocalAI();
  
//   const handleFileUpload = async (file) => {
//     setCurrentDocument(file);
    
//     // Simulate processing
//     setMessages(prev => [...prev, {
//       role: 'ai',
//       content: `Processing "${file.name}"... Extracting text and building vector index.`,
//       thinking: true
//     }]);
    
//     // In real implementation, call your FastAPI backend
//     // await processDocument(file, selectedPersona);
    
//     setTimeout(() => {
//       setMessages(prev => [
//         ...prev.filter(m => !m.thinking),
//         {
//           role: 'ai',
//           content: `Document "${file.name}" has been processed successfully! I'm ready to answer your questions as a ${selectedPersona}.`,
//           source: null
//         }
//       ]);
//     }, 2000);
//   };
  
//   const handleSendMessage = async (content) => {
//     setMessages(prev => [...prev, { role: 'user', content }]);
    
//     // Simulate AI response
//     setMessages(prev => [...prev, {
//       role: 'ai',
//       content: 'Analyzing document...',
//       thinking: true
//     }]);
    
//     // In real implementation, call your FastAPI backend
//     // const response = await askQuestion(content, selectedPersona);
    
//     setTimeout(() => {
//       setMessages(prev => [
//         ...prev.filter(m => !m.thinking),
//         {
//           role: 'ai',
//           content: 'Based on the document analysis, here are the key insights relevant to your question. The information has been retrieved from the vector database with high relevance scores.',
//           source: 3
//         }
//       ]);
//     }, 1500);
//   };
  
//   return (
//     <div className="grid grid-cols-2 gap-6 p-6 h-full">
//       {/* Left Panel - PDF Viewer */}
//       <div className="space-y-6">
//         {currentDocument ? (
//           <PDFRenderer fileName={currentDocument.name} />
//         ) : (
//           <FileUploader onFileUpload={handleFileUpload} />
//         )}
//       </div>
      
//       {/* Right Panel - Intelligence Hub */}
//       <div className="space-y-6 overflow-y-auto">
//         {/* Persona Selection */}
//         <PersonaSelector 
//           selectedPersona={selectedPersona} 
//           setSelectedPersona={setSelectedPersona} 
//         />
        
//         {/* Q&A Section */}
//         <Card>
//           <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
//             <MessageSquare className="w-5 h-5 text-cyan-400" />
//             Intelligence Q&A
//           </h3>
//           <ChatWindow messages={messages} />
//           <div className="mt-4">
//             <ChatInput 
//               onSend={handleSendMessage}
//               disabled={!currentDocument}
//             />
//           </div>
//         </Card>
//       </div>
//     </div>
//   );
// }



















import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Sparkles, Download, Share2, RotateCw, Loader2, 
  TrendingUp, CheckCircle2, AlertCircle, Target, Clock
} from 'lucide-react';
import FileUploader from '../components/dashboard/FileUploader';
import PDFRenderer from '../components/dashboard/PDFRenderer';
import PersonaSelector from '../components/dashboard/PersonaSelector';
import ChatWindow from '../components/chat/ChatWindow';
import ChatInput from '../components/chat/ChatInput';
import Card from '../components/ui/Card';
import Badge from '../components/ui/Badge';
import Button from '../components/ui/Button';
import { useLocalAI } from '../hooks/useLocalAI';

export default function Workspace({ currentDocument, setCurrentDocument }) {
  const [selectedPersona, setSelectedPersona] = useState('executive');
  const [messages, setMessages] = useState([
    { 
      role: 'ai', 
      content: 'Hello! Upload a PDF to get started with AI-powered analysis. I can provide summaries, answer questions, and extract insights based on your selected persona.',
      source: null 
    }
  ]);
  const [summary, setSummary] = useState(null);
  const [isGeneratingSummary, setIsGeneratingSummary] = useState(false);
  const [documentStats, setDocumentStats] = useState(null);
  const [keyInsights, setKeyInsights] = useState([]);
  
  const { processDocument, askQuestion } = useLocalAI();
  
  useEffect(() => {
    if (currentDocument) {
      generateSummary();
      generateInsights();
    }
  }, [currentDocument, selectedPersona]);
  
  const generateSummary = () => {
    setIsGeneratingSummary(true);
    
    setTimeout(() => {
      const summaries = {
        executive: "Key highlights: Revenue increased by 23% YoY. Major expansion in APAC markets. Strategic partnership with industry leaders announced. Q4 projections exceed initial targets by 15%.",
        researcher: "This paper presents a novel approach to transformer architectures, introducing a sparse attention mechanism that reduces computational complexity from O(n²) to O(n log n). The methodology employs innovative matrix decomposition techniques.",
        legal: "Contract terms: 5-year agreement with automatic renewal clauses. Liability capped at $10M. Force majeure provisions included. IP rights transfer upon project completion. Arbitration required for dispute resolution."
      };
      
      setSummary(summaries[selectedPersona]);
      setDocumentStats({
        pages: 24,
        words: 12450,
        processingTime: '2.3s',
        confidence: 95
      });
      setIsGeneratingSummary(false);
    }, 2000);
  };
  
  const generateInsights = () => {
    const insights = {
      executive: [
        { icon: TrendingUp, text: '23% Revenue Growth', color: 'green' },
        { icon: Target, text: '5 Key Strategic Goals', color: 'cyan' },
        { icon: AlertCircle, text: '2 Risk Factors', color: 'yellow' }
      ],
      researcher: [
        { icon: Sparkles, text: 'Novel Algorithm Proposed', color: 'purple' },
        { icon: Target, text: '94% Accuracy Achieved', color: 'green' },
        { icon: Clock, text: '40% Speed Improvement', color: 'cyan' }
      ],
      legal: [
        { icon: CheckCircle2, text: '12 Contract Clauses', color: 'green' },
        { icon: AlertCircle, text: '3 Liability Caps', color: 'yellow' },
        { icon: Clock, text: '5-Year Term', color: 'cyan' }
      ]
    };
    setKeyInsights(insights[selectedPersona]);
  };
  
  const handleFileUpload = async (file) => {
    setCurrentDocument(file);
    setSummary(null);
    setDocumentStats(null);
    setKeyInsights([]);
    
    setMessages([{
      role: 'ai',
      content: `Processing "${file.name}"... Extracting text, building vector index, and analyzing content.`,
      thinking: true
    }]);
    
    setTimeout(() => {
      setMessages([
        {
          role: 'ai',
          content: `✓ Document "${file.name}" processed successfully! Vector embeddings created and indexed. I'm ready to answer your questions in ${selectedPersona} mode.`,
          source: null
        }
      ]);
    }, 2000);
  };
  
  const handleSendMessage = async (content) => {
    setMessages(prev => [...prev, { role: 'user', content }]);
    
    setMessages(prev => [...prev, {
      role: 'ai',
      content: 'Searching through document and generating response...',
      thinking: true
    }]);
    
    setTimeout(() => {
      setMessages(prev => [
        ...prev.filter(m => !m.thinking),
        {
          role: 'ai',
          content: 'Based on the document analysis, here are the key insights relevant to your question. The information has been retrieved from the vector database with high relevance scores and cross-referenced with the original text.',
          source: 3
        }
      ]);
    }, 1500);
  };
  
  return (
    <div className="h-full flex flex-col">
      {/* Top Action Bar */}
      {currentDocument && (
        <div className="border-b border-white/10 bg-slate-900/30 px-6 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="text-white font-medium truncate max-w-md">{currentDocument.name}</span>
              {documentStats && (
                <>
                  <Badge variant="default">{documentStats.pages} pages</Badge>
                  <Badge variant="green">{documentStats.confidence}% confidence</Badge>
                </>
              )}
            </div>
            
            <div className="flex items-center gap-2">
              <Button variant="ghost" className="!py-2">
                <Download className="w-4 h-4" />
                Export
              </Button>
              <Button variant="ghost" className="!py-2">
                <Share2 className="w-4 h-4" />
                Share
              </Button>
            </div>
          </div>
        </div>
      )}
      
      {/* Main Workspace */}
      <div className="flex-1 grid grid-cols-2 gap-6 p-6 overflow-hidden">
        {/* Left Panel */}
        <div className="space-y-4 overflow-y-auto">
          {currentDocument ? (
            <>
              <PDFRenderer fileName={currentDocument.name} />
              
              {/* Key Insights */}
              {keyInsights.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  <Card className="bg-gradient-to-br from-cyan-500/10 to-purple-500/10 border-cyan-500/30">
                    <h3 className="font-semibold text-white mb-4 flex items-center gap-2">
                      <Sparkles className="w-5 h-5 text-cyan-400" />
                      Key Insights
                    </h3>
                    <div className="space-y-3">
                      {keyInsights.map((insight, idx) => (
                        <div key={idx} className="flex items-center gap-3 p-3 bg-white/5 rounded-lg">
                          <insight.icon className={`w-5 h-5 text-${insight.color}-400`} />
                          <span className="text-sm text-gray-300">{insight.text}</span>
                        </div>
                      ))}
                    </div>
                  </Card>
                </motion.div>
              )}
              
              {/* Document Stats */}
              {documentStats && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  <Card>
                    <h3 className="font-semibold text-white mb-4">Document Metrics</h3>
                    <div className="grid grid-cols-3 gap-4">
                      <div>
                        <p className="text-2xl font-bold text-white">{documentStats.pages}</p>
                        <p className="text-xs text-gray-400">Pages</p>
                      </div>
                      <div>
                        <p className="text-2xl font-bold text-white">{documentStats.words.toLocaleString()}</p>
                        <p className="text-xs text-gray-400">Words</p>
                      </div>
                      <div>
                        <p className="text-2xl font-bold text-white">{documentStats.processingTime}</p>
                        <p className="text-xs text-gray-400">Processed</p>
                      </div>
                    </div>
                  </Card>
                </motion.div>
              )}
            </>
          ) : (
            <FileUploader onFileUpload={handleFileUpload} />
          )}
        </div>
        
        {/* Right Panel */}
        <div className="space-y-4 overflow-y-auto">
          <PersonaSelector 
            selectedPersona={selectedPersona} 
            setSelectedPersona={setSelectedPersona} 
          />
          
          {/* AI Summary */}
          <AnimatePresence>
            {currentDocument && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
              >
                <Card className="border-purple-500/30 bg-gradient-to-br from-purple-500/10 to-pink-500/10">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                      <Sparkles className="w-5 h-5 text-purple-400" />
                      <h3 className="font-semibold text-white">AI Summary</h3>
                    </div>
                    {!isGeneratingSummary && summary && (
                      <Button variant="ghost" className="!py-1 !px-3" onClick={generateSummary}>
                        <RotateCw className="w-3 h-3" />
                      </Button>
                    )}
                  </div>
                  
                  {isGeneratingSummary ? (
                    <div className="flex items-center justify-center py-8">
                      <Loader2 className="w-6 h-6 text-purple-400 animate-spin" />
                      <span className="ml-2 text-gray-400">Generating...</span>
                    </div>
                  ) : summary ? (
                    <p className="text-sm text-gray-300 leading-relaxed">{summary}</p>
                  ) : null}
                </Card>
              </motion.div>
            )}
          </AnimatePresence>
          
          {/* Q&A Section */}
          <Card className="flex-1 flex flex-col">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-cyan-400" />
                Intelligence Q&A
              </h3>
              {currentDocument && (
                <Badge variant="green">
                  <CheckCircle2 className="w-3 h-3" />
                  Ready
                </Badge>
              )}
            </div>
            
            {!currentDocument && (
              <div className="flex items-center gap-2 mb-4 p-3 bg-yellow-500/10 border border-yellow-500/30 rounded-lg">
                <AlertCircle className="w-4 h-4 text-yellow-400" />
                <span className="text-sm text-yellow-300">Upload a PDF to enable Q&A</span>
              </div>
            )}
            
            <ChatWindow messages={messages} />
            <div className="mt-4">
              <ChatInput 
                onSend={handleSendMessage}
                disabled={!currentDocument}
              />
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}