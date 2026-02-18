import React, { useState, useEffect } from "react";
import {
  View,
  ScrollView,
  Image,
  TouchableOpacity,
  RefreshControl,
  StyleSheet,
  Dimensions,
  Alert,
} from "react-native";
import { Text, ActivityIndicator, Button, Chip } from "react-native-paper";
import { MapPin, Heart, X } from "lucide-react-native";
import { userAPI, authAPI } from "../services/api";
import DiscoverFilters from "../components/DiscoverFilters";

const { width } = Dimensions.get("window");
const CARD_WIDTH = width - 32;

export default function DiscoverScreen({ navigation }) {
  const [users, setUsers] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    fetchCurrentUser();
    fetchUsers();
  }, []);

  const fetchCurrentUser = async () => {
    try {
      const response = await authAPI.getProfile();
      setCurrentUser(response.data);
      console.log(
        "📍 Current location:",
        response.data.city,
        response.data.state,
      );
      console.log("🔍 Search preference:", response.data.locationPreference);
    } catch (error) {
      console.error("Error fetching current user:", error);
    }
  };

  const fetchUsers = async () => {
    try {
      console.log("📥 Fetching real users from API...");
      const response = await userAPI.getDiscover();
      console.log("✅ Got users:", response.data.users?.length || 0);
      setUsers(response.data.users || []);
    } catch (error) {
      console.error("❌ Error fetching profiles:", error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    fetchCurrentUser();
    fetchUsers();
  };

  const handlePreferencesUpdate = () => {
    fetchCurrentUser();
    fetchUsers();
  };

  const handleLike = async (userId) => {
    try {
      const response = await userAPI.like(userId);

      // Remove user from list first
      setUsers((prev) => prev.filter((u) => u._id !== userId));

      // Show appropriate alert
      if (response.data.isMatch) {
        Alert.alert(
          "🎉 It's a Match!",
          `You and ${response.data.matchedUser?.name} connected!`,
          [
            {
              text: "Send Message",
              onPress: () =>
                navigation.navigate("Chat", {
                  userId: response.data.matchedUser._id,
                  userName: response.data.matchedUser.name,
                }),
            },
            {
              text: "Keep Discovering",
              style: "cancel",
            },
          ],
        );
      } else {
        // Show "Connection Sent" alert for regular likes
        Alert.alert(
          "✅ Connection Sent!",
          `We'll let you know if they connect back!`,
          [{ text: "OK" }],
        );
      }
    } catch (error) {
      console.error("Error liking user:", error);
      Alert.alert("Error", "Couldn't send connection. Please try again.", [
        { text: "OK" },
      ]);
    }
  };

  const handlePass = async (userId) => {
    try {
      await userAPI.pass(userId);
      setUsers((prev) => prev.filter((u) => u._id !== userId));
    } catch (error) {
      console.error("Error passing user:", error);
    }
  };

  const handleCardPress = (userId) => {
    navigation.navigate("UserProfile", { userId });
  };

  if (loading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color="#2B6CB0" />
        <Text style={styles.loadingText}>Finding your people...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Header with search info and filters */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <Text style={styles.headerTitle}>Discover Your People</Text>
          {currentUser && (
            <View style={styles.searchInfo}>
              <MapPin size={14} color="#2B6CB0" />
              <Text style={styles.searchInfoText}>
                {currentUser.city}, {currentUser.state} •{" "}
                {currentUser.locationPreference || "Home state"}
              </Text>
            </View>
          )}
        </View>
        {currentUser && (
          <DiscoverFilters
            currentPreference={currentUser.locationPreference}
            onUpdate={handlePreferencesUpdate}
          />
        )}
      </View>

      {users.length === 0 ? (
        <ScrollView
          contentContainerStyle={styles.emptyContainer}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
        >
          <Text style={styles.emptyIcon}>🔍</Text>
          <Text style={styles.emptyTitle}>No More Users Right Now</Text>
          <Text style={styles.emptyText}>
            We've shown you everyone in your area!
          </Text>
          {currentUser?.locationPreference === "Same city" && (
            <View style={styles.tipBox}>
              <Text style={styles.tipText}>
                💡 Try expanding your search to "Home state" or "Anywhere" to
                see more people
              </Text>
            </View>
          )}
          <Button
            mode="contained"
            onPress={() => navigation.navigate("Messages")}
            style={styles.emptyButton}
            buttonColor="#2B6CB0"
          >
            View Your Matches
          </Button>
        </ScrollView>
      ) : (
        <ScrollView
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
          contentContainerStyle={styles.scrollContent}
        >
          <Text style={styles.usersCount}>
            Showing {users.length} {users.length === 1 ? "person" : "people"}
          </Text>

          {users.map((user) => (
            <TouchableOpacity
              key={user._id}
              style={styles.card}
              activeOpacity={0.9}
              onPress={() => handleCardPress(user._id)}
            >
              {/* Image */}
              <View style={styles.imageContainer}>
                <Image
                  source={{ uri: user.profilePhoto }}
                  style={styles.image}
                  resizeMode="cover"
                />
                <View style={styles.matchBadge}>
                  <Text style={styles.matchBadgeText}>
                    {user.matchScore}% Match
                  </Text>
                </View>
              </View>

              {/* Info */}
              <View style={styles.cardContent}>
                <Text style={styles.cardName}>
                  {user.name}, {user.age}
                </Text>

                <View style={styles.locationRow}>
                  <MapPin size={16} color="#2B6CB0" />
                  <Text style={styles.locationText}>
                    {user.city}, {user.state}
                  </Text>
                </View>

                {user.bio && (
                  <Text style={styles.bioText} numberOfLines={3}>
                    {user.bio}
                  </Text>
                )}

                {user.causes && user.causes.length > 0 && (
                  <View style={styles.tagsContainer}>
                    {user.causes.slice(0, 3).map((cause, idx) => (
                      <Chip
                        key={idx}
                        style={styles.chip}
                        textStyle={styles.chipText}
                        compact
                      >
                        {cause}
                      </Chip>
                    ))}
                    {user.causes.length > 3 && (
                      <Chip
                        style={styles.chipMore}
                        textStyle={styles.chipTextMore}
                        compact
                      >
                        +{user.causes.length - 3} more
                      </Chip>
                    )}
                  </View>
                )}
              </View>

              {/* Actions */}
              <View style={styles.actions}>
                <TouchableOpacity
                  style={styles.passButton}
                  onPress={() => handlePass(user._id)}
                >
                  <X size={24} color="#718096" />
                  <Text style={styles.passButtonText}>Pass</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.likeButton}
                  onPress={() => handleLike(user._id)}
                >
                  <Heart size={24} color="white" />
                  <Text style={styles.likeButtonText}>Connect</Text>
                </TouchableOpacity>
              </View>
            </TouchableOpacity>
          ))}
        </ScrollView>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F7FAFC",
  },
  header: {
    backgroundColor: "white",
    padding: 16,
    paddingTop: 8,
    borderBottomWidth: 1,
    borderBottomColor: "#E2E8F0",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
  },
  headerLeft: {
    marginBottom: 12,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: "#2D3748",
    marginBottom: 4,
  },
  searchInfo: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  searchInfoText: {
    fontSize: 13,
    color: "#4A5568",
    fontWeight: "500",
  },
  centerContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#F7FAFC",
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: "#718096",
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 32,
  },
  usersCount: {
    textAlign: "center",
    fontSize: 14,
    color: "#718096",
    fontWeight: "600",
    marginBottom: 16,
  },
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
  imageContainer: {
    position: "relative",
    height: 320,
    backgroundColor: "#E2E8F0",
  },
  image: {
    width: "100%",
    height: "100%",
  },
  matchBadge: {
    position: "absolute",
    top: 16,
    right: 16,
    backgroundColor: "#2B6CB0",
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    shadowColor: "#2B6CB0",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  matchBadgeText: {
    color: "white",
    fontSize: 13,
    fontWeight: "700",
  },
  cardContent: {
    padding: 16,
  },
  cardName: {
    fontSize: 20,
    fontWeight: "700",
    color: "#2D3748",
    marginBottom: 8,
  },
  locationRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    marginBottom: 12,
  },
  locationText: {
    fontSize: 14,
    color: "#718096",
  },
  bioText: {
    fontSize: 14,
    color: "#4A5568",
    lineHeight: 20,
    marginBottom: 12,
  },
  tagsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  chip: {
    backgroundColor: "#EBF4FF",
    height: 28,
  },
  chipText: {
    fontSize: 12,
    color: "#2B6CB0",
    fontWeight: "600",
  },
  chipMore: {
    backgroundColor: "#F7FAFC",
    height: 28,
  },
  chipTextMore: {
    fontSize: 12,
    color: "#718096",
  },
  actions: {
    flexDirection: "row",
    gap: 12,
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: "#E2E8F0",
    backgroundColor: "#FAFAFA",
  },
  passButton: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    height: 48,
    backgroundColor: "white",
    borderWidth: 2,
    borderColor: "#E2E8F0",
    borderRadius: 8,
  },
  passButtonText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#718096",
  },
  likeButton: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    height: 48,
    backgroundColor: "#2B6CB0",
    borderRadius: 8,
  },
  likeButtonText: {
    fontSize: 14,
    fontWeight: "600",
    color: "white",
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 40,
  },
  emptyIcon: {
    fontSize: 64,
    marginBottom: 24,
  },
  emptyTitle: {
    fontSize: 24,
    fontWeight: "700",
    color: "#2D3748",
    marginBottom: 12,
    textAlign: "center",
  },
  emptyText: {
    fontSize: 16,
    color: "#718096",
    textAlign: "center",
    marginBottom: 16,
  },
  tipBox: {
    backgroundColor: "#FFFBEB",
    borderWidth: 1,
    borderColor: "#FEF3C7",
    borderRadius: 8,
    padding: 12,
    marginBottom: 24,
  },
  tipText: {
    fontSize: 14,
    color: "#92400E",
    textAlign: "center",
  },
  emptyButton: {
    marginTop: 8,
  },
});
