import React, { useState, useRef } from "react";
import {
  View,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  TextInput,
  Switch,
  Alert,
  KeyboardAvoidingView,
  Platform,
  Modal,
  FlatList,
} from "react-native";
import { Text, ActivityIndicator } from "react-native-paper";
import api from "../services/api";

const CATEGORIES = [
  "Caregiver Support",
  "Grief & Loss",
  "Sober & Clean Living",
  "New Parent Support",
  "Chronic Illness Support",
  "Anxiety & Mental Wellness",
  "Veteran Support",
  "Senior Wellness",
  "Loneliness & Social Connection",
  "Divorce Recovery",
  "Faith & Spiritual Support",
  "Life Transitions",
  "Trauma Recovery",
  "Cancer Support",
  "Single Parent Support",
  "Addiction Recovery",
  "Autism & Special Needs Families",
  "Singles Social Support",
  "Married No Kids",
  "Career Change Support",
  "Financial Recovery",
  "Sports & Fitness",
  "Local Activity Groups",
];

export default function CreateGroupScreen({ navigation }) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [showCategoryPicker, setShowCategoryPicker] = useState(false);
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [isNationwide, setIsNationwide] = useState(false);
  const [isPrivate, setIsPrivate] = useState(false);
  const [saving, setSaving] = useState(false);
  const scrollRef = useRef(null);

  const handleCreate = async () => {
    if (!name.trim())
      return Alert.alert("Required", "Please enter a group name");
    if (!description.trim())
      return Alert.alert("Required", "Please enter a description");
    if (!category) return Alert.alert("Required", "Please select a category");
    if (!isNationwide && (!city.trim() || !state.trim()))
      return Alert.alert(
        "Required",
        "Please enter a city and state, or mark as Nationwide",
      );

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
      const newGroup = res.data;
      const newGroupId = newGroup._id;

      Alert.alert(
        "Group Created! 🎉",
        "Your group has been created successfully.",
        [
          {
            text: "View Group",
            onPress: () => {
              // FIX: Pass the newly created group data back to GroupsScreen
              // via navigation params so it can be added to the list immediately
              // without waiting for a server round-trip.
              // Then navigate to GroupDetail after a short delay.
              navigation.navigate("Groups", {
                newGroup: newGroup,
                timestamp: Date.now(),
              });
              setTimeout(() => {
                navigation.navigate("GroupDetail", { groupId: newGroupId });
              }, 100);
            },
          },
          {
            text: "Back to Groups",
            onPress: () => {
              // FIX: Pass the newly created group back so GroupsScreen can
              // add it immediately to both My Groups and Discover lists.
              navigation.navigate("Groups", {
                newGroup: newGroup,
                timestamp: Date.now(),
              });
            },
          },
        ],
      );
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
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      keyboardVerticalOffset={Platform.OS === "ios" ? 90 : 0}
    >
      <ScrollView
        ref={scrollRef}
        style={styles.container}
        contentContainerStyle={styles.content}
        keyboardShouldPersistTaps="handled"
      >
        <Text style={styles.title}>Create a Group</Text>
        <Text style={styles.subtitle}>
          Start a peer support or wellness group for people in your area.
        </Text>

        <View style={styles.field}>
          <Text style={styles.label}>Group Name *</Text>
          <TextInput
            style={styles.input}
            value={name}
            onChangeText={setName}
            placeholder="e.g. Caregiver Support — Boca Raton"
            maxLength={100}
            placeholderTextColor="#A0AEC0"
          />
        </View>

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

        <View style={styles.field}>
          <Text style={styles.label}>Category *</Text>
          <TouchableOpacity
            style={styles.categoryDropdown}
            onPress={() => setShowCategoryPicker(true)}
          >
            <Text
              style={[
                styles.categoryDropdownText,
                !category && { color: "#a0aec0" },
              ]}
            >
              {category || "Select a category..."}
            </Text>
            <Text style={styles.categoryDropdownArrow}>▾</Text>
          </TouchableOpacity>
        </View>

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
                onFocus={() =>
                  setTimeout(
                    () => scrollRef.current?.scrollToEnd({ animated: true }),
                    300,
                  )
                }
              />
              <TextInput
                style={[styles.input, styles.stateInput]}
                value={state}
                onChangeText={setState}
                placeholder="ST"
                maxLength={2}
                autoCapitalize="characters"
                placeholderTextColor="#A0AEC0"
                onFocus={() =>
                  setTimeout(
                    () => scrollRef.current?.scrollToEnd({ animated: true }),
                    300,
                  )
                }
              />
            </View>
          )}
        </View>

        <View style={styles.field}>
          <Text style={styles.label}>Privacy</Text>
          <View style={styles.toggleRow}>
            <View>
              <Text style={styles.toggleLabel}>Private group</Text>
              <Text style={styles.toggleHint}>
                {isPrivate
                  ? "Members must be invited — you control who joins"
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

      <Modal
        visible={showCategoryPicker}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={() => setShowCategoryPicker(false)}
      >
        <View style={styles.pickerModal}>
          <View style={styles.pickerHeader}>
            <Text style={styles.pickerTitle}>Select Category</Text>
            <TouchableOpacity onPress={() => setShowCategoryPicker(false)}>
              <Text style={styles.pickerCancel}>Cancel</Text>
            </TouchableOpacity>
          </View>
          <FlatList
            data={CATEGORIES}
            keyExtractor={(item) => item}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={[
                  styles.pickerItem,
                  category === item && styles.pickerItemActive,
                ]}
                onPress={() => {
                  setCategory(item);
                  setShowCategoryPicker(false);
                }}
              >
                <Text
                  style={[
                    styles.pickerItemText,
                    category === item && styles.pickerItemTextActive,
                  ]}
                >
                  {item}
                </Text>
                {category === item && <Text style={styles.pickerCheck}>✓</Text>}
              </TouchableOpacity>
            )}
            ItemSeparatorComponent={() => (
              <View style={styles.pickerSeparator} />
            )}
          />
        </View>
      </Modal>
    </KeyboardAvoidingView>
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
  categoryDropdown: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "white",
    borderWidth: 1.5,
    borderColor: "#E2E8F0",
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 15,
  },
  categoryDropdownText: { fontSize: 15, color: "#2D3748", flex: 1 },
  categoryDropdownArrow: { fontSize: 18, color: "#718096", marginLeft: 8 },
  pickerModal: { flex: 1, backgroundColor: "white" },
  pickerHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 18,
    borderBottomWidth: 1,
    borderBottomColor: "#E2E8F0",
    backgroundColor: "white",
  },
  pickerTitle: { fontSize: 18, fontWeight: "800", color: "#1a202c" },
  pickerCancel: { fontSize: 16, color: "#2B6CB0", fontWeight: "600" },
  pickerItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 16,
    paddingHorizontal: 20,
    backgroundColor: "white",
  },
  pickerItemActive: { backgroundColor: "#EBF4FF" },
  pickerItemText: { fontSize: 16, color: "#2D3748", flex: 1 },
  pickerItemTextActive: { color: "#2B6CB0", fontWeight: "700" },
  pickerCheck: {
    fontSize: 18,
    color: "#2B6CB0",
    fontWeight: "700",
    marginLeft: 12,
  },
  pickerSeparator: {
    height: 1,
    backgroundColor: "#F0F4F8",
    marginHorizontal: 20,
  },
});
