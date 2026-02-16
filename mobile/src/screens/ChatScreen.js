import React, { useState, useEffect, useRef } from "react";
import {
  View,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  FlatList,
  TouchableOpacity,
  Alert,
} from "react-native";
import { Text, TextInput, Avatar, ActivityIndicator } from "react-native-paper";
import { Send, MoreVertical } from "lucide-react-native";
import { messageAPI, userAPI } from "../services/api";
import { Menu } from "react-native-paper";

export default function ChatScreen({ route, navigation }) {
  const { match, userId, userName, userPhoto } = route.params;
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [menuVisible, setMenuVisible] = useState(false);
  const flatListRef = useRef(null);

  const chatUserId = match?._id || userId;
  const chatUserName = match?.name || userName;
  const chatUserPhoto = match?.profilePhoto || userPhoto;

  useEffect(() => {
    if (chatUserId) {
      fetchMessages();
      // Set custom header with menu
      navigation.setOptions({
        headerTitle: chatUserName || "Chat",
        headerRight: () => (
          <Menu
            visible={menuVisible}
            onDismiss={() => setMenuVisible(false)}
            anchor={
              <TouchableOpacity
                style={{ paddingRight: 16 }}
                onPress={() => setMenuVisible(true)}
              >
                <MoreVertical size={24} color="white" />
              </TouchableOpacity>
            }
          >
            <Menu.Item
              onPress={() => {
                setMenuVisible(false);
                navigation.navigate("UserProfile", { userId: chatUserId });
              }}
              title="View Profile"
              leadingIcon="account"
            />
            <Menu.Item
              onPress={() => {
                setMenuVisible(false);
                handleReport();
              }}
              title="Report User"
              leadingIcon="flag"
            />
            <Menu.Item
              onPress={() => {
                setMenuVisible(false);
                handleBlock();
              }}
              title="Block User"
              leadingIcon="block-helper"
            />
          </Menu>
        ),
      });
    }
  }, [chatUserId, menuVisible, navigation]);

  const fetchMessages = async () => {
    try {
      const response = await messageAPI.getMessages(chatUserId);
      setMessages(response.data || []);
    } catch (error) {
      logger.error("Error fetching messages:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleReport = () => {
    Alert.alert(
      "Report User",
      "Why are you reporting this user?",
      [
        {
          text: "Inappropriate messages",
          onPress: () => submitReport("Inappropriate messages"),
        },
        {
          text: "Fake profile/Catfishing",
          onPress: () => submitReport("Fake profile/Catfishing"),
        },
        {
          text: "Harassment",
          onPress: () => submitReport("Harassment"),
        },
        {
          text: "Spam",
          onPress: () => submitReport("Spam"),
        },
        {
          text: "Other",
          onPress: () => submitReport("Other"),
        },
        { text: "Cancel", style: "cancel" },
      ],
      { cancelable: true },
    );
  };

  const submitReport = async (reason) => {
    try {
      await userAPI.reportUser(chatUserId, reason);
      Alert.alert(
        "Report Submitted",
        "Thank you for your report. Our team will review it shortly.",
        [{ text: "OK" }],
      );
    } catch (error) {
      logger.error("Error reporting user:", error);
      Alert.alert("Error", "Failed to submit report. Please try again.");
    }
  };

  const handleBlock = () => {
    Alert.alert(
      "Block User",
      `Are you sure you want to block ${chatUserName}? You won't be able to see each other's profiles or send messages.`,
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
              await userAPI.blockUser(chatUserId);
              Alert.alert("User Blocked", `${chatUserName} has been blocked.`, [
                {
                  text: "OK",
                  onPress: () => navigation.navigate("Messages"),
                },
              ]);
            } catch (error) {
              logger.error("Error blocking user:", error);
              Alert.alert("Error", "Failed to block user. Please try again.");
            }
          },
        },
      ],
    );
  };

  const handleSend = async () => {
    if (!newMessage.trim() || sending) return;

    const messageText = newMessage.trim();
    setNewMessage("");
    setSending(true);

    try {
      const response = await messageAPI.sendMessage(chatUserId, messageText);
      setMessages((prev) => [...prev, response.data]);
      setTimeout(() => {
        flatListRef.current?.scrollToEnd({ animated: true });
      }, 100);
    } catch (error) {
      logger.error("Error sending message:", error);
      Alert.alert("Error", "Failed to send message. Please try again.");
      setNewMessage(messageText);
    } finally {
      setSending(false);
    }
  };

  const renderMessage = ({ item }) => {
    const isMyMessage = item.sender === "currentUser" || item.isCurrentUser;

    return (
      <View
        style={[
          styles.messageBubble,
          isMyMessage ? styles.myMessage : styles.theirMessage,
        ]}
      >
        <Text
          style={[
            styles.messageText,
            isMyMessage ? styles.myMessageText : styles.theirMessageText,
          ]}
        >
          {item.content}
        </Text>
        <Text
          style={[
            styles.timestamp,
            isMyMessage ? styles.myTimestamp : styles.theirTimestamp,
          ]}
        >
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
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#2B6CB0" />
      </View>
    );
  }

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      keyboardVerticalOffset={90}
    >
      <FlatList
        ref={flatListRef}
        data={messages}
        renderItem={renderMessage}
        keyExtractor={(item) => item._id}
        contentContainerStyle={styles.messagesList}
        onContentSizeChange={() =>
          flatListRef.current?.scrollToEnd({ animated: false })
        }
      />

      <View style={styles.inputContainer}>
        <TextInput
          mode="outlined"
          placeholder="Type a message..."
          value={newMessage}
          onChangeText={setNewMessage}
          style={styles.input}
          multiline
          maxLength={500}
          outlineColor="#E2E8F0"
          activeOutlineColor="#2B6CB0"
        />
        <TouchableOpacity
          style={[
            styles.sendButton,
            (!newMessage.trim() || sending) && styles.sendButtonDisabled,
          ]}
          onPress={handleSend}
          disabled={!newMessage.trim() || sending}
        >
          {sending ? (
            <ActivityIndicator size="small" color="white" />
          ) : (
            <Send size={20} color="white" />
          )}
        </TouchableOpacity>
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
  },
  messagesList: {
    padding: 16,
    paddingBottom: 8,
  },
  messageBubble: {
    maxWidth: "75%",
    marginBottom: 12,
    padding: 12,
    borderRadius: 16,
  },
  myMessage: {
    alignSelf: "flex-end",
    backgroundColor: "#2B6CB0",
    borderBottomRightRadius: 4,
  },
  theirMessage: {
    alignSelf: "flex-start",
    backgroundColor: "white",
    borderBottomLeftRadius: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 1,
  },
  messageText: {
    fontSize: 15,
    lineHeight: 20,
  },
  myMessageText: {
    color: "white",
  },
  theirMessageText: {
    color: "#2D3748",
  },
  timestamp: {
    fontSize: 11,
    marginTop: 4,
  },
  myTimestamp: {
    color: "rgba(255, 255, 255, 0.7)",
    textAlign: "right",
  },
  theirTimestamp: {
    color: "#A0AEC0",
  },
  inputContainer: {
    flexDirection: "row",
    padding: 12,
    backgroundColor: "white",
    borderTopWidth: 1,
    borderTopColor: "#E2E8F0",
    alignItems: "flex-end",
    gap: 8,
  },
  input: {
    flex: 1,
    maxHeight: 100,
    backgroundColor: "white",
  },
  sendButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "#2B6CB0",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 4,
  },
  sendButtonDisabled: {
    backgroundColor: "#CBD5E0",
  },
});
