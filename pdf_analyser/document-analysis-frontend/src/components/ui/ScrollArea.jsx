import React from 'react';

export default function ScrollArea({ 
  children, 
  className = '',
  maxHeight = 'max-h-96' 
}) {
  return (
    <div className={`overflow-y-auto pr-2 ${maxHeight} ${className}`}>
      {children}
    </div>
  );
}