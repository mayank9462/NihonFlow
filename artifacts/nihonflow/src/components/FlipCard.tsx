import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Vocabulary } from "@/data/vocabulary";
import { Button } from "@/components/ui/button";
import { CheckCircle2, RotateCcw } from "lucide-react";

interface FlipCardProps {
  vocab: Vocabulary;
  onLearned: (id: string) => void;
  status: "new" | "learned";
}

export function FlipCard({ vocab, onLearned, status }: FlipCardProps) {
  const [isFlipped, setIsFlipped] = useState(false);

  return (
    <div
      className="w-full max-w-sm mx-auto h-[400px] cursor-pointer select-none"
      style={{ perspective: "1200px" }}
      onClick={() => setIsFlipped((f) => !f)}
      data-testid={`card-flip-${vocab.id}`}
    >
      {/* Inner — pure CSS transition, NO framer-motion on this element */}
      <div
        style={{
          width: "100%",
          height: "100%",
          position: "relative",
          transformStyle: "preserve-3d",
          transition: "transform 0.55s cubic-bezier(0.4, 0.2, 0.2, 1)",
          transform: isFlipped ? "rotateY(180deg)" : "rotateY(0deg)",
        }}
      >
        {/* ── FRONT ── */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            backfaceVisibility: "hidden",
            WebkitBackfaceVisibility: "hidden",
          }}
          className="rounded-3xl flex flex-col items-center justify-center p-8 text-center overflow-hidden border-2 border-primary/20 bg-card"
        >
          <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-accent/5 rounded-3xl pointer-events-none" />
          <div className="absolute top-0 right-0 w-48 h-48 bg-primary/10 rounded-full blur-[60px] -translate-y-1/4 translate-x-1/4 pointer-events-none" />

          <div className="relative z-10 flex flex-col items-center gap-4">
            <span
              className="text-8xl font-bold text-primary"
              style={{
                fontFamily: "'Noto Sans JP', sans-serif",
                textShadow: "0 0 40px rgba(147,51,234,0.45)",
              }}
            >
              {vocab.word}
            </span>
            <span className="text-muted-foreground text-xs tracking-[0.3em] uppercase font-medium">
              {vocab.reading}
            </span>
          </div>

          <div className="relative z-10 mt-auto flex items-center gap-2 text-muted-foreground/50 text-xs tracking-widest">
            <RotateCcw className="w-3 h-3" />
            TAP TO REVEAL
          </div>
        </div>

        {/* ── BACK ── */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            backfaceVisibility: "hidden",
            WebkitBackfaceVisibility: "hidden",
            transform: "rotateY(180deg)",
          }}
          className="rounded-3xl flex flex-col items-center justify-center p-8 text-center overflow-hidden border-2 border-accent/30 bg-card"
        >
          <div className="absolute inset-0 bg-gradient-to-tl from-accent/15 via-transparent to-primary/5 rounded-3xl pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-accent/10 rounded-full blur-[60px] translate-y-1/4 -translate-x-1/4 pointer-events-none" />

          <div className="relative z-10 flex flex-col items-center gap-4 w-full">
            <span className="text-xs tracking-[0.3em] uppercase font-medium text-muted-foreground/60">
              Meaning
            </span>
            <span
              className="text-4xl font-black text-accent leading-tight"
              style={{ textShadow: "0 0 30px rgba(59,130,246,0.5)" }}
            >
              {vocab.meaning}
            </span>

            <div className="w-12 h-px bg-accent/30 my-1" />

            <div className="bg-background/60 border border-border rounded-2xl px-5 py-3 text-center">
              <span className="text-xs text-muted-foreground tracking-widest uppercase block mb-1">
                Reading
              </span>
              <span className="text-xl font-mono font-bold text-foreground">
                {vocab.reading}
              </span>
            </div>

            <div
              className="mt-4 w-full"
              onClick={(e) => e.stopPropagation()}
            >
              <AnimatePresence mode="wait">
                {status !== "learned" ? (
                  <motion.div
                    key="learn-btn"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                  >
                    <Button
                      onClick={() => onLearned(vocab.id)}
                      className="w-full bg-primary hover:bg-primary/90 text-primary-foreground shadow-[0_0_20px_rgba(147,51,234,0.4)] rounded-xl h-12"
                      data-testid="button-mark-learned"
                    >
                      Mark as Learned · +5 XP
                    </Button>
                  </motion.div>
                ) : (
                  <motion.div
                    key="learned-badge"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="flex items-center justify-center gap-2 text-green-400 font-bold tracking-widest text-sm"
                  >
                    <CheckCircle2 className="w-5 h-5" />
                    LEARNED
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
