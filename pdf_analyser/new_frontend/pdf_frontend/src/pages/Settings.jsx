import { useState } from "react";
import { User, Bell, Shield, Save, LogOut } from "lucide-react";
import Button from "../components/Button";
import { motion } from "framer-motion";

export default function Settings() {
    const [activeTab, setActiveTab] = useState("profile");

    const tabs = [
        { id: "profile", label: "Profile", icon: User },
        { id: "notifications", label: "Notifications", icon: Bell },
        { id: "security", label: "Security", icon: Shield },
    ];

    return (
        <div className="min-h-screen bg-[linear-gradient(135deg,#0a2463_0%,#020b1f_100%)] text-white p-6 md:p-12 animate-fade-in">
            <div className="max-w-4xl mx-auto space-y-8">
                {/* Header */}
                <div>
                    <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-cyan-400">
                        Settings
                    </h1>
                    <p className="text-slate-400 mt-2">Manage your workspace preferences</p>
                </div>

                {/* Main Layout */}
                <div className="flex flex-col md:flex-row gap-8">
                    {/* Sidebar Tabs */}
                    <div className="w-full md:w-64 flex-shrink-0 space-y-2">
                        {tabs.map((tab) => (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                className={`w-full flex items-center p-3 rounded-xl transition-all duration-300 font-medium ${activeTab === tab.id
                                        ? "bg-gradient-to-r from-blue-700 to-cyan-600 text-white shadow-lg shadow-blue-900/50"
                                        : "hover:bg-white/5 text-slate-400 hover:text-white"
                                    }`}
                            >
                                <tab.icon className="w-5 h-5 mr-3" />
                                {tab.label}
                            </button>
                        ))}
                    </div>

                    {/* Content Area */}
                    <div className="flex-1 bg-white/5 backdrop-filter backdrop-blur-xl border border-white/10 rounded-2xl p-6 md:p-8 shadow-2xl">
                        <motion.div
                            key={activeTab}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.3 }}
                        >
                            {activeTab === "profile" && <ProfileSettings />}
                            {activeTab === "notifications" && <NotificationSettings />}
                            {activeTab === "security" && <SecuritySettings />}
                        </motion.div>
                    </div>
                </div>
            </div>
        </div>
    );
}

function ProfileSettings() {
    return (
        <div className="space-y-6">
            <h2 className="text-xl font-bold border-b border-white/10 pb-4">Public Profile</h2>
            <div className="flex items-center gap-6">
                <div className="w-20 h-20 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-2xl font-bold shadow-lg">
                    JD
                </div>
                <div>
                    <Button variant="outline" size="sm" className="border-white/20 hover:bg-white/10">Change Avatar</Button>
                </div>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
                <div className="space-y-2">
                    <label className="text-sm text-slate-400">Full Name</label>
                    <input type="text" defaultValue="John Doe" className="w-full bg-black/20 border border-white/10 rounded-lg p-3 text-white focus:outline-none focus:border-blue-500 transition-colors" />
                </div>
                <div className="space-y-2">
                    <label className="text-sm text-slate-400">Email Address</label>
                    <input type="email" defaultValue="john@example.com" className="w-full bg-black/20 border border-white/10 rounded-lg p-3 text-white focus:outline-none focus:border-blue-500 transition-colors" />
                </div>
                <div className="space-y-2">
                    <label className="text-sm text-slate-400">Role</label>
                    <input type="text" defaultValue="Senior Analyst" className="w-full bg-black/20 border border-white/10 rounded-lg p-3 text-white focus:outline-none focus:border-blue-500 transition-colors" />
                </div>
            </div>

            <div className="pt-4">
                <Button className="bg-blue-600 hover:bg-blue-500"><Save className="w-4 h-4 mr-2" /> Save Changes</Button>
            </div>
        </div>
    );
}

function NotificationSettings() {
    return (
        <div className="space-y-6">
            <h2 className="text-xl font-bold border-b border-white/10 pb-4">Notifications</h2>
            <div className="space-y-4">
                {["Email Digest", "Real-time Alerts", "New Document Analysis"].map((item, i) => (
                    <div key={i} className="flex items-center justify-between p-4 bg-black/20 rounded-xl border border-white/5">
                        <span className="font-medium">{item}</span>
                        <div className="w-12 h-6 bg-blue-600 rounded-full relative cursor-pointer">
                            <div className="absolute right-1 top-1 w-4 h-4 bg-white rounded-full shadow-sm" />
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

function SecuritySettings() {
    return (
        <div className="space-y-6">
            <h2 className="text-xl font-bold border-b border-white/10 pb-4">Security & Privacy</h2>
            <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-xl space-y-4">
                <div className="flex items-start gap-3">
                    <Shield className="w-6 h-6 text-red-400 flex-shrink-0" />
                    <div>
                        <h3 className="font-bold text-red-400">Biometric Vault Access</h3>
                        <p className="text-sm text-red-200/70 mt-1">Require master key or biometric verification to access sensitive documents.</p>
                    </div>
                </div>
                <Button variant="danger" size="sm">Configure Access</Button>
            </div>

            <div className="space-y-2 pt-4">
                <label className="text-sm text-slate-400">Current Password</label>
                <input type="password" placeholder="••••••••" className="w-full bg-black/20 border border-white/10 rounded-lg p-3 text-white" />
            </div>

            <div className="pt-8 border-t border-white/5">
                <Button variant="outline" className="text-red-400 border-red-500/30 hover:bg-red-500/10 w-full justify-center">
                    <LogOut className="w-4 h-4 mr-2" /> Sign out of all devices
                </Button>
            </div>
        </div>
    );
}
