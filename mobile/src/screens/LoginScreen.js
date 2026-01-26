import React, { useState } from "react";
import { View, StyleSheet, ScrollView, Image } from "react-native";
import { Text, TextInput, Button, Card } from "react-native-paper";
import { authAPI } from "../services/api";

export default function LoginScreen({ navigation }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert("Error", "Please enter email and password");
      return;
    }

    setLoading(true);
    try {
      console.log("🔐 Logging in:", email);
      const response = await authAPI.login(email, password);

      if (response.data.token) {
        // IMPORTANT: Store token BEFORE navigating
        global.authToken = response.data.token;
        console.log("✅ Login successful! Token saved.");

        // Navigate to main app
        navigation.replace("MainTabs");
      }
    } catch (error) {
      console.error("❌ Login error:", error);
      Alert.alert(
        "Login Failed",
        error.response?.data?.message || "Invalid email or password",
      );
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
