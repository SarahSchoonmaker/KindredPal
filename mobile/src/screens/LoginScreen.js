import React, { useState } from "react";
import {
  View,
  StyleSheet,
  ScrollView,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { Text, TextInput, Button } from "react-native-paper";
import { authAPI } from "../services/api";
import * as SecureStore from "expo-secure-store";
import { Users, MessageCircle, Calendar } from "lucide-react-native";
import Footer from "../components/Footer";

export default function LoginScreen({ navigation }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    setLoading(true);
    try {
      logger.info("🔐 Logging in:", email);
      const response = await authAPI.login(email, password);

      const token = response.data.token;
      const user = response.data.user;

      if (!user || !user.id) {
        throw new Error("Invalid response: missing user ID");
      }

      const userId = user.id;

      await SecureStore.setItemAsync("token", token);
      await SecureStore.setItemAsync("userId", userId);

      logger.info("✅ Login successful! Token and userId saved securely.");

      navigation.replace("MainTabs");
    } catch (error) {
      logger.error("❌ Login error:", error);
      logger.error("❌ Error response:", error.response?.data);

      const message =
        error.response?.data?.message || error.message || "Invalid credentials";
      Alert.alert("Login Failed", message);
    } finally {
      setLoading(false);
    }
  };

  // Add forgot password handler
  const handleForgotPassword = () => {
    navigation.navigate("ForgotPassword");
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
      >
        {/* Hero Section */}
        <View style={styles.hero}>
          <Text style={styles.logo}>KindredPal</Text>
          <Text style={styles.tagline}>Connect through shared values</Text>

          {/* Feature Icons */}
          <View style={styles.features}>
            <View style={styles.feature}>
              <Users color="white" size={32} />
              <Text style={styles.featureText}>Find Friends</Text>
            </View>
            <View style={styles.feature}>
              <MessageCircle color="white" size={32} />
              <Text style={styles.featureText}>Connect</Text>
            </View>
            <View style={styles.feature}>
              <Calendar color="white" size={32} />
              <Text style={styles.featureText}>Meet Up</Text>
            </View>
          </View>
        </View>

        {/* Login Form */}
        <View style={styles.formContainer}>
          <Text style={styles.formTitle}>Welcome Back</Text>

          <TextInput
            mode="outlined"
            label="Email"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
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

          {/* Add Forgot Password Button */}
          <Button
            mode="text"
            onPress={handleForgotPassword}
            style={styles.forgotButton}
            labelStyle={styles.forgotButtonLabel}
          >
            Forgot Password?
          </Button>

          <Button
            mode="contained"
            onPress={handleLogin}
            loading={loading}
            disabled={!email || !password || loading}
            style={styles.button}
            labelStyle={styles.buttonLabel}
          >
            Login
          </Button>

          <Button
            mode="text"
            onPress={() => navigation.navigate("Signup")}
            style={styles.signupButton}
            labelStyle={styles.signupButtonLabel}
          >
            Don't have an account? Sign up
          </Button>
        </View>

        {/* Footer */}
        <Footer />
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F7FAFC",
  },
  scrollContent: {
    flexGrow: 1,
  },
  hero: {
    backgroundColor: "#2B6CB0",
    paddingTop: 60,
    paddingBottom: 40,
    paddingHorizontal: 20,
    alignItems: "center",
  },
  logo: {
    fontSize: 42,
    fontWeight: "bold",
    color: "white",
    marginBottom: 8,
  },
  tagline: {
    fontSize: 18,
    color: "white",
    opacity: 0.9,
    marginBottom: 32,
  },
  features: {
    flexDirection: "row",
    justifyContent: "space-around",
    width: "100%",
    marginTop: 20,
  },
  feature: {
    alignItems: "center",
    backgroundColor: "rgba(255, 255, 255, 0.15)",
    padding: 16,
    borderRadius: 12,
    minWidth: 100,
  },
  featureText: {
    color: "white",
    fontSize: 12,
    marginTop: 8,
    fontWeight: "600",
  },
  formContainer: {
    backgroundColor: "white",
    marginTop: -20,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingHorizontal: 24,
    paddingTop: 32,
    paddingBottom: 24,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: -2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  formTitle: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#2D2D2D",
    marginBottom: 24,
    textAlign: "center",
  },
  input: {
    marginBottom: 16,
    backgroundColor: "white",
  },
  forgotButton: {
    alignSelf: "flex-end",
    marginTop: -8,
    marginBottom: 8,
  },
  forgotButtonLabel: {
    fontSize: 12,
    color: "#2B6CB0",
  },
  button: {
    marginTop: 8,
    paddingVertical: 8,
    backgroundColor: "#2B6CB0",
  },
  buttonLabel: {
    fontSize: 16,
    fontWeight: "600",
  },
  signupButton: {
    marginTop: 16,
  },
  signupButtonLabel: {
    fontSize: 14,
    color: "#2B6CB0",
  },
});
