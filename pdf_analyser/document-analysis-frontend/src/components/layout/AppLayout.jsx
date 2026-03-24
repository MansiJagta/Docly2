import React from 'react';
import Sidebar from './sidebar';
import TopNav from './TopNav';

export default function AppLayout({ children, modelStatus }) {
  return (
    <div className="flex h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
      <Sidebar />
      
      <div className="flex-1 flex flex-col overflow-hidden">
        <TopNav modelStatus={modelStatus} />
        
        <main className="flex-1 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
}