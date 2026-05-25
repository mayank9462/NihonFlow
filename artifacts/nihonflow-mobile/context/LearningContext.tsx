import AsyncStorage from "@react-native-async-storage/async-storage";
import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";

const STORAGE_KEY = "nihonflow_progress_v1";

export interface LearningState {
  xp: number;
  streak: number;
  lastPracticed: string | null;
  masteredHiragana: string[];
  masteredKatakana: string[];
  totalSessions: number;
  correctAnswers: number;
  totalAnswers: number;
}

interface LearningContextValue extends LearningState {
  addXP: (amount: number) => void;
  markMastered: (kana: string, type: "hiragana" | "katakana") => void;
  recordAnswer: (correct: boolean) => void;
  recordSession: () => void;
  resetProgress: () => void;
  isLoaded: boolean;
}

const DEFAULT_STATE: LearningState = {
  xp: 0,
  streak: 0,
  lastPracticed: null,
  masteredHiragana: [],
  masteredKatakana: [],
  totalSessions: 0,
  correctAnswers: 0,
  totalAnswers: 0,
};

const LearningContext = createContext<LearningContextValue>({
  ...DEFAULT_STATE,
  addXP: () => {},
  markMastered: () => {},
  recordAnswer: () => {},
  recordSession: () => {},
  resetProgress: () => {},
  isLoaded: false,
});

export function LearningProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<LearningState>(DEFAULT_STATE);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    AsyncStorage.getItem(STORAGE_KEY).then((raw) => {
      if (raw) {
        try {
          setState(JSON.parse(raw));
        } catch {
          setState(DEFAULT_STATE);
        }
      }
      setIsLoaded(true);
    });
  }, []);

  const save = useCallback((newState: LearningState) => {
    setState(newState);
    AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(newState));
  }, []);

  const addXP = useCallback(
    (amount: number) => {
      const today = new Date().toDateString();
      const lastDate = state.lastPracticed
        ? new Date(state.lastPracticed).toDateString()
        : null;
      const yesterday = new Date(Date.now() - 86400000).toDateString();

      let newStreak = state.streak;
      if (lastDate !== today) {
        newStreak = lastDate === yesterday ? state.streak + 1 : 1;
      }

      save({
        ...state,
        xp: state.xp + amount,
        streak: newStreak,
        lastPracticed: new Date().toISOString(),
      });
    },
    [state, save],
  );

  const markMastered = useCallback(
    (kana: string, type: "hiragana" | "katakana") => {
      if (type === "hiragana") {
        if (state.masteredHiragana.includes(kana)) return;
        save({ ...state, masteredHiragana: [...state.masteredHiragana, kana] });
      } else {
        if (state.masteredKatakana.includes(kana)) return;
        save({
          ...state,
          masteredKatakana: [...state.masteredKatakana, kana],
        });
      }
    },
    [state, save],
  );

  const recordAnswer = useCallback(
    (correct: boolean) => {
      save({
        ...state,
        correctAnswers: state.correctAnswers + (correct ? 1 : 0),
        totalAnswers: state.totalAnswers + 1,
      });
    },
    [state, save],
  );

  const recordSession = useCallback(() => {
    save({ ...state, totalSessions: state.totalSessions + 1 });
  }, [state, save]);

  const resetProgress = useCallback(() => {
    save(DEFAULT_STATE);
  }, [save]);

  return (
    <LearningContext.Provider
      value={{
        ...state,
        addXP,
        markMastered,
        recordAnswer,
        recordSession,
        resetProgress,
        isLoaded,
      }}
    >
      {children}
    </LearningContext.Provider>
  );
}

export function useLearning() {
  return useContext(LearningContext);
}
