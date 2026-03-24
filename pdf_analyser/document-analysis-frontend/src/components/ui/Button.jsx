import React from 'react';
import { motion } from 'framer-motion';

export default function Button({ 
  children, 
  variant = 'primary', 
  className = '', 
  onClick, 
  disabled = false,
  type = 'button'
}) {
  const baseStyles = 'px-6 py-3 rounded-lg font-medium transition-all duration-300 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed';
  
  // In the variants object, add:
const variants = {
  primary: 'bg-cyan-500 hover:bg-cyan-600 text-white glow-cyan',
  secondary: 'bg-purple-500 hover:bg-purple-600 text-white glow-purple',
  ghost: 'bg-white/5 hover:bg-white/10 text-gray-300 border border-white/10 hover:border-white/20',
  outline: 'bg-transparent border-2 border-cyan-500 text-cyan-400 hover:bg-cyan-500/10' // ADD THIS LINE
};
  
  return (
    <motion.button
      whileHover={{ scale: disabled ? 1 : 1.02 }}
      whileTap={{ scale: disabled ? 1 : 0.98 }}
      className={`${baseStyles} ${variants[variant]} ${className}`}
      onClick={onClick}
      disabled={disabled}
      type={type}
    >
      {children}
    </motion.button>
  );
}