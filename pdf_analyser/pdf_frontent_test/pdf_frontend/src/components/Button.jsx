import { cn } from "../utils/cn";

export default function Button({
    children,
    variant = 'primary',
    size = 'md',
    className,
    icon: Icon,
    isLoading,
    ...props
}) {
    const variants = {
        primary: "bg-blue-500 text-white rounded-full shadow-[0_0_15px_rgba(59,130,246,0.5)] hover:bg-blue-400 hover:shadow-[0_0_25px_rgba(59,130,246,0.7)] border border-transparent active:scale-[0.98]",
        secondary: "bg-[#0F172A] text-slate-300 border border-slate-700 hover:bg-slate-800 active:scale-[0.98]",
        outline: "bg-transparent text-slate-300 border border-slate-700 hover:border-blue-500 hover:text-blue-400 active:scale-[0.98]",
        ghost: "bg-transparent text-slate-400 hover:text-white hover:bg-white/5 active:scale-[0.98]",
        danger: "bg-red-500/10 text-red-500 hover:bg-red-500/20 border border-red-500/20 active:scale-[0.98]",
    };

    const sizes = {
        sm: "px-3 py-1.5 text-xs",
        md: "px-4 py-2 text-sm",
        lg: "px-6 py-3 text-base",
    };

    return (
        <button
            className={cn(
                "relative inline-flex items-center justify-center font-medium transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-blue-500/50 disabled:opacity-50 disabled:cursor-not-allowed",
                variants[variant],
                sizes[size],
                className
            )}
            disabled={isLoading}
            {...props}
        >
            {isLoading ? (
                <svg className="w-4 h-4 mr-2 animate-spin" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
            ) : Icon && (
                <Icon className={cn("w-4 h-4", children && "mr-2")} />
            )}
            {children}
        </button>
    );
}
