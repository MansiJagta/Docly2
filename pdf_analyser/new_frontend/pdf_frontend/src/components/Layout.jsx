import { useState } from "react";
import Sidebar from "./Sidebar";
import { motion } from "framer-motion";

export default function Layout({ children }) {
    const [open, setOpen] = useState(true);

    return (
        <div className="flex">
            {/* Sidebar */}
            <Sidebar open={open} setOpen={setOpen} />

            {/* Main Content (THIS MOVES) */}
            <motion.main
                animate={{ marginLeft: open ? 260 : 0 }}
                transition={{ type: "spring", stiffness: 120 }}
                className="w-full min-h-screen bg-[#0B1220] text-white p-6"
            >
                {children}
            </motion.main>
        </div>
    );
}
