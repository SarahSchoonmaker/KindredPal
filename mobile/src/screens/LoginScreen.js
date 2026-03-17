import React, { useState } from "react";
import {
  View, StyleSheet, ScrollView, Alert,
  KeyboardAvoidingView, Platform, TouchableOpacity, Text,
} from "react-native";
import { TextInput, Button, ActivityIndicator } from "react-native-paper";
import { authAPI } from "../services/api";
import * as SecureStore from "expo-secure-store";

export default function LoginScreen({ navigation }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

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
      Alert.alert("Login Failed", error.response?.data?.message || error.message || "Invalid credentials");
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView style={styles.container} behavior={Platform.OS === "ios" ? "padding" : "height"}>
      <ScrollView contentContainerStyle={styles.scroll} keyboardShouldPersistTaps="handled">

        {/* Hero */}
        <View style={styles.hero}>
          <Text style={styles.logo}>💜 KindredPal</Text>
          <Text style={styles.heroTitle}>Find your people.{"\n"}For real this time.</Text>
          <Text style={styles.heroSubtitle}>
            Groups built around shared values, faith, and life stage — so you can
            meet people who actually get you.
          </Text>

          <View style={styles.features}>
            <View style={styles.feature}>
              <Text style={styles.featureIcon}>🙏</Text>
              <Text style={styles.featureText}>Values-first groups</Text>
            </View>
            <View style={styles.feature}>
              <Text style={styles.featureIcon}>📅</Text>
              <Text style={styles.featureText}>Real-life events</Text>
            </View>
            <View style={styles.feature}>
              <Text style={styles.featureIcon}>💬</Text>
              <Text style={styles.featureText}>Group & direct chat</Text>
            </View>
          </View>
        </View>

        {/* Form */}
        <View style={styles.form}>
          <Text style={styles.formTitle}>Welcome back</Text>
          <Text style={styles.formSubtitle}>Log in to find your community</Text>

          <TextInput
            mode="outlined"
            label="Email"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
            autoCorrect={false}
            style={styles.input}
            outlineColor="#E2E8F0"
            activeOutlineColor="#2B6CB0"
          />

          <TextInput
            mode="outlined"
            label="Password"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
            style={styles.input}
            outlineColor="#E2E8F0"
            activeOutlineColor="#2B6CB0"
          />

          <TouchableOpacity onPress={() => navigation.navigate("ForgotPassword")} style={styles.forgotRow}>
            <Text style={styles.forgotText}>Forgot password?</Text>
          </TouchableOpacity>

          <Button
            mode="contained"
            onPress={handleLogin}
            loading={loading}
            disabled={!email || !password || loading}
            style={styles.loginBtn}
            labelStyle={styles.loginBtnLabel}
            buttonColor="#2B6CB0"
          >
            Log In
          </Button>

          <TouchableOpacity onPress={() => navigation.navigate("Signup")} style={styles.signupRow}>
            <Text style={styles.signupText}>
              New to KindredPal? <Text style={styles.signupLink}>Create an account</Text>
            </Text>
          </TouchableOpacity>
        </View>

      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F7FAFC" },
  scroll: { flexGrow: 1 },

  hero: {
    background: undefined,
    backgroundColor: "#1a56a0",
    paddingTop: 64,
    paddingBottom: 48,
    paddingHorizontal: 28,
  },
  logo: { fontSize: 22, fontWeight: "800", color: "white", marginBottom: 20, opacity: 0.95 },
  heroTitle: { fontSize: 30, fontWeight: "800", color: "white", lineHeight: 36, marginBottom: 14 },
  heroSubtitle: { fontSize: 15, color: "white", opacity: 0.85, lineHeight: 22, marginBottom: 28 },

  features: { flexDirection: "row", gap: 10 },
  feature: {
    flex: 1,
    backgroundColor: "rgba(255,255,255,0.15)",
    borderRadius: 12,
    padding: 14,
    alignItems: "center",
    gap: 6,
  },
  featureIcon: { fontSize: 22 },
  featureText: { color: "white", fontSize: 11, fontWeight: "600", textAlign: "center" },

  form: {
    backgroundColor: "white",
    marginTop: -20,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingHorizontal: 24,
    paddingTop: 36,
    paddingBottom: 32,
    flex: 1,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -3 },
    shadowOpacity: 0.08,
    shadowRadius: 10,
    elevation: 6,
  },
  formTitle: { fontSize: 26, fontWeight: "800", color: "#1a202c", marginBottom: 4 },
  formSubtitle: { fontSize: 14, color: "#718096", marginBottom: 24 },

  input: { marginBottom: 14, backgroundColor: "white" },

  forgotRow: { alignSelf: "flex-end", marginBottom: 20 },
  forgotText: { fontSize: 13, color: "#2B6CB0", fontWeight: "600" },

  loginBtn: { borderRadius: 12, paddingVertical: 4, marginBottom: 20 },
  loginBtnLabel: { fontSize: 16, fontWeight: "700", letterSpacing: 0.3 },

  signupRow: { alignItems: "center" },
  signupText: { fontSize: 14, color: "#718096" },
  signupLink: { color: "#2B6CB0", fontWeight: "700" },
});