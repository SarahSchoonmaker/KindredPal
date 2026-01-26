import React, { useState, useEffect, useRef } from "react";
import {
  View,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { Text, TextInput, IconButton } from "react-native-paper";
import { Send } from "lucide-react-native";

export default function ChatScreen({ route }) {
  const { match } = route.params;
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const scrollViewRef = useRef();

  // Mock messages - later use Socket.IO
  useEffect(() => {
    setMessages([
      {
        id: 1,
        text: "Hey! How are you doing?",
        sender: "them",
        timestamp: new Date(Date.now() - 3600000),
      },
      {
        id: 2,
        text: "Hi! I'm doing great, thanks! How about you?",
        sender: "me",
        timestamp: new Date(Date.now() - 3000000),
      },
      {
        id: 3,
        text: "Pretty good! I saw we both love fitness. Do you have a favorite workout?",
        sender: "them",
        timestamp: new Date(Date.now() - 2400000),
      },
    ]);
  }, []);

  const handleSend = () => {
    if (!newMessage.trim()) return;

    const message = {
      id: Date.now(),
      text: newMessage.trim(),
      sender: "me",
      timestamp: new Date(),
    };

    setMessages([...messages, message]);
    setNewMessage("");

    // TODO: Send via Socket.IO to backend
    // socket.emit('send-message', { recipientId: match.id, content: message.text });

    // Scroll to bottom
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
      >
        {messages.map((message) => (
          <View
            key={message.id}
            style={[
              styles.messageBubble,
              message.sender === "me" ? styles.myMessage : styles.theirMessage,
            ]}
          >
            <Text style={styles.messageText}>{message.text}</Text>
            <Text style={styles.messageTime}>
              {formatTime(message.timestamp)}
            </Text>
          </View>
        ))}
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
          right={
            <TextInput.Icon
              icon={() => <Send size={24} color="#2B6CB0" />}
              onPress={handleSend}
              disabled={!newMessage.trim()}
            />
          }
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
  messagesContainer: {
    flex: 1,
  },
  messagesContent: {
    padding: 16,
    paddingBottom: 8,
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
  messageTime: {
    fontSize: 11,
    marginTop: 4,
    opacity: 0.7,
    color: "#666",
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
