import React, { useState, useEffect } from "react";
import {
  View,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  RefreshControl,
  Alert,
} from "react-native";
import {
  Text,
  Card,
  Avatar,
  Button,
  ActivityIndicator,
} from "react-native-paper";
import { ArrowLeft, UserX } from "lucide-react-native";
import { userAPI } from "../services/api";

export default function BlockedUsersScreen({ navigation }) {
  const [blockedUsers, setBlockedUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    fetchBlockedUsers();
  }, []);

  const fetchBlockedUsers = async () => {
    try {
      const response = await userAPI.getBlockedUsers();
      setBlockedUsers(response.data || []);
    } catch (error) {
      logger.error("Error fetching blocked users:", error);
      Alert.alert("Error", "Failed to load blocked users");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    fetchBlockedUsers();
  };

  const handleUnblock = (user) => {
    Alert.alert(
      "Unblock User",
      `Are you sure you want to unblock ${user.name}?`,
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Unblock",
          onPress: async () => {
            try {
              await userAPI.unblockUser(user._id);
              setBlockedUsers((prev) => prev.filter((u) => u._id !== user._id));
              Alert.alert("Success", `${user.name} has been unblocked`);
            } catch (error) {
              logger.error("Error unblocking user:", error);
              Alert.alert("Error", "Failed to unblock user");
            }
          },
        },
      ],
    );
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#2B6CB0" />
      </View>
    );
  }

  if (blockedUsers.length === 0) {
    return (
      <ScrollView
        contentContainerStyle={styles.emptyContainer}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        <UserX size={64} color="#CBD5E0" />
        <Text style={styles.emptyTitle}>No Blocked Users</Text>
        <Text style={styles.emptyText}>You haven't blocked anyone yet.</Text>
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
        <Text style={styles.headerText}>
          {blockedUsers.length} blocked{" "}
          {blockedUsers.length === 1 ? "user" : "users"}
        </Text>
      </View>

      {blockedUsers.map((user) => (
        <Card key={user._id} style={styles.card}>
          <Card.Content style={styles.cardContent}>
            <Avatar.Image size={56} source={{ uri: user.profilePhoto }} />
            <View style={styles.userInfo}>
              <Text style={styles.userName}>{user.name}</Text>
            </View>
            <Button
              mode="outlined"
              onPress={() => handleUnblock(user)}
              textColor="#E53E3E"
              style={styles.unblockButton}
            >
              Unblock
            </Button>
          </Card.Content>
        </Card>
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
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 40,
    minHeight: 400,
  },
  emptyTitle: {
    fontSize: 24,
    fontWeight: "700",
    color: "#2D3748",
    marginTop: 24,
    marginBottom: 8,
  },
  emptyText: {
    fontSize: 16,
    color: "#718096",
    textAlign: "center",
  },
  header: {
    padding: 20,
    backgroundColor: "white",
    borderBottomWidth: 1,
    borderBottomColor: "#E2E8F0",
  },
  headerText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#718096",
  },
  card: {
    marginHorizontal: 16,
    marginTop: 12,
    backgroundColor: "white",
  },
  cardContent: {
    flexDirection: "row",
    alignItems: "center",
    padding: 12,
  },
  userInfo: {
    flex: 1,
    marginLeft: 16,
  },
  userName: {
    fontSize: 16,
    fontWeight: "600",
    color: "#2D3748",
  },
  unblockButton: {
    borderColor: "#E53E3E",
  },
});
