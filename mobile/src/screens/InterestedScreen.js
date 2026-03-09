import React, { useState, useCallback } from "react";
import {
  View,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  RefreshControl,
  Image,
} from "react-native";
import { Text, Button, ActivityIndicator } from "react-native-paper";
import { Users, MapPin } from "lucide-react-native";
import { userAPI } from "../services/api";
import { useFocusEffect } from "@react-navigation/native";

import AsyncStorage from "@react-native-async-storage/async-storage";
import * as SecureStore from "expo-secure-store";

export default function InterestedScreen({ navigation }) {
  const [likes, setLikes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchLikes = useCallback(async () => {
    try {
      const response = await userAPI.getLikesYou();
      setLikes(response.data.users || []);
    } catch (error) {
      console.error("❌ Error fetching likes:", error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  // ✅ useFocusEffect so it refreshes on every visit + clears stale data
  useFocusEffect(
    useCallback(() => {
      setLikes([]);
      setLoading(true);
      fetchLikes();
    }, [fetchLikes]),
  );

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    fetchLikes();
  }, [fetchLikes]);

  const handleLike = useCallback(async (userId) => {
    try {
      await userAPI.like(userId);
      setLikes((prev) => prev.filter((u) => u._id !== userId));
    } catch (error) {
      console.error("❌ Error liking user:", error);
    }
  }, []);

  const handlePass = useCallback(async (userId) => {
    try {
      await userAPI.pass(userId);
      setLikes((prev) => prev.filter((u) => u._id !== userId));
    } catch (error) {
      console.error("❌ Error passing user:", error);
    }
  }, []);

  const renderUser = useCallback(
    ({ item }) => (
      <TouchableOpacity
        style={styles.card}
        onPress={() => navigation.navigate("UserProfile", { userId: item._id })}
        activeOpacity={0.8}
      >
        <Image
          source={{ uri: item.profilePhoto }}
          style={styles.avatar}
          resizeMode="cover"
        />
        <View style={styles.info}>
          <Text style={styles.name}>
            {item.name}, {item.age}
          </Text>
          <View style={styles.locationRow}>
            <MapPin size={13} color="#718096" />
            <Text style={styles.location}>
              {item.city}, {item.state}
            </Text>
          </View>
          {item.bio && (
            <Text style={styles.bio} numberOfLines={2}>
              {item.bio}
            </Text>
          )}
        </View>
        <View style={styles.actions}>
          <TouchableOpacity
            style={styles.passButton}
            onPress={() => handlePass(item._id)}
          >
            <Text style={styles.passLabel}>Pass</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.connectButton}
            onPress={() => handleLike(item._id)}
          >
            <Text style={styles.connectLabel}>Connect</Text>
          </TouchableOpacity>
        </View>
      </TouchableOpacity>
    ),
    [navigation, handleLike, handlePass],
  );

  const keyExtractor = useCallback((item) => item._id, []);

  if (loading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color="#2B6CB0" />
        <Text style={styles.loadingText}>Loading...</Text>
      </View>
    );
  }

  if (likes.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <Users size={64} color="#CBD5E0" />
        <Text style={styles.emptyTitle}>No Connection Requests Yet</Text>
        <Text style={styles.emptyText}>
          People who want to connect with you will appear here
        </Text>
        <Button
          mode="contained"
          onPress={() => navigation.navigate("Discover")}
          style={styles.discoverButton}
          buttonColor="#2B6CB0"
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
      keyExtractor={keyExtractor}
      contentContainerStyle={styles.list}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
      // ✅ Performance optimizations
      removeClippedSubviews={true}
      maxToRenderPerBatch={8}
      windowSize={5}
      initialNumToRender={5}
    />
  );
}

const styles = StyleSheet.create({
  centerContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#F7FAFC",
  },
  loadingText: {
    marginTop: 16,
    color: "#718096",
    fontSize: 16,
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
    fontSize: 22,
    fontWeight: "700",
    color: "#2D3748",
    textAlign: "center",
  },
  emptyText: {
    textAlign: "center",
    color: "#718096",
    marginBottom: 24,
    fontSize: 15,
    lineHeight: 22,
  },
  discoverButton: {
    borderRadius: 8,
  },
  list: {
    padding: 16,
    backgroundColor: "#F7FAFC",
  },
  card: {
    backgroundColor: "white",
    borderRadius: 12,
    marginBottom: 12,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "#E2E8F0",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  avatar: {
    width: "100%",
    height: 200,
    backgroundColor: "#E2E8F0",
  },
  info: {
    padding: 14,
  },
  name: {
    fontSize: 18,
    fontWeight: "700",
    color: "#2D3748",
    marginBottom: 4,
  },
  locationRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    marginBottom: 6,
  },
  location: {
    fontSize: 13,
    color: "#718096",
  },
  bio: {
    fontSize: 13,
    color: "#4A5568",
    lineHeight: 18,
  },
  actions: {
    flexDirection: "row",
    gap: 10,
    padding: 12,
    borderTopWidth: 1,
    borderTopColor: "#E2E8F0",
    backgroundColor: "#FAFAFA",
  },
  passButton: {
    flex: 1,
    alignItems: "center",
    paddingVertical: 10,
    borderRadius: 8,
    borderWidth: 1.5,
    borderColor: "#E53E3E",
  },
  passLabel: {
    color: "#E53E3E",
    fontWeight: "600",
    fontSize: 14,
  },
  connectButton: {
    flex: 1,
    alignItems: "center",
    paddingVertical: 10,
    borderRadius: 8,
    backgroundColor: "#2B6CB0",
  },
  connectLabel: {
    color: "white",
    fontWeight: "600",
    fontSize: 14,
  },
});
