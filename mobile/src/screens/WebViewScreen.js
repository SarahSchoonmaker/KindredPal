import React from "react";
import { StyleSheet, SafeAreaView } from "react-native";
import { WebView } from "react-native-webview";
import { ActivityIndicator } from "react-native-paper";

export default function WebViewScreen({ route }) {
  const { url, title } = route.params;

  return (
    <SafeAreaView style={styles.container}>
      <WebView
        source={{ uri: url }}
        startInLoadingState={true}
        renderLoading={() => (
          <ActivityIndicator
            size="large"
            color="#2B6CB0"
            style={styles.loading}
          />
        )}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F7FAFC",
  },
  loading: {
    position: "absolute",
    top: "50%",
    left: 0,
    right: 0,
  },
});
