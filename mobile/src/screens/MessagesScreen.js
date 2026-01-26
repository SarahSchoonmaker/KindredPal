import React, { useState, useEffect } from "react";
import { View, StyleSheet, ScrollView, TouchableOpacity } from "react-native";
import {
  Text,
  Card,
  Avatar,
  Badge,
  ActivityIndicator,
} from "react-native-paper";
import { MessageCircle } from "lucide-react-native";

export default function MessagesScreen({ navigation }) {
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(true);

  // Mock matches for now - later fetch from API
  useEffect(() => {
    setTimeout(() => {
      setMatches([
        {
          id: 1,
          name: "Emily",
          photo: "https://randomuser.me/api/portraits/women/44.jpg",
          lastMessage: "Hey! How are you doing?",
          timestamp: "2m ago",
          unread: 2,
        },
        {
          id: 2,
          name: "Lisa",
          photo: "https://randomuser.me/api/portraits/women/32.jpg",
          lastMessage: "Would love to grab coffee sometime!",
          timestamp: "1h ago",
          unread: 0,
        },
        {
          id: 3,
          name: "Jennifer",
          photo: "https://randomuser.me/api/portraits/women/65.jpg",
          lastMessage: "Thanks for the chat! 😊",
          timestamp: "2d ago",
          unread: 0,
        },
      ]);
      setLoading(false);
    }, 1000);
  }, []);

  const openChat = (match) => {
    navigation.navigate("Chat", { match });
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#2B6CB0" />
        <Text style={styles.loadingText}>Loading messages...</Text>
      </View>
    );
  }

  if (matches.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <MessageCircle size={64} color="#CBD5E0" />
        <Text variant="headlineMedium" style={styles.emptyTitle}>
          No Messages Yet
        </Text>
        <Text variant="bodyLarge" style={styles.emptyText}>
          Start swiping to find your matches!
        </Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text variant="headlineSmall" style={styles.title}>
          Your Matches
        </Text>
        <Text variant="bodyMedium" style={styles.subtitle}>
          {matches.length} conversation{matches.length !== 1 ? "s" : ""}
        </Text>
      </View>

      {matches.map((match) => (
        <TouchableOpacity key={match.id} onPress={() => openChat(match)}>
          <Card style={styles.card}>
            <Card.Content style={styles.cardContent}>
              <View style={styles.avatarContainer}>
                <Avatar.Image size={56} source={{ uri: match.photo }} />
                {match.unread > 0 && (
                  <Badge style={styles.badge}>{match.unread}</Badge>
                )}
              </View>

              <View style={styles.messageInfo}>
                <View style={styles.nameRow}>
                  <Text variant="titleMedium" style={styles.name}>
                    {match.name}
                  </Text>
                  <Text variant="bodySmall" style={styles.timestamp}>
                    {match.timestamp}
                  </Text>
                </View>
                <Text
                  variant="bodyMedium"
                  style={[
                    styles.lastMessage,
                    match.unread > 0 && styles.unreadMessage,
                  ]}
                  numberOfLines={1}
                >
                  {match.lastMessage}
                </Text>
              </View>
            </Card.Content>
          </Card>
        </TouchableOpacity>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F7FAFC",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#F7FAFC",
  },
  loadingText: {
    marginTop: 16,
    color: "#666",
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 40,
    backgroundColor: "#F7FAFC",
  },
  emptyTitle: {
    marginTop: 24,
    marginBottom: 8,
    textAlign: "center",
    color: "#2d2d2d",
  },
  emptyText: {
    textAlign: "center",
    color: "#666",
  },
  header: {
    padding: 20,
    paddingBottom: 12,
  },
  title: {
    color: "#2d2d2d",
    fontWeight: "bold",
  },
  subtitle: {
    color: "#666",
    marginTop: 4,
  },
  card: {
    marginHorizontal: 16,
    marginBottom: 12,
    backgroundColor: "white",
    elevation: 2,
  },
  cardContent: {
    flexDirection: "row",
    alignItems: "center",
    padding: 12,
  },
  avatarContainer: {
    position: "relative",
    marginRight: 16,
  },
  badge: {
    position: "absolute",
    top: -4,
    right: -4,
    backgroundColor: "#E53E3E",
  },
  messageInfo: {
    flex: 1,
  },
  nameRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 4,
  },
  name: {
    fontWeight: "600",
    color: "#2d2d2d",
  },
  timestamp: {
    color: "#999",
  },
  lastMessage: {
    color: "#666",
  },
  unreadMessage: {
    fontWeight: "600",
    color: "#2d2d2d",
  },
});
