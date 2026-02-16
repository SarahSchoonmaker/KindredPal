import React, { useState, useEffect, useRef } from "react";
import {
  View,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Alert,
  TouchableOpacity,
} from "react-native";
import {
  Text,
  TextInput,
  ActivityIndicator,
  IconButton,
} from "react-native-paper";
import { Send, MoreVertical, Flag, UserX } from "lucide-react-native";
import { messageAPI, userAPI } from "../services/api";
import io from "socket.io-client";

const SOCKET_URL = "https://kindredpal-production.up.railway.app";

export default function ChatScreen({ route, navigation }) {
  const { match } = route.params;
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const scrollViewRef = useRef();
  const socketRef = useRef();

  // Set navigation header with actions menu
  useEffect(() => {
    navigation.setOptions({
      title: match.name,
      headerRight: () => (
        <TouchableOpacity onPress={showActionsMenu} style={{ marginRight: 16 }}>
          <MoreVertical size={24} color="#2B6CB0" />
        </TouchableOpacity>
      ),
    });
  }, [navigation, match]);

  useEffect(() => {
    fetchMessages();
    setupSocket();

    return () => {
      if (socketRef.current) {
        socketRef.current.disconnect();
      }
    };
  }, []);

  const setupSocket = () => {
    const token = global.authToken;
    if (!token) return;

    socketRef.current = io(SOCKET_URL, {
      auth: { token },
      transports: ["websocket"],
    });

    socketRef.current.on("connect", () => {
      console.log("🔌 Socket connected");
    });

    socketRef.current.on("new-message", (message) => {
      console.log("📨 New message received:", message);
      if (message.senderId === match._id || message.recipientId === match._id) {
        setMessages((prev) => [
          ...prev,
          {
            id: message._id,
            text: message.content,
            sender: message.senderId === match._id ? "them" : "me",
            timestamp: new Date(message.createdAt),
          },
        ]);
        scrollToBottom();
      }
    });

    socketRef.current.on("disconnect", () => {
      console.log("🔌 Socket disconnected");
    });
  };

  const fetchMessages = async () => {
    try {
      console.log("📥 Fetching messages with:", match._id);
      const response = await messageAPI.getMessages(match._id);
      const messagesData = response.data || [];

      const formattedMessages = messagesData.map((msg) => ({
        id: msg._id,
        text: msg.content,
        sender: msg.senderId === match._id ? "them" : "me",
        timestamp: new Date(msg.createdAt),
      }));

      console.log("✅ Loaded", formattedMessages.length, "messages");
      setMessages(formattedMessages);

      // Mark messages as read
      setTimeout(() => {
        messagesData
          .filter((msg) => msg.senderId === match._id && !msg.read)
          .forEach((msg) => {
            messageAPI
              .markAsRead(msg._id)
              .catch((err) => console.error("Error marking as read:", err));
          });
      }, 1000);
    } catch (error) {
      console.error("❌ Error fetching messages:", error);
    } finally {
      setLoading(false);
      setTimeout(scrollToBottom, 100);
    }
  };

  const handleSend = async () => {
    if (!newMessage.trim()) return;

    const messageText = newMessage.trim();
    const tempId = Date.now();

    // Optimistic update
    const optimisticMessage = {
      id: tempId,
      text: messageText,
      sender: "me",
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, optimisticMessage]);
    setNewMessage("");
    scrollToBottom();

    setSending(true);
    try {
      const response = await messageAPI.sendMessage(match._id, messageText);
      console.log("✅ Message sent:", response.data);

      // Update with real message from server
      setMessages((prev) =>
        prev.map((msg) =>
          msg.id === tempId ? { ...msg, id: response.data._id } : msg,
        ),
      );
    } catch (error) {
      console.error("❌ Error sending message:", error);
      // Remove failed message
      setMessages((prev) => prev.filter((msg) => msg.id !== tempId));
      setNewMessage(messageText); // Restore message text
    } finally {
      setSending(false);
    }
  };

  // Show actions menu (Report/Block)
  const showActionsMenu = () => {
    Alert.alert(
      `Actions for ${match.name}`,
      "Choose an action",
      [
        {
          text: "Report User",
          onPress: showReportOptions,
          style: "destructive",
        },
        {
          text: "Block User",
          onPress: handleBlock,
          style: "destructive",
        },
        {
          text: "Cancel",
          style: "cancel",
        },
      ],
      { cancelable: true },
    );
  };

  // Show report reasons
  const showReportOptions = () => {
    Alert.alert(
      `Report ${match.name}`,
      "Why are you reporting this user?",
      [
        {
          text: "Inappropriate Messages",
          onPress: () => submitReport("Inappropriate messages"),
        },
        {
          text: "Fake Profile/Catfishing",
          onPress: () => submitReport("Fake profile/Catfishing"),
        },
        {
          text: "Harassment or Bullying",
          onPress: () => submitReport("Harassment or bullying"),
        },
        {
          text: "Spam or Scam",
          onPress: () => submitReport("Spam or scam"),
        },
        {
          text: "Inappropriate Photos",
          onPress: () => submitReport("Inappropriate photos"),
        },
        {
          text: "Other",
          onPress: () => submitReport("Other"),
        },
        {
          text: "Cancel",
          style: "cancel",
        },
      ],
      { cancelable: true },
    );
  };

  // Submit report
  const submitReport = async (reason) => {
    try {
      await userAPI.reportUser(match._id, reason);
      Alert.alert(
        "Reported",
        "Thank you for your report. Our team will review it shortly.",
      );
    } catch (error) {
      console.error("Error reporting user:", error);
      Alert.alert("Error", "Failed to submit report. Please try again.");
    }
  };

  // Block user
  const handleBlock = () => {
    Alert.alert(
      "Block User",
      `Block ${match.name}? They won't be able to see your profile or message you.`,
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Block",
          style: "destructive",
          onPress: async () => {
            try {
              await userAPI.blockUser(match._id);
              Alert.alert("Blocked", `${match.name} has been blocked.`, [
                {
                  text: "OK",
                  onPress: () => navigation.goBack(),
                },
              ]);
            } catch (error) {
              console.error("Error blocking user:", error);
              Alert.alert("Error", "Failed to block user. Please try again.");
            }
          },
        },
      ],
    );
  };

  const scrollToBottom = () => {
    setTimeout(() => {
      scrollViewRef.current?.scrollToEnd({ animated: true });
    }, 100);
  };

  const formatTime = (date) => {
    return new Date(date).toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#2B6CB0" />
        <Text style={styles.loadingText}>Loading chat...</Text>
      </View>
    );
  }

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      keyboardVerticalOffset={90}
    >
      {/* Messages */}
      <ScrollView
        ref={scrollViewRef}
        style={styles.messagesContainer}
        contentContainerStyle={styles.messagesContent}
        onContentSizeChange={scrollToBottom}
      >
        {messages.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>No messages yet. Say hello! 👋</Text>
          </View>
        ) : (
          messages.map((message) => (
            <View
              key={message.id}
              style={[
                styles.messageBubble,
                message.sender === "me"
                  ? styles.myMessage
                  : styles.theirMessage,
              ]}
            >
              <Text
                style={[
                  styles.messageText,
                  message.sender === "me" && styles.myMessageText,
                ]}
              >
                {message.text}
              </Text>
              <Text
                style={[
                  styles.messageTime,
                  message.sender === "me" && styles.myMessageTime,
                ]}
              >
                {formatTime(message.timestamp)}
              </Text>
            </View>
          ))
        )}
      </ScrollView>

      {/* Input */}
      <View style={styles.inputContainer}>
        <TextInput
          mode="outlined"
          placeholder={`Message ${match.name}...`}
          value={newMessage}
          onChangeText={setNewMessage}
          style={styles.input}
          multiline
          maxLength={1000}
          disabled={sending}
          right={
            <TextInput.Icon
              icon={() => (
                <Send
                  size={24}
                  color={newMessage.trim() ? "#2B6CB0" : "#999"}
                />
              )}
              onPress={handleSend}
              disabled={!newMessage.trim() || sending}
            />
          }
          onSubmitEditing={handleSend}
        />
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F7FAFC",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#F7FAFC",
  },
  loadingText: {
    marginTop: 16,
    color: "#666",
  },
  messagesContainer: {
    flex: 1,
  },
  messagesContent: {
    padding: 16,
    paddingBottom: 8,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 40,
  },
  emptyText: {
    color: "#999",
    fontSize: 16,
  },
  messageBubble: {
    maxWidth: "75%",
    padding: 12,
    borderRadius: 16,
    marginBottom: 8,
  },
  myMessage: {
    alignSelf: "flex-end",
    backgroundColor: "#2B6CB0",
  },
  theirMessage: {
    alignSelf: "flex-start",
    backgroundColor: "white",
    elevation: 1,
  },
  messageText: {
    fontSize: 16,
    lineHeight: 22,
    color: "#2d2d2d",
  },
  myMessageText: {
    color: "white",
  },
  messageTime: {
    fontSize: 11,
    marginTop: 4,
    color: "#666",
  },
  myMessageTime: {
    color: "rgba(255, 255, 255, 0.8)",
  },
  inputContainer: {
    padding: 12,
    backgroundColor: "white",
    borderTopWidth: 1,
    borderTopColor: "#E2E8F0",
  },
  input: {
    backgroundColor: "white",
  },
});
