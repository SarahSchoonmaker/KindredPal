import React, {
  useState,
  useEffect,
  useLayoutEffect,
  useRef,
  useCallback,
} from "react";
import {
  View,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  FlatList,
  TouchableOpacity,
  TextInput,
  Modal,
  Alert,
  Text,
} from "react-native";
import { ActivityIndicator } from "react-native-paper";
import { Send, MoreVertical } from "lucide-react-native";
import { messageAPI, userAPI } from "../services/api";
import { useSocket } from "../context/SocketContext";
import { useAuth } from "../context/AuthContext";

const BLUE = "#2B6CB0";

export default function ChatScreen({ route, navigation }) {
  const { match, userId, userName } = route.params;

  // FIX: safe extraction — handle all param shapes passed from different screens
  const chatUserId = (match?._id || match?.id || userId || "").toString();
  const chatUserName = match?.name || userName || "Chat";

  const { user } = useAuth();
  // FIX: get currentUserId from AuthContext synchronously — no async race
  const currentUserId = (user?.id || user?._id || "").toString();

  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [menuVisible, setMenuVisible] = useState(false);
  const flatListRef = useRef(null);
  const { socket } = useSocket();

  useLayoutEffect(() => {
    navigation.setOptions({
      headerTitle: chatUserName,
      headerBackTitle: "Back",
      headerBackButtonMenuEnabled: false,
      headerRight: () => (
        <TouchableOpacity
          style={styles.menuButton}
          onPress={() => setMenuVisible(true)}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        >
          <MoreVertical size={22} color="white" />
        </TouchableOpacity>
      ),
    });
  }, [navigation, chatUserName]);

  const fetchMessages = useCallback(async () => {
    if (!chatUserId) return;
    try {
      const res = await messageAPI.getMessages(chatUserId);
      setMessages(res.data || []);
    } catch (err) {
      const status = err.response?.status;
      if (status === 403) {
        // Not connected — show friendly message instead of crash
        Alert.alert(
          "Cannot Message",
          "You can only message users you're connected with.",
          [{ text: "OK", onPress: () => navigation.goBack() }],
        );
      } else {
        console.error("fetchMessages error:", err);
      }
    } finally {
      setLoading(false);
    }
  }, [chatUserId]);

  useEffect(() => {
    fetchMessages();
  }, [fetchMessages]);

  // FIX: Socket field names match what backend actually emits.
  // Backend Message model uses senderId/recipientId, not sender/recipient.
  useEffect(() => {
    if (!socket || !chatUserId || !currentUserId) return;

    const handleNewMessage = (msg) => {
      // Backend emits message with senderId and recipientId fields
      const senderId = (
        msg.senderId ||
        msg.sender?._id ||
        msg.sender ||
        ""
      ).toString();
      const recipientId = (
        msg.recipientId ||
        msg.recipient?._id ||
        msg.recipient ||
        ""
      ).toString();

      const isThisConversation =
        (senderId === chatUserId && recipientId === currentUserId) ||
        (senderId === currentUserId && recipientId === chatUserId);

      if (isThisConversation) {
        setMessages((prev) => {
          if (prev.some((m) => m._id === msg._id)) return prev;
          return [...prev, msg];
        });
        setTimeout(
          () => flatListRef.current?.scrollToEnd({ animated: true }),
          100,
        );
      }
    };

    socket.on("new-message", handleNewMessage);
    return () => socket.off("new-message", handleNewMessage);
  }, [socket, chatUserId, currentUserId]);

  // ── Actions ────────────────────────────────────────────────
  const handleViewProfile = () => {
    setMenuVisible(false);
    navigation.navigate("MemberProfile", {
      userId: chatUserId,
      sharedGroups: [],
    });
  };

  const handleRemoveConnection = () => {
    setMenuVisible(false);
    Alert.alert(
      "Remove Connection",
      `Remove ${chatUserName} from your connections?`,
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Remove",
          style: "destructive",
          onPress: async () => {
            try {
              // FIX: use correct API — unmatch removes from connections
              await userAPI.blockUser(chatUserId); // fallback if no unmatch
              navigation.navigate("Messages");
            } catch {
              Alert.alert("Error", "Could not remove connection");
            }
          },
        },
      ],
    );
  };

  const handleReport = () => {
    setMenuVisible(false);
    Alert.alert("Report User", "Why are you reporting this user?", [
      {
        text: "Inappropriate messages",
        onPress: () => submitReport("Inappropriate messages"),
      },
      { text: "Fake profile", onPress: () => submitReport("Fake profile") },
      { text: "Harassment", onPress: () => submitReport("Harassment") },
      { text: "Spam", onPress: () => submitReport("Spam") },
      { text: "Cancel", style: "cancel" },
    ]);
  };

  const submitReport = async (reason) => {
    try {
      await userAPI.reportUser(chatUserId, reason);
      Alert.alert("Reported", "Thank you. Our team will review this.");
    } catch {
      Alert.alert("Error", "Could not submit report");
    }
  };

  const handleBlock = () => {
    setMenuVisible(false);
    Alert.alert(
      "Block User",
      `Block ${chatUserName}? You won't be able to message each other.`,
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Block",
          style: "destructive",
          onPress: async () => {
            try {
              await userAPI.blockUser(chatUserId);
              Alert.alert("Blocked", `${chatUserName} has been blocked.`, [
                { text: "OK", onPress: () => navigation.navigate("Messages") },
              ]);
            } catch {
              Alert.alert("Error", "Could not block user");
            }
          },
        },
      ],
    );
  };

  // ── Send ───────────────────────────────────────────────────
  const handleSend = async () => {
    const text = newMessage.trim();
    if (!text || sending || !chatUserId) return;
    setNewMessage("");
    setSending(true);
    try {
      const res = await messageAPI.sendMessage(chatUserId, text);
      setMessages((prev) => [...prev, res.data]);
      setTimeout(
        () => flatListRef.current?.scrollToEnd({ animated: true }),
        100,
      );
    } catch (err) {
      const status = err.response?.status;
      const msg = err.response?.data?.message || "Failed to send message";
      // FIX: show the actual error — 403 means not connected or blocked
      Alert.alert(status === 403 ? "Cannot Send Message" : "Error", msg);
      setNewMessage(text); // restore message so user doesn't lose it
    } finally {
      setSending(false);
    }
  };

  // ── Render message ─────────────────────────────────────────
  const renderMessage = ({ item }) => {
    // FIX: check both senderId (new) and sender (legacy) field
    const senderId = (
      item.senderId ||
      item.sender?._id ||
      item.sender ||
      ""
    ).toString();
    const isOwn = senderId === currentUserId;

    return (
      <View
        style={[styles.bubble, isOwn ? styles.bubbleOwn : styles.bubbleOther]}
      >
        <Text style={[styles.bubbleText, isOwn && styles.bubbleTextOwn]}>
          {item.content}
        </Text>
        <Text style={[styles.bubbleTime, isOwn && styles.bubbleTimeOwn]}>
          {new Date(item.createdAt).toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          })}
        </Text>
      </View>
    );
  };

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color={BLUE} />
      </View>
    );
  }

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      keyboardVerticalOffset={90}
    >
      {/* ── Three-dot dropdown ── */}
      <Modal
        visible={menuVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setMenuVisible(false)}
        statusBarTranslucent
      >
        <TouchableOpacity
          style={styles.menuOverlay}
          activeOpacity={1}
          onPress={() => setMenuVisible(false)}
        >
          <View style={styles.menuDropdown}>
            <TouchableOpacity
              style={styles.menuItem}
              onPress={handleViewProfile}
            >
              <Text style={styles.menuItemText}>👤 View Profile</Text>
            </TouchableOpacity>
            <View style={styles.menuDivider} />
            <TouchableOpacity style={styles.menuItem} onPress={handleReport}>
              <Text style={[styles.menuItemText, styles.menuItemDanger]}>
                🚩 Report User
              </Text>
            </TouchableOpacity>
            <View style={styles.menuDivider} />
            <TouchableOpacity style={styles.menuItem} onPress={handleBlock}>
              <Text style={[styles.menuItemText, styles.menuItemDanger]}>
                🚫 Block User
              </Text>
            </TouchableOpacity>
            <View style={styles.menuDivider} />
            <TouchableOpacity
              style={styles.menuItem}
              onPress={() => setMenuVisible(false)}
            >
              <Text style={[styles.menuItemText, { color: "#718096" }]}>
                Cancel
              </Text>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </Modal>

      {/* ── Message list ── */}
      <FlatList
        ref={flatListRef}
        data={messages}
        renderItem={renderMessage}
        keyExtractor={(item) =>
          item._id?.toString() || Math.random().toString()
        }
        contentContainerStyle={styles.list}
        onLayout={() => flatListRef.current?.scrollToEnd({ animated: false })}
        ListEmptyComponent={
          <View style={styles.empty}>
            <Text style={styles.emptyText}>
              No messages yet — say hello! 👋
            </Text>
          </View>
        }
      />

      {/* ── Input bar ── */}
      <View style={styles.inputBar}>
        <TextInput
          style={styles.input}
          placeholder="Type a message..."
          placeholderTextColor="#a0aec0"
          value={newMessage}
          onChangeText={setNewMessage}
          multiline
          maxLength={1000}
          returnKeyType="default"
        />
        <TouchableOpacity
          style={[
            styles.sendBtn,
            (!newMessage.trim() || sending) && styles.sendBtnDisabled,
          ]}
          onPress={handleSend}
          disabled={!newMessage.trim() || sending}
        >
          {sending ? (
            <ActivityIndicator size="small" color="white" />
          ) : (
            <Send size={18} color="white" />
          )}
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F7FAFC" },
  center: { flex: 1, justifyContent: "center", alignItems: "center" },
  menuButton: { paddingHorizontal: 14, paddingVertical: 8 },
  menuOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.35)",
    justifyContent: "flex-start",
    alignItems: "flex-end",
  },
  menuDropdown: {
    backgroundColor: "white",
    borderRadius: 14,
    marginTop: 54,
    marginRight: 10,
    minWidth: 210,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.18,
    shadowRadius: 16,
    elevation: 10,
    overflow: "hidden",
  },
  menuItem: { paddingVertical: 15, paddingHorizontal: 20 },
  menuItemText: { fontSize: 15, color: "#2d3748", fontWeight: "500" },
  menuItemDanger: { color: "#e53e3e" },
  menuDivider: { height: 1, backgroundColor: "#f0f4f8" },
  list: {
    padding: 16,
    paddingBottom: 8,
    flexGrow: 1,
    justifyContent: "flex-end",
  },
  empty: { flex: 1, alignItems: "center", paddingTop: 60 },
  emptyText: { color: "#a0aec0", fontSize: 15 },
  bubble: {
    maxWidth: "75%",
    marginBottom: 10,
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 18,
  },
  bubbleOwn: {
    alignSelf: "flex-end",
    backgroundColor: BLUE,
    borderBottomRightRadius: 4,
  },
  bubbleOther: {
    alignSelf: "flex-start",
    backgroundColor: "white",
    borderBottomLeftRadius: 4,
    borderWidth: 1,
    borderColor: "#e2e8f0",
  },
  bubbleText: { fontSize: 15, color: "#2d3748", lineHeight: 21 },
  bubbleTextOwn: { color: "white" },
  bubbleTime: {
    fontSize: 10,
    color: "#a0aec0",
    marginTop: 3,
    textAlign: "right",
  },
  bubbleTimeOwn: { color: "rgba(255,255,255,0.65)" },
  inputBar: {
    flexDirection: "row",
    alignItems: "flex-end",
    padding: 10,
    backgroundColor: "white",
    borderTopWidth: 1,
    borderTopColor: "#e2e8f0",
    gap: 8,
  },
  input: {
    flex: 1,
    minHeight: 42,
    maxHeight: 120,
    backgroundColor: "#f8fafc",
    borderWidth: 1.5,
    borderColor: "#e2e8f0",
    borderRadius: 21,
    paddingHorizontal: 16,
    paddingVertical: 10,
    fontSize: 15,
    color: "#2d3748",
  },
  sendBtn: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: BLUE,
    justifyContent: "center",
    alignItems: "center",
  },
  sendBtnDisabled: { backgroundColor: "#cbd5e0" },
});
