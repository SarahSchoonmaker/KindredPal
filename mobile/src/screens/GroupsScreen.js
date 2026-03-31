import React, { useState, useCallback, useEffect, useRef } from "react";
import {
  View,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  RefreshControl,
  TextInput,
  FlatList,
  Modal,
  Alert,
} from "react-native";
import { Text, ActivityIndicator } from "react-native-paper";
import {
  Users,
  Search,
  Plus,
  Lock,
  Globe,
  SlidersHorizontal,
  X,
} from "lucide-react-native";
import { useFocusEffect } from "@react-navigation/native";
import api from "../services/api";

const US_STATES_F = [
  "AL",
  "AK",
  "AZ",
  "AR",
  "CA",
  "CO",
  "CT",
  "DE",
  "FL",
  "GA",
  "HI",
  "ID",
  "IL",
  "IN",
  "IA",
  "KS",
  "KY",
  "LA",
  "ME",
  "MD",
  "MA",
  "MI",
  "MN",
  "MS",
  "MO",
  "MT",
  "NE",
  "NV",
  "NH",
  "NJ",
  "NM",
  "NY",
  "NC",
  "ND",
  "OH",
  "OK",
  "OR",
  "PA",
  "RI",
  "SC",
  "SD",
  "TN",
  "TX",
  "UT",
  "VT",
  "VA",
  "WA",
  "WV",
  "WI",
  "WY",
  "DC",
];

const DISTANCE_OPTS = [
  { label: "Same city", value: "city" },
  { label: "25 miles", value: "25" },
  { label: "50 miles", value: "50" },
  { label: "100 miles", value: "100" },
  { label: "Statewide", value: "state" },
  { label: "Anywhere", value: "anywhere" },
];

const RELIGION_OPTS = [
  "None",
  "Spiritual but not religious",
  "Christian (Catholic)",
  "Christian (Protestant)",
  "Christian (Evangelical)",
  "Christian (Orthodox)",
  "Jewish",
  "Muslim",
  "Hindu",
  "Buddhist",
  "Mormon / LDS",
  "Other",
];

const LIFE_STAGE_OPTS = [
  "Single",
  "In a relationship",
  "Married",
  "Divorced",
  "Widowed",
  "Empty nester",
  "Retired",
  "Caregiver",
  "Aging Alone",
  "New Career",
  "New to Town",
];

const CATEGORIES = [
  "All",
  "Caregiver Support",
  "Grief & Loss",
  "Sober & Clean Living",
  "New Parent Support",
  "Chronic Illness Support",
  "Anxiety & Mental Wellness",
  "Veteran Support",
  "Senior Wellness",
  "Loneliness & Social Connection",
  "Divorce Recovery",
  "Faith & Spiritual Support",
  "Life Transitions",
  "Trauma Recovery",
  "Cancer Support",
  "Single Parent Support",
  "Addiction Recovery",
  "Autism & Special Needs Families",
  "Singles Social Support",
  "Married No Kids",
  "Career Change Support",
  "Financial Recovery",
  "Sports & Fitness",
  "Local Activity Groups",
];

const CATEGORY_ICONS = {
  All: "✨",
  "Caregiver Support": "🤲",
  "Grief & Loss": "🌿",
  "Sober & Clean Living": "🍃",
  "New Parent Support": "👶",
  "Chronic Illness Support": "🎗️",
  "Anxiety & Mental Wellness": "🧘",
  "Veteran Support": "🎖️",
  "Senior Wellness": "🌻",
  "Loneliness & Social Connection": "💙",
  "Divorce Recovery": "🌱",
  "Faith & Spiritual Support": "🙏",
  "Life Transitions": "🔄",
  "Trauma Recovery": "🕊️",
  "Cancer Support": "💛",
  "Single Parent Support": "👨‍👧",
  "Addiction Recovery": "⭐",
  "Autism & Special Needs Families": "🦋",
  "Singles Social Support": "🌟",
  "Married No Kids": "💑",
  "Career Change Support": "💼",
  "Financial Recovery": "💰",
  "Sports & Fitness": "🏃",
  "Local Activity Groups": "🎯",
};

function GroupCard({ group, onPress }) {
  const icon = CATEGORY_ICONS[group.category] || "✨";
  return (
    <TouchableOpacity
      style={styles.card}
      onPress={() => onPress(group._id)}
      activeOpacity={0.7}
    >
      <View style={styles.cardHeader}>
        <View style={styles.cardIcon}>
          <Text style={styles.cardIconText}>{icon}</Text>
        </View>
        <View style={styles.cardInfo}>
          <View style={styles.cardTitleRow}>
            <Text style={styles.cardName} numberOfLines={1}>
              {group.name}
            </Text>
            {group.isPrivate ? (
              <Lock size={13} color="#a0aec0" />
            ) : (
              <Globe size={13} color="#68d391" />
            )}
          </View>
          <Text style={styles.cardCategory} numberOfLines={1}>
            {group.category}
          </Text>
          <Text style={styles.cardLocation} numberOfLines={1}>
            {group.isNationwide
              ? "🌍 Nationwide"
              : `📍 ${group.city}, ${group.state}`}
          </Text>
        </View>
      </View>
      <Text style={styles.cardDescription} numberOfLines={2}>
        {group.description}
      </Text>
      <View style={styles.cardFooter}>
        <View style={styles.memberCount}>
          <Users size={13} color="#718096" />
          <Text style={styles.memberCountText}>
            {(group.members?.length ?? group.memberCount) || 0} members
          </Text>
        </View>
        {group.isMember ? (
          <View style={[styles.badge, styles.badgeJoined]}>
            <Text style={[styles.badgeText, { color: "#276749" }]}>
              ✓ Joined
            </Text>
          </View>
        ) : group.isPending ? (
          <View style={[styles.badge, styles.badgePending]}>
            <Text style={[styles.badgeText, { color: "#744210" }]}>
              Pending
            </Text>
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
  const [invitedGroups, setInvitedGroups] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [activeTab, setActiveTab] = useState("discover");
  const [showFilters, setShowFilters] = useState(false);
  const [showStateList, setShowStateList] = useState(false);
  const [showDistanceList, setShowDistanceList] = useState(false);

  const filtersRef = useRef({
    search: "",
    category: "All",
    city: "",
    state: "",
    distance: "",
    religion: [],
    lifeStage: [],
  });
  const [filterUI, setFilterUI] = useState({ ...filtersRef.current });
  const [pendingFilters, setPendingFilters] = useState({
    city: "",
    state: "",
    distance: "",
    religion: [],
    lifeStage: [],
  });

  const setFilter = useCallback((key, value) => {
    filtersRef.current[key] = value;
    setFilterUI((prev) => ({ ...prev, [key]: value }));
  }, []);

  // Stable fetchGroups — reads from ref, never recreated
  const fetchGroups = useCallback(async (showLoader = false) => {
    if (showLoader) setLoading(true);
    try {
      const f = filtersRef.current;
      const params = {};
      if (f.category !== "All") params.category = f.category;
      if (f.search) params.search = f.search;
      if (f.city) params.city = f.city;
      if (f.state) params.state = f.state;
      if (f.distance) params.distance = f.distance;
      if (f.religion?.length) params.religion = f.religion;
      if (f.lifeStage?.length) params.lifeStage = f.lifeStage;

      const [discoverRes, myRes, invitesRes] = await Promise.all([
        api.get("/groups", { params: { ...params, limit: 100 } }),
        api.get("/groups/my"),
        api.get("/groups/my-invites").catch(() => ({ data: { groups: [] } })),
      ]);

      setGroups(discoverRes.data.groups || []);
      setMyGroups(myRes.data.groups || []);
      setInvitedGroups(invitesRes.data.groups || []);
    } catch (err) {
      console.error("Error fetching groups:", err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    fetchGroups(true);
  }, [fetchGroups]);

  // Fires on every screen focus — catches returns from Create/Delete/Edit
  useFocusEffect(
    useCallback(() => {
      fetchGroups();
    }, [fetchGroups]),
  );

  // Search debounce — stable because fetchGroups never changes
  const debounceRef = useRef(null);
  const handleSearchChange = (text) => {
    setFilter("search", text);
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => fetchGroups(), 500);
  };

  const handleClearSearch = () => {
    setFilter("search", "");
    fetchGroups();
  };
  const handleCategorySelect = (cat) => {
    setFilter("category", cat);
    fetchGroups();
  };
  const handleClearLocation = () => {
    setFilter("city", "");
    setFilter("state", "");
    setFilter("distance", "");
    fetchGroups();
  };
  const handleApplyFilters = () => {
    Object.entries(pendingFilters).forEach(([k, v]) => setFilter(k, v));
    setShowFilters(false);
    fetchGroups();
  };
  const handleClearFilters = () => {
    const empty = {
      city: "",
      state: "",
      distance: "",
      religion: [],
      lifeStage: [],
    };
    setPendingFilters(empty);
    Object.entries(empty).forEach(([k, v]) => setFilter(k, v));
  };
  const onRefresh = useCallback(() => {
    setRefreshing(true);
    fetchGroups();
  }, [fetchGroups]);

  const hasActiveFilters =
    filterUI.city ||
    filterUI.state ||
    filterUI.distance ||
    filterUI.religion?.length ||
    filterUI.lifeStage?.length;

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
      {/* Location bar */}
      <View style={styles.locationBar}>
        <View style={styles.locationBarTop}>
          <Text style={styles.locationBarLabel}>📍 Search by location</Text>
          {(filterUI.city || filterUI.state || filterUI.distance) && (
            <TouchableOpacity onPress={handleClearLocation}>
              <Text style={styles.locationClearBtn}>Clear</Text>
            </TouchableOpacity>
          )}
        </View>
        <View style={styles.locationFields}>
          <TextInput
            style={styles.locationCityInput}
            placeholder="City"
            placeholderTextColor="#a0aec0"
            value={filterUI.city}
            onChangeText={(v) => setFilter("city", v)}
            returnKeyType="done"
            onSubmitEditing={() => fetchGroups()}
          />
          <TouchableOpacity
            style={styles.locationStateBtn}
            onPress={() => {
              setShowStateList(true);
              setShowDistanceList(false);
            }}
          >
            <Text
              style={[
                styles.locationBtnText,
                !filterUI.state && { color: "#a0aec0" },
              ]}
            >
              {filterUI.state || "State"}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.locationDistanceBtn}
            onPress={() => {
              setShowDistanceList(true);
              setShowStateList(false);
            }}
          >
            <Text
              style={[
                styles.locationBtnText,
                !filterUI.distance && { color: "#a0aec0" },
              ]}
            >
              {filterUI.distance
                ? DISTANCE_OPTS.find((d) => d.value === filterUI.distance)
                    ?.label
                : "Distance"}
            </Text>
          </TouchableOpacity>
        </View>

        {showStateList && (
          <Modal
            transparent
            animationType="fade"
            onRequestClose={() => setShowStateList(false)}
          >
            <TouchableOpacity
              style={styles.pickerOverlay}
              activeOpacity={1}
              onPress={() => setShowStateList(false)}
            >
              <View style={styles.pickerDropdown}>
                <ScrollView style={{ maxHeight: 300 }}>
                  <TouchableOpacity
                    style={styles.pickerItem}
                    onPress={() => {
                      setFilter("state", "");
                      setShowStateList(false);
                      fetchGroups();
                    }}
                  >
                    <Text style={styles.pickerItemText}>Any state</Text>
                  </TouchableOpacity>
                  {US_STATES_F.map((s) => (
                    <TouchableOpacity
                      key={s}
                      style={[
                        styles.pickerItem,
                        filterUI.state === s && styles.pickerItemActive,
                      ]}
                      onPress={() => {
                        setFilter("state", s);
                        setShowStateList(false);
                        fetchGroups();
                      }}
                    >
                      <Text
                        style={[
                          styles.pickerItemText,
                          filterUI.state === s && styles.pickerItemTextActive,
                        ]}
                      >
                        {s}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </ScrollView>
              </View>
            </TouchableOpacity>
          </Modal>
        )}

        {showDistanceList && (
          <Modal
            transparent
            animationType="fade"
            onRequestClose={() => setShowDistanceList(false)}
          >
            <TouchableOpacity
              style={styles.pickerOverlay}
              activeOpacity={1}
              onPress={() => setShowDistanceList(false)}
            >
              <View style={styles.pickerDropdown}>
                <ScrollView>
                  <TouchableOpacity
                    style={styles.pickerItem}
                    onPress={() => {
                      setFilter("distance", "");
                      setShowDistanceList(false);
                      fetchGroups();
                    }}
                  >
                    <Text style={styles.pickerItemText}>Any distance</Text>
                  </TouchableOpacity>
                  {DISTANCE_OPTS.map((opt) => (
                    <TouchableOpacity
                      key={opt.value}
                      style={[
                        styles.pickerItem,
                        filterUI.distance === opt.value &&
                          styles.pickerItemActive,
                      ]}
                      onPress={() => {
                        setFilter("distance", opt.value);
                        setShowDistanceList(false);
                        fetchGroups();
                      }}
                    >
                      <Text
                        style={[
                          styles.pickerItemText,
                          filterUI.distance === opt.value &&
                            styles.pickerItemTextActive,
                        ]}
                      >
                        {opt.label}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </ScrollView>
              </View>
            </TouchableOpacity>
          </Modal>
        )}
      </View>

      {/* Search row */}
      <View style={styles.searchRow}>
        <View style={styles.searchContainer}>
          <Search size={16} color="#a0aec0" />
          <TextInput
            style={styles.searchInput}
            placeholder="Search groups..."
            value={filterUI.search}
            onChangeText={handleSearchChange}
            onSubmitEditing={() => fetchGroups()}
            returnKeyType="search"
            placeholderTextColor="#a0aec0"
          />
          {filterUI.search.length > 0 && (
            <TouchableOpacity onPress={handleClearSearch}>
              <X size={15} color="#a0aec0" />
            </TouchableOpacity>
          )}
        </View>
        <TouchableOpacity
          style={[styles.filterBtn, hasActiveFilters && styles.filterBtnActive]}
          onPress={() => {
            setPendingFilters({
              city: filterUI.city,
              state: filterUI.state,
              distance: filterUI.distance,
              religion: filterUI.religion || [],
              lifeStage: filterUI.lifeStage || [],
            });
            setShowFilters(true);
          }}
        >
          <SlidersHorizontal
            size={18}
            color={hasActiveFilters ? "white" : "#4a5568"}
          />
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.createBtn}
          onPress={() => navigation.navigate("CreateGroup")}
        >
          <Plus size={20} color="white" />
        </TouchableOpacity>
      </View>

      {/* Tabs */}
      <View style={styles.tabs}>
        {["discover", "my"].map((tab) => (
          <TouchableOpacity
            key={tab}
            style={[styles.tab, activeTab === tab && styles.tabActive]}
            onPress={() => setActiveTab(tab)}
          >
            <Text
              style={[
                styles.tabText,
                activeTab === tab && styles.tabTextActive,
              ]}
            >
              {tab === "discover"
                ? "Discover"
                : `My Groups${myGroups.length > 0 ? ` (${myGroups.length})` : ""}`}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Invite banner */}
      {invitedGroups.length > 0 && (
        <View style={styles.inviteBanner}>
          <View style={styles.inviteBannerHeader}>
            <View style={styles.inviteBadge}>
              <Text style={styles.inviteBadgeText}>{invitedGroups.length}</Text>
            </View>
            <Text style={styles.inviteBannerTitle}>
              Group Invitation{invitedGroups.length > 1 ? "s" : ""}
            </Text>
          </View>
          {invitedGroups.map((g) => (
            <View key={g._id} style={styles.inviteCard}>
              <View style={styles.inviteCardInfo}>
                <Text style={styles.inviteCardIcon}>
                  {CATEGORY_ICONS[g.category] || "👥"}
                </Text>
                <View style={{ flex: 1 }}>
                  <Text style={styles.inviteCardName} numberOfLines={1}>
                    {g.name}
                  </Text>
                  <Text style={styles.inviteCardMeta}>
                    Invited by {g.createdBy?.name || "Group Admin"}
                  </Text>
                </View>
              </View>
              <View style={styles.inviteCardActions}>
                <TouchableOpacity
                  style={styles.btnAccept}
                  onPress={async () => {
                    try {
                      await api.post(`/groups/${g._id}/rsvp-invite`, {
                        response: "accept",
                      });
                      setInvitedGroups((prev) =>
                        prev.filter((x) => x._id !== g._id),
                      );
                      fetchGroups();
                    } catch (err) {
                      Alert.alert(
                        "Error",
                        err.response?.data?.message ||
                          "Could not accept invite",
                      );
                    }
                  }}
                >
                  <Text style={styles.btnAcceptText}>✓ Accept</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.btnMaybe}
                  onPress={async () => {
                    try {
                      await api.post(`/groups/${g._id}/rsvp-invite`, {
                        response: "maybe",
                      });
                      setInvitedGroups((prev) =>
                        prev.filter((x) => x._id !== g._id),
                      );
                    } catch {}
                  }}
                >
                  <Text style={styles.btnMaybeText}>~ Maybe</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.btnDecline}
                  onPress={async () => {
                    try {
                      await api.post(`/groups/${g._id}/rsvp-invite`, {
                        response: "decline",
                      });
                      setInvitedGroups((prev) =>
                        prev.filter((x) => x._id !== g._id),
                      );
                    } catch {}
                  }}
                >
                  <Text style={styles.btnDeclineText}>✕ Can't</Text>
                </TouchableOpacity>
              </View>
            </View>
          ))}
        </View>
      )}

      {/* Group list */}
      <FlatList
        data={displayedGroups}
        keyExtractor={(item) => item._id}
        renderItem={({ item }) => (
          <GroupCard
            group={item}
            onPress={(id) =>
              navigation.navigate("GroupDetail", {
                groupId: id,
                // FIX: Pass a callback so GroupDetailScreen can optimistically
                // remove the deleted group without waiting for useFocusEffect.
                onDelete: (deletedId) => {
                  setGroups((prev) => prev.filter((g) => g._id !== deletedId));
                  setMyGroups((prev) =>
                    prev.filter((g) => g._id !== deletedId),
                  );
                },
              })
            }
          />
        )}
        contentContainerStyle={styles.listContent}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        ListHeaderComponent={
          activeTab === "discover" ? (
            <View style={styles.categoryGrid}>
              {CATEGORIES.map((cat) => (
                <TouchableOpacity
                  key={cat}
                  style={[
                    styles.catTile,
                    filterUI.category === cat && styles.catTileActive,
                  ]}
                  onPress={() => handleCategorySelect(cat)}
                  activeOpacity={0.7}
                >
                  <Text style={styles.catTileEmoji}>{CATEGORY_ICONS[cat]}</Text>
                  <Text
                    style={[
                      styles.catTileText,
                      filterUI.category === cat && styles.catTileTextActive,
                    ]}
                    numberOfLines={2}
                  >
                    {cat === "All" ? "All Groups" : cat}
                  </Text>
                  {filterUI.category === cat && (
                    <View style={styles.catTileCheck}>
                      <Text
                        style={{
                          color: "white",
                          fontSize: 10,
                          fontWeight: "700",
                        }}
                      >
                        ✓
                      </Text>
                    </View>
                  )}
                </TouchableOpacity>
              ))}
              <View style={styles.catSpacer} />
            </View>
          ) : null
        }
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

      {/* Filter Modal */}
      <Modal
        visible={showFilters}
        animationType="slide"
        presentationStyle="pageSheet"
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Filter Groups</Text>
            <TouchableOpacity onPress={() => setShowFilters(false)}>
              <X size={22} color="#4a5568" />
            </TouchableOpacity>
          </View>
          <ScrollView
            style={styles.modalScroll}
            showsVerticalScrollIndicator={false}
          >
            <View style={styles.filterSection}>
              <Text style={styles.filterSectionTitle}>📍 Location</Text>
              <View style={styles.locationRow}>
                <TextInput
                  style={[styles.filterInput, { flex: 1 }]}
                  placeholder="City"
                  value={pendingFilters.city}
                  onChangeText={(v) =>
                    setPendingFilters((f) => ({ ...f, city: v }))
                  }
                  placeholderTextColor="#a0aec0"
                />
                <ScrollView
                  horizontal
                  showsHorizontalScrollIndicator={false}
                  style={styles.stateScroll}
                >
                  {US_STATES_F.map((s) => (
                    <TouchableOpacity
                      key={s}
                      style={[
                        styles.stateChip,
                        pendingFilters.state === s && styles.stateChipActive,
                      ]}
                      onPress={() =>
                        setPendingFilters((f) => ({
                          ...f,
                          state: f.state === s ? "" : s,
                        }))
                      }
                    >
                      <Text
                        style={[
                          styles.stateChipText,
                          pendingFilters.state === s &&
                            styles.stateChipTextActive,
                        ]}
                      >
                        {s}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </ScrollView>
              </View>
            </View>
            <View style={styles.filterSection}>
              <Text style={styles.filterSectionTitle}>📏 Distance / Range</Text>
              <View style={styles.chipRow}>
                {DISTANCE_OPTS.map((opt) => (
                  <TouchableOpacity
                    key={opt.value}
                    style={[
                      styles.filterChip,
                      pendingFilters.distance === opt.value &&
                        styles.filterChipActive,
                    ]}
                    onPress={() =>
                      setPendingFilters((f) => ({
                        ...f,
                        distance: f.distance === opt.value ? "" : opt.value,
                      }))
                    }
                  >
                    <Text
                      style={[
                        styles.filterChipText,
                        pendingFilters.distance === opt.value &&
                          styles.filterChipTextActive,
                      ]}
                    >
                      {opt.label}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
            <View style={styles.filterSection}>
              <Text style={styles.filterSectionTitle}>🙏 Faith / Religion</Text>
              <View style={styles.chipRow}>
                {RELIGION_OPTS.map((r) => (
                  <TouchableOpacity
                    key={r}
                    style={[
                      styles.filterChip,
                      (pendingFilters.religion || []).includes(r) &&
                        styles.filterChipActive,
                    ]}
                    onPress={() => {
                      const cur = pendingFilters.religion || [];
                      setPendingFilters((f) => ({
                        ...f,
                        religion: cur.includes(r)
                          ? cur.filter((v) => v !== r)
                          : [...cur, r],
                      }));
                    }}
                  >
                    <Text
                      style={[
                        styles.filterChipText,
                        (pendingFilters.religion || []).includes(r) &&
                          styles.filterChipTextActive,
                      ]}
                    >
                      {r}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
            <View style={styles.filterSection}>
              <Text style={styles.filterSectionTitle}>🌱 Life Stage</Text>
              <View style={styles.chipRow}>
                {LIFE_STAGE_OPTS.map((l) => (
                  <TouchableOpacity
                    key={l}
                    style={[
                      styles.filterChip,
                      (pendingFilters.lifeStage || []).includes(l) &&
                        styles.filterChipActive,
                    ]}
                    onPress={() => {
                      const cur = pendingFilters.lifeStage || [];
                      setPendingFilters((f) => ({
                        ...f,
                        lifeStage: cur.includes(l)
                          ? cur.filter((v) => v !== l)
                          : [...cur, l],
                      }));
                    }}
                  >
                    <Text
                      style={[
                        styles.filterChipText,
                        (pendingFilters.lifeStage || []).includes(l) &&
                          styles.filterChipTextActive,
                      ]}
                    >
                      {l}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
            <View style={{ height: 20 }} />
          </ScrollView>
          <View style={styles.modalFooter}>
            <TouchableOpacity
              style={styles.btnClearFilters}
              onPress={handleClearFilters}
            >
              <Text style={styles.btnClearFiltersText}>Clear All</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.btnApplyFilters}
              onPress={handleApplyFilters}
            >
              <Text style={styles.btnApplyFiltersText}>Apply Filters</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
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
    width: 40,
    height: 40,
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
    flex: 1,
    paddingVertical: 10,
    alignItems: "center",
    borderBottomWidth: 2,
    borderBottomColor: "transparent",
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
  catTileActive: { backgroundColor: "#EBF4FF", borderColor: "#2B6CB0" },
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
  cardHeader: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: 8,
  },
  cardIcon: {
    width: 44,
    height: 44,
    borderRadius: 10,
    backgroundColor: "#EBF4FF",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 10,
    flexShrink: 0,
  },
  cardIconText: { fontSize: 20 },
  cardInfo: { flex: 1 },
  cardTitleRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    marginBottom: 2,
  },
  cardName: { fontSize: 15, fontWeight: "700", color: "#2D3748", flex: 1 },
  cardCategory: {
    fontSize: 11,
    color: "#2B6CB0",
    fontWeight: "600",
    marginBottom: 1,
  },
  cardLocation: { fontSize: 11, color: "#718096" },
  cardDescription: {
    fontSize: 13,
    color: "#4A5568",
    lineHeight: 18,
    marginBottom: 10,
  },
  cardFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  memberCount: { flexDirection: "row", alignItems: "center", gap: 4 },
  memberCountText: { fontSize: 12, color: "#718096" },
  badge: { paddingHorizontal: 10, paddingVertical: 3, borderRadius: 12 },
  badgeJoined: { backgroundColor: "#C6F6D5" },
  badgePending: { backgroundColor: "#FEFCBF" },
  badgeJoin: {
    backgroundColor: "#EBF4FF",
    borderWidth: 1,
    borderColor: "#2B6CB0",
  },
  badgeText: { fontSize: 11, fontWeight: "700" },
  locationBar: {
    backgroundColor: "#EBF4FF",
    borderBottomWidth: 1,
    borderBottomColor: "#BEE3F8",
    padding: 12,
  },
  locationBarTop: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  locationBarLabel: {
    fontSize: 12,
    fontWeight: "700",
    color: "#1e4d8c",
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  locationClearBtn: { fontSize: 13, color: "#e53e3e", fontWeight: "600" },
  locationFields: { flexDirection: "row", gap: 8, alignItems: "center" },
  locationCityInput: {
    flex: 1,
    backgroundColor: "white",
    borderWidth: 1.5,
    borderColor: "#BEE3F8",
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    fontSize: 14,
    color: "#1e3a5f",
  },
  locationStateBtn: {
    backgroundColor: "white",
    borderWidth: 1.5,
    borderColor: "#BEE3F8",
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 9,
    minWidth: 58,
    alignItems: "center",
  },
  locationDistanceBtn: {
    backgroundColor: "white",
    borderWidth: 1.5,
    borderColor: "#BEE3F8",
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 9,
    minWidth: 80,
    alignItems: "center",
  },
  locationBtnText: { fontSize: 13, color: "#1e3a5f", fontWeight: "600" },
  pickerOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.4)",
    justifyContent: "center",
    alignItems: "center",
  },
  pickerDropdown: {
    backgroundColor: "white",
    borderRadius: 14,
    width: 260,
    maxHeight: 340,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.15,
    shadowRadius: 16,
    elevation: 10,
  },
  pickerItem: {
    paddingVertical: 13,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f4f8",
  },
  pickerItemActive: { backgroundColor: "#EBF4FF" },
  pickerItemText: { fontSize: 15, color: "#2d3748" },
  pickerItemTextActive: { color: "#2B6CB0", fontWeight: "700" },
  inviteBanner: {
    backgroundColor: "#fffbeb",
    borderWidth: 1.5,
    borderColor: "#f6ad55",
    borderRadius: 14,
    margin: 12,
    padding: 14,
  },
  inviteBannerHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 12,
  },
  inviteBadge: {
    backgroundColor: "#e53e3e",
    borderRadius: 11,
    width: 22,
    height: 22,
    alignItems: "center",
    justifyContent: "center",
  },
  inviteBadgeText: { color: "white", fontSize: 12, fontWeight: "700" },
  inviteBannerTitle: { fontSize: 15, fontWeight: "700", color: "#1a202c" },
  inviteCard: {
    backgroundColor: "white",
    borderRadius: 10,
    padding: 12,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: "#fbd38d",
  },
  inviteCardInfo: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    marginBottom: 10,
  },
  inviteCardIcon: { fontSize: 26 },
  inviteCardName: { fontSize: 14, fontWeight: "700", color: "#1a202c" },
  inviteCardMeta: { fontSize: 12, color: "#718096", marginTop: 2 },
  inviteCardActions: { flexDirection: "row", gap: 8 },
  btnAccept: {
    flex: 1,
    backgroundColor: "#2B6CB0",
    borderRadius: 8,
    paddingVertical: 9,
    alignItems: "center",
  },
  btnAcceptText: { color: "white", fontSize: 13, fontWeight: "700" },
  btnMaybe: {
    flex: 1,
    backgroundColor: "white",
    borderRadius: 8,
    paddingVertical: 9,
    alignItems: "center",
    borderWidth: 1.5,
    borderColor: "#f6ad55",
  },
  btnMaybeText: { color: "#d69e2e", fontSize: 13, fontWeight: "600" },
  btnDecline: {
    flex: 1,
    backgroundColor: "white",
    borderRadius: 8,
    paddingVertical: 9,
    alignItems: "center",
    borderWidth: 1.5,
    borderColor: "#e2e8f0",
  },
  btnDeclineText: { color: "#718096", fontSize: 13, fontWeight: "600" },
  empty: { alignItems: "center", paddingVertical: 60 },
  emptyIcon: { fontSize: 48, marginBottom: 12 },
  emptyTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#2D3748",
    marginBottom: 6,
  },
  emptyText: {
    fontSize: 14,
    color: "#718096",
    textAlign: "center",
    paddingHorizontal: 32,
  },
  filterBtn: {
    width: 40,
    height: 40,
    borderRadius: 10,
    backgroundColor: "#f7fafc",
    borderWidth: 1,
    borderColor: "#e2e8f0",
    justifyContent: "center",
    alignItems: "center",
  },
  filterBtnActive: { backgroundColor: "#2B6CB0", borderColor: "#2B6CB0" },
  modalContainer: { flex: 1, backgroundColor: "white" },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#e2e8f0",
  },
  modalTitle: { fontSize: 18, fontWeight: "700", color: "#1a202c" },
  modalScroll: { flex: 1, padding: 16 },
  filterSection: { marginBottom: 24 },
  filterSectionTitle: {
    fontSize: 14,
    fontWeight: "700",
    color: "#2d3748",
    marginBottom: 12,
  },
  locationRow: { gap: 10 },
  filterInput: {
    borderWidth: 1.5,
    borderColor: "#e2e8f0",
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 14,
    color: "#2d3748",
    backgroundColor: "#f8fafc",
    marginBottom: 8,
  },
  stateScroll: { flexGrow: 0 },
  stateChip: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 16,
    backgroundColor: "#f7fafc",
    borderWidth: 1,
    borderColor: "#e2e8f0",
    marginRight: 6,
  },
  stateChipActive: { backgroundColor: "#2B6CB0", borderColor: "#2B6CB0" },
  stateChipText: { fontSize: 12, fontWeight: "600", color: "#718096" },
  stateChipTextActive: { color: "white" },
  chipRow: { flexDirection: "row", flexWrap: "wrap", gap: 8 },
  filterChip: {
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 16,
    backgroundColor: "#f7fafc",
    borderWidth: 1.5,
    borderColor: "#e2e8f0",
  },
  filterChipActive: { backgroundColor: "#2B6CB0", borderColor: "#2B6CB0" },
  filterChipText: { fontSize: 13, fontWeight: "500", color: "#4a5568" },
  filterChipTextActive: { color: "white", fontWeight: "600" },
  modalFooter: {
    flexDirection: "row",
    gap: 12,
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: "#e2e8f0",
  },
  btnClearFilters: {
    flex: 1,
    paddingVertical: 13,
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: "#e2e8f0",
    alignItems: "center",
  },
  btnClearFiltersText: { fontSize: 15, fontWeight: "600", color: "#718096" },
  btnApplyFilters: {
    flex: 2,
    paddingVertical: 13,
    borderRadius: 12,
    backgroundColor: "#2B6CB0",
    alignItems: "center",
  },
  btnApplyFiltersText: { fontSize: 15, fontWeight: "700", color: "white" },
});
