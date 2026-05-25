import { Link } from "wouter";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";

export default function Landing() {
  return (
    <div className="min-h-[100dvh] bg-background text-foreground flex flex-col overflow-hidden relative" data-testid="page-landing">
      {/* Background Grid & Glows */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]" />
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-primary/20 rounded-full blur-[120px] pointer-events-none" />
      
      <nav className="container mx-auto px-6 py-6 flex items-center justify-between relative z-10">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center shadow-[0_0_20px_rgba(var(--primary),0.5)]">
            <span className="text-primary-foreground font-bold font-jp text-xl">日</span>
          </div>
          <span className="text-2xl font-bold tracking-tight">NihonFlow</span>
        </div>
        <Link href="/dashboard">
          <Button variant="ghost" className="border-primary/50 text-primary hover:bg-primary hover:text-primary-foreground">
            Sign In
          </Button>
        </Link>
      </nav>

      <main className="flex-1 flex items-center justify-center relative z-10">
        <div className="container mx-auto px-6 py-12 text-center max-w-4xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary mb-8 font-medium">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
              </span>
              Cyberpunk Tokyo Edition v1.0
            </div>
            
            <h1 className="text-6xl md:text-8xl font-black tracking-tighter mb-6 leading-tight">
              Master Japanese <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-accent to-primary animate-gradient">
                In The Flow State
              </span>
            </h1>
            
            <p className="text-xl md:text-2xl text-muted-foreground mb-12 max-w-2xl mx-auto leading-relaxed">
              No boring textbooks. Just pure, immersive learning. Level up your Hiragana, Katakana, and Vocabulary like an RPG.
            </p>

            <Link href="/dashboard">
              <Button size="lg" className="h-16 px-12 text-lg rounded-2xl bg-primary text-primary-foreground hover:bg-primary/90 shadow-[0_0_40px_rgba(var(--primary),0.6)] transition-all hover:scale-105 hover:shadow-[0_0_60px_rgba(var(--primary),0.8)]">
                Start Learning Now
              </Button>
            </Link>
          </motion.div>

          {/* Floating Japanese Characters Deco */}
          <motion.div 
            className="absolute top-1/4 left-[10%] text-6xl font-jp text-primary/20 font-bold pointer-events-none"
            animate={{ y: [0, -20, 0] }} transition={{ duration: 4, repeat: Infinity }}
          >あ</motion.div>
          <motion.div 
            className="absolute bottom-1/4 right-[10%] text-7xl font-jp text-accent/20 font-bold pointer-events-none"
            animate={{ y: [0, 20, 0] }} transition={{ duration: 5, repeat: Infinity, delay: 1 }}
          >カ</motion.div>
          <motion.div 
            className="absolute top-1/2 right-[20%] text-5xl font-jp text-primary/20 font-bold pointer-events-none"
            animate={{ y: [0, -15, 0] }} transition={{ duration: 4.5, repeat: Infinity, delay: 0.5 }}
          >語</motion.div>
        </div>
      </main>
    </div>
  );
}
