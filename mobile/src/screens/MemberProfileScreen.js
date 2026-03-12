// mobile/src/screens/MemberProfileScreen.js
// View a group member's profile + send connection request
// Reached from GroupDetailScreen member list
import React, { useState, useEffect } from "react";
import {
  View,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Image,
  Alert,
  TextInput,
  Modal,
} from "react-native";
import { Text, ActivityIndicator } from "react-native-paper";
import {
  MessageCircle,
  UserPlus,
  UserCheck,
  Clock,
  Users,
} from "lucide-react-native";
import api from "../services/api";

const CATEGORY_ICONS = {
  "Sports & Fitness": "🏃",
  "Faith & Spirituality": "🙏",
  "Life Stage": "🌱",
  "Hobbies & Interests": "🎯",
  "Social Gatherings": "👥",
  "Support & Wellness": "💙",
  "Professional & Networking": "💼",
  "Arts & Culture": "🎨",
  "Outdoor & Adventure": "🏕️",
  Other: "✨",
};

function TagPill({ label, color = "#EBF4FF", textColor = "#2B6CB0" }) {
  return (
    <View style={[styles.pill, { backgroundColor: color }]}>
      <Text style={[styles.pillText, { color: textColor }]}>{label}</Text>
    </View>
  );
}

export default function MemberProfileScreen({ route, navigation }) {
  const { userId, sharedGroups = [] } = route.params;

  const [profile, setProfile] = useState(null);
  const [connectionStatus, setConnectionStatus] = useState("none"); // none | pending | accepted
  const [connectionId, setConnectionId] = useState(null);
  const [isSender, setIsSender] = useState(false);
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [showMessageModal, setShowMessageModal] = useState(false);
  const [requestMessage, setRequestMessage] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [profileRes, statusRes] = await Promise.all([
          api.get(`/users/profile/${userId}`),
          api.get(`/connections/status/${userId}`),
        ]);
        setProfile(profileRes.data);
        setConnectionStatus(statusRes.data.status);
        setConnectionId(statusRes.data.connectionId);
        setIsSender(statusRes.data.isSender);
        navigation.setOptions({ title: profileRes.data.name });
      } catch (err) {
        console.error("MemberProfile fetch error:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [userId]);

  const handleSendRequest = async () => {
    setSending(true);
    setShowMessageModal(false);
    try {
      await api.post(`/connections/request/${userId}`, {
        message: requestMessage.trim(),
      });
      setConnectionStatus("pending");
      setIsSender(true);
      Alert.alert(
        "Request Sent! 🎉",
        `Your connection request has been sent to ${profile?.name}.`,
      );
    } catch (err) {
      Alert.alert(
        "Could Not Send Request",
        err.response?.data?.message || "Please try again",
      );
    } finally {
      setSending(false);
      setRequestMessage("");
    }
  };

  const handleMessage = () => {
    navigation.navigate("Chat", { match: profile });
  };

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#2B6CB0" />
      </View>
    );
  }

  if (!profile) {
    return (
      <View style={styles.center}>
        <Text>Profile not found</Text>
      </View>
    );
  }

  const renderConnectionButton = () => {
    if (connectionStatus === "accepted") {
      return (
        <TouchableOpacity style={styles.messageBtn} onPress={handleMessage}>
          <MessageCircle size={18} color="white" />
          <Text style={styles.messageBtnText}>Send Message</Text>
        </TouchableOpacity>
      );
    }
    if (connectionStatus === "pending" && isSender) {
      return (
        <View style={styles.pendingBtn}>
          <Clock size={18} color="#744210" />
          <Text style={styles.pendingBtnText}>Request Pending</Text>
        </View>
      );
    }
    if (connectionStatus === "pending" && !isSender) {
      return (
        <View style={styles.respondRow}>
          <Text style={styles.respondLabel}>Sent you a request</Text>
          <TouchableOpacity
            style={styles.acceptBtn}
            onPress={async () => {
              try {
                await api.post(`/connections/accept/${connectionId}`);
                setConnectionStatus("accepted");
              } catch (e) {
                Alert.alert("Error", "Could not accept");
              }
            }}
          >
            <UserCheck size={16} color="white" />
            <Text style={styles.acceptBtnText}>Accept</Text>
          </TouchableOpacity>
        </View>
      );
    }
    // status === "none"
    return (
      <TouchableOpacity
        style={[styles.connectBtn, sending && styles.btnDisabled]}
        onPress={() => setShowMessageModal(true)}
        disabled={sending}
      >
        <UserPlus size={18} color="white" />
        <Text style={styles.connectBtnText}>
          {sending ? "Sending..." : "Send Connection Request"}
        </Text>
      </TouchableOpacity>
    );
  };

  return (
    <>
      <ScrollView style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <Image source={{ uri: profile.profilePhoto }} style={styles.photo} />
          <Text style={styles.name}>{profile.name}</Text>
          <Text style={styles.location}>
            📍 {profile.city}, {profile.state}
          </Text>
          {profile.age && (
            <Text style={styles.age}>{profile.age} years old</Text>
          )}
        </View>

        {/* Connection action */}
        <View style={styles.actionContainer}>{renderConnectionButton()}</View>

        {/* Shared groups */}
        {sharedGroups.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>
              <Users size={16} color="#2B6CB0" /> Groups in Common
            </Text>
            {sharedGroups.map((g) => (
              <View key={g._id} style={styles.sharedGroup}>
                <Text style={styles.sharedGroupIcon}>
                  {CATEGORY_ICONS[g.category] || "✨"}
                </Text>
                <Text style={styles.sharedGroupName}>{g.name}</Text>
              </View>
            ))}
          </View>
        )}

        {/* Bio */}
        {profile.bio && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>About</Text>
            <Text style={styles.bio}>{profile.bio}</Text>
          </View>
        )}

        {/* Life Stage */}
        {profile.lifeStage?.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Life Stage</Text>
            <View style={styles.pills}>
              {profile.lifeStage.map((s) => (
                <TagPill
                  key={s}
                  label={s}
                  color="#F0FFF4"
                  textColor="#276749"
                />
              ))}
            </View>
          </View>
        )}

        {/* Values */}
        {(profile.religion || profile.politicalBeliefs?.length > 0) && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Values</Text>
            <View style={styles.pills}>
              {profile.religion && profile.religion !== "Prefer not to say" && (
                <TagPill
                  label={`⛪ ${profile.religion}`}
                  color="#FFFAF0"
                  textColor="#744210"
                />
              )}
              {profile.politicalBeliefs
                ?.filter((b) => b !== "Prefer not to say")
                .map((b) => (
                  <TagPill
                    key={b}
                    label={`🏛 ${b}`}
                    color="#FAF5FF"
                    textColor="#553C9A"
                  />
                ))}
            </View>
          </View>
        )}

        {/* Interests */}
        {profile.causes?.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Interests</Text>
            <View style={styles.pills}>
              {profile.causes.map((c) => (
                <TagPill key={c} label={c} />
              ))}
            </View>
          </View>
        )}

        <View style={{ height: 40 }} />
      </ScrollView>

      {/* Optional message modal */}
      <Modal
        visible={showMessageModal}
        transparent
        animationType="slide"
        onRequestClose={() => setShowMessageModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            <Text style={styles.modalTitle}>Connect with {profile.name}</Text>
            <Text style={styles.modalSubtitle}>
              Add an optional message to introduce yourself (optional)
            </Text>
            <TextInput
              style={styles.modalInput}
              value={requestMessage}
              onChangeText={setRequestMessage}
              placeholder={`Hi ${profile.name?.split(" ")[0]}, I'd love to connect!`}
              maxLength={200}
              multiline
              numberOfLines={3}
              placeholderTextColor="#A0AEC0"
            />
            <Text style={styles.charCount}>{requestMessage.length}/200</Text>
            <View style={styles.modalActions}>
              <TouchableOpacity
                style={styles.modalCancel}
                onPress={() => setShowMessageModal(false)}
              >
                <Text style={styles.modalCancelText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.modalSend}
                onPress={handleSendRequest}
              >
                <Text style={styles.modalSendText}>Send Request</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F7FAFC" },
  center: { flex: 1, justifyContent: "center", alignItems: "center" },

  header: {
    backgroundColor: "#2B6CB0",
    alignItems: "center",
    padding: 28,
    paddingTop: 32,
  },
  photo: {
    width: 96,
    height: 96,
    borderRadius: 48,
    borderWidth: 3,
    borderColor: "rgba(255,255,255,0.4)",
    backgroundColor: "#E2E8F0",
    marginBottom: 12,
  },
  name: { fontSize: 24, fontWeight: "700", color: "white", marginBottom: 4 },
  location: { fontSize: 14, color: "rgba(255,255,255,0.85)", marginBottom: 2 },
  age: { fontSize: 13, color: "rgba(255,255,255,0.7)" },

  actionContainer: { margin: 16 },
  connectBtn: {
    backgroundColor: "#2B6CB0",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 8,
    padding: 14,
    borderRadius: 10,
  },
  connectBtnText: { color: "white", fontSize: 15, fontWeight: "700" },
  btnDisabled: { opacity: 0.6 },
  messageBtn: {
    backgroundColor: "#38A169",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 8,
    padding: 14,
    borderRadius: 10,
  },
  messageBtnText: { color: "white", fontSize: 15, fontWeight: "700" },
  pendingBtn: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 8,
    padding: 14,
    borderRadius: 10,
    backgroundColor: "#FEFCBF",
    borderWidth: 1,
    borderColor: "#F6E05E",
  },
  pendingBtnText: { color: "#744210", fontSize: 15, fontWeight: "600" },
  respondRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#EBF4FF",
    padding: 14,
    borderRadius: 10,
  },
  respondLabel: { fontSize: 14, color: "#2B6CB0", fontWeight: "600" },
  acceptBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    backgroundColor: "#2B6CB0",
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  acceptBtnText: { color: "white", fontWeight: "700" },

  section: {
    backgroundColor: "white",
    marginHorizontal: 16,
    marginBottom: 12,
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: "#E2E8F0",
  },
  sectionTitle: {
    fontSize: 15,
    fontWeight: "700",
    color: "#2D3748",
    marginBottom: 10,
  },
  bio: { fontSize: 15, color: "#4A5568", lineHeight: 22 },

  sharedGroup: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    paddingVertical: 6,
    borderBottomWidth: 1,
    borderBottomColor: "#F7FAFC",
  },
  sharedGroupIcon: { fontSize: 18 },
  sharedGroupName: { fontSize: 14, color: "#4A5568", fontWeight: "500" },

  pills: { flexDirection: "row", flexWrap: "wrap", gap: 8 },
  pill: {
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 20,
  },
  pillText: { fontSize: 13, fontWeight: "500" },

  // Modal
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "flex-end",
  },
  modalCard: {
    backgroundColor: "white",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 24,
    paddingBottom: 40,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#2D3748",
    marginBottom: 6,
  },
  modalSubtitle: {
    fontSize: 14,
    color: "#718096",
    marginBottom: 16,
    lineHeight: 20,
  },
  modalInput: {
    backgroundColor: "#F7FAFC",
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#E2E8F0",
    padding: 14,
    fontSize: 15,
    color: "#2D3748",
    textAlignVertical: "top",
    minHeight: 80,
  },
  charCount: {
    fontSize: 12,
    color: "#A0AEC0",
    textAlign: "right",
    marginTop: 4,
    marginBottom: 16,
  },
  modalActions: { flexDirection: "row", gap: 12 },
  modalCancel: {
    flex: 1,
    padding: 14,
    borderRadius: 10,
    backgroundColor: "#F7FAFC",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#E2E8F0",
  },
  modalCancelText: { color: "#718096", fontWeight: "600", fontSize: 15 },
  modalSend: {
    flex: 2,
    padding: 14,
    borderRadius: 10,
    backgroundColor: "#2B6CB0",
    alignItems: "center",
  },
  modalSendText: { color: "white", fontWeight: "700", fontSize: 15 },
});
