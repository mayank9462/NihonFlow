import React, { useState } from "react";
import {
  Modal,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useColors } from "@/hooks/useColors";
import { CharacterCard } from "@/components/CharacterCard";
import { useLearning } from "@/context/LearningContext";
import { HIRAGANA, KATAKANA, type Character } from "@/data/characters";

type Script = "hiragana" | "katakana";

export default function LearnScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const { masteredHiragana, masteredKatakana, markMastered, addXP } =
    useLearning();

  const [activeScript, setActiveScript] = useState<Script>("hiragana");
  const [selected, setSelected] = useState<Character | null>(null);

  const characters = activeScript === "hiragana" ? HIRAGANA : KATAKANA;
  const mastered =
    activeScript === "hiragana" ? masteredHiragana : masteredKatakana;

  const rows = characters.reduce<Record<string, Character[]>>((acc, char) => {
    if (!acc[char.row]) acc[char.row] = [];
    acc[char.row].push(char);
    return acc;
  }, {});

  const webTopInset = Platform.OS === "web" ? 67 : 0;

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View
        style={[
          styles.header,
          {
            paddingTop: insets.top + webTopInset + 12,
            backgroundColor: colors.background,
            borderBottomColor: colors.border,
          },
        ]}
      >
        <Text style={[styles.headerTitle, { color: colors.foreground }]}>
          Characters
        </Text>
        <View
          style={[
            styles.segmentControl,
            { backgroundColor: colors.muted, borderRadius: colors.radius },
          ]}
        >
          {(["hiragana", "katakana"] as Script[]).map((s) => (
            <Pressable
              key={s}
              onPress={() => setActiveScript(s)}
              style={[
                styles.segment,
                {
                  backgroundColor:
                    activeScript === s ? colors.primary : "transparent",
                  borderRadius: colors.radius - 2,
                },
              ]}
            >
              <Text
                style={[
                  styles.segmentText,
                  {
                    color:
                      activeScript === s
                        ? "#fff"
                        : colors.mutedForeground,
                  },
                ]}
              >
                {s.charAt(0).toUpperCase() + s.slice(1)}
              </Text>
            </Pressable>
          ))}
        </View>

        <Text style={[styles.progressText, { color: colors.mutedForeground }]}>
          {mastered.length}/{characters.length} mastered
        </Text>
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={[
          styles.scrollContent,
          {
            paddingBottom:
              insets.bottom + (Platform.OS === "web" ? 34 : 0) + 100,
          },
        ]}
        showsVerticalScrollIndicator={false}
      >
        {Object.entries(rows).map(([row, chars]) => (
          <View key={row} style={styles.rowGroup}>
            <Text
              style={[styles.rowLabel, { color: colors.mutedForeground }]}
            >
              {row}-row
            </Text>
            <View style={styles.charRow}>
              {chars.map((char) => (
                <CharacterCard
                  key={char.kana}
                  character={char}
                  showRomaji
                  mastered={mastered.includes(char.kana)}
                  onPress={() => setSelected(char)}
                  size="medium"
                />
              ))}
            </View>
          </View>
        ))}
      </ScrollView>

      <Modal
        visible={!!selected}
        transparent
        animationType="fade"
        onRequestClose={() => setSelected(null)}
      >
        <Pressable
          style={styles.modalBackdrop}
          onPress={() => setSelected(null)}
        >
          <Pressable
            style={[
              styles.modalCard,
              {
                backgroundColor: colors.card,
                borderColor: colors.border,
                borderRadius: colors.radius * 2,
              },
            ]}
            onPress={(e) => e.stopPropagation()}
          >
            {selected && (
              <>
                <Text
                  style={[styles.modalKana, { color: colors.foreground }]}
                >
                  {selected.kana}
                </Text>
                <Text
                  style={[styles.modalRomaji, { color: colors.primary }]}
                >
                  {selected.romaji}
                </Text>
                <Text
                  style={[
                    styles.modalType,
                    { color: colors.mutedForeground },
                  ]}
                >
                  {selected.type}
                </Text>

                <Pressable
                  onPress={() => {
                    const isMastered = mastered.includes(selected.kana);
                    if (!isMastered) {
                      markMastered(selected.kana, selected.type);
                      addXP(5);
                    }
                    setSelected(null);
                  }}
                  style={({ pressed }) => [
                    styles.masterButton,
                    {
                      backgroundColor: mastered.includes(selected.kana)
                        ? colors.muted
                        : colors.primary,
                      borderRadius: colors.radius,
                      opacity: pressed ? 0.8 : 1,
                    },
                  ]}
                >
                  <Ionicons
                    name={
                      mastered.includes(selected.kana)
                        ? "checkmark-circle"
                        : "checkmark-circle-outline"
                    }
                    size={20}
                    color={
                      mastered.includes(selected.kana)
                        ? colors.mutedForeground
                        : "#fff"
                    }
                  />
                  <Text
                    style={[
                      styles.masterButtonText,
                      {
                        color: mastered.includes(selected.kana)
                          ? colors.mutedForeground
                          : "#fff",
                      },
                    ]}
                  >
                    {mastered.includes(selected.kana)
                      ? "Mastered"
                      : "Mark as Mastered"}
                  </Text>
                </Pressable>
              </>
            )}
          </Pressable>
        </Pressable>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: {
    paddingHorizontal: 20,
    paddingBottom: 16,
    borderBottomWidth: 1,
    gap: 12,
  },
  headerTitle: { fontSize: 24, fontWeight: "700", letterSpacing: -0.5 },
  segmentControl: {
    flexDirection: "row",
    padding: 3,
    gap: 2,
  },
  segment: {
    flex: 1,
    paddingVertical: 8,
    alignItems: "center",
  },
  segmentText: { fontSize: 14, fontWeight: "600" },
  progressText: { fontSize: 13, fontWeight: "500" },
  scrollView: { flex: 1 },
  scrollContent: { padding: 20, gap: 24 },
  rowGroup: { gap: 10 },
  rowLabel: {
    fontSize: 12,
    fontWeight: "700",
    textTransform: "uppercase",
    letterSpacing: 1,
  },
  charRow: { flexDirection: "row", flexWrap: "wrap", gap: 8 },
  modalBackdrop: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.7)",
    alignItems: "center",
    justifyContent: "center",
    padding: 24,
  },
  modalCard: {
    width: "100%",
    maxWidth: 320,
    padding: 32,
    alignItems: "center",
    gap: 8,
    borderWidth: 1,
  },
  modalKana: { fontSize: 80, fontWeight: "300" },
  modalRomaji: { fontSize: 28, fontWeight: "700", letterSpacing: 2 },
  modalType: { fontSize: 13, fontWeight: "500", textTransform: "capitalize" },
  masterButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    paddingHorizontal: 24,
    paddingVertical: 12,
    marginTop: 16,
  },
  masterButtonText: { fontSize: 15, fontWeight: "600" },
});
