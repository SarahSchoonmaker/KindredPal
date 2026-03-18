import React, { useState, useCallback } from "react";
import {
  View, ScrollView, TouchableOpacity, StyleSheet,
  RefreshControl, TextInput, Image, FlatList,
} from "react-native";
import { Text, ActivityIndicator } from "react-native-paper";
import { Users, Search, Plus, Lock, Globe, SlidersHorizontal } from "lucide-react-native";
import { useFocusEffect } from "@react-navigation/native";
import api from "../services/api";

const CATEGORIES = [
  "All",
  "Sports & Fitness",
  "Faith & Spirituality",
  "Parents",
  "Hobbies & Interests",
  "Volunteers & Causes",
  "Support & Wellness",
  "Professional & Networking",
  "Arts, Culture & Book Clubs",
  "Outdoor & Adventure",
  "Food & Dining",
  "Learning & Education",
  "Neighborhood & Local",
  "New to the Area",
  "Business Owners & Entrepreneurs",
  "Sober & Clean Living",
  "Single Parents",
  "Aging Gracefully",
  "Life Transitions",
  "Single & Childfree",
  "Caregiver Support",
  "Social Outings",
];

const CATEGORY_ICONS = {
  "All": "✨",
  "Sports & Fitness": "🏃",
  "Faith & Spirituality": "🙏",
  "Parents": "👩‍👧",
  "Hobbies & Interests": "🎯",
  "Volunteers & Causes": "🤝",
  "Support & Wellness": "🌿",
  "Professional & Networking": "💼",
  "Arts, Culture & Book Clubs": "🎨",
  "Outdoor & Adventure": "🏕️",
  "Food & Dining": "🍽️",
  "Learning & Education": "🎓",
  "Neighborhood & Local": "🏘️",
  "New to the Area": "📍",
  "Business Owners & Entrepreneurs": "🚀",
  "Sober & Clean Living": "🌿",
  "Single Parents": "👨‍👧‍👦",
  "Aging Gracefully": "🌻",
  "Life Transitions": "🔄",
  "Single & Childfree": "🌟",
  "Caregiver Support": "🤲",
  "Social Outings": "🎉",
  "Social Outings": "🥂",
};

function GroupCard({ group, onPress }) {
  const icon = CATEGORY_ICONS[group.category] || "✨";
  return (
    <TouchableOpacity style={styles.card} onPress={() => onPress(group._id)} activeOpacity={0.7}>
      <View style={styles.cardHeader}>
        <View style={styles.cardIcon}>
          <Text style={styles.cardIconText}>{icon}</Text>
        </View>
        <View style={styles.cardInfo}>
          <View style={styles.cardTitleRow}>
            <Text style={styles.cardName} numberOfLines={1}>{group.name}</Text>
            {group.isPrivate
              ? <Lock size={13} color="#a0aec0" />
              : <Globe size={13} color="#68d391" />
            }
          </View>
          <Text style={styles.cardCategory} numberOfLines={1}>{group.category}</Text>
          <Text style={styles.cardLocation} numberOfLines={1}>
            {group.isNationwide ? "🌍 Nationwide" : `📍 ${group.city}, ${group.state}`}
          </Text>
        </View>
      </View>

      <Text style={styles.cardDescription} numberOfLines={2}>{group.description}</Text>

      <View style={styles.cardFooter}>
        <View style={styles.memberCount}>
          <Users size={13} color="#718096" />
          <Text style={styles.memberCountText}>{group.memberCount || 0} members</Text>
        </View>
        {group.isMember ? (
          <View style={[styles.badge, styles.badgeJoined]}>
            <Text style={[styles.badgeText, { color: "#276749" }]}>✓ Joined</Text>
          </View>
        ) : group.isPending ? (
          <View style={[styles.badge, styles.badgePending]}>
            <Text style={[styles.badgeText, { color: "#744210" }]}>Pending</Text>
          </View>
        ) : (
          <View style={[styles.badge, styles.badgeJoin]}>
            <Text style={[styles.badgeText, { color: "#2B6CB0" }]}>
              {group.isPrivate ? "Request" : "Join"}
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
  const [activeTab, setActiveTab] = useState("discover");

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
    }, [fetchGroups])
  );

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    fetchGroups();
  }, [fetchGroups]);

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

      {/* Search */}
      <View style={styles.searchRow}>
        <View style={styles.searchContainer}>
          <Search size={16} color="#a0aec0" />
          <TextInput
            style={styles.searchInput}
            placeholder="Search groups..."
            value={search}
            onChangeText={setSearch}
            onSubmitEditing={fetchGroups}
            returnKeyType="search"
            placeholderTextColor="#a0aec0"
          />
        </View>
        <TouchableOpacity
          style={styles.createBtn}
          onPress={() => navigation.navigate("CreateGroup")}
        >
          <Plus size={20} color="white" />
        </TouchableOpacity>
      </View>

      {/* Tabs */}
      <View style={styles.tabs}>
        {["discover", "my"].map(tab => (
          <TouchableOpacity
            key={tab}
            style={[styles.tab, activeTab === tab && styles.tabActive]}
            onPress={() => setActiveTab(tab)}
          >
            <Text style={[styles.tabText, activeTab === tab && styles.tabTextActive]}>
              {tab === "discover" ? "Discover" : `My Groups${myGroups.length > 0 ? ` (${myGroups.length})` : ""}`}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Group list with category filter as header */}
      <FlatList
        data={displayedGroups}
        keyExtractor={item => item._id}
        renderItem={({ item }) => (
          <GroupCard group={item} onPress={id => navigation.navigate("GroupDetail", { groupId: id })} />
        )}
        contentContainerStyle={styles.listContent}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
        ListHeaderComponent={activeTab === "discover" ? (
          <View style={styles.categoryGrid}>
            {CATEGORIES.map(cat => (
              <TouchableOpacity
                key={cat}
                style={[styles.catTile, selectedCategory === cat && styles.catTileActive]}
                onPress={() => setSelectedCategory(cat)}
                activeOpacity={0.7}
              >
                <Text style={styles.catTileEmoji}>{CATEGORY_ICONS[cat]}</Text>
                <Text
                  style={[styles.catTileText, selectedCategory === cat && styles.catTileTextActive]}
                  numberOfLines={2}
                >
                  {cat === "All" ? "All Groups" : cat}
                </Text>
                {selectedCategory === cat && (
                  <View style={styles.catTileCheck}>
                    <Text style={{ color: "white", fontSize: 10, fontWeight: "700" }}>✓</Text>
                  </View>
                )}
              </TouchableOpacity>
            ))}
            <View style={styles.catSpacer} />
          </View>
        ) : null}
        ListEmptyComponent={() => (
          <View style={styles.empty}>
            <Text style={styles.emptyIcon}>👥</Text>
            <Text style={styles.emptyTitle}>
              {activeTab === "my" ? "No Groups Yet" : "No Groups Found"}
            </Text>
            <Text style={styles.emptyText}>
              {activeTab === "my"
                ? "Join a group from Discover!"
                : "Try a different search or category"}
            </Text>
          </View>
        )}
        ListFooterComponent={<View style={{ height: 80 }} />}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F7FAFC" },
  center: { flex: 1, justifyContent: "center", alignItems: "center" },
  loadingText: { marginTop: 12, fontSize: 15, color: "#718096" },

  searchRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
    paddingVertical: 10,
    gap: 8,
    backgroundColor: "white",
    borderBottomWidth: 1,
    borderBottomColor: "#E2E8F0",
  },
  searchContainer: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F7FAFC",
    borderRadius: 10,
    paddingHorizontal: 10,
    gap: 6,
    borderWidth: 1,
    borderColor: "#E2E8F0",
    height: 40,
  },
  searchInput: { flex: 1, fontSize: 14, color: "#2D3748" },
  createBtn: {
    width: 40, height: 40,
    borderRadius: 10,
    backgroundColor: "#2B6CB0",
    justifyContent: "center",
    alignItems: "center",
  },

  tabs: {
    flexDirection: "row",
    backgroundColor: "white",
    borderBottomWidth: 1,
    borderBottomColor: "#E2E8F0",
  },
  tab: {
    flex: 1, paddingVertical: 10, alignItems: "center",
    borderBottomWidth: 2, borderBottomColor: "transparent",
  },
  tabActive: { borderBottomColor: "#2B6CB0" },
  tabText: { fontSize: 13, fontWeight: "600", color: "#718096" },
  tabTextActive: { color: "#2B6CB0" },

  categoryGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    padding: 10,
    gap: 10,
    backgroundColor: "#F7FAFC",
  },
  catTile: {
    width: "30%",
    flexGrow: 1,
    minWidth: 100,
    backgroundColor: "white",
    borderRadius: 14,
    padding: 14,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1.5,
    borderColor: "#E2E8F0",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 3,
    elevation: 1,
    position: "relative",
    minHeight: 90,
  },
  catTileActive: {
    backgroundColor: "#EBF4FF",
    borderColor: "#2B6CB0",
  },
  catTileEmoji: { fontSize: 28, marginBottom: 6 },
  catTileText: {
    fontSize: 11,
    fontWeight: "600",
    color: "#4A5568",
    textAlign: "center",
    lineHeight: 14,
  },
  catTileTextActive: { color: "#2B6CB0" },
  catTileCheck: {
    position: "absolute",
    top: 6,
    right: 6,
    width: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: "#2B6CB0",
    alignItems: "center",
    justifyContent: "center",
  },
  catSpacer: { width: "30%", flexGrow: 1, minWidth: 100 },

  listContent: { padding: 12 },

  card: {
    backgroundColor: "white",
    borderRadius: 12,
    padding: 14,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: "#E2E8F0",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 3,
    elevation: 2,
  },
  cardHeader: { flexDirection: "row", alignItems: "flex-start", marginBottom: 8 },
  cardIcon: {
    width: 44, height: 44, borderRadius: 10,
    backgroundColor: "#EBF4FF",
    justifyContent: "center", alignItems: "center",
    marginRight: 10, flexShrink: 0,
  },
  cardIconText: { fontSize: 20 },
  cardInfo: { flex: 1 },
  cardTitleRow: { flexDirection: "row", alignItems: "center", gap: 5, marginBottom: 2 },
  cardName: { fontSize: 15, fontWeight: "700", color: "#2D3748", flex: 1 },
  cardCategory: { fontSize: 11, color: "#2B6CB0", fontWeight: "600", marginBottom: 1 },
  cardLocation: { fontSize: 11, color: "#718096" },
  cardDescription: { fontSize: 13, color: "#4A5568", lineHeight: 18, marginBottom: 10 },
  cardFooter: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  memberCount: { flexDirection: "row", alignItems: "center", gap: 4 },
  memberCountText: { fontSize: 12, color: "#718096" },
  badge: { paddingHorizontal: 10, paddingVertical: 3, borderRadius: 12 },
  badgeJoined: { backgroundColor: "#C6F6D5" },
  badgePending: { backgroundColor: "#FEFCBF" },
  badgeJoin: { backgroundColor: "#EBF4FF", borderWidth: 1, borderColor: "#2B6CB0" },
  badgeText: { fontSize: 11, fontWeight: "700" },

  empty: { alignItems: "center", paddingVertical: 60 },
  emptyIcon: { fontSize: 48, marginBottom: 12 },
  emptyTitle: { fontSize: 18, fontWeight: "700", color: "#2D3748", marginBottom: 6 },
  emptyText: { fontSize: 14, color: "#718096", textAlign: "center", paddingHorizontal: 32 },
});