import { useAuth, useUser } from "@clerk/expo";
import React, { useState } from "react";
import {
  Alert,
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

function Row({
  icon,
  label,
  value,
  iconColor,
}: {
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
  value?: string | number;
  iconColor?: string;
}) {
  const colors = useColors();
  return (
    <View
      style={[
        styles.row,
        { borderBottomColor: colors.border },
      ]}
    >
      <View
        style={[
          styles.rowIcon,
          { backgroundColor: `${iconColor ?? colors.primary}22` },
        ]}
      >
        <Ionicons
          name={icon}
          size={18}
          color={iconColor ?? colors.primary}
        />
      </View>
      <Text style={[styles.rowLabel, { color: colors.foreground }]}>
        {label}
      </Text>
      {value !== undefined && (
        <Text style={[styles.rowValue, { color: colors.mutedForeground }]}>
          {value}
        </Text>
      )}
    </View>
  );
}

export default function ProfileScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const { user } = useUser();
  const { signOut } = useAuth();
  const {
    xp,
    streak,
    masteredHiragana,
    masteredKatakana,
    totalSessions,
    correctAnswers,
    totalAnswers,
    resetProgress,
  } = useLearning();

  const level = Math.floor(xp / XP_PER_LEVEL) + 1;
  const xpInLevel = xp % XP_PER_LEVEL;
  const accuracy =
    totalAnswers > 0 ? Math.round((correctAnswers / totalAnswers) * 100) : 0;

  const handleSignOut = async () => {
    await signOut();
  };

  const handleReset = () => {
    Alert.alert(
      "Reset Progress",
      "This will erase all your XP, streak, and mastered characters. Are you sure?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Reset",
          style: "destructive",
          onPress: resetProgress,
        },
      ],
    );
  };

  const webTopInset = Platform.OS === "web" ? 67 : 0;
  const displayName =
    user?.firstName ??
    user?.emailAddresses[0]?.emailAddress.split("@")[0] ??
    "Learner";

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
      <View style={styles.avatarSection}>
        <View
          style={[
            styles.avatar,
            { backgroundColor: `${colors.primary}33`, borderColor: colors.primary },
          ]}
        >
          <Text style={[styles.avatarText, { color: colors.primary }]}>
            {displayName.charAt(0).toUpperCase()}
          </Text>
        </View>
        <Text style={[styles.displayName, { color: colors.foreground }]}>
          {displayName}
        </Text>
        {user?.emailAddresses[0]?.emailAddress && (
          <Text style={[styles.email, { color: colors.mutedForeground }]}>
            {user.emailAddresses[0].emailAddress}
          </Text>
        )}
        <View style={[styles.levelBadge, { backgroundColor: `${colors.primary}22`, borderColor: `${colors.primary}44` }]}>
          <Ionicons name="star" size={12} color={colors.primary} />
          <Text style={[styles.levelText, { color: colors.primary }]}>
            Level {level}
          </Text>
        </View>
      </View>

      <View
        style={[
          styles.section,
          {
            backgroundColor: colors.card,
            borderColor: colors.border,
            borderRadius: colors.radius,
          },
        ]}
      >
        <Text style={[styles.sectionTitle, { color: colors.mutedForeground }]}>
          Progress
        </Text>
        <View style={styles.xpRow}>
          <Text style={[styles.xpLabel, { color: colors.mutedForeground }]}>
            XP
          </Text>
          <Text style={[styles.xpVal, { color: colors.primary }]}>{xp}</Text>
        </View>
        <View style={[styles.xpBar, { backgroundColor: colors.muted }]}>
          <View
            style={[
              styles.xpFill,
              {
                backgroundColor: colors.primary,
                width: `${(xpInLevel / XP_PER_LEVEL) * 100}%` as never,
              },
            ]}
          />
        </View>
        <Text
          style={[styles.xpSub, { color: colors.mutedForeground }]}
        >
          {XP_PER_LEVEL - xpInLevel} XP to level {level + 1}
        </Text>
      </View>

      <View
        style={[
          styles.section,
          {
            backgroundColor: colors.card,
            borderColor: colors.border,
            borderRadius: colors.radius,
          },
        ]}
      >
        <Text style={[styles.sectionTitle, { color: colors.mutedForeground }]}>
          Stats
        </Text>
        <Row
          icon="flame"
          label="Current Streak"
          value={`${streak} day${streak !== 1 ? "s" : ""}`}
          iconColor="#f97316"
        />
        <Row
          icon="checkmark-circle-outline"
          label="Hiragana Mastered"
          value={`${masteredHiragana.length}/${HIRAGANA.length}`}
          iconColor={colors.primary}
        />
        <Row
          icon="text-outline"
          label="Katakana Mastered"
          value={`${masteredKatakana.length}/${KATAKANA.length}`}
          iconColor={colors.accent}
        />
        <Row
          icon="book-outline"
          label="Study Sessions"
          value={totalSessions}
        />
        <Row
          icon="analytics-outline"
          label="Accuracy"
          value={totalAnswers > 0 ? `${accuracy}%` : "–"}
          iconColor="#10b981"
        />
      </View>

      <View
        style={[
          styles.section,
          {
            backgroundColor: colors.card,
            borderColor: colors.border,
            borderRadius: colors.radius,
          },
        ]}
      >
        <Text style={[styles.sectionTitle, { color: colors.mutedForeground }]}>
          Account
        </Text>
        <Pressable
          onPress={handleReset}
          style={({ pressed }) => [
            styles.dangerRow,
            {
              opacity: pressed ? 0.7 : 1,
              borderBottomColor: colors.border,
            },
          ]}
        >
          <View
            style={[
              styles.rowIcon,
              { backgroundColor: `${colors.destructive}22` },
            ]}
          >
            <Ionicons name="refresh" size={18} color={colors.destructive} />
          </View>
          <Text style={[styles.rowLabel, { color: colors.destructive }]}>
            Reset Progress
          </Text>
        </Pressable>
        <Pressable
          onPress={handleSignOut}
          style={({ pressed }) => [
            styles.dangerRow,
            {
              opacity: pressed ? 0.7 : 1,
              borderBottomWidth: 0,
            },
          ]}
        >
          <View
            style={[
              styles.rowIcon,
              { backgroundColor: `${colors.destructive}22` },
            ]}
          >
            <Ionicons name="log-out-outline" size={18} color={colors.destructive} />
          </View>
          <Text style={[styles.rowLabel, { color: colors.destructive }]}>
            Sign Out
          </Text>
        </Pressable>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: { paddingHorizontal: 20, gap: 20 },
  avatarSection: { alignItems: "center", gap: 6, paddingVertical: 8 },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    borderWidth: 2,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 4,
  },
  avatarText: { fontSize: 32, fontWeight: "700" },
  displayName: { fontSize: 22, fontWeight: "700", letterSpacing: -0.3 },
  email: { fontSize: 14, fontWeight: "400" },
  levelBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 20,
    borderWidth: 1,
    marginTop: 4,
  },
  levelText: { fontSize: 13, fontWeight: "700" },
  section: {
    borderWidth: 1,
    overflow: "hidden",
  },
  sectionTitle: {
    fontSize: 11,
    fontWeight: "700",
    textTransform: "uppercase",
    letterSpacing: 1,
    paddingHorizontal: 16,
    paddingTop: 14,
    paddingBottom: 10,
  },
  xpRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingBottom: 8,
  },
  xpLabel: { fontSize: 13, fontWeight: "600" },
  xpVal: { fontSize: 20, fontWeight: "800" },
  xpBar: { height: 6, marginHorizontal: 16, borderRadius: 3, overflow: "hidden" },
  xpFill: { height: 6, borderRadius: 3 },
  xpSub: { fontSize: 12, paddingHorizontal: 16, paddingTop: 6, paddingBottom: 14 },
  row: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 12,
    gap: 12,
    borderBottomWidth: 1,
  },
  dangerRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 14,
    gap: 12,
    borderBottomWidth: 1,
  },
  rowIcon: {
    width: 32,
    height: 32,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
  },
  rowLabel: { flex: 1, fontSize: 15, fontWeight: "500" },
  rowValue: { fontSize: 14, fontWeight: "600" },
});
