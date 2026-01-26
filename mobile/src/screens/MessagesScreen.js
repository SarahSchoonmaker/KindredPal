import React, { useState, useEffect } from "react";
import {
  View,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  RefreshControl,
} from "react-native";
import { userAPI, messageAPI } from "../services/api"; // Add messageAPI
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
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    fetchMatches();
  }, []);

  const fetchMatches = async () => {
    try {
      console.log("📥 Fetching matches...");

      // Get matches
      const matchesResponse = await userAPI.getMatches();
      const matchData = Array.isArray(matchesResponse.data)
        ? matchesResponse.data
        : matchesResponse.data.matches || [];

      // Get conversations for last messages
      try {
        const conversationsResponse = await messageAPI.getConversations();
        const conversations = conversationsResponse.data || [];

        // Merge match data with conversation data
        const matchesWithMessages = matchData.map((match) => {
          const conversation = conversations.find(
            (conv) => conv.otherUser?._id === match._id,
          );

          return {
            ...match,
            lastMessage: conversation?.lastMessage?.content || null,
            timestamp: conversation?.lastMessage?.createdAt || null,
            unreadCount: conversation?.unreadCount || 0,
          };
        });

        console.log(
          "✅ Found",
          matchesWithMessages.length,
          "matches with messages",
        );
        setMatches(matchesWithMessages);
      } catch (convError) {
        // If conversations fail, just show matches without messages
        console.log("⚠️ Conversations failed, showing matches only");
        setMatches(
          matchData.map((match) => ({
            ...match,
            lastMessage: null,
            timestamp: null,
            unreadCount: 0,
          })),
        );
      }
    } catch (error) {
      console.error("❌ Error fetching matches:", error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    fetchMatches();
  };

  const openChat = (match) => {
    navigation.navigate("Chat", { match });
  };

  const formatTimestamp = (date) => {
    if (!date) return "";
    const now = new Date();
    const messageDate = new Date(date);
    const diffMs = now - messageDate;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);

    if (diffMins < 1) return "Just now";
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    return messageDate.toLocaleDateString();
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
      <ScrollView
        style={styles.container}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        <View style={styles.emptyContainer}>
          <MessageCircle size={64} color="#CBD5E0" />
          <Text variant="headlineMedium" style={styles.emptyTitle}>
            No Matches Yet
          </Text>
          <Text variant="bodyLarge" style={styles.emptyText}>
            Start swiping to find your matches!
          </Text>
        </View>
      </ScrollView>
    );
  }

  return (
    <ScrollView
      style={styles.container}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
    >
      <View style={styles.header}>
        <Text variant="headlineSmall" style={styles.title}>
          Your Matches
        </Text>
        <Text variant="bodyMedium" style={styles.subtitle}>
          {matches.length} conversation{matches.length !== 1 ? "s" : ""}
        </Text>
      </View>

      {matches.map((match, index) => (
        <TouchableOpacity
          key={match._id || match.id || index}
          onPress={() => openChat(match)}
        >
          <Card style={styles.card}>
            <Card.Content style={styles.cardContent}>
              <View style={styles.avatarContainer}>
                <Avatar.Image
                  size={56}
                  source={{ uri: match.profilePhoto || match.photo }}
                />
                {match.unreadCount > 0 && (
                  <Badge style={styles.badge}>{match.unreadCount}</Badge>
                )}
              </View>

              <View style={styles.messageInfo}>
                <View style={styles.nameRow}>
                  <Text variant="titleMedium" style={styles.name}>
                    {match.name}
                  </Text>
                  {match.timestamp && (
                    <Text variant="bodySmall" style={styles.timestamp}>
                      {formatTimestamp(match.timestamp)}
                    </Text>
                  )}
                </View>
                {match.lastMessage ? (
                  <Text
                    variant="bodyMedium"
                    style={[
                      styles.lastMessage,
                      match.unreadCount > 0 && styles.unreadMessage,
                    ]}
                    numberOfLines={1}
                  >
                    {match.lastMessage}
                  </Text>
                ) : (
                  <Text variant="bodyMedium" style={styles.noMessages}>
                    Say hello! 👋
                  </Text>
                )}
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
    marginTop: 100,
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
  noMessages: {
    color: "#999",
    fontStyle: "italic",
  },
});
