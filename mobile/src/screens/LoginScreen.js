import React, { useState } from "react";
import {
  View, StyleSheet, ScrollView, Alert,
  KeyboardAvoidingView, Platform, TouchableOpacity,
  Text, Image, TextInput,
} from "react-native";
import { authAPI } from "../services/api";
import * as SecureStore from "expo-secure-store";

export default function LoginScreen({ navigation }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleLogin = async () => {
    if (!email || !password) return;
    setLoading(true);
    try {
      const response = await authAPI.login(email, password);
      const { token, user } = response.data;
      if (!user?.id) throw new Error("Invalid response");
      await SecureStore.setItemAsync("token", token);
      await SecureStore.setItemAsync("userId", user.id);
      navigation.replace("MainTabs");
    } catch (error) {
      Alert.alert("Login Failed", error.response?.data?.message || "Invalid credentials");
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <ScrollView
        contentContainerStyle={styles.scroll}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        {/* ── Hero ── */}
        <View style={styles.hero}>

          {/* Logo row */}
          <View style={styles.logoRow}>
            <Image
              source={require("../../assets/icon.png")}
              style={styles.logoIcon}
            />
            <Text style={styles.logoText}>KindredPal</Text>
          </View>

          {/* Headline */}
          <Text style={styles.headline}>Find your people.</Text>
          <Text style={styles.headlineAccent}>For real this time.</Text>

          <Text style={styles.subheadline}>
            Groups built around shared faith, values, and life stage —
            so you walk in already knowing you belong.
          </Text>

          {/* Value props */}
          <View style={styles.valueProps}>
            {[
              { emoji: "🙏", title: "Values-first groups", desc: "See who's in a group before you join" },
              { emoji: "📅", title: "Real-life events",    desc: "RSVP and meet people in person" },
              { emoji: "💬", title: "Group & direct chat", desc: "Stay connected between meetups" },
            ].map((item, i) => (
              <View key={i} style={styles.valueProp}>
                <View style={styles.valuePropIcon}>
                  <Text style={styles.valuePropEmoji}>{item.emoji}</Text>
                </View>
                <View style={styles.valuePropText}>
                  <Text style={styles.valuePropTitle}>{item.title}</Text>
                  <Text style={styles.valuePropDesc}>{item.desc}</Text>
                </View>
              </View>
            ))}
          </View>
        </View>

        {/* ── Form ── */}
        <View style={styles.form}>
          <Text style={styles.formTitle}>Welcome back</Text>
          <Text style={styles.formSubtitle}>Sign in to your community</Text>

          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Email</Text>
            <TextInput
              style={styles.input}
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
              autoCorrect={false}
              placeholder="your@email.com"
              placeholderTextColor="#a0aec0"
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Password</Text>
            <View style={styles.passwordRow}>
              <TextInput
                style={[styles.input, styles.passwordInput]}
                value={password}
                onChangeText={setPassword}
                secureTextEntry={!showPassword}
                placeholder="••••••••"
                placeholderTextColor="#a0aec0"
              />
              <TouchableOpacity
                style={styles.eyeBtn}
                onPress={() => setShowPassword(!showPassword)}
              >
                <Text style={styles.eyeText}>{showPassword ? "Hide" : "Show"}</Text>
              </TouchableOpacity>
            </View>
          </View>

          <TouchableOpacity
            onPress={() => navigation.navigate("ForgotPassword")}
            style={styles.forgotRow}
          >
            <Text style={styles.forgotText}>Forgot password?</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.loginBtn, (!email || !password || loading) && styles.loginBtnDisabled]}
            onPress={handleLogin}
            disabled={!email || !password || loading}
            activeOpacity={0.85}
          >
            <Text style={styles.loginBtnText}>
              {loading ? "Signing in..." : "Sign In"}
            </Text>
          </TouchableOpacity>

          <View style={styles.dividerRow}>
            <View style={styles.divider} />
            <Text style={styles.dividerText}>New to KindredPal?</Text>
            <View style={styles.divider} />
          </View>

          <TouchableOpacity
            style={styles.signupBtn}
            onPress={() => navigation.navigate("Signup")}
            activeOpacity={0.85}
          >
            <Text style={styles.signupBtnText}>Create a Free Account</Text>
          </TouchableOpacity>
        </View>

      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const BLUE = "#1a4280";
const BLUE_DARK = "#0f3060";

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: BLUE_DARK },
  scroll: { flexGrow: 1 },

  // ── Hero ──
  hero: {
    backgroundColor: BLUE_DARK,
    paddingTop: 64,
    paddingBottom: 56,
    paddingHorizontal: 28,
  },

  logoRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    marginBottom: 36,
  },
  logoIcon: {
    width: 46,
    height: 46,
    borderRadius: 12,
  },
  logoText: {
    fontSize: 26,
    fontWeight: "800",
    color: "white",
    letterSpacing: -0.5,
  },

  headline: {
    fontSize: 36,
    fontWeight: "800",
    color: "white",
    letterSpacing: -0.5,
    lineHeight: 42,
  },
  headlineAccent: {
    fontSize: 36,
    fontWeight: "800",
    color: "rgba(255,255,255,0.65)",
    letterSpacing: -0.5,
    lineHeight: 42,
    marginBottom: 16,
  },
  subheadline: {
    fontSize: 15,
    color: "rgba(255,255,255,0.75)",
    lineHeight: 23,
    marginBottom: 36,
    fontWeight: "400",
  },

  valueProps: { gap: 18 },
  valueProp: {
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
  },
  valuePropIcon: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: "rgba(255,255,255,0.14)",
    justifyContent: "center",
    alignItems: "center",
    flexShrink: 0,
  },
  valuePropEmoji: { fontSize: 20 },
  valuePropText: { flex: 1 },
  valuePropTitle: {
    fontSize: 15,
    fontWeight: "700",
    color: "white",
    marginBottom: 2,
    letterSpacing: -0.2,
  },
  valuePropDesc: {
    fontSize: 13,
    color: "rgba(255,255,255,0.65)",
    lineHeight: 17,
  },

  // ── Form ──
  form: {
    backgroundColor: "white",
    borderTopLeftRadius: 32,
    borderTopRightRadius: 32,
    paddingHorizontal: 28,
    paddingTop: 40,
    paddingBottom: 52,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.12,
    shadowRadius: 20,
    elevation: 10,
  },

  formTitle: {
    fontSize: 30,
    fontWeight: "800",
    color: "#0f1923",
    marginBottom: 4,
    letterSpacing: -0.5,
  },
  formSubtitle: {
    fontSize: 15,
    color: "#718096",
    marginBottom: 30,
    fontWeight: "400",
  },

  inputGroup: { marginBottom: 18 },
  inputLabel: {
    fontSize: 11,
    fontWeight: "700",
    color: "#4a5568",
    marginBottom: 8,
    textTransform: "uppercase",
    letterSpacing: 0.8,
  },
  input: {
    backgroundColor: "#f7fafc",
    borderWidth: 1.5,
    borderColor: "#e2e8f0",
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 16,
    color: "#1a202c",
  },
  passwordRow: { position: "relative" },
  passwordInput: { paddingRight: 68 },
  eyeBtn: {
    position: "absolute",
    right: 14,
    top: 0,
    bottom: 0,
    justifyContent: "center",
  },
  eyeText: { fontSize: 13, color: BLUE, fontWeight: "700" },

  forgotRow: { alignSelf: "flex-end", marginBottom: 24, marginTop: -6 },
  forgotText: { fontSize: 13, color: BLUE, fontWeight: "600" },

  loginBtn: {
    backgroundColor: BLUE,
    borderRadius: 14,
    paddingVertical: 17,
    alignItems: "center",
    marginBottom: 26,
    shadowColor: BLUE_DARK,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.35,
    shadowRadius: 10,
    elevation: 5,
  },
  loginBtnDisabled: { opacity: 0.5, shadowOpacity: 0 },
  loginBtnText: {
    color: "white",
    fontSize: 17,
    fontWeight: "700",
    letterSpacing: 0.3,
  },

  dividerRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    marginBottom: 20,
  },
  divider: { flex: 1, height: 1, backgroundColor: "#edf2f7" },
  dividerText: { fontSize: 12, color: "#a0aec0", fontWeight: "600", letterSpacing: 0.3 },

  signupBtn: {
    borderWidth: 2,
    borderColor: BLUE,
    borderRadius: 14,
    paddingVertical: 15,
    alignItems: "center",
  },
  signupBtnText: {
    color: BLUE,
    fontSize: 16,
    fontWeight: "700",
    letterSpacing: 0.2,
  },
});