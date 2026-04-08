import React, {
  useState,
  useEffect,
  useCallback,
  useLayoutEffect,
  useRef,
} from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  Modal,
  TextInput,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { Avatar, Divider, ActivityIndicator } from "react-native-paper";
import {
  Calendar,
  MapPin,
  Users,
  Clock,
  Edit,
  Trash2,
  X,
} from "lucide-react-native";
import * as SecureStore from "expo-secure-store";
import api from "../services/api";

const BLUE = "#2B6CB0";

// ── Edit Modal ────────────────────────────────────────────────────────────────
function EditMeetupModal({ visible, meetup, onClose, onSaved }) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [dateTime, setDateTime] = useState("");
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [maxAttendees, setMaxAttendees] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!meetup || !visible) return;
    setTitle(meetup.title || "");
    setDescription(meetup.description || "");
    const d = meetup.dateTime ? new Date(meetup.dateTime) : new Date();
    const pad = (n) => String(n).padStart(2, "0");
    setDateTime(
      `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())} ${pad(d.getHours())}:${pad(d.getMinutes())}`,
    );
    setAddress(meetup.location?.address || "");
    setCity(meetup.location?.city || "");
    setState(meetup.location?.state || "");
    setMaxAttendees(meetup.maxAttendees ? String(meetup.maxAttendees) : "");
  }, [meetup, visible]);

  const handleSave = async () => {
    if (!title.trim()) return Alert.alert("Required", "Title is required");
    let parsedDate;
    try {
      parsedDate = new Date(dateTime.trim());
      if (isNaN(parsedDate.getTime())) throw new Error("Invalid date");
    } catch {
      return Alert.alert("Invalid Date", "Please use format: YYYY-MM-DD HH:MM");
    }
    setSaving(true);
    try {
      const res = await api.put(`/meetups/${meetup._id}`, {
        title: title.trim(),
        description: description.trim(),
        dateTime: parsedDate.toISOString(),
        location: {
          address: address.trim(),
          city: city.trim(),
          state: state.trim(),
        },
        maxAttendees: maxAttendees ? parseInt(maxAttendees) : null,
      });
      onSaved(res.data);
      onClose();
    } catch (err) {
      Alert.alert(
        "Error",
        err.response?.data?.message || "Could not save changes",
      );
    } finally {
      setSaving(false);
    }
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={onClose}
    >
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <View style={editStyles.modalHeader}>
          <Text style={editStyles.modalTitle}>Edit Meetup</Text>
          <TouchableOpacity
            onPress={onClose}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          >
            <X size={22} color="#4a5568" />
          </TouchableOpacity>
        </View>
        <ScrollView
          style={editStyles.modalScroll}
          keyboardShouldPersistTaps="handled"
        >
          <View style={editStyles.field}>
            <Text style={editStyles.label}>Title *</Text>
            <TextInput
              style={editStyles.input}
              value={title}
              onChangeText={setTitle}
              placeholder="Meetup title"
              placeholderTextColor="#a0aec0"
              maxLength={100}
            />
          </View>
          <View style={editStyles.field}>
            <Text style={editStyles.label}>Description</Text>
            <TextInput
              style={[editStyles.input, editStyles.inputMulti]}
              value={description}
              onChangeText={setDescription}
              placeholder="What's this meetup about?"
              placeholderTextColor="#a0aec0"
              multiline
              numberOfLines={4}
              maxLength={500}
            />
          </View>
          <View style={editStyles.field}>
            <Text style={editStyles.label}>Date & Time</Text>
            <TextInput
              style={editStyles.input}
              value={dateTime}
              onChangeText={setDateTime}
              placeholder="YYYY-MM-DD HH:MM  e.g. 2026-04-15 18:30"
              placeholderTextColor="#a0aec0"
            />
            <Text style={editStyles.hint}>Format: YYYY-MM-DD HH:MM (24hr)</Text>
          </View>
          <View style={editStyles.field}>
            <Text style={editStyles.label}>Address</Text>
            <TextInput
              style={editStyles.input}
              value={address}
              onChangeText={setAddress}
              placeholder="Street address (optional)"
              placeholderTextColor="#a0aec0"
            />
          </View>
          <View style={editStyles.row}>
            <View style={{ flex: 1 }}>
              <Text style={editStyles.label}>City</Text>
              <TextInput
                style={editStyles.input}
                value={city}
                onChangeText={setCity}
                placeholder="City"
                placeholderTextColor="#a0aec0"
              />
            </View>
            <View style={{ width: 80, marginLeft: 10 }}>
              <Text style={editStyles.label}>State</Text>
              <TextInput
                style={editStyles.input}
                value={state}
                onChangeText={setState}
                placeholder="FL"
                placeholderTextColor="#a0aec0"
                maxLength={2}
                autoCapitalize="characters"
              />
            </View>
          </View>
          <View style={editStyles.field}>
            <Text style={editStyles.label}>Max Attendees</Text>
            <TextInput
              style={[editStyles.input, { width: 100 }]}
              value={maxAttendees}
              onChangeText={setMaxAttendees}
              placeholder="Unlimited"
              placeholderTextColor="#a0aec0"
              keyboardType="number-pad"
              maxLength={4}
            />
          </View>
          <View style={{ height: 20 }} />
        </ScrollView>
        <View style={editStyles.modalFooter}>
          <TouchableOpacity style={editStyles.btnCancel} onPress={onClose}>
            <Text style={editStyles.btnCancelText}>Cancel</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[editStyles.btnSave, saving && { opacity: 0.6 }]}
            onPress={handleSave}
            disabled={saving}
          >
            {saving ? (
              <ActivityIndicator size="small" color="white" />
            ) : (
              <Text style={editStyles.btnSaveText}>Save Changes</Text>
            )}
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
}

// ── Main Screen ───────────────────────────────────────────────────────────────
export default function MeetupDetailsScreen({ route, navigation }) {
  const { meetupId } = route.params;
  const [meetup, setMeetup] = useState(null);
  const [loading, setLoading] = useState(true);
  const [rsvpLoading, setRsvpLoading] = useState(false);
  const [showEdit, setShowEdit] = useState(false);

  const currentUserIdRef = useRef(null);
  const [currentUserId, setCurrentUserId] = useState(null);

  useEffect(() => {
    SecureStore.getItemAsync("userId").then((id) => {
      if (id) {
        currentUserIdRef.current = id;
        setCurrentUserId(id);
      }
    });
  }, []);

  const fetchMeetupDetails = useCallback(async () => {
    try {
      const res = await api.get(`/meetups/${meetupId}`);
      setMeetup(res.data);
    } catch {
      Alert.alert("Error", "Failed to load meetup details");
    } finally {
      setLoading(false);
    }
  }, [meetupId]);

  useEffect(() => {
    fetchMeetupDetails();
  }, [fetchMeetupDetails]);

  useLayoutEffect(() => {
    navigation.setOptions({
      headerBackTitle: "Back",
      headerBackButtonMenuEnabled: false,
      title: "Meetup Details",
    });
  }, []);

  const getUserRSVP = useCallback(() => {
    if (!meetup) return null;
    const uid = currentUserIdRef.current || currentUserId;
    if (!uid) return null;
    const rsvp = meetup.rsvps?.find((r) => {
      const rsvpUserId = r.user?._id?.toString() || r.user?.toString();
      return rsvpUserId === uid.toString();
    });
    return rsvp ? rsvp.status : null;
  }, [meetup, currentUserId]);

  const handleRSVP = async (status) => {
    if (rsvpLoading) return;
    const current = getUserRSVP();
    if (current === status) return;
    setRsvpLoading(true);
    try {
      const res = await api.post(`/meetups/${meetupId}/rsvp`, { status });
      setMeetup(res.data);
    } catch {
      Alert.alert("Error", "Failed to update RSVP");
    } finally {
      setRsvpLoading(false);
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
            } catch {
              Alert.alert("Error", "Failed to delete meetup");
            }
          },
        },
      ],
    );
  };

  const formatDate = (d) =>
    new Date(d).toLocaleDateString("en-US", {
      weekday: "long",
      month: "long",
      day: "numeric",
      year: "numeric",
    });
  const formatTime = (d) =>
    new Date(d).toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
    });

  if (loading)
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color={BLUE} />
      </View>
    );
  if (!meetup)
    return (
      <View style={styles.center}>
        <Text>Meetup not found</Text>
      </View>
    );

  const uid = currentUserIdRef.current || currentUserId;
  const creatorId =
    meetup.creator?._id?.toString() || meetup.creator?.toString();
  const isCreator = uid?.toString() === creatorId;
  const userRSVP = getUserRSVP();

  // FIX: Filter organizer OUT of going RSVPs before counting, then add 1 for them.
  // Previously: all going RSVPs counted + 1 for organizer = double count if organizer
  // also has an RSVP entry (which the backend creates automatically on meetup creation).
  const goingRsvps = (meetup.rsvps || []).filter(
    (r) =>
      r.status === "going" &&
      (r.user?._id?.toString() || r.user?.toString()) !== creatorId,
  );
  const goingCount = goingRsvps.length + 1; // +1 for organizer only once

  const maybeRsvps = (meetup.rsvps || []).filter((r) => r.status === "maybe");
  const maybeCount = maybeRsvps.length;

  return (
    <>
      <ScrollView style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.headerContent}>
            <Text style={styles.title}>{meetup.title}</Text>
            <View style={styles.creatorRow}>
              <Avatar.Image
                size={36}
                source={{
                  uri:
                    meetup.creator?.profilePhoto ||
                    "https://via.placeholder.com/36",
                }}
              />
              <Text style={styles.hostedBy}>
                Hosted by {meetup.creator?.name}
              </Text>
            </View>
          </View>
          {isCreator && (
            <View style={styles.creatorActions}>
              <TouchableOpacity
                style={styles.iconBtn}
                onPress={() => setShowEdit(true)}
              >
                <Edit color={BLUE} size={22} />
              </TouchableOpacity>
              <TouchableOpacity style={styles.iconBtn} onPress={handleDelete}>
                <Trash2 color="#E53E3E" size={22} />
              </TouchableOpacity>
            </View>
          )}
        </View>

        <Divider />

        {/* Info */}
        <View style={styles.infoSection}>
          <View style={styles.infoCard}>
            <Calendar color={BLUE} size={22} />
            <View style={styles.infoText}>
              <Text style={styles.infoLabel}>Date</Text>
              <Text style={styles.infoValue}>
                {formatDate(meetup.dateTime)}
              </Text>
            </View>
          </View>
          <View style={styles.infoCard}>
            <Clock color={BLUE} size={22} />
            <View style={styles.infoText}>
              <Text style={styles.infoLabel}>Time</Text>
              <Text style={styles.infoValue}>
                {formatTime(meetup.dateTime)}
              </Text>
            </View>
          </View>
          {meetup.location && (
            <View style={styles.infoCard}>
              <MapPin color={BLUE} size={22} />
              <View style={styles.infoText}>
                <Text style={styles.infoLabel}>Location</Text>
                {meetup.location.address ? (
                  <Text style={styles.infoValue}>
                    {meetup.location.address}
                  </Text>
                ) : null}
                <Text style={styles.infoValue}>
                  {meetup.location.city}, {meetup.location.state}
                </Text>
              </View>
            </View>
          )}
          <View style={styles.infoCard}>
            <Users color={BLUE} size={22} />
            <View style={styles.infoText}>
              <Text style={styles.infoLabel}>Attendees</Text>
              <Text style={styles.infoValue}>
                {goingCount} going, {maybeCount} maybe
                {meetup.maxAttendees ? ` · Max: ${meetup.maxAttendees}` : ""}
              </Text>
            </View>
          </View>
        </View>

        {/* Description */}
        {meetup.description ? (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>About This Meetup</Text>
            <Text style={styles.description}>{meetup.description}</Text>
          </View>
        ) : null}

        {/* Organizer badge */}
        {isCreator && (
          <View style={styles.organizerBadge}>
            <Text style={styles.organizerBadgeText}>
              ✓ You're the organizer — you're going!
            </Text>
          </View>
        )}

        {/* RSVP buttons — non-creators only */}
        {!isCreator && (
          <View style={styles.rsvpSection}>
            <Text style={styles.sectionTitle}>Will you attend?</Text>
            <View style={styles.rsvpRow}>
              {[
                { status: "going", label: "✓ Going", active: "#48BB78" },
                { status: "maybe", label: "? Maybe", active: "#ED8936" },
                { status: "not-going", label: "✗ Can't Go", active: "#E53E3E" },
              ].map(({ status, label, active }) => (
                <TouchableOpacity
                  key={status}
                  style={[
                    styles.rsvpBtn,
                    userRSVP === status && {
                      backgroundColor: active,
                      borderColor: active,
                    },
                  ]}
                  onPress={() => handleRSVP(status)}
                  disabled={rsvpLoading}
                >
                  <Text
                    style={[
                      styles.rsvpBtnText,
                      userRSVP === status && { color: "white" },
                    ]}
                  >
                    {label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
            {rsvpLoading && (
              <ActivityIndicator
                size="small"
                color={BLUE}
                style={{ marginTop: 10 }}
              />
            )}
          </View>
        )}

        {/* Guest list */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Guest List</Text>

          {/* Going */}
          <View style={styles.guestGroup}>
            <Text style={styles.guestGroupTitle}>Going ({goingCount})</Text>

            {/* Organizer always first — shown once */}
            <View style={styles.guestRow}>
              <Avatar.Image
                size={40}
                source={{
                  uri:
                    meetup.creator?.profilePhoto ||
                    "https://via.placeholder.com/40",
                }}
              />
              <Text style={styles.guestName}>
                {meetup.creator?.name}{" "}
                <Text style={styles.organizerTag}>(organizer)</Text>
              </Text>
            </View>

            {/* FIX: Use goingRsvps which already excludes the organizer */}
            {goingRsvps.map((rsvp) => (
              <View key={rsvp.user?._id || rsvp.user} style={styles.guestRow}>
                <Avatar.Image
                  size={40}
                  source={{
                    uri:
                      rsvp.user?.profilePhoto ||
                      "https://via.placeholder.com/40",
                  }}
                />
                <Text style={styles.guestName}>{rsvp.user?.name}</Text>
              </View>
            ))}
          </View>

          {/* Maybe */}
          {maybeCount > 0 && (
            <View style={styles.guestGroup}>
              <Text style={styles.guestGroupTitle}>Maybe ({maybeCount})</Text>
              {maybeRsvps.map((rsvp) => (
                <View key={rsvp.user?._id || rsvp.user} style={styles.guestRow}>
                  <Avatar.Image
                    size={40}
                    source={{
                      uri:
                        rsvp.user?.profilePhoto ||
                        "https://via.placeholder.com/40",
                    }}
                  />
                  <Text style={styles.guestName}>{rsvp.user?.name}</Text>
                </View>
              ))}
            </View>
          )}
        </View>

        <View style={{ height: 40 }} />
      </ScrollView>

      <EditMeetupModal
        visible={showEdit}
        meetup={meetup}
        onClose={() => setShowEdit(false)}
        onSaved={(updated) => {
          setMeetup(updated);
          setShowEdit(false);
        }}
      />
    </>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F7FAFC" },
  center: { flex: 1, justifyContent: "center", alignItems: "center" },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    padding: 20,
    backgroundColor: "white",
  },
  headerContent: { flex: 1 },
  title: {
    fontSize: 24,
    fontWeight: "800",
    color: "#1a202c",
    marginBottom: 10,
  },
  creatorRow: { flexDirection: "row", alignItems: "center", gap: 10 },
  hostedBy: { fontSize: 14, color: "#718096" },
  creatorActions: { flexDirection: "row", gap: 4, marginLeft: 8 },
  iconBtn: { padding: 8 },
  infoSection: { padding: 20, backgroundColor: "white", gap: 16, marginTop: 1 },
  infoCard: { flexDirection: "row", gap: 14, alignItems: "flex-start" },
  infoText: { flex: 1 },
  infoLabel: {
    fontSize: 11,
    color: "#a0aec0",
    textTransform: "uppercase",
    fontWeight: "700",
    letterSpacing: 0.5,
    marginBottom: 3,
  },
  infoValue: { fontSize: 15, color: "#2d3748", fontWeight: "500" },
  section: { padding: 20, backgroundColor: "white", marginTop: 8 },
  sectionTitle: {
    fontSize: 17,
    fontWeight: "700",
    color: "#1a202c",
    marginBottom: 14,
  },
  description: { fontSize: 15, color: "#4a5568", lineHeight: 22 },
  rsvpSection: { padding: 20, backgroundColor: "white", marginTop: 8 },
  rsvpRow: { flexDirection: "row", gap: 8 },
  rsvpBtn: {
    flex: 1,
    paddingVertical: 11,
    borderRadius: 10,
    borderWidth: 1.5,
    borderColor: "#e2e8f0",
    alignItems: "center",
    backgroundColor: "white",
  },
  rsvpBtnText: { fontSize: 13, fontWeight: "700", color: "#4a5568" },
  organizerBadge: {
    margin: 16,
    marginTop: 8,
    backgroundColor: "#C6F6D5",
    borderRadius: 10,
    padding: 12,
    alignItems: "center",
  },
  organizerBadgeText: { fontSize: 14, fontWeight: "700", color: "#276749" },
  guestGroup: { marginBottom: 20 },
  guestGroupTitle: {
    fontSize: 14,
    fontWeight: "700",
    color: "#718096",
    marginBottom: 10,
  },
  guestRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    paddingVertical: 6,
  },
  guestName: { fontSize: 15, fontWeight: "600", color: "#2d3748" },
  organizerTag: { fontSize: 12, fontWeight: "400", color: "#718096" },
});

const editStyles = StyleSheet.create({
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#e2e8f0",
  },
  modalTitle: { fontSize: 18, fontWeight: "800", color: "#1a202c" },
  modalScroll: { flex: 1, padding: 20 },
  field: { marginBottom: 18 },
  row: { flexDirection: "row", marginBottom: 18 },
  label: {
    fontSize: 11,
    fontWeight: "700",
    color: "#4a5568",
    textTransform: "uppercase",
    letterSpacing: 0.6,
    marginBottom: 7,
  },
  hint: { fontSize: 11, color: "#a0aec0", marginTop: 4 },
  input: {
    backgroundColor: "#f8fafc",
    borderWidth: 1.5,
    borderColor: "#e2e8f0",
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 15,
    color: "#1a202c",
  },
  inputMulti: { minHeight: 100, textAlignVertical: "top" },
  modalFooter: {
    flexDirection: "row",
    gap: 12,
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: "#e2e8f0",
  },
  btnCancel: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: "#e2e8f0",
    alignItems: "center",
  },
  btnCancelText: { fontSize: 15, fontWeight: "600", color: "#718096" },
  btnSave: {
    flex: 2,
    paddingVertical: 14,
    borderRadius: 12,
    backgroundColor: BLUE,
    alignItems: "center",
  },
  btnSaveText: { fontSize: 15, fontWeight: "700", color: "white" },
});
