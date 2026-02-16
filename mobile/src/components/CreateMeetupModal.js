import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Modal,
  TextInput,
  Alert,
} from "react-native";
import { Button, Checkbox, Avatar } from "react-native-paper";
import { X, Calendar, MapPin, Users, Tag, Clock } from "lucide-react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import api from "../services/api";

export default function CreateMeetupModal({ visible, onClose, onSuccess }) {
  const [matches, setMatches] = useState([]);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    location: {
      address: "",
      city: "",
      state: "",
    },
    dateTime: new Date(),
    invitedUsers: [],
    maxAttendees: "",
  });
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);

  useEffect(() => {
    if (visible) {
      fetchMatches();
    }
  }, [visible]);

  const fetchMatches = async () => {
    try {
      const response = await api.get("/users/matches");
      setMatches(response.data);
    } catch (error) {
      logger.error("Error fetching matches:", error);
    }
  };

  const handleUserToggle = (userId) => {
    setFormData((prev) => ({
      ...prev,
      invitedUsers: prev.invitedUsers.includes(userId)
        ? prev.invitedUsers.filter((id) => id !== userId)
        : [...prev.invitedUsers, userId],
    }));
  };

  const handleSelectAll = () => {
    if (formData.invitedUsers.length === matches.length) {
      setFormData((prev) => ({ ...prev, invitedUsers: [] }));
    } else {
      setFormData((prev) => ({
        ...prev,
        invitedUsers: matches.map((m) => m._id),
      }));
    }
  };

  const handleSubmit = async () => {
    if (!formData.title.trim()) {
      Alert.alert("Error", "Please enter a title");
      return;
    }

    if (formData.invitedUsers.length === 0) {
      Alert.alert("Error", "Please invite at least one person");
      return;
    }

    const location = {};
    if (formData.location.address) location.address = formData.location.address;
    if (formData.location.city) location.city = formData.location.city;
    if (formData.location.state) location.state = formData.location.state;

    const meetupData = {
      title: formData.title,
      description: formData.description || "",
      dateTime: formData.dateTime.toISOString(),
      invitedUsers: formData.invitedUsers,
    };

    if (Object.keys(location).length > 0) {
      meetupData.location = location;
    }

    if (formData.maxAttendees) {
      meetupData.maxAttendees = parseInt(formData.maxAttendees);
    }

    try {
      await api.post("/meetups", meetupData);
      Alert.alert("Success", "Meetup created successfully!");
      onSuccess();
      onClose();
      setFormData({
        title: "",
        description: "",
        location: { address: "", city: "", state: "" },
        dateTime: new Date(),
        invitedUsers: [],
        maxAttendees: "",
      });
    } catch (error) {
      logger.error("Error creating meetup:", error);
      Alert.alert("Error", "Failed to create meetup");
    }
  };

  const onDateChange = (event, selectedDate) => {
    setShowDatePicker(false);
    if (selectedDate) {
      setFormData((prev) => ({ ...prev, dateTime: selectedDate }));
    }
  };

  const onTimeChange = (event, selectedTime) => {
    setShowTimePicker(false);
    if (selectedTime) {
      const newDateTime = new Date(formData.dateTime);
      newDateTime.setHours(selectedTime.getHours());
      newDateTime.setMinutes(selectedTime.getMinutes());
      setFormData((prev) => ({ ...prev, dateTime: newDateTime }));
    }
  };

  const formatDate = (date) => {
    return date.toLocaleDateString("en-US", {
      weekday: "short",
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const formatTime = (date) => {
    return date.toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
    });
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      onRequestClose={onClose}
      presentationStyle="pageSheet"
    >
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Create Meetup</Text>
          <TouchableOpacity onPress={onClose} style={styles.closeButton}>
            <X color="#2B6CB0" size={24} />
          </TouchableOpacity>
        </View>

        <ScrollView style={styles.content}>
          {/* Title */}
          <View style={styles.section}>
            <View style={styles.labelRow}>
              <Tag color="#2B6CB0" size={18} />
              <Text style={styles.label}>Meetup Title *</Text>
            </View>
            <TextInput
              style={styles.input}
              value={formData.title}
              onChangeText={(text) =>
                setFormData((prev) => ({ ...prev, title: text }))
              }
              placeholder="Coffee & Conversation"
              placeholderTextColor="#999"
            />
          </View>

          {/* Description */}
          <View style={styles.section}>
            <Text style={styles.label}>Description</Text>
            <TextInput
              style={[styles.input, styles.textArea]}
              value={formData.description}
              onChangeText={(text) =>
                setFormData((prev) => ({ ...prev, description: text }))
              }
              placeholder="What's this meetup about?"
              placeholderTextColor="#999"
              multiline
              numberOfLines={3}
            />
          </View>

          {/* Date & Time - IMPROVED */}
          <View style={styles.section}>
            <View style={styles.labelRow}>
              <Calendar color="#2B6CB0" size={18} />
              <Text style={styles.label}>Date & Time *</Text>
            </View>

            <TouchableOpacity
              style={styles.dateTimeDisplay}
              onPress={() => setShowDatePicker(true)}
            >
              <Calendar color="#2B6CB0" size={20} />
              <Text style={styles.dateTimeDisplayText}>
                {formatDate(formData.dateTime)}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.dateTimeDisplay}
              onPress={() => setShowTimePicker(true)}
            >
              <Clock color="#2B6CB0" size={20} />
              <Text style={styles.dateTimeDisplayText}>
                {formatTime(formData.dateTime)}
              </Text>
            </TouchableOpacity>

            {showDatePicker && (
              <DateTimePicker
                value={formData.dateTime}
                mode="date"
                display="calendar"
                onChange={onDateChange}
                minimumDate={new Date()}
              />
            )}

            {showTimePicker && (
              <DateTimePicker
                value={formData.dateTime}
                mode="time"
                display="spinner"
                onChange={onTimeChange}
              />
            )}
          </View>

          {/* Location */}
          <View style={styles.section}>
            <View style={styles.labelRow}>
              <MapPin color="#2B6CB0" size={18} />
              <Text style={styles.label}>Location</Text>
            </View>
            <TextInput
              style={styles.input}
              value={formData.location.address}
              onChangeText={(text) =>
                setFormData((prev) => ({
                  ...prev,
                  location: { ...prev.location, address: text },
                }))
              }
              placeholder="Address"
              placeholderTextColor="#999"
            />
            <View style={styles.locationRow}>
              <TextInput
                style={[styles.input, styles.halfInput]}
                value={formData.location.city}
                onChangeText={(text) =>
                  setFormData((prev) => ({
                    ...prev,
                    location: { ...prev.location, city: text },
                  }))
                }
                placeholder="City"
                placeholderTextColor="#999"
              />
              <TextInput
                style={[styles.input, styles.halfInput]}
                value={formData.location.state}
                onChangeText={(text) =>
                  setFormData((prev) => ({
                    ...prev,
                    location: { ...prev.location, state: text },
                  }))
                }
                placeholder="State"
                placeholderTextColor="#999"
              />
            </View>
          </View>

          {/* Invite Matches */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <View style={styles.labelRow}>
                <Users color="#2B6CB0" size={18} />
                <Text style={styles.label}>
                  Invite Matches ({formData.invitedUsers.length} selected)
                </Text>
              </View>
              <TouchableOpacity onPress={handleSelectAll}>
                <Text style={styles.selectAllText}>
                  {formData.invitedUsers.length === matches.length
                    ? "Deselect All"
                    : "Select All"}
                </Text>
              </TouchableOpacity>
            </View>

            {matches.length === 0 ? (
              <Text style={styles.noMatches}>
                No matches yet. Connect with people first!
              </Text>
            ) : (
              <View style={styles.matchesList}>
                {matches.map((match) => (
                  <TouchableOpacity
                    key={match._id}
                    style={[
                      styles.matchItem,
                      formData.invitedUsers.includes(match._id) &&
                        styles.matchItemSelected,
                    ]}
                    onPress={() => handleUserToggle(match._id)}
                  >
                    <Avatar.Image
                      size={48}
                      source={{ uri: match.profilePhoto }}
                    />
                    <View style={styles.matchInfo}>
                      <Text style={styles.matchName}>{match.name}</Text>
                      <Text style={styles.matchLocation}>
                        {match.city}, {match.state}
                      </Text>
                    </View>
                    <Checkbox
                      status={
                        formData.invitedUsers.includes(match._id)
                          ? "checked"
                          : "unchecked"
                      }
                      onPress={() => handleUserToggle(match._id)}
                    />
                  </TouchableOpacity>
                ))}
              </View>
            )}
          </View>

          {/* Max Attendees */}
          <View style={styles.section}>
            <Text style={styles.label}>Max Attendees (optional)</Text>
            <TextInput
              style={styles.input}
              value={formData.maxAttendees}
              onChangeText={(text) =>
                setFormData((prev) => ({ ...prev, maxAttendees: text }))
              }
              placeholder="Leave blank for unlimited"
              placeholderTextColor="#999"
              keyboardType="number-pad"
            />
          </View>
        </ScrollView>

        {/* Actions */}
        <View style={styles.actions}>
          <Button
            mode="outlined"
            onPress={onClose}
            style={styles.button}
            labelStyle={styles.buttonLabel}
          >
            Cancel
          </Button>
          <Button
            mode="contained"
            onPress={handleSubmit}
            style={[styles.button, styles.primaryButton]}
            labelStyle={styles.buttonLabel}
            disabled={formData.invitedUsers.length === 0}
          >
            Create Meetup
          </Button>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F7FAFC",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 20,
    backgroundColor: "white",
    borderBottomWidth: 2,
    borderBottomColor: "#E2E8F0",
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#1E3A8A",
  },
  closeButton: {
    padding: 4,
  },
  content: {
    flex: 1,
    padding: 20,
  },
  section: {
    marginBottom: 24,
  },
  labelRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 8,
  },
  label: {
    fontSize: 14,
    fontWeight: "600",
    color: "#1E3A8A",
  },
  input: {
    backgroundColor: "white",
    borderWidth: 2,
    borderColor: "#E2E8F0",
    borderRadius: 8,
    padding: 12,
    fontSize: 14,
    color: "#2D2D2D",
  },
  textArea: {
    height: 80,
    textAlignVertical: "top",
  },
  dateTimeDisplay: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    backgroundColor: "white",
    borderWidth: 2,
    borderColor: "#E2E8F0",
    borderRadius: 8,
    padding: 16,
    marginBottom: 12,
  },
  dateTimeDisplayText: {
    fontSize: 16,
    color: "#2D2D2D",
    fontWeight: "500",
  },
  locationRow: {
    flexDirection: "row",
    gap: 12,
    marginTop: 8,
  },
  halfInput: {
    flex: 1,
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  selectAllText: {
    color: "#2B6CB0",
    fontSize: 13,
    fontWeight: "600",
  },
  noMatches: {
    textAlign: "center",
    color: "#64748B",
    padding: 24,
    backgroundColor: "#F8FAFC",
    borderRadius: 8,
    fontSize: 14,
  },
  matchesList: {
    gap: 8,
    backgroundColor: "#F8FAFC",
    padding: 12,
    borderRadius: 8,
  },
  matchItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    padding: 12,
    backgroundColor: "white",
    borderWidth: 2,
    borderColor: "#E2E8F0",
    borderRadius: 8,
  },
  matchItemSelected: {
    borderColor: "#2B6CB0",
    backgroundColor: "#DBEAFE",
  },
  matchInfo: {
    flex: 1,
  },
  matchName: {
    fontSize: 15,
    fontWeight: "600",
    color: "#1E3A8A",
  },
  matchLocation: {
    fontSize: 13,
    color: "#64748B",
    marginTop: 2,
  },
  actions: {
    flexDirection: "row",
    gap: 12,
    padding: 20,
    backgroundColor: "white",
    borderTopWidth: 2,
    borderTopColor: "#E2E8F0",
  },
  button: {
    flex: 1,
  },
  primaryButton: {
    backgroundColor: "#2B6CB0",
  },
  buttonLabel: {
    fontSize: 15,
    fontWeight: "600",
  },
});
