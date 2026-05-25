import { useSSO, useSignUp } from "@clerk/expo";
import * as AuthSession from "expo-auth-session";
import { Link, useRouter } from "expo-router";
import * as WebBrowser from "expo-web-browser";
import React, { useCallback, useEffect, useState } from "react";
import {
  ActivityIndicator,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useColors } from "@/hooks/useColors";

WebBrowser.maybeCompleteAuthSession();

export default function SignUpPage() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { signUp, errors, fetchStatus } = useSignUp();
  const { startSSOFlow } = useSSO();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [code, setCode] = useState("");

  useEffect(() => {
    if (Platform.OS !== "android") return;
    void WebBrowser.warmUpAsync();
    return () => {
      void WebBrowser.coolDownAsync();
    };
  }, []);

  const handleSignUp = async () => {
    const { error } = await signUp.password({ emailAddress: email, password });
    if (error) return;
    await signUp.verifications.sendEmailCode();
  };

  const handleVerify = async () => {
    await signUp.verifications.verifyEmailCode({ code });
    if (signUp.status === "complete") {
      await signUp.finalize({
        navigate: ({ decorateUrl }) => {
          router.replace(decorateUrl("/(tabs)") as never);
        },
      });
    }
  };

  const handleGoogleSignUp = useCallback(async () => {
    try {
      const { createdSessionId, setActive } = await startSSOFlow({
        strategy: "oauth_google",
        redirectUrl: AuthSession.makeRedirectUri(),
      });
      if (createdSessionId) {
        setActive!({
          session: createdSessionId,
          navigate: async ({ decorateUrl }) => {
            router.replace(decorateUrl("/(tabs)") as never);
          },
        });
      }
    } catch (err) {
      console.error(JSON.stringify(err, null, 2));
    }
  }, [startSSOFlow, router]);

  if (
    signUp.status === "missing_requirements" &&
    signUp.unverifiedFields.includes("email_address") &&
    signUp.missingFields.length === 0
  ) {
    return (
      <View
        style={[
          styles.container,
          {
            backgroundColor: colors.background,
            paddingTop: insets.top + 24,
            paddingBottom: insets.bottom + 24,
          },
        ]}
      >
        <View style={styles.header}>
          <Text style={[styles.title, { color: colors.foreground }]}>
            Verify Email
          </Text>
          <Text style={[styles.subtitle, { color: colors.mutedForeground }]}>
            We sent a code to {email}
          </Text>
        </View>

        <View style={styles.form}>
          <TextInput
            style={[
              styles.input,
              {
                backgroundColor: colors.input,
                borderColor: errors?.fields?.code ? colors.destructive : colors.border,
                color: colors.foreground,
                textAlign: "center",
                letterSpacing: 8,
                fontSize: 22,
                fontWeight: "600",
              },
            ]}
            placeholder="000000"
            placeholderTextColor={colors.mutedForeground}
            value={code}
            onChangeText={setCode}
            keyboardType="numeric"
            maxLength={6}
            autoFocus
          />
          {errors?.fields?.code && (
            <Text style={[styles.errorText, { color: colors.destructive }]}>
              {errors.fields.code.message}
            </Text>
          )}

          <Pressable
            onPress={handleVerify}
            disabled={code.length < 6 || fetchStatus === "fetching"}
            style={({ pressed }) => [
              styles.primaryButton,
              {
                backgroundColor: colors.primary,
                opacity:
                  code.length < 6 || fetchStatus === "fetching"
                    ? 0.5
                    : pressed
                      ? 0.85
                      : 1,
              },
            ]}
          >
            {fetchStatus === "fetching" ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.primaryButtonText}>Verify & Continue</Text>
            )}
          </Pressable>

          <Pressable
            onPress={() => signUp.verifications.sendEmailCode()}
            style={styles.resendButton}
          >
            <Text style={[styles.linkText, { color: colors.primary }]}>
              Resend code
            </Text>
          </Pressable>
        </View>

        <View nativeID="clerk-captcha" />
      </View>
    );
  }

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: colors.background,
          paddingTop: insets.top + 24,
          paddingBottom: insets.bottom + 24,
        },
      ]}
    >
      <View style={styles.header}>
        <View
          style={[
            styles.logoBox,
            { backgroundColor: `${colors.primary}22`, borderColor: `${colors.primary}44` },
          ]}
        >
          <Text style={styles.logoText}>日</Text>
        </View>
        <Text style={[styles.appName, { color: colors.foreground }]}>
          NihonFlow
        </Text>
        <Text style={[styles.subtitle, { color: colors.mutedForeground }]}>
          Start your Japanese learning journey
        </Text>
      </View>

      <View style={styles.form}>
        <Pressable
          onPress={handleGoogleSignUp}
          style={({ pressed }) => [
            styles.googleButton,
            {
              backgroundColor: colors.card,
              borderColor: colors.border,
              opacity: pressed ? 0.8 : 1,
            },
          ]}
        >
          <Ionicons name="logo-google" size={20} color={colors.foreground} />
          <Text style={[styles.googleButtonText, { color: colors.foreground }]}>
            Continue with Google
          </Text>
        </Pressable>

        <View style={styles.dividerRow}>
          <View style={[styles.dividerLine, { backgroundColor: colors.border }]} />
          <Text style={[styles.dividerText, { color: colors.mutedForeground }]}>
            or
          </Text>
          <View style={[styles.dividerLine, { backgroundColor: colors.border }]} />
        </View>

        <TextInput
          style={[
            styles.input,
            {
              backgroundColor: colors.input,
              borderColor: errors?.fields?.emailAddress ? colors.destructive : colors.border,
              color: colors.foreground,
            },
          ]}
          placeholder="Email address"
          placeholderTextColor={colors.mutedForeground}
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
          autoCorrect={false}
        />
        {errors?.fields?.emailAddress && (
          <Text style={[styles.errorText, { color: colors.destructive }]}>
            {errors.fields.emailAddress.message}
          </Text>
        )}

        <View>
          <TextInput
            style={[
              styles.input,
              {
                backgroundColor: colors.input,
                borderColor: errors?.fields?.password ? colors.destructive : colors.border,
                color: colors.foreground,
                paddingRight: 48,
              },
            ]}
            placeholder="Password"
            placeholderTextColor={colors.mutedForeground}
            value={password}
            onChangeText={setPassword}
            secureTextEntry={!showPassword}
          />
          <Pressable
            onPress={() => setShowPassword((v) => !v)}
            style={styles.eyeButton}
          >
            <Ionicons
              name={showPassword ? "eye-off-outline" : "eye-outline"}
              size={20}
              color={colors.mutedForeground}
            />
          </Pressable>
        </View>
        {errors?.fields?.password && (
          <Text style={[styles.errorText, { color: colors.destructive }]}>
            {errors.fields.password.message}
          </Text>
        )}

        <Pressable
          onPress={handleSignUp}
          disabled={!email || !password || fetchStatus === "fetching"}
          style={({ pressed }) => [
            styles.primaryButton,
            {
              backgroundColor: colors.primary,
              opacity:
                !email || !password || fetchStatus === "fetching"
                  ? 0.5
                  : pressed
                    ? 0.85
                    : 1,
            },
          ]}
        >
          {fetchStatus === "fetching" ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.primaryButtonText}>Create account</Text>
          )}
        </Pressable>
      </View>

      <View style={styles.footer}>
        <Text style={[styles.footerText, { color: colors.mutedForeground }]}>
          Already have an account?{" "}
        </Text>
        <Link href="/(auth)/sign-in" asChild>
          <Pressable>
            <Text style={[styles.linkText, { color: colors.primary }]}>
              Sign in
            </Text>
          </Pressable>
        </Link>
      </View>

      <View nativeID="clerk-captcha" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 24,
    justifyContent: "center",
  },
  header: {
    alignItems: "center",
    marginBottom: 32,
    gap: 8,
  },
  logoBox: {
    width: 64,
    height: 64,
    borderRadius: 16,
    borderWidth: 1,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 4,
  },
  logoText: {
    fontSize: 32,
    color: "#a855f7",
  },
  appName: {
    fontSize: 26,
    fontWeight: "700",
    letterSpacing: -0.5,
  },
  title: {
    fontSize: 24,
    fontWeight: "700",
    marginBottom: 6,
    letterSpacing: -0.3,
  },
  subtitle: {
    fontSize: 15,
    textAlign: "center",
  },
  form: {
    gap: 12,
  },
  googleButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
    height: 52,
    borderRadius: 12,
    borderWidth: 1,
  },
  googleButtonText: {
    fontSize: 15,
    fontWeight: "600",
  },
  dividerRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    marginVertical: 4,
  },
  dividerLine: {
    flex: 1,
    height: 1,
  },
  dividerText: {
    fontSize: 13,
    fontWeight: "500",
  },
  input: {
    height: 52,
    borderRadius: 12,
    borderWidth: 1,
    paddingHorizontal: 16,
    fontSize: 15,
  },
  eyeButton: {
    position: "absolute",
    right: 14,
    top: 14,
    padding: 2,
  },
  errorText: {
    fontSize: 13,
    marginTop: -4,
    marginLeft: 4,
  },
  primaryButton: {
    height: 52,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 4,
  },
  primaryButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "700",
    letterSpacing: 0.3,
  },
  resendButton: {
    alignItems: "center",
    paddingVertical: 4,
  },
  footer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 24,
  },
  footerText: {
    fontSize: 14,
  },
  linkText: {
    fontSize: 14,
    fontWeight: "600",
  },
});
