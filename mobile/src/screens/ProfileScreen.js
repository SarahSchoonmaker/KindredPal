import React, { useState } from "react";
import { View, StyleSheet, ScrollView, Alert } from "react-native";
import {
  Text,
  Card,
  Avatar,
  Button,
  List,
  Switch,
  Divider,
} from "react-native-paper";
import {
  User,
  Mail,
  MapPin,
  Heart,
  Settings,
  LogOut,
  Trash2,
} from "lucide-react-native";

export default function ProfileScreen({ navigation }) {
  const [emailNotifications, setEmailNotifications] = useState({
    newMatch: true,
    newMessage: true,
  });

  // Mock user data - later fetch from API
  const user = {
    name: "Sarah",
    age: 46,
    email: "sarah1@gmail.com",
    location: "Palm Beach, FL",
    bio: "CEO. I enjoy going to the gym.",
    photo: "https://randomuser.me/api/portraits/women/1.jpg",
    causes: ["Health & Wellness", "Fitness", "Entrepreneurship"],
  };

  const handleEditProfile = () => {
    Alert.alert("Edit Profile", "Profile editing coming soon!");
  };

  const handleToggleNotification = (type) => {
    setEmailNotifications((prev) => ({
      ...prev,
      [type]: !prev[type],
    }));
    // TODO: Save to API
  };

  const handleLogout = () => {
    Alert.alert("Logout", "Are you sure you want to logout?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Logout",
        style: "destructive",
        onPress: () => navigation.replace("Login"),
      },
    ]);
  };

  const handleDeleteAccount = () => {
    Alert.alert(
      "⚠️ Delete Account",
      "Are you absolutely sure? This action cannot be undone. All your matches, messages, and profile data will be permanently deleted.",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete Forever",
          style: "destructive",
          onPress: () => {
            // TODO: Call delete API
            Alert.alert("Account Deleted", "Your account has been deleted.");
            navigation.replace("Login");
          },
        },
      ],
    );
  };

  return (
    <ScrollView style={styles.container}>
      {/* Profile Header */}
      <Card style={styles.profileCard}>
        <Card.Content style={styles.profileHeader}>
          <Avatar.Image size={100} source={{ uri: user.photo }} />
          <View style={styles.profileInfo}>
            <Text variant="headlineMedium" style={styles.name}>
              {user.name}, {user.age}
            </Text>
            <View style={styles.infoRow}>
              <MapPin size={16} color="#666" />
              <Text variant="bodyMedium" style={styles.location}>
                {user.location}
              </Text>
            </View>
            <View style={styles.infoRow}>
              <Mail size={16} color="#666" />
              <Text variant="bodyMedium" style={styles.email}>
                {user.email}
              </Text>
            </View>
          </View>
        </Card.Content>
      </Card>

      {/* Bio */}
      <Card style={styles.card}>
        <Card.Content>
          <Text variant="titleMedium" style={styles.sectionTitle}>
            About Me
          </Text>
          <Text variant="bodyMedium" style={styles.bio}>
            {user.bio}
          </Text>
        </Card.Content>
      </Card>

      {/* Causes */}
      <Card style={styles.card}>
        <Card.Content>
          <Text variant="titleMedium" style={styles.sectionTitle}>
            My Interests
          </Text>
          <View style={styles.tags}>
            {user.causes.map((cause, index) => (
              <View key={index} style={styles.tag}>
                <Text style={styles.tagText}>{cause}</Text>
              </View>
            ))}
          </View>
        </Card.Content>
      </Card>

      {/* Email Notifications */}
      <Card style={styles.card}>
        <Card.Content>
          <Text variant="titleMedium" style={styles.sectionTitle}>
            <Mail size={20} color="#2B6CB0" /> Email Notifications
          </Text>
          <List.Item
            title="New Match Notifications"
            description="Get notified when someone matches with you"
            right={() => (
              <Switch
                value={emailNotifications.newMatch}
                onValueChange={() => handleToggleNotification("newMatch")}
                color="#2B6CB0"
              />
            )}
          />
          <Divider />
          <List.Item
            title="New Message Notifications"
            description="Get notified when you receive a message"
            right={() => (
              <Switch
                value={emailNotifications.newMessage}
                onValueChange={() => handleToggleNotification("newMessage")}
                color="#2B6CB0"
              />
            )}
          />
        </Card.Content>
      </Card>

      {/* Actions */}
      <View style={styles.actions}>
        <Button
          mode="contained"
          icon={() => <Settings size={20} color="white" />}
          onPress={handleEditProfile}
          style={styles.editButton}
        >
          Edit Profile
        </Button>

        <Button
          mode="outlined"
          icon={() => <LogOut size={20} color="#666" />}
          onPress={handleLogout}
          style={styles.logoutButton}
          textColor="#666"
        >
          Logout
        </Button>
      </View>

      {/* Danger Zone */}
      <Card style={styles.dangerCard}>
        <Card.Content>
          <Text variant="titleMedium" style={styles.dangerTitle}>
            Danger Zone
          </Text>
          <Text variant="bodySmall" style={styles.dangerText}>
            Once you delete your account, there is no going back. Please be
            certain.
          </Text>
          <Button
            mode="outlined"
            icon={() => <Trash2 size={20} color="#E53E3E" />}
            onPress={handleDeleteAccount}
            style={styles.deleteButton}
            textColor="#E53E3E"
          >
            Delete Account
          </Button>
        </Card.Content>
      </Card>

      <View style={styles.footer} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F7FAFC",
  },
  profileCard: {
    margin: 16,
    marginBottom: 12,
    backgroundColor: "white",
    elevation: 2,
  },
  profileHeader: {
    flexDirection: "row",
    alignItems: "center",
    padding: 8,
  },
  profileInfo: {
    marginLeft: 20,
    flex: 1,
  },
  name: {
    fontWeight: "bold",
    color: "#2d2d2d",
    marginBottom: 8,
  },
  infoRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 4,
  },
  location: {
    marginLeft: 8,
    color: "#666",
  },
  email: {
    marginLeft: 8,
    color: "#666",
  },
  card: {
    marginHorizontal: 16,
    marginBottom: 12,
    backgroundColor: "white",
    elevation: 2,
  },
  sectionTitle: {
    fontWeight: "600",
    color: "#2d2d2d",
    marginBottom: 12,
  },
  bio: {
    color: "#666",
    lineHeight: 22,
  },
  tags: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  tag: {
    backgroundColor: "#E3F2FD",
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  tagText: {
    color: "#2B6CB0",
    fontSize: 14,
    fontWeight: "600",
  },
  actions: {
    padding: 16,
    gap: 12,
  },
  editButton: {
    backgroundColor: "#2B6CB0",
  },
  logoutButton: {
    borderColor: "#CBD5E0",
  },
  dangerCard: {
    marginHorizontal: 16,
    marginBottom: 12,
    backgroundColor: "#FFF5F5",
    borderColor: "#FED7D7",
    borderWidth: 1,
  },
  dangerTitle: {
    color: "#E53E3E",
    fontWeight: "600",
    marginBottom: 8,
  },
  dangerText: {
    color: "#666",
    marginBottom: 16,
    lineHeight: 20,
  },
  deleteButton: {
    borderColor: "#E53E3E",
  },
  footer: {
    height: 40,
  },
});
