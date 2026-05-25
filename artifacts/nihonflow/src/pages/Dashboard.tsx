import { useProgress } from "@/hooks/useProgress";
import { StreakCard } from "@/components/StreakCard";
import { XPBar } from "@/components/XPBar";
import { Link } from "wouter";
import { Target, Type, BookOpen, LayoutGrid, Flame } from "lucide-react";
import { motion } from "framer-motion";

export default function Dashboard() {
  const { profile, hiraganaProgress, katakanaProgress, vocabProgress } = useProgress();

  const getProgressCount = (progressData: Record<string, string>, targetState: string) => {
    return Object.values(progressData).filter(s => s === targetState).length;
  };

  const hiraganaLearned = getProgressCount(hiraganaProgress, "learned");
  const katakanaLearned = getProgressCount(katakanaProgress, "learned");
  const vocabLearned = getProgressCount(vocabProgress, "learned");

  return (
    <div className="space-y-8 pb-12" data-testid="page-dashboard">
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-4xl font-bold tracking-tight mb-2">Welcome back, {profile.name}</h1>
          <p className="text-muted-foreground text-lg">Ready to level up your Japanese today?</p>
        </div>
        <div className="flex gap-4 items-center bg-card border border-card-border p-4 rounded-2xl shadow-sm">
          <div className="flex flex-col items-end">
            <span className="text-sm font-medium text-muted-foreground uppercase tracking-widest">Total Lessons</span>
            <span className="text-2xl font-bold text-accent">{profile.lessonsCompleted}</span>
          </div>
          <div className="w-px h-10 bg-border" />
          <div className="flex flex-col items-end">
            <span className="text-sm font-medium text-muted-foreground uppercase tracking-widest">Mastery</span>
            <span className="text-2xl font-bold text-primary">{hiraganaLearned + katakanaLearned + vocabLearned}</span>
          </div>
        </div>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <StreakCard streak={profile.streak} />
        
        <div className="bg-card border border-card-border rounded-2xl p-6 shadow-lg relative overflow-hidden flex flex-col justify-center">
          <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 rounded-full blur-[50px] -translate-y-1/2 translate-x-1/2" />
          <h3 className="text-sm text-muted-foreground uppercase tracking-widest mb-4">Level Progress</h3>
          <XPBar xp={profile.xp} />
        </div>
      </div>

      <section className="space-y-6 mt-12">
        <div className="flex items-center gap-2">
          <Target className="text-primary w-6 h-6" />
          <h2 className="text-2xl font-bold">Quick Access</h2>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
          <Link href="/hiragana">
            <motion.div whileHover={{ y: -4, scale: 1.02 }} className="bg-card hover:bg-card/80 border border-card-border hover:border-primary/50 transition-colors p-6 rounded-2xl cursor-pointer shadow-sm group">
              <Type className="w-8 h-8 text-primary mb-4 group-hover:drop-shadow-[0_0_8px_rgba(var(--primary),0.5)]" />
              <h3 className="font-bold text-lg mb-1">Hiragana</h3>
              <p className="text-sm text-muted-foreground">{hiraganaLearned}/46 learned</p>
            </motion.div>
          </Link>
          
          <Link href="/katakana">
            <motion.div whileHover={{ y: -4, scale: 1.02 }} className="bg-card hover:bg-card/80 border border-card-border hover:border-accent/50 transition-colors p-6 rounded-2xl cursor-pointer shadow-sm group">
              <LayoutGrid className="w-8 h-8 text-accent mb-4 group-hover:drop-shadow-[0_0_8px_rgba(var(--accent),0.5)]" />
              <h3 className="font-bold text-lg mb-1">Katakana</h3>
              <p className="text-sm text-muted-foreground">{katakanaLearned}/46 learned</p>
            </motion.div>
          </Link>

          <Link href="/flashcards">
            <motion.div whileHover={{ y: -4, scale: 1.02 }} className="bg-card hover:bg-card/80 border border-card-border hover:border-green-500/50 transition-colors p-6 rounded-2xl cursor-pointer shadow-sm group">
              <BookOpen className="w-8 h-8 text-green-500 mb-4 group-hover:drop-shadow-[0_0_8px_rgba(34,197,94,0.5)]" />
              <h3 className="font-bold text-lg mb-1">Vocabulary</h3>
              <p className="text-sm text-muted-foreground">{vocabLearned} words learned</p>
            </motion.div>
          </Link>

          <Link href="/quiz">
            <motion.div whileHover={{ y: -4, scale: 1.02 }} className="bg-gradient-to-br from-primary to-accent border border-transparent p-6 rounded-2xl cursor-pointer shadow-lg group relative overflow-hidden">
              <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors" />
              <div className="relative z-10 text-white">
                <Target className="w-8 h-8 mb-4 drop-shadow-[0_0_8px_rgba(255,255,255,0.5)]" />
                <h3 className="font-bold text-lg mb-1">Take a Quiz</h3>
                <p className="text-sm text-white/80">Earn XP & Level Up</p>
              </div>
            </motion.div>
          </Link>
        </div>
      </section>
    </div>
  );
}
