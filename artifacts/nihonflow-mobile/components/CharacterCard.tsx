import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { useColors } from "@/hooks/useColors";
import type { Character } from "@/data/characters";

interface CharacterCardProps {
  character: Character;
  showRomaji?: boolean;
  onPress?: () => void;
  mastered?: boolean;
  size?: "small" | "medium" | "large";
}

export function CharacterCard({
  character,
  showRomaji = false,
  onPress,
  mastered = false,
  size = "medium",
}: CharacterCardProps) {
  const colors = useColors();

  const cardSize = size === "small" ? 56 : size === "large" ? 100 : 72;
  const kanaSize = size === "small" ? 22 : size === "large" ? 40 : 28;
  const romajiSize = size === "small" ? 10 : size === "large" ? 14 : 11;

  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={onPress ? 0.7 : 1}
      style={[
        styles.card,
        {
          width: cardSize,
          height: cardSize,
          borderRadius: colors.radius,
          backgroundColor: mastered
            ? `${colors.primary}22`
            : colors.card,
          borderColor: mastered ? colors.primary : colors.border,
          borderWidth: mastered ? 1.5 : 1,
        },
      ]}
    >
      <Text
        style={[
          styles.kana,
          {
            fontSize: kanaSize,
            color: mastered ? colors.primary : colors.foreground,
          },
        ]}
      >
        {character.kana}
      </Text>
      {showRomaji && (
        <Text
          style={[
            styles.romaji,
            { fontSize: romajiSize, color: colors.mutedForeground },
          ]}
        >
          {character.romaji}
        </Text>
      )}
    </TouchableOpacity>
  );
}

interface FlipCardProps {
  character: Character;
  flipped: boolean;
  onFlip: () => void;
}

export function FlipCard({ character, flipped, onFlip }: FlipCardProps) {
  const colors = useColors();

  return (
    <TouchableOpacity
      onPress={onFlip}
      activeOpacity={0.9}
      style={[
        styles.flipCard,
        {
          backgroundColor: colors.card,
          borderRadius: colors.radius * 2,
          borderColor: colors.border,
        },
      ]}
    >
      {!flipped ? (
        <View style={styles.flipCardInner}>
          <Text style={[styles.flipKana, { color: colors.foreground }]}>
            {character.kana}
          </Text>
          <Text
            style={[styles.flipHint, { color: colors.mutedForeground }]}
          >
            Tap to reveal
          </Text>
        </View>
      ) : (
        <View style={styles.flipCardInner}>
          <Text style={[styles.flipKana, { color: colors.foreground }]}>
            {character.kana}
          </Text>
          <Text style={[styles.flipRomaji, { color: colors.primary }]}>
            {character.romaji}
          </Text>
          <Text
            style={[styles.flipType, { color: colors.mutedForeground }]}
          >
            {character.type}
          </Text>
        </View>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    alignItems: "center",
    justifyContent: "center",
    gap: 2,
  },
  kana: {
    fontWeight: "600",
  },
  romaji: {
    fontWeight: "500",
    letterSpacing: 0.5,
  },
  flipCard: {
    width: "100%",
    aspectRatio: 1,
    maxWidth: 300,
    alignSelf: "center",
    borderWidth: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  flipCardInner: {
    alignItems: "center",
    gap: 12,
  },
  flipKana: {
    fontSize: 72,
    fontWeight: "300",
  },
  flipRomaji: {
    fontSize: 32,
    fontWeight: "700",
    letterSpacing: 2,
    textTransform: "uppercase",
  },
  flipType: {
    fontSize: 13,
    fontWeight: "500",
    textTransform: "capitalize",
    letterSpacing: 1,
  },
  flipHint: {
    fontSize: 14,
    fontWeight: "400",
  },
});
