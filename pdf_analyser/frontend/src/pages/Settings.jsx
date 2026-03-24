import React from 'react';
import { Save, User, Bell, Shield, Database } from 'lucide-react';

const SettingsSection = ({ title, icon: Icon, children }) => (
    <div className="mb-8">
        <div className="flex items-center gap-2 mb-4 text-primary">
            <Icon size={20} />
            <h3 className="font-bold text-lg">{title}</h3>
        </div>
        <div className="p-6 bg-white/5 border border-white/10 rounded-2xl space-y-4">
            {children}
        </div>
    </div>
);

const Toggle = ({ label }) => (
    <div className="flex items-center justify-between">
        <span className="text-gray-300">{label}</span>
        <div className="w-12 h-6 bg-primary/20 rounded-full relative cursor-pointer">
            <div className="absolute right-1 top-1 w-4 h-4 bg-primary rounded-full shadow-[0_0_10px_#7C3AED]" />
        </div>
    </div>
);

const Settings = () => {
    return (
        <div className="p-8 md:p-12 relative z-10 h-full overflow-y-auto max-w-3xl">
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-4xl font-bold">Settings</h1>
                <button className="flex items-center gap-2 px-6 py-2 bg-primary text-white rounded-full font-medium hover:bg-primary/80 transition-colors">
                    <Save size={18} /> Save Changes
                </button>
            </div>

            <SettingsSection title="Appearance" icon={User}>
                <Toggle label="Dark Mode (Always On)" />
                <Toggle label="Reduced Motion" />
                <Toggle label="High Contrast 3D" />
            </SettingsSection>

            <SettingsSection title="Notifications" icon={Bell}>
                <Toggle label="Analysis Completion" />
                <Toggle label="System Updates" />
            </SettingsSection>

            <SettingsSection title="Security & Storage" icon={Shield}>
                <div className="flex items-center justify-between">
                    <span className="text-gray-300">Local Storage Usage</span>
                    <span className="text-sm text-gray-500">245 MB / 5 GB</span>
                </div>
                <div className="w-full h-2 bg-gray-800 rounded-full overflow-hidden">
                    <div className="w-[5%] h-full bg-accent" />
                </div>
                <button className="text-red-400 text-sm hover:text-red-300">Clear Cache</button>
            </SettingsSection>

            <div className="text-center pt-8 text-xs text-gray-600">
                Nano AI v1.0.0 • Build 2024.10.25
            </div>
        </div>
    );
};

export default Settings;
