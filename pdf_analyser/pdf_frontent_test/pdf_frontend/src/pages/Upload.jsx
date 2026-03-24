import UploadDropzone from "../components/UploadDropzone";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { User } from "lucide-react";
import { uploadDocuments } from "../services/backendApi";

const PERSONAS = [
    { id: 'executive', name: 'Executive', icon: '👔', desc: 'Focus on high-level insights and ROI' },
    { id: 'technical', name: 'Technical', icon: '🛠️', desc: 'Detailed technical analysis and code' },
    { id: 'academic', name: 'Academic', icon: '🎓', desc: 'Rigorous citations and formal tone' },
    { id: 'creative', name: 'Creative', icon: '🎨', desc: 'Brainstorming and generative ideas' }
];

export default function Upload() {
    const [selectedPersona, setSelectedPersona] = useState(PERSONAS[0].id);
    const [isUploading, setIsUploading] = useState(false);
    const [uploadMessage, setUploadMessage] = useState("");
    const [uploadError, setUploadError] = useState("");
    const navigate = useNavigate();

    const handleFilesSelected = () => {
        setUploadMessage("");
        setUploadError("");
    };

    const handleUploadRequested = async (files) => {
        if (!files?.length) return;

        setIsUploading(true);
        setUploadError("");
        setUploadMessage("");

        try {
            const result = await uploadDocuments(files);
            const count = result?.count ?? files.length;
            setUploadMessage(`Uploaded ${count} document(s) successfully.`);

            const sizeByName = new Map(files.map((file) => [file.name, file.size]));
            const uploadedDocs = (result?.documents || []).map((doc, index) => ({
                id: doc.id,
                name: doc.filename,
                filename: doc.filename,
                status: doc.status || "processing",
                size: sizeByName.get(doc.filename) || 0,
                order: index + 1,
                workspace_id: doc.workspace_id || null,
            }));

            const resolvedWorkspaceId =
                result?.workspace_id || uploadedDocs.find((d) => d.workspace_id)?.workspace_id || null;

            const workspaceName = `Workspace ${new Date().toLocaleString()} (${uploadedDocs.length} docs)`;
            const workspace = {
                id: `ws-${Date.now()}`,
                name: workspaceName,
                documents: uploadedDocs,
                createdAt: new Date().toISOString(),
                backendWorkspaceId: resolvedWorkspaceId,
            };

            localStorage.setItem("activeAnalysisWorkspace", JSON.stringify(workspace));

            const historyRaw = localStorage.getItem("analysisWorkspaceHistory");
            const history = historyRaw ? JSON.parse(historyRaw) : [];
            const nextHistory = [workspace, ...history.filter((item) => item?.id !== workspace.id)].slice(0, 20);
            localStorage.setItem("analysisWorkspaceHistory", JSON.stringify(nextHistory));

            navigate("/analyze", { state: { workspace } });
        } catch (error) {
            setUploadError(error.message || "Upload failed. Please try again.");
        } finally {
            setIsUploading(false);
        }
    };

    return (
        <div className="max-w-4xl mx-auto space-y-8 animate-fade-in">
            <div className="text-center space-y-2">
                <h1 className="text-3xl font-bold text-white">Upload Documents</h1>
                <p className="text-text-muted">
                    Add your PDF or Image files to start analyzing.
                </p>
            </div>

            {/* Persona Selection */}
            <div className="bg-surface/30 backdrop-blur-sm border border-surface rounded-2xl p-6 shadow-lg flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex items-center gap-2">
                    <User className="w-5 h-5 text-blue-400" />
                    <div>
                        <h3 className="text-white font-semibold">Analysis Persona</h3>
                        <p className="text-xs text-slate-400">Select the context for AI analysis</p>
                    </div>
                </div>

                <div className="relative group w-full md:w-64">
                    <select
                        className="w-full bg-black/40 border border-white/10 text-white rounded-xl px-4 py-3 focus:outline-none focus:border-blue-500 appearance-none cursor-pointer hover:bg-white/5 transition-colors shadow-inner font-medium"
                        value={selectedPersona}
                        onChange={(e) => setSelectedPersona(e.target.value)}
                    >
                        {PERSONAS.map((persona) => (
                            <option key={persona.id} value={persona.id} className="bg-slate-900 text-white py-2">
                                {persona.icon}  {persona.name}
                            </option>
                        ))}
                    </select>
                    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-white/50">
                        <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" /></svg>
                    </div>
                </div>
            </div>

            <div className="bg-surface/30 backdrop-blur-sm border border-surface rounded-2xl p-6 sm:p-10 shadow-xl">
                <UploadDropzone
                    onFilesSelected={handleFilesSelected}
                    onUploadRequested={handleUploadRequested}
                    isUploading={isUploading}
                />
                {uploadMessage && (
                    <p className="mt-4 text-sm text-emerald-400">{uploadMessage}</p>
                )}
                {uploadError && (
                    <p className="mt-4 text-sm text-red-400">{uploadError}</p>
                )}
            </div>
        </div>
    );
}
