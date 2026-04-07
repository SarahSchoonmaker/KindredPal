import React, { useState, useCallback, useEffect } from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  RefreshControl,
} from "react-native";
import { ActivityIndicator } from "react-native-paper";
import {
  MapPin,
  Edit,
  Camera,
  Star,
  Trash2,
  Shield,
  ChevronRight,
  LogOut,
  User,
} from "lucide-react-native";
import * as ImagePicker from "expo-image-picker";
import * as SecureStore from "expo-secure-store";
import { authAPI, userAPI } from "../services/api";
import api from "../services/api";
import { useFocusEffect } from "@react-navigation/native";

const BLUE = "#2B6CB0";
const RED = "#E53E3E";

export default function ProfileScreen({ navigation }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [photos, setPhotos] = useState([]);
  const [deletingAccount, setDeletingAccount] = useState(false);

  const fetchProfile = useCallback(async () => {
    try {
      const response = await authAPI.getProfile();
      setUser(response.data);
      const currentPhotos = response.data.additionalPhotos || [];
      setPhotos(
        [
          response.data.profilePhoto,
          ...currentPhotos,
          ...Array(Math.max(0, 3 - currentPhotos.length - 1)).fill(null),
        ].slice(0, 3),
      );
    } catch (error) {
      console.error("Error fetching profile:", error);
      Alert.alert("Error", "Failed to load profile");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    fetchProfile();
  }, [fetchProfile]);

  useFocusEffect(
    useCallback(() => {
      if (!loading) fetchProfile();
    }, [fetchProfile, loading]),
  );

  const onRefresh = () => {
    setRefreshing(true);
    fetchProfile();
  };

  const pickImage = async (index) => {
    try {
      const { status } =
        await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== "granted") {
        Alert.alert("Permission needed", "Please grant photo library access");
        return;
      }
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
        base64: true,
      });
      if (!result.canceled && result.assets[0].base64) {
        const base64Image = `data:image/jpeg;base64,${result.assets[0].base64}`;
        const newPhotos = [...photos];
        newPhotos[index] = base64Image;
        setPhotos(newPhotos);
        await updatePhotos(newPhotos);
      }
    } catch (error) {
      console.error("Error picking image:", error);
      Alert.alert("Error", "Failed to upload photo");
    }
  };

  const deletePhoto = async (index) => {
    if (index === 0) {
      Alert.alert("Cannot Delete", "You must have a profile photo");
      return;
    }
    Alert.alert("Delete Photo", "Remove this photo?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Delete",
        style: "destructive",
        onPress: async () => {
          const newPhotos = [...photos];
          newPhotos[index] = null;
          setPhotos(newPhotos);
          await updatePhotos(newPhotos);
        },
      },
    ]);
  };

  const setAsProfilePhoto = async (index) => {
    Alert.alert("Set as Profile Photo", "Make this your profile picture?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Set",
        onPress: async () => {
          const newPhotos = [...photos];
          const temp = newPhotos[0];
          newPhotos[0] = newPhotos[index];
          newPhotos[index] = temp;
          setPhotos(newPhotos);
          await updatePhotos(newPhotos);
        },
      },
    ]);
  };

  const updatePhotos = async (newPhotos) => {
    try {
      const filteredPhotos = newPhotos.filter((p) => p !== null);
      await userAPI.updateProfile({
        profilePhoto: filteredPhotos[0],
        additionalPhotos: filteredPhotos.slice(1),
      });
      Alert.alert("Success", "Photos updated!");
      fetchProfile();
    } catch (error) {
      console.error("Error updating photos:", error);
      Alert.alert("Error", "Failed to update photos");
    }
  };

  // FIX: Clear ALL stored credentials on logout so next login starts fresh
  const handleLogout = () => {
    Alert.alert("Log Out", "Are you sure you want to log out?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Log Out",
        style: "destructive",
        onPress: async () => {
          try {
            await SecureStore.deleteItemAsync("token");
            await SecureStore.deleteItemAsync("userId");
          } catch (e) {
            console.warn("SecureStore clear error:", e);
          }
          navigation.reset({ index: 0, routes: [{ name: "Login" }] });
        },
      },
    ]);
  };

  const handleDeleteAccount = () => {
    Alert.alert(
      "Delete Account",
      "This will permanently delete your account and all your data. This cannot be undone.",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Continue",
          style: "destructive",
          onPress: () => {
            Alert.alert(
              "Are You Sure?",
              "All your groups, connections, messages and profile data will be permanently deleted.",
              [
                { text: "Cancel", style: "cancel" },
                {
                  text: "Delete Forever",
                  style: "destructive",
                  onPress: performDeleteAccount,
                },
              ],
            );
          },
        },
      ],
    );
  };

  // FIX: Clear ALL credentials after delete and navigate to Login
  const performDeleteAccount = async () => {
    setDeletingAccount(true);
    try {
      await api.delete("/users/account");
      // Clear all stored credentials
      try {
        await SecureStore.deleteItemAsync("token");
        await SecureStore.deleteItemAsync("userId");
      } catch (e) {
        console.warn("SecureStore clear error:", e);
      }
      // Navigate to Login — reset stack so user can't go back
      Alert.alert(
        "Account Deleted",
        "Your account has been permanently deleted.",
        [
          {
            text: "OK",
            onPress: () =>
              navigation.reset({ index: 0, routes: [{ name: "Login" }] }),
          },
        ],
      );
    } catch (error) {
      console.error("Delete account error:", error.response?.data);
      Alert.alert(
        "Error",
        error.response?.data?.message ||
          "Failed to delete account. Please try again.",
      );
    } finally {
      setDeletingAccount(false);
    }
  };

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color={BLUE} />
        <Text style={styles.loadingText}>Loading profile...</Text>
      </View>
    );
  }

  if (!user) {
    return (
      <View style={styles.center}>
        <Text style={styles.errorText}>Profile not found</Text>
        <TouchableOpacity style={styles.retryBtn} onPress={fetchProfile}>
          <Text style={styles.retryBtnText}>Retry</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <ScrollView
      style={styles.container}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
    >
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          {user.profilePhoto ? (
            <Image
              source={{ uri: user.profilePhoto }}
              style={styles.headerAvatar}
            />
          ) : (
            <View style={[styles.headerAvatar, styles.headerAvatarPlaceholder]}>
              <Text style={styles.headerAvatarInitial}>
                {user.name?.charAt(0)?.toUpperCase() || "?"}
              </Text>
            </View>
          )}
          <View>
            <Text style={styles.headerName}>{user.name}</Text>
            {user.city || user.state ? (
              <View style={styles.headerLocation}>
                <MapPin size={13} color="#718096" />
                <Text style={styles.headerLocationText}>
                  {[user.city, user.state].filter(Boolean).join(", ")}
                </Text>
              </View>
            ) : null}
          </View>
        </View>
        <TouchableOpacity
          style={styles.editBtn}
          onPress={() => navigation.navigate("EditProfile")}
        >
          <Edit size={20} color={BLUE} />
        </TouchableOpacity>
      </View>

      {/* Photos */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Photos</Text>
        <View style={styles.photoGrid}>
          {photos.map((photo, index) => (
            <View key={index} style={styles.photoWrap}>
              {photo ? (
                <>
                  <Image
                    source={{ uri: photo }}
                    style={styles.photo}
                    resizeMode="cover"
                  />
                  {index === 0 && (
                    <View style={styles.profileBadge}>
                      <Star size={11} color="white" fill="white" />
                      <Text style={styles.profileBadgeText}>Profile</Text>
                    </View>
                  )}
                  <View style={styles.photoActions}>
                    {index !== 0 && (
                      <TouchableOpacity
                        style={styles.photoActionBtn}
                        onPress={() => setAsProfilePhoto(index)}
                      >
                        <Star size={16} color="white" />
                      </TouchableOpacity>
                    )}
                    <TouchableOpacity
                      style={[styles.photoActionBtn, styles.photoDeleteBtn]}
                      onPress={() => deletePhoto(index)}
                    >
                      <Trash2 size={16} color="white" />
                    </TouchableOpacity>
                  </View>
                </>
              ) : (
                <TouchableOpacity
                  style={styles.addPhoto}
                  onPress={() => pickImage(index)}
                >
                  <Camera size={28} color={BLUE} />
                  <Text style={styles.addPhotoText}>Add Photo</Text>
                </TouchableOpacity>
              )}
            </View>
          ))}
        </View>
        <Text style={styles.photoHint}>
          ⭐ Tap the star to set as your profile picture
        </Text>
      </View>

      {/* About */}
      {user.bio || user.age || user.email ? (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>About</Text>
          <View style={styles.card}>
            {user.age ? (
              <View style={styles.infoRow}>
                <User size={16} color={BLUE} />
                <Text style={styles.infoText}>{user.age} years old</Text>
              </View>
            ) : null}
            {user.email ? (
              <TouchableOpacity
                style={styles.emailRow}
                onPress={() => navigation.navigate("EditProfile")}
              >
                <View>
                  <Text style={styles.emailLabel}>Email</Text>
                  <Text style={styles.emailValue}>{user.email}</Text>
                </View>
                <ChevronRight size={16} color="#a0aec0" />
              </TouchableOpacity>
            ) : null}
            {user.bio ? (
              <View style={styles.bioWrap}>
                <Text style={styles.bio}>{user.bio}</Text>
              </View>
            ) : null}
          </View>
        </View>
      ) : null}

      {/* Values & Beliefs */}
      {user.politicalBeliefs ||
      user.religion ||
      user.causes?.length > 0 ||
      user.lifeStage?.length > 0 ||
      user.familySituation?.length > 0 ||
      user.coreValues?.length > 0 ? (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Values & Beliefs</Text>
          <View style={styles.card}>
            {user.politicalBeliefs &&
              typeof user.politicalBeliefs === "string" && (
                <View style={styles.valueRow}>
                  <Text style={styles.valueLabel}>Political Views</Text>
                  <View style={styles.chips}>
                    <View style={styles.chip}>
                      <Text style={styles.chipText}>
                        {user.politicalBeliefs}
                      </Text>
                    </View>
                  </View>
                </View>
              )}
            {user.religion ? (
              <View style={styles.valueRow}>
                <Text style={styles.valueLabel}>Religion</Text>
                <Text style={styles.valueText}>{user.religion}</Text>
              </View>
            ) : null}
            {user.coreValues?.length > 0 ? (
              <View style={styles.valueRow}>
                <Text style={styles.valueLabel}>Core Values</Text>
                <View style={styles.chips}>
                  {user.coreValues.map((v, i) => (
                    <View
                      key={i}
                      style={[styles.chip, { backgroundColor: "#FAF5FF" }]}
                    >
                      <Text style={[styles.chipText, { color: "#6B21A8" }]}>
                        {v}
                      </Text>
                    </View>
                  ))}
                </View>
              </View>
            ) : null}
            {user.lifeStage?.length > 0 ? (
              <View style={styles.valueRow}>
                <Text style={styles.valueLabel}>Life Stage</Text>
                <View style={styles.chips}>
                  {user.lifeStage.map((s, i) => (
                    <View
                      key={i}
                      style={[styles.chip, { backgroundColor: "#F0FFF4" }]}
                    >
                      <Text style={[styles.chipText, { color: "#276749" }]}>
                        {s}
                      </Text>
                    </View>
                  ))}
                </View>
              </View>
            ) : null}
            {user.familySituation?.length > 0 ? (
              <View style={styles.valueRow}>
                <Text style={styles.valueLabel}>Family</Text>
                <View style={styles.chips}>
                  {user.familySituation.map((f, i) => (
                    <View
                      key={i}
                      style={[styles.chip, { backgroundColor: "#FFF5F5" }]}
                    >
                      <Text style={[styles.chipText, { color: "#742A2A" }]}>
                        {f}
                      </Text>
                    </View>
                  ))}
                </View>
              </View>
            ) : null}
            {user.causes?.length > 0 ? (
              <View style={styles.valueRow}>
                <Text style={styles.valueLabel}>Causes</Text>
                <View style={styles.chips}>
                  {user.causes.map((c, i) => (
                    <View key={i} style={styles.chip}>
                      <Text style={styles.chipText}>{c}</Text>
                    </View>
                  ))}
                </View>
              </View>
            ) : null}
          </View>
        </View>
      ) : null}

      {/* Privacy & Safety */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Privacy & Safety</Text>
        <TouchableOpacity
          style={styles.menuRow}
          onPress={() => navigation.navigate("BlockedUsers")}
        >
          <View style={styles.menuRowLeft}>
            <View style={[styles.menuIcon, { backgroundColor: "#EBF4FF" }]}>
              <Shield size={18} color={BLUE} />
            </View>
            <Text style={styles.menuRowText}>Blocked Users</Text>
          </View>
          <ChevronRight size={18} color="#a0aec0" />
        </TouchableOpacity>
      </View>

      {/* Account Actions */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Account</Text>
        <TouchableOpacity style={styles.menuRow} onPress={handleLogout}>
          <View style={styles.menuRowLeft}>
            <View style={[styles.menuIcon, { backgroundColor: "#FFF5F5" }]}>
              <LogOut size={18} color={RED} />
            </View>
            <Text style={[styles.menuRowText, { color: RED }]}>Log Out</Text>
          </View>
          <ChevronRight size={18} color="#a0aec0" />
        </TouchableOpacity>
        <View style={styles.menuDivider} />
        <TouchableOpacity
          style={styles.menuRow}
          onPress={handleDeleteAccount}
          disabled={deletingAccount}
        >
          <View style={styles.menuRowLeft}>
            <View style={[styles.menuIcon, { backgroundColor: "#FFF5F5" }]}>
              <Trash2 size={18} color={RED} />
            </View>
            <Text style={[styles.menuRowText, { color: RED }]}>
              {deletingAccount ? "Deleting..." : "Delete Account"}
            </Text>
          </View>
          {!deletingAccount && <ChevronRight size={18} color="#a0aec0" />}
          {deletingAccount && <ActivityIndicator size={16} color={RED} />}
        </TouchableOpacity>
      </View>

      <View style={{ height: 60 }} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F7FAFC" },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    gap: 16,
    padding: 40,
  },
  loadingText: { marginTop: 12, fontSize: 15, color: "#718096" },
  errorText: { fontSize: 16, color: "#718096" },
  retryBtn: {
    backgroundColor: BLUE,
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  retryBtnText: { color: "white", fontWeight: "700" },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 20,
    backgroundColor: "white",
    borderBottomWidth: 1,
    borderBottomColor: "#E2E8F0",
  },
  headerLeft: { flexDirection: "row", alignItems: "center", gap: 14, flex: 1 },
  headerAvatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: "#E2E8F0",
  },
  headerAvatarPlaceholder: {
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: BLUE,
  },
  headerAvatarInitial: { fontSize: 24, fontWeight: "700", color: "white" },
  headerName: {
    fontSize: 20,
    fontWeight: "700",
    color: "#1a202c",
    marginBottom: 3,
  },
  headerLocation: { flexDirection: "row", alignItems: "center", gap: 4 },
  headerLocationText: { fontSize: 13, color: "#718096" },
  editBtn: { padding: 8 },
  section: { padding: 16, paddingBottom: 0 },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#2D3748",
    marginBottom: 10,
  },
  photoGrid: { flexDirection: "row", gap: 10, marginBottom: 8 },
  photoWrap: { flex: 1, aspectRatio: 1, borderRadius: 12, overflow: "hidden" },
  photo: { width: "100%", height: "100%", backgroundColor: "#E2E8F0" },
  addPhoto: {
    flex: 1,
    backgroundColor: "white",
    borderWidth: 2,
    borderColor: "#E2E8F0",
    borderStyle: "dashed",
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    minHeight: 100,
  },
  addPhotoText: { marginTop: 6, fontSize: 11, color: BLUE, fontWeight: "600" },
  profileBadge: {
    position: "absolute",
    top: 6,
    left: 6,
    backgroundColor: BLUE,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 7,
    paddingVertical: 3,
    borderRadius: 10,
    gap: 3,
  },
  profileBadgeText: { color: "white", fontSize: 10, fontWeight: "600" },
  photoActions: {
    position: "absolute",
    bottom: 6,
    right: 6,
    flexDirection: "row",
    gap: 6,
  },
  photoActionBtn: {
    backgroundColor: "rgba(43,108,176,0.85)",
    padding: 7,
    borderRadius: 16,
  },
  photoDeleteBtn: { backgroundColor: "rgba(229,62,62,0.85)" },
  photoHint: {
    fontSize: 11,
    color: "#a0aec0",
    textAlign: "center",
    fontStyle: "italic",
    marginBottom: 16,
  },
  card: {
    backgroundColor: "white",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#E2E8F0",
    marginBottom: 16,
  },
  infoRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    paddingHorizontal: 14,
    paddingVertical: 12,
  },
  infoText: { fontSize: 14, color: "#718096" },
  emailRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 14,
    paddingVertical: 12,
    borderTopWidth: 1,
    borderTopColor: "#F7FAFC",
  },
  emailLabel: {
    fontSize: 11,
    fontWeight: "600",
    color: "#718096",
    marginBottom: 2,
    textTransform: "uppercase",
    letterSpacing: 0.4,
  },
  emailValue: { fontSize: 14, color: "#2D3748" },
  bioWrap: {
    paddingHorizontal: 14,
    paddingVertical: 12,
    borderTopWidth: 1,
    borderTopColor: "#F7FAFC",
  },
  bio: { fontSize: 14, color: "#4A5568", lineHeight: 20 },
  valueRow: {
    paddingHorizontal: 14,
    paddingVertical: 12,
    borderTopWidth: 1,
    borderTopColor: "#F7FAFC",
  },
  valueLabel: {
    fontSize: 12,
    fontWeight: "600",
    color: "#718096",
    marginBottom: 8,
    textTransform: "uppercase",
    letterSpacing: 0.4,
  },
  valueText: { fontSize: 14, color: "#2D3748" },
  chips: { flexDirection: "row", flexWrap: "wrap", gap: 6 },
  chip: {
    backgroundColor: "#EBF4FF",
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 14,
  },
  chipText: { fontSize: 12, color: BLUE, fontWeight: "500" },
  menuRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "white",
    padding: 14,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#E2E8F0",
    marginBottom: 10,
  },
  menuRowLeft: { flexDirection: "row", alignItems: "center", gap: 12 },
  menuIcon: {
    width: 36,
    height: 36,
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
  },
  menuRowText: { fontSize: 15, fontWeight: "500", color: "#2D3748" },
  menuDivider: { height: 0 },
});
