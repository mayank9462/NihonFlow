import { motion } from "framer-motion";
import { Flame } from "lucide-react";

export function StreakCard({ streak }: { streak: number }) {
  const isHot = streak >= 3;

  return (
    <motion.div 
      whileHover={{ y: -2 }}
      className="bg-card border border-card-border rounded-2xl p-6 relative overflow-hidden flex items-center justify-between shadow-lg"
      data-testid="card-streak"
    >
      <div className="absolute top-0 right-0 w-32 h-32 bg-orange-500/10 rounded-full blur-[50px] -translate-y-1/2 translate-x-1/3" />
      
      <div>
        <h3 className="text-sm text-muted-foreground uppercase tracking-widest mb-1">Daily Streak</h3>
        <div className="flex items-baseline gap-2">
          <span className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-br from-orange-400 to-red-500">
            {streak}
          </span>
          <span className="text-muted-foreground font-medium">days</span>
        </div>
      </div>
      
      <div className="relative">
        <motion.div
          animate={isHot ? {
            scale: [1, 1.1, 1],
            rotate: [0, 5, -5, 0]
          } : {}}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
        >
          <Flame 
            className={`w-12 h-12 ${isHot ? "text-orange-500 drop-shadow-[0_0_15px_rgba(249,115,22,0.8)]" : "text-muted-foreground/30"}`} 
            strokeWidth={1.5}
          />
        </motion.div>
      </div>
    </motion.div>
  );
}
