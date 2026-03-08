import React, { useState, useCallback } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  RefreshControl,
} from "react-native";
import { Image } from "react-native";
import { ActivityIndicator } from "react-native-paper";
import { MessageCircle, UserX, MapPin, ChevronRight } from "lucide-react-native";
import { userAPI } from "../services/api";
import { useFocusEffect } from "@react-navigation/native";

export default function ConnectionsScreen({ navigation }) {
  const [connections, setConnections] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchConnections = useCallback(async () => {
    try {
      const response = await userAPI.getMatches();
      setConnections(response.data || []);
    } catch (error) {
      console.error("Error fetching connections:", error);
      Alert.alert("Error", "Failed to load connections");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      setConnections([]);
      setLoading(true);
      fetchConnections();
    }, [fetchConnections])
  );

  const onRefresh = () => {
    setRefreshing(true);
    fetchConnections();
  };

  const handleViewProfile = (connection) => {
    navigation.navigate("UserProfile", { userId: connection._id });
  };

  const handleMessage = (connection) => {
    navigation.navigate("Chat", { match: connection });
  };

  const handleUnmatch = (connection) => {
    Alert.alert(
      "Remove Connection",
      `Are you sure you want to remove your connection with ${connection.name}?`,
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Remove",
          style: "destructive",
          onPress: async () => {
            try {
              await userAPI.unmatch(connection._id);
              setConnections((prev) => prev.filter((c) => c._id !== connection._id));
            } catch (error) {
              Alert.alert("Error", "Failed to remove connection");
            }
          },
        },
      ]
    );
  };

  if (loading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color="#2B6CB0" />
        <Text style={styles.loadingText}>Loading connections...</Text>
      </View>
    );
  }

  if (connections.length === 0) {
    return (
      <ScrollView
        contentContainerStyle={styles.emptyContainer}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
      >
        <Text style={styles.emptyIcon}>🤝</Text>
        <Text style={styles.emptyTitle}>No Connections Yet</Text>
        <Text style={styles.emptyText}>
          When someone you connect with connects back, they'll appear here!
        </Text>
        <TouchableOpacity style={styles.discoverButton} onPress={() => navigation.navigate("Discover")}>
          <Text style={styles.discoverButtonText}>Start Discovering</Text>
        </TouchableOpacity>
      </ScrollView>
    );
  }

  return (
    <ScrollView
      style={styles.container}
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
    >
      <Text style={styles.countText}>
        {connections.length} {connections.length === 1 ? "Connection" : "Connections"}
      </Text>

      {connections.map((connection) => (
        <View key={connection._id} style={styles.card}>
          <TouchableOpacity
            style={styles.profileRow}
            onPress={() => handleViewProfile(connection)}
            activeOpacity={0.7}
          >
            <Image
              source={{ uri: connection.profilePhoto }}
              style={styles.avatar}
              resizeMode="cover"
            />
            <View style={styles.info}>
              <Text style={styles.name}>{connection.name}</Text>
              {connection.age && <Text style={styles.age}>{connection.age} years old</Text>}
              <View style={styles.locationRow}>
                <MapPin size={13} color="#718096" />
                <Text style={styles.location}>{connection.city}, {connection.state}</Text>
              </View>
              {connection.bio && (
                <Text style={styles.bio} numberOfLines={2}>{connection.bio}</Text>
              )}
            </View>
            <ChevronRight size={20} color="#CBD5E0" />
          </TouchableOpacity>

          <View style={styles.divider} />

          <View style={styles.actions}>
            <TouchableOpacity style={styles.messageButton} onPress={() => handleMessage(connection)}>
              <MessageCircle size={18} color="white" />
              <Text style={styles.messageButtonText}>Message</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.profileButton} onPress={() => handleViewProfile(connection)}>
              <Text style={styles.profileButtonText}>View Profile</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.unmatchButton} onPress={() => handleUnmatch(connection)}>
              <UserX size={18} color="#E53E3E" />
            </TouchableOpacity>
          </View>
        </View>
      ))}
      <View style={{ height: 32 }} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F7FAFC" },
  centerContainer: { flex: 1, justifyContent: "center", alignItems: "center", padding: 40 },
  loadingText: { marginTop: 16, fontSize: 16, color: "#718096" },
  emptyContainer: { flex: 1, justifyContent: "center", alignItems: "center", padding: 40 },
  emptyIcon: { fontSize: 64, marginBottom: 24 },
  emptyTitle: { fontSize: 24, fontWeight: "700", color: "#2D3748", marginBottom: 12, textAlign: "center" },
  emptyText: { fontSize: 16, color: "#718096", textAlign: "center", lineHeight: 24, marginBottom: 32 },
  discoverButton: { backgroundColor: "#2B6CB0", paddingHorizontal: 32, paddingVertical: 14, borderRadius: 8 },
  discoverButtonText: { color: "white", fontSize: 16, fontWeight: "600" },
  countText: { fontSize: 14, color: "#718096", fontWeight: "600", textAlign: "center", paddingVertical: 16 },
  card: {
    backgroundColor: "white",
    marginHorizontal: 16,
    marginBottom: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#E2E8F0",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
    overflow: "hidden",
  },
  profileRow: { flexDirection: "row", alignItems: "center", gap: 12, padding: 16 },
  avatar: { width: 72, height: 72, borderRadius: 36, backgroundColor: "#E2E8F0" },
  info: { flex: 1 },
  name: { fontSize: 18, fontWeight: "700", color: "#2D3748", marginBottom: 2 },
  age: { fontSize: 13, color: "#718096", marginBottom: 4 },
  locationRow: { flexDirection: "row", alignItems: "center", gap: 4, marginBottom: 4 },
  location: { fontSize: 13, color: "#718096" },
  bio: { fontSize: 13, color: "#4A5568", lineHeight: 18 },
  divider: { height: 1, backgroundColor: "#E2E8F0", marginHorizontal: 16 },
  actions: { flexDirection: "row", gap: 8, padding: 12, alignItems: "center" },
  messageButton: {
    flex: 1, flexDirection: "row", alignItems: "center", justifyContent: "center",
    gap: 6, backgroundColor: "#2B6CB0", paddingVertical: 9, borderRadius: 8,
  },
  messageButtonText: { color: "white", fontSize: 14, fontWeight: "600" },
  profileButton: {
    flex: 1, alignItems: "center", justifyContent: "center",
    paddingVertical: 9, borderRadius: 8, borderWidth: 1, borderColor: "#2B6CB0",
  },
  profileButtonText: { color: "#2B6CB0", fontSize: 14, fontWeight: "600" },
  unmatchButton: {
    padding: 9, borderRadius: 8, borderWidth: 1,
    borderColor: "#FED7D7", backgroundColor: "#FFF5F5",
  },
});