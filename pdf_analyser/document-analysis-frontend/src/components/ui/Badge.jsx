import React from 'react';

export default function Badge({ 
  children, 
  variant = 'default',
  className = '' 
}) {
  // Add yellow variant:
const variants = {
  default: 'bg-cyan-500/20 text-cyan-300 border-cyan-500/30',
  purple: 'bg-purple-500/20 text-purple-300 border-purple-500/30',
  green: 'bg-green-500/20 text-green-300 border-green-500/30',
  yellow: 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30', // ADD THIS
  red: 'bg-red-500/20 text-red-300 border-red-500/30'
};
  
  return (
    <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium border ${variants[variant]} ${className}`}>
      {children}
    </span>
  );
}