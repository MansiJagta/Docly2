import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Shield, Lock, Fingerprint, Key } from 'lucide-react';

const Vault = () => {
    const [unlocked, setUnlocked] = useState(false);

    return (
        <div className="p-8 md:p-12 relative z-10 h-full flex flex-col items-center justify-center pointer-events-none">

            <div className="pointer-events-auto bg-black/40 backdrop-blur-2xl border border-white/10 p-8 rounded-3xl max-w-sm w-full shadow-[0_0_50px_rgba(0,0,0,0.5)]">
                <div className="text-center mb-8">
                    <div className={`w-20 h-20 mx-auto rounded-full flex items-center justify-center mb-4 transition-colors duration-500 ${unlocked ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-500'}`}>
                        {unlocked ? <Fingerprint size={40} /> : <Lock size={40} />}
                    </div>
                    <h2 className="text-2xl font-bold mb-1">Privacy Vault</h2>
                    <p className="text-sm text-gray-400">Biometric Verification Required</p>
                </div>

                {!unlocked ? (
                    <div className="space-y-4">
                        <div className="relative">
                            <Key className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
                            <input
                                type="password"
                                placeholder="Enter Master Key"
                                className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-10 pr-4 text-white focus:outline-none focus:border-red-500/50 transition-colors"
                            />
                        </div>
                        <button
                            onClick={() => setUnlocked(true)}
                            className="w-full py-3 bg-red-600 hover:bg-red-500 text-white font-bold rounded-xl transition-colors shadow-lg shadow-red-900/20"
                        >
                            Unlock Vault
                        </button>
                    </div>
                ) : (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="text-center"
                    >
                        <p className="text-green-400 font-mono mb-4">ACCESS GRANTED</p>
                        <button
                            onClick={() => setUnlocked(false)}
                            className="w-full py-3 bg-white/10 hover:bg-white/20 text-white font-bold rounded-xl transition-colors"
                        >
                            Lock Vault
                        </button>
                    </motion.div>
                )}

                <div className="mt-8 flex justify-center gap-4 text-gray-500 text-xs">
                    <span className="flex items-center gap-1"><Shield size={12} /> AES-256</span>
                    <span>•</span>
                    <span>Offline Only</span>
                </div>
            </div>

        </div>
    );
};

export default Vault;
