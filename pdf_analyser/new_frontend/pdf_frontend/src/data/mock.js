export const DOCUMENTS = [
    {
        id: 1,
        name: "Financial_Report_Q1_2024.pdf",
        date: "Feb 2, 2026",
        size: "2.4 MB",
        status: "processed",
        summary: "This document provides a comprehensive overview of the Q1 2024 financial performance. Key highlights include a 15% increase in revenue year-over-year, driven primarily by the enterprise sector. Operating costs have decreased by 5% due to improved supply chain efficiencies. The report also outlines strategic investments in AI R&D.",
        chatHistory: [
            { id: 1, role: "ai", content: "Hello! I've analyzed 'Financial_Report_Q1_2024.pdf'. What would you like to know?" }
        ]
    },
    {
        id: 2,
        name: "Research_Paper_AI_Agents.pdf",
        date: "1 hour ago",
        size: "1.8 MB",
        status: "processing",
        summary: "Generating summary...",
        chatHistory: []
    },
    {
        id: 3,
        name: "Project_Proposal_Draft.docx",
        date: "Yesterday",
        size: "5.1 MB",
        status: "uploaded",
        summary: null,
        chatHistory: []
    },
    {
        id: 4,
        name: "Meeting_Notes_Oct.pdf",
        date: "2 days ago",
        size: "0.5 MB",
        status: "error",
        summary: null,
        chatHistory: []
    },
];

export function getDocument(id) {
    return DOCUMENTS.find(d => d.id === Number(id));
}
