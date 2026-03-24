import { motion } from "framer-motion";
import { cn } from "../utils/cn";

export default function GlassCard({ children, className, hoverEffect = false, ...props }) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className={cn(
                "cyber-card p-6",
                !hoverEffect && "hover:transform-none hover:shadow-none hover:border-border-glass",
                className
            )}
            {...props}
        >
            {children}
        </motion.div>
    );
}
