import React, { useState, useCallback, useRef, useEffect } from "react";
import {
  View,
  ScrollView,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Alert,
  Image,
  RefreshControl,
  TextInput,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { Text, ActivityIndicator } from "react-native-paper";
import { Users, MessageCircle, Lock, Globe, LogOut, Send, Info } from "lucide-react-native";
import { useFocusEffect } from "@react-navigation/native";
import * as SecureStore from "expo-secure-store";
import api from "../services/api";
import { groupChatAPI } from "../services/api";

function MemberCard({ member, onViewProfile }) {
  return (
    <TouchableOpacity style={styles.memberCard} onPress={() => onViewProfile(member)}>
      <Image
        source={{ uri: member.profilePhoto }}
        style={styles.memberPhoto}
      />
      <View style={styles.memberInfo}>
        <Text style={styles.memberName}>{member.name}</Text>
        <Text style={styles.memberLocation}>
          {member.city}, {member.state}
        </Text>
        {member.bio && (
          <Text style={styles.memberBio} numberOfLines={1}>
            {member.bio}
          </Text>
        )}
      </View>
      <View style={styles.messageBtn}>
        <MessageCircle size={18} color="#2B6CB0" />
      </View>
    </TouchableOpacity>
  );
}

export default function GroupDetailScreen({ route, navigation }) {
  const { groupId } = route.params;
  const [group, setGroup] = useState(null);
  const [loading, setLoading] = useState(true);
  const [joining, setJoining] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [activeTab, setActiveTab] = useState("about");
  const [chatMessages, setChatMessages] = useState([]);
  const [chatInput, setChatInput] = useState("");
  const [chatLoading, setChatLoading] = useState(false);
  const [currentUserId, setCurrentUserId] = useState(null);
  const flatListRef = useRef(null);

  useEffect(() => {
    SecureStore.getItemAsync("userId").then(id => setCurrentUserId(id));
  }, []);

  const fetchChat = useCallback(async () => {
    if (!groupId) return;
    setChatLoading(true);
    try {
      const res = await groupChatAPI.getMessages(groupId);
      setChatMessages(res.data.messages || []);
    } catch (err) {
      console.error("Chat fetch error:", err);
    } finally {
      setChatLoading(false);
    }
  }, [groupId]);

  useEffect(() => {
    if (activeTab === "chat") fetchChat();
  }, [activeTab, fetchChat]);

  const sendChatMessage = async () => {
    const text = chatInput.trim();
    if (!text) return;
    setChatInput("");
    const optimistic = {
      _id: `opt_${Date.now()}`,
      content: text,
      sender: { _id: currentUserId, name: "You", profilePhoto: null },
      createdAt: new Date().toISOString(),
    };
    setChatMessages(prev => [...prev, optimistic]);
    try {
      await groupChatAPI.sendMessage(groupId, text);
    } catch (err) {
      setChatMessages(prev => prev.filter(m => m._id !== optimistic._id));
      Alert.alert("Error", "Could not send message");
    }
  };

  const fetchGroup = useCallback(async () => {
    try {
      const res = await api.get(`/groups/${groupId}`);
      setGroup(res.data);
      navigation.setOptions({ title: res.data.name });
    } catch (err) {
      console.error("Error fetching group:", err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [groupId]);

  useFocusEffect(
    useCallback(() => {
      setLoading(true);
      fetchGroup();
    }, [fetchGroup])
  );

  const handleJoin = async () => {
    setJoining(true);
    try {
      const res = await api.post(`/groups/${groupId}/join`);
      await fetchGroup();
      if (group?.isPrivate) {
        Alert.alert("Request Sent", "Your request to join has been sent to the group admin.");
      } else {
        Alert.alert("Welcome!", `You've joined ${group?.name}!`);
      }
    } catch (err) {
      Alert.alert("Error", err.response?.data?.message || "Could not join group");
    } finally {
      setJoining(false);
    }
  };

  const handleLeave = () => {
    Alert.alert(
      "Leave Group",
      `Are you sure you want to leave ${group?.name}?`,
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Leave",
          style: "destructive",
          onPress: async () => {
            try {
              await api.post(`/groups/${groupId}/leave`);
              navigation.goBack();
            } catch (err) {
              Alert.alert("Error", err.response?.data?.message || "Could not leave group");
            }
          },
        },
      ]
    );
  };

  const handleViewProfile = (member) => {
    navigation.navigate("MemberProfile", {
      userId: member._id,
      sharedGroups: [{ _id: group._id, name: group.name, category: group.category }],
    });
  };

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#2B6CB0" />
      </View>
    );
  }

  if (!group) {
    return (
      <View style={styles.center}>
        <Text>Group not found</Text>
      </View>
    );
  }

  return (
    <View style={styles.outerContainer}>
    <ScrollView
      style={[styles.container, activeTab === "chat" && { display: "none" }]}
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={() => { setRefreshing(true); fetchGroup(); }} />}
    >
      {/* Group Header */}
      <View style={styles.header}>
        <View style={styles.headerIcon}>
          <Text style={styles.headerIconText}>👥</Text>
        </View>
        <Text style={styles.groupName}>{group.name}</Text>
        <View style={styles.headerMeta}>
          {group.isPrivate ? (
            <View style={styles.metaBadge}>
              <Lock size={12} color="#718096" />
              <Text style={styles.metaBadgeText}>Private Group</Text>
            </View>
          ) : (
            <View style={[styles.metaBadge, styles.metaBadgePublic]}>
              <Globe size={12} color="#276749" />
              <Text style={[styles.metaBadgeText, { color: "#276749" }]}>Public Group</Text>
            </View>
          )}
          <Text style={styles.categoryText}>{group.category}</Text>
        </View>
        {group.city ? (
          <Text style={styles.locationText}>📍 {group.city}, {group.state}</Text>
        ) : (
          <Text style={styles.locationText}>🌍 Nationwide</Text>
        )}
      </View>

      {/* Stats row */}
      <View style={styles.stats}>
        <View style={styles.stat}>
          <Text style={styles.statNumber}>{group.memberCount || 0}</Text>
          <Text style={styles.statLabel}>Members</Text>
        </View>
        <View style={styles.statDivider} />
        <View style={styles.stat}>
          <Text style={styles.statNumber}>{group.isPrivate ? "🔒" : "🌐"}</Text>
          <Text style={styles.statLabel}>{group.isPrivate ? "Private" : "Public"}</Text>
        </View>
      </View>

      {/* Join / Leave */}
      <View style={styles.actionContainer}>
        {group.isMember ? (
          <TouchableOpacity style={styles.leaveButton} onPress={handleLeave}>
            <LogOut size={18} color="#E53E3E" />
            <Text style={styles.leaveButtonText}>Leave Group</Text>
          </TouchableOpacity>
        ) : group.isPending ? (
          <View style={styles.pendingButton}>
            <Text style={styles.pendingButtonText}>⏳ Join Request Pending</Text>
          </View>
        ) : (
          <TouchableOpacity style={styles.joinButton} onPress={handleJoin} disabled={joining}>
            <Text style={styles.joinButtonText}>
              {joining ? "..." : group.isPrivate ? "🔒 Request to Join" : "Join Group"}
            </Text>
          </TouchableOpacity>
        )}
      </View>

      {/* Tabs */}
      <View style={styles.tabs}>
        {["about", "members", ...(group.isMember || group.isAdmin ? ["chat"] : [])].map(tab => (
          <TouchableOpacity
            key={tab}
            style={[styles.tab, activeTab === tab && styles.tabActive]}
            onPress={() => setActiveTab(tab)}
          >
            <Text style={[styles.tabText, activeTab === tab && styles.tabTextActive]}>
              {tab === "about" ? "About" : tab === "members" ? `Members (${group.members?.length || 0})` : "💬 Chat"}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* About tab */}
      {activeTab === "about" && (
        <View style={styles.section}>
          <Text style={styles.description}>{group.description}</Text>
          {!group.isNationwide && group.city && (
            <View style={styles.locationBlock}>
              <Text style={styles.locationBlockText}>📍 {group.city}, {group.state}</Text>
            </View>
          )}
        </View>
      )}

      {/* Members tab */}
      {activeTab === "members" && (
        <>
          {(group.isMember || !group.isPrivate) && group.members?.length > 0 ? (
            <View style={styles.section}>
              {group.members.map((member) => (
                <MemberCard key={member._id} member={member} onViewProfile={handleViewProfile} />
              ))}
            </View>
          ) : (
            <View style={styles.privateMessage}>
              <Lock size={24} color="#718096" />
              <Text style={styles.privateMessageText}>
                Join this group to see members and connect.
              </Text>
            </View>
          )}
        </>
      )}

      {/* Chat tab — rendered outside ScrollView below */}

      {activeTab !== "chat" && <View style={{ height: 40 }} />}
    </ScrollView>

    {/* Chat tab — outside ScrollView for keyboard */}
    {activeTab === "chat" && (group.isMember || group.isAdmin) && (
      <KeyboardAvoidingView
        style={styles.chatContainer}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={90}
      >
        {chatLoading ? (
          <View style={styles.chatCenter}>
            <ActivityIndicator color="#2B6CB0" />
          </View>
        ) : (
          <FlatList
            ref={flatListRef}
            data={chatMessages}
            keyExtractor={item => item._id}
            contentContainerStyle={styles.chatList}
            ListEmptyComponent={
              <View style={styles.chatEmpty}>
                <Text style={styles.chatEmptyText}>No messages yet — say hi! 👋</Text>
              </View>
            }
            renderItem={({ item }) => {
              const isOwn = item.sender?._id === currentUserId;
              return (
                <View style={[styles.msgRow, isOwn && styles.msgRowOwn]}>
                  {!isOwn && (
                    <Image
                      source={{ uri: item.sender?.profilePhoto || "https://via.placeholder.com/30" }}
                      style={styles.msgAvatar}
                    />
                  )}
                  <View style={[styles.msgBubble, isOwn ? styles.msgBubbleOwn : styles.msgBubbleOther]}>
                    {!isOwn && <Text style={styles.msgSender}>{item.sender?.name}</Text>}
                    <Text style={[styles.msgText, isOwn && { color: "white" }]}>{item.content}</Text>
                    <Text style={[styles.msgTime, isOwn && { color: "rgba(255,255,255,0.7)" }]}>
                      {new Date(item.createdAt).toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" })}
                    </Text>
                  </View>
                </View>
              );
            }}
          />
        )}
        <View style={styles.chatInputRow}>
          <TextInput
            style={styles.chatInput}
            value={chatInput}
            onChangeText={setChatInput}
            placeholder="Message the group..."
            placeholderTextColor="#a0aec0"
            multiline
            maxLength={2000}
            onSubmitEditing={sendChatMessage}
          />
          <TouchableOpacity
            style={[styles.chatSendBtn, !chatInput.trim() && styles.chatSendBtnDisabled]}
            onPress={sendChatMessage}
            disabled={!chatInput.trim()}
          >
            <Send size={18} color="white" />
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    )}
    </View>
  );
}

const styles = StyleSheet.create({
  outerContainer: { flex: 1, backgroundColor: "#F7FAFC" },
  container: { flex: 1, backgroundColor: "#F7FAFC" },
  center: { flex: 1, justifyContent: "center", alignItems: "center" },

  header: {
    backgroundColor: "#2B6CB0",
    padding: 24,
    alignItems: "center",
  },
  headerIcon: {
    width: 72,
    height: 72,
    borderRadius: 20,
    backgroundColor: "rgba(255,255,255,0.2)",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 12,
  },
  headerIconText: { fontSize: 36 },
  groupName: { fontSize: 22, fontWeight: "700", color: "white", textAlign: "center", marginBottom: 10 },
  headerMeta: { flexDirection: "row", alignItems: "center", gap: 10, marginBottom: 6 },
  metaBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    backgroundColor: "rgba(255,255,255,0.15)",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 20,
  },
  metaBadgePublic: { backgroundColor: "#C6F6D5" },
  metaBadgeText: { fontSize: 12, color: "white", fontWeight: "600" },
  categoryText: { fontSize: 13, color: "rgba(255,255,255,0.8)" },
  locationText: { fontSize: 13, color: "rgba(255,255,255,0.8)" },

  section: { backgroundColor: "white", margin: 12, borderRadius: 12, padding: 16, borderWidth: 1, borderColor: "#E2E8F0" },
  sectionTitle: { fontSize: 17, fontWeight: "700", color: "#2D3748", marginBottom: 10 },
  description: { fontSize: 15, color: "#4A5568", lineHeight: 22 },

  stats: {
    flexDirection: "row",
    backgroundColor: "white",
    marginHorizontal: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#E2E8F0",
    padding: 16,
  },
  stat: { flex: 1, alignItems: "center" },
  statNumber: { fontSize: 24, fontWeight: "700", color: "#2B6CB0" },
  statLabel: { fontSize: 12, color: "#718096", marginTop: 2 },
  statDivider: { width: 1, backgroundColor: "#E2E8F0" },

  actionContainer: { margin: 12 },
  joinButton: {
    backgroundColor: "#2B6CB0",
    borderRadius: 10,
    padding: 16,
    alignItems: "center",
  },
  joinButtonText: { color: "white", fontSize: 16, fontWeight: "700" },
  leaveButton: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 8,
    backgroundColor: "#FFF5F5",
    borderRadius: 10,
    padding: 16,
    borderWidth: 1,
    borderColor: "#FED7D7",
  },
  leaveButtonText: { color: "#E53E3E", fontSize: 16, fontWeight: "600" },
  pendingButton: {
    backgroundColor: "#FEFCBF",
    borderRadius: 10,
    padding: 16,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#F6E05E",
  },
  pendingButtonText: { color: "#744210", fontSize: 15, fontWeight: "600" },

  memberCard: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#F7FAFC",
  },
  memberPhoto: { width: 44, height: 44, borderRadius: 22, backgroundColor: "#E2E8F0" },
  memberInfo: { flex: 1, marginLeft: 12 },
  memberName: { fontSize: 15, fontWeight: "600", color: "#2D3748" },
  memberLocation: { fontSize: 12, color: "#718096" },
  memberBio: { fontSize: 12, color: "#4A5568", marginTop: 2 },
  messageBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "#EBF4FF",
    justifyContent: "center",
    alignItems: "center",
  },

  privateMessage: {
    margin: 12,
    padding: 20,
    backgroundColor: "white",
    borderRadius: 12,
    alignItems: "center",
    gap: 10,
    borderWidth: 1,
    borderColor: "#E2E8F0",
  },
  privateMessageText: {
    fontSize: 14,
    color: "#718096",
    textAlign: "center",
    lineHeight: 20,
  },


  // Tabs
  tabs: { flexDirection: "row", backgroundColor: "white", borderBottomWidth: 1, borderBottomColor: "#E2E8F0" },
  tab: { flex: 1, paddingVertical: 12, alignItems: "center", borderBottomWidth: 2, borderBottomColor: "transparent" },
  tabActive: { borderBottomColor: "#2B6CB0" },
  tabText: { fontSize: 13, fontWeight: "600", color: "#718096" },
  tabTextActive: { color: "#2B6CB0" },
  locationBlock: { marginTop: 12, backgroundColor: "#f8fafc", borderRadius: 8, padding: 12 },
  locationBlockText: { fontSize: 14, color: "#4a5568" },

  // Chat
  chatContainer: { flex: 1, backgroundColor: "#F7FAFC" },
  chatCenter: { flex: 1, justifyContent: "center", alignItems: "center" },
  chatList: { padding: 12, flexGrow: 1, justifyContent: "flex-end" },
  chatEmpty: { flex: 1, alignItems: "center", justifyContent: "center", padding: 40 },
  chatEmptyText: { color: "#a0aec0", fontSize: 14 },
  msgRow: { flexDirection: "row", marginBottom: 10, alignItems: "flex-end", gap: 8 },
  msgRowOwn: { flexDirection: "row-reverse" },
  msgAvatar: { width: 28, height: 28, borderRadius: 14, flexShrink: 0 },
  msgBubble: { maxWidth: "75%", borderRadius: 16, padding: 10 },
  msgBubbleOwn: { backgroundColor: "#2B6CB0", borderBottomRightRadius: 4 },
  msgBubbleOther: { backgroundColor: "white", borderBottomLeftRadius: 4, borderWidth: 1, borderColor: "#E2E8F0" },
  msgSender: { fontSize: 11, fontWeight: "700", color: "#718096", marginBottom: 3 },
  msgText: { fontSize: 14, color: "#2D3748", lineHeight: 19 },
  msgTime: { fontSize: 10, color: "#a0aec0", marginTop: 3, textAlign: "right" },
  chatInputRow: { flexDirection: "row", alignItems: "flex-end", padding: 10, backgroundColor: "white", borderTopWidth: 1, borderTopColor: "#E2E8F0", gap: 8 },
  chatInput: { flex: 1, borderWidth: 1.5, borderColor: "#E2E8F0", borderRadius: 20, paddingHorizontal: 14, paddingVertical: 9, fontSize: 14, color: "#2D3748", maxHeight: 100, backgroundColor: "#f8fafc" },
  chatSendBtn: { width: 40, height: 40, borderRadius: 20, backgroundColor: "#2B6CB0", justifyContent: "center", alignItems: "center" },
  chatSendBtnDisabled: { backgroundColor: "#cbd5e0" },
});