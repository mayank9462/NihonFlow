import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle2, XCircle } from "lucide-react";

export type Question = {
  id: string;
  prompt: string;
  options: string[];
  correctAnswer: string;
  type: "hiragana" | "katakana" | "vocab";
};

interface QuizQuestionProps {
  question: Question;
  onAnswer: (isCorrect: boolean) => void;
}

const typeLabel: Record<Question["type"], string> = {
  hiragana: "Hiragana",
  katakana: "Katakana",
  vocab: "Vocabulary",
};

export function QuizQuestion({ question, onAnswer }: QuizQuestionProps) {
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);

  const handleSelect = (answer: string) => {
    if (selectedAnswer) return;
    setSelectedAnswer(answer);
    const isCorrect = answer === question.correctAnswer;
    setTimeout(() => onAnswer(isCorrect), 1100);
  };

  const isSubmitted = selectedAnswer !== null;

  return (
    <motion.div
      key={question.id}
      initial={{ opacity: 0, x: 30 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -30 }}
      className="w-full max-w-lg mx-auto"
      data-testid={`quiz-question-${question.id}`}
    >
      <div className="bg-card border border-card-border rounded-3xl p-8 shadow-xl relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary via-accent to-primary" />

        <div className="text-center mb-8">
          <span className="inline-block text-xs font-bold text-primary/80 uppercase tracking-[0.25em] bg-primary/10 border border-primary/20 px-3 py-1 rounded-full mb-6">
            {typeLabel[question.type]}
          </span>
          <div
            className="text-7xl font-bold text-foreground"
            style={{ fontFamily: "'Noto Sans JP', sans-serif", textShadow: "0 0 40px rgba(147,51,234,0.2)" }}
          >
            {question.prompt}
          </div>
          <p className="text-muted-foreground text-sm mt-4">Select the correct reading / meaning</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {question.options.map((option, idx) => {
            const isSelected = selectedAnswer === option;
            const isCorrect = option === question.correctAnswer;
            const showCorrect = isSubmitted && isCorrect;
            const showWrong = isSubmitted && isSelected && !isCorrect;

            let className =
              "relative h-16 text-base font-mono font-semibold rounded-2xl border-2 transition-all duration-200 overflow-hidden flex items-center justify-center gap-2 ";

            if (!isSubmitted) {
              className += "bg-background border-border hover:border-primary/60 hover:bg-primary/5 cursor-pointer text-foreground";
            } else if (showCorrect) {
              className += "bg-green-500/15 border-green-500 text-green-400 shadow-[0_0_20px_rgba(34,197,94,0.25)]";
            } else if (showWrong) {
              className += "bg-red-500/15 border-red-500 text-red-400";
            } else {
              className += "bg-background border-border text-muted-foreground/40 cursor-default";
            }

            return (
              <motion.button
                key={option}
                className={className}
                onClick={() => handleSelect(option)}
                whileHover={!isSubmitted ? { scale: 1.02 } : {}}
                whileTap={!isSubmitted ? { scale: 0.98 } : {}}
                data-testid={`btn-option-${idx}`}
              >
                {showCorrect && <CheckCircle2 className="w-5 h-5 shrink-0" />}
                {showWrong && <XCircle className="w-5 h-5 shrink-0" />}
                {option}
              </motion.button>
            );
          })}
        </div>

        <AnimatePresence>
          {isSubmitted && (
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="mt-6 text-center"
            >
              {selectedAnswer === question.correctAnswer ? (
                <span className="text-green-400 font-bold text-lg tracking-wide">
                  Correct! +10 XP
                </span>
              ) : (
                <span className="text-muted-foreground text-sm">
                  Correct answer: <span className="text-primary font-bold">{question.correctAnswer}</span>
                </span>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}
