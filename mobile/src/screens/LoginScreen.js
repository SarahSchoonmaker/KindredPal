import React, { useState } from "react";
import {
  View,
  StyleSheet,
  ScrollView,
  Alert,
  KeyboardAvoidingView,
  Platform,
  TouchableOpacity,
  Text,
  Image,
  TextInput,
} from "react-native";
import { authAPI } from "../services/api";
import * as SecureStore from "expo-secure-store";

const LOGO_URI =
  "data:image/png;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/4gHYSUNDX1BST0ZJTEUAAQEAAAHIAAAAAAQwAABtbnRyUkdCIFhZWiAH4AABAAEAAAAAAABhY3NwAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAQAA9tYAAQAAAADTLQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAlkZXNjAAAA8AAAACRyWFlaAAABFAAAABRnWFlaAAABKAAAABRiWFlaAAABPAAAABR3dHB0AAABUAAAABRyVFJDAAABZAAAAChnVFJDAAABZAAAAChiVFJDAAABZAAAAChjcHJ0AAABjAAAADxtbHVjAAAAAAAAAAEAAAAMZW5VUwAAAAgAAAAcAHMAUgBHAEJYWVogAAAAAAAAb6IAADj1AAADkFhZWiAAAAAAAABimQAAt4UAABjaWFlaIAAAAAAAACSgAAAPhAAAts9YWVogAAAAAAAA9tYAAQAAAADTLXBhcmEAAAAAAAQAAAACZmYAAPKnAAANWQAAE9AAAApbAAAAAAAAAABtbHVjAAAAAAAAAAEAAAAMZW5VUwAAACAAAAAcAEcAbwBvAGcAbABlACAASQBuAGMALgAgADIAMAAxADb/2wBDAAUDBAQEAwUEBAQFBQUGBwwIBwcHBw8LCwkMEQ8SEhEPERETFhwXExQaFRERGCEYGh0dHx8fExciJCIeJBweHx7/2wBDAQUFBQcGBw4ICA4eFBEUHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh7/wAARCAAmACIDASIAAhEBAxEB/8QAGgABAAIDAQAAAAAAAAAAAAAAAAYHAQIDBf/EACoQAAEDAwMDAwQDAAAAAAAAAAECAwQABREGEiEHMUEiQoEIEyNhMlGR/8QAGgEAAgIDAAAAAAAAAAAAAAAAAAQBAwIGB//EACIRAAIBAwQCAwAAAAAAAAAAAAEDAAIREyExUZEk8EFhcf/aAAwDAQACEQMRAD8AhhJJJJJJ7k0pVjaVs+mtH3G03fXckuvPbXW7SyyHS2hWdrj+TgJ920ZJ4/oiulOcFDa5+ANzNAUosPA54lc0q2NaxdF9QNTuDRctMC5BkJbjuRvssT1AE/jPBSv24UADgY8k1S824y8tl1CkONqKFpUMFJBwQahDw0aix4O8yckrOhuORAdcAwHFf7StaVfKZOeisHTE/Vwa1M41tSgKiNOubEOvbhhJPn9Jzz257HzOq62XOpN+WxJekpMo5W7ncFYG5PIHCVZSP0B371GQSCCCQRyCPFWNaTp7qJdIUe7uyLXf1JCHZDKApudtHnJ9LhSO/IJ+BSTKcTsxJItb899+mqKsisQABv3ILYiwm9wFSpDsZgSWy681/NtO4ZUnHkDkVZH1FQ9NR7+1Itjjabu+oquDTa8gekbVKT7VH4z3xzmuN+tukund/Ehtcu73ENh2FDfCdkdXhbqhjdyMhIA7c+DVbz5UifOfnTHS7IkOFx1Z8qJyaijyG0upJAA7vJqOFdSqgCSerTjSlKeikVlKlJUFJUUqByCDgg0pRCZcWt1wuOrW4s91KOSfmtaUohFKUohP/9k=";

const MEDIUM_BLUE = "#1e4d8c";
const BLUE = "#2d6abf";

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
      Alert.alert(
        "Login Failed",
        error.response?.data?.message || "Invalid credentials",
      );
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
        {/* ── Brand Panel ── */}
        <View style={styles.brandPanel}>
          {/* Logo */}
          <View style={styles.logoRow}>
            <Image source={{ uri: LOGO_URI }} style={styles.logoIcon} />
            <Text style={styles.logoText}>KindredPal</Text>
          </View>

          {/* Headline */}
          <Text style={styles.headline}>Real support.</Text>
          <Text style={styles.headline}>Real community.</Text>
          <Text style={styles.subheadline}>
            Local peer support groups for caregivers, recovery, grief, and life
            transitions — because no one should face hard times alone.
          </Text>

          {/* Value props */}
          <View style={styles.features}>
            {[
              {
                emoji: "🤲",
                title: "Peer support groups",
                desc: "Caregiving, grief, recovery, wellness & more",
              },
              {
                emoji: "📅",
                title: "Local meetups",
                desc: "Scheduled in-person sessions near you",
              },
              {
                emoji: "🔒",
                title: "Safe & private",
                desc: "Public and invite-only private groups",
              },
            ].map((item, i) => (
              <View key={i} style={styles.feature}>
                <Text style={styles.featureEmoji}>{item.emoji}</Text>
                <View style={styles.featureText}>
                  <Text style={styles.featureTitle}>{item.title}</Text>
                  <Text style={styles.featureDesc}>{item.desc}</Text>
                </View>
              </View>
            ))}
          </View>
        </View>

        {/* ── Form Panel ── */}
        <View style={styles.formPanel}>
          <Text style={styles.formTitle}>Welcome back</Text>
          <Text style={styles.formSub}>Log in to find your community</Text>

          <View style={styles.field}>
            <Text style={styles.fieldLabel}>Email</Text>
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

          <View style={styles.field}>
            <Text style={styles.fieldLabel}>Password</Text>
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
                <Text style={styles.eyeText}>
                  {showPassword ? "Hide" : "Show"}
                </Text>
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
            style={[
              styles.loginBtn,
              (!email || !password || loading) && styles.loginBtnDisabled,
            ]}
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

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: MEDIUM_BLUE },
  scroll: { flexGrow: 1 },

  // ── Brand Panel ──
  brandPanel: {
    backgroundColor: MEDIUM_BLUE,
    paddingTop: 64,
    paddingBottom: 52,
    paddingHorizontal: 28,
  },

  logoRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    marginBottom: 32,
  },
  logoIcon: {
    width: 44,
    height: 44,
    borderRadius: 10,
  },
  logoText: {
    fontSize: 24,
    fontWeight: "800",
    color: "white",
    letterSpacing: -0.3,
  },

  headline: {
    fontSize: 34,
    fontWeight: "800",
    color: "white",
    lineHeight: 40,
    letterSpacing: -0.5,
    marginBottom: 14,
  },
  subheadline: {
    fontSize: 15,
    color: "rgba(255,255,255,0.8)",
    lineHeight: 22,
    marginBottom: 32,
  },

  features: { gap: 18 },
  feature: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 14,
  },
  featureEmoji: {
    fontSize: 22,
    marginTop: 1,
    width: 28,
    textAlign: "center",
  },
  featureText: { flex: 1 },
  featureTitle: {
    fontSize: 14,
    fontWeight: "700",
    color: "white",
    marginBottom: 2,
  },
  featureDesc: {
    fontSize: 13,
    color: "rgba(255,255,255,0.7)",
    lineHeight: 17,
  },

  // ── Form Panel ──
  formPanel: {
    backgroundColor: "white",
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
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
    fontSize: 28,
    fontWeight: "800",
    color: "#1a202c",
    marginBottom: 4,
    letterSpacing: -0.3,
  },
  formSub: {
    fontSize: 15,
    color: "#718096",
    marginBottom: 28,
  },

  field: { marginBottom: 16 },
  fieldLabel: {
    fontSize: 12,
    fontWeight: "700",
    color: "#4a5568",
    marginBottom: 7,
    textTransform: "uppercase",
    letterSpacing: 0.6,
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
  passwordInput: { paddingRight: 68 },
  eyeBtn: {
    position: "absolute",
    right: 14,
    top: 0,
    bottom: 0,
    justifyContent: "center",
  },
  eyeText: { fontSize: 13, color: BLUE, fontWeight: "700" },

  forgotRow: { alignSelf: "flex-end", marginBottom: 22, marginTop: -4 },
  forgotText: { fontSize: 13, color: BLUE, fontWeight: "600" },

  loginBtn: {
    backgroundColor: BLUE,
    borderRadius: 14,
    paddingVertical: 16,
    alignItems: "center",
    marginBottom: 24,
    shadowColor: MEDIUM_BLUE,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
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
  dividerText: { fontSize: 12, color: "#a0aec0", fontWeight: "600" },

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
  },
});
