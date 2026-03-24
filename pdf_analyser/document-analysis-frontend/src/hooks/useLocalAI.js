import { useState } from 'react';

export function useLocalAI() {
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState(null);
  
  // API base URL (adjust based on your FastAPI setup)
  const API_BASE = 'http://localhost:8000/api';
  
  const processDocument = async (file, persona) => {
    setIsProcessing(true);
    setError(null);
    
    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('persona', persona);
      
      const response = await fetch(`${API_BASE}/process`, {
        method: 'POST',
        body: formData
      });
      
      if (!response.ok) {
        throw new Error('Failed to process document');
      }
      
      const data = await response.json();
      return data;
      
    } catch (err) {
      setError(err.message);
      console.error('Document processing error:', err);
      return null;
    } finally {
      setIsProcessing(false);
    }
  };
  
  const askQuestion = async (question, documentId, persona) => {
    setIsProcessing(true);
    setError(null);
    
    try {
      const response = await fetch(`${API_BASE}/query`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          question,
          document_id: documentId,
          persona
        })
      });
      
      if (!response.ok) {
        throw new Error('Failed to get answer');
      }
      
      const data = await response.json();
      return data;
      
    } catch (err) {
      setError(err.message);
      console.error('Question answering error:', err);
      return null;
    } finally {
      setIsProcessing(false);
    }
  };
  
  const getSummary = async (documentId, persona) => {
    setIsProcessing(true);
    setError(null);
    
    try {
      const response = await fetch(`${API_BASE}/summary`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          document_id: documentId,
          persona
        })
      });
      
      if (!response.ok) {
        throw new Error('Failed to generate summary');
      }
      
      const data = await response.json();
      return data;
      
    } catch (err) {
      setError(err.message);
      console.error('Summary generation error:', err);
      return null;
    } finally {
      setIsProcessing(false);
    }
  };
  
  return {
    processDocument,
    askQuestion,
    getSummary,
    isProcessing,
    error
  };
}