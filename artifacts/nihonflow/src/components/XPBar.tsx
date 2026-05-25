import { motion } from "framer-motion";

interface XPBarProps {
  xp: number;
}

export function XPBar({ xp }: XPBarProps) {
  // Simple level calculation: Level = Math.floor(sqrt(xp / 100)) + 1
  const level = Math.floor(Math.sqrt(Math.max(xp, 0) / 100)) + 1;
  
  // Calculate xp needed for current level and next level
  const xpForCurrentLevel = Math.pow(level - 1, 2) * 100;
  const xpForNextLevel = Math.pow(level, 2) * 100;
  
  const xpInCurrentLevel = xp - xpForCurrentLevel;
  const xpRequiredForNextLevel = xpForNextLevel - xpForCurrentLevel;
  const progress = Math.min(100, Math.max(0, (xpInCurrentLevel / xpRequiredForNextLevel) * 100));

  return (
    <div className="w-full flex flex-col gap-2" data-testid="xp-bar">
      <div className="flex justify-between items-end">
        <div className="flex flex-col">
          <span className="text-xs text-muted-foreground uppercase tracking-wider font-bold">Lvl {level}</span>
          <span className="text-lg font-bold text-primary drop-shadow-[0_0_8px_rgba(var(--primary),0.5)]">
            {xp} XP
          </span>
        </div>
        <span className="text-xs text-muted-foreground font-mono">
          {xpInCurrentLevel} / {xpRequiredForNextLevel}
        </span>
      </div>
      <div className="h-2 w-full bg-card border border-card-border rounded-full overflow-hidden relative">
        <motion.div 
          className="absolute top-0 left-0 h-full bg-gradient-to-r from-primary to-accent shadow-[0_0_10px_rgba(var(--primary),0.8)]"
          initial={{ width: 0 }}
          animate={{ width: `${progress}%` }}
          transition={{ duration: 1, type: "spring", stiffness: 50 }}
        />
      </div>
    </div>
  );
}
