import { useLocalStorage } from "./useLocalStorage";

export type ProfileData = {
  name: string;
  xp: number;
  streak: number;
  lastStudiedDate: string;
  lessonsCompleted: number;
};

export type ProgressState = "new" | "practicing" | "learned";

const defaultProfile: ProfileData = {
  name: "Student",
  xp: 0,
  streak: 0,
  lastStudiedDate: "",
  lessonsCompleted: 0,
};

export function useProgress() {
  const [profile, setProfile] = useLocalStorage<ProfileData>("nihonflow_profile", defaultProfile);
  const [hiraganaProgress, setHiraganaProgress] = useLocalStorage<Record<string, ProgressState>>("nihonflow_hiragana_progress", {});
  const [katakanaProgress, setKatakanaProgress] = useLocalStorage<Record<string, ProgressState>>("nihonflow_katakana_progress", {});
  const [vocabProgress, setVocabProgress] = useLocalStorage<Record<string, "new" | "learned">>("nihonflow_vocab_progress", {});

  // Update streak logic
  const checkStreak = () => {
    const today = new Date().toISOString().split("T")[0];
    if (profile.lastStudiedDate === today) return; // already studied today

    setProfile(prev => {
      let newStreak = prev.streak;
      if (prev.lastStudiedDate) {
        const lastDate = new Date(prev.lastStudiedDate);
        const currentDate = new Date(today);
        const diffTime = Math.abs(currentDate.getTime() - lastDate.getTime());
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        
        if (diffDays === 1) {
          newStreak += 1;
        } else if (diffDays > 1) {
          newStreak = 1;
        }
      } else {
        newStreak = 1;
      }

      return {
        ...prev,
        streak: newStreak,
        lastStudiedDate: today,
      };
    });
  };

  const addXP = (amount: number) => {
    checkStreak();
    setProfile(prev => ({ ...prev, xp: prev.xp + amount }));
  };

  const completeLesson = () => {
    checkStreak();
    setProfile(prev => ({ ...prev, lessonsCompleted: prev.lessonsCompleted + 1 }));
  };

  return {
    profile,
    setProfile,
    hiraganaProgress,
    setHiraganaProgress,
    katakanaProgress,
    setKatakanaProgress,
    vocabProgress,
    setVocabProgress,
    addXP,
    completeLesson,
    checkStreak
  };
}
