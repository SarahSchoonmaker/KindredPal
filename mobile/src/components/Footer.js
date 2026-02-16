import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { useNavigation } from "@react-navigation/native";

export default function Footer() {
  const navigation = useNavigation();

  const openPage = (title, url) => {
    navigation.navigate("WebView", { title, url });
  };

  return (
    <View style={styles.footer}>
      <Text style={styles.footerText}>© 2026 KindredPal</Text>
      <View style={styles.links}>
        <TouchableOpacity
          onPress={() =>
            openPage(
              "Privacy Policy",
              "https://www.kindredpal.com/privacy-policy",
            )
          }
        >
          <Text style={styles.link}>Privacy Policy</Text>
        </TouchableOpacity>
        <Text style={styles.separator}>•</Text>
        <TouchableOpacity
          onPress={() =>
            openPage("Terms of Service", "https://www.kindredpal.com/terms")
          }
        >
          <Text style={styles.link}>Terms</Text>
        </TouchableOpacity>
        <Text style={styles.separator}>•</Text>
        <TouchableOpacity
          onPress={() =>
            openPage("Safety Tips", "https://www.kindredpal.com/safety")
          }
        >
          <Text style={styles.link}>Safety</Text>
        </TouchableOpacity>
        <Text style={styles.separator}>•</Text>
        <TouchableOpacity
          onPress={() =>
            openPage("Support", "https://www.kindredpal.com/support")
          }
        >
          <Text style={styles.link}>Support</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  footer: {
    paddingVertical: 20,
    paddingHorizontal: 16,
    backgroundColor: "#F7FAFC",
    borderTopWidth: 1,
    borderTopColor: "#E2E8F0",
    alignItems: "center",
  },
  footerText: {
    fontSize: 12,
    color: "#718096",
    marginBottom: 8,
  },
  links: {
    flexDirection: "row",
    alignItems: "center",
    flexWrap: "wrap",
    justifyContent: "center",
  },
  link: {
    fontSize: 12,
    color: "#2B6CB0",
    textDecorationLine: "underline",
  },
  separator: {
    fontSize: 12,
    color: "#718096",
    marginHorizontal: 8,
  },
});
