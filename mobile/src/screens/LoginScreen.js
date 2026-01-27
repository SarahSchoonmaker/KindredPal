import React, { useState } from "react";
import { View, StyleSheet, ScrollView, Image } from "react-native";
import { Text, TextInput, Button, Card } from "react-native-paper";
import { authAPI } from "../services/api";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function LoginScreen({ navigation }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    setLoading(true);
    try {
      console.log("🔐 Logging in:", email);
      const response = await authAPI.login(email, password);

      console.log("📦 Full response:", JSON.stringify(response.data, null, 2));

      const token = response.data.token;
      const user = response.data.user;

      console.log("🎫 Token:", token);
      console.log("👤 User object:", JSON.stringify(user, null, 2));

      // Check if user and id exist (it's "id" not "_id")
      if (!user || !user.id) {
        throw new Error("Invalid response: missing user ID");
      }

      const userId = user.id; // <-- CHANGED from user._id to user.id

      // Save to AsyncStorage
      await AsyncStorage.setItem("token", token);
      await AsyncStorage.setItem("userId", userId);

      console.log("✅ Login successful! Token and userId saved.");
      console.log("👤 User ID:", userId);

      navigation.replace("MainTabs");
    } catch (error) {
      console.error("❌ Login error:", error);
      console.error("❌ Error response:", error.response?.data);

      const message =
        error.response?.data?.message || error.message || "Invalid credentials";
      Alert.alert("Login Failed", message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.content}>
        {/* Logo/Header */}
        <View style={styles.header}>
          <Text variant="displaySmall" style={styles.logo}>
            KindredPal
          </Text>
          <Text variant="bodyLarge" style={styles.tagline}>
            Connect through shared values
          </Text>
        </View>

        {/* Login Card */}
        <Card style={styles.card}>
          <Card.Content>
            <TextInput
              mode="outlined"
              label="Email"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
              style={styles.input}
            />

            <TextInput
              mode="outlined"
              label="Password"
              value={password}
              onChangeText={setPassword}
              secureTextEntry
              style={styles.input}
            />

            <Button
              mode="contained"
              onPress={handleLogin}
              loading={loading}
              disabled={!email || !password || loading}
              style={styles.button}
            >
              Login
            </Button>

            <Button
              mode="text"
              onPress={() => navigation.navigate("Signup")}
              style={styles.signupButton}
            >
              Don't have an account? Sign up
            </Button>
          </Card.Content>
        </Card>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F7FAFC",
  },
  content: {
    padding: 20,
    paddingTop: 60,
  },
  header: {
    alignItems: "center",
    marginBottom: 40,
  },
  logo: {
    color: "#2B6CB0",
    fontWeight: "bold",
    marginBottom: 8,
  },
  tagline: {
    color: "#666",
  },
  card: {
    backgroundColor: "white",
    elevation: 4,
  },
  input: {
    marginBottom: 16,
  },
  button: {
    marginTop: 8,
    paddingVertical: 6,
  },
  signupButton: {
    marginTop: 8,
  },
});
