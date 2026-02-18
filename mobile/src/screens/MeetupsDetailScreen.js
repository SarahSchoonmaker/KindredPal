import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
} from "react-native";
import { Avatar, Button, Chip, Divider } from "react-native-paper";
import {
  Calendar,
  MapPin,
  Users,
  Clock,
  Edit,
  Trash2,
} from "lucide-react-native";
import api from "../services/api";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function MeetupDetailsScreen({ route, navigation }) {
  const { meetupId } = route.params;
  const [meetup, setMeetup] = useState(null);
  const [currentUserId, setCurrentUserId] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMeetupDetails();
    fetchCurrentUser();
  }, [meetupId]);

  const fetchCurrentUser = async () => {
    try {
      const userId = await AsyncStorage.getItem("userId");
      setCurrentUserId(userId);
    } catch (error) {
      console.error("Error fetching user ID:", error);
    }
  };

  const fetchMeetupDetails = async () => {
    try {
      const response = await api.get(`/meetups/${meetupId}`);
      setMeetup(response.data);
    } catch (error) {
      console.error("Error fetching meetup:", error);
      Alert.alert("Error", "Failed to load meetup details");
    } finally {
      setLoading(false);
    }
  };

  const handleRSVP = async (status) => {
    try {
      await api.post(`/meetups/${meetupId}/rsvp`, { status });
      fetchMeetupDetails();
      Alert.alert("Success", `RSVP updated to: ${status}`);
    } catch (error) {
      console.error("Error updating RSVP:", error);
      Alert.alert("Error", "Failed to update RSVP");
    }
  };

  const handleDelete = () => {
    Alert.alert(
      "Delete Meetup",
      "Are you sure you want to delete this meetup?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            try {
              await api.delete(`/meetups/${meetupId}`);
              navigation.goBack();
            } catch (error) {
              Alert.alert("Error", "Failed to delete meetup");
            }
          },
        },
      ],
    );
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      weekday: "long",
      month: "long",
      day: "numeric",
      year: "numeric",
    });
  };

  const formatTime = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
    });
  };

  const getUserRSVP = () => {
    if (!meetup || !currentUserId) return null;
    const rsvp = meetup.rsvps.find((r) => r.user._id === currentUserId);
    return rsvp ? rsvp.status : null;
  };

  if (loading) {
    return (
      <View style={styles.centerContainer}>
        <Text>Loading...</Text>
      </View>
    );
  }

  if (!meetup) {
    return (
      <View style={styles.centerContainer}>
        <Text>Meetup not found</Text>
      </View>
    );
  }

  const isCreator = currentUserId === meetup.creator._id;
  const userRSVP = getUserRSVP();
  const goingCount = meetup.rsvps.filter((r) => r.status === "going").length;
  const maybeCount = meetup.rsvps.filter((r) => r.status === "maybe").length;

  return (
    <ScrollView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerContent}>
          <Text style={styles.title}>{meetup.title}</Text>
          <View style={styles.creatorInfo}>
            <Avatar.Image
              size={40}
              source={{ uri: meetup.creator.profilePhoto }}
            />
            <Text style={styles.hostedBy}>Hosted by {meetup.creator.name}</Text>
          </View>
        </View>

        {isCreator && (
          <View style={styles.creatorActions}>
            <TouchableOpacity
              style={styles.iconButton}
              onPress={() =>
                Alert.alert("Edit", "Edit functionality coming soon!")
              }
            >
              <Edit color="#2B6CB0" size={24} />
            </TouchableOpacity>
            <TouchableOpacity style={styles.iconButton} onPress={handleDelete}>
              <Trash2 color="#E53E3E" size={24} />
            </TouchableOpacity>
          </View>
        )}
      </View>

      <Divider />

      {/* Info Cards */}
      <View style={styles.infoSection}>
        <View style={styles.infoCard}>
          <Calendar color="#2B6CB0" size={24} />
          <View style={styles.infoText}>
            <Text style={styles.infoLabel}>Date</Text>
            <Text style={styles.infoValue}>{formatDate(meetup.dateTime)}</Text>
          </View>
        </View>

        <View style={styles.infoCard}>
          <Clock color="#2B6CB0" size={24} />
          <View style={styles.infoText}>
            <Text style={styles.infoLabel}>Time</Text>
            <Text style={styles.infoValue}>{formatTime(meetup.dateTime)}</Text>
          </View>
        </View>

        {meetup.location && (
          <View style={styles.infoCard}>
            <MapPin color="#2B6CB0" size={24} />
            <View style={styles.infoText}>
              <Text style={styles.infoLabel}>Location</Text>
              {meetup.location.address && (
                <Text style={styles.infoValue}>{meetup.location.address}</Text>
              )}
              <Text style={styles.infoValue}>
                {meetup.location.city}, {meetup.location.state}
              </Text>
            </View>
          </View>
        )}

        <View style={styles.infoCard}>
          <Users color="#2B6CB0" size={24} />
          <View style={styles.infoText}>
            <Text style={styles.infoLabel}>Attendees</Text>
            <Text style={styles.infoValue}>
              {goingCount} going, {maybeCount} maybe
              {meetup.maxAttendees && ` • Max: ${meetup.maxAttendees}`}
            </Text>
          </View>
        </View>
      </View>

      {/* Description */}
      {meetup.description && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>About This Meetup</Text>
          <Text style={styles.description}>{meetup.description}</Text>
        </View>
      )}

      {/* RSVP Buttons */}
      {!isCreator && (
        <View style={styles.rsvpSection}>
          <Text style={styles.sectionTitle}>Will you attend?</Text>
          <View style={styles.rsvpButtons}>
            <Button
              mode={userRSVP === "going" ? "contained" : "outlined"}
              onPress={() => handleRSVP("going")}
              style={[
                styles.rsvpButton,
                userRSVP === "going" && styles.rsvpButtonGoing,
              ]}
              labelStyle={styles.rsvpButtonLabel}
            >
              ✓ Going
            </Button>
            <Button
              mode={userRSVP === "maybe" ? "contained" : "outlined"}
              onPress={() => handleRSVP("maybe")}
              style={[
                styles.rsvpButton,
                userRSVP === "maybe" && styles.rsvpButtonMaybe,
              ]}
              labelStyle={styles.rsvpButtonLabel}
            >
              ? Maybe
            </Button>
            <Button
              mode={userRSVP === "not-going" ? "contained" : "outlined"}
              onPress={() => handleRSVP("not-going")}
              style={[
                styles.rsvpButton,
                userRSVP === "not-going" && styles.rsvpButtonNotGoing,
              ]}
              labelStyle={styles.rsvpButtonLabel}
            >
              ✗ Can't Go
            </Button>
          </View>
        </View>
      )}

      {/* Guest List */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Guest List</Text>

        {/* Going */}
        {goingCount > 0 && (
          <View style={styles.guestCategory}>
            <Text style={styles.categoryTitle}>Going ({goingCount})</Text>
            {meetup.rsvps
              .filter((rsvp) => rsvp.status === "going")
              .map((rsvp) => (
                <View key={rsvp.user._id} style={styles.guestItem}>
                  <Avatar.Image
                    size={48}
                    source={{ uri: rsvp.user.profilePhoto }}
                  />
                  <Text style={styles.guestName}>{rsvp.user.name}</Text>
                </View>
              ))}
          </View>
        )}

        {/* Maybe */}
        {maybeCount > 0 && (
          <View style={styles.guestCategory}>
            <Text style={styles.categoryTitle}>Maybe ({maybeCount})</Text>
            {meetup.rsvps
              .filter((rsvp) => rsvp.status === "maybe")
              .map((rsvp) => (
                <View key={rsvp.user._id} style={styles.guestItem}>
                  <Avatar.Image
                    size={48}
                    source={{ uri: rsvp.user.profilePhoto }}
                  />
                  <Text style={styles.guestName}>{rsvp.user.name}</Text>
                </View>
              ))}
          </View>
        )}

        {/* Invited */}
        <View style={styles.guestCategory}>
          <Text style={styles.categoryTitle}>Invited</Text>
          {meetup.invitedUsers
            .filter(
              (user) => !meetup.rsvps.some((r) => r.user._id === user._id),
            )
            .map((user) => (
              <View key={user._id} style={styles.guestItem}>
                <Avatar.Image size={48} source={{ uri: user.profilePhoto }} />
                <View>
                  <Text style={styles.guestName}>{user.name}</Text>
                  <Text style={styles.guestStatus}>Not responded</Text>
                </View>
              </View>
            ))}
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F7FAFC",
  },
  centerContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 20,
    backgroundColor: "white",
  },
  headerContent: {
    flex: 1,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#2D2D2D",
    marginBottom: 12,
  },
  creatorInfo: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  hostedBy: {
    fontSize: 15,
    color: "#666",
  },
  creatorActions: {
    flexDirection: "row",
    gap: 8,
  },
  iconButton: {
    padding: 8,
  },
  infoSection: {
    padding: 20,
    backgroundColor: "white",
    gap: 16,
  },
  infoCard: {
    flexDirection: "row",
    gap: 12,
  },
  infoText: {
    flex: 1,
  },
  infoLabel: {
    fontSize: 12,
    color: "#999",
    textTransform: "uppercase",
    fontWeight: "600",
    marginBottom: 4,
  },
  infoValue: {
    fontSize: 15,
    color: "#2D2D2D",
    fontWeight: "500",
  },
  section: {
    padding: 20,
    backgroundColor: "white",
    marginTop: 8,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "600",
    color: "#2D2D2D",
    marginBottom: 16,
  },
  description: {
    fontSize: 15,
    color: "#666",
    lineHeight: 22,
  },
  rsvpSection: {
    padding: 20,
    backgroundColor: "#F7FAFC",
    marginTop: 8,
  },
  rsvpButtons: {
    flexDirection: "row",
    gap: 8,
  },
  rsvpButton: {
    flex: 1,
  },
  rsvpButtonGoing: {
    backgroundColor: "#48BB78",
  },
  rsvpButtonMaybe: {
    backgroundColor: "#ED64A6",
  },
  rsvpButtonNotGoing: {
    backgroundColor: "#E53E3E",
  },
  rsvpButtonLabel: {
    fontSize: 13,
  },
  guestCategory: {
    marginBottom: 24,
  },
  categoryTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#666",
    marginBottom: 12,
  },
  guestItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    padding: 12,
    backgroundColor: "#F7FAFC",
    borderRadius: 8,
    marginBottom: 8,
  },
  guestName: {
    fontSize: 15,
    fontWeight: "600",
    color: "#2D2D2D",
  },
  guestStatus: {
    fontSize: 13,
    color: "#999",
  },
});
