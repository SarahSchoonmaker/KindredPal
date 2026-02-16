import React, { useState } from "react";
import {
  View,
  StyleSheet,
  ScrollView,
  Alert,
  TouchableOpacity,
  Image,
} from "react-native";
import Footer from "../components/Footer";
import { Text, TextInput, Button, Chip, ProgressBar } from "react-native-paper";
import { Camera } from "lucide-react-native";
import * as ImagePicker from "expo-image-picker";
import { authAPI } from "../services/api";

export default function SignupScreen({ navigation }) {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    confirmPassword: "",
    name: "",
    age: "",
    gender: "",
    city: "",
    state: "",
    bio: "",
    politicalBeliefs: [],
    religion: "",
    causes: [],
    lifeStage: [],
    lookingFor: [],
    profilePhoto: "",
  });

  const politicalOptions = [
    "Liberal",
    "Moderate",
    "Conservative",
    "Libertarian",
    "Prefer not to say",
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

  const causesOptions = [
    "Environment",
    "Travel & Adventure",
    "Health & Wellness",
    "Healthcare & Medical Causes",
    "Education & Continuous Learning",
    "Art & Design",
    "Theater & Performing Arts",
    "Film & Cinema",
    "Music",
    "Books & Literature",
    "Museums & History",
    "Poetry & Writing",
    "Comedy & Entertainment",
    "Fashion & Style",
    "Video Games & Gaming",
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
    "Food & Cooking",
    "Photography",
    "Outdoor Activities",
  ];

  const lifeStageOptions = [
    "Single",
    "In a Relationship",
    "Engaged",
    "Married",
    "Divorced",
    "Widowed",
    "Separated",
    "Single Parent",
    "Have Children",
    "Child-free by Choice",
    "Want Children Someday",
    "Empty Nester",
    "Stay-at-Home Parent",
    "Caregiver",
    "College Student",
    "Graduate Student",
    "Recent Graduate",
    "Working Professional",
    "Career Focused",
    "Entrepreneur",
    "Career Transition",
    "Retired",
    "Semi-Retired",
    "Single Income No Kids (SINK)",
    "Dual-Income No Kids (DINK)",
  ];

  const lookingForOptions = [
    "Friendship",
    "Romance",
    "Networking",
    "Activity Partner",
    "Mentor",
    "Community",
  ];

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
        setFormData({ ...formData, profilePhoto: base64Image });
      }
    } catch (error) {
      Alert.alert("Error", "Could not pick image");
    }
  };

  const toggleArrayItem = (field, value) => {
    const array = formData[field];
    if (array.includes(value)) {
      setFormData({
        ...formData,
        [field]: array.filter((item) => item !== value),
      });
    } else {
      setFormData({
        ...formData,
        [field]: [...array, value],
      });
    }
  };

  const validateStep = () => {
    switch (step) {
      case 1:
        if (
          !formData.email ||
          !formData.password ||
          !formData.confirmPassword
        ) {
          Alert.alert("Error", "Please fill in all fields");
          return false;
        }
        if (formData.password !== formData.confirmPassword) {
          Alert.alert("Error", "Passwords do not match");
          return false;
        }
        if (formData.password.length < 6) {
          Alert.alert("Error", "Password must be at least 6 characters");
          return false;
        }
        return true;

      case 2:
        if (
          !formData.name ||
          !formData.age ||
          !formData.gender ||
          !formData.city ||
          !formData.state ||
          !formData.bio
        ) {
          Alert.alert("Error", "Please fill in all fields");
          return false;
        }
        if (parseInt(formData.age) < 18) {
          Alert.alert("Error", "You must be at least 18 years old");
          return false;
        }
        return true;

      case 3:
        if (formData.lifeStage.length === 0) {
          Alert.alert("Error", "Please select at least one life stage");
          return false;
        }
        if (formData.lookingFor.length === 0) {
          Alert.alert("Error", "Please select what you're looking for");
          return false;
        }
        return true;

      case 4:
        if (formData.politicalBeliefs.length === 0) {
          Alert.alert("Error", "Please select at least one political belief");
          return false;
        }
        if (!formData.religion) {
          Alert.alert("Error", "Please select your religion/spirituality");
          return false;
        }
        if (formData.causes.length < 3) {
          Alert.alert("Error", "Please select at least 3 causes");
          return false;
        }
        return true;

      case 5:
        if (!formData.profilePhoto) {
          Alert.alert("Error", "Please upload a profile photo");
          return false;
        }
        return true;

      default:
        return true;
    }
  };

  const handleNext = () => {
    if (validateStep()) {
      setStep(step + 1);
    }
  };

  const handleSubmit = async () => {
    if (!validateStep()) return;

    setLoading(true);
    try {
      const { confirmPassword, ...signupData } = formData;
      signupData.age = parseInt(signupData.age);

      const response = await authAPI.signup(signupData);

      if (response.data.token) {
        Alert.alert("Success", "Account created! Please log in.");
        navigation.navigate("Login");
      }
    } catch (error) {
      Alert.alert("Error", error.response?.data?.message || "Signup failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <ProgressBar
        progress={step / 5}
        color="#2B6CB0"
        style={styles.progress}
      />
      <Text variant="bodyMedium" style={styles.stepText}>
        Step {step} of 5
      </Text>

      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
      >
        {/* Step 1: Account */}
        {step === 1 && (
          <View style={styles.stepContainer}>
            <Text variant="headlineSmall" style={styles.title}>
              Create Account
            </Text>

            <TextInput
              mode="outlined"
              label="Email"
              value={formData.email}
              onChangeText={(text) => setFormData({ ...formData, email: text })}
              keyboardType="email-address"
              autoCapitalize="none"
              style={styles.input}
            />

            <TextInput
              mode="outlined"
              label="Password"
              value={formData.password}
              onChangeText={(text) =>
                setFormData({ ...formData, password: text })
              }
              secureTextEntry
              style={styles.input}
            />

            <TextInput
              mode="outlined"
              label="Confirm Password"
              value={formData.confirmPassword}
              onChangeText={(text) =>
                setFormData({ ...formData, confirmPassword: text })
              }
              secureTextEntry
              style={styles.input}
            />
          </View>
        )}

        {/* Step 2: Basic Info */}
        {step === 2 && (
          <View style={styles.stepContainer}>
            <Text variant="headlineSmall" style={styles.title}>
              About You
            </Text>

            <TextInput
              mode="outlined"
              label="Full Name"
              value={formData.name}
              onChangeText={(text) => setFormData({ ...formData, name: text })}
              style={styles.input}
            />

            <TextInput
              mode="outlined"
              label="Age"
              value={formData.age}
              onChangeText={(text) => setFormData({ ...formData, age: text })}
              keyboardType="numeric"
              style={styles.input}
            />

            <Text variant="bodyMedium" style={styles.label}>
              Gender
            </Text>
            <View style={styles.chipContainer}>
              {["Male", "Female", "Non-binary", "Other"].map((g) => (
                <Chip
                  key={g}
                  selected={formData.gender === g}
                  onPress={() => setFormData({ ...formData, gender: g })}
                  style={styles.chip}
                >
                  {g}
                </Chip>
              ))}
            </View>

            <TextInput
              mode="outlined"
              label="City"
              value={formData.city}
              onChangeText={(text) => setFormData({ ...formData, city: text })}
              style={styles.input}
            />

            <TextInput
              mode="outlined"
              label="State (e.g., CA)"
              value={formData.state}
              onChangeText={(text) =>
                setFormData({ ...formData, state: text.toUpperCase() })
              }
              maxLength={2}
              autoCapitalize="characters"
              style={styles.input}
            />

            <TextInput
              mode="outlined"
              label="Bio"
              value={formData.bio}
              onChangeText={(text) => setFormData({ ...formData, bio: text })}
              multiline
              numberOfLines={4}
              style={styles.input}
            />
          </View>
        )}

        {/* Step 3: Life Stage */}
        {step === 3 && (
          <View style={styles.stepContainer}>
            <Text variant="headlineSmall" style={styles.title}>
              Life Stage & Goals
            </Text>

            <Text variant="bodyMedium" style={styles.label}>
              Life Stage (select all that apply)
            </Text>
            <View style={styles.chipContainer}>
              {lifeStageOptions.map((stage) => (
                <Chip
                  key={stage}
                  selected={formData.lifeStage.includes(stage)}
                  onPress={() => toggleArrayItem("lifeStage", stage)}
                  style={styles.chip}
                >
                  {stage}
                </Chip>
              ))}
            </View>

            <Text variant="bodyMedium" style={styles.label}>
              Looking For
            </Text>
            <View style={styles.chipContainer}>
              {lookingForOptions.map((option) => (
                <Chip
                  key={option}
                  selected={formData.lookingFor.includes(option)}
                  onPress={() => toggleArrayItem("lookingFor", option)}
                  style={styles.chip}
                >
                  {option}
                </Chip>
              ))}
            </View>
          </View>
        )}

        {/* Step 4: Values */}
        {step === 4 && (
          <View style={styles.stepContainer}>
            <Text variant="headlineSmall" style={styles.title}>
              Your Values
            </Text>

            <Text variant="bodyMedium" style={styles.label}>
              Political Beliefs
            </Text>
            <View style={styles.chipContainer}>
              {politicalOptions.map((belief) => (
                <Chip
                  key={belief}
                  selected={formData.politicalBeliefs.includes(belief)}
                  onPress={() => toggleArrayItem("politicalBeliefs", belief)}
                  style={styles.chip}
                >
                  {belief}
                </Chip>
              ))}
            </View>

            <Text variant="bodyMedium" style={styles.label}>
              Religion/Spirituality
            </Text>
            <View style={styles.chipContainer}>
              {religionOptions.map((religion) => (
                <Chip
                  key={religion}
                  selected={formData.religion === religion}
                  onPress={() => setFormData({ ...formData, religion })}
                  style={styles.chip}
                >
                  {religion}
                </Chip>
              ))}
            </View>

            <Text variant="bodyMedium" style={styles.label}>
              Causes (select at least 3) - {formData.causes.length} selected
            </Text>
            <View style={styles.chipContainer}>
              {causesOptions.map((cause) => (
                <Chip
                  key={cause}
                  selected={formData.causes.includes(cause)}
                  onPress={() => toggleArrayItem("causes", cause)}
                  style={styles.chip}
                >
                  {cause}
                </Chip>
              ))}
            </View>
          </View>
        )}

        {/* Step 5: Photo */}
        {step === 5 && (
          <View style={styles.stepContainer}>
            <Text variant="headlineSmall" style={styles.title}>
              Add Your Photo
            </Text>

            <TouchableOpacity onPress={pickImage} style={styles.photoContainer}>
              {formData.profilePhoto ? (
                <Image
                  source={{ uri: formData.profilePhoto }}
                  style={styles.photo}
                />
              ) : (
                <View style={styles.photoPlaceholder}>
                  <Camera size={40} color="#999" />
                  <Text style={styles.photoText}>Tap to upload photo</Text>
                </View>
              )}
            </TouchableOpacity>
          </View>
        )}
      </ScrollView>

      {/* Navigation Buttons */}
      <View style={styles.buttonContainer}>
        {step > 1 && (
          <Button
            mode="outlined"
            onPress={() => setStep(step - 1)}
            style={styles.backButton}
          >
            Back
          </Button>
        )}
        {step < 5 ? (
          <Button
            mode="contained"
            onPress={handleNext}
            style={styles.nextButton}
          >
            Next
          </Button>
        ) : (
          <Button
            mode="contained"
            onPress={handleSubmit}
            loading={loading}
            disabled={loading}
            style={styles.nextButton}
          >
            Create Account
          </Button>
        )}
      </View>

      <Button
        mode="text"
        onPress={() => navigation.navigate("Login")}
        style={styles.loginButton}
      >
        Already have an account? Log In
      </Button>
      <Footer />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F7FAFC",
  },
  progress: {
    height: 4,
  },
  stepText: {
    textAlign: "center",
    marginVertical: 12,
    color: "#666",
  },
  scrollView: {
    flex: 1,
  },
  stepContainer: {
    padding: 20,
  },
  title: {
    marginBottom: 20,
    textAlign: "center",
    color: "#2B6CB0",
    fontWeight: "600",
  },
  input: {
    marginBottom: 12,
    backgroundColor: "white",
  },
  label: {
    marginTop: 16,
    marginBottom: 8,
    fontWeight: "600",
    color: "#2d2d2d",
  },
  chipContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    marginBottom: 16,
  },
  chip: {
    marginBottom: 4,
  },
  photoContainer: {
    alignItems: "center",
    marginTop: 20,
  },
  photoPlaceholder: {
    width: 150,
    height: 150,
    borderRadius: 75,
    backgroundColor: "#E2E8F0",
    justifyContent: "center",
    alignItems: "center",
  },
  photo: {
    width: 150,
    height: 150,
    borderRadius: 75,
  },
  photoText: {
    marginTop: 8,
    color: "#666",
  },
  buttonContainer: {
    flexDirection: "row",
    padding: 20,
    gap: 12,
  },
  backButton: {
    flex: 1,
  },
  nextButton: {
    flex: 2,
    backgroundColor: "#2B6CB0",
  },
  loginButton: {
    marginBottom: 20,
  },
});
