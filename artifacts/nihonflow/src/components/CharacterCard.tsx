import { motion } from "framer-motion";
import { Character } from "@/data/hiragana";
import { ProgressState } from "@/hooks/useProgress";
import { cn } from "@/lib/utils";

interface CharacterCardProps {
  character: Character;
  status: ProgressState;
  onClick: () => void;
}

export function CharacterCard({ character, status, onClick }: CharacterCardProps) {
  const statusColors = {
    new: "bg-card border-card-border hover:border-primary/50 text-foreground",
    practicing: "bg-accent/10 border-accent/30 text-accent hover:border-accent/60 shadow-[0_0_15px_rgba(var(--accent),0.1)]",
    learned: "bg-primary/10 border-primary/30 text-primary hover:border-primary/60 shadow-[0_0_15px_rgba(var(--primary),0.15)]",
  };

  return (
    <motion.button
      whileHover={{ scale: 1.05, y: -2 }}
      whileTap={{ scale: 0.95 }}
      onClick={onClick}
      data-testid={`card-character-${character.romaji}`}
      className={cn(
        "relative flex flex-col items-center justify-center aspect-square rounded-2xl border backdrop-blur-sm transition-colors duration-300",
        statusColors[status]
      )}
    >
      <span className="text-4xl font-bold font-jp mb-1 drop-shadow-md">{character.char}</span>
      <span className="text-sm font-medium tracking-wider opacity-80">{character.romaji}</span>
      {status === "learned" && (
        <div className="absolute top-2 right-2 w-2 h-2 rounded-full bg-primary shadow-[0_0_8px_rgba(var(--primary),1)]" />
      )}
    </motion.button>
  );
}
