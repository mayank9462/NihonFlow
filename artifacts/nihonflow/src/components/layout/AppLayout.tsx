import { ReactNode } from "react";
import { Sidebar } from "./Sidebar";
import { BottomNav } from "./BottomNav";
import { motion } from "framer-motion";

export function AppLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-background text-foreground flex overflow-hidden selection:bg-primary/30">
      {/* Ambient background glow */}
      <div className="fixed inset-0 pointer-events-none z-[-1] overflow-hidden">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-primary/5 blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-accent/5 blur-[120px]" />
      </div>

      <Sidebar />
      <main className="flex-1 overflow-y-auto overflow-x-hidden pb-24 md:pb-0 relative scroll-smooth">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.3 }}
          className="container mx-auto p-4 md:p-8 max-w-5xl"
        >
          {children}
        </motion.div>
      </main>
      <BottomNav />
    </div>
  );
}
