/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                background: "#0b0f19",
                primary: "#06b6d4",
                secondary: "#8b5cf6",
                accent: "#06b6d4",
                surface: "#1e293b",
                "surface-glass": "rgba(30, 41, 59, 0.4)",
                "surface-glass-hover": "rgba(30, 41, 59, 0.6)",
                "border-glass": "rgba(255, 255, 255, 0.08)",
                text: "#f8fafc",
                "text-muted": "#94a3b8",
                success: "#10b981",
                error: "#ef4444",
            },
            fontFamily: {
                sans: ["Inter", "system-ui", "sans-serif"],
                heading: ["Outfit", "system-ui", "sans-serif"],
            },
            animation: {
                "fade-in": "fadeIn 0.6s ease-out forwards",
                "slide-up": "slideUp 0.6s ease-out forwards",
                "pulse-slow": "pulseSlow 4s infinite",
                "float": "float 6s ease-in-out infinite",
            },
            keyframes: {
                fadeIn: {
                    "0%": { opacity: "0" },
                    "100%": { opacity: "1" },
                },
                slideUp: {
                    "0%": { transform: "translateY(20px)", opacity: "0" },
                    "100%": { transform: "translateY(0)", opacity: "1" },
                },
                pulseSlow: {
                    "0%, 100%": { opacity: "0.5" },
                    "50%": { opacity: "0.8" },
                },
                float: {
                    "0%, 100%": { transform: "translateY(0)" },
                    "50%": { transform: "translateY(-10px)" },
                },
            },
        },
    },
    plugins: [],
}
