import React, { useState, useCallback, useMemo, memo } from "react";
import {
  View,
  Image,
  ScrollView,
  TouchableOpacity,
  RefreshControl,
  StyleSheet,
  Dimensions,
  Alert,
} from "react-native";
import { Text, ActivityIndicator, Chip } from "react-native-paper";
import { MapPin, Heart, X } from "lucide-react-native";
import { userAPI, authAPI } from "../services/api";
import { useFocusEffect } from "@react-navigation/native";
import DiscoverFilters from "../components/DiscoverFilters";

const { width } = Dimensions.get("window");

const ProfileCard = memo(({ user, onPress, onLike, onPass }) => (
  <TouchableOpacity style={styles.card} activeOpacity={0.9} onPress={() => onPress(user._id)}>
    <View style={styles.imageContainer}>
      <Image source={{ uri: user.profilePhoto }} style={styles.image} resizeMode="cover" />
    </View>
    <View style={styles.cardContent}>
      <Text style={styles.cardName}>{user.name}, {user.age}</Text>
      <View style={styles.locationRow}>
        <MapPin size={16} color="#2B6CB0" />
        <Text style={styles.locationText}>{user.city}, {user.state}</Text>
      </View>
      {user.bio && <Text style={styles.bioText} numberOfLines={3}>{user.bio}</Text>}
      {user.causes && user.causes.length > 0 && (
        <View style={styles.tagsContainer}>
          {user.causes.slice(0, 3).map((cause, idx) => (
            <Chip key={idx} style={styles.chip} textStyle={styles.chipText} compact>{cause}</Chip>
          ))}
          {user.causes.length > 3 && (
            <Chip style={styles.chipMore} textStyle={styles.chipTextMore} compact>+{user.causes.length - 3} more</Chip>
          )}
        </View>
      )}
    </View>
    <View style={styles.actions}>
      <TouchableOpacity style={styles.passButton} onPress={() => onPass(user._id)}>
        <X size={24} color="#718096" />
        <Text style={styles.passButtonText}>Pass</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.likeButton} onPress={() => onLike(user._id)}>
        <Heart size={24} color="white" />
        <Text style={styles.likeButtonText}>Connect</Text>
      </TouchableOpacity>
    </View>
  </TouchableOpacity>
));

export default function DiscoverScreen({ navigation }) {
  const [users, setUsers] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchAll = useCallback(async () => {
    try {
      const [profileRes, discoverRes] = await Promise.all([
        authAPI.getProfile(),
        userAPI.getDiscover(),
      ]);
      setCurrentUser(profileRes.data);
      setUsers(discoverRes.data.users || []);
    } catch (error) {
      console.error("Error fetching discover:", error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      setLoading(true);
      setUsers([]);
      setCurrentUser(null);
      fetchAll();
    }, [fetchAll])
  );

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    fetchAll();
  }, [fetchAll]);

  const handleLike = useCallback(async (userId) => {
    try {
      const response = await userAPI.like(userId);
      setUsers((prev) => prev.filter((u) => u._id !== userId));
      if (response.data.isMatch) {
        Alert.alert(
          "🎉 It's a Match!",
          `You and ${response.data.matchedUser?.name} connected!`,
          [
            { text: "Send Message", onPress: () => navigation.navigate("Chat", { match: response.data.matchedUser }) },
            { text: "Keep Discovering", style: "cancel" },
          ]
        );
      }
    } catch (error) {
      console.error("Error liking user:", error);
    }
  }, [navigation]);

  const handlePass = useCallback(async (userId) => {
    try {
      await userAPI.pass(userId);
      setUsers((prev) => prev.filter((u) => u._id !== userId));
    } catch (error) {
      console.error("Error passing user:", error);
    }
  }, []);

  const handleCardPress = useCallback((userId) => {
    navigation.navigate("UserProfile", { userId });
  }, [navigation]);

  if (loading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color="#2B6CB0" />
        <Text style={styles.loadingText}>Finding your people...</Text>
      </View>
    );
  }

  if (users.length === 0) {
    return (
      <ScrollView
        contentContainerStyle={styles.emptyContainer}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
      >
        <Text style={styles.emptyIcon}>🔍</Text>
        <Text style={styles.emptyTitle}>No More Users Right Now</Text>
        <Text style={styles.emptyText}>We've shown you everyone in your area!</Text>
        <TouchableOpacity style={styles.emptyButton} onPress={() => navigation.navigate("Connections")}>
          <Text style={styles.emptyButtonText}>View Your Connections</Text>
        </TouchableOpacity>
      </ScrollView>
    );
  }

  return (
    <View style={styles.container}>
      {currentUser && (
        <View style={styles.header}>
          <View style={styles.searchInfo}>
            <MapPin size={14} color="#2B6CB0" />
            <Text style={styles.searchInfoText}>
              {currentUser.city}, {currentUser.state} • {currentUser.locationPreference || "Home state"}
            </Text>
          </View>
          <DiscoverFilters
            currentPreference={currentUser.locationPreference}
            onUpdate={fetchAll}
          />
        </View>
      )}
      <ScrollView
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
        contentContainerStyle={styles.scrollContent}
        removeClippedSubviews={true}
      >
        {users.map((user) => (
          <ProfileCard
            key={user._id}
            user={user}
            onPress={handleCardPress}
            onLike={handleLike}
            onPass={handlePass}
          />
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F7FAFC" },
  header: {
    backgroundColor: "white",
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#E2E8F0",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 12,
  },
  searchInfo: { flexDirection: "row", alignItems: "center", gap: 6, flex: 1 },
  searchInfoText: { fontSize: 13, color: "#4A5568", fontWeight: "500" },
  centerContainer: { flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "#F7FAFC" },
  loadingText: { marginTop: 16, fontSize: 16, color: "#718096" },
  scrollContent: { padding: 16, paddingBottom: 32 },
  card: {
    backgroundColor: "white",
    borderRadius: 12,
    marginBottom: 16,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
    borderWidth: 1,
    borderColor: "#E2E8F0",
  },
  imageContainer: { height: 320, backgroundColor: "#E2E8F0" },
  image: { width: "100%", height: "100%" },
  cardContent: { padding: 16 },
  cardName: { fontSize: 20, fontWeight: "700", color: "#2D3748", marginBottom: 8 },
  locationRow: { flexDirection: "row", alignItems: "center", gap: 6, marginBottom: 12 },
  locationText: { fontSize: 14, color: "#718096" },
  bioText: { fontSize: 14, color: "#4A5568", lineHeight: 20, marginBottom: 12 },
  tagsContainer: { flexDirection: "row", flexWrap: "wrap", gap: 8 },
  chip: { backgroundColor: "#EBF4FF", height: 28 },
  chipText: { fontSize: 12, color: "#2B6CB0", fontWeight: "600" },
  chipMore: { backgroundColor: "#F7FAFC", height: 28 },
  chipTextMore: { fontSize: 12, color: "#718096" },
  actions: {
    flexDirection: "row",
    gap: 12,
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: "#E2E8F0",
    backgroundColor: "#FAFAFA",
  },
  passButton: {
    flex: 1, flexDirection: "row", alignItems: "center", justifyContent: "center",
    gap: 8, height: 48, backgroundColor: "white", borderWidth: 2,
    borderColor: "#E2E8F0", borderRadius: 8,
  },
  passButtonText: { fontSize: 14, fontWeight: "600", color: "#718096" },
  likeButton: {
    flex: 1, flexDirection: "row", alignItems: "center", justifyContent: "center",
    gap: 8, height: 48, backgroundColor: "#2B6CB0", borderRadius: 8,
  },
  likeButtonText: { fontSize: 14, fontWeight: "600", color: "white" },
  emptyContainer: { flex: 1, justifyContent: "center", alignItems: "center", padding: 40 },
  emptyIcon: { fontSize: 64, marginBottom: 24 },
  emptyTitle: { fontSize: 24, fontWeight: "700", color: "#2D3748", marginBottom: 12, textAlign: "center" },
  emptyText: { fontSize: 16, color: "#718096", textAlign: "center", marginBottom: 24 },
  emptyButton: { backgroundColor: "#2B6CB0", paddingHorizontal: 24, paddingVertical: 12, borderRadius: 8 },
  emptyButtonText: { color: "white", fontSize: 16, fontWeight: "600" },
});