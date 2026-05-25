import { useProgress } from "@/hooks/useProgress";
import { StreakCard } from "@/components/StreakCard";
import { XPBar } from "@/components/XPBar";
import { Link } from "wouter";
import { Target, Type, BookOpen, LayoutGrid, CheckCircle2, Circle } from "lucide-react";
import { motion } from "framer-motion";

const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.07 } },
};

const cardVariants = {
  hidden: { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4 } },
};

export default function Dashboard() {
  const { profile, hiraganaProgress, katakanaProgress, vocabProgress } = useProgress();

  const getProgressCount = (progressData: Record<string, string>, targetState: string) =>
    Object.values(progressData).filter((s) => s === targetState).length;

  const hiraganaLearned = getProgressCount(hiraganaProgress, "learned");
  const katakanaLearned = getProgressCount(katakanaProgress, "learned");
  const vocabLearned = getProgressCount(vocabProgress, "learned");

  const dailyGoals = [
    { label: "Learn 5 Hiragana characters", done: hiraganaLearned >= 5 },
    { label: "Learn 5 Katakana characters", done: katakanaLearned >= 5 },
    { label: "Learn 3 Vocabulary words", done: vocabLearned >= 3 },
    { label: "Complete a Quiz", done: profile.lessonsCompleted >= 1 },
  ];
  const goalsCompleted = dailyGoals.filter((g) => g.done).length;

  const hour = new Date().getHours();
  const greeting =
    hour < 12 ? "Good morning" : hour < 17 ? "Good afternoon" : "Good evening";

  return (
    <div className="space-y-8 pb-12" data-testid="page-dashboard">
      {/* Header */}
      <motion.header
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="flex flex-col md:flex-row md:items-end justify-between gap-4"
      >
        <div>
          <p className="text-muted-foreground text-sm uppercase tracking-widest font-medium mb-1">{greeting}</p>
          <h1 className="text-4xl font-black tracking-tight leading-tight">
            {profile.name} <span className="text-primary">·</span>
          </h1>
          <p className="text-muted-foreground text-base mt-1">Ready to level up your Japanese today?</p>
        </div>
        <div className="flex gap-4 items-center bg-card border border-card-border px-5 py-3 rounded-2xl shadow-sm shrink-0">
          <div className="text-center">
            <span className="text-xs font-medium text-muted-foreground uppercase tracking-widest block">Mastered</span>
            <span className="text-2xl font-bold text-primary">{hiraganaLearned + katakanaLearned + vocabLearned}</span>
          </div>
          <div className="w-px h-8 bg-border" />
          <div className="text-center">
            <span className="text-xs font-medium text-muted-foreground uppercase tracking-widest block">Lessons</span>
            <span className="text-2xl font-bold text-accent">{profile.lessonsCompleted}</span>
          </div>
          <div className="w-px h-8 bg-border" />
          <div className="text-center">
            <span className="text-xs font-medium text-muted-foreground uppercase tracking-widest block">Streak</span>
            <span className="text-2xl font-bold text-orange-400">{profile.streak}</span>
          </div>
        </div>
      </motion.header>

      {/* Streak + XP */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="grid grid-cols-1 md:grid-cols-2 gap-5"
      >
        <motion.div variants={cardVariants}>
          <StreakCard streak={profile.streak} />
        </motion.div>
        <motion.div
          variants={cardVariants}
          className="bg-card border border-card-border rounded-2xl p-6 shadow-lg relative overflow-hidden flex flex-col justify-center"
        >
          <div className="absolute top-0 right-0 w-40 h-40 bg-primary/8 rounded-full blur-[60px] -translate-y-1/2 translate-x-1/2" />
          <h3 className="text-xs text-muted-foreground uppercase tracking-widest mb-4">Level Progress</h3>
          <XPBar xp={profile.xp} />
        </motion.div>
      </motion.div>

      {/* Daily Goals */}
      <motion.section
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="bg-card border border-card-border rounded-2xl p-6 shadow-lg relative overflow-hidden"
      >
        <div className="absolute top-0 right-0 w-48 h-48 bg-accent/5 rounded-full blur-[80px] -translate-y-1/2 translate-x-1/2" />
        <div className="flex items-center justify-between mb-5 relative z-10">
          <div className="flex items-center gap-2">
            <Target className="w-5 h-5 text-accent" />
            <h2 className="text-lg font-bold">Daily Goals</h2>
          </div>
          <span className="text-sm font-mono text-muted-foreground">
            <span className="text-accent font-bold">{goalsCompleted}</span> / {dailyGoals.length}
          </span>
        </div>
        <div className="w-full h-1.5 bg-background border border-border rounded-full mb-5 overflow-hidden relative z-10">
          <motion.div
            className="h-full bg-gradient-to-r from-accent to-primary rounded-full"
            initial={{ width: 0 }}
            animate={{ width: `${(goalsCompleted / dailyGoals.length) * 100}%` }}
            transition={{ duration: 0.8, delay: 0.4, type: "spring" }}
          />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 relative z-10">
          {dailyGoals.map((goal, i) => (
            <motion.div
              key={goal.label}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 + i * 0.08 }}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl border transition-colors ${
                goal.done
                  ? "bg-green-500/8 border-green-500/20 text-green-400"
                  : "bg-background border-border text-muted-foreground"
              }`}
            >
              {goal.done ? (
                <CheckCircle2 className="w-5 h-5 shrink-0 text-green-400" />
              ) : (
                <Circle className="w-5 h-5 shrink-0 text-muted-foreground/40" />
              )}
              <span className="text-sm font-medium">{goal.label}</span>
            </motion.div>
          ))}
        </div>
      </motion.section>

      {/* Quick Access */}
      <section className="space-y-4">
        <div className="flex items-center gap-2">
          <div className="w-1 h-5 rounded-full bg-primary" />
          <h2 className="text-xl font-bold">Start Learning</h2>
        </div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-2 md:grid-cols-4 gap-4"
        >
          <motion.div variants={cardVariants}>
            <Link href="/hiragana">
              <motion.div
                whileHover={{ y: -4, scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="bg-card hover:bg-card/80 border border-card-border hover:border-primary/50 transition-colors p-5 rounded-2xl cursor-pointer shadow-sm group h-full"
                data-testid="link-hiragana"
              >
                <div className="text-3xl mb-3" style={{ fontFamily: "'Noto Sans JP', sans-serif", color: "hsl(var(--primary))", filter: "drop-shadow(0 0 8px rgba(147,51,234,0.4))" }}>あ</div>
                <h3 className="font-bold text-base mb-1">Hiragana</h3>
                <p className="text-xs text-muted-foreground">{hiraganaLearned}/46 learned</p>
                <div className="mt-3 h-1 bg-background rounded-full overflow-hidden">
                  <motion.div
                    className="h-full bg-primary rounded-full"
                    initial={{ width: 0 }}
                    animate={{ width: `${(hiraganaLearned / 46) * 100}%` }}
                    transition={{ duration: 0.6, delay: 0.5 }}
                  />
                </div>
              </motion.div>
            </Link>
          </motion.div>

          <motion.div variants={cardVariants}>
            <Link href="/katakana">
              <motion.div
                whileHover={{ y: -4, scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="bg-card hover:bg-card/80 border border-card-border hover:border-accent/50 transition-colors p-5 rounded-2xl cursor-pointer shadow-sm group h-full"
                data-testid="link-katakana"
              >
                <div className="text-3xl mb-3" style={{ fontFamily: "'Noto Sans JP', sans-serif", color: "hsl(var(--accent))", filter: "drop-shadow(0 0 8px rgba(59,130,246,0.4))" }}>ア</div>
                <h3 className="font-bold text-base mb-1">Katakana</h3>
                <p className="text-xs text-muted-foreground">{katakanaLearned}/46 learned</p>
                <div className="mt-3 h-1 bg-background rounded-full overflow-hidden">
                  <motion.div
                    className="h-full bg-accent rounded-full"
                    initial={{ width: 0 }}
                    animate={{ width: `${(katakanaLearned / 46) * 100}%` }}
                    transition={{ duration: 0.6, delay: 0.6 }}
                  />
                </div>
              </motion.div>
            </Link>
          </motion.div>

          <motion.div variants={cardVariants}>
            <Link href="/flashcards">
              <motion.div
                whileHover={{ y: -4, scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="bg-card hover:bg-card/80 border border-card-border hover:border-green-500/50 transition-colors p-5 rounded-2xl cursor-pointer shadow-sm group h-full"
                data-testid="link-flashcards"
              >
                <BookOpen className="w-8 h-8 text-green-400 mb-3" strokeWidth={1.5} />
                <h3 className="font-bold text-base mb-1">Flashcards</h3>
                <p className="text-xs text-muted-foreground">{vocabLearned}/30 learned</p>
                <div className="mt-3 h-1 bg-background rounded-full overflow-hidden">
                  <motion.div
                    className="h-full bg-green-500 rounded-full"
                    initial={{ width: 0 }}
                    animate={{ width: `${(vocabLearned / 30) * 100}%` }}
                    transition={{ duration: 0.6, delay: 0.7 }}
                  />
                </div>
              </motion.div>
            </Link>
          </motion.div>

          <motion.div variants={cardVariants}>
            <Link href="/quiz">
              <motion.div
                whileHover={{ y: -4, scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="bg-gradient-to-br from-primary to-accent border border-transparent p-5 rounded-2xl cursor-pointer shadow-lg group relative overflow-hidden h-full"
                data-testid="link-quiz"
              >
                <div className="absolute inset-0 bg-black/10 group-hover:bg-transparent transition-colors rounded-2xl" />
                <div className="relative z-10 text-white">
                  <Target className="w-8 h-8 mb-3" strokeWidth={1.5} />
                  <h3 className="font-bold text-base mb-1">Take a Quiz</h3>
                  <p className="text-xs text-white/75">Earn XP · Level Up</p>
                </div>
              </motion.div>
            </Link>
          </motion.div>
        </motion.div>
      </section>
    </div>
  );
}
