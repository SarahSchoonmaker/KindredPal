import React, { useState, useEffect } from "react";
import {
  View,
  ScrollView,
  Image,
  StyleSheet,
  TouchableOpacity,
  Alert,
} from "react-native";
import { Text, ActivityIndicator, Button, Chip } from "react-native-paper";
import { MapPin } from "lucide-react-native";
import { userAPI } from "../services/api";

export default function UserProfileScreen({ route, navigation }) {
  const { userId } = route.params;
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchUserProfile();
  }, [userId]);

  const fetchUserProfile = async () => {
    try {
      const response = await userAPI.getProfile(userId);
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
        <Button
          mode="contained"
          onPress={() => navigation.goBack()}
          buttonColor="#2B6CB0"
        >
          Go Back
        </Button>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      {/* Profile Header */}
      <View style={styles.header}>
        <Image
          source={{ uri: user.profilePhoto }}
          style={styles.profileImage}
        />
        <Text style={styles.name}>
          {user.name}, {user.age}
        </Text>
        <View style={styles.locationRow}>
          <MapPin size={16} color="#718096" />
          <Text style={styles.location}>
            {user.city}, {user.state}
          </Text>
        </View>
      </View>

      {/* Bio */}
      {user.bio && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>About Me</Text>
          <Text style={styles.bioText}>{user.bio}</Text>
        </View>
      )}

      {/* Life Stage */}
      {user.lifeStage && user.lifeStage.length > 0 && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Life Stage</Text>
          <View style={styles.tagsContainer}>
            {user.lifeStage.map((stage, idx) => (
              <Chip key={idx} style={styles.chip} textStyle={styles.chipText}>
                {stage}
              </Chip>
            ))}
          </View>
        </View>
      )}

      {/* Looking For */}
      {user.lookingFor && user.lookingFor.length > 0 && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Looking For</Text>
          <View style={styles.tagsContainer}>
            {user.lookingFor.map((item, idx) => (
              <Chip key={idx} style={styles.chip} textStyle={styles.chipText}>
                {item}
              </Chip>
            ))}
          </View>
        </View>
      )}

      {/* Causes */}
      {user.causes && user.causes.length > 0 && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Causes & Interests</Text>
          <View style={styles.tagsContainer}>
            {user.causes.map((cause, idx) => (
              <Chip key={idx} style={styles.chip} textStyle={styles.chipText}>
                {cause}
              </Chip>
            ))}
          </View>
        </View>
      )}

      {/* Political Beliefs */}
      {user.politicalBeliefs && user.politicalBeliefs.length > 0 && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Political Beliefs</Text>
          <View style={styles.tagsContainer}>
            {user.politicalBeliefs.map((belief, idx) => (
              <Chip key={idx} style={styles.chip} textStyle={styles.chipText}>
                {belief}
              </Chip>
            ))}
          </View>
        </View>
      )}

      {/* Religion */}
      {user.religion && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Religion/Spirituality</Text>
          <Text style={styles.infoText}>{user.religion}</Text>
        </View>
      )}

      {/* Additional Photos */}
      {user.additionalPhotos && user.additionalPhotos.length > 0 && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>More Photos</Text>
          <View style={styles.photosContainer}>
            {user.additionalPhotos.map((photo, idx) => (
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
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 40,
    backgroundColor: "#F7FAFC",
  },
  errorText: {
    fontSize: 18,
    color: "#718096",
    marginBottom: 24,
  },
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
  name: {
    fontSize: 28,
    fontWeight: "700",
    color: "#2D3748",
    marginBottom: 8,
  },
  locationRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  location: {
    fontSize: 16,
    color: "#718096",
  },
  section: {
    backgroundColor: "white",
    padding: 20,
    marginTop: 12,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: "#E2E8F0",
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#2D3748",
    marginBottom: 12,
  },
  bioText: {
    fontSize: 16,
    color: "#4A5568",
    lineHeight: 24,
  },
  infoText: {
    fontSize: 16,
    color: "#4A5568",
  },
  tagsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  chip: {
    backgroundColor: "#EBF4FF",
  },
  chipText: {
    fontSize: 13,
    color: "#2B6CB0",
    fontWeight: "600",
  },
  photosContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
  },
  photo: {
    width: 100,
    height: 100,
    borderRadius: 8,
  },
});
