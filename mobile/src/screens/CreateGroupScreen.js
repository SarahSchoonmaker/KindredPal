import React, { useState } from "react";
import {
  View,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  TextInput,
  Switch,
  Alert,
} from "react-native";
import { Text, ActivityIndicator } from "react-native-paper";
import api from "../services/api";

const CATEGORIES = [
  "Sports & Fitness",
  "Faith & Spirituality",
  "Life Stage",
  "Hobbies & Interests",
  "Social Gatherings",
  "Support & Wellness",
  "Professional & Networking",
  "Arts & Culture",
  "Outdoor & Adventure",
  "Other",
];

export default function CreateGroupScreen({ navigation }) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [isNationwide, setIsNationwide] = useState(false);
  const [isPrivate, setIsPrivate] = useState(false);
  const [saving, setSaving] = useState(false);

  const handleCreate = async () => {
    if (!name.trim())
      return Alert.alert("Required", "Please enter a group name");
    if (!description.trim())
      return Alert.alert("Required", "Please enter a description");
    if (!category) return Alert.alert("Required", "Please select a category");
    if (!isNationwide && (!city.trim() || !state.trim())) {
      return Alert.alert(
        "Required",
        "Please enter a city and state, or mark as Nationwide",
      );
    }

    setSaving(true);
    try {
      const res = await api.post("/groups", {
        name: name.trim(),
        description: description.trim(),
        category,
        city: isNationwide ? "" : city.trim(),
        state: isNationwide ? "" : state.trim(),
        isNationwide,
        isPrivate,
      });
      Alert.alert("Success", "Your group has been created!", [
        {
          text: "View Group",
          onPress: () =>
            navigation.replace("GroupDetail", { groupId: res.data._id }),
        },
      ]);
    } catch (err) {
      Alert.alert(
        "Error",
        err.response?.data?.message || "Could not create group",
      );
    } finally {
      setSaving(false);
    }
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.title}>Create a Group</Text>
      <Text style={styles.subtitle}>
        Start a community group for people in your area who share your interests
        or life stage.
      </Text>

      {/* Group Name */}
      <View style={styles.field}>
        <Text style={styles.label}>Group Name *</Text>
        <TextInput
          style={styles.input}
          value={name}
          onChangeText={setName}
          placeholder="e.g. Tennis Group — Poughkeepsie"
          maxLength={100}
          placeholderTextColor="#A0AEC0"
        />
      </View>

      {/* Description */}
      <View style={styles.field}>
        <Text style={styles.label}>Description *</Text>
        <TextInput
          style={[styles.input, styles.textArea]}
          value={description}
          onChangeText={setDescription}
          placeholder="What is this group about? Who should join?"
          maxLength={500}
          multiline
          numberOfLines={4}
          placeholderTextColor="#A0AEC0"
        />
        <Text style={styles.charCount}>{description.length}/500</Text>
      </View>

      {/* Category */}
      <View style={styles.field}>
        <Text style={styles.label}>Category *</Text>
        <View style={styles.categoryGrid}>
          {CATEGORIES.map((cat) => (
            <TouchableOpacity
              key={cat}
              style={[
                styles.categoryChip,
                category === cat && styles.categoryChipActive,
              ]}
              onPress={() => setCategory(cat)}
            >
              <Text
                style={[
                  styles.categoryChipText,
                  category === cat && styles.categoryChipTextActive,
                ]}
              >
                {cat}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* Location */}
      <View style={styles.field}>
        <Text style={styles.label}>Location</Text>
        <View style={styles.toggleRow}>
          <Text style={styles.toggleLabel}>Nationwide group</Text>
          <Switch
            value={isNationwide}
            onValueChange={setIsNationwide}
            trackColor={{ true: "#2B6CB0" }}
          />
        </View>
        {!isNationwide && (
          <View style={styles.locationRow}>
            <TextInput
              style={[styles.input, styles.cityInput]}
              value={city}
              onChangeText={setCity}
              placeholder="City"
              placeholderTextColor="#A0AEC0"
            />
            <TextInput
              style={[styles.input, styles.stateInput]}
              value={state}
              onChangeText={setState}
              placeholder="State"
              maxLength={2}
              autoCapitalize="characters"
              placeholderTextColor="#A0AEC0"
            />
          </View>
        )}
      </View>

      {/* Privacy */}
      <View style={styles.field}>
        <Text style={styles.label}>Privacy</Text>
        <View style={styles.toggleRow}>
          <View>
            <Text style={styles.toggleLabel}>Private group</Text>
            <Text style={styles.toggleHint}>
              {isPrivate
                ? "Members must request to join — you approve them"
                : "Anyone can join instantly"}
            </Text>
          </View>
          <Switch
            value={isPrivate}
            onValueChange={setIsPrivate}
            trackColor={{ true: "#2B6CB0" }}
          />
        </View>
      </View>

      {/* Submit */}
      <TouchableOpacity
        style={[styles.createButton, saving && styles.createButtonDisabled]}
        onPress={handleCreate}
        disabled={saving}
      >
        {saving ? (
          <ActivityIndicator color="white" size="small" />
        ) : (
          <Text style={styles.createButtonText}>Create Group</Text>
        )}
      </TouchableOpacity>

      <View style={{ height: 40 }} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F7FAFC" },
  content: { padding: 16 },
  title: { fontSize: 24, fontWeight: "700", color: "#2D3748", marginBottom: 6 },
  subtitle: {
    fontSize: 14,
    color: "#718096",
    marginBottom: 24,
    lineHeight: 20,
  },

  field: { marginBottom: 20 },
  label: { fontSize: 15, fontWeight: "600", color: "#4A5568", marginBottom: 8 },
  input: {
    backgroundColor: "white",
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#E2E8F0",
    padding: 14,
    fontSize: 15,
    color: "#2D3748",
  },
  textArea: { height: 100, textAlignVertical: "top" },
  charCount: {
    fontSize: 12,
    color: "#A0AEC0",
    textAlign: "right",
    marginTop: 4,
  },

  categoryGrid: { flexDirection: "row", flexWrap: "wrap", gap: 8 },
  categoryChip: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: "white",
    borderWidth: 1.5,
    borderColor: "#E2E8F0",
  },
  categoryChipActive: { backgroundColor: "#EBF4FF", borderColor: "#2B6CB0" },
  categoryChipText: { fontSize: 13, color: "#718096", fontWeight: "500" },
  categoryChipTextActive: { color: "#2B6CB0", fontWeight: "700" },

  toggleRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "white",
    padding: 14,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#E2E8F0",
  },
  toggleLabel: { fontSize: 15, fontWeight: "600", color: "#2D3748" },
  toggleHint: { fontSize: 12, color: "#718096", marginTop: 2, maxWidth: 220 },

  locationRow: { flexDirection: "row", gap: 10, marginTop: 10 },
  cityInput: { flex: 2 },
  stateInput: { flex: 1 },

  createButton: {
    backgroundColor: "#2B6CB0",
    borderRadius: 10,
    padding: 16,
    alignItems: "center",
    marginTop: 8,
  },
  createButtonDisabled: { opacity: 0.6 },
  createButtonText: { color: "white", fontSize: 16, fontWeight: "700" },
});
