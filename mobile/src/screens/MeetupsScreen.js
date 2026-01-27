import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  RefreshControl,
  Alert,
} from "react-native";
import { FAB, Card, Avatar } from "react-native-paper";
import { Calendar, MapPin, Users, Clock } from "lucide-react-native";
import api from "../services/api";
import CreateMeetupModal from "../components/CreateMeetupModal";

export default function MeetupsScreen({ navigation }) {
  const [meetups, setMeetups] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);

  useEffect(() => {
    fetchMeetups();
  }, []);

  const fetchMeetups = async () => {
    try {
      console.log("📥 Fetching meetups...");

      // Add a timeout
      const timeoutPromise = new Promise((_, reject) =>
        setTimeout(() => reject(new Error("Request timeout")), 10000),
      );

      const response = await Promise.race([
        api.get("/meetups"),
        timeoutPromise,
      ]);

      console.log("✅ Meetups response:", response.data);
      console.log("📊 Number of meetups:", response.data?.length || 0);
      setMeetups(response.data || []);
    } catch (error) {
      console.error("❌ Error fetching meetups:", error);
      console.error("❌ Error message:", error.message);
      console.error("❌ Error response:", error.response?.data);
      console.error("❌ Error status:", error.response?.status);
      Alert.alert("Error", "Failed to load meetups: " + error.message);
    } finally {
      console.log("🏁 Fetch meetups finally block");
      setLoading(false);
      setRefreshing(false);
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      weekday: "short",
      month: "short",
      day: "numeric",
    });
  };

  const formatTime = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
    });
  };

  const onRefresh = () => {
    setRefreshing(true);
    fetchMeetups();
  };

  const renderMeetup = ({ item }) => {
    const goingCount =
      item.rsvps?.filter((r) => r.status === "going").length || 0;

    return (
      <TouchableOpacity
        onPress={() =>
          navigation.navigate("MeetupDetails", { meetupId: item._id })
        }
      >
        <Card style={styles.card}>
          <Card.Content>
            <View style={styles.cardHeader}>
              <Text style={styles.title}>{item.title}</Text>
              <View style={styles.attendeeCount}>
                <Users color="#2B6CB0" size={16} />
                <Text style={styles.attendeeText}>{goingCount} going</Text>
              </View>
            </View>

            <View style={styles.details}>
              <View style={styles.detail}>
                <Calendar color="#2B6CB0" size={18} />
                <Text style={styles.detailText}>
                  {formatDate(item.dateTime)}
                </Text>
              </View>

              <View style={styles.detail}>
                <Clock color="#2B6CB0" size={18} />
                <Text style={styles.detailText}>
                  {formatTime(item.dateTime)}
                </Text>
              </View>

              {item.location && (
                <View style={styles.detail}>
                  <MapPin color="#2B6CB0" size={18} />
                  <Text style={styles.detailText}>
                    {item.location.city}, {item.location.state}
                  </Text>
                </View>
              )}
            </View>

            {item.description && (
              <Text style={styles.description} numberOfLines={2}>
                {item.description}
              </Text>
            )}

            <View style={styles.creator}>
              <Avatar.Image
                size={32}
                source={{ uri: item.creator?.profilePhoto }}
              />
              <Text style={styles.creatorText}>by {item.creator?.name}</Text>
            </View>
          </Card.Content>
        </Card>
      </TouchableOpacity>
    );
  };

  if (loading) {
    return (
      <View style={styles.centerContainer}>
        <Text>Loading meetups...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {meetups.length === 0 ? (
        <View style={styles.emptyState}>
          <Calendar color="#CBD5E0" size={64} />
          <Text style={styles.emptyTitle}>No Meetups Yet</Text>
          <Text style={styles.emptyText}>
            Create a meetup to connect with your matches in person!
          </Text>
        </View>
      ) : (
        <FlatList
          data={meetups}
          renderItem={renderMeetup}
          keyExtractor={(item) => item._id}
          contentContainerStyle={styles.list}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
        />
      )}

      <FAB
        icon="plus"
        style={styles.fab}
        onPress={() => {
          console.log("📝 Opening create modal");
          setShowCreateModal(true);
        }}
        color="white"
      />

      <CreateMeetupModal
        visible={showCreateModal}
        onClose={() => {
          console.log("❌ Closing create modal");
          setShowCreateModal(false);
        }}
        onSuccess={() => {
          console.log("✅ Meetup created successfully");
          fetchMeetups();
        }}
      />
    </View>
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
  list: {
    padding: 16,
  },
  card: {
    marginBottom: 16,
    backgroundColor: "white",
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 12,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#2D2D2D",
    flex: 1,
  },
  attendeeCount: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  attendeeText: {
    color: "#2B6CB0",
    fontSize: 14,
    fontWeight: "600",
  },
  details: {
    gap: 8,
    marginBottom: 12,
  },
  detail: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  detailText: {
    color: "#666",
    fontSize: 14,
  },
  description: {
    color: "#666",
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 12,
  },
  creator: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: "#E2E8F0",
  },
  creatorText: {
    color: "#666",
    fontSize: 14,
  },
  emptyState: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 40,
  },
  emptyTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#2D2D2D",
    marginTop: 16,
    marginBottom: 8,
  },
  emptyText: {
    fontSize: 16,
    color: "#666",
    textAlign: "center",
  },
  fab: {
    position: "absolute",
    right: 16,
    bottom: 16,
    backgroundColor: "#2B6CB0",
  },
});
