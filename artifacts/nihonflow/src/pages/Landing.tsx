import { Link } from "wouter";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Zap, Shield, Trophy, BookOpen, Target, Layers } from "lucide-react";

const features = [
  {
    icon: Zap,
    title: "RPG-Style Progress",
    description: "Earn XP, level up, and build daily streaks. Learning Japanese feels like beating a game.",
    color: "text-primary",
    glow: "rgba(147,51,234,0.3)",
    border: "border-primary/20",
    bg: "bg-primary/5",
  },
  {
    icon: Layers,
    title: "Full Kana Coverage",
    description: "Master all 46 Hiragana and 46 Katakana characters with interactive cards and instant quizzes.",
    color: "text-accent",
    glow: "rgba(59,130,246,0.3)",
    border: "border-accent/20",
    bg: "bg-accent/5",
  },
  {
    icon: BookOpen,
    title: "Smart Flashcards",
    description: "Flip cards reveal meanings, readings, and context. Mark words learned and track your mastery.",
    color: "text-green-400",
    glow: "rgba(34,197,94,0.3)",
    border: "border-green-500/20",
    bg: "bg-green-500/5",
  },
  {
    icon: Target,
    title: "Adaptive Quizzes",
    description: "Multiple-choice challenges across hiragana, katakana, and vocabulary. Every answer earns XP.",
    color: "text-orange-400",
    glow: "rgba(251,146,60,0.3)",
    border: "border-orange-400/20",
    bg: "bg-orange-400/5",
  },
  {
    icon: Trophy,
    title: "Streak Rewards",
    description: "Study every day to keep your streak alive. Consistency is what separates learners from dreamers.",
    color: "text-yellow-400",
    glow: "rgba(250,204,21,0.3)",
    border: "border-yellow-400/20",
    bg: "bg-yellow-400/5",
  },
  {
    icon: Shield,
    title: "Offline & Private",
    description: "All progress lives in your browser. No account, no server — your data stays with you.",
    color: "text-purple-400",
    glow: "rgba(192,132,252,0.3)",
    border: "border-purple-400/20",
    bg: "bg-purple-400/5",
  },
];

const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.08 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

export default function Landing() {
  return (
    <div className="min-h-[100dvh] bg-background text-foreground flex flex-col overflow-hidden relative" data-testid="page-landing">
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none" />
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[900px] h-[600px] bg-primary/15 rounded-full blur-[130px] pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-[400px] h-[400px] bg-accent/10 rounded-full blur-[100px] pointer-events-none" />

      {/* Navbar */}
      <nav className="container mx-auto px-6 py-5 flex items-center justify-between relative z-10">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center shadow-[0_0_20px_rgba(147,51,234,0.5)]">
            <span className="text-primary-foreground font-bold text-xl" style={{ fontFamily: "'Noto Sans JP', sans-serif" }}>日</span>
          </div>
          <span className="text-2xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-primary to-accent">NihonFlow</span>
        </div>
        <Link href="/dashboard">
          <Button variant="outline" className="border-primary/40 text-primary hover:bg-primary hover:text-primary-foreground transition-all" data-testid="link-signin">
            Enter App
          </Button>
        </Link>
      </nav>

      {/* Hero */}
      <main className="flex-1 flex items-center justify-center relative z-10">
        <div className="container mx-auto px-6 py-16 text-center max-w-5xl">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
          >
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-primary mb-10 font-medium text-sm">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-primary" />
              </span>
              Cyberpunk Tokyo Edition · Free Forever
            </div>

            <h1 className="text-6xl md:text-8xl font-black tracking-tighter mb-6 leading-[0.95]">
              Master Japanese
              <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-accent to-primary">
                In The Flow State
              </span>
            </h1>

            <p className="text-xl md:text-2xl text-muted-foreground mb-12 max-w-2xl mx-auto leading-relaxed">
              No boring textbooks. No subscriptions. Just pure immersive learning — hiragana, katakana, and vocabulary like an RPG.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 items-center justify-center">
              <Link href="/dashboard">
                <Button
                  size="lg"
                  className="h-16 px-12 text-lg rounded-2xl bg-primary text-primary-foreground hover:bg-primary/90 shadow-[0_0_40px_rgba(147,51,234,0.6)] transition-all hover:scale-105 hover:shadow-[0_0_60px_rgba(147,51,234,0.8)]"
                  data-testid="btn-start-learning"
                >
                  Start Learning Now
                </Button>
              </Link>
              <a href="#features">
                <Button variant="ghost" size="lg" className="h-16 px-8 text-lg rounded-2xl text-muted-foreground hover:text-foreground">
                  See How It Works
                </Button>
              </a>
            </div>
          </motion.div>

          {/* Floating deco */}
          <motion.div
            className="absolute top-1/4 left-[8%] text-7xl font-bold pointer-events-none select-none"
            style={{ fontFamily: "'Noto Sans JP', sans-serif", color: "rgba(147,51,234,0.15)" }}
            animate={{ y: [0, -18, 0] }}
            transition={{ duration: 4.2, repeat: Infinity, ease: "easeInOut" }}
          >あ</motion.div>
          <motion.div
            className="absolute bottom-1/4 right-[8%] text-8xl font-bold pointer-events-none select-none"
            style={{ fontFamily: "'Noto Sans JP', sans-serif", color: "rgba(59,130,246,0.15)" }}
            animate={{ y: [0, 20, 0] }}
            transition={{ duration: 5.1, repeat: Infinity, ease: "easeInOut", delay: 1 }}
          >カ</motion.div>
          <motion.div
            className="absolute top-2/3 left-[18%] text-5xl font-bold pointer-events-none select-none"
            style={{ fontFamily: "'Noto Sans JP', sans-serif", color: "rgba(147,51,234,0.12)" }}
            animate={{ y: [0, -14, 0] }}
            transition={{ duration: 3.8, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
          >語</motion.div>
          <motion.div
            className="absolute top-1/3 right-[15%] text-6xl font-bold pointer-events-none select-none"
            style={{ fontFamily: "'Noto Sans JP', sans-serif", color: "rgba(59,130,246,0.12)" }}
            animate={{ y: [0, 16, 0] }}
            transition={{ duration: 4.6, repeat: Infinity, ease: "easeInOut", delay: 2 }}
          >日</motion.div>
        </div>
      </main>

      {/* Features Section */}
      <section id="features" className="relative z-10 py-24 px-6">
        <div className="container mx-auto max-w-6xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-black tracking-tight mb-4">
              Everything you need to{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-accent">
                actually learn
              </span>
            </h2>
            <p className="text-muted-foreground text-lg max-w-xl mx-auto">
              Designed to feel like a game, built to create real language habits.
            </p>
          </motion.div>

          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5"
          >
            {features.map((feature) => (
              <motion.div
                key={feature.title}
                variants={itemVariants}
                whileHover={{ y: -4, transition: { duration: 0.2 } }}
                className={`${feature.bg} border ${feature.border} rounded-2xl p-6 relative overflow-hidden`}
              >
                <div
                  className="absolute top-0 right-0 w-32 h-32 rounded-full blur-[50px] opacity-50 -translate-y-1/2 translate-x-1/2"
                  style={{ background: feature.glow }}
                />
                <feature.icon className={`w-8 h-8 ${feature.color} mb-4 relative z-10`} strokeWidth={1.5} />
                <h3 className="font-bold text-lg mb-2 relative z-10">{feature.title}</h3>
                <p className="text-muted-foreground text-sm leading-relaxed relative z-10">{feature.description}</p>
              </motion.div>
            ))}
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="text-center mt-16"
          >
            <Link href="/dashboard">
              <Button
                size="lg"
                className="h-14 px-10 text-base rounded-2xl bg-primary text-primary-foreground hover:bg-primary/90 shadow-[0_0_30px_rgba(147,51,234,0.4)]"
                data-testid="btn-start-learning-footer"
              >
                Start Learning — It's Free
              </Button>
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 border-t border-border py-8 px-6">
        <div className="container mx-auto max-w-6xl flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-muted-foreground">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-lg bg-primary flex items-center justify-center">
              <span className="text-primary-foreground font-bold text-xs" style={{ fontFamily: "'Noto Sans JP', sans-serif" }}>日</span>
            </div>
            <span className="font-semibold text-foreground">NihonFlow</span>
            <span>· Japanese made immersive.</span>
          </div>
          <span>Built for learners who want the real thing.</span>
        </div>
      </footer>
    </div>
  );
}
