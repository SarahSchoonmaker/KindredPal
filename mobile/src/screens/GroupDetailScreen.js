import React, { useState, useCallback } from "react";
import {
  View,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Alert,
  Image,
  RefreshControl,
} from "react-native";
import { Text, ActivityIndicator } from "react-native-paper";
import {
  Users,
  MessageCircle,
  Lock,
  Globe,
  LogOut,
  Settings,
} from "lucide-react-native";
import { useFocusEffect } from "@react-navigation/native";
import api from "../services/api";

function MemberCard({ member, onViewProfile }) {
  return (
    <TouchableOpacity
      style={styles.memberCard}
      onPress={() => onViewProfile(member)}
    >
      <Image source={{ uri: member.profilePhoto }} style={styles.memberPhoto} />
      <View style={styles.memberInfo}>
        <Text style={styles.memberName}>{member.name}</Text>
        <Text style={styles.memberLocation}>
          {member.city}, {member.state}
        </Text>
        {member.bio && (
          <Text style={styles.memberBio} numberOfLines={1}>
            {member.bio}
          </Text>
        )}
      </View>
      <View style={styles.messageBtn}>
        <MessageCircle size={18} color="#2B6CB0" />
      </View>
    </TouchableOpacity>
  );
}

export default function GroupDetailScreen({ route, navigation }) {
  const { groupId } = route.params;
  const [group, setGroup] = useState(null);
  const [loading, setLoading] = useState(true);
  const [joining, setJoining] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  const fetchGroup = useCallback(async () => {
    try {
      const res = await api.get(`/groups/${groupId}`);
      setGroup(res.data);
      navigation.setOptions({ title: res.data.name });
    } catch (err) {
      console.error("Error fetching group:", err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [groupId]);

  useFocusEffect(
    useCallback(() => {
      setLoading(true);
      fetchGroup();
    }, [fetchGroup]),
  );

  const handleJoin = async () => {
    setJoining(true);
    try {
      const res = await api.post(`/groups/${groupId}/join`);
      await fetchGroup();
      if (group?.isPrivate) {
        Alert.alert(
          "Request Sent",
          "Your request to join has been sent to the group admin.",
        );
      } else {
        Alert.alert("Welcome!", `You've joined ${group?.name}!`);
      }
    } catch (err) {
      Alert.alert(
        "Error",
        err.response?.data?.message || "Could not join group",
      );
    } finally {
      setJoining(false);
    }
  };

  const handleLeave = () => {
    Alert.alert(
      "Leave Group",
      `Are you sure you want to leave ${group?.name}?`,
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Leave",
          style: "destructive",
          onPress: async () => {
            try {
              await api.post(`/groups/${groupId}/leave`);
              navigation.goBack();
            } catch (err) {
              Alert.alert(
                "Error",
                err.response?.data?.message || "Could not leave group",
              );
            }
          },
        },
      ],
    );
  };

  const handleViewProfile = (member) => {
    navigation.navigate("MemberProfile", {
      userId: member._id,
      sharedGroups: [
        { _id: group._id, name: group.name, category: group.category },
      ],
    });
  };

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#2B6CB0" />
      </View>
    );
  }

  if (!group) {
    return (
      <View style={styles.center}>
        <Text>Group not found</Text>
      </View>
    );
  }

  return (
    <ScrollView
      style={styles.container}
      refreshControl={
        <RefreshControl
          refreshing={refreshing}
          onRefresh={() => {
            setRefreshing(true);
            fetchGroup();
          }}
        />
      }
    >
      {/* Group Header */}
      <View style={styles.header}>
        <View style={styles.headerIcon}>
          <Text style={styles.headerIconText}>👥</Text>
        </View>
        <Text style={styles.groupName}>{group.name}</Text>
        <View style={styles.headerMeta}>
          {group.isPrivate ? (
            <View style={styles.metaBadge}>
              <Lock size={12} color="#718096" />
              <Text style={styles.metaBadgeText}>Private Group</Text>
            </View>
          ) : (
            <View style={[styles.metaBadge, styles.metaBadgePublic]}>
              <Globe size={12} color="#276749" />
              <Text style={[styles.metaBadgeText, { color: "#276749" }]}>
                Public Group
              </Text>
            </View>
          )}
          <Text style={styles.categoryText}>{group.category}</Text>
        </View>
        {group.city ? (
          <Text style={styles.locationText}>
            📍 {group.city}, {group.state}
          </Text>
        ) : (
          <Text style={styles.locationText}>🌍 Nationwide</Text>
        )}
      </View>

      {/* Description */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>About</Text>
        <Text style={styles.description}>{group.description}</Text>
      </View>

      {/* Stats */}
      <View style={styles.stats}>
        <View style={styles.stat}>
          <Text style={styles.statNumber}>{group.memberCount || 0}</Text>
          <Text style={styles.statLabel}>Members</Text>
        </View>
        <View style={styles.statDivider} />
        <View style={styles.stat}>
          <Text style={styles.statNumber}>{group.isPrivate ? "🔒" : "🌐"}</Text>
          <Text style={styles.statLabel}>
            {group.isPrivate ? "Private" : "Public"}
          </Text>
        </View>
      </View>

      {/* Join / Leave Button */}
      <View style={styles.actionContainer}>
        {group.isMember ? (
          <TouchableOpacity style={styles.leaveButton} onPress={handleLeave}>
            <LogOut size={18} color="#E53E3E" />
            <Text style={styles.leaveButtonText}>Leave Group</Text>
          </TouchableOpacity>
        ) : group.isPending ? (
          <View style={styles.pendingButton}>
            <Text style={styles.pendingButtonText}>
              ⏳ Join Request Pending
            </Text>
          </View>
        ) : (
          <TouchableOpacity
            style={styles.joinButton}
            onPress={handleJoin}
            disabled={joining}
          >
            <Text style={styles.joinButtonText}>
              {joining
                ? "..."
                : group.isPrivate
                  ? "🔒 Request to Join"
                  : "Join Group"}
            </Text>
          </TouchableOpacity>
        )}
      </View>

      {/* Members — only show if member or public group */}
      {(group.isMember || !group.isPrivate) && group.members?.length > 0 && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>
            Members ({group.members.length})
          </Text>
          {group.members.map((member) => (
            <MemberCard
              key={member._id}
              member={member}
              onViewProfile={handleViewProfile}
            />
          ))}
        </View>
      )}

      {/* Private group message for non-members */}
      {group.isPrivate && !group.isMember && !group.isPending && (
        <View style={styles.privateMessage}>
          <Lock size={24} color="#718096" />
          <Text style={styles.privateMessageText}>
            Join this group to see members and connect with the community.
          </Text>
        </View>
      )}

      <View style={{ height: 40 }} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F7FAFC" },
  center: { flex: 1, justifyContent: "center", alignItems: "center" },

  header: {
    backgroundColor: "#2B6CB0",
    padding: 24,
    alignItems: "center",
  },
  headerIcon: {
    width: 72,
    height: 72,
    borderRadius: 20,
    backgroundColor: "rgba(255,255,255,0.2)",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 12,
  },
  headerIconText: { fontSize: 36 },
  groupName: {
    fontSize: 22,
    fontWeight: "700",
    color: "white",
    textAlign: "center",
    marginBottom: 10,
  },
  headerMeta: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    marginBottom: 6,
  },
  metaBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    backgroundColor: "rgba(255,255,255,0.15)",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 20,
  },
  metaBadgePublic: { backgroundColor: "#C6F6D5" },
  metaBadgeText: { fontSize: 12, color: "white", fontWeight: "600" },
  categoryText: { fontSize: 13, color: "rgba(255,255,255,0.8)" },
  locationText: { fontSize: 13, color: "rgba(255,255,255,0.8)" },

  section: {
    backgroundColor: "white",
    margin: 12,
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: "#E2E8F0",
  },
  sectionTitle: {
    fontSize: 17,
    fontWeight: "700",
    color: "#2D3748",
    marginBottom: 10,
  },
  description: { fontSize: 15, color: "#4A5568", lineHeight: 22 },

  stats: {
    flexDirection: "row",
    backgroundColor: "white",
    marginHorizontal: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#E2E8F0",
    padding: 16,
  },
  stat: { flex: 1, alignItems: "center" },
  statNumber: { fontSize: 24, fontWeight: "700", color: "#2B6CB0" },
  statLabel: { fontSize: 12, color: "#718096", marginTop: 2 },
  statDivider: { width: 1, backgroundColor: "#E2E8F0" },

  actionContainer: { margin: 12 },
  joinButton: {
    backgroundColor: "#2B6CB0",
    borderRadius: 10,
    padding: 16,
    alignItems: "center",
  },
  joinButtonText: { color: "white", fontSize: 16, fontWeight: "700" },
  leaveButton: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 8,
    backgroundColor: "#FFF5F5",
    borderRadius: 10,
    padding: 16,
    borderWidth: 1,
    borderColor: "#FED7D7",
  },
  leaveButtonText: { color: "#E53E3E", fontSize: 16, fontWeight: "600" },
  pendingButton: {
    backgroundColor: "#FEFCBF",
    borderRadius: 10,
    padding: 16,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#F6E05E",
  },
  pendingButtonText: { color: "#744210", fontSize: 15, fontWeight: "600" },

  memberCard: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#F7FAFC",
  },
  memberPhoto: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "#E2E8F0",
  },
  memberInfo: { flex: 1, marginLeft: 12 },
  memberName: { fontSize: 15, fontWeight: "600", color: "#2D3748" },
  memberLocation: { fontSize: 12, color: "#718096" },
  memberBio: { fontSize: 12, color: "#4A5568", marginTop: 2 },
  messageBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "#EBF4FF",
    justifyContent: "center",
    alignItems: "center",
  },

  privateMessage: {
    margin: 12,
    padding: 20,
    backgroundColor: "white",
    borderRadius: 12,
    alignItems: "center",
    gap: 10,
    borderWidth: 1,
    borderColor: "#E2E8F0",
  },
  privateMessageText: {
    fontSize: 14,
    color: "#718096",
    textAlign: "center",
    lineHeight: 20,
  },
});
