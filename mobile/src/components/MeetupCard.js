import React, { memo } from "react";
import { View, TouchableOpacity, StyleSheet } from "react-native";
import { Card, Text } from "react-native-paper";
import { Calendar, Clock, MapPin } from "lucide-react-native";

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

const MeetupCard = memo(({ meetup, onPress }) => (
  <TouchableOpacity onPress={() => onPress(meetup._id)}>
    <Card style={styles.card}>
      <Card.Content>
        <Text variant="titleMedium" style={styles.title}>
          {meetup.title}
        </Text>
        <View style={styles.details}>
          <View style={styles.detailRow}>
            <Calendar size={16} color="#2B6CB0" />
            <Text style={styles.detailText}>{formatDate(meetup.dateTime)}</Text>
          </View>
          <View style={styles.detailRow}>
            <Clock size={16} color="#2B6CB0" />
            <Text style={styles.detailText}>{formatTime(meetup.dateTime)}</Text>
          </View>
          {meetup.location?.city && (
            <View style={styles.detailRow}>
              <MapPin size={16} color="#2B6CB0" />
              <Text style={styles.detailText}>
                {meetup.location.city}, {meetup.location.state}
              </Text>
            </View>
          )}
        </View>
      </Card.Content>
    </Card>
  </TouchableOpacity>
));

const styles = StyleSheet.create({
  card: {
    marginBottom: 12,
    backgroundColor: "white",
  },
  title: {
    fontWeight: "700",
    color: "#2D3748",
    marginBottom: 10,
  },
  details: {
    gap: 6,
  },
  detailRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  detailText: {
    fontSize: 14,
    color: "#718096",
  },
});

export default MeetupCard;