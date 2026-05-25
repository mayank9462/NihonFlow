import { useProgress, ProgressState } from "@/hooks/useProgress";
import { katakanaData } from "@/data/katakana";
import { CharacterCard } from "@/components/CharacterCard";

export default function Katakana() {
  const { katakanaProgress, setKatakanaProgress, addXP } = useProgress();

  const toggleStatus = (char: string) => {
    const current = katakanaProgress[char] || "new";
    let next: ProgressState = "new";
    
    if (current === "new") next = "practicing";
    else if (current === "practicing") {
      next = "learned";
      addXP(5); // Reward XP for learning a character
    }
    
    setKatakanaProgress(prev => ({
      ...prev,
      [char]: next
    }));
  };

  const learnedCount = Object.values(katakanaProgress).filter(s => s === "learned").length;

  return (
    <div className="space-y-8" data-testid="page-katakana">
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-4xl font-bold tracking-tight mb-2">Katakana</h1>
          <p className="text-muted-foreground text-lg">Used for foreign words and emphasis.</p>
        </div>
        <div className="bg-card border border-card-border px-6 py-4 rounded-2xl shadow-sm">
          <span className="text-sm font-medium text-muted-foreground uppercase tracking-widest block mb-1">Mastery</span>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-bold text-accent">{learnedCount}</span>
            <span className="text-lg text-muted-foreground">/ 46</span>
          </div>
        </div>
      </header>

      <div className="grid grid-cols-4 sm:grid-cols-5 md:grid-cols-6 lg:grid-cols-8 gap-4">
        {katakanaData.map((item) => (
          <CharacterCard
            key={item.char}
            character={item}
            status={katakanaProgress[item.char] || "new"}
            onClick={() => toggleStatus(item.char)}
          />
        ))}
      </div>
    </div>
  );
}
