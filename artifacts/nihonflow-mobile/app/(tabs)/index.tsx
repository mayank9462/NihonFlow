import { useUser } from "@clerk/expo";
import { useRouter } from "expo-router";
import React from "react";
import {
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
import { useLearning } from "@/context/LearningContext";
import { HIRAGANA, KATAKANA } from "@/data/characters";

const XP_PER_LEVEL = 100;

function StatCard({
  label,
  value,
  icon,
  color,
}: {
  label: string;
  value: string | number;
  icon: keyof typeof Ionicons.glyphMap;
  color: string;
}) {
  const colors = useColors();
  return (
    <View
      style={[
        styles.statCard,
        { backgroundColor: colors.card, borderColor: colors.border, borderRadius: colors.radius },
      ]}
    >
      <Ionicons name={icon} size={20} color={color} />
      <Text style={[styles.statValue, { color: colors.foreground }]}>
        {value}
      </Text>
      <Text style={[styles.statLabel, { color: colors.mutedForeground }]}>
        {label}
      </Text>
    </View>
  );
}

function QuickCard({
  title,
  subtitle,
  icon,
  color,
  onPress,
}: {
  title: string;
  subtitle: string;
  icon: keyof typeof Ionicons.glyphMap;
  color: string;
  onPress: () => void;
}) {
  const colors = useColors();
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.quickCard,
        {
          backgroundColor: colors.card,
          borderColor: colors.border,
          borderRadius: colors.radius,
          opacity: pressed ? 0.75 : 1,
        },
      ]}
    >
      <View style={[styles.quickCardIcon, { backgroundColor: `${color}22` }]}>
        <Ionicons name={icon} size={24} color={color} />
      </View>
      <Text style={[styles.quickCardTitle, { color: colors.foreground }]}>
        {title}
      </Text>
      <Text style={[styles.quickCardSub, { color: colors.mutedForeground }]}>
        {subtitle}
      </Text>
    </Pressable>
  );
}

export default function DashboardScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { user } = useUser();
  const {
    xp,
    streak,
    masteredHiragana,
    masteredKatakana,
    totalSessions,
    correctAnswers,
    totalAnswers,
  } = useLearning();

  const level = Math.floor(xp / XP_PER_LEVEL) + 1;
  const xpInLevel = xp % XP_PER_LEVEL;
  const xpProgress = xpInLevel / XP_PER_LEVEL;

  const totalMastered = masteredHiragana.length + masteredKatakana.length;
  const totalChars = HIRAGANA.length + KATAKANA.length;
  const accuracy =
    totalAnswers > 0 ? Math.round((correctAnswers / totalAnswers) * 100) : 0;

  const webTopInset = Platform.OS === "web" ? 67 : 0;

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: colors.background }]}
      contentContainerStyle={[
        styles.content,
        {
          paddingTop: insets.top + webTopInset + 16,
          paddingBottom: insets.bottom + (Platform.OS === "web" ? 34 : 0) + 100,
        },
      ]}
      showsVerticalScrollIndicator={false}
    >
      <View style={styles.topRow}>
        <View>
          <Text style={[styles.greeting, { color: colors.mutedForeground }]}>
            おはよう
          </Text>
          <Text style={[styles.name, { color: colors.foreground }]}>
            {user?.firstName ?? user?.emailAddresses[0]?.emailAddress.split("@")[0] ?? "Learner"}
          </Text>
        </View>
        <View style={styles.streakPill}>
          <Ionicons name="flame" size={16} color="#f97316" />
          <Text style={[styles.streakText, { color: colors.foreground }]}>
            {streak} day{streak !== 1 ? "s" : ""}
          </Text>
        </View>
      </View>

      <View
        style={[
          styles.xpCard,
          { backgroundColor: colors.card, borderColor: colors.border, borderRadius: colors.radius },
        ]}
      >
        <View style={styles.xpHeader}>
          <View style={styles.xpLeft}>
            <Text style={[styles.xpLabel, { color: colors.mutedForeground }]}>
              Level {level}
            </Text>
            <Text style={[styles.xpValue, { color: colors.primary }]}>
              {xp} XP
            </Text>
          </View>
          <Text style={[styles.xpNext, { color: colors.mutedForeground }]}>
            {XP_PER_LEVEL - xpInLevel} to next level
          </Text>
        </View>
        <View
          style={[styles.xpBarBg, { backgroundColor: colors.muted }]}
        >
          <View
            style={[
              styles.xpBarFill,
              {
                backgroundColor: colors.primary,
                width: `${Math.min(xpProgress * 100, 100)}%` as never,
              },
            ]}
          />
        </View>
      </View>

      <View style={styles.statsRow}>
        <StatCard
          label="Mastered"
          value={`${totalMastered}/${totalChars}`}
          icon="checkmark-circle-outline"
          color={colors.accent}
        />
        <StatCard
          label="Sessions"
          value={totalSessions}
          icon="book-outline"
          color={colors.primary}
        />
        <StatCard
          label="Accuracy"
          value={`${accuracy}%`}
          icon="analytics-outline"
          color="#10b981"
        />
      </View>

      <Text style={[styles.sectionTitle, { color: colors.foreground }]}>
        Quick Practice
      </Text>

      <View style={styles.quickGrid}>
        <QuickCard
          title="Hiragana"
          subtitle={`${masteredHiragana.length}/${HIRAGANA.length}`}
          icon="language-outline"
          color={colors.primary}
          onPress={() => router.push("/(tabs)/learn")}
        />
        <QuickCard
          title="Katakana"
          subtitle={`${masteredKatakana.length}/${KATAKANA.length}`}
          icon="text-outline"
          color={colors.accent}
          onPress={() => router.push("/(tabs)/learn")}
        />
        <QuickCard
          title="Flashcards"
          subtitle="Practice cards"
          icon="layers-outline"
          color="#8b5cf6"
          onPress={() => router.push("/(tabs)/flashcards")}
        />
        <QuickCard
          title="Quiz"
          subtitle="Test yourself"
          icon="trophy-outline"
          color="#f59e0b"
          onPress={() => router.push("/(tabs)/quiz")}
        />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: { paddingHorizontal: 20, gap: 20 },
  topRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-end",
  },
  greeting: { fontSize: 14, fontWeight: "500", marginBottom: 2 },
  name: { fontSize: 24, fontWeight: "700", letterSpacing: -0.5 },
  streakPill: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    backgroundColor: "rgba(249,115,22,0.12)",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  streakText: { fontSize: 14, fontWeight: "700" },
  xpCard: {
    padding: 16,
    borderWidth: 1,
    gap: 12,
  },
  xpHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-end",
  },
  xpLeft: { gap: 2 },
  xpLabel: { fontSize: 12, fontWeight: "600", textTransform: "uppercase", letterSpacing: 0.8 },
  xpValue: { fontSize: 22, fontWeight: "700" },
  xpNext: { fontSize: 12, fontWeight: "500" },
  xpBarBg: { height: 6, borderRadius: 3, overflow: "hidden" },
  xpBarFill: { height: 6, borderRadius: 3 },
  statsRow: { flexDirection: "row", gap: 10 },
  statCard: {
    flex: 1,
    alignItems: "center",
    padding: 14,
    gap: 4,
    borderWidth: 1,
  },
  statValue: { fontSize: 18, fontWeight: "700" },
  statLabel: { fontSize: 11, fontWeight: "500", textAlign: "center" },
  sectionTitle: { fontSize: 17, fontWeight: "700", letterSpacing: -0.3 },
  quickGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
  },
  quickCard: {
    width: "47%",
    padding: 16,
    gap: 8,
    borderWidth: 1,
  },
  quickCardIcon: {
    width: 44,
    height: 44,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  quickCardTitle: { fontSize: 15, fontWeight: "700" },
  quickCardSub: { fontSize: 12, fontWeight: "500" },
});
