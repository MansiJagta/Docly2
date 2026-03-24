import React, { useState } from 'react';
import { Save, AlertCircle, CheckCircle } from 'lucide-react';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import Badge from '../components/ui/Badge';

export default function Settings({ setModelStatus }) {
  const [modelPaths, setModelPaths] = useState({
    model360m: '/models/phi-2-360m',
    model1b: '/models/phi-2-1b'
  });
  
  const [systemStatus, setSystemStatus] = useState({
    sqliteVec: true,
    fastapi: true,
    localLLM: true
  });
  
  const [saveStatus, setSaveStatus] = useState(null);
  
  const handleSave = () => {
    setSaveStatus('saving');
    
    // Simulate API call
    setTimeout(() => {
      setSaveStatus('success');
      setTimeout(() => setSaveStatus(null), 3000);
    }, 1000);
  };
  
  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-white mb-2">Settings</h2>
        <p className="text-gray-400">Configure your local AI environment</p>
      </div>
      
      <div className="space-y-6">
        {/* Model Configuration */}
        <Card>
          <h3 className="text-lg font-semibold text-white mb-4">
            Local Model Configuration
          </h3>
          <p className="text-sm text-gray-400 mb-4">
            Specify paths to your locally downloaded language models
          </p>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Model Path (360M) - Fast Response
              </label>
              <input
                type="text"
                value={modelPaths.model360m}
                onChange={(e) => setModelPaths(prev => ({ 
                  ...prev, 
                  model360m: e.target.value 
                }))}
                placeholder="/path/to/model-360m"
                className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-gray-300 focus:border-cyan-500/50 transition-colors"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Model Path (1B) - High Quality
              </label>
              <input
                type="text"
                value={modelPaths.model1b}
                onChange={(e) => setModelPaths(prev => ({ 
                  ...prev, 
                  model1b: e.target.value 
                }))}
                placeholder="/path/to/model-1b"
                className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-gray-300 focus:border-cyan-500/50 transition-colors"
              />
            </div>
          </div>
          
          <div className="mt-6 flex items-center gap-3">
            <Button onClick={handleSave}>
              <Save className="w-4 h-4" />
              Save Configuration
            </Button>
            
            {saveStatus === 'saving' && (
              <span className="text-sm text-gray-400">Saving...</span>
            )}
            {saveStatus === 'success' && (
              <span className="text-sm text-green-400 flex items-center gap-1">
                <CheckCircle className="w-4 h-4" />
                Saved successfully
              </span>
            )}
          </div>
        </Card>
        
        {/* System Status */}
        <Card>
          <h3 className="text-lg font-semibold text-white mb-4">
            System Status
          </h3>
          
          <div className="space-y-4">
            <div className="flex items-center justify-between py-2 border-b border-white/10">
              <div>
                <p className="text-gray-300 font-medium">SQLite-vec</p>
                <p className="text-xs text-gray-500">Vector database for embeddings</p>
              </div>
              <Badge variant={systemStatus.sqliteVec ? 'green' : 'red'}>
                {systemStatus.sqliteVec ? 'Active' : 'Inactive'}
              </Badge>
            </div>
            
            <div className="flex items-center justify-between py-2 border-b border-white/10">
              <div>
                <p className="text-gray-300 font-medium">FastAPI Backend</p>
                <p className="text-xs text-gray-500">Local API server</p>
              </div>
              <Badge variant={systemStatus.fastapi ? 'green' : 'red'}>
                {systemStatus.fastapi ? 'Running' : 'Stopped'}
              </Badge>
            </div>
            
            <div className="flex items-center justify-between py-2">
              <div>
                <p className="text-gray-300 font-medium">Local LLM</p>
                <p className="text-xs text-gray-500">Language model inference</p>
              </div>
              <Badge variant={systemStatus.localLLM ? 'green' : 'red'}>
                {systemStatus.localLLM ? 'Loaded' : 'Not Loaded'}
              </Badge>
            </div>
          </div>
        </Card>
        
        {/* Privacy Notice */}
        <Card className="bg-cyan-500/10 border-cyan-500/30">
          <div className="flex gap-3">
            <AlertCircle className="w-5 h-5 text-cyan-400 flex-shrink-0 mt-0.5" />
            <div>
              <h4 className="text-white font-medium mb-1">Privacy Guarantee</h4>
              <p className="text-sm text-gray-300 leading-relaxed">
                All document processing happens locally on your machine. No data is sent to external servers. Your PDFs and queries remain completely private.
              </p>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}