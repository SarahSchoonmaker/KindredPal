import React, { useState } from "react";
import { View, StyleSheet, ScrollView, Alert } from "react-native";
import { Text, TextInput, Button } from "react-native-paper";
import { Mail } from "lucide-react-native";
import { authAPI } from "../services/api";

export default function ForgotPasswordScreen({ navigation }) {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const handleSubmit = async () => {
    if (!email.trim()) {
      Alert.alert("Error", "Please enter your email address");
      return;
    }

    setLoading(true);
    try {
      await authAPI.forgotPassword(email);
      setSent(true);
      Alert.alert(
        "Email Sent",
        "If an account exists with this email, you'll receive password reset instructions shortly.",
        [{ text: "OK", onPress: () => navigation.goBack() }],
      );
    } catch (error) {
      Alert.alert(
        "Success",
        "If an account exists with this email, you'll receive password reset instructions.",
      );
      // Don't reveal if email exists for security
      setTimeout(() => navigation.goBack(), 2000);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.content}>
        <View style={styles.iconContainer}>
          <Mail size={64} color="#2B6CB0" />
        </View>

        <Text variant="headlineMedium" style={styles.title}>
          Reset Password
        </Text>

        <Text variant="bodyMedium" style={styles.description}>
          Enter your email address and we'll send you instructions to reset your
          password.
        </Text>

        <TextInput
          mode="outlined"
          label="Email Address"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
          style={styles.input}
          outlineColor="#E2E8F0"
          activeOutlineColor="#2B6CB0"
        />

        <Button
          mode="contained"
          onPress={handleSubmit}
          loading={loading}
          disabled={loading || sent}
          style={styles.button}
        >
          Send Reset Instructions
        </Button>

        <Button
          mode="text"
          onPress={() => navigation.goBack()}
          disabled={loading}
          style={styles.backButton}
        >
          Back to Login
        </Button>
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
    padding: 24,
  },
  iconContainer: {
    alignItems: "center",
    marginVertical: 32,
  },
  title: {
    textAlign: "center",
    color: "#2B6CB0",
    fontWeight: "bold",
    marginBottom: 16,
  },
  description: {
    textAlign: "center",
    color: "#666",
    marginBottom: 32,
    lineHeight: 22,
  },
  input: {
    marginBottom: 24,
    backgroundColor: "white",
  },
  button: {
    backgroundColor: "#2B6CB0",
    paddingVertical: 8,
    marginBottom: 16,
  },
  backButton: {
    marginTop: 8,
  },
});
