import React, { useState } from 'react';
import { MessageSquare, Send } from 'lucide-react';
import Button from '../ui/Button';

export default function ChatInput({ onSend, disabled = false }) {
  const [input, setInput] = useState('');
  
  const handleSend = () => {
    if (input.trim() && !disabled) {
      onSend(input);
      setInput('');
    }
  };
  
  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };
  
  return (
    <div className="flex gap-2">
      <div className="flex-1 relative">
        <MessageSquare className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="Ask anything about this PDF..."
          disabled={disabled}
          className="w-full bg-white/5 border border-white/10 rounded-lg pl-10 pr-4 py-3 text-gray-300 placeholder-gray-500 focus:border-cyan-500/50 transition-colors disabled:opacity-50"
        />
      </div>
      
      <Button 
        onClick={handleSend} 
        disabled={!input.trim() || disabled}
      >
        <Send className="w-5 h-5" />
        Send
      </Button>
    </div>
  );
}