import React from 'react';
import { motion } from 'framer-motion';
import { Clock, TrendingUp, Users } from 'lucide-react';

const StatCard = ({ title, value, icon: Icon, delay }) => (
    <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay, duration: 0.5 }}
        className="bg-white/5 backdrop-blur-xl border border-white/10 p-6 rounded-2xl flex items-center gap-4 hover:bg-white/10 transition-colors cursor-pointer group"
    >
        <div className="p-3 rounded-xl bg-primary/20 text-accent group-hover:scale-110 transition-transform">
            <Icon size={24} />
        </div>
        <div>
            <p className="text-sm text-gray-400">{title}</p>
            <h3 className="text-2xl font-bold text-white">{value}</h3>
        </div>
    </motion.div>
);

const Dashboard = () => {
    return (
        <div className="p-8 md:p-12 relative z-10 h-full flex flex-col justify-between">
            <div>
                <h1 className="text-4xl font-bold mb-2">Dashboard</h1>
                <p className="text-gray-400 mb-8">System Metrics & Usage</p>

                {/* Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl">
                    <StatCard title="Documents Processed" value="1,248" icon={FileText} delay={0.1} />
                    <StatCard title="Processing Time" value="0.4s" icon={Clock} delay={0.2} />
                    <StatCard title="Data Saved" value="4.2 GB" icon={TrendingUp} delay={0.3} />
                </div>
            </div>

            {/* Bottom Area - Charts Interaction Hint */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.8 }}
                className="self-end text-right"
            >
                <p className="text-sm text-accent animate-pulse">
                    Live 3D Visualization Active
                </p>
            </motion.div>
        </div>
    );
};
// Need to import FileText locally since it was used but not imported in props
import { FileText } from 'lucide-react';

export default Dashboard;
