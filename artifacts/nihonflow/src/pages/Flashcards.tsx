import { useState } from "react";
import { useProgress } from "@/hooks/useProgress";
import { vocabularyData } from "@/data/vocabulary";
import { FlipCard } from "@/components/FlipCard";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function Flashcards() {
  const { vocabProgress, setVocabProgress, addXP } = useProgress();
  const [currentIndex, setCurrentIndex] = useState(0);

  const handleLearned = (id: string) => {
    if (vocabProgress[id] !== "learned") {
      setVocabProgress(prev => ({ ...prev, [id]: "learned" }));
      addXP(5);
    }
  };

  const nextCard = () => {
    setCurrentIndex((prev) => (prev + 1) % vocabularyData.length);
  };

  const prevCard = () => {
    setCurrentIndex((prev) => (prev - 1 + vocabularyData.length) % vocabularyData.length);
  };

  const currentVocab = vocabularyData[currentIndex];
  const learnedCount = Object.values(vocabProgress).filter(s => s === "learned").length;

  return (
    <div className="space-y-8 flex flex-col items-center justify-center min-h-[70vh]" data-testid="page-flashcards">
      <header className="w-full flex flex-col md:flex-row md:items-end justify-between gap-4 max-w-2xl mx-auto">
        <div>
          <h1 className="text-4xl font-bold tracking-tight mb-2">Vocabulary</h1>
          <p className="text-muted-foreground">Essential words for daily use.</p>
        </div>
        <div className="bg-card border border-card-border px-6 py-4 rounded-2xl shadow-sm">
          <span className="text-sm font-medium text-muted-foreground uppercase tracking-widest block mb-1">Mastery</span>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-bold text-green-500 drop-shadow-[0_0_8px_rgba(34,197,94,0.5)]">{learnedCount}</span>
            <span className="text-lg text-muted-foreground">/ {vocabularyData.length}</span>
          </div>
        </div>
      </header>

      <div className="w-full flex items-center justify-center gap-4 max-w-2xl mx-auto">
        <Button variant="outline" size="icon" className="rounded-full w-12 h-12" onClick={prevCard} data-testid="btn-prev-card">
          <ChevronLeft className="w-6 h-6" />
        </Button>
        
        <div className="flex-1 w-full relative h-[400px]">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentVocab.id}
              initial={{ opacity: 0, x: 50, scale: 0.9 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, x: -50, scale: 0.9 }}
              transition={{ duration: 0.3 }}
              className="absolute inset-0 w-full"
            >
              <FlipCard 
                vocab={currentVocab} 
                status={vocabProgress[currentVocab.id] || "new"} 
                onLearned={handleLearned} 
              />
            </motion.div>
          </AnimatePresence>
        </div>

        <Button variant="outline" size="icon" className="rounded-full w-12 h-12" onClick={nextCard} data-testid="btn-next-card">
          <ChevronRight className="w-6 h-6" />
        </Button>
      </div>

      <div className="text-muted-foreground font-mono mt-4">
        {currentIndex + 1} / {vocabularyData.length}
      </div>
    </div>
  );
}
