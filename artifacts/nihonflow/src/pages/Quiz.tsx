import { useState, useMemo } from "react";
import { useProgress } from "@/hooks/useProgress";
import { hiraganaData } from "@/data/hiragana";
import { katakanaData } from "@/data/katakana";
import { vocabularyData } from "@/data/vocabulary";
import { QuizQuestion, Question } from "@/components/QuizQuestion";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";
import { Trophy, RefreshCw } from "lucide-react";

const generateQuestions = (count: number): Question[] => {
  const allSources = [
    ...hiraganaData.map(h => ({ ...h, type: "hiragana" as const })),
    ...katakanaData.map(k => ({ ...k, type: "katakana" as const })),
    ...vocabularyData.map(v => ({ char: v.word, romaji: v.meaning, type: "vocab" as const }))
  ];

  const shuffled = [...allSources].sort(() => 0.5 - Math.random());
  const selected = shuffled.slice(0, count);

  return selected.map((item, index) => {
    // Generate 3 wrong options of the SAME type
    const sameTypeSources = allSources.filter(s => s.type === item.type && s.romaji !== item.romaji);
    const wrongOptions = [...sameTypeSources].sort(() => 0.5 - Math.random()).slice(0, 3).map(s => s.romaji);
    
    const options = [item.romaji, ...wrongOptions].sort(() => 0.5 - Math.random());

    return {
      id: `q-${index}`,
      prompt: item.char,
      options,
      correctAnswer: item.romaji,
      type: item.type,
    };
  });
};

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
      setScore(prev => prev + 1);
      addXP(10);
    }
    
    if (currentIndex < questions.length - 1) {
      setCurrentIndex(prev => prev + 1);
    } else {
      setIsFinished(true);
      completeLesson();
    }
  };

  return (
    <div className="min-h-[70vh] flex flex-col" data-testid="page-quiz">
      {!isStarted ? (
        <div className="flex-1 flex flex-col items-center justify-center max-w-lg mx-auto text-center">
          <Trophy className="w-24 h-24 text-accent mb-8 drop-shadow-[0_0_20px_rgba(var(--accent),0.6)]" />
          <h1 className="text-4xl font-bold mb-4">Daily Challenge</h1>
          <p className="text-xl text-muted-foreground mb-12">
            Test your knowledge across Hiragana, Katakana, and Vocabulary.
            Earn 10 XP for each correct answer!
          </p>
          <Button size="lg" className="w-full h-16 text-xl bg-primary text-primary-foreground" onClick={startQuiz} data-testid="btn-start-quiz">
            Start Quiz
          </Button>
        </div>
      ) : isFinished ? (
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="flex-1 flex flex-col items-center justify-center max-w-lg mx-auto text-center"
        >
          <div className="relative mb-8">
            <Trophy className="w-32 h-32 text-primary drop-shadow-[0_0_30px_rgba(var(--primary),0.8)]" />
            <motion.div 
              className="absolute inset-0 bg-primary/20 rounded-full blur-[40px] -z-10"
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
            />
          </div>
          <h2 className="text-5xl font-bold mb-4">Quiz Complete!</h2>
          <div className="text-2xl text-muted-foreground mb-8">
            You scored <span className="text-primary font-bold">{score}</span> out of {questions.length}
          </div>
          <div className="text-3xl font-bold text-accent mb-12 drop-shadow-[0_0_10px_rgba(var(--accent),0.5)]">
            +{score * 10} XP Earned
          </div>
          <Button size="lg" variant="outline" className="h-14 text-lg" onClick={startQuiz} data-testid="btn-retry-quiz">
            <RefreshCw className="mr-2 h-5 w-5" /> Play Again
          </Button>
        </motion.div>
      ) : (
        <div className="flex-1 flex flex-col mt-8">
          <div className="w-full max-w-lg mx-auto mb-8 flex items-center justify-between">
            <span className="text-lg font-bold text-muted-foreground tracking-widest uppercase">
              Question {currentIndex + 1} / {questions.length}
            </span>
            <span className="text-lg font-bold text-primary">Score: {score}</span>
          </div>
          
          <AnimatePresence mode="wait">
            <QuizQuestion 
              key={questions[currentIndex].id}
              question={questions[currentIndex]}
              onAnswer={handleAnswer}
            />
          </AnimatePresence>
        </div>
      )}
    </div>
  );
}
