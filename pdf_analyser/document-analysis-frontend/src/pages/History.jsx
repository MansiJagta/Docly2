import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FileText, Clock, Trash2 } from 'lucide-react';
import Card from '../components/ui/Card';
import Badge from '../components/ui/Badge';
import Button from '../components/ui/Button';

export default function History({ setCurrentDocument }) {
  const navigate = useNavigate();
  
  const [sessions, setSessions] = useState([
    { 
      id: 1, 
      name: 'Financial Report Q3.pdf', 
      date: '2 hours ago', 
      persona: 'Executive',
      pages: 24,
      questions: 12
    },
    { 
      id: 2, 
      name: 'Research Paper ML.pdf', 
      date: 'Yesterday', 
      persona: 'Researcher',
      pages: 48,
      questions: 23
    },
    { 
      id: 3, 
      name: 'Legal Contract.pdf', 
      date: '3 days ago', 
      persona: 'Legal',
      pages: 15,
      questions: 8
    },
    { 
      id: 4, 
      name: 'Technical Whitepaper.pdf', 
      date: '1 week ago', 
      persona: 'Researcher',
      pages: 62,
      questions: 31
    }
  ]);
  
  const handleOpenSession = (session) => {
    // In real implementation, load the session data
    setCurrentDocument({ name: session.name });
    navigate('/workspace');
  };
  
  const handleDeleteSession = (id) => {
    setSessions(prev => prev.filter(s => s.id !== id));
  };
  
  return (
    <div className="p-6 max-w-5xl mx-auto">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-white mb-2">Analysis History</h2>
        <p className="text-gray-400">Your previous document analysis sessions</p>
      </div>
      
      {sessions.length === 0 ? (
        <Card>
          <div className="text-center py-12">
            <FileText className="w-16 h-16 text-gray-600 mx-auto mb-4" />
            <p className="text-gray-400 mb-2">No analysis history yet</p>
            <p className="text-sm text-gray-500">
              Upload a PDF to start analyzing documents
            </p>
          </div>
        </Card>
      ) : (
        <div className="space-y-4">
          {sessions.map(session => (
            <Card 
              key={session.id} 
              hover 
              onClick={() => handleOpenSession(session)}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4 flex-1">
                  <div className="w-12 h-12 bg-cyan-500/20 rounded-lg flex items-center justify-center flex-shrink-0">
                    <FileText className="w-6 h-6 text-cyan-400" />
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <h3 className="font-medium text-white mb-1 truncate">
                      {session.name}
                    </h3>
                    <div className="flex items-center gap-4 text-xs text-gray-400">
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {session.date}
                      </span>
                      <span>{session.pages} pages</span>
                      <span>{session.questions} questions</span>
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center gap-3">
                  <Badge>{session.persona}</Badge>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDeleteSession(session.id);
                    }}
                    className="text-red-400 hover:text-red-300 transition-colors p-2"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}