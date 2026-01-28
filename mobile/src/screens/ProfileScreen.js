import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  Alert,
} from "react-native";
import { Button, Card, Avatar, IconButton } from "react-native-paper";
import {
  User,
  MapPin,
  Heart,
  Calendar,
  Edit,
  Camera,
  Star,
  Trash2,
} from "lucide-react-native";
import * as ImagePicker from "expo-image-picker";
import AsyncStorage from "@react-native-async-storage/async-storage";
import api from "../services/api";

export default function ProfileScreen({ navigation }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [photos, setPhotos] = useState([]);

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const response = await api.get("/auth/profile");
      setUser(response.data);

      // Initialize photos array with profile photo and empty slots
      const currentPhotos = response.data.additionalPhotos || [];
      setPhotos(
        [
          response.data.profilePhoto,
          ...currentPhotos,
          ...Array(3 - currentPhotos.length - 1).fill(null),
        ].slice(0, 3),
      );
    } catch (error) {
      console.error("Error fetching profile:", error);
      Alert.alert("Error", "Failed to load profile");
    } finally {
      setLoading(false);
    }
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

        // Update photos array
        const newPhotos = [...photos];
        newPhotos[index] = base64Image;
        setPhotos(newPhotos);

        // Update backend
        await updatePhotos(newPhotos);
      }
    } catch (error) {
      console.error("Error picking image:", error);
      Alert.alert("Error", "Failed to upload photo");
    }
  };

  const deletePhoto = async (index) => {
    Alert.alert("Delete Photo", "Are you sure you want to delete this photo?", [
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
          // Swap with current profile photo
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
      const profilePhoto = filteredPhotos[0];
      const additionalPhotos = filteredPhotos.slice(1);

      await api.put("/users/profile", {
        profilePhoto,
        additionalPhotos,
      });

      Alert.alert("Success", "Photos updated successfully");
      fetchProfile();
    } catch (error) {
      console.error("Error updating photos:", error);
      Alert.alert("Error", "Failed to update photos");
    }
  };

  const handleLogout = async () => {
    Alert.alert("Logout", "Are you sure you want to logout?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Logout",
        style: "destructive",
        onPress: async () => {
          await AsyncStorage.removeItem("token");
          await AsyncStorage.removeItem("userId");
          navigation.replace("Login");
        },
      },
    ]);
  };

  const handleDeleteAccount = async () => {
    Alert.alert(
      "Delete Account",
      "Are you sure you want to permanently delete your account? This action cannot be undone.",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: () => {
            // Second confirmation
            Alert.alert(
              "Final Confirmation",
              "This will permanently delete all your data, matches, and messages. Are you absolutely sure?",
              [
                { text: "Cancel", style: "cancel" },
                {
                  text: "Delete Forever",
                  style: "destructive",
                  onPress: async () => {
                    try {
                      await api.delete("/users/account");
                      await AsyncStorage.removeItem("token");
                      await AsyncStorage.removeItem("userId");
                      Alert.alert(
                        "Account Deleted",
                        "Your account has been permanently deleted.",
                        [
                          {
                            text: "OK",
                            onPress: () => navigation.replace("Login"),
                          },
                        ],
                      );
                    } catch (error) {
                      console.error("Error deleting account:", error);
                      Alert.alert(
                        "Error",
                        "Failed to delete account. Please try again.",
                      );
                    }
                  },
                },
              ],
            );
          },
        },
      ],
    );
  };

  if (loading) {
    return (
      <View style={styles.centerContainer}>
        <Text>Loading...</Text>
      </View>
    );
  }

  if (!user) {
    return (
      <View style={styles.centerContainer}>
        <Text>Profile not found</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerContent}>
          <Text style={styles.name}>{user.name}</Text>
          <View style={styles.location}>
            <MapPin color="#666" size={16} />
            <Text style={styles.locationText}>
              {user.city}, {user.state}
            </Text>
          </View>
        </View>
        <TouchableOpacity
          style={styles.editButton}
          onPress={() => navigation.navigate("EditProfile")}
        >
          <Edit color="#2B6CB0" size={24} />
        </TouchableOpacity>
      </View>

      {/* Photo Gallery */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Photos</Text>
        <View style={styles.photoGrid}>
          {photos.map((photo, index) => (
            <View key={index} style={styles.photoContainer}>
              {photo ? (
                <>
                  <Image source={{ uri: photo }} style={styles.photo} />
                  {index === 0 && (
                    <View style={styles.profileBadge}>
                      <Star color="white" size={16} fill="white" />
                      <Text style={styles.profileBadgeText}>Profile</Text>
                    </View>
                  )}
                  <View style={styles.photoActions}>
                    {index !== 0 && (
                      <TouchableOpacity
                        style={styles.photoActionButton}
                        onPress={() => setAsProfilePhoto(index)}
                      >
                        <Star color="white" size={18} />
                      </TouchableOpacity>
                    )}
                    <TouchableOpacity
                      style={[styles.photoActionButton, styles.deleteButton]}
                      onPress={() => deletePhoto(index)}
                    >
                      <Trash2 color="white" size={18} />
                    </TouchableOpacity>
                  </View>
                </>
              ) : (
                <TouchableOpacity
                  style={styles.addPhoto}
                  onPress={() => pickImage(index)}
                >
                  <Camera color="#2B6CB0" size={32} />
                  <Text style={styles.addPhotoText}>Add Photo</Text>
                </TouchableOpacity>
              )}
            </View>
          ))}
        </View>
        <Text style={styles.photoHint}>
          Tap the star icon to set a photo as your profile picture
        </Text>
      </View>

      {/* About */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>About</Text>
        <Card style={styles.card}>
          <Card.Content>
            <View style={styles.infoRow}>
              <User color="#2B6CB0" size={20} />
              <Text style={styles.infoText}>
                {user.age} • {user.gender}
              </Text>
            </View>
            {user.bio && (
              <View style={styles.bioContainer}>
                <Text style={styles.bio}>{user.bio}</Text>
              </View>
            )}
          </Card.Content>
        </Card>
      </View>

      {/* Values */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Values & Beliefs</Text>
        <Card style={styles.card}>
          <Card.Content>
            {user.politicalBeliefs && user.politicalBeliefs.length > 0 && (
              <View style={styles.valueSection}>
                <Text style={styles.valueLabel}>Political Beliefs</Text>
                <View style={styles.chips}>
                  {user.politicalBeliefs.map((belief, index) => (
                    <View key={index} style={styles.chip}>
                      <Text style={styles.chipText}>{belief}</Text>
                    </View>
                  ))}
                </View>
              </View>
            )}

            {user.religion && (
              <View style={styles.valueSection}>
                <Text style={styles.valueLabel}>Religion</Text>
                <Text style={styles.valueText}>{user.religion}</Text>
              </View>
            )}

            {user.causes && user.causes.length > 0 && (
              <View style={styles.valueSection}>
                <Text style={styles.valueLabel}>Causes</Text>
                <View style={styles.chips}>
                  {user.causes.map((cause, index) => (
                    <View key={index} style={styles.chip}>
                      <Text style={styles.chipText}>{cause}</Text>
                    </View>
                  ))}
                </View>
              </View>
            )}

            {user.lifeStage && user.lifeStage.length > 0 && (
              <View style={styles.valueSection}>
                <Text style={styles.valueLabel}>Life Stage</Text>
                <View style={styles.chips}>
                  {user.lifeStage.map((stage, index) => (
                    <View key={index} style={styles.chip}>
                      <Text style={styles.chipText}>{stage}</Text>
                    </View>
                  ))}
                </View>
              </View>
            )}

            {user.lookingFor && user.lookingFor.length > 0 && (
              <View style={styles.valueSection}>
                <Text style={styles.valueLabel}>Looking For</Text>
                <View style={styles.chips}>
                  {user.lookingFor.map((item, index) => (
                    <View key={index} style={styles.chip}>
                      <Text style={styles.chipText}>{item}</Text>
                    </View>
                  ))}
                </View>
              </View>
            )}
          </Card.Content>
        </Card>
      </View>

      {/* Actions */}
      <View style={styles.actions}>
        <Button
          mode="outlined"
          onPress={() => navigation.navigate("Preferences")}
          style={styles.actionButton}
          icon={() => <Heart color="#2B6CB0" size={20} />}
        >
          Search Preferences
        </Button>

        <Button
          mode="contained"
          onPress={handleLogout}
          style={[styles.actionButton, styles.logoutButton]}
          buttonColor="#E53E3E"
        >
          Logout
        </Button>

        <Button
          mode="outlined"
          onPress={handleDeleteAccount}
          style={[styles.actionButton, styles.deleteButton]}
          textColor="#E53E3E"
        >
          Delete Account
        </Button>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F7FAFC",
  },
  centerContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 20,
    backgroundColor: "white",
    borderBottomWidth: 1,
    borderBottomColor: "#E2E8F0",
  },
  headerContent: {
    flex: 1,
  },
  name: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#2D2D2D",
    marginBottom: 4,
  },
  location: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  locationText: {
    fontSize: 14,
    color: "#666",
  },
  editButton: {
    padding: 8,
  },
  section: {
    padding: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "600",
    color: "#2D2D2D",
    marginBottom: 16,
  },
  photoGrid: {
    flexDirection: "row",
    gap: 12,
    marginBottom: 8,
  },
  photoContainer: {
    flex: 1,
    aspectRatio: 1,
    borderRadius: 12,
    overflow: "hidden",
    position: "relative",
  },
  photo: {
    width: "100%",
    height: "100%",
    backgroundColor: "#E2E8F0",
  },
  addPhoto: {
    flex: 1,
    backgroundColor: "#F8FAFC",
    borderWidth: 2,
    borderColor: "#E2E8F0",
    borderStyle: "dashed",
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
  },
  addPhotoText: {
    marginTop: 8,
    fontSize: 12,
    color: "#2B6CB0",
    fontWeight: "600",
  },
  profileBadge: {
    position: "absolute",
    top: 8,
    left: 8,
    backgroundColor: "#2B6CB0",
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    gap: 4,
  },
  profileBadgeText: {
    color: "white",
    fontSize: 10,
    fontWeight: "600",
  },
  photoActions: {
    position: "absolute",
    bottom: 8,
    right: 8,
    flexDirection: "row",
    gap: 8,
  },
  photoActionButton: {
    backgroundColor: "rgba(43, 108, 176, 0.9)",
    padding: 8,
    borderRadius: 20,
  },
  deleteButton: {
    backgroundColor: "rgba(229, 62, 62, 0.9)",
  },
  photoHint: {
    fontSize: 12,
    color: "#666",
    textAlign: "center",
    fontStyle: "italic",
  },
  card: {
    backgroundColor: "white",
  },
  infoRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 12,
  },
  infoText: {
    fontSize: 16,
    color: "#666",
  },
  bioContainer: {
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: "#E2E8F0",
  },
  bio: {
    fontSize: 15,
    color: "#2D2D2D",
    lineHeight: 22,
  },
  valueSection: {
    marginBottom: 16,
  },
  valueLabel: {
    fontSize: 14,
    fontWeight: "600",
    color: "#666",
    marginBottom: 8,
  },
  valueText: {
    fontSize: 15,
    color: "#2D2D2D",
  },
  chips: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  chip: {
    backgroundColor: "#DBEAFE",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  chipText: {
    fontSize: 13,
    color: "#2B6CB0",
    fontWeight: "500",
  },
  actions: {
    padding: 20,
    gap: 12,
  },
  actionButton: {
    paddingVertical: 6,
  },
  logoutButton: {
    marginTop: 8,
  },
  deleteButton: {
    borderColor: "#E53E3E",
  },
});
