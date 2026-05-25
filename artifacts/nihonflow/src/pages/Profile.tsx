import { useState } from "react";
import { useProgress } from "@/hooks/useProgress";
import { XPBar } from "@/components/XPBar";
import { StreakCard } from "@/components/StreakCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { User, Settings, Save, Edit2 } from "lucide-react";
import { motion } from "framer-motion";

export default function Profile() {
  const { profile, setProfile, hiraganaProgress, katakanaProgress, vocabProgress } = useProgress();
  const [isEditing, setIsEditing] = useState(false);
  const [nameInput, setNameInput] = useState(profile.name);

  const saveName = () => {
    if (nameInput.trim()) {
      setProfile(prev => ({ ...prev, name: nameInput.trim() }));
      setIsEditing(false);
    }
  };

  const getLearnedCount = (data: Record<string, string>) => Object.values(data).filter(s => s === "learned").length;
  
  const hLearned = getLearnedCount(hiraganaProgress);
  const kLearned = getLearnedCount(katakanaProgress);
  const vLearned = getLearnedCount(vocabProgress);

  return (
    <div className="space-y-8 max-w-4xl mx-auto" data-testid="page-profile">
      <header className="flex items-center gap-6 mb-12">
        <div className="w-24 h-24 rounded-full bg-card border-4 border-primary shadow-[0_0_20px_rgba(var(--primary),0.3)] flex items-center justify-center">
          <User className="w-10 h-10 text-primary" />
        </div>
        <div className="flex-1">
          {isEditing ? (
            <div className="flex items-center gap-2 max-w-xs">
              <Input 
                value={nameInput}
                onChange={(e) => setNameInput(e.target.value)}
                className="h-12 text-lg"
                autoFocus
                onKeyDown={(e) => e.key === "Enter" && saveName()}
              />
              <Button onClick={saveName} size="icon" className="h-12 w-12">
                <Save className="w-5 h-5" />
              </Button>
            </div>
          ) : (
            <div className="flex items-center gap-3">
              <h1 className="text-4xl font-bold tracking-tight">{profile.name}</h1>
              <Button variant="ghost" size="icon" onClick={() => setIsEditing(true)} className="text-muted-foreground hover:text-foreground">
                <Edit2 className="w-5 h-5" />
              </Button>
            </div>
          )}
          <p className="text-muted-foreground text-lg mt-1">Student of Japanese</p>
        </div>
      </header>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <StreakCard streak={profile.streak} />
        
        <div className="bg-card border border-card-border rounded-2xl p-6 shadow-lg flex flex-col justify-center">
          <h3 className="text-sm text-muted-foreground uppercase tracking-widest mb-4">Total Experience</h3>
          <XPBar xp={profile.xp} />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
        <StatCard title="Lessons Finished" value={profile.lessonsCompleted.toString()} color="text-accent" shadow="var(--accent)" />
        <StatCard title="Items Mastered" value={(hLearned + kLearned + vLearned).toString()} color="text-primary" shadow="var(--primary)" />
        <StatCard title="Accuracy Rate" value="High" color="text-green-500" shadow="34,197,94" />
      </div>

      <section className="bg-card border border-card-border rounded-3xl p-8 shadow-xl mt-12">
        <h2 className="text-2xl font-bold mb-8 flex items-center gap-2">
          <Settings className="w-6 h-6 text-muted-foreground" />
          Mastery Overview
        </h2>
        
        <div className="space-y-6">
          <ProgressRow label="Hiragana" current={hLearned} total={46} color="bg-primary" glow="var(--primary)" />
          <ProgressRow label="Katakana" current={kLearned} total={46} color="bg-accent" glow="var(--accent)" />
          <ProgressRow label="Vocabulary" current={vLearned} total={30} color="bg-green-500" glow="34,197,94" />
        </div>
      </section>
    </div>
  );
}

function StatCard({ title, value, color, shadow }: { title: string, value: string, color: string, shadow: string }) {
  return (
    <div className="bg-card border border-card-border rounded-2xl p-6 shadow-sm text-center">
      <span className="text-sm font-medium text-muted-foreground uppercase tracking-widest block mb-2">{title}</span>
      <span className={`text-4xl font-bold ${color}`} style={{ textShadow: `0 0 15px rgba(${shadow}, 0.4)` }}>
        {value}
      </span>
    </div>
  );
}

function ProgressRow({ label, current, total, color, glow }: { label: string, current: number, total: number, color: string, glow: string }) {
  const percentage = Math.round((current / total) * 100);
  
  return (
    <div>
      <div className="flex justify-between items-end mb-2">
        <span className="font-bold text-lg">{label}</span>
        <span className="text-sm font-mono text-muted-foreground">{current} / {total} ({percentage}%)</span>
      </div>
      <div className="h-3 w-full bg-background border border-border rounded-full overflow-hidden relative">
        <motion.div 
          className={`absolute top-0 left-0 h-full ${color}`}
          style={{ boxShadow: `0 0 10px rgba(${glow}, 0.8)` }}
          initial={{ width: 0 }}
          animate={{ width: `${percentage}%` }}
          transition={{ duration: 1, delay: 0.2 }}
        />
      </div>
    </div>
  );
}
