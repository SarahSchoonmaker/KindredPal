// mobile/src/screens/MemberProfileScreen.js
import React, { useState, useEffect, useLayoutEffect } from "react";
import {
  View,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Image,
  Alert,
  TextInput,
  Modal,
  ActionSheetIOS,
  Platform,
} from "react-native";
import { Text, ActivityIndicator } from "react-native-paper";
import {
  MessageCircle,
  UserPlus,
  UserCheck,
  Clock,
  Users,
  MoreVertical,
} from "lucide-react-native";
import api from "../services/api";

const CATEGORY_ICONS = {
  "Caregiver Support": "🤲",
  "Grief & Loss": "🌿",
  "Sober & Clean Living": "🍃",
  "New Parent Support": "👶",
  "Chronic Illness Support": "🎗️",
  "Anxiety & Mental Wellness": "🧘",
  "Veteran Support": "🎖️",
  "Senior Wellness": "🌻",
  "Loneliness & Social Connection": "💙",
  "Divorce Recovery": "🌱",
  "Faith & Spiritual Support": "🙏",
  "Life Transitions": "🔄",
  "Trauma Recovery": "🕊️",
  "Cancer Support": "💛",
  "Single Parent Support": "👨‍👧",
  "Addiction Recovery": "⭐",
  "Autism & Special Needs Families": "🦋",
  "Singles Social Support": "🌟",
  "Married No Kids": "💑",
  "Career Change Support": "💼",
  "Financial Recovery": "💰",
  "Sports & Fitness": "🏃",
  "Local Activity Groups": "🎯",
};

const REPORT_REASONS = [
  "Inappropriate content",
  "Harassment or bullying",
  "Spam or fake account",
  "Hate speech",
  "Other",
];

function TagPill({ label, color = "#EBF4FF", textColor = "#2B6CB0" }) {
  return (
    <View style={[styles.pill, { backgroundColor: color }]}>
      <Text style={[styles.pillText, { color: textColor }]}>{label}</Text>
    </View>
  );
}

export default function MemberProfileScreen({ route, navigation }) {
  const { userId, sharedGroups = [] } = route.params || {};

  const [profile, setProfile] = useState(null);
  const [connectionStatus, setConnectionStatus] = useState("none");
  const [connectionId, setConnectionId] = useState(null);
  const [isSender, setIsSender] = useState(false);
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [showMessageModal, setShowMessageModal] = useState(false);
  const [requestMessage, setRequestMessage] = useState("");
  const [showReportModal, setShowReportModal] = useState(false);
  const [reportReason, setReportReason] = useState("");
  const [reportSubmitting, setReportSubmitting] = useState(false);

  useLayoutEffect(() => {
    navigation.setOptions({
      headerBackTitle: "Back",
      headerBackButtonMenuEnabled: false,
      // ... menu in header for report/block
      headerRight: () => (
        <TouchableOpacity
          onPress={handleMoreMenu}
          style={{ marginRight: 12, padding: 4 }}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        >
          <MoreVertical size={22} color="white" />
        </TouchableOpacity>
      ),
    });
  }, [profile]);

  useEffect(() => {
    if (!userId) {
      setLoading(false);
      return;
    }
    const fetchData = async () => {
      try {
        const [profileRes, statusRes] = await Promise.all([
          api.get(`/users/profile/${userId}`),
          api
            .get(`/connections/status/${userId}`)
            .catch(() => ({ data: { status: "none" } })),
        ]);
        setProfile(profileRes.data);
        setConnectionStatus(statusRes.data.status || "none");
        setConnectionId(statusRes.data.connectionId);
        setIsSender(statusRes.data.isSender);
        navigation.setOptions({
          title: profileRes.data.name || "Profile",
          headerBackTitle: "Back",
          headerBackButtonMenuEnabled: false,
        });
      } catch (err) {
        console.error("MemberProfile fetch error:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [userId]);

  const handleMoreMenu = () => {
    if (!profile) return;
    if (Platform.OS === "ios") {
      ActionSheetIOS.showActionSheetWithOptions(
        {
          options: ["Cancel", "Report User", "Block User"],
          destructiveButtonIndex: 2,
          cancelButtonIndex: 0,
        },
        (buttonIndex) => {
          if (buttonIndex === 1) setShowReportModal(true);
          if (buttonIndex === 2) handleBlock();
        },
      );
    } else {
      Alert.alert(profile.name, "What would you like to do?", [
        { text: "Report User", onPress: () => setShowReportModal(true) },
        { text: "Block User", style: "destructive", onPress: handleBlock },
        { text: "Cancel", style: "cancel" },
      ]);
    }
  };

  const handleBlock = () => {
    Alert.alert(
      "Block User",
      `Block ${profile?.name}? They won't be able to see your profile or message you.`,
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Block",
          style: "destructive",
          onPress: async () => {
            try {
              await api.post(`/users/${userId}/block`);
              Alert.alert("Blocked", `${profile?.name} has been blocked.`);
              navigation.goBack();
            } catch (err) {
              Alert.alert(
                "Error",
                err.response?.data?.message || "Could not block user",
              );
            }
          },
        },
      ],
    );
  };

  const handleReport = async () => {
    if (!reportReason) {
      Alert.alert("Select a reason", "Please select a reason for reporting.");
      return;
    }
    setReportSubmitting(true);
    try {
      await api.post(`/users/${userId}/report`, { reason: reportReason });
      setShowReportModal(false);
      setReportReason("");
      Alert.alert(
        "Report Submitted",
        "Thank you. Our team will review this report and take appropriate action.",
      );
    } catch (err) {
      Alert.alert(
        "Error",
        err.response?.data?.message || "Could not submit report",
      );
    } finally {
      setReportSubmitting(false);
    }
  };

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
    navigation.navigate("Chat", {
      match: { ...profile, _id: profile._id || profile.id },
    });
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
        <Text style={{ color: "#718096", fontSize: 16 }}>
          Profile not found
        </Text>
        <TouchableOpacity
          style={styles.goBackBtn}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.goBackBtnText}>Go Back</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const lifeStage = Array.isArray(profile.lifeStage) ? profile.lifeStage : [];
  const causes = Array.isArray(profile.causes) ? profile.causes : [];
  const coreValues = Array.isArray(profile.coreValues)
    ? profile.coreValues
    : [];
  const familySituation = Array.isArray(profile.familySituation)
    ? profile.familySituation
    : [];
  const religion = typeof profile.religion === "string" ? profile.religion : "";
  const politicalBeliefs =
    typeof profile.politicalBeliefs === "string"
      ? profile.politicalBeliefs
      : "";
  const showReligion =
    religion &&
    religion !== "Prefer not to say" &&
    religion !== "None" &&
    religion !== "";
  const showPolitics =
    politicalBeliefs &&
    politicalBeliefs !== "Prefer not to say" &&
    politicalBeliefs !== "";

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
              } catch {
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
          {profile.profilePhoto ? (
            <Image
              source={{ uri: profile.profilePhoto }}
              style={styles.photo}
            />
          ) : (
            <View style={[styles.photo, styles.photoPlaceholder]}>
              <Text style={styles.photoInitial}>
                {profile.name?.charAt(0)?.toUpperCase() || "?"}
              </Text>
            </View>
          )}
          <Text style={styles.name}>{profile.name}</Text>
          {profile.city || profile.state ? (
            <Text style={styles.location}>
              📍 {[profile.city, profile.state].filter(Boolean).join(", ")}
            </Text>
          ) : null}
          {profile.age ? (
            <Text style={styles.age}>{profile.age} years old</Text>
          ) : null}
        </View>

        {/* Connection action */}
        <View style={styles.actionContainer}>{renderConnectionButton()}</View>

        {/* Report / Block row */}
        <View style={styles.safetyRow}>
          <TouchableOpacity
            style={styles.safetyBtn}
            onPress={() => setShowReportModal(true)}
          >
            <Text style={styles.safetyBtnText}>🚩 Report</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.safetyBtn, styles.safetyBtnBlock]}
            onPress={handleBlock}
          >
            <Text style={[styles.safetyBtnText, { color: "#E53E3E" }]}>
              🚫 Block
            </Text>
          </TouchableOpacity>
        </View>

        {/* Shared groups */}
        {sharedGroups.length > 0 && (
          <View style={styles.section}>
            <View style={styles.sectionTitleRow}>
              <Users size={16} color="#2B6CB0" />
              <Text style={styles.sectionTitle}>Groups in Common</Text>
            </View>
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
        {profile.bio ? (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>About</Text>
            <Text style={styles.bio}>{profile.bio}</Text>
          </View>
        ) : null}

        {/* Life Stage */}
        {lifeStage.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Life Stage</Text>
            <View style={styles.pills}>
              {lifeStage.map((s, i) => (
                <TagPill
                  key={i}
                  label={s}
                  color="#F0FFF4"
                  textColor="#276749"
                />
              ))}
            </View>
          </View>
        )}

        {/* Family */}
        {familySituation.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Family</Text>
            <View style={styles.pills}>
              {familySituation.map((f, i) => (
                <TagPill
                  key={i}
                  label={f}
                  color="#FFF5F5"
                  textColor="#742A2A"
                />
              ))}
            </View>
          </View>
        )}

        {/* Core Values */}
        {coreValues.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Core Values</Text>
            <View style={styles.pills}>
              {coreValues.map((v, i) => (
                <TagPill key={i} label={v} />
              ))}
            </View>
          </View>
        )}

        {/* Values */}
        {(showReligion || showPolitics) && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Values</Text>
            <View style={styles.pills}>
              {showReligion && (
                <TagPill
                  label={`⛪ ${religion}`}
                  color="#FFFAF0"
                  textColor="#744210"
                />
              )}
              {showPolitics && (
                <TagPill
                  label={`🏛 ${politicalBeliefs}`}
                  color="#FAF5FF"
                  textColor="#553C9A"
                />
              )}
            </View>
          </View>
        )}

        {/* Interests */}
        {causes.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Interests</Text>
            <View style={styles.pills}>
              {causes.map((c, i) => (
                <TagPill key={i} label={c} />
              ))}
            </View>
          </View>
        )}

        <View style={{ height: 40 }} />
      </ScrollView>

      {/* Connection request modal */}
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
              Add an optional message to introduce yourself
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

      {/* Report modal */}
      <Modal
        visible={showReportModal}
        transparent
        animationType="slide"
        onRequestClose={() => setShowReportModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            <Text style={styles.modalTitle}>Report {profile.name}</Text>
            <Text style={styles.modalSubtitle}>
              Why are you reporting this user?
            </Text>
            {REPORT_REASONS.map((reason) => (
              <TouchableOpacity
                key={reason}
                style={[
                  styles.reportOption,
                  reportReason === reason && styles.reportOptionSelected,
                ]}
                onPress={() => setReportReason(reason)}
              >
                <View
                  style={[
                    styles.reportRadio,
                    reportReason === reason && styles.reportRadioSelected,
                  ]}
                />
                <Text
                  style={[
                    styles.reportOptionText,
                    reportReason === reason && {
                      color: "#2B6CB0",
                      fontWeight: "700",
                    },
                  ]}
                >
                  {reason}
                </Text>
              </TouchableOpacity>
            ))}
            <View style={[styles.modalActions, { marginTop: 16 }]}>
              <TouchableOpacity
                style={styles.modalCancel}
                onPress={() => {
                  setShowReportModal(false);
                  setReportReason("");
                }}
              >
                <Text style={styles.modalCancelText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  styles.modalSend,
                  { backgroundColor: "#E53E3E" },
                  (!reportReason || reportSubmitting) && styles.btnDisabled,
                ]}
                onPress={handleReport}
                disabled={!reportReason || reportSubmitting}
              >
                <Text style={styles.modalSendText}>
                  {reportSubmitting ? "Submitting..." : "Submit Report"}
                </Text>
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
  center: { flex: 1, justifyContent: "center", alignItems: "center", gap: 16 },
  goBackBtn: {
    backgroundColor: "#2B6CB0",
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
    marginTop: 8,
  },
  goBackBtnText: { color: "white", fontWeight: "700", fontSize: 15 },
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
  photoPlaceholder: {
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(255,255,255,0.2)",
  },
  photoInitial: { fontSize: 40, fontWeight: "700", color: "white" },
  name: { fontSize: 24, fontWeight: "700", color: "white", marginBottom: 4 },
  location: { fontSize: 14, color: "rgba(255,255,255,0.85)", marginBottom: 2 },
  age: { fontSize: 13, color: "rgba(255,255,255,0.7)" },
  actionContainer: { margin: 16, marginBottom: 8 },
  safetyRow: {
    flexDirection: "row",
    marginHorizontal: 16,
    marginBottom: 12,
    gap: 10,
  },
  safetyBtn: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 8,
    backgroundColor: "white",
    borderWidth: 1,
    borderColor: "#E2E8F0",
    alignItems: "center",
  },
  safetyBtnBlock: { borderColor: "#FED7D7" },
  safetyBtnText: { fontSize: 13, fontWeight: "600", color: "#718096" },
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
  sectionTitleRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    marginBottom: 10,
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
  pill: { paddingHorizontal: 12, paddingVertical: 5, borderRadius: 20 },
  pillText: { fontSize: 13, fontWeight: "500" },
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
  reportOption: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#F7FAFC",
  },
  reportOptionSelected: {
    backgroundColor: "#EBF4FF",
    borderRadius: 8,
    paddingHorizontal: 8,
  },
  reportOptionText: { fontSize: 15, color: "#4A5568" },
  reportRadio: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: "#CBD5E0",
  },
  reportRadioSelected: { borderColor: "#2B6CB0", backgroundColor: "#2B6CB0" },
});
