import { useState } from "react";
import { useProgress } from "@/hooks/useProgress";
import { hiraganaData } from "@/data/hiragana";
import { katakanaData } from "@/data/katakana";
import { vocabularyData } from "@/data/vocabulary";
import { QuizQuestion, Question } from "@/components/QuizQuestion";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";
import { Trophy, RefreshCw, Zap, Target } from "lucide-react";

const generateQuestions = (count: number): Question[] => {
  const allSources = [
    ...hiraganaData.map((h) => ({ ...h, type: "hiragana" as const })),
    ...katakanaData.map((k) => ({ ...k, type: "katakana" as const })),
    ...vocabularyData.map((v) => ({ char: v.word, romaji: v.meaning, type: "vocab" as const })),
  ];

  const shuffled = [...allSources].sort(() => 0.5 - Math.random());
  const selected = shuffled.slice(0, count);

  return selected.map((item, index) => {
    const sameTypeSources = allSources.filter((s) => s.type === item.type && s.romaji !== item.romaji);
    const wrongOptions = [...sameTypeSources]
      .sort(() => 0.5 - Math.random())
      .slice(0, 3)
      .map((s) => s.romaji);
    const options = [item.romaji, ...wrongOptions].sort(() => 0.5 - Math.random());
    return { id: `q-${index}`, prompt: item.char, options, correctAnswer: item.romaji, type: item.type };
  });
};

function ScoreRing({ score, total }: { score: number; total: number }) {
  const pct = score / total;
  const r = 54;
  const circumference = 2 * Math.PI * r;
  const dash = circumference * pct;

  return (
    <div className="relative w-36 h-36 flex items-center justify-center">
      <svg className="absolute inset-0 -rotate-90" width="144" height="144" viewBox="0 0 144 144">
        <circle cx="72" cy="72" r={r} fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="10" />
        <motion.circle
          cx="72" cy="72" r={r} fill="none"
          stroke="url(#quizGrad)" strokeWidth="10"
          strokeLinecap="round"
          strokeDasharray={circumference}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset: circumference - dash }}
          transition={{ duration: 1.2, delay: 0.3, ease: "easeOut" }}
        />
        <defs>
          <linearGradient id="quizGrad" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="hsl(270 80% 65%)" />
            <stop offset="100%" stopColor="hsl(217 91% 60%)" />
          </linearGradient>
        </defs>
      </svg>
      <div className="text-center z-10">
        <div className="text-4xl font-black text-foreground">{score}</div>
        <div className="text-xs text-muted-foreground font-mono">/ {total}</div>
      </div>
    </div>
  );
}

export default function Quiz() {
  const { addXP, completeLesson } = useProgress();
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [isFinished, setIsFinished] = useState(false);
  const [isStarted, setIsStarted] = useState(false);

  const startQuiz = () => {
    setQuestions(generateQuestions(10));
    setCurrentIndex(0);
    setScore(0);
    setIsFinished(false);
    setIsStarted(true);
  };

  const handleAnswer = (isCorrect: boolean) => {
    if (isCorrect) {
      setScore((prev) => prev + 1);
      addXP(10);
    }
    if (currentIndex < questions.length - 1) {
      setCurrentIndex((prev) => prev + 1);
    } else {
      setIsFinished(true);
      completeLesson();
    }
  };

  return (
    <div className="min-h-[70vh] flex flex-col" data-testid="page-quiz">
      <AnimatePresence mode="wait">
        {!isStarted ? (
          <motion.div
            key="start"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="flex-1 flex flex-col items-center justify-center max-w-lg mx-auto text-center py-12"
          >
            <div className="relative mb-8">
              <div className="w-28 h-28 rounded-3xl bg-gradient-to-br from-primary to-accent flex items-center justify-center shadow-[0_0_50px_rgba(147,51,234,0.5)]">
                <Trophy className="w-14 h-14 text-white" strokeWidth={1.5} />
              </div>
              <motion.div
                className="absolute inset-0 rounded-3xl bg-primary/20 blur-[30px] -z-10"
                animate={{ scale: [1, 1.15, 1], opacity: [0.5, 0.8, 0.5] }}
                transition={{ duration: 3, repeat: Infinity }}
              />
            </div>
            <h1 className="text-4xl font-black mb-3">Daily Challenge</h1>
            <p className="text-lg text-muted-foreground mb-3 leading-relaxed max-w-sm">
              10 questions across Hiragana, Katakana, and Vocabulary.
            </p>
            <div className="flex items-center gap-2 text-primary font-bold text-sm mb-10 bg-primary/10 border border-primary/20 px-4 py-2 rounded-full">
              <Zap className="w-4 h-4" />
              Earn up to 100 XP
            </div>
            <Button
              size="lg"
              className="w-full max-w-xs h-14 text-lg bg-primary text-primary-foreground hover:bg-primary/90 rounded-2xl shadow-[0_0_30px_rgba(147,51,234,0.4)]"
              onClick={startQuiz}
              data-testid="btn-start-quiz"
            >
              Start Quiz
            </Button>
          </motion.div>
        ) : isFinished ? (
          <motion.div
            key="result"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            className="flex-1 flex flex-col items-center justify-center max-w-lg mx-auto text-center py-12"
          >
            <ScoreRing score={score} total={questions.length} />

            <motion.h2
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="text-4xl font-black mt-6 mb-2"
            >
              {score >= 8 ? "Outstanding!" : score >= 5 ? "Nice Work!" : "Keep Going!"}
            </motion.h2>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="text-muted-foreground text-lg mb-2"
            >
              You got {score} out of {questions.length} correct
            </motion.p>
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.7, type: "spring" }}
              className="text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-primary to-accent mb-10"
            >
              +{score * 10} XP Earned
            </motion.div>
            <div className="flex flex-col sm:flex-row gap-3 w-full max-w-xs">
              <Button
                size="lg"
                className="flex-1 h-12 bg-primary text-primary-foreground hover:bg-primary/90 rounded-2xl"
                onClick={startQuiz}
                data-testid="btn-retry-quiz"
              >
                <RefreshCw className="mr-2 h-4 w-4" /> Play Again
              </Button>
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="quiz"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex-1 flex flex-col mt-4"
          >
            {/* Progress bar */}
            <div className="w-full max-w-lg mx-auto mb-6">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Target className="w-4 h-4" />
                  <span className="text-sm font-medium">
                    Question {currentIndex + 1} / {questions.length}
                  </span>
                </div>
                <span className="text-sm font-bold text-primary">{score} correct</span>
              </div>
              <div className="h-2 w-full bg-card border border-card-border rounded-full overflow-hidden">
                <motion.div
                  className="h-full bg-gradient-to-r from-primary to-accent rounded-full"
                  animate={{ width: `${((currentIndex) / questions.length) * 100}%` }}
                  transition={{ duration: 0.4 }}
                />
              </div>
            </div>

            <AnimatePresence mode="wait">
              <QuizQuestion
                key={questions[currentIndex].id}
                question={questions[currentIndex]}
                onAnswer={handleAnswer}
              />
            </AnimatePresence>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
