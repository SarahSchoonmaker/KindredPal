import React, { useState, useEffect } from "react";
import {
  View,
  ScrollView,
  Image,
  StyleSheet,
  TouchableOpacity,
  Alert,
} from "react-native";
import { Text, ActivityIndicator, Chip } from "react-native-paper";
import { MapPin } from "lucide-react-native";
import api from "../services/api";

export default function UserProfileScreen({ route, navigation }) {
  const { userId } = route.params || {};
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!userId) {
      setLoading(false);
      return;
    }
    fetchUserProfile();
  }, [userId]);

  const fetchUserProfile = async () => {
    try {
      // FIX: use api directly instead of userAPI.getProfile which may not exist
      const response = await api.get(`/users/profile/${userId}`);
      setUser(response.data);
    } catch (error) {
      console.error("Error fetching user profile:", error);
      Alert.alert("Error", "Failed to load profile");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#2B6CB0" />
      </View>
    );
  }

  if (!user) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>User not found</Text>
        <TouchableOpacity
          style={styles.goBackBtn}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.goBackBtnText}>Go Back</Text>
        </TouchableOpacity>
      </View>
    );
  }

  // FIX: lookingFor is a string in the User model, not an array.
  // Calling .map() on a string crashes silently on mobile.
  // Normalize everything to arrays safely before rendering.
  const lifeStage = Array.isArray(user.lifeStage) ? user.lifeStage : [];
  const causes = Array.isArray(user.causes) ? user.causes : [];
  const coreValues = Array.isArray(user.coreValues) ? user.coreValues : [];
  const familySituation = Array.isArray(user.familySituation)
    ? user.familySituation
    : [];
  const additionalPhotos = Array.isArray(user.additionalPhotos)
    ? user.additionalPhotos
    : [];

  // lookingFor is a string field — show as plain text, not mapped array
  const lookingFor = typeof user.lookingFor === "string" ? user.lookingFor : "";

  // FIX: guard age — if undefined, don't render ", undefined"
  const nameDisplay = [user.name, user.age].filter(Boolean).join(", ");
  const locationDisplay = [user.city, user.state].filter(Boolean).join(", ");

  return (
    <ScrollView style={styles.container}>
      {/* Profile Header */}
      <View style={styles.header}>
        {user.profilePhoto ? (
          <Image
            source={{ uri: user.profilePhoto }}
            style={styles.profileImage}
          />
        ) : (
          <View style={[styles.profileImage, styles.profileImagePlaceholder]}>
            <Text style={styles.profileImageInitial}>
              {user.name?.charAt(0)?.toUpperCase() || "?"}
            </Text>
          </View>
        )}
        <Text style={styles.name}>{nameDisplay}</Text>
        {locationDisplay ? (
          <View style={styles.locationRow}>
            <MapPin size={16} color="#718096" />
            <Text style={styles.location}>{locationDisplay}</Text>
          </View>
        ) : null}
      </View>

      {/* Bio */}
      {user.bio ? (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>About Me</Text>
          <Text style={styles.bioText}>{user.bio}</Text>
        </View>
      ) : null}

      {/* Life Stage */}
      {lifeStage.length > 0 && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Life Stage</Text>
          <View style={styles.tagsContainer}>
            {lifeStage.map((stage, idx) => (
              <Chip key={idx} style={styles.chip} textStyle={styles.chipText}>
                {stage}
              </Chip>
            ))}
          </View>
        </View>
      )}

      {/* Family Situation */}
      {familySituation.length > 0 && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Family</Text>
          <View style={styles.tagsContainer}>
            {familySituation.map((f, idx) => (
              <Chip key={idx} style={styles.chip} textStyle={styles.chipText}>
                {f}
              </Chip>
            ))}
          </View>
        </View>
      )}

      {/* Core Values */}
      {coreValues.length > 0 && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Core Values</Text>
          <View style={styles.tagsContainer}>
            {coreValues.map((v, idx) => (
              <Chip key={idx} style={styles.chip} textStyle={styles.chipText}>
                {v}
              </Chip>
            ))}
          </View>
        </View>
      )}

      {/* Looking For — string field, not array */}
      {lookingFor ? (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Looking For</Text>
          <Text style={styles.infoText}>{lookingFor}</Text>
        </View>
      ) : null}

      {/* Causes */}
      {causes.length > 0 && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Causes & Interests</Text>
          <View style={styles.tagsContainer}>
            {causes.map((cause, idx) => (
              <Chip key={idx} style={styles.chip} textStyle={styles.chipText}>
                {cause}
              </Chip>
            ))}
          </View>
        </View>
      )}

      {/* Political Beliefs — string field */}
      {user.politicalBeliefs ? (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Political Beliefs</Text>
          <Text style={styles.infoText}>{user.politicalBeliefs}</Text>
        </View>
      ) : null}

      {/* Religion */}
      {user.religion ? (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Religion / Spirituality</Text>
          <Text style={styles.infoText}>{user.religion}</Text>
        </View>
      ) : null}

      {/* Additional Photos */}
      {additionalPhotos.length > 0 && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>More Photos</Text>
          <View style={styles.photosContainer}>
            {additionalPhotos.map((photo, idx) => (
              <Image key={idx} source={{ uri: photo }} style={styles.photo} />
            ))}
          </View>
        </View>
      )}

      <View style={{ height: 40 }} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F7FAFC" },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#F7FAFC",
  },
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 40,
    backgroundColor: "#F7FAFC",
  },
  errorText: { fontSize: 18, color: "#718096", marginBottom: 24 },
  goBackBtn: {
    backgroundColor: "#2B6CB0",
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  goBackBtnText: { color: "white", fontWeight: "700", fontSize: 15 },
  header: {
    alignItems: "center",
    padding: 24,
    backgroundColor: "white",
    borderBottomWidth: 1,
    borderBottomColor: "#E2E8F0",
  },
  profileImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
    marginBottom: 16,
    borderWidth: 3,
    borderColor: "#2B6CB0",
  },
  profileImagePlaceholder: {
    backgroundColor: "#EBF4FF",
    justifyContent: "center",
    alignItems: "center",
  },
  profileImageInitial: { fontSize: 48, fontWeight: "700", color: "#2B6CB0" },
  name: { fontSize: 26, fontWeight: "700", color: "#2D3748", marginBottom: 8 },
  locationRow: { flexDirection: "row", alignItems: "center", gap: 6 },
  location: { fontSize: 15, color: "#718096" },
  section: {
    backgroundColor: "white",
    padding: 20,
    marginTop: 12,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: "#E2E8F0",
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#2D3748",
    marginBottom: 12,
  },
  bioText: { fontSize: 15, color: "#4A5568", lineHeight: 22 },
  infoText: { fontSize: 15, color: "#4A5568" },
  tagsContainer: { flexDirection: "row", flexWrap: "wrap", gap: 8 },
  chip: { backgroundColor: "#EBF4FF" },
  chipText: { fontSize: 13, color: "#2B6CB0", fontWeight: "600" },
  photosContainer: { flexDirection: "row", flexWrap: "wrap", gap: 12 },
  photo: { width: 100, height: 100, borderRadius: 8 },
});
