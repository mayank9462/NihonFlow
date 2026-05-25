import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { CheckCircle2, XCircle } from "lucide-react";

export type Question = {
  id: string;
  prompt: string; // The character or word meaning
  options: string[];
  correctAnswer: string;
  type: "hiragana" | "katakana" | "vocab";
};

interface QuizQuestionProps {
  question: Question;
  onAnswer: (isCorrect: boolean) => void;
}

export function QuizQuestion({ question, onAnswer }: QuizQuestionProps) {
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [hasSubmitted, setHasSubmitted] = useState(false);

  const handleSelect = (answer: string) => {
    if (hasSubmitted) return;
    setSelectedAnswer(answer);
  };

  const handleSubmit = () => {
    if (!selectedAnswer || hasSubmitted) return;
    setHasSubmitted(true);
    
    const isCorrect = selectedAnswer === question.correctAnswer;
    setTimeout(() => {
      onAnswer(isCorrect);
      setSelectedAnswer(null);
      setHasSubmitted(false);
    }, 1500);
  };

  return (
    <div className="w-full max-w-lg mx-auto" data-testid={`quiz-question-${question.id}`}>
      <motion.div
        key={question.id}
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: -20 }}
        className="bg-card border border-card-border rounded-3xl p-8 shadow-xl relative overflow-hidden"
      >
        <div className="text-center mb-8">
          <span className="text-sm font-mono text-primary uppercase tracking-widest mb-4 block">
            Select the correct meaning/reading
          </span>
          <h2 className="text-6xl font-bold font-jp text-foreground drop-shadow-md">
            {question.prompt}
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
          {question.options.map((option) => {
            const isSelected = selectedAnswer === option;
            const isCorrect = option === question.correctAnswer;
            
            let btnClass = "h-16 text-lg border-2 font-mono transition-all ";
            
            if (hasSubmitted) {
              if (isCorrect) {
                btnClass += "bg-green-500/20 border-green-500 text-green-400 shadow-[0_0_15px_rgba(34,197,94,0.3)]";
              } else if (isSelected && !isCorrect) {
                btnClass += "bg-red-500/20 border-red-500 text-red-400";
              } else {
                btnClass += "bg-card border-card-border text-muted-foreground opacity-50";
              }
            } else {
              if (isSelected) {
                btnClass += "bg-primary/20 border-primary text-primary shadow-[0_0_15px_rgba(var(--primary),0.3)] scale-[1.02]";
              } else {
                btnClass += "bg-card border-card-border hover:border-primary/50 hover:bg-card-foreground/5 text-foreground";
              }
            }

            return (
              <Button
                key={option}
                variant="outline"
                className={btnClass}
                onClick={() => handleSelect(option)}
                disabled={hasSubmitted}
                data-testid={`btn-option-${option}`}
              >
                {option}
              </Button>
            );
          })}
        </div>

        <AnimatePresence>
          {hasSubmitted && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="absolute inset-0 bg-background/80 backdrop-blur-sm flex flex-col items-center justify-center"
            >
              {selectedAnswer === question.correctAnswer ? (
                <>
                  <CheckCircle2 className="w-24 h-24 text-green-500 mb-4 drop-shadow-[0_0_20px_rgba(34,197,94,0.6)]" />
                  <h3 className="text-3xl font-bold text-green-400">+10 XP</h3>
                </>
              ) : (
                <>
                  <XCircle className="w-24 h-24 text-red-500 mb-4 drop-shadow-[0_0_20px_rgba(239,68,68,0.6)]" />
                  <h3 className="text-xl font-bold text-foreground">
                    Correct answer: <span className="text-primary">{question.correctAnswer}</span>
                  </h3>
                </>
              )}
            </motion.div>
          )}
        </AnimatePresence>

        <Button 
          className="w-full h-14 text-lg bg-primary hover:bg-primary/90 text-primary-foreground disabled:opacity-50"
          onClick={handleSubmit}
          disabled={!selectedAnswer || hasSubmitted}
          data-testid="btn-submit-answer"
        >
          Submit Answer
        </Button>
      </motion.div>
    </div>
  );
}
