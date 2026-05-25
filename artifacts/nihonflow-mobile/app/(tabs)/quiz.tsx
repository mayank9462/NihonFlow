import * as Haptics from "expo-haptics";
import React, { useCallback, useState } from "react";
import {
  Platform,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useColors } from "@/hooks/useColors";
import { useLearning } from "@/context/LearningContext";
import { ALL_CHARACTERS, HIRAGANA, KATAKANA, type Character } from "@/data/characters";

const QUIZ_LENGTH = 10;

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function buildQuestion(chars: Character[], correct: Character) {
  const others = chars.filter((c) => c.romaji !== correct.romaji);
  const distractors = shuffle(others).slice(0, 3);
  const options = shuffle([correct, ...distractors]);
  return { correct, options };
}

type QuizType = "kana-to-romaji" | "romaji-to-kana";
type Deck = "all" | "hiragana" | "katakana";

export default function QuizScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const { addXP, recordAnswer, recordSession } = useLearning();

  const [started, setStarted] = useState(false);
  const [deck, setDeck] = useState<Deck>("all");
  const [quizType, setQuizType] = useState<QuizType>("kana-to-romaji");
  const [questions, setQuestions] = useState<
    { correct: Character; options: Character[] }[]
  >([]);
  const [index, setIndex] = useState(0);
  const [selected, setSelected] = useState<string | null>(null);
  const [score, setScore] = useState(0);
  const [done, setDone] = useState(false);

  const current = questions[index];

  const startQuiz = useCallback(() => {
    const source =
      deck === "hiragana" ? HIRAGANA : deck === "katakana" ? KATAKANA : ALL_CHARACTERS;
    const pool = shuffle(source).slice(0, QUIZ_LENGTH);
    setQuestions(pool.map((c) => buildQuestion(source, c)));
    setIndex(0);
    setSelected(null);
    setScore(0);
    setDone(false);
    setStarted(true);
    recordSession();
  }, [deck, recordSession]);

  const handleAnswer = async (option: Character) => {
    if (selected) return;
    const isCorrect = option.romaji === current.correct.romaji;
    setSelected(option.romaji);
    await Haptics.impactAsync(
      isCorrect
        ? Haptics.ImpactFeedbackStyle.Light
        : Haptics.ImpactFeedbackStyle.Medium,
    );
    if (isCorrect) {
      setScore((s) => s + 1);
      addXP(10);
      recordAnswer(true);
    } else {
      recordAnswer(false);
    }
    setTimeout(() => {
      if (index + 1 >= questions.length) {
        setDone(true);
      } else {
        setIndex((i) => i + 1);
        setSelected(null);
      }
    }, 900);
  };

  const webTopInset = Platform.OS === "web" ? 67 : 0;

  if (!started) {
    return (
      <View
        style={[
          styles.container,
          {
            backgroundColor: colors.background,
            paddingTop: insets.top + webTopInset,
            paddingBottom: insets.bottom + (Platform.OS === "web" ? 34 : 0) + 100,
          },
        ]}
      >
        <View style={styles.startContent}>
          <View
            style={[
              styles.iconBg,
              { backgroundColor: `${colors.primary}22` },
            ]}
          >
            <Ionicons name="trophy-outline" size={44} color={colors.primary} />
          </View>
          <Text style={[styles.startTitle, { color: colors.foreground }]}>
            Quiz Mode
          </Text>
          <Text style={[styles.startSub, { color: colors.mutedForeground }]}>
            {QUIZ_LENGTH} questions to test your knowledge
          </Text>

          <Text style={[styles.configLabel, { color: colors.mutedForeground }]}>
            Deck
          </Text>
          <View style={styles.optionRow}>
            {(["all", "hiragana", "katakana"] as Deck[]).map((d) => (
              <Pressable
                key={d}
                onPress={() => setDeck(d)}
                style={[
                  styles.optionChip,
                  {
                    backgroundColor:
                      deck === d ? colors.primary : colors.card,
                    borderColor: deck === d ? colors.primary : colors.border,
                    borderRadius: 20,
                  },
                ]}
              >
                <Text
                  style={[
                    styles.optionChipText,
                    { color: deck === d ? "#fff" : colors.mutedForeground },
                  ]}
                >
                  {d === "all"
                    ? "All"
                    : d.charAt(0).toUpperCase() + d.slice(1)}
                </Text>
              </Pressable>
            ))}
          </View>

          <Text style={[styles.configLabel, { color: colors.mutedForeground }]}>
            Direction
          </Text>
          <View style={styles.optionRow}>
            {(
              [
                { v: "kana-to-romaji" as QuizType, l: "Kana → Reading" },
                { v: "romaji-to-kana" as QuizType, l: "Reading → Kana" },
              ] as const
            ).map(({ v, l }) => (
              <Pressable
                key={v}
                onPress={() => setQuizType(v)}
                style={[
                  styles.optionChip,
                  {
                    backgroundColor:
                      quizType === v ? colors.primary : colors.card,
                    borderColor:
                      quizType === v ? colors.primary : colors.border,
                    borderRadius: 20,
                  },
                ]}
              >
                <Text
                  style={[
                    styles.optionChipText,
                    { color: quizType === v ? "#fff" : colors.mutedForeground },
                  ]}
                >
                  {l}
                </Text>
              </Pressable>
            ))}
          </View>

          <Pressable
            onPress={startQuiz}
            style={({ pressed }) => [
              styles.startButton,
              {
                backgroundColor: colors.primary,
                borderRadius: colors.radius,
                opacity: pressed ? 0.85 : 1,
              },
            ]}
          >
            <Text style={styles.startButtonText}>Start Quiz</Text>
          </Pressable>
        </View>
      </View>
    );
  }

  if (done) {
    const pct = Math.round((score / questions.length) * 100);
    return (
      <View
        style={[
          styles.container,
          {
            backgroundColor: colors.background,
            paddingTop: insets.top + webTopInset,
            paddingBottom: insets.bottom + (Platform.OS === "web" ? 34 : 0) + 100,
          },
        ]}
      >
        <View style={styles.startContent}>
          <View
            style={[styles.iconBg, { backgroundColor: `${colors.primary}22` }]}
          >
            <Ionicons name="trophy" size={44} color={colors.primary} />
          </View>
          <Text style={[styles.startTitle, { color: colors.foreground }]}>
            Quiz Complete!
          </Text>
          <Text style={[styles.scoreBig, { color: colors.primary }]}>
            {score}/{questions.length}
          </Text>
          <Text style={[styles.scorePct, { color: colors.mutedForeground }]}>
            {pct}% correct
          </Text>
          <Text
            style={[styles.scoreEmoji, { color: colors.foreground }]}
          >
            {pct >= 90 ? "Excellent!" : pct >= 70 ? "Well done!" : pct >= 50 ? "Keep going!" : "Practice more!"}
          </Text>

          <Pressable
            onPress={startQuiz}
            style={({ pressed }) => [
              styles.startButton,
              {
                backgroundColor: colors.primary,
                borderRadius: colors.radius,
                opacity: pressed ? 0.85 : 1,
                marginTop: 8,
              },
            ]}
          >
            <Text style={styles.startButtonText}>Try Again</Text>
          </Pressable>
          <Pressable onPress={() => setStarted(false)}>
            <Text style={[styles.backLink, { color: colors.mutedForeground }]}>
              Change settings
            </Text>
          </Pressable>
        </View>
      </View>
    );
  }

  const prompt =
    quizType === "kana-to-romaji" ? current.correct.kana : current.correct.romaji;
  const getOptionLabel = (opt: Character) =>
    quizType === "kana-to-romaji" ? opt.romaji : opt.kana;
  const isCorrect = (opt: Character) =>
    opt.romaji === current.correct.romaji;

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: colors.background,
          paddingTop: insets.top + webTopInset,
          paddingBottom: insets.bottom + (Platform.OS === "web" ? 34 : 0) + 100,
        },
      ]}
    >
      <View style={styles.quizHeader}>
        <Text style={[styles.quizProgress, { color: colors.mutedForeground }]}>
          {index + 1} / {questions.length}
        </Text>
        <View style={[styles.quizBar, { backgroundColor: colors.muted }]}>
          <View
            style={[
              styles.quizBarFill,
              {
                backgroundColor: colors.primary,
                width: `${((index + 1) / questions.length) * 100}%` as never,
              },
            ]}
          />
        </View>
      </View>

      <View style={styles.promptArea}>
        <Text style={[styles.promptChar, { color: colors.foreground }]}>
          {prompt}
        </Text>
        <Text style={[styles.promptHint, { color: colors.mutedForeground }]}>
          {quizType === "kana-to-romaji"
            ? "Choose the reading"
            : "Choose the character"}
        </Text>
      </View>

      <View style={styles.optionsGrid}>
        {current.options.map((opt) => {
          const wasSelected = selected === opt.romaji;
          const correct = isCorrect(opt);
          const showResult = !!selected;

          let bg = colors.card;
          let border = colors.border;
          if (showResult && wasSelected && correct) {
            bg = "#10b98122";
            border = "#10b981";
          } else if (showResult && wasSelected && !correct) {
            bg = `${colors.destructive}22`;
            border = colors.destructive;
          } else if (showResult && correct) {
            bg = "#10b98122";
            border = "#10b981";
          }

          return (
            <Pressable
              key={opt.romaji + opt.kana}
              onPress={() => handleAnswer(opt)}
              disabled={!!selected}
              style={({ pressed }) => [
                styles.optionButton,
                {
                  backgroundColor: bg,
                  borderColor: border,
                  borderRadius: colors.radius,
                  opacity: pressed && !selected ? 0.8 : 1,
                },
              ]}
            >
              <Text style={[styles.optionLabel, { color: colors.foreground }]}>
                {getOptionLabel(opt)}
              </Text>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  startContent: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 28,
    gap: 14,
  },
  iconBg: {
    width: 88,
    height: 88,
    borderRadius: 44,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 4,
  },
  startTitle: { fontSize: 26, fontWeight: "700", letterSpacing: -0.5 },
  startSub: { fontSize: 15, textAlign: "center" },
  configLabel: {
    fontSize: 11,
    fontWeight: "700",
    textTransform: "uppercase",
    letterSpacing: 1,
    marginTop: 4,
    alignSelf: "flex-start",
  },
  optionRow: { flexDirection: "row", flexWrap: "wrap", gap: 8, alignSelf: "flex-start" },
  optionChip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderWidth: 1,
  },
  optionChipText: { fontSize: 13, fontWeight: "600" },
  startButton: {
    paddingHorizontal: 40,
    paddingVertical: 14,
    marginTop: 8,
  },
  startButtonText: { color: "#fff", fontSize: 16, fontWeight: "700", letterSpacing: 0.3 },
  scoreBig: { fontSize: 52, fontWeight: "800", lineHeight: 56 },
  scorePct: { fontSize: 18, fontWeight: "500" },
  scoreEmoji: { fontSize: 17, fontWeight: "600" },
  backLink: { fontSize: 14, marginTop: 8 },
  quizHeader: { paddingHorizontal: 24, paddingTop: 12, paddingBottom: 8, gap: 8 },
  quizProgress: { fontSize: 13, fontWeight: "600" },
  quizBar: { height: 4, borderRadius: 2, overflow: "hidden" },
  quizBarFill: { height: 4, borderRadius: 2 },
  promptArea: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    gap: 12,
    paddingHorizontal: 24,
  },
  promptChar: { fontSize: 80, fontWeight: "300" },
  promptHint: { fontSize: 14, fontWeight: "500" },
  optionsGrid: {
    paddingHorizontal: 20,
    paddingBottom: 20,
    gap: 10,
  },
  optionButton: {
    height: 56,
    borderWidth: 1.5,
    alignItems: "center",
    justifyContent: "center",
  },
  optionLabel: { fontSize: 18, fontWeight: "600" },
});
