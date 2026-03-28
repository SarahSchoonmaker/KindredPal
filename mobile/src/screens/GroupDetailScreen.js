import React, {
  useState,
  useCallback,
  useRef,
  useEffect,
  useLayoutEffect,
} from "react";
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
  Modal,
} from "react-native";
import { Text, ActivityIndicator } from "react-native-paper";
import { MessageCircle, Lock, Globe, LogOut, Send } from "lucide-react-native";
import { useFocusEffect } from "@react-navigation/native";
import * as SecureStore from "expo-secure-store";
import api from "../services/api";
import { groupChatAPI } from "../services/api";

const BLUE = "#2B6CB0";

// ── MemberCard ────────────────────────────────────────────────────────────────
function MemberCard({
  member,
  isCurrentUser,
  connectionStatus,
  onPress,
  onMessage,
  onConnect,
}) {
  return (
    <TouchableOpacity
      style={styles.memberCard}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <Image
        source={{
          uri: member.profilePhoto || "https://via.placeholder.com/44",
        }}
        style={styles.memberPhoto}
      />
      <View style={styles.memberInfo}>
        <Text style={styles.memberName}>{member.name || "Member"}</Text>
        {member.city || member.state ? (
          <Text style={styles.memberMeta}>
            {[member.city, member.state].filter(Boolean).join(", ")}
          </Text>
        ) : null}
        {member.denomination ? (
          <Text style={styles.memberMeta}>{member.denomination}</Text>
        ) : null}
      </View>

      {/* Action button — only for other users */}
      {!isCurrentUser && (
        <View>
          {connectionStatus === "accepted" ? (
            <TouchableOpacity style={styles.btnMessage} onPress={onMessage}>
              <MessageCircle size={16} color="white" />
              <Text style={styles.btnMessageText}>Message</Text>
            </TouchableOpacity>
          ) : connectionStatus === "pending" ? (
            <View style={styles.btnPending}>
              <Text style={styles.btnPendingText}>Pending</Text>
            </View>
          ) : (
            <TouchableOpacity style={styles.btnConnect} onPress={onConnect}>
              <Text style={styles.btnConnectText}>+ Connect</Text>
            </TouchableOpacity>
          )}
        </View>
      )}
    </TouchableOpacity>
  );
}

// ── Main Screen ───────────────────────────────────────────────────────────────
export default function GroupDetailScreen({ route, navigation }) {
  const { groupId } = route.params;

  useLayoutEffect(() => {
    navigation.setOptions({
      headerBackTitle: "Back",
      headerBackButtonMenuEnabled: false,
    });
  }, []);

  const [group, setGroup] = useState(null);
  const [loading, setLoading] = useState(true);
  const [joining, setJoining] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [activeTab, setActiveTab] = useState("about");

  // Chat
  const [chatMessages, setChatMessages] = useState([]);
  const [chatInput, setChatInput] = useState("");
  const [chatLoading, setChatLoading] = useState(false);
  const flatListRef = useRef(null);

  // Connections
  const [currentUserId, setCurrentUserId] = useState(null);
  const [connectionStatuses, setConnectionStatuses] = useState({});

  // Get current user ID on mount
  useEffect(() => {
    SecureStore.getItemAsync("userId").then((id) => {
      if (id) setCurrentUserId(id);
    });
  }, []);

  // ── Fetch group ─────────────────────────────────────────────
  const fetchGroup = useCallback(async () => {
    try {
      const res = await api.get(`/groups/${groupId}`);
      setGroup(res.data);
      navigation.setOptions({
        title: res.data.name,
        headerBackTitle: "Back",
        headerBackButtonMenuEnabled: false,
      });
    } catch (err) {
      console.error("fetchGroup error:", err);
      Alert.alert("Error", "Could not load group");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [groupId]);

  // Load once on mount
  useEffect(() => {
    fetchGroup();
  }, [fetchGroup]);

  // On re-focus: silent refresh only if group already loaded
  useFocusEffect(
    useCallback(() => {
      if (!loading) fetchGroup();
    }, [fetchGroup, loading]),
  );

  // ── Fetch connection statuses after group + currentUserId are both ready ──
  useEffect(() => {
    if (!group?.members?.length || !currentUserId) return;

    const fetchStatuses = async () => {
      const statuses = {};
      const otherMembers = group.members.filter((m) => {
        const id = m._id?.toString() || m.toString();
        return id !== currentUserId;
      });

      await Promise.allSettled(
        otherMembers.map(async (m) => {
          const id = m._id?.toString() || m.toString();
          try {
            const res = await api.get(`/connections/status/${id}`);
            statuses[id] = res.data?.status || "none";
          } catch {
            statuses[id] = "none";
          }
        }),
      );
      setConnectionStatuses(statuses);
    };

    fetchStatuses();
  }, [group, currentUserId]);

  // ── Chat ────────────────────────────────────────────────────
  useEffect(() => {
    if (activeTab === "chat") {
      setChatLoading(true);
      groupChatAPI
        .getMessages(groupId)
        .then((res) => setChatMessages(res.data.messages || []))
        .catch((err) => console.error("chat fetch error:", err))
        .finally(() => setChatLoading(false));
    }
  }, [activeTab, groupId]);

  const sendChatMessage = async () => {
    const text = chatInput.trim();
    if (!text) return;
    setChatInput("");
    const optimistic = {
      _id: `opt_${Date.now()}`,
      content: text,
      sender: { _id: currentUserId, name: "You" },
      createdAt: new Date().toISOString(),
    };
    setChatMessages((prev) => [...prev, optimistic]);
    try {
      await groupChatAPI.sendMessage(groupId, text);
    } catch {
      setChatMessages((prev) => prev.filter((m) => m._id !== optimistic._id));
      Alert.alert("Error", "Could not send message");
    }
  };

  // ── Join / Leave ────────────────────────────────────────────
  const handleJoin = async () => {
    setJoining(true);
    try {
      await api.post(`/groups/${groupId}/join`);
      await fetchGroup();
      Alert.alert(
        group?.isPrivate ? "Request Sent" : "Welcome!",
        group?.isPrivate
          ? "Your join request has been sent to the group admin."
          : `You've joined ${group?.name}!`,
      );
    } catch (err) {
      Alert.alert(
        "Error",
        err.response?.data?.message || "Could not join group",
      );
    } finally {
      setJoining(false);
    }
  };

  const handleLeave = () => {
    Alert.alert("Leave Group", `Leave ${group?.name}?`, [
      { text: "Cancel", style: "cancel" },
      {
        text: "Leave",
        style: "destructive",
        onPress: async () => {
          try {
            await api.post(`/groups/${groupId}/leave`);
            navigation.goBack();
          } catch (err) {
            Alert.alert(
              "Error",
              err.response?.data?.message || "Could not leave group",
            );
          }
        },
      },
    ]);
  };

  // ── Member actions ──────────────────────────────────────────
  const handleViewProfile = (member) => {
    const id = member._id?.toString() || member.toString();
    if (!id || id === currentUserId) return;
    navigation.navigate("MemberProfile", {
      userId: id,
      sharedGroups: [
        { _id: group._id, name: group.name, category: group.category },
      ],
    });
  };

  const handleMessage = (member) => {
    const id = member._id?.toString() || member.toString();
    if (!id) return;
    navigation.navigate("Chat", {
      match: {
        _id: id,
        id: id,
        name: member.name || "Member",
        profilePhoto: member.profilePhoto || null,
      },
    });
  };

  const handleConnect = async (member) => {
    const id = member._id?.toString() || member.toString();
    if (!id) return;
    setConnectionStatuses((prev) => ({ ...prev, [id]: "pending" }));
    try {
      await api.post(`/connections/request/${id}`, { message: "" });
    } catch (err) {
      setConnectionStatuses((prev) => ({ ...prev, [id]: "none" }));
      Alert.alert(
        "Error",
        err.response?.data?.message || "Could not send request",
      );
    }
  };

  const handleOpenEdit = () => {
    setEditForm({
      name: group.name || "",
      description: group.description || "",
      category: group.category || "",
      city: group.city || "",
      state: group.state || "",
      isPrivate: group.isPrivate || false,
      isNationwide: group.isNationwide || false,
    });
    setShowEdit(true);
  };

  const handleSaveEdit = async () => {
    if (!editForm.name.trim())
      return Alert.alert("Required", "Group name is required");
    if (!editForm.description.trim())
      return Alert.alert("Required", "Description is required");
    setEditSaving(true);
    try {
      await api.put(`/groups/${groupId}`, editForm);
      setShowEdit(false);
      fetchGroup();
    } catch (err) {
      Alert.alert(
        "Error",
        err.response?.data?.message || "Could not save changes",
      );
    } finally {
      setEditSaving(false);
    }
  };

  // ── Render ──────────────────────────────────────────────────
  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color={BLUE} />
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

  const tabs = [
    "about",
    "members",
    ...(group.isMember || group.isAdmin ? ["chat"] : []),
  ];

  return (
    <View style={styles.outerContainer}>
      {/* ── Scrollable content (About + Members + header) ── */}
      <ScrollView
        style={[styles.container, activeTab === "chat" && { display: "none" }]}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={() => {
              setRefreshing(true);
              fetchGroup();
            }}
          />
        }
      >
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.headerIcon}>
            <Text style={styles.headerIconText}>👥</Text>
          </View>
          <Text style={styles.groupName}>{group.name}</Text>
          <View style={styles.headerMeta}>
            {group.isPrivate ? (
              <View style={styles.metaBadge}>
                <Lock size={12} color="#718096" />
                <Text style={styles.metaBadgeText}>Private</Text>
              </View>
            ) : (
              <View style={[styles.metaBadge, styles.metaBadgePublic]}>
                <Globe size={12} color="#276749" />
                <Text style={[styles.metaBadgeText, { color: "#276749" }]}>
                  Public
                </Text>
              </View>
            )}
            <Text style={styles.categoryText}>{group.category}</Text>
          </View>
          {group.city ? (
            <Text style={styles.locationText}>
              📍 {group.city}, {group.state}
            </Text>
          ) : (
            <Text style={styles.locationText}>🌍 Nationwide</Text>
          )}
        </View>

        {/* Stats */}
        <View style={styles.stats}>
          <View style={styles.stat}>
            <Text style={styles.statNumber}>
              {group.memberCount || group.members?.length || 0}
            </Text>
            <Text style={styles.statLabel}>Members</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.stat}>
            <Text style={styles.statNumber}>
              {group.isPrivate ? "🔒" : "🌐"}
            </Text>
            <Text style={styles.statLabel}>
              {group.isPrivate ? "Private" : "Public"}
            </Text>
          </View>
        </View>

        {/* Join / Leave + Edit */}
        <View style={styles.actionContainer}>
          {group.isAdmin && (
            <TouchableOpacity
              style={styles.editButton}
              onPress={handleOpenEdit}
            >
              <Text style={styles.editButtonText}>✏️ Edit Group</Text>
            </TouchableOpacity>
          )}
          {group.isMember ? (
            <TouchableOpacity style={styles.leaveButton} onPress={handleLeave}>
              <LogOut size={16} color="#E53E3E" />
              <Text style={styles.leaveButtonText}>Leave Group</Text>
            </TouchableOpacity>
          ) : group.isPending ? (
            <View style={styles.pendingButton}>
              <Text style={styles.pendingButtonText}>
                ⏳ Join Request Pending
              </Text>
            </View>
          ) : (
            <TouchableOpacity
              style={styles.joinButton}
              onPress={handleJoin}
              disabled={joining}
            >
              <Text style={styles.joinButtonText}>
                {joining
                  ? "..."
                  : group.isPrivate
                    ? "🔒 Request to Join"
                    : "Join Group"}
              </Text>
            </TouchableOpacity>
          )}
        </View>

        {/* Tab bar */}
        <View style={styles.tabs}>
          {tabs.map((tab) => (
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
                {tab === "about"
                  ? "About"
                  : tab === "members"
                    ? `Members (${group.members?.length || 0})`
                    : "💬 Chat"}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* About tab */}
        {activeTab === "about" && (
          <View style={styles.section}>
            <Text style={styles.description}>{group.description}</Text>
          </View>
        )}

        {/* Members tab */}
        {activeTab === "members" && (
          <View style={styles.section}>
            {(group.isMember || !group.isPrivate) &&
            group.members?.length > 0 ? (
              group.members.map((member) => {
                const id = member._id?.toString() || member.toString();
                return (
                  <MemberCard
                    key={id}
                    member={member}
                    isCurrentUser={id === currentUserId}
                    connectionStatus={connectionStatuses[id] || "none"}
                    onPress={() => handleViewProfile(member)}
                    onMessage={() => handleMessage(member)}
                    onConnect={() => handleConnect(member)}
                  />
                );
              })
            ) : (
              <View style={styles.privateMessage}>
                <Lock size={24} color="#718096" />
                <Text style={styles.privateMessageText}>
                  Join this group to see members and connect.
                </Text>
              </View>
            )}
          </View>
        )}

        {activeTab !== "chat" && <View style={{ height: 40 }} />}
      </ScrollView>

      {/* ── Chat tab (outside ScrollView) ── */}
      {activeTab === "chat" && (group.isMember || group.isAdmin) && (
        <KeyboardAvoidingView
          style={styles.chatContainer}
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          keyboardVerticalOffset={90}
        >
          {/* Tab bar replicated at top of chat */}
          <View style={styles.tabs}>
            {tabs.map((tab) => (
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
                  {tab === "about"
                    ? "About"
                    : tab === "members"
                      ? `Members (${group.members?.length || 0})`
                      : "💬 Chat"}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          {chatLoading ? (
            <View style={styles.center}>
              <ActivityIndicator color={BLUE} />
            </View>
          ) : (
            <FlatList
              ref={flatListRef}
              data={chatMessages}
              keyExtractor={(item) =>
                item._id?.toString() || Math.random().toString()
              }
              contentContainerStyle={styles.chatList}
              ListEmptyComponent={
                <View style={styles.chatEmpty}>
                  <Text style={styles.chatEmptyText}>
                    No messages yet — say hi! 👋
                  </Text>
                </View>
              }
              renderItem={({ item }) => {
                const isOwn = item.sender?._id?.toString() === currentUserId;
                return (
                  <View style={[styles.msgRow, isOwn && styles.msgRowOwn]}>
                    {!isOwn && (
                      <Image
                        source={{
                          uri:
                            item.sender?.profilePhoto ||
                            "https://via.placeholder.com/28",
                        }}
                        style={styles.msgAvatar}
                      />
                    )}
                    <View
                      style={[
                        styles.msgBubble,
                        isOwn ? styles.msgBubbleOwn : styles.msgBubbleOther,
                      ]}
                    >
                      {!isOwn && (
                        <Text style={styles.msgSender}>
                          {item.sender?.name}
                        </Text>
                      )}
                      <Text
                        style={[styles.msgText, isOwn && { color: "white" }]}
                      >
                        {item.content}
                      </Text>
                      <Text
                        style={[
                          styles.msgTime,
                          isOwn && { color: "rgba(255,255,255,0.65)" },
                        ]}
                      >
                        {new Date(item.createdAt).toLocaleTimeString("en-US", {
                          hour: "numeric",
                          minute: "2-digit",
                        })}
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
            />
            <TouchableOpacity
              style={[
                styles.chatSendBtn,
                !chatInput.trim() && styles.chatSendBtnDisabled,
              ]}
              onPress={sendChatMessage}
              disabled={!chatInput.trim()}
            >
              <Send size={18} color="white" />
            </TouchableOpacity>
          </View>
        </KeyboardAvoidingView>
      )}
      {/* Edit Group Modal */}
      <Modal
        visible={showEdit}
        animationType="slide"
        presentationStyle="pageSheet"
      >
        <KeyboardAvoidingView
          style={{ flex: 1 }}
          behavior={Platform.OS === "ios" ? "padding" : undefined}
        >
          <View style={styles.editModalHeader}>
            <Text style={styles.editModalTitle}>Edit Group</Text>
            <TouchableOpacity onPress={() => setShowEdit(false)}>
              <Text style={styles.editModalClose}>Cancel</Text>
            </TouchableOpacity>
          </View>
          <ScrollView
            style={styles.editModalScroll}
            keyboardShouldPersistTaps="handled"
          >
            <View style={styles.editField}>
              <Text style={styles.editLabel}>Group Name</Text>
              <TextInput
                style={styles.editInput}
                value={editForm.name}
                onChangeText={(v) => setEditForm((f) => ({ ...f, name: v }))}
                placeholder="Group name"
                placeholderTextColor="#a0aec0"
                maxLength={100}
              />
            </View>
            <View style={styles.editField}>
              <Text style={styles.editLabel}>Description</Text>
              <TextInput
                style={[
                  styles.editInput,
                  { minHeight: 100, textAlignVertical: "top" },
                ]}
                value={editForm.description}
                onChangeText={(v) =>
                  setEditForm((f) => ({ ...f, description: v }))
                }
                placeholder="What is this group about?"
                placeholderTextColor="#a0aec0"
                multiline
                maxLength={500}
              />
            </View>
            <View style={styles.editRow}>
              <View style={{ flex: 1 }}>
                <Text style={styles.editLabel}>City</Text>
                <TextInput
                  style={styles.editInput}
                  value={editForm.city}
                  onChangeText={(v) => setEditForm((f) => ({ ...f, city: v }))}
                  placeholder="City"
                  placeholderTextColor="#a0aec0"
                />
              </View>
              <View style={{ width: 80, marginLeft: 10 }}>
                <Text style={styles.editLabel}>State</Text>
                <TextInput
                  style={styles.editInput}
                  value={editForm.state}
                  onChangeText={(v) => setEditForm((f) => ({ ...f, state: v }))}
                  placeholder="FL"
                  placeholderTextColor="#a0aec0"
                  maxLength={2}
                  autoCapitalize="characters"
                />
              </View>
            </View>
            <View style={styles.editField}>
              <TouchableOpacity
                style={[
                  styles.editToggle,
                  editForm.isPrivate && styles.editToggleActive,
                ]}
                onPress={() =>
                  setEditForm((f) => ({ ...f, isPrivate: !f.isPrivate }))
                }
              >
                <Text
                  style={[
                    styles.editToggleText,
                    editForm.isPrivate && { color: "white" },
                  ]}
                >
                  {editForm.isPrivate ? "🔒 Private Group" : "🌐 Public Group"}
                </Text>
              </TouchableOpacity>
            </View>
            <View style={styles.editField}>
              <TouchableOpacity
                style={[
                  styles.editToggle,
                  editForm.isNationwide && styles.editToggleActive,
                ]}
                onPress={() =>
                  setEditForm((f) => ({ ...f, isNationwide: !f.isNationwide }))
                }
              >
                <Text
                  style={[
                    styles.editToggleText,
                    editForm.isNationwide && { color: "white" },
                  ]}
                >
                  {editForm.isNationwide ? "🌍 Nationwide" : "📍 Local Group"}
                </Text>
              </TouchableOpacity>
            </View>
            <View style={{ height: 20 }} />
          </ScrollView>
          <View style={styles.editModalFooter}>
            <TouchableOpacity
              style={[styles.editSaveBtn, editSaving && { opacity: 0.6 }]}
              onPress={handleSaveEdit}
              disabled={editSaving}
            >
              <Text style={styles.editSaveBtnText}>
                {editSaving ? "Saving..." : "Save Changes"}
              </Text>
            </TouchableOpacity>
          </View>
        </KeyboardAvoidingView>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  outerContainer: { flex: 1, backgroundColor: "#F7FAFC" },
  container: { flex: 1, backgroundColor: "#F7FAFC" },
  center: { flex: 1, justifyContent: "center", alignItems: "center" },

  // Header
  header: {
    alignItems: "center",
    paddingVertical: 24,
    paddingHorizontal: 20,
    backgroundColor: "white",
    borderBottomWidth: 1,
    borderBottomColor: "#E2E8F0",
  },
  headerIcon: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: "#EBF4FF",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 12,
  },
  headerIconText: { fontSize: 28 },
  groupName: {
    fontSize: 22,
    fontWeight: "800",
    color: "#1a202c",
    textAlign: "center",
    marginBottom: 8,
  },
  headerMeta: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 6,
  },
  metaBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    backgroundColor: "#F7FAFC",
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#E2E8F0",
  },
  metaBadgePublic: { borderColor: "#276749" },
  metaBadgeText: { fontSize: 12, color: "#718096", fontWeight: "600" },
  categoryText: { fontSize: 13, color: "#718096" },
  locationText: { fontSize: 13, color: "#718096" },

  // Stats
  stats: {
    flexDirection: "row",
    backgroundColor: "white",
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#E2E8F0",
  },
  stat: { flex: 1, alignItems: "center" },
  statDivider: { width: 1, backgroundColor: "#E2E8F0" },
  statNumber: { fontSize: 20, fontWeight: "700", color: "#1a202c" },
  statLabel: { fontSize: 12, color: "#718096", marginTop: 2 },

  // Action buttons
  actionContainer: {
    padding: 16,
    backgroundColor: "white",
    borderBottomWidth: 1,
    borderBottomColor: "#E2E8F0",
  },
  joinButton: {
    backgroundColor: BLUE,
    borderRadius: 12,
    paddingVertical: 13,
    alignItems: "center",
  },
  joinButtonText: { color: "white", fontSize: 16, fontWeight: "700" },
  leaveButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    borderWidth: 1.5,
    borderColor: "#E53E3E",
    borderRadius: 12,
    paddingVertical: 11,
  },
  leaveButtonText: { color: "#E53E3E", fontSize: 15, fontWeight: "600" },
  pendingButton: {
    backgroundColor: "#F7FAFC",
    borderRadius: 12,
    paddingVertical: 13,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#E2E8F0",
  },
  pendingButtonText: { color: "#718096", fontSize: 15 },

  // Tabs
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
  tabActive: { borderBottomColor: BLUE },
  tabText: { fontSize: 13, fontWeight: "600", color: "#718096" },
  tabTextActive: { color: BLUE },

  // Section
  section: { padding: 16 },
  description: { fontSize: 15, color: "#4a5568", lineHeight: 22 },

  // Member card
  memberCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "white",
    borderRadius: 12,
    padding: 12,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: "#E2E8F0",
  },
  memberPhoto: { width: 44, height: 44, borderRadius: 22, marginRight: 12 },
  memberInfo: { flex: 1 },
  memberName: {
    fontSize: 15,
    fontWeight: "700",
    color: "#1a202c",
    marginBottom: 2,
  },
  memberMeta: { fontSize: 12, color: "#718096" },

  // Member action buttons
  btnMessage: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    backgroundColor: BLUE,
    borderRadius: 10,
    paddingHorizontal: 10,
    paddingVertical: 7,
  },
  btnMessageText: { color: "white", fontSize: 12, fontWeight: "700" },
  btnConnect: {
    backgroundColor: "#EBF4FF",
    borderRadius: 10,
    paddingHorizontal: 10,
    paddingVertical: 7,
    borderWidth: 1.5,
    borderColor: BLUE,
  },
  btnConnectText: { color: BLUE, fontSize: 12, fontWeight: "700" },
  btnPending: {
    backgroundColor: "#F7FAFC",
    borderRadius: 10,
    paddingHorizontal: 10,
    paddingVertical: 7,
    borderWidth: 1,
    borderColor: "#CBD5E0",
  },
  btnPendingText: { color: "#718096", fontSize: 12, fontWeight: "600" },

  // Private
  privateMessage: { alignItems: "center", paddingVertical: 40, gap: 12 },
  privateMessageText: { fontSize: 14, color: "#718096", textAlign: "center" },

  // Chat
  chatContainer: { flex: 1, backgroundColor: "#F7FAFC" },
  chatList: { padding: 12, flexGrow: 1 },
  chatEmpty: { alignItems: "center", paddingTop: 60 },
  chatEmptyText: { color: "#a0aec0", fontSize: 14 },
  msgRow: {
    flexDirection: "row",
    marginBottom: 10,
    alignItems: "flex-end",
    gap: 8,
  },
  msgRowOwn: { flexDirection: "row-reverse" },
  msgAvatar: { width: 28, height: 28, borderRadius: 14, flexShrink: 0 },
  msgBubble: { maxWidth: "75%", borderRadius: 16, padding: 10 },
  msgBubbleOwn: { backgroundColor: BLUE, borderBottomRightRadius: 4 },
  msgBubbleOther: {
    backgroundColor: "white",
    borderBottomLeftRadius: 4,
    borderWidth: 1,
    borderColor: "#E2E8F0",
  },
  msgSender: {
    fontSize: 11,
    fontWeight: "700",
    color: "#718096",
    marginBottom: 3,
  },
  msgText: { fontSize: 14, color: "#2D3748", lineHeight: 19 },
  msgTime: { fontSize: 10, color: "#a0aec0", marginTop: 3, textAlign: "right" },
  chatInputRow: {
    flexDirection: "row",
    alignItems: "flex-end",
    padding: 10,
    backgroundColor: "white",
    borderTopWidth: 1,
    borderTopColor: "#E2E8F0",
    gap: 8,
  },
  chatInput: {
    flex: 1,
    borderWidth: 1.5,
    borderColor: "#E2E8F0",
    borderRadius: 20,
    paddingHorizontal: 14,
    paddingVertical: 9,
    fontSize: 14,
    color: "#2D3748",
    maxHeight: 100,
    backgroundColor: "#f8fafc",
  },
  chatSendBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: BLUE,
    justifyContent: "center",
    alignItems: "center",
  },
  chatSendBtnDisabled: { backgroundColor: "#cbd5e0" },

  // Edit button
  editButton: {
    backgroundColor: "#EBF4FF",
    borderRadius: 12,
    paddingVertical: 10,
    alignItems: "center",
    marginBottom: 10,
    borderWidth: 1.5,
    borderColor: "#2B6CB0",
  },
  editButtonText: { color: "#2B6CB0", fontSize: 14, fontWeight: "700" },

  // Edit modal
  editModalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#e2e8f0",
  },
  editModalTitle: { fontSize: 18, fontWeight: "800", color: "#1a202c" },
  editModalClose: { fontSize: 15, color: "#718096", fontWeight: "600" },
  editModalScroll: { flex: 1, padding: 20 },
  editField: { marginBottom: 18 },
  editRow: { flexDirection: "row", marginBottom: 18 },
  editLabel: {
    fontSize: 11,
    fontWeight: "700",
    color: "#4a5568",
    textTransform: "uppercase",
    letterSpacing: 0.6,
    marginBottom: 7,
  },
  editInput: {
    backgroundColor: "#f8fafc",
    borderWidth: 1.5,
    borderColor: "#e2e8f0",
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 15,
    color: "#1a202c",
  },
  editToggle: {
    borderWidth: 1.5,
    borderColor: "#e2e8f0",
    borderRadius: 12,
    paddingVertical: 13,
    alignItems: "center",
    backgroundColor: "white",
  },
  editToggleActive: { backgroundColor: "#2B6CB0", borderColor: "#2B6CB0" },
  editToggleText: { fontSize: 15, fontWeight: "600", color: "#4a5568" },
  editModalFooter: {
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: "#e2e8f0",
  },
  editSaveBtn: {
    backgroundColor: "#2B6CB0",
    borderRadius: 14,
    paddingVertical: 15,
    alignItems: "center",
  },
  editSaveBtnText: { color: "white", fontSize: 16, fontWeight: "700" },
});
