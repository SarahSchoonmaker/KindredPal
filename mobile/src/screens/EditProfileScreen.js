import React, { useState, useEffect } from "react";
import {
  View,
  StyleSheet,
  ScrollView,
  Alert,
  TouchableOpacity,
  Image,
} from "react-native";
import { Text, TextInput, Button, ActivityIndicator } from "react-native-paper";
import { userAPI, authAPI } from "../services/api";
import * as ImagePicker from "expo-image-picker";
import { Camera } from "lucide-react-native";

export default function EditProfileScreen({ navigation }) {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [profile, setProfile] = useState({
    email: "",
    name: "",
    age: "",
    bio: "",
    city: "",
    state: "",
    profilePhoto: "",
  });

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const response = await authAPI.getProfile();
      setProfile({
        email: response.data.email || "",
        name: response.data.name || "",
        age: response.data.age?.toString() || "",
        bio: response.data.bio || "",
        city: response.data.city || "",
        state: response.data.state || "",
        profilePhoto: response.data.profilePhoto || "",
      });
    } catch (error) {
      console.error("Error fetching profile:", error);
      Alert.alert("Error", "Failed to load profile");
    } finally {
      setLoading(false);
    }
  };

  const pickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    
    if (status !== "granted") {
      Alert.alert("Permission needed", "Please allow access to your photos");
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });

    if (!result.canceled && result.assets[0]) {
      const asset = result.assets[0];
      
      // Convert to base64
      const response = await fetch(asset.uri);
      const blob = await response.blob();
      const reader = new FileReader();
      
      reader.onloadend = () => {
        const base64data = reader.result;
        setProfile({ ...profile, profilePhoto: base64data });
      };
      
      reader.readAsDataURL(blob);
    }
  };

  const handleSave = async () => {
    if (!profile.name || !profile.age || !profile.bio || !profile.city || !profile.state) {
      Alert.alert("Error", "Please fill in all required fields");
      return;
    }

    setSaving(true);
    try {
      await userAPI.updateProfile({
        name: profile.name,
        age: parseInt(profile.age),
        bio: profile.bio,
        city: profile.city,
        state: profile.state,
        profilePhoto: profile.profilePhoto,
      });

      Alert.alert("Success", "Profile updated successfully", [
        { text: "OK", onPress: () => navigation.goBack() },
      ]);
    } catch (error) {
      console.error("Error updating profile:", error);
      Alert.alert("Error", "Failed to update profile");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#2B6CB0" />
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      {/* Profile Photo */}
      <View style={styles.photoSection}>
        <TouchableOpacity onPress={pickImage} style={styles.photoContainer}>
          {profile.profilePhoto ? (
            <Image
              source={{ uri: profile.profilePhoto }}
              style={styles.photo}
            />
          ) : (
            <View style={styles.photoPlaceholder}>
              <Camera size={40} color="#999" />
            </View>
          )}
          <View style={styles.photoOverlay}>
            <Camera size={24} color="white" />
            <Text style={styles.photoOverlayText}>Change Photo</Text>
          </View>
        </TouchableOpacity>
      </View>

      {/* Email - Read Only */}
      <View style={styles.section}>
        <Text style={styles.label}>Email</Text>
        <TextInput
          mode="outlined"
          value={profile.email}
          disabled
          style={[styles.input, styles.disabledInput]}
          outlineColor="#E2E8F0"
          activeOutlineColor="#2B6CB0"
        />
        <Text style={styles.helperText}>Email cannot be changed</Text>
      </View>

      {/* Name */}
      <View style={styles.section}>
        <Text style={styles.label}>Name *</Text>
        <TextInput
          mode="outlined"
          value={profile.name}
          onChangeText={(text) => setProfile({ ...profile, name: text })}
          style={styles.input}
          outlineColor="#E2E8F0"
          activeOutlineColor="#2B6CB0"
        />
      </View>

      {/* Age */}
      <View style={styles.section}>
        <Text style={styles.label}>Age *</Text>
        <TextInput
          mode="outlined"
          value={profile.age}
          onChangeText={(text) => setProfile({ ...profile, age: text })}
          keyboardType="numeric"
          style={styles.input}
          outlineColor="#E2E8F0"
          activeOutlineColor="#2B6CB0"
        />
      </View>

      {/* City */}
      <View style={styles.section}>
        <Text style={styles.label}>City *</Text>
        <TextInput
          mode="outlined"
          value={profile.city}
          onChangeText={(text) => setProfile({ ...profile, city: text })}
          style={styles.input}
          outlineColor="#E2E8F0"
          activeOutlineColor="#2B6CB0"
        />
      </View>

      {/* State */}
      <View style={styles.section}>
        <Text style={styles.label}>State *</Text>
        <TextInput
          mode="outlined"
          value={profile.state}
          onChangeText={(text) => setProfile({ ...profile, state: text })}
          style={styles.input}
          outlineColor="#E2E8F0"
          activeOutlineColor="#2B6CB0"
        />
      </View>

      {/* Bio */}
      <View style={styles.section}>
        <Text style={styles.label}>Bio *</Text>
        <TextInput
          mode="outlined"
          value={profile.bio}
          onChangeText={(text) => setProfile({ ...profile, bio: text })}
          multiline
          numberOfLines={4}
          style={[styles.input, styles.bioInput]}
          outlineColor="#E2E8F0"
          activeOutlineColor="#2B6CB0"
          maxLength={500}
        />
        <Text style={styles.charCount}>{profile.bio.length}/500</Text>
      </View>

      {/* Save Button */}
      <Button
        mode="contained"
        onPress={handleSave}
        loading={saving}
        disabled={saving}
        style={styles.saveButton}
        buttonColor="#2B6CB0"
      >
        Save Changes
      </Button>

      <View style={styles.bottomPadding} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F7FAFC",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#F7FAFC",
  },
  photoSection: {
    alignItems: "center",
    paddingVertical: 30,
    backgroundColor: "white",
    marginBottom: 20,
  },
  photoContainer: {
    position: "relative",
    width: 150,
    height: 150,
    borderRadius: 75,
    overflow: "hidden",
  },
  photo: {
    width: "100%",
    height: "100%",
  },
  photoPlaceholder: {
    width: "100%",
    height: "100%",
    backgroundColor: "#E2E8F0",
    justifyContent: "center",
    alignItems: "center",
  },
  photoOverlay: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "rgba(0,0,0,0.6)",
    paddingVertical: 8,
    alignItems: "center",
    justifyContent: "center",
  },
  photoOverlayText: {
    color: "white",
    fontSize: 12,
    marginTop: 4,
  },
  section: {
    backgroundColor: "white",
    padding: 20,
    marginBottom: 1,
  },
  label: {
    fontSize: 14,
    fontWeight: "600",
    color: "#2D3748",
    marginBottom: 8,
  },
  input: {
    backgroundColor: "white",
  },
  disabledInput: {
    backgroundColor: "#F7FAFC",
    opacity: 0.7,
  },
  helperText: {
    fontSize: 12,
    color: "#999",
    marginTop: 4,
    marginLeft: 4,
  },
  bioInput: {
    minHeight: 100,
    textAlignVertical: "top",
  },
  charCount: {
    fontSize: 12,
    color: "#999",
    textAlign: "right",
    marginTop: 4,
  },
  saveButton: {
    margin: 20,
    paddingVertical: 8,
  },
  bottomPadding: {
    height: 40,
  },
});