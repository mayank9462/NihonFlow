import { useProgress, ProgressState } from "@/hooks/useProgress";
import { hiraganaData } from "@/data/hiragana";
import { CharacterCard } from "@/components/CharacterCard";

export default function Hiragana() {
  const { hiraganaProgress, setHiraganaProgress, addXP } = useProgress();

  const toggleStatus = (char: string) => {
    const current = hiraganaProgress[char] || "new";
    let next: ProgressState = "new";
    
    if (current === "new") next = "practicing";
    else if (current === "practicing") {
      next = "learned";
      addXP(5); // Reward XP for learning a character
    }
    
    setHiraganaProgress(prev => ({
      ...prev,
      [char]: next
    }));
  };

  const learnedCount = Object.values(hiraganaProgress).filter(s => s === "learned").length;

  return (
    <div className="space-y-8" data-testid="page-hiragana">
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-4xl font-bold tracking-tight mb-2">Hiragana</h1>
          <p className="text-muted-foreground text-lg">The foundational alphabet of Japanese.</p>
        </div>
        <div className="bg-card border border-card-border px-6 py-4 rounded-2xl shadow-sm">
          <span className="text-sm font-medium text-muted-foreground uppercase tracking-widest block mb-1">Mastery</span>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-bold text-primary">{learnedCount}</span>
            <span className="text-lg text-muted-foreground">/ 46</span>
          </div>
        </div>
      </header>

      <div className="grid grid-cols-4 sm:grid-cols-5 md:grid-cols-6 lg:grid-cols-8 gap-4">
        {hiraganaData.map((item) => (
          <CharacterCard
            key={item.char}
            character={item}
            status={hiraganaProgress[item.char] || "new"}
            onClick={() => toggleStatus(item.char)}
          />
        ))}
      </div>
    </div>
  );
}
