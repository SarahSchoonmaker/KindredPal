import React, { useState, useCallback, useEffect } from "react";
import {
  View,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Image,
  RefreshControl,
  Alert,
} from "react-native";
import { Text, ActivityIndicator } from "react-native-paper";
import { MessageCircle, UserCheck, UserX, Users } from "lucide-react-native";
import { useFocusEffect } from "@react-navigation/native";
import api from "../services/api";

function RequestCard({ request, onAccept, onDecline, onViewProfile }) {
  const { from } = request;
  if (!from) return null;
  return (
    <View style={styles.requestCard}>
      <View style={styles.requestHeader}>
        <View style={styles.newBadge}>
          <Text style={styles.newBadgeText}>New Request</Text>
        </View>
      </View>
      <TouchableOpacity
        style={styles.personRow}
        onPress={() => onViewProfile(from)}
      >
        <Image
          source={{
            uri: from.profilePhoto || "https://via.placeholder.com/52",
          }}
          style={styles.photo}
        />
        <View style={styles.personInfo}>
          <Text style={[styles.personName, { color: "#2B6CB0" }]}>
            {from.name}
          </Text>
          <Text style={styles.personLocation}>
            {[from.city, from.state].filter(Boolean).join(", ")}
          </Text>
          {from.lifeStage?.length > 0 && (
            <Text style={styles.personMeta} numberOfLines={1}>
              {from.lifeStage.slice(0, 2).join(" · ")}
            </Text>
          )}
        </View>
      </TouchableOpacity>
      {request.message ? (
        <Text style={styles.requestMessage}>"{request.message}"</Text>
      ) : null}
      <View style={styles.requestActions}>
        <TouchableOpacity
          style={styles.declineBtn}
          onPress={() => onDecline(request._id)}
        >
          <UserX size={16} color="#E53E3E" />
          <Text style={styles.declineBtnText}>Decline</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.acceptBtn}
          onPress={() => onAccept(request._id)}
        >
          <UserCheck size={16} color="white" />
          <Text style={styles.acceptBtnText}>Accept</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

function ConnectionCard({ connection, onMessage, onRemove, onViewProfile }) {
  const { user } = connection;
  if (!user) return null;
  return (
    <View style={styles.connectionCard}>
      <TouchableOpacity
        onPress={() => onViewProfile(user)}
        style={{ flexDirection: "row", alignItems: "center", flex: 1 }}
      >
        <Image
          source={{
            uri: user.profilePhoto || "https://via.placeholder.com/52",
          }}
          style={[styles.photo, { marginRight: 12 }]}
        />
        <View style={styles.personInfo}>
          <Text style={[styles.personName, { color: "#2B6CB0" }]}>
            {user.name}
          </Text>
          <Text style={styles.personLocation}>
            {[user.city, user.state].filter(Boolean).join(", ")}
          </Text>
          {user.bio ? (
            <Text style={styles.personBio} numberOfLines={1}>
              {user.bio}
            </Text>
          ) : null}
        </View>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.messageBtn}
        onPress={() => onMessage(user)}
      >
        <MessageCircle size={20} color="#2B6CB0" />
      </TouchableOpacity>
    </View>
  );
}

export default function ConnectionsScreen({ navigation }) {
  const [connections, setConnections] = useState([]);
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [activeTab, setActiveTab] = useState("connections");

  const fetchAll = useCallback(async () => {
    try {
      const [connRes, reqRes] = await Promise.all([
        api.get("/connections"),
        api.get("/connections/requests"),
      ]);
      setConnections(connRes.data.connections || []);
      setRequests(reqRes.data.requests || []);
    } catch (err) {
      console.error("ConnectionsScreen fetch error:", err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    fetchAll();
  }, [fetchAll]);

  useFocusEffect(
    useCallback(() => {
      if (!loading) fetchAll();
    }, [fetchAll, loading]),
  );

  const handleAccept = async (connectionId) => {
    try {
      await api.post(`/connections/accept/${connectionId}`);
      fetchAll();
    } catch {
      Alert.alert("Error", "Could not accept request");
    }
  };

  const handleDecline = (connectionId) => {
    Alert.alert("Decline Request", "Decline this connection request?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Decline",
        style: "destructive",
        onPress: async () => {
          try {
            await api.post(`/connections/decline/${connectionId}`);
            fetchAll();
          } catch {
            Alert.alert("Error", "Could not decline request");
          }
        },
      },
    ]);
  };

  const handleMessage = (user) => {
    const userId = user._id || user.id;
    if (!userId) return;
    navigation.navigate("Chat", {
      match: {
        _id: userId.toString(),
        id: userId.toString(),
        name: user.name || "User",
        profilePhoto: user.profilePhoto || null,
      },
    });
  };

  // FIX: Previously used navigation.getState().routeNames.includes("UserProfile")
  // to decide which screen to navigate to. This crashes on React Native because
  // nested navigators don't expose all route names from getState() at the tab
  // level — the check returns false and the fallback navigate() call itself
  // throws if the screen doesn't exist in the current stack.
  //
  // Fix: navigate directly to MemberProfile which is registered in the mobile
  // navigator. Pass sharedGroups as empty array since we don't have group
  // context here — MemberProfile handles this gracefully.
  const handleViewProfile = (user) => {
    const userId = (user._id || user.id)?.toString();
    if (!userId) return;
    navigation.navigate("MemberProfile", {
      userId,
      sharedGroups: [],
    });
  };

  const handleRemove = (connectionId, name) => {
    Alert.alert("Remove Connection", `Remove ${name} from your connections?`, [
      { text: "Cancel", style: "cancel" },
      {
        text: "Remove",
        style: "destructive",
        onPress: async () => {
          try {
            await api.delete(`/connections/${connectionId}`);
            fetchAll();
          } catch {
            Alert.alert("Error", "Could not remove connection");
          }
        },
      },
    ]);
  };

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#2B6CB0" />
      </View>
    );
  }

  const pendingCount = requests.length;

  return (
    <View style={styles.container}>
      {/* Tabs */}
      <View style={styles.tabs}>
        <TouchableOpacity
          style={[styles.tab, activeTab === "connections" && styles.tabActive]}
          onPress={() => setActiveTab("connections")}
        >
          <Text
            style={[
              styles.tabText,
              activeTab === "connections" && styles.tabTextActive,
            ]}
          >
            Connections ({connections.length})
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, activeTab === "requests" && styles.tabActive]}
          onPress={() => setActiveTab("requests")}
        >
          <Text
            style={[
              styles.tabText,
              activeTab === "requests" && styles.tabTextActive,
            ]}
          >
            Requests{pendingCount > 0 ? ` (${pendingCount})` : ""}
          </Text>
          {pendingCount > 0 && <View style={styles.dot} />}
        </TouchableOpacity>
      </View>

      {/* Requests Tab */}
      {activeTab === "requests" && (
        <FlatList
          data={requests}
          keyExtractor={(item) => item._id}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={() => {
                setRefreshing(true);
                fetchAll();
              }}
            />
          }
          contentContainerStyle={styles.list}
          ListEmptyComponent={
            <View style={styles.empty}>
              <Text style={styles.emptyIcon}>📬</Text>
              <Text style={styles.emptyTitle}>No Pending Requests</Text>
              <Text style={styles.emptyText}>
                When someone from your groups sends you a connection request, it
                will appear here.
              </Text>
            </View>
          }
          renderItem={({ item }) => (
            <RequestCard
              request={item}
              onAccept={handleAccept}
              onDecline={handleDecline}
              onViewProfile={handleViewProfile}
            />
          )}
        />
      )}

      {/* Connections Tab */}
      {activeTab === "connections" && (
        <FlatList
          data={connections}
          keyExtractor={(item) => item.connectionId || item._id}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={() => {
                setRefreshing(true);
                fetchAll();
              }}
            />
          }
          contentContainerStyle={styles.list}
          ListEmptyComponent={
            <View style={styles.empty}>
              <Users size={48} color="#CBD5E0" />
              <Text style={styles.emptyTitle}>No Connections Yet</Text>
              <Text style={styles.emptyText}>
                Join groups and send connection requests to people who share
                your values and life stage.
              </Text>
              <TouchableOpacity
                style={styles.emptyBtn}
                onPress={() => navigation.navigate("Groups")}
              >
                <Text style={styles.emptyBtnText}>Browse Groups</Text>
              </TouchableOpacity>
            </View>
          }
          renderItem={({ item }) => (
            <ConnectionCard
              connection={item}
              onMessage={handleMessage}
              onRemove={handleRemove}
              onViewProfile={handleViewProfile}
            />
          )}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F7FAFC" },
  center: { flex: 1, justifyContent: "center", alignItems: "center" },
  tabs: {
    flexDirection: "row",
    backgroundColor: "white",
    borderBottomWidth: 1,
    borderBottomColor: "#E2E8F0",
  },
  tab: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 14,
    borderBottomWidth: 2,
    borderBottomColor: "transparent",
    gap: 6,
  },
  tabActive: { borderBottomColor: "#2B6CB0" },
  tabText: { fontSize: 14, fontWeight: "600", color: "#718096" },
  tabTextActive: { color: "#2B6CB0" },
  dot: { width: 8, height: 8, borderRadius: 4, backgroundColor: "#E53E3E" },
  list: { padding: 12 },
  requestCard: {
    backgroundColor: "white",
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "#BEE3F8",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  requestHeader: { flexDirection: "row", marginBottom: 12 },
  newBadge: {
    backgroundColor: "#EBF4FF",
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: 20,
  },
  newBadgeText: { fontSize: 11, fontWeight: "700", color: "#2B6CB0" },
  personRow: { flexDirection: "row", alignItems: "center", marginBottom: 10 },
  photo: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: "#E2E8F0",
  },
  personInfo: { flex: 1, marginLeft: 12 },
  personName: { fontSize: 16, fontWeight: "700", color: "#2D3748" },
  personLocation: { fontSize: 13, color: "#718096", marginTop: 1 },
  personMeta: { fontSize: 12, color: "#4A5568", marginTop: 3 },
  requestMessage: {
    fontSize: 14,
    color: "#4A5568",
    fontStyle: "italic",
    backgroundColor: "#F7FAFC",
    padding: 10,
    borderRadius: 8,
    marginBottom: 12,
  },
  requestActions: { flexDirection: "row", gap: 10 },
  declineBtn: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 6,
    paddingVertical: 10,
    borderRadius: 8,
    backgroundColor: "#FFF5F5",
    borderWidth: 1,
    borderColor: "#FED7D7",
  },
  declineBtnText: { color: "#E53E3E", fontWeight: "600", fontSize: 14 },
  acceptBtn: {
    flex: 2,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 6,
    paddingVertical: 10,
    borderRadius: 8,
    backgroundColor: "#2B6CB0",
  },
  acceptBtnText: { color: "white", fontWeight: "700", fontSize: 14 },
  connectionCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "white",
    borderRadius: 12,
    padding: 14,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: "#E2E8F0",
  },
  personBio: { fontSize: 12, color: "#718096", marginTop: 2 },
  messageBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#EBF4FF",
    justifyContent: "center",
    alignItems: "center",
  },
  empty: { alignItems: "center", paddingVertical: 60, paddingHorizontal: 32 },
  emptyIcon: { fontSize: 52, marginBottom: 16 },
  emptyTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: "#2D3748",
    marginBottom: 8,
  },
  emptyText: {
    fontSize: 14,
    color: "#718096",
    textAlign: "center",
    lineHeight: 20,
    marginBottom: 20,
  },
  emptyBtn: {
    backgroundColor: "#2B6CB0",
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  emptyBtnText: { color: "white", fontWeight: "700", fontSize: 14 },
});
