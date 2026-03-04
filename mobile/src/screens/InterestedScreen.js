import React, { useState, useEffect } from "react";
import {
  View,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  RefreshControl,
} from "react-native";
import {
  Text,
  Card,
  Avatar,
  Button,
  ActivityIndicator,
} from "react-native-paper";
import { Users } from "lucide-react-native"; // Changed from Heart
import { userAPI } from "../services/api";

export default function InterestedScreen({ navigation }) {
  const [likes, setLikes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    fetchLikes();
  }, []);

  const fetchLikes = async () => {
    try {
      console.log("📥 Fetching likes...");
      const response = await userAPI.getLikesYou();
      console.log("✅ Likes response:", response.data);

      // FIX: Access response.data.users instead of response.data
      setLikes(response.data.users || []);
    } catch (error) {
      console.error("❌ Error fetching likes:", error);
      console.error("Error details:", error.response?.data);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    fetchLikes();
  };

  const handleLike = async (userId) => {
    try {
      await userAPI.like(userId);
      // Remove from list after liking
      setLikes(likes.filter((user) => user._id !== userId));
    } catch (error) {
      console.error("❌ Error liking user:", error);
    }
  };

  const handlePass = async (userId) => {
    try {
      await userAPI.pass(userId);
      // Remove from list after passing
      setLikes(likes.filter((user) => user._id !== userId));
    } catch (error) {
      console.error("❌ Error passing user:", error);
    }
  };

  const renderUser = ({ item }) => (
    <Card style={styles.card}>
      <Card.Content style={styles.cardContent}>
        <Avatar.Image
          size={80}
          source={{ uri: item.profilePhoto }}
          style={styles.avatar}
        />

        <View style={styles.info}>
          <Text variant="titleLarge" style={styles.name}>
            {item.name}, {item.age}
          </Text>
          <Text variant="bodyMedium" style={styles.location}>
            {item.city}, {item.state}
          </Text>
          {item.bio && (
            <Text variant="bodySmall" style={styles.bio} numberOfLines={2}>
              {item.bio}
            </Text>
          )}
        </View>

        <View style={styles.actions}>
          <Button
            mode="outlined"
            onPress={() => handlePass(item._id)}
            style={styles.passButton}
            labelStyle={styles.passLabel}
          >
            Pass
          </Button>
          <Button
            mode="contained"
            onPress={() => handleLike(item._id)}
            style={styles.likeButton}
          >
            Connect
          </Button>
        </View>
      </Card.Content>
    </Card>
  );

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#2B6CB0" />
        <Text style={styles.loadingText}>Loading...</Text>
      </View>
    );
  }

  if (likes.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <Users size={64} color="#CBD5E0" />
        <Text variant="headlineMedium" style={styles.emptyTitle}>
          No Connection Requests Yet
        </Text>
        <Text variant="bodyLarge" style={styles.emptyText}>
          People who want to connect with you will appear here
        </Text>
        <Button
          mode="contained"
          onPress={() => navigation.navigate("Discover")}
          style={styles.discoverButton}
        >
          Find Community
        </Button>
      </View>
    );
  }

  return (
    <FlatList
      data={likes}
      renderItem={renderUser}
      keyExtractor={(item) => item._id}
      contentContainerStyle={styles.list}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
    />
  );
}

const styles = StyleSheet.create({
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
    backgroundColor: "#F7FAFC",
    padding: 40,
  },
  emptyTitle: {
    marginTop: 24,
    marginBottom: 8,
    color: "#2d2d2d",
    textAlign: "center",
  },
  emptyText: {
    textAlign: "center",
    color: "#666",
    marginBottom: 24,
  },
  discoverButton: {
    backgroundColor: "#2B6CB0",
  },
  list: {
    padding: 16,
    backgroundColor: "#F7FAFC",
  },
  card: {
    marginBottom: 16,
    backgroundColor: "white",
  },
  cardContent: {
    padding: 16,
  },
  avatar: {
    marginBottom: 12,
  },
  info: {
    marginBottom: 16,
  },
  name: {
    fontWeight: "bold",
    color: "#2d2d2d",
    marginBottom: 4,
  },
  location: {
    color: "#666",
    marginBottom: 8,
  },
  bio: {
    color: "#666",
    lineHeight: 20,
  },
  actions: {
    flexDirection: "row",
    gap: 12,
  },
  passButton: {
    flex: 1,
    borderColor: "#E53E3E",
  },
  passLabel: {
    color: "#E53E3E",
  },
  likeButton: {
    flex: 1,
    backgroundColor: "#2B6CB0",
  },
});
