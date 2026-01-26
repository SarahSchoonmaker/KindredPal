import React from "react";
import { View, StyleSheet } from "react-native";
import { Text, Button } from "react-native-paper";

export default function SignupScreen({ navigation }) {
  return (
    <View style={styles.container}>
      <Text variant="headlineMedium">Signup Screen</Text>
      <Text variant="bodyLarge" style={styles.text}>
        Coming soon! For now, go back to login.
      </Text>
      <Button
        mode="contained"
        onPress={() => navigation.goBack()}
        style={styles.button}
      >
        Back to Login
      </Button>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#F7FAFC",
  },
  text: {
    marginVertical: 20,
    textAlign: "center",
  },
  button: {
    marginTop: 20,
  },
});
