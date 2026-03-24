import React, { useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Sparkles, User } from 'lucide-react';
import ScrollArea from '../ui/ScrollArea';
import SourceCard from './SourceCard';

export default function ChatWindow({ messages }) {
  const bottomRef = useRef(null);
  
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);
  
  return (
    <ScrollArea className="space-y-4 h-96">
      {messages.map((msg, idx) => (
        <motion.div
          key={idx}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: idx * 0.1 }}
          className={`flex gap-3 ${msg.role === 'user' ? 'justify-end' : ''}`}
        >
          {/* AI Avatar */}
          {msg.role === 'ai' && (
            <div className="w-8 h-8 bg-gradient-to-br from-cyan-500 to-purple-500 rounded-full flex items-center justify-center flex-shrink-0">
              <Sparkles className="w-4 h-4 text-white" />
            </div>
          )}
          
          {/* Message Content */}
          <div className={`max-w-[80%] ${
            msg.role === 'user' 
              ? 'bg-cyan-500/20 border-cyan-500/30' 
              : 'bg-white/5 border-white/10'
          } border rounded-lg p-4`}>
            <p className="text-sm text-gray-200 leading-relaxed">{msg.content}</p>
            
            {/* Source Citation */}
            {msg.source && (
              <SourceCard pageNumber={msg.source} className="mt-3" />
            )}
            
            {/* Thinking Indicator */}
            {msg.thinking && (
              <div className="flex items-center gap-2 mt-2 text-xs text-gray-400">
                <div className="flex gap-1">
                  <div className="w-1.5 h-1.5 bg-cyan-400 rounded-full animate-bounce"></div>
                  <div className="w-1.5 h-1.5 bg-cyan-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                  <div className="w-1.5 h-1.5 bg-cyan-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                </div>
                <span>AI thinking...</span>
              </div>
            )}
          </div>
          
          {/* User Avatar */}
          {msg.role === 'user' && (
            <div className="w-8 h-8 bg-slate-700 rounded-full flex items-center justify-center flex-shrink-0">
              <User className="w-4 h-4 text-gray-300" />
            </div>
          )}
        </motion.div>
      ))}
      <div ref={bottomRef} />
    </ScrollArea>
  );
}