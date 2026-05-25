import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Vocabulary } from "@/data/vocabulary";
import { Button } from "@/components/ui/button";

interface FlipCardProps {
  vocab: Vocabulary;
  onLearned: (id: string) => void;
  status: "new" | "learned";
}

export function FlipCard({ vocab, onLearned, status }: FlipCardProps) {
  const [isFlipped, setIsFlipped] = useState(false);

  return (
    <div className="perspective-1000 w-full max-w-sm mx-auto h-[400px]">
      <motion.div
        className="w-full h-full relative preserve-3d cursor-pointer"
        animate={{ rotateY: isFlipped ? 180 : 0 }}
        transition={{ duration: 0.6, type: "spring", stiffness: 260, damping: 20 }}
        onClick={() => setIsFlipped(!isFlipped)}
        data-testid={`card-flip-${vocab.id}`}
      >
        {/* Front */}
        <div className="absolute w-full h-full backface-hidden bg-card border-2 border-primary/20 rounded-3xl shadow-[0_0_30px_rgba(var(--primary),0.1)] flex flex-col items-center justify-center p-8 text-center">
          <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent rounded-3xl" />
          <span className="text-7xl font-bold font-jp text-primary drop-shadow-[0_0_15px_rgba(var(--primary),0.3)]">{vocab.word}</span>
          <span className="mt-8 text-muted-foreground text-sm tracking-widest uppercase">TAP TO FLIP</span>
        </div>

        {/* Back */}
        <div className="absolute w-full h-full backface-hidden rotate-y-180 bg-sidebar border-2 border-accent/30 rounded-3xl shadow-[0_0_30px_rgba(var(--accent),0.1)] flex flex-col items-center justify-center p-8 text-center">
          <div className="absolute inset-0 bg-gradient-to-tl from-accent/10 to-transparent rounded-3xl" />
          <span className="text-4xl font-bold text-accent mb-4 drop-shadow-[0_0_10px_rgba(var(--accent),0.5)]">{vocab.meaning}</span>
          <span className="text-2xl font-mono text-muted-foreground mb-8">{vocab.reading}</span>
          
          <div className="mt-auto z-10" onClick={(e) => e.stopPropagation()}>
            {status !== "learned" ? (
              <Button 
                onClick={() => onLearned(vocab.id)}
                className="bg-primary hover:bg-primary/90 text-primary-foreground shadow-[0_0_20px_rgba(var(--primary),0.4)]"
                size="lg"
                data-testid="button-mark-learned"
              >
                Mark as Learned (+5 XP)
              </Button>
            ) : (
              <div className="text-primary font-bold tracking-wide flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-primary shadow-[0_0_8px_rgba(var(--primary),1)]" />
                LEARNED
              </div>
            )}
          </div>
        </div>
      </motion.div>
    </div>
  );
}
