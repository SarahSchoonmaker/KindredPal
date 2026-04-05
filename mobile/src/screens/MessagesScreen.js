import React, { useState, useCallback, useEffect } from "react";
import {
  View,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  RefreshControl,
  Image,
} from "react-native";
import { Text, ActivityIndicator } from "react-native-paper";
import { MessageCircle } from "lucide-react-native";
import { useFocusEffect } from "@react-navigation/native";
import { useSocket } from "../context/SocketContext";
import { messageAPI } from "../services/api";
import api from "../services/api";

const BLUE = "#2B6CB0";

function formatTime(date) {
  if (!date) return "";
  const now = new Date();
  const d = new Date(date);
  const mins = Math.floor((now - d) / 60000);
  if (mins < 1) return "Just now";
  if (mins < 60) return `${mins}m`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h`;
  const days = Math.floor(hrs / 24);
  if (days < 7) return `${days}d`;
  return d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

export default function MessagesScreen({ navigation }) {
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const { socket } = useSocket();

  const fetchMatches = useCallback(async () => {
    try {
      // FIX: Use connections API as primary source.
      // The old code used userAPI.getMatches() which reads user.matches[] —
      // but the app now uses the Connection model. Connections and matches
      // can be out of sync, causing an empty list even when conversations exist.
      // GET /connections returns all accepted connections with user data,
      // which is the correct source of truth for who you can message.
      const [connectionsRes, conversationsRes] = await Promise.allSettled([
        api.get("/connections"),
        messageAPI.getConversations(),
      ]);

      const connectionData =
        connectionsRes.status === "fulfilled"
          ? connectionsRes.value.data?.connections || []
          : [];

      const conversations =
        conversationsRes.status === "fulfilled"
          ? conversationsRes.value.data || []
          : [];

      // Merge connection user data with last message / unread count
      const merged = connectionData
        .map((conn) => {
          const user = conn.user;
          const userId = user?._id?.toString() || user?.id?.toString();
          const conv = conversations.find((c) => c._id === userId);
          return {
            _id: userId,
            name: user?.name || "",
            profilePhoto: user?.profilePhoto || "",
            photo: user?.profilePhoto || "",
            city: user?.city || "",
            state: user?.state || "",
            bio: user?.bio || "",
            lastMessage: conv?.lastMessage?.content || null,
            timestamp: conv?.lastMessage?.createdAt || null,
            unreadCount: conv?.unreadCount || 0,
          };
        })
        .sort((a, b) => {
          if (!a.timestamp && !b.timestamp) return 0;
          if (!a.timestamp) return 1;
          if (!b.timestamp) return -1;
          return new Date(b.timestamp) - new Date(a.timestamp);
        });

      setMatches(merged);
    } catch (err) {
      console.error("MessagesScreen fetch error:", err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    fetchMatches();
  }, [fetchMatches]);

  // Silently refresh unread counts on tab focus
  useFocusEffect(
    useCallback(() => {
      messageAPI
        .getConversations()
        .then((res) => {
          const convs = res.data || [];
          setMatches((prev) =>
            prev.map((m) => {
              const conv = convs.find((c) => c._id === m._id);
              if (!conv) return m;
              return {
                ...m,
                lastMessage: conv.lastMessage?.content || m.lastMessage,
                timestamp: conv.lastMessage?.createdAt || m.timestamp,
                unreadCount: conv.unreadCount || 0,
              };
            }),
          );
        })
        .catch(() => {});
    }, []),
  );

  // Socket — real-time last message preview
  useEffect(() => {
    if (!socket) return;
    const handle = (msg) => {
      const otherId = (msg.sender?._id || msg.sender)?.toString();
      setMatches((prev) =>
        prev.map((m) => {
          if (m._id?.toString() === otherId) {
            return {
              ...m,
              lastMessage: msg.content,
              timestamp: msg.createdAt || new Date().toISOString(),
              unreadCount: (m.unreadCount || 0) + 1,
            };
          }
          return m;
        }),
      );
    };
    socket.on("new-message", handle);
    return () => socket.off("new-message", handle);
  }, [socket]);

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color={BLUE} />
        <Text style={styles.loadingText}>Loading messages...</Text>
      </View>
    );
  }

  return (
    <ScrollView
      style={styles.container}
      refreshControl={
        <RefreshControl
          refreshing={refreshing}
          onRefresh={() => {
            setRefreshing(true);
            fetchMatches();
          }}
        />
      }
    >
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Messages</Text>
        <Text style={styles.headerSub}>
          {matches.length} connection{matches.length !== 1 ? "s" : ""}
        </Text>
      </View>

      {matches.length === 0 ? (
        <View style={styles.empty}>
          <MessageCircle size={56} color="#CBD5E0" />
          <Text style={styles.emptyTitle}>No Connections Yet</Text>
          <Text style={styles.emptyText}>
            Connect with members through groups to start messaging.
          </Text>
        </View>
      ) : (
        matches.map((match, i) => (
          <View key={match._id || i} style={styles.row}>
            {/* Avatar — tapping goes to their profile */}
            <TouchableOpacity
              onPress={() =>
                navigation.navigate("MemberProfile", {
                  userId: match._id,
                  sharedGroups: [],
                })
              }
              style={styles.avatarWrap}
            >
              {match.profilePhoto ? (
                <Image
                  source={{ uri: match.profilePhoto }}
                  style={styles.avatar}
                />
              ) : (
                <View style={[styles.avatar, styles.avatarPlaceholder]}>
                  <Text style={styles.avatarInitial}>
                    {(match.name || "?")[0].toUpperCase()}
                  </Text>
                </View>
              )}
              {match.unreadCount > 0 && (
                <View style={styles.badge}>
                  <Text style={styles.badgeText}>
                    {match.unreadCount > 9 ? "9+" : match.unreadCount}
                  </Text>
                </View>
              )}
            </TouchableOpacity>

            {/* Message info — tapping opens chat */}
            <TouchableOpacity
              style={styles.info}
              onPress={() => navigation.navigate("Chat", { match })}
            >
              <View style={styles.nameRow}>
                <TouchableOpacity
                  onPress={() =>
                    navigation.navigate("MemberProfile", {
                      userId: match._id,
                      sharedGroups: [],
                    })
                  }
                >
                  <Text
                    style={[
                      styles.name,
                      match.unreadCount > 0 && styles.nameUnread,
                    ]}
                  >
                    {match.name || "Member"}
                  </Text>
                </TouchableOpacity>
                {match.timestamp && (
                  <Text style={styles.time}>{formatTime(match.timestamp)}</Text>
                )}
              </View>
              <Text
                style={[
                  styles.lastMsg,
                  match.unreadCount > 0 && styles.lastMsgUnread,
                ]}
                numberOfLines={1}
              >
                {match.lastMessage || "Say hello! 👋"}
              </Text>
            </TouchableOpacity>
          </View>
        ))
      )}
      <View style={{ height: 80 }} />
    </ScrollView>
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
  loadingText: { marginTop: 12, color: "#718096", fontSize: 14 },
  header: { padding: 20, paddingBottom: 10 },
  headerTitle: { fontSize: 24, fontWeight: "800", color: "#1a202c" },
  headerSub: { fontSize: 13, color: "#718096", marginTop: 2 },
  empty: { alignItems: "center", paddingTop: 80, paddingHorizontal: 40 },
  emptyTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: "#2d3748",
    marginTop: 20,
    marginBottom: 8,
  },
  emptyText: {
    fontSize: 14,
    color: "#718096",
    textAlign: "center",
    lineHeight: 20,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: "white",
    borderBottomWidth: 1,
    borderBottomColor: "#F0F4F8",
  },
  avatarWrap: { position: "relative", marginRight: 14 },
  avatar: {
    width: 54,
    height: 54,
    borderRadius: 27,
    backgroundColor: "#EBF4FF",
  },
  avatarPlaceholder: { justifyContent: "center", alignItems: "center" },
  avatarInitial: { fontSize: 20, fontWeight: "700", color: BLUE },
  badge: {
    position: "absolute",
    top: -2,
    right: -2,
    backgroundColor: "#E53E3E",
    borderRadius: 10,
    minWidth: 20,
    height: 20,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 4,
    borderWidth: 2,
    borderColor: "white",
  },
  badgeText: { color: "white", fontSize: 11, fontWeight: "700" },
  info: { flex: 1 },
  nameRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 3,
  },
  name: { fontSize: 15, fontWeight: "600", color: "#2d3748" },
  nameUnread: { fontWeight: "800", color: "#1a202c" },
  time: { fontSize: 12, color: "#a0aec0" },
  lastMsg: { fontSize: 13, color: "#718096" },
  lastMsgUnread: { fontWeight: "700", color: "#2d3748" },
});
