import * as Haptics from "expo-haptics";
import React, { useState } from "react";
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
import { FlipCard } from "@/components/CharacterCard";
import { useLearning } from "@/context/LearningContext";
import { ALL_CHARACTERS, HIRAGANA, KATAKANA, type Character } from "@/data/characters";

type Deck = "all" | "hiragana" | "katakana";

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export default function FlashcardsScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const { addXP, markMastered, recordAnswer, recordSession } = useLearning();

  const [deck, setDeck] = useState<Deck>("all");
  const [cards, setCards] = useState<Character[]>(() => shuffle(ALL_CHARACTERS));
  const [index, setIndex] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const [correct, setCorrect] = useState(0);
  const [incorrect, setIncorrect] = useState(0);
  const [done, setDone] = useState(false);

  const current = cards[index];
  const total = cards.length;
  const progress = total > 0 ? index / total : 0;

  const startDeck = (d: Deck) => {
    const source =
      d === "hiragana" ? HIRAGANA : d === "katakana" ? KATAKANA : ALL_CHARACTERS;
    setCards(shuffle(source));
    setDeck(d);
    setIndex(0);
    setFlipped(false);
    setCorrect(0);
    setIncorrect(0);
    setDone(false);
    recordSession();
  };

  const handleResult = async (gotIt: boolean) => {
    await Haptics.impactAsync(
      gotIt
        ? Haptics.ImpactFeedbackStyle.Light
        : Haptics.ImpactFeedbackStyle.Medium,
    );
    if (gotIt) {
      setCorrect((c) => c + 1);
      addXP(3);
      markMastered(current.kana, current.type);
      recordAnswer(true);
    } else {
      setIncorrect((i) => i + 1);
      recordAnswer(false);
    }

    if (index + 1 >= total) {
      setDone(true);
    } else {
      setIndex((i) => i + 1);
      setFlipped(false);
    }
  };

  const webTopInset = Platform.OS === "web" ? 67 : 0;

  if (done) {
    const accuracy =
      total > 0 ? Math.round((correct / total) * 100) : 0;
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
        <View style={styles.doneContainer}>
          <View
            style={[
              styles.doneIconBg,
              { backgroundColor: `${colors.primary}22` },
            ]}
          >
            <Ionicons name="trophy" size={48} color={colors.primary} />
          </View>
          <Text style={[styles.doneTitle, { color: colors.foreground }]}>
            Session Complete!
          </Text>
          <Text style={[styles.doneAccuracy, { color: colors.primary }]}>
            {accuracy}%
          </Text>
          <Text style={[styles.doneLabel, { color: colors.mutedForeground }]}>
            accuracy
          </Text>
          <View style={styles.doneStats}>
            <View style={styles.doneStat}>
              <Ionicons name="checkmark-circle" size={20} color="#10b981" />
              <Text style={[styles.doneStatVal, { color: colors.foreground }]}>
                {correct}
              </Text>
              <Text
                style={[styles.doneStatLbl, { color: colors.mutedForeground }]}
              >
                correct
              </Text>
            </View>
            <View style={styles.doneStat}>
              <Ionicons name="close-circle" size={20} color={colors.destructive} />
              <Text style={[styles.doneStatVal, { color: colors.foreground }]}>
                {incorrect}
              </Text>
              <Text
                style={[styles.doneStatLbl, { color: colors.mutedForeground }]}
              >
                missed
              </Text>
            </View>
          </View>
          <Pressable
            onPress={() => startDeck(deck)}
            style={({ pressed }) => [
              styles.restartButton,
              {
                backgroundColor: colors.primary,
                borderRadius: colors.radius,
                opacity: pressed ? 0.85 : 1,
              },
            ]}
          >
            <Ionicons name="refresh" size={20} color="#fff" />
            <Text style={styles.restartButtonText}>Practice Again</Text>
          </Pressable>
        </View>
      </View>
    );
  }

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: colors.background,
          paddingTop: insets.top + webTopInset,
        },
      ]}
    >
      <View style={[styles.header, { paddingHorizontal: 20, paddingBottom: 16 }]}>
        <Text style={[styles.headerTitle, { color: colors.foreground }]}>
          Flashcards
        </Text>
        <View style={styles.deckRow}>
          {(["all", "hiragana", "katakana"] as Deck[]).map((d) => (
            <Pressable
              key={d}
              onPress={() => startDeck(d)}
              style={[
                styles.deckChip,
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
                  styles.deckChipText,
                  {
                    color: deck === d ? "#fff" : colors.mutedForeground,
                  },
                ]}
              >
                {d === "all" ? "All" : d.charAt(0).toUpperCase() + d.slice(1)}
              </Text>
            </Pressable>
          ))}
        </View>
      </View>

      <View style={[styles.progressBar, { backgroundColor: colors.muted }]}>
        <View
          style={[
            styles.progressFill,
            {
              backgroundColor: colors.primary,
              width: `${progress * 100}%` as never,
            },
          ]}
        />
      </View>

      <View style={styles.counter}>
        <Text style={[styles.counterText, { color: colors.mutedForeground }]}>
          {index + 1} / {total}
        </Text>
      </View>

      <View
        style={[
          styles.cardArea,
          {
            paddingBottom:
              insets.bottom + (Platform.OS === "web" ? 34 : 0) + 100,
          },
        ]}
      >
        <FlipCard
          character={current}
          flipped={flipped}
          onFlip={() => setFlipped((f) => !f)}
        />

        {flipped && (
          <View style={styles.actionRow}>
            <Pressable
              onPress={() => handleResult(false)}
              style={({ pressed }) => [
                styles.missButton,
                {
                  backgroundColor: `${colors.destructive}22`,
                  borderColor: colors.destructive,
                  borderRadius: colors.radius,
                  opacity: pressed ? 0.8 : 1,
                },
              ]}
            >
              <Ionicons name="close" size={24} color={colors.destructive} />
            </Pressable>
            <Pressable
              onPress={() => handleResult(true)}
              style={({ pressed }) => [
                styles.gotButton,
                {
                  backgroundColor: `#10b98122`,
                  borderColor: "#10b981",
                  borderRadius: colors.radius,
                  opacity: pressed ? 0.8 : 1,
                },
              ]}
            >
              <Ionicons name="checkmark" size={24} color="#10b981" />
            </Pressable>
          </View>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { gap: 12 },
  headerTitle: { fontSize: 24, fontWeight: "700", letterSpacing: -0.5 },
  deckRow: { flexDirection: "row", gap: 8 },
  deckChip: {
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderWidth: 1,
  },
  deckChipText: { fontSize: 13, fontWeight: "600" },
  progressBar: { height: 3 },
  progressFill: { height: 3 },
  counter: { alignItems: "center", paddingVertical: 8 },
  counterText: { fontSize: 13, fontWeight: "600" },
  cardArea: {
    flex: 1,
    paddingHorizontal: 24,
    justifyContent: "center",
    gap: 24,
  },
  actionRow: {
    flexDirection: "row",
    justifyContent: "center",
    gap: 24,
  },
  missButton: {
    width: 72,
    height: 72,
    borderWidth: 1.5,
    alignItems: "center",
    justifyContent: "center",
  },
  gotButton: {
    width: 72,
    height: 72,
    borderWidth: 1.5,
    alignItems: "center",
    justifyContent: "center",
  },
  doneContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 32,
    gap: 12,
  },
  doneIconBg: {
    width: 96,
    height: 96,
    borderRadius: 48,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 8,
  },
  doneTitle: { fontSize: 26, fontWeight: "700", letterSpacing: -0.5 },
  doneAccuracy: { fontSize: 56, fontWeight: "800", lineHeight: 60 },
  doneLabel: { fontSize: 14, fontWeight: "500" },
  doneStats: { flexDirection: "row", gap: 32, marginTop: 8 },
  doneStat: { alignItems: "center", gap: 4 },
  doneStatVal: { fontSize: 22, fontWeight: "700" },
  doneStatLbl: { fontSize: 12, fontWeight: "500" },
  restartButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    paddingHorizontal: 28,
    paddingVertical: 14,
    marginTop: 16,
  },
  restartButtonText: { color: "#fff", fontSize: 16, fontWeight: "700" },
});
