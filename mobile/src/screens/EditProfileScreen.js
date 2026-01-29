import React, { useState, useEffect } from "react";
import {
  View,
  StyleSheet,
  ScrollView,
  Alert,
  Image,
  TouchableOpacity,
} from "react-native";
import {
  Text,
  TextInput,
  Button,
  ActivityIndicator,
  Chip,
} from "react-native-paper";
import { Camera, X } from "lucide-react-native";
import * as ImagePicker from "expo-image-picker";
import { authAPI, userAPI } from "../services/api";

export default function EditProfileScreen({ navigation }) {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [profile, setProfile] = useState({
    name: "",
    age: "",
    city: "",
    state: "",
    bio: "",
    politicalBeliefs: "",
    religion: "",
    causes: [],
    lifeStage: "",
    lookingFor: "",
    profilePhoto: "",
  });

  const causeOptions = [
    "Environment",
    "Health & Wellness",
    "Healthcare & Medical Causes",
    "Education & Continuous Learning,
    "Arts & Culture",
    "Community Service",
    "Animal Welfare",
    "Social Justice",
    "Technology & Innovation",
    "Entrepreneurship",
    "Fitness & Active Living",
    "Skilled Trades & Craftsmanship",
    "Ministry",
    "Psychology & Mental Health",
    "Philosophy",
  ];

  const politicalOptions = [
    "Liberal",
    "Conservative",
    "Republican",
    "Democrat",
    "Libertarian",
    "Moderate",
    "Progressive",
    "Independent",
    "Apolitical",
  ];
  const religionOptions = [
    "Christian",
    "Jewish",
    "Muslim",
    "Hindu",
    "Buddhist",
    "Spiritual",
    "Agnostic",
    "Atheist",
    "Prefer not to say",
  ];
  const lifeStageOptions = [
    "Single",
    "Divorced",
    "Widowed",
    "Single Parent",
    "Married",
    "Engaged",
    "Empty Nester",
    "Retired",
    "Career Focused",
    "Single Income No Kids (SINK)",
    "Dual-Income No Kids (DINK)",
    "College or Graduate Student",
    "Recent Graduate",
    "Career Transition",
    "Caregiver",
  ];
  const lookingForOptions = ["Friendship", "Dating", "Either"];

  useEffect(() => {
    fetchProfile();
    requestPermissions();
  }, []);

  const requestPermissions = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted") {
      Alert.alert("Permission needed", "Please allow access to your photos");
    }
  };

  const fetchProfile = async () => {
    try {
      const response = await authAPI.getProfile();
      const userData = response.data.user || response.data;
      setProfile({
        name: userData.name || "",
        age: String(userData.age || ""),
        city: userData.city || "",
        state: userData.state || "",
        bio: userData.bio || "",
        politicalBeliefs: userData.politicalBeliefs || "",
        religion: userData.religion || "",
        causes: userData.causes || [],
        lifeStage: userData.lifeStage || "",
        lookingFor: userData.lookingFor || "",
        profilePhoto: userData.profilePhoto || "",
      });
    } catch (error) {
      console.error("Error fetching profile:", error);
    } finally {
      setLoading(false);
    }
  };

  const pickImage = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
        base64: true,
      });

      if (!result.canceled && result.assets[0].base64) {
        const base64Image = `data:image/jpeg;base64,${result.assets[0].base64}`;
        setProfile((prev) => ({ ...prev, profilePhoto: base64Image }));
      }
    } catch (error) {
      console.error("Error picking image:", error);
      Alert.alert("Error", "Could not pick image");
    }
  };

  const toggleCause = (cause) => {
    setProfile((prev) => ({
      ...prev,
      causes: prev.causes.includes(cause)
        ? prev.causes.filter((c) => c !== cause)
        : [...prev.causes, cause],
    }));
  };

  const handleSave = async () => {
    // Validation
    if (!profile.name.trim()) {
      Alert.alert("Error", "Name is required");
      return;
    }
    if (!profile.age || isNaN(profile.age) || profile.age < 18) {
      Alert.alert("Error", "Please enter a valid age (18+)");
      return;
    }

    setSaving(true);
    try {
      await userAPI.updateProfile({
        name: profile.name,
        age: parseInt(profile.age),
        city: profile.city,
        state: profile.state,
        bio: profile.bio,
        politicalBeliefs: profile.politicalBeliefs,
        religion: profile.religion,
        causes: profile.causes,
        lifeStage: profile.lifeStage,
        lookingFor: profile.lookingFor,
        profilePhoto: profile.profilePhoto,
      });

      Alert.alert("Success", "Profile updated successfully!");
      navigation.goBack();
    } catch (error) {
      console.error("Error saving profile:", error);
      Alert.alert("Error", "Could not save profile. Please try again.");
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
            <Text style={styles.photoText}>Change Photo</Text>
          </View>
        </TouchableOpacity>
      </View>

      {/* Basic Info */}
      <View style={styles.section}>
        <Text variant="titleMedium" style={styles.sectionTitle}>
          Basic Information
        </Text>

        <TextInput
          mode="outlined"
          label="Name *"
          value={profile.name}
          onChangeText={(text) =>
            setProfile((prev) => ({ ...prev, name: text }))
          }
          style={styles.input}
        />

        <TextInput
          mode="outlined"
          label="Age *"
          value={profile.age}
          onChangeText={(text) =>
            setProfile((prev) => ({ ...prev, age: text }))
          }
          keyboardType="numeric"
          style={styles.input}
        />

        <TextInput
          mode="outlined"
          label="City"
          value={profile.city}
          onChangeText={(text) =>
            setProfile((prev) => ({ ...prev, city: text }))
          }
          style={styles.input}
        />

        <TextInput
          mode="outlined"
          label="State"
          value={profile.state}
          onChangeText={(text) =>
            setProfile((prev) => ({ ...prev, state: text }))
          }
          style={styles.input}
        />

        <TextInput
          mode="outlined"
          label="Bio"
          value={profile.bio}
          onChangeText={(text) =>
            setProfile((prev) => ({ ...prev, bio: text }))
          }
          multiline
          numberOfLines={4}
          style={styles.input}
        />
      </View>

      {/* Political Beliefs */}
      <View style={styles.section}>
        <Text variant="titleMedium" style={styles.sectionTitle}>
          Political Beliefs
        </Text>
        <View style={styles.chipContainer}>
          {politicalOptions.map((option) => (
            <Chip
              key={option}
              selected={profile.politicalBeliefs === option}
              onPress={() =>
                setProfile((prev) => ({ ...prev, politicalBeliefs: option }))
              }
              style={styles.chip}
            >
              {option}
            </Chip>
          ))}
        </View>
      </View>

      {/* Religion */}
      <View style={styles.section}>
        <Text variant="titleMedium" style={styles.sectionTitle}>
          Religion
        </Text>
        <View style={styles.chipContainer}>
          {religionOptions.map((option) => (
            <Chip
              key={option}
              selected={profile.religion === option}
              onPress={() =>
                setProfile((prev) => ({ ...prev, religion: option }))
              }
              style={styles.chip}
            >
              {option}
            </Chip>
          ))}
        </View>
      </View>

      {/* Life Stage */}
      <View style={styles.section}>
        <Text variant="titleMedium" style={styles.sectionTitle}>
          Life Stage
        </Text>
        <View style={styles.chipContainer}>
          {lifeStageOptions.map((option) => (
            <Chip
              key={option}
              selected={profile.lifeStage === option}
              onPress={() =>
                setProfile((prev) => ({ ...prev, lifeStage: option }))
              }
              style={styles.chip}
            >
              {option}
            </Chip>
          ))}
        </View>
      </View>

      {/* Looking For */}
      <View style={styles.section}>
        <Text variant="titleMedium" style={styles.sectionTitle}>
          Looking For
        </Text>
        <View style={styles.chipContainer}>
          {lookingForOptions.map((option) => (
            <Chip
              key={option}
              selected={profile.lookingFor === option}
              onPress={() =>
                setProfile((prev) => ({ ...prev, lookingFor: option }))
              }
              style={styles.chip}
            >
              {option}
            </Chip>
          ))}
        </View>
      </View>

      {/* Causes/Interests */}
      <View style={styles.section}>
        <Text variant="titleMedium" style={styles.sectionTitle}>
          Causes & Interests
        </Text>
        <Text variant="bodySmall" style={styles.subtitle}>
          Select up to 5 causes you care about
        </Text>
        <View style={styles.chipContainer}>
          {causeOptions.map((cause) => (
            <Chip
              key={cause}
              selected={profile.causes.includes(cause)}
              onPress={() => toggleCause(cause)}
              disabled={
                !profile.causes.includes(cause) && profile.causes.length >= 5
              }
              style={styles.chip}
            >
              {cause}
            </Chip>
          ))}
        </View>
      </View>

      {/* Save Button */}
      <View style={styles.buttonContainer}>
        <Button
          mode="contained"
          onPress={handleSave}
          loading={saving}
          disabled={saving}
          style={styles.saveButton}
        >
          Save Changes
        </Button>
        <Button
          mode="text"
          onPress={() => navigation.goBack()}
          disabled={saving}
        >
          Cancel
        </Button>
      </View>

      <View style={styles.footer} />
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
  },
  photoSection: {
    alignItems: "center",
    paddingVertical: 24,
    backgroundColor: "white",
  },
  photoContainer: {
    position: "relative",
  },
  photo: {
    width: 120,
    height: 120,
    borderRadius: 60,
  },
  photoPlaceholder: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: "#E2E8F0",
    justifyContent: "center",
    alignItems: "center",
  },
  photoOverlay: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "rgba(43, 108, 176, 0.9)",
    padding: 8,
    borderBottomLeftRadius: 60,
    borderBottomRightRadius: 60,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 4,
  },
  photoText: {
    color: "white",
    fontSize: 12,
    fontWeight: "600",
  },
  section: {
    padding: 16,
    backgroundColor: "white",
    marginTop: 12,
  },
  sectionTitle: {
    fontWeight: "600",
    color: "#2d2d2d",
    marginBottom: 12,
  },
  subtitle: {
    color: "#666",
    marginBottom: 12,
  },
  input: {
    marginBottom: 12,
    backgroundColor: "white",
  },
  chipContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  chip: {
    marginBottom: 8,
  },
  buttonContainer: {
    padding: 20,
    gap: 12,
  },
  saveButton: {
    backgroundColor: "#2B6CB0",
    paddingVertical: 6,
  },
  footer: {
    height: 40,
  },
});
