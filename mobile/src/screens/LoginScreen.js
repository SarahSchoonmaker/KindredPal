import React, { useState } from "react";
import {
  View, StyleSheet, ScrollView, Alert,
  KeyboardAvoidingView, Platform, TouchableOpacity,
  Text, Image, TextInput,
} from "react-native";
import { Button } from "react-native-paper";
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

          {/* Logo */}
          <View style={styles.logoRow}>
            <Image
              source={require("../../assets/icon.png")}
              style={styles.logoIcon}
            />
            <Text style={styles.logoText}>KindredPal</Text>
          </View>

          {/* Headline */}
          <Text style={styles.headline}>Find your people.{"\n"}For real this time.</Text>
          <Text style={styles.subheadline}>
            Groups built around shared faith, values, and life stage.
            Walk in already knowing you belong.
          </Text>

          {/* Value props */}
          <View style={styles.valueProps}>
            <View style={styles.valueProp}>
              <View style={styles.valuePropIcon}>
                <Text style={styles.valuePropEmoji}>🙏</Text>
              </View>
              <View style={styles.valuePropText}>
                <Text style={styles.valuePropTitle}>Values-first groups</Text>
                <Text style={styles.valuePropDesc}>See who's in a group before you join</Text>
              </View>
            </View>
            <View style={styles.valueProp}>
              <View style={styles.valuePropIcon}>
                <Text style={styles.valuePropEmoji}>📅</Text>
              </View>
              <View style={styles.valuePropText}>
                <Text style={styles.valuePropTitle}>Real-life events</Text>
                <Text style={styles.valuePropDesc}>RSVP and meet people in person</Text>
              </View>
            </View>
            <View style={styles.valueProp}>
              <View style={styles.valuePropIcon}>
                <Text style={styles.valuePropEmoji}>💬</Text>
              </View>
              <View style={styles.valuePropText}>
                <Text style={styles.valuePropTitle}>Group & direct chat</Text>
                <Text style={styles.valuePropDesc}>Stay connected between meetups</Text>
              </View>
            </View>
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
          >
            <Text style={styles.signupBtnText}>Create a Free Account</Text>
          </TouchableOpacity>
        </View>

      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#1a56a0" },
  scroll: { flexGrow: 1 },

  // ── Hero ──
  hero: {
    backgroundColor: "#1a56a0",
    paddingTop: 60,
    paddingBottom: 52,
    paddingHorizontal: 28,
  },

  logoRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    marginBottom: 32,
  },
  logoIcon: { width: 44, height: 44, borderRadius: 12 },
  logoText: {
    fontSize: 24,
    fontWeight: "800",
    color: "white",
    letterSpacing: -0.5,
  },

  headline: {
    fontSize: 34,
    fontWeight: "800",
    color: "white",
    lineHeight: 40,
    marginBottom: 14,
    letterSpacing: -0.5,
  },
  subheadline: {
    fontSize: 15,
    color: "rgba(255,255,255,0.8)",
    lineHeight: 22,
    marginBottom: 32,
  },

  valueProps: {
    gap: 16,
  },
  valueProp: {
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
  },
  valuePropIcon: {
    width: 42,
    height: 42,
    borderRadius: 12,
    backgroundColor: "rgba(255,255,255,0.18)",
    justifyContent: "center",
    alignItems: "center",
    flexShrink: 0,
  },
  valuePropEmoji: { fontSize: 20 },
  valuePropText: { flex: 1 },
  valuePropTitle: {
    fontSize: 14,
    fontWeight: "700",
    color: "white",
    marginBottom: 2,
  },
  valuePropDesc: {
    fontSize: 12,
    color: "rgba(255,255,255,0.72)",
    lineHeight: 16,
  },

  // ── Form ──
  form: {
    backgroundColor: "white",
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    paddingHorizontal: 28,
    paddingTop: 36,
    paddingBottom: 48,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.1,
    shadowRadius: 16,
    elevation: 8,
  },

  formTitle: {
    fontSize: 28,
    fontWeight: "800",
    color: "#1a202c",
    marginBottom: 4,
    letterSpacing: -0.3,
  },
  formSubtitle: {
    fontSize: 15,
    color: "#718096",
    marginBottom: 28,
  },

  inputGroup: { marginBottom: 16 },
  inputLabel: {
    fontSize: 13,
    fontWeight: "600",
    color: "#4a5568",
    marginBottom: 7,
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  input: {
    backgroundColor: "#f8fafc",
    borderWidth: 1.5,
    borderColor: "#e2e8f0",
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 13,
    fontSize: 16,
    color: "#1a202c",
  },
  passwordRow: { position: "relative" },
  passwordInput: { paddingRight: 64 },
  eyeBtn: {
    position: "absolute",
    right: 14,
    top: 0,
    bottom: 0,
    justifyContent: "center",
  },
  eyeText: { fontSize: 13, color: "#2B6CB0", fontWeight: "600" },

  forgotRow: { alignSelf: "flex-end", marginBottom: 24, marginTop: -4 },
  forgotText: { fontSize: 13, color: "#2B6CB0", fontWeight: "600" },

  loginBtn: {
    backgroundColor: "#2B6CB0",
    borderRadius: 14,
    paddingVertical: 16,
    alignItems: "center",
    marginBottom: 24,
    shadowColor: "#2B6CB0",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  loginBtnDisabled: { opacity: 0.55, shadowOpacity: 0 },
  loginBtnText: {
    color: "white",
    fontSize: 17,
    fontWeight: "700",
    letterSpacing: 0.3,
  },

  dividerRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    marginBottom: 20,
  },
  divider: { flex: 1, height: 1, backgroundColor: "#e2e8f0" },
  dividerText: { fontSize: 13, color: "#a0aec0", fontWeight: "500" },

  signupBtn: {
    borderWidth: 2,
    borderColor: "#2B6CB0",
    borderRadius: 14,
    paddingVertical: 14,
    alignItems: "center",
  },
  signupBtnText: {
    color: "#2B6CB0",
    fontSize: 16,
    fontWeight: "700",
    letterSpacing: 0.2,
  },
});