import React, { useState, useCallback } from "react";
import {
  View,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  RefreshControl,
  TextInput,
  Image,
} from "react-native";
import { Text, ActivityIndicator, Chip } from "react-native-paper";
import { Users, Search, Plus, Lock, Globe } from "lucide-react-native";
import { useFocusEffect } from "@react-navigation/native";
import api from "../services/api";

const CATEGORIES = [
  "All",
  "Sports & Fitness",
  "Faith & Spirituality",
  "Life Stage",
  "Hobbies & Interests",
  "Social Gatherings",
  "Support & Wellness",
  "Professional & Networking",
  "Arts & Culture",
  "Outdoor & Adventure",
];

const CATEGORY_ICONS = {
  "Sports & Fitness": "🏃",
  "Faith & Spirituality": "🙏",
  "Life Stage": "🌱",
  "Hobbies & Interests": "🎯",
  "Social Gatherings": "👥",
  "Support & Wellness": "💙",
  "Professional & Networking": "💼",
  "Arts & Culture": "🎨",
  "Outdoor & Adventure": "🏕️",
  Other: "✨",
};

function GroupCard({ group, onPress }) {
  return (
    <TouchableOpacity style={styles.card} onPress={() => onPress(group._id)}>
      <View style={styles.cardHeader}>
        <View style={styles.cardIcon}>
          <Text style={styles.cardIconText}>
            {CATEGORY_ICONS[group.category] || "✨"}
          </Text>
        </View>
        <View style={styles.cardInfo}>
          <View style={styles.cardTitleRow}>
            <Text style={styles.cardName} numberOfLines={1}>
              {group.name}
            </Text>
            {group.isPrivate ? (
              <Lock size={14} color="#718096" />
            ) : (
              <Globe size={14} color="#68A57D" />
            )}
          </View>
          <Text style={styles.cardCategory}>{group.category}</Text>
          {group.city ? (
            <Text style={styles.cardLocation}>
              📍 {group.city}, {group.state}
            </Text>
          ) : (
            <Text style={styles.cardLocation}>🌍 Nationwide</Text>
          )}
        </View>
      </View>

      <Text style={styles.cardDescription} numberOfLines={2}>
        {group.description}
      </Text>

      <View style={styles.cardFooter}>
        <View style={styles.memberCount}>
          <Users size={14} color="#718096" />
          <Text style={styles.memberCountText}>
            {group.memberCount || 0} members
          </Text>
        </View>
        {group.isMember ? (
          <View style={styles.memberBadge}>
            <Text style={styles.memberBadgeText}>✓ Joined</Text>
          </View>
        ) : group.isPending ? (
          <View style={styles.pendingBadge}>
            <Text style={styles.pendingBadgeText}>Pending</Text>
          </View>
        ) : (
          <View style={styles.joinBadge}>
            <Text style={styles.joinBadgeText}>
              {group.isPrivate ? "Request to Join" : "Join"}
            </Text>
          </View>
        )}
      </View>
    </TouchableOpacity>
  );
}

export default function GroupsScreen({ navigation }) {
  const [groups, setGroups] = useState([]);
  const [myGroups, setMyGroups] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [activeTab, setActiveTab] = useState("discover"); // discover | my

  const fetchGroups = useCallback(async () => {
    try {
      const params = {};
      if (selectedCategory !== "All") params.category = selectedCategory;
      if (search) params.search = search;

      const [discoverRes, myRes] = await Promise.all([
        api.get("/groups", { params }),
        api.get("/groups/my"),
      ]);

      setGroups(discoverRes.data.groups || []);
      setMyGroups(myRes.data.groups || []);
    } catch (err) {
      console.error("Error fetching groups:", err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [selectedCategory, search]);

  useFocusEffect(
    useCallback(() => {
      setLoading(true);
      fetchGroups();
    }, [fetchGroups]),
  );

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    fetchGroups();
  }, [fetchGroups]);

  const handleGroupPress = (groupId) => {
    navigation.navigate("GroupDetail", { groupId });
  };

  const displayedGroups = activeTab === "my" ? myGroups : groups;

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#2B6CB0" />
        <Text style={styles.loadingText}>Finding your community...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <Search size={18} color="#718096" style={styles.searchIcon} />
        <TextInput
          style={styles.searchInput}
          placeholder="Search groups..."
          value={search}
          onChangeText={setSearch}
          onSubmitEditing={fetchGroups}
          returnKeyType="search"
          placeholderTextColor="#A0AEC0"
        />
      </View>

      {/* Tabs */}
      <View style={styles.tabs}>
        <TouchableOpacity
          style={[styles.tab, activeTab === "discover" && styles.tabActive]}
          onPress={() => setActiveTab("discover")}
        >
          <Text
            style={[
              styles.tabText,
              activeTab === "discover" && styles.tabTextActive,
            ]}
          >
            Discover
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, activeTab === "my" && styles.tabActive]}
          onPress={() => setActiveTab("my")}
        >
          <Text
            style={[styles.tabText, activeTab === "my" && styles.tabTextActive]}
          >
            My Groups {myGroups.length > 0 ? `(${myGroups.length})` : ""}
          </Text>
        </TouchableOpacity>
      </View>

      {/* Category Filter */}
      {activeTab === "discover" && (
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.categoryScroll}
          contentContainerStyle={styles.categoryContent}
        >
          {CATEGORIES.map((cat) => (
            <TouchableOpacity
              key={cat}
              style={[
                styles.categoryChip,
                selectedCategory === cat && styles.categoryChipActive,
              ]}
              onPress={() => setSelectedCategory(cat)}
            >
              <Text
                style={[
                  styles.categoryChipText,
                  selectedCategory === cat && styles.categoryChipTextActive,
                ]}
              >
                {cat === "All" ? "All Groups" : cat}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      )}

      {/* Group List */}
      <ScrollView
        style={styles.list}
        contentContainerStyle={styles.listContent}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {displayedGroups.length === 0 ? (
          <View style={styles.empty}>
            <Text style={styles.emptyIcon}>👥</Text>
            <Text style={styles.emptyTitle}>
              {activeTab === "my" ? "No Groups Yet" : "No Groups Found"}
            </Text>
            <Text style={styles.emptyText}>
              {activeTab === "my"
                ? "Join a group from Discover to get started!"
                : "Try a different search or category"}
            </Text>
          </View>
        ) : (
          displayedGroups.map((group) => (
            <GroupCard
              key={group._id}
              group={group}
              onPress={handleGroupPress}
            />
          ))
        )}
        <View style={{ height: 20 }} />
      </ScrollView>

      {/* Create Group FAB */}
      <TouchableOpacity
        style={styles.fab}
        onPress={() => navigation.navigate("CreateGroup")}
      >
        <Plus size={24} color="white" />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F7FAFC" },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#F7FAFC",
  },
  loadingText: { marginTop: 16, fontSize: 16, color: "#718096" },

  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "white",
    margin: 12,
    borderRadius: 10,
    paddingHorizontal: 12,
    borderWidth: 1,
    borderColor: "#E2E8F0",
  },
  searchIcon: { marginRight: 8 },
  searchInput: { flex: 1, height: 44, fontSize: 15, color: "#2D3748" },

  tabs: {
    flexDirection: "row",
    backgroundColor: "white",
    borderBottomWidth: 1,
    borderBottomColor: "#E2E8F0",
  },
  tab: {
    flex: 1,
    paddingVertical: 12,
    alignItems: "center",
    borderBottomWidth: 2,
    borderBottomColor: "transparent",
  },
  tabActive: { borderBottomColor: "#2B6CB0" },
  tabText: { fontSize: 14, fontWeight: "600", color: "#718096" },
  tabTextActive: { color: "#2B6CB0" },

  categoryScroll: {
    backgroundColor: "white",
    borderBottomWidth: 1,
    borderBottomColor: "#E2E8F0",
  },
  categoryContent: { paddingHorizontal: 12, paddingVertical: 10, gap: 8 },
  categoryChip: {
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 20,
    backgroundColor: "#F7FAFC",
    borderWidth: 1,
    borderColor: "#E2E8F0",
    marginRight: 8,
  },
  categoryChipActive: { backgroundColor: "#2B6CB0", borderColor: "#2B6CB0" },
  categoryChipText: { fontSize: 13, fontWeight: "500", color: "#718096" },
  categoryChipTextActive: { color: "white" },

  list: { flex: 1 },
  listContent: { padding: 12 },

  card: {
    backgroundColor: "white",
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "#E2E8F0",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  cardHeader: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: 10,
  },
  cardIcon: {
    width: 48,
    height: 48,
    borderRadius: 12,
    backgroundColor: "#EBF4FF",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  cardIconText: { fontSize: 22 },
  cardInfo: { flex: 1 },
  cardTitleRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    marginBottom: 2,
  },
  cardName: { fontSize: 16, fontWeight: "700", color: "#2D3748", flex: 1 },
  cardCategory: {
    fontSize: 12,
    color: "#2B6CB0",
    fontWeight: "600",
    marginBottom: 2,
  },
  cardLocation: { fontSize: 12, color: "#718096" },
  cardDescription: {
    fontSize: 14,
    color: "#4A5568",
    lineHeight: 20,
    marginBottom: 12,
  },
  cardFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  memberCount: { flexDirection: "row", alignItems: "center", gap: 4 },
  memberCountText: { fontSize: 13, color: "#718096" },
  memberBadge: {
    backgroundColor: "#C6F6D5",
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 20,
  },
  memberBadgeText: { fontSize: 12, color: "#276749", fontWeight: "700" },
  pendingBadge: {
    backgroundColor: "#FEFCBF",
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 20,
  },
  pendingBadgeText: { fontSize: 12, color: "#744210", fontWeight: "600" },
  joinBadge: {
    backgroundColor: "#EBF4FF",
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#2B6CB0",
  },
  joinBadgeText: { fontSize: 12, color: "#2B6CB0", fontWeight: "600" },

  empty: { alignItems: "center", paddingVertical: 60 },
  emptyIcon: { fontSize: 56, marginBottom: 16 },
  emptyTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: "#2D3748",
    marginBottom: 8,
  },
  emptyText: {
    fontSize: 15,
    color: "#718096",
    textAlign: "center",
    paddingHorizontal: 32,
  },

  fab: {
    position: "absolute",
    bottom: 24,
    right: 20,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: "#2B6CB0",
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 6,
  },
});
