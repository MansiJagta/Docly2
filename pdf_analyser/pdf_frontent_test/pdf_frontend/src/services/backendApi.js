const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://127.0.0.1:8001";

function toDisplayStatus(status) {
    if (status === "failed") return "error";
    return status || "uploaded";
}

function formatSize(sizeKb) {
    if (typeof sizeKb !== "number") return "-";
    return `${(sizeKb / 1024).toFixed(2)} MB`;
}

function formatDate(uploadTime) {
    if (!uploadTime) return "-";
    const dt = new Date(uploadTime);
    if (Number.isNaN(dt.getTime())) return String(uploadTime);
    return dt.toLocaleString();
}

function mapDocument(doc) {
    return {
        id: doc.id,
        name: doc.filename,
        filename: doc.filename,
        status: toDisplayStatus(doc.status),
        fileType: doc.file_type,
        sizeKb: doc.size_kb,
        size: formatSize(doc.size_kb),
        date: formatDate(doc.upload_time),
        uploadTime: doc.upload_time,
    };
}

async function request(path, options = {}) {
    const response = await fetch(`${API_BASE_URL}${path}`, options);
    const isJson = (response.headers.get("content-type") || "").includes("application/json");

    if (!response.ok) {
        let detail = `Request failed with status ${response.status}`;
        if (isJson) {
            const body = await response.json();
            if (body?.detail) {
                detail = typeof body.detail === "string" ? body.detail : JSON.stringify(body.detail);
            }
        } else {
            const text = await response.text();
            if (text) detail = text;
        }
        throw new Error(detail);
    }

    if (!isJson) return response.text();
    return response.json();
}

export async function uploadDocuments(files) {
    const formData = new FormData();
    files.forEach((file) => formData.append("files", file));

    return request("/documents/upload", {
        method: "POST",
        body: formData,
    });
}

export async function fetchDocuments() {
    const result = await request("/documents/");
    return (result.documents || []).map(mapDocument);
}

export async function fetchDocument(docId) {
    const doc = await request(`/documents/${docId}`);
    return mapDocument(doc);
}

export async function fetchDocumentSummary(docId, persona = "executive") {
    const query = persona ? `?persona=${encodeURIComponent(persona)}` : "";
    return request(`/documents/${docId}/summary${query}`);
}

export async function fetchWorkspaceStatus(workspaceId) {
    try {
        return await request(`/documents/workspaces/${encodeURIComponent(workspaceId)}/status`);
    } catch (error) {
        // Some backend versions do not implement workspace status yet.
        // Assume processing is finished so the UI can continue gracefully.
        if (String(error?.message || "").includes("404")) {
            return { is_finished: true, status: "unsupported" };
        }
        throw error;
    }
}

export async function fetchCombinedSummary(workspaceId, persona = "executive") {
    try {
        const query = persona ? `?persona=${encodeURIComponent(persona)}` : "";
        return await request(`/documents/workspaces/${encodeURIComponent(workspaceId)}/combined-summary${query}`);
    } catch (error) {
        // Keep the page usable when combined-summary endpoint is not available.
        if (String(error?.message || "").includes("404")) {
            return {
                combined_summary:
                    "Combined summary endpoint is not available in the current backend. Individual document summaries are still available.",
                status: "unsupported",
            };
        }
        throw error;
    }
}

export async function askDocument(docId, question, metadata = {}) {
    const payload = {
        question,
        document_id: docId,
        ...metadata,
    };

    const response = await fetch(`${API_BASE_URL}/documents/${docId}/ask`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
    });

    if (!response.ok) {
        const text = await response.text();
        throw new Error(text || `Request failed with status ${response.status}`);
    }

    // Endpoint returns text/event-stream but currently streams plain tokens.
    return response.text();
}

export { API_BASE_URL };
