import React, { memo } from "react";
import { TouchableOpacity, View, Image, StyleSheet } from "react-native";
import { Text } from "react-native-paper";

const BLUE = "#2B6CB0";

function formatTime(date) {
  if (!date) return "";
  const now = new Date();
  const d = new Date(date);
  const mins = Math.floor((now - d) / 60000);
  if (mins < 1) return "Just now";
  if (mins < 60) return `${mins}m`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h`;
  const days = Math.floor(hrs / 24);
  if (days < 7) return `${days}d`;
  return d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

const MessageItem = memo(({ match, onPress }) => (
  <TouchableOpacity
    style={styles.row}
    onPress={() => onPress(match)}
    activeOpacity={0.7}
  >
    {/* Avatar */}
    <View style={styles.avatarWrap}>
      {match.profilePhoto ? (
        <Image source={{ uri: match.profilePhoto }} style={styles.avatar} />
      ) : (
        <View style={[styles.avatar, styles.avatarPlaceholder]}>
          <Text style={styles.avatarInitial}>
            {(match.name || "?")[0].toUpperCase()}
          </Text>
        </View>
      )}
      {match.unreadCount > 0 && (
        <View style={styles.badge}>
          <Text style={styles.badgeText}>
            {match.unreadCount > 9 ? "9+" : match.unreadCount}
          </Text>
        </View>
      )}
    </View>

    {/* Info */}
    <View style={styles.info}>
      {/* Name + timestamp on same row */}
      <View style={styles.nameRow}>
        <Text
          style={[styles.name, match.unreadCount > 0 && styles.nameUnread]}
          numberOfLines={1}
        >
          {match.name || "Member"}
        </Text>
        {match.timestamp && (
          <Text style={styles.time}>{formatTime(match.timestamp)}</Text>
        )}
      </View>
      {/* Last message preview */}
      <Text
        style={[styles.lastMsg, match.unreadCount > 0 && styles.lastMsgUnread]}
        numberOfLines={1}
      >
        {match.lastMessage || "Say hello! 👋"}
      </Text>
    </View>
  </TouchableOpacity>
));

export default MessageItem;

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: "white",
    borderBottomWidth: 1,
    borderBottomColor: "#F0F4F8",
  },
  avatarWrap: { position: "relative", marginRight: 14 },
  avatar: {
    width: 54,
    height: 54,
    borderRadius: 27,
    backgroundColor: "#EBF4FF",
  },
  avatarPlaceholder: { justifyContent: "center", alignItems: "center" },
  avatarInitial: { fontSize: 20, fontWeight: "700", color: BLUE },
  badge: {
    position: "absolute",
    top: -2,
    right: -2,
    backgroundColor: "#E53E3E",
    borderRadius: 10,
    minWidth: 20,
    height: 20,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 4,
    borderWidth: 2,
    borderColor: "white",
  },
  badgeText: { color: "white", fontSize: 11, fontWeight: "700" },
  info: { flex: 1 },
  nameRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 3,
  },
  name: { fontSize: 15, fontWeight: "600", color: "#2d3748", flex: 1 },
  nameUnread: { fontWeight: "800", color: "#1a202c" },
  time: { fontSize: 12, color: "#a0aec0", marginLeft: 8 },
  lastMsg: { fontSize: 13, color: "#718096" },
  lastMsgUnread: { fontWeight: "700", color: "#2d3748" },
});
