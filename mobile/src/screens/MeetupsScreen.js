import React, { useState, useEffect, useCallback } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  RefreshControl,
  Alert,
} from "react-native";
import { FAB, Card, Avatar } from "react-native-paper";
import { Calendar, MapPin, Users, Clock } from "lucide-react-native";
import * as SecureStore from "expo-secure-store";
import { useFocusEffect } from "@react-navigation/native";
import api from "../services/api";
import CreateMeetupModal from "../components/CreateMeetupModal";

export default function MeetupsScreen({ navigation, route }) {
  const [meetups, setMeetups] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [groupInvites, setGroupInvites] = useState([]);
  const [myGroups, setMyGroups] = useState([]);

  const fetchMeetups = useCallback(async () => {
    try {
      const timeoutPromise = new Promise((_, reject) =>
        setTimeout(() => reject(new Error("Request timeout")), 10000),
      );
      const [response, invitesRes, myGroupsRes] = await Promise.all([
        Promise.race([api.get("/meetups"), timeoutPromise]),
        api.get("/groups/my-invites").catch(() => ({ data: { groups: [] } })),
        api.get("/groups/my").catch(() => ({ data: { groups: [] } })),
      ]);
      const data = response.data || [];
      setMeetups(data);
      setGroupInvites(invitesRes.data.groups || []);
      setMyGroups(myGroupsRes.data.groups || []);

      // ✅ Per-user scoped seen tracking — prevents cross-user bleed on shared devices
      const userId = await SecureStore.getItemAsync("userId");
      if (userId) {
        const seenKey = `seen_meetups_${userId}`;
        const seenIds = data.map((m) => m._id);
        await SecureStore.setItemAsync(seenKey, JSON.stringify(seenIds));
      }
    } catch (error) {
      Alert.alert("Error", "Failed to load meetups: " + error.message);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  // Load on mount
  useEffect(() => {
    fetchMeetups();
  }, [fetchMeetups]);

  // Refresh on re-focus (e.g. after delete) without wipe
  useFocusEffect(
    useCallback(() => {
      if (!loading) fetchMeetups();
    }, [fetchMeetups, loading]),
  );

  // Refresh when navigating back with refresh param (after delete)
  useEffect(() => {
    if (route?.params?.refresh) {
      fetchMeetups();
    }
  }, [route?.params?.refresh]);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      weekday: "short",
      month: "short",
      day: "numeric",
    });
  };

  const formatTime = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
    });
  };

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    fetchMeetups();
  }, [fetchMeetups]);

  const renderMeetup = ({ item }) => {
    const goingCount =
      item.rsvps?.filter((r) => r.status === "going").length || 0;
    return (
      <TouchableOpacity
        onPress={() =>
          navigation.navigate("MeetupDetails", { meetupId: item._id })
        }
      >
        <Card style={styles.card}>
          <Card.Content>
            <View style={styles.cardHeader}>
              <Text style={styles.title}>{item.title}</Text>
              <View style={styles.attendeeCount}>
                <Users color="#2B6CB0" size={16} />
                <Text style={styles.attendeeText}>{goingCount} going</Text>
              </View>
            </View>
            <View style={styles.details}>
              <View style={styles.detail}>
                <Calendar color="#2B6CB0" size={18} />
                <Text style={styles.detailText}>
                  {formatDate(item.dateTime)}
                </Text>
              </View>
              <View style={styles.detail}>
                <Clock color="#2B6CB0" size={18} />
                <Text style={styles.detailText}>
                  {formatTime(item.dateTime)}
                </Text>
              </View>
              {item.location && (
                <View style={styles.detail}>
                  <MapPin color="#2B6CB0" size={18} />
                  <Text style={styles.detailText}>
                    {item.location.city}, {item.location.state}
                  </Text>
                </View>
              )}
            </View>
            {item.description && (
              <Text style={styles.description} numberOfLines={2}>
                {item.description}
              </Text>
            )}
            <View style={styles.creator}>
              <Avatar.Image
                size={32}
                source={{ uri: item.creator?.profilePhoto }}
              />
              <Text style={styles.creatorText}>by {item.creator?.name}</Text>
            </View>
          </Card.Content>
        </Card>
      </TouchableOpacity>
    );
  };

  if (loading) {
    return (
      <View style={styles.centerContainer}>
        <Text>Loading meetups...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Group invite banner */}
      {groupInvites.length > 0 && (
        <View style={styles.inviteBanner}>
          <View style={styles.inviteBannerHeader}>
            <View style={styles.inviteBadge}>
              <Text style={styles.inviteBadgeText}>{groupInvites.length}</Text>
            </View>
            <Text style={styles.inviteBannerTitle}>
              Group Invitation{groupInvites.length > 1 ? "s" : ""}
            </Text>
          </View>
          {groupInvites.map((g) => (
            <View key={g._id} style={styles.inviteCard}>
              <View style={styles.inviteInfo}>
                <Text style={styles.inviteIcon}>👥</Text>
                <View style={{ flex: 1 }}>
                  <Text style={styles.inviteName} numberOfLines={1}>
                    {g.name}
                  </Text>
                  <Text style={styles.inviteMeta}>
                    Invited by {g.createdBy?.name || "Group Admin"}
                  </Text>
                </View>
              </View>
              <View style={styles.inviteActions}>
                <TouchableOpacity
                  style={styles.btnAccept}
                  onPress={async () => {
                    try {
                      await api.post(`/groups/${g._id}/rsvp-invite`, {
                        response: "accept",
                      });
                      setGroupInvites((prev) =>
                        prev.filter((x) => x._id !== g._id),
                      );
                    } catch (err) {
                      Alert.alert(
                        "Error",
                        err.response?.data?.message || "Could not accept",
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
                      setGroupInvites((prev) =>
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
                      setGroupInvites((prev) =>
                        prev.filter((x) => x._id !== g._id),
                      );
                    } catch {}
                  }}
                >
                  <Text style={styles.btnDeclineText}>✕ Can't Make It</Text>
                </TouchableOpacity>
              </View>
            </View>
          ))}
        </View>
      )}

      {/* My Groups section */}
      {myGroups.length > 0 && (
        <View style={styles.myGroupsSection}>
          <View style={styles.myGroupsHeader}>
            <Text style={styles.myGroupsTitle}>My Groups</Text>
            <TouchableOpacity
              onPress={() => navigation.navigate("Groups", { tab: "my" })}
            >
              <Text style={styles.viewAllBtn}>View all →</Text>
            </TouchableOpacity>
          </View>
          {myGroups.map((g) => (
            <TouchableOpacity
              key={g._id}
              style={styles.myGroupCard}
              onPress={() =>
                navigation.navigate("GroupDetail", { groupId: g._id })
              }
            >
              <Text style={styles.myGroupIcon}>
                {g.isPrivate ? "🔒" : "👥"}
              </Text>
              <View style={{ flex: 1 }}>
                <Text style={styles.myGroupName} numberOfLines={1}>
                  {g.name}
                </Text>
                <Text style={styles.myGroupMeta}>
                  {g.category}
                  {g.city ? ` · ${g.city}, ${g.state}` : ""}
                </Text>
              </View>
              <Text style={styles.myGroupArrow}>›</Text>
            </TouchableOpacity>
          ))}
        </View>
      )}

      {/* Meetups section */}
      <View style={styles.meetupsSectionHeader}>
        <Text style={styles.meetupsSectionTitle}>Meetups</Text>
      </View>

      {meetups.length === 0 ? (
        <View style={styles.emptyState}>
          <Calendar color="#CBD5E0" size={64} />
          <Text style={styles.emptyTitle}>No Meetups Yet</Text>
          <Text style={styles.emptyText}>
            Create a meetup to connect in person with your local community!
          </Text>
        </View>
      ) : (
        <FlatList
          data={meetups}
          renderItem={renderMeetup}
          keyExtractor={(item) => item._id}
          contentContainerStyle={styles.list}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
        />
      )}
      <FAB
        icon="plus"
        style={styles.fab}
        onPress={() => setShowCreateModal(true)}
        color="white"
      />
      <CreateMeetupModal
        visible={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        onSuccess={fetchMeetups}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F7FAFC" },
  centerContainer: { flex: 1, justifyContent: "center", alignItems: "center" },
  list: { padding: 16 },
  card: { marginBottom: 16, backgroundColor: "white" },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 12,
  },
  title: { fontSize: 20, fontWeight: "bold", color: "#2D2D2D", flex: 1 },
  attendeeCount: { flexDirection: "row", alignItems: "center", gap: 4 },
  attendeeText: { color: "#2B6CB0", fontSize: 14, fontWeight: "600" },
  details: { gap: 8, marginBottom: 12 },
  detail: { flexDirection: "row", alignItems: "center", gap: 8 },
  detailText: { color: "#666", fontSize: 14 },
  description: {
    color: "#666",
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 12,
  },
  creator: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: "#E2E8F0",
  },
  creatorText: { color: "#666", fontSize: 14 },
  emptyState: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 40,
  },
  emptyTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#2D2D2D",
    marginTop: 16,
    marginBottom: 8,
  },
  emptyText: { fontSize: 16, color: "#666", textAlign: "center" },
  fab: {
    position: "absolute",
    right: 16,
    bottom: 16,
    backgroundColor: "#2B6CB0",
  },

  // My Groups section
  myGroupsSection: {
    backgroundColor: "white",
    borderRadius: 16,
    margin: 16,
    marginBottom: 8,
    padding: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
  },
  myGroupsHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  myGroupsTitle: { fontSize: 17, fontWeight: "700", color: "#1a202c" },
  viewAllBtn: { fontSize: 13, fontWeight: "600", color: "#2B6CB0" },
  myGroupCard: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f4f8",
  },
  myGroupIcon: { fontSize: 22, width: 30, textAlign: "center" },
  myGroupName: { fontSize: 14, fontWeight: "700", color: "#1a202c" },
  myGroupMeta: { fontSize: 12, color: "#718096", marginTop: 2 },
  myGroupArrow: { color: "#cbd5e0", fontSize: 20, marginLeft: "auto" },
  meetupsSectionHeader: {
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 8,
  },
  meetupsSectionTitle: { fontSize: 17, fontWeight: "700", color: "#1a202c" },

  // Group invite banner
  inviteBanner: {
    backgroundColor: "#fffbeb",
    borderWidth: 1.5,
    borderColor: "#f6ad55",
    borderRadius: 14,
    margin: 16,
    marginBottom: 0,
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
  inviteInfo: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    marginBottom: 10,
  },
  inviteIcon: { fontSize: 26 },
  inviteName: { fontSize: 14, fontWeight: "700", color: "#1a202c" },
  inviteMeta: { fontSize: 12, color: "#718096", marginTop: 2 },
  inviteActions: { flexDirection: "row", gap: 8 },
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
    backgroundColor: "#ECC94B",
    borderRadius: 8,
    paddingVertical: 9,
    alignItems: "center",
  },
  btnMaybeText: { color: "#744210", fontSize: 13, fontWeight: "700" },
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
});
