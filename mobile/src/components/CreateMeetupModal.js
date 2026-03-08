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
import { X, Calendar, MapPin, Users, Tag } from "lucide-react-native";
import api from "../services/api";

// Pure JS date picker — no native modules needed
function SimpleDateTimePicker({ value, onChange }) {
  const pad = (n) => String(n).padStart(2, "0");
  const d = value instanceof Date ? value : new Date();

  const [month, setMonth] = useState(pad(d.getMonth() + 1));
  const [day, setDay] = useState(pad(d.getDate()));
  const [year, setYear] = useState(String(d.getFullYear()));
  const [hour, setHour] = useState(pad(d.getHours()));
  const [minute, setMinute] = useState(pad(d.getMinutes()));

  const commit = (m, dy, y, h, mn) => {
    const parsed = new Date(`${y}-${m}-${dy}T${h}:${mn}:00`);
    if (!isNaN(parsed)) onChange(parsed);
  };

  return (
    <View style={dtStyles.container}>
      <Text style={dtStyles.hint}>Date (MM / DD / YYYY)</Text>
      <View style={dtStyles.row}>
        <TextInput
          style={dtStyles.seg}
          value={month}
          onChangeText={(v) => {
            setMonth(v);
            commit(v, day, year, hour, minute);
          }}
          keyboardType="number-pad"
          maxLength={2}
          placeholder="MM"
          placeholderTextColor="#999"
        />
        <Text style={dtStyles.sep}>/</Text>
        <TextInput
          style={dtStyles.seg}
          value={day}
          onChangeText={(v) => {
            setDay(v);
            commit(month, v, year, hour, minute);
          }}
          keyboardType="number-pad"
          maxLength={2}
          placeholder="DD"
          placeholderTextColor="#999"
        />
        <Text style={dtStyles.sep}>/</Text>
        <TextInput
          style={[dtStyles.seg, dtStyles.yearSeg]}
          value={year}
          onChangeText={(v) => {
            setYear(v);
            commit(month, day, v, hour, minute);
          }}
          keyboardType="number-pad"
          maxLength={4}
          placeholder="YYYY"
          placeholderTextColor="#999"
        />
      </View>
      <Text style={[dtStyles.hint, { marginTop: 10 }]}>
        Time (HH : MM, 24-hr)
      </Text>
      <View style={dtStyles.row}>
        <TextInput
          style={dtStyles.seg}
          value={hour}
          onChangeText={(v) => {
            setHour(v);
            commit(month, day, year, v, minute);
          }}
          keyboardType="number-pad"
          maxLength={2}
          placeholder="HH"
          placeholderTextColor="#999"
        />
        <Text style={dtStyles.sep}>:</Text>
        <TextInput
          style={dtStyles.seg}
          value={minute}
          onChangeText={(v) => {
            setMinute(v);
            commit(month, day, year, hour, v);
          }}
          keyboardType="number-pad"
          maxLength={2}
          placeholder="MM"
          placeholderTextColor="#999"
        />
      </View>
    </View>
  );
}

const dtStyles = StyleSheet.create({
  container: {
    backgroundColor: "#F7FAFC",
    borderRadius: 8,
    padding: 12,
    borderWidth: 1,
    borderColor: "#E2E8F0",
  },
  hint: { fontSize: 12, color: "#718096", marginBottom: 6 },
  row: { flexDirection: "row", alignItems: "center", gap: 6 },
  seg: {
    backgroundColor: "white",
    borderWidth: 1,
    borderColor: "#CBD5E0",
    borderRadius: 6,
    padding: 10,
    fontSize: 16,
    color: "#2D3748",
    textAlign: "center",
    width: 56,
  },
  yearSeg: { width: 72 },
  sep: { fontSize: 18, color: "#4A5568", fontWeight: "bold" },
});

export default function CreateMeetupModal({ visible, onClose, onSuccess }) {
  const [matches, setMatches] = useState([]);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    location: { address: "", city: "", state: "" },
    dateTime: new Date(),
    invitedUsers: [],
    maxAttendees: "",
  });

  useEffect(() => {
    if (visible) {
      fetchMatches();
      setFormData({
        title: "",
        description: "",
        location: { address: "", city: "", state: "" },
        dateTime: new Date(),
        invitedUsers: [],
        maxAttendees: "",
      });
    }
  }, [visible]);

  const fetchMatches = async () => {
    try {
      const response = await api.get("/users/matches");
      setMatches(response.data);
    } catch (error) {
      console.error("Error fetching matches:", error);
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

    if (Object.keys(location).length > 0) meetupData.location = location;
    if (formData.maxAttendees)
      meetupData.maxAttendees = parseInt(formData.maxAttendees);

    try {
      await api.post("/meetups", meetupData);
      Alert.alert("Success", "Meetup created!");
      onSuccess();
      onClose();
    } catch (error) {
      console.error("Error creating meetup:", error);
      Alert.alert("Error", "Failed to create meetup");
    }
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      onRequestClose={onClose}
      presentationStyle="pageSheet"
    >
      <View style={styles.container}>
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

          {/* Date & Time — pure JS, no native module */}
          <View style={styles.section}>
            <View style={styles.labelRow}>
              <Calendar color="#2B6CB0" size={18} />
              <Text style={styles.label}>Date & Time *</Text>
            </View>
            <SimpleDateTimePicker
              value={formData.dateTime}
              onChange={(date) =>
                setFormData((prev) => ({ ...prev, dateTime: date }))
              }
            />
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
  container: { flex: 1, backgroundColor: "#F7FAFC" },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 20,
    backgroundColor: "white",
    borderBottomWidth: 2,
    borderBottomColor: "#E2E8F0",
  },
  headerTitle: { fontSize: 24, fontWeight: "bold", color: "#1E3A8A" },
  closeButton: { padding: 4 },
  content: { flex: 1, padding: 20 },
  section: { marginBottom: 24 },
  labelRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 8,
  },
  label: { fontSize: 14, fontWeight: "600", color: "#1E3A8A" },
  input: {
    backgroundColor: "white",
    borderWidth: 2,
    borderColor: "#E2E8F0",
    borderRadius: 8,
    padding: 12,
    fontSize: 14,
    color: "#2D2D2D",
  },
  textArea: { height: 80, textAlignVertical: "top" },
  locationRow: { flexDirection: "row", gap: 12, marginTop: 8 },
  halfInput: { flex: 1 },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  selectAllText: { color: "#2B6CB0", fontSize: 13, fontWeight: "600" },
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
  matchItemSelected: { borderColor: "#2B6CB0", backgroundColor: "#DBEAFE" },
  matchInfo: { flex: 1 },
  matchName: { fontSize: 15, fontWeight: "600", color: "#1E3A8A" },
  matchLocation: { fontSize: 13, color: "#64748B", marginTop: 2 },
  actions: {
    flexDirection: "row",
    gap: 12,
    padding: 20,
    backgroundColor: "white",
    borderTopWidth: 2,
    borderTopColor: "#E2E8F0",
  },
  button: { flex: 1 },
  primaryButton: { backgroundColor: "#2B6CB0" },
  buttonLabel: { fontSize: 15, fontWeight: "600" },
});
