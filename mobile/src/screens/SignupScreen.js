import React, { useState, useRef } from "react";
import {
  View,
  StyleSheet,
  ScrollView,
  Alert,
  TouchableOpacity,
  Image,
  KeyboardAvoidingView,
  Platform,
  Keyboard,
} from "react-native";
import { Text, TextInput, Button, Chip, ProgressBar } from "react-native-paper";
import { Camera } from "lucide-react-native";
import * as ImagePicker from "expo-image-picker";
import { authAPI } from "../services/api";

export default function SignupScreen({ navigation }) {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef(null);

  // Refs for each text input to enable "Next" keyboard button chaining
  const passwordRef = useRef(null);
  const confirmPasswordRef = useRef(null);
  const nameRef = useRef(null);
  const ageRef = useRef(null);
  const cityRef = useRef(null);
  const stateRef = useRef(null);
  const bioRef = useRef(null);

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
    "Independent",
    "Progressive",
    "Prefer not to say",
  ];

  const religionOptions = [
    "Christian",
    "Catholic",
    "Protestant",
    "Jewish",
    "Muslim",
    "Hindu",
    "Buddhist",
    "Sikh",
    "Seeking/Undecided",
    "Agnostic",
    "Atheist",
    "Other",
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
    "It's Complicated",
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
  ];

  const lookingForOptions = [
    "Friendship",
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
        setFormData({
          ...formData,
          profilePhoto: `data:image/jpeg;base64,${result.assets[0].base64}`,
        });
      }
    } catch {
      Alert.alert("Error", "Could not pick image");
    }
  };

  const toggleArrayItem = (field, value) => {
    const array = formData[field];
    setFormData({
      ...formData,
      [field]: array.includes(value)
        ? array.filter((item) => item !== value)
        : [...array, value],
    });
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
    Keyboard.dismiss();
    if (validateStep()) {
      setStep(step + 1);
      // Scroll back to top on step change
      setTimeout(
        () => scrollRef.current?.scrollTo({ y: 0, animated: true }),
        100,
      );
    }
  };

  const handleBack = () => {
    Keyboard.dismiss();
    setStep(step - 1);
    setTimeout(
      () => scrollRef.current?.scrollTo({ y: 0, animated: true }),
      100,
    );
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

  const stepTitles = [
    "Create Account",
    "About You",
    "Life Stage & Goals",
    "Your Values",
    "Add Your Photo",
  ];

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      keyboardVerticalOffset={Platform.OS === "ios" ? 0 : 20}
    >
      {/* Fixed header — stays visible above keyboard */}
      <View style={styles.header}>
        <ProgressBar
          progress={step / 5}
          color="#2B6CB0"
          style={styles.progress}
        />
        <Text style={styles.stepText}>
          Step {step} of 5 — {stepTitles[step - 1]}
        </Text>
      </View>

      <ScrollView
        ref={scrollRef}
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        {/* ── Step 1: Account ── */}
        {step === 1 && (
          <View style={styles.stepContainer}>
            <Text style={styles.sectionHint}>
              Your login credentials — keep these safe.
            </Text>
            <TextInput
              mode="outlined"
              label="Email"
              value={formData.email}
              onChangeText={(text) => setFormData({ ...formData, email: text })}
              keyboardType="email-address"
              autoCapitalize="none"
              autoCorrect={false}
              returnKeyType="next"
              onSubmitEditing={() => passwordRef.current?.focus()}
              blurOnSubmit={false}
              style={styles.input}
            />
            <TextInput
              ref={passwordRef}
              mode="outlined"
              label="Password"
              value={formData.password}
              onChangeText={(text) =>
                setFormData({ ...formData, password: text })
              }
              secureTextEntry
              returnKeyType="next"
              onSubmitEditing={() => confirmPasswordRef.current?.focus()}
              blurOnSubmit={false}
              style={styles.input}
            />
            <TextInput
              ref={confirmPasswordRef}
              mode="outlined"
              label="Confirm Password"
              value={formData.confirmPassword}
              onChangeText={(text) =>
                setFormData({ ...formData, confirmPassword: text })
              }
              secureTextEntry
              returnKeyType="done"
              onSubmitEditing={handleNext}
              style={styles.input}
            />
          </View>
        )}

        {/* ── Step 2: Basic Info ── */}
        {step === 2 && (
          <View style={styles.stepContainer}>
            <Text style={styles.sectionHint}>
              Tell the community a little about yourself.
            </Text>
            <TextInput
              ref={nameRef}
              mode="outlined"
              label="Full Name"
              value={formData.name}
              onChangeText={(text) => setFormData({ ...formData, name: text })}
              returnKeyType="next"
              onSubmitEditing={() => ageRef.current?.focus()}
              blurOnSubmit={false}
              style={styles.input}
            />
            <TextInput
              ref={ageRef}
              mode="outlined"
              label="Age"
              value={formData.age}
              onChangeText={(text) => setFormData({ ...formData, age: text })}
              keyboardType="number-pad"
              returnKeyType="next"
              onSubmitEditing={() => cityRef.current?.focus()}
              blurOnSubmit={false}
              style={styles.input}
            />

            <Text style={styles.label}>Gender</Text>
            <View style={styles.chipContainer}>
              {[
                "Male",
                "Female",
                "Non-binary",
                "Other",
                "Prefer not to say",
              ].map((g) => (
                <Chip
                  key={g}
                  selected={formData.gender === g}
                  onPress={() => setFormData({ ...formData, gender: g })}
                  style={[
                    styles.chip,
                    formData.gender === g && styles.chipSelected,
                  ]}
                  textStyle={formData.gender === g && styles.chipTextSelected}
                >
                  {g}
                </Chip>
              ))}
            </View>

            <TextInput
              ref={cityRef}
              mode="outlined"
              label="City"
              value={formData.city}
              onChangeText={(text) => setFormData({ ...formData, city: text })}
              returnKeyType="next"
              onSubmitEditing={() => stateRef.current?.focus()}
              blurOnSubmit={false}
              style={styles.input}
            />
            <TextInput
              ref={stateRef}
              mode="outlined"
              label="State (e.g., CA)"
              value={formData.state}
              onChangeText={(text) =>
                setFormData({ ...formData, state: text.toUpperCase() })
              }
              maxLength={2}
              autoCapitalize="characters"
              returnKeyType="next"
              onSubmitEditing={() => bioRef.current?.focus()}
              blurOnSubmit={false}
              style={styles.input}
            />
            <TextInput
              ref={bioRef}
              mode="outlined"
              label="Bio — tell people who you are"
              value={formData.bio}
              onChangeText={(text) => setFormData({ ...formData, bio: text })}
              multiline
              numberOfLines={4}
              returnKeyType="done"
              onSubmitEditing={Keyboard.dismiss}
              style={[styles.input, styles.bioInput]}
            />
            <Text style={styles.charCount}>{formData.bio.length}/500</Text>
          </View>
        )}

        {/* ── Step 3: Life Stage ── */}
        {step === 3 && (
          <View style={styles.stepContainer}>
            <Text style={styles.sectionHint}>
              Connect with people navigating similar life experiences.
            </Text>
            <Text style={styles.label}>Life Stage (select all that apply)</Text>
            <View style={styles.chipContainer}>
              {lifeStageOptions.map((stage) => (
                <Chip
                  key={stage}
                  selected={formData.lifeStage.includes(stage)}
                  onPress={() => toggleArrayItem("lifeStage", stage)}
                  style={[
                    styles.chip,
                    formData.lifeStage.includes(stage) && styles.chipSelected,
                  ]}
                  textStyle={
                    formData.lifeStage.includes(stage) &&
                    styles.chipTextSelected
                  }
                >
                  {stage}
                </Chip>
              ))}
            </View>

            <Text style={styles.label}>Looking For</Text>
            <View style={styles.chipContainer}>
              {lookingForOptions.map((option) => (
                <Chip
                  key={option}
                  selected={formData.lookingFor.includes(option)}
                  onPress={() => toggleArrayItem("lookingFor", option)}
                  style={[
                    styles.chip,
                    formData.lookingFor.includes(option) && styles.chipSelected,
                  ]}
                  textStyle={
                    formData.lookingFor.includes(option) &&
                    styles.chipTextSelected
                  }
                >
                  {option}
                </Chip>
              ))}
            </View>
          </View>
        )}

        {/* ── Step 4: Values ── */}
        {step === 4 && (
          <View style={styles.stepContainer}>
            <Text style={styles.sectionHint}>
              Help us find your people. These are never shared publicly.
            </Text>

            <Text style={styles.label}>Political Beliefs</Text>
            <View style={styles.chipContainer}>
              {politicalOptions.map((belief) => (
                <Chip
                  key={belief}
                  selected={formData.politicalBeliefs.includes(belief)}
                  onPress={() => toggleArrayItem("politicalBeliefs", belief)}
                  style={[
                    styles.chip,
                    formData.politicalBeliefs.includes(belief) &&
                      styles.chipSelected,
                  ]}
                  textStyle={
                    formData.politicalBeliefs.includes(belief) &&
                    styles.chipTextSelected
                  }
                >
                  {belief}
                </Chip>
              ))}
            </View>

            <Text style={styles.label}>Religion / Spirituality</Text>
            <View style={styles.chipContainer}>
              {religionOptions.map((religion) => (
                <Chip
                  key={religion}
                  selected={formData.religion === religion}
                  onPress={() => setFormData({ ...formData, religion })}
                  style={[
                    styles.chip,
                    formData.religion === religion && styles.chipSelected,
                  ]}
                  textStyle={
                    formData.religion === religion && styles.chipTextSelected
                  }
                >
                  {religion}
                </Chip>
              ))}
            </View>

            <Text style={styles.label}>
              Interests / Causes — {formData.causes.length} selected
              {formData.causes.length < 3 && (
                <Text style={styles.labelHint}> (pick at least 3)</Text>
              )}
            </Text>
            <View style={styles.chipContainer}>
              {causesOptions.map((cause) => (
                <Chip
                  key={cause}
                  selected={formData.causes.includes(cause)}
                  onPress={() => toggleArrayItem("causes", cause)}
                  style={[
                    styles.chip,
                    formData.causes.includes(cause) && styles.chipSelected,
                  ]}
                  textStyle={
                    formData.causes.includes(cause) && styles.chipTextSelected
                  }
                >
                  {cause}
                </Chip>
              ))}
            </View>
          </View>
        )}

        {/* ── Step 5: Photo ── */}
        {step === 5 && (
          <View style={styles.stepContainer}>
            <Text style={styles.sectionHint}>
              A photo helps your community recognize and trust you.
            </Text>
            <TouchableOpacity
              onPress={pickImage}
              style={styles.photoContainer}
              activeOpacity={0.8}
            >
              {formData.profilePhoto ? (
                <>
                  <Image
                    source={{ uri: formData.profilePhoto }}
                    style={styles.photo}
                  />
                  <Text style={styles.photoChangeText}>
                    Tap to change photo
                  </Text>
                </>
              ) : (
                <View style={styles.photoPlaceholder}>
                  <Camera size={48} color="#2B6CB0" />
                  <Text style={styles.photoText}>Tap to upload photo</Text>
                  <Text style={styles.photoSubtext}>
                    Square crop works best
                  </Text>
                </View>
              )}
            </TouchableOpacity>
          </View>
        )}

        {/* Bottom padding so last field clears the buttons */}
        <View style={{ height: 120 }} />
      </ScrollView>

      {/* Fixed button bar at bottom */}
      <View style={styles.buttonBar}>
        {step > 1 && (
          <Button
            mode="outlined"
            onPress={handleBack}
            style={styles.backButton}
            labelStyle={styles.backButtonLabel}
          >
            Back
          </Button>
        )}
        {step < 5 ? (
          <Button
            mode="contained"
            onPress={handleNext}
            style={styles.nextButton}
            buttonColor="#2B6CB0"
          >
            Next →
          </Button>
        ) : (
          <Button
            mode="contained"
            onPress={handleSubmit}
            loading={loading}
            disabled={loading}
            style={styles.nextButton}
            buttonColor="#2B6CB0"
          >
            Create Account
          </Button>
        )}
      </View>

      <TouchableOpacity
        onPress={() => navigation.navigate("Login")}
        style={styles.loginLink}
      >
        <Text style={styles.loginLinkText}>
          Already have an account? Log In
        </Text>
      </TouchableOpacity>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F7FAFC" },

  header: {
    backgroundColor: "#F7FAFC",
    paddingTop: 8,
    paddingHorizontal: 20,
    paddingBottom: 4,
    borderBottomWidth: 1,
    borderBottomColor: "#E2E8F0",
  },
  progress: { height: 6, borderRadius: 3 },
  stepText: {
    textAlign: "center",
    marginTop: 8,
    marginBottom: 4,
    color: "#718096",
    fontSize: 13,
    fontWeight: "600",
  },

  scrollView: { flex: 1 },
  scrollContent: { paddingBottom: 20 },

  stepContainer: { padding: 20, paddingTop: 16 },

  sectionHint: {
    color: "#718096",
    fontSize: 14,
    fontStyle: "italic",
    textAlign: "center",
    marginBottom: 20,
    lineHeight: 20,
  },

  input: { marginBottom: 14, backgroundColor: "white" },
  bioInput: { minHeight: 100 },
  charCount: {
    fontSize: 11,
    color: "#a0aec0",
    textAlign: "right",
    marginTop: -10,
    marginBottom: 8,
  },

  label: {
    marginTop: 8,
    marginBottom: 10,
    fontWeight: "700",
    color: "#2d3748",
    fontSize: 14,
  },
  labelHint: { fontWeight: "400", color: "#e53e3e", fontSize: 13 },

  chipContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    marginBottom: 20,
  },
  chip: { marginBottom: 2 },
  chipSelected: { backgroundColor: "#2B6CB0" },
  chipTextSelected: { color: "white" },

  photoContainer: { alignItems: "center", marginTop: 24 },
  photoPlaceholder: {
    width: 160,
    height: 160,
    borderRadius: 80,
    backgroundColor: "#EBF4FF",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 2,
    borderColor: "#2B6CB0",
    borderStyle: "dashed",
  },
  photo: { width: 160, height: 160, borderRadius: 80 },
  photoText: {
    marginTop: 10,
    color: "#2B6CB0",
    fontWeight: "700",
    fontSize: 14,
  },
  photoSubtext: { color: "#718096", fontSize: 12, marginTop: 4 },
  photoChangeText: {
    marginTop: 12,
    color: "#2B6CB0",
    fontWeight: "600",
    fontSize: 14,
  },

  // Fixed bottom button bar
  buttonBar: {
    flexDirection: "row",
    paddingHorizontal: 20,
    paddingVertical: 12,
    backgroundColor: "white",
    borderTopWidth: 1,
    borderTopColor: "#E2E8F0",
    gap: 12,
  },
  backButton: { flex: 1, borderColor: "#2B6CB0" },
  backButtonLabel: { color: "#2B6CB0" },
  nextButton: { flex: 2 },

  loginLink: { alignItems: "center", paddingVertical: 12 },
  loginLinkText: { color: "#2B6CB0", fontWeight: "600", fontSize: 14 },
});
