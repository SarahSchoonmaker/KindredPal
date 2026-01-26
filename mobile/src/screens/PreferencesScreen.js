import React, { useState, useEffect } from "react";
import { View, StyleSheet, ScrollView, Alert } from "react-native";
import { Text, Button, Divider, ActivityIndicator } from "react-native-paper";
import Slider from "@react-native-community/slider";
import { Settings } from "lucide-react-native";
import { userAPI } from "../services/api";

export default function PreferencesScreen({ navigation }) {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // Preferences state
  const [preferences, setPreferences] = useState({
    ageRange: { min: 35, max: 55 },
    maxDistance: 50, // miles
    lifeStage: [],
    politics: [],
    religion: [],
    lookingFor: "friendship", // friendship, dating, either
  });

  useEffect(() => {
    fetchPreferences();
  }, []);

  const fetchPreferences = async () => {
    try {
      const response = await userAPI.getPreferences(); // ← Should be getPreferences not getProfile
      if (response.data.searchPreferences) {
        setPreferences(response.data.searchPreferences);
      }
    } catch (error) {
      // Just use defaults
    } finally {
      setLoading(false);
    }
  };

  const savePreferences = async () => {
    setSaving(true);
    try {
      await userAPI.updateProfile({ searchPreferences: preferences });
      Alert.alert("Success", "Your preferences have been saved!");
      navigation.goBack();
    } catch (error) {
      console.error("Error saving preferences:", error);
      Alert.alert("Error", "Could not save preferences. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  const toggleSelection = (category, value) => {
    setPreferences((prev) => ({
      ...prev,
      [category]: prev[category].includes(value)
        ? prev[category].filter((item) => item !== value)
        : [...prev[category], value],
    }));
  };

  const renderOption = (category, value, label) => {
    const isSelected = preferences[category].includes(value);
    return (
      <Button
        mode={isSelected ? "contained" : "outlined"}
        onPress={() => toggleSelection(category, value)}
        style={[styles.optionButton, isSelected && styles.selectedButton]}
        labelStyle={styles.optionLabel}
      >
        {label}
      </Button>
    );
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
      <View style={styles.header}>
        <Settings size={32} color="#2B6CB0" />
        <Text variant="headlineMedium" style={styles.title}>
          Search Preferences
        </Text>
        <Text variant="bodyMedium" style={styles.subtitle}>
          Customize who you'd like to see
        </Text>
      </View>

      {/* Age Range */}
      <View style={styles.section}>
        <Text variant="titleMedium" style={styles.sectionTitle}>
          Age Range
        </Text>
        <Text variant="bodyLarge" style={styles.rangeLabel}>
          {preferences.ageRange.min} - {preferences.ageRange.max} years old
        </Text>
        <View style={styles.sliderContainer}>
          <Text>Min: {preferences.ageRange.min}</Text>
          <Slider
            style={styles.slider}
            minimumValue={18}
            maximumValue={80}
            step={1}
            value={preferences.ageRange.min}
            onValueChange={(value) =>
              setPreferences((prev) => ({
                ...prev,
                ageRange: { ...prev.ageRange, min: value },
              }))
            }
            minimumTrackTintColor="#2B6CB0"
            maximumTrackTintColor="#CBD5E0"
          />
        </View>
        <View style={styles.sliderContainer}>
          <Text>Max: {preferences.ageRange.max}</Text>
          <Slider
            style={styles.slider}
            minimumValue={18}
            maximumValue={80}
            step={1}
            value={preferences.ageRange.max}
            onValueChange={(value) =>
              setPreferences((prev) => ({
                ...prev,
                ageRange: { ...prev.ageRange, max: value },
              }))
            }
            minimumTrackTintColor="#2B6CB0"
            maximumTrackTintColor="#CBD5E0"
          />
        </View>
      </View>

      <Divider />

      {/* Distance */}
      <View style={styles.section}>
        <Text variant="titleMedium" style={styles.sectionTitle}>
          Maximum Distance
        </Text>
        <Text variant="bodyLarge" style={styles.rangeLabel}>
          Within {preferences.maxDistance} miles
        </Text>
        <Slider
          style={styles.slider}
          minimumValue={5}
          maximumValue={500}
          step={5}
          value={preferences.maxDistance}
          onValueChange={(value) =>
            setPreferences((prev) => ({ ...prev, maxDistance: value }))
          }
          minimumTrackTintColor="#2B6CB0"
          maximumTrackTintColor="#CBD5E0"
        />
      </View>

      <Divider />

      {/* Life Stage */}
      <View style={styles.section}>
        <Text variant="titleMedium" style={styles.sectionTitle}>
          Life Stage
        </Text>
        <Text variant="bodySmall" style={styles.sectionSubtitle}>
          Select all that interest you
        </Text>
        <View style={styles.optionsGrid}>
          {renderOption("lifeStage", "single", "Single")}
          {renderOption("lifeStage", "divorced", "Divorced")}
          {renderOption("lifeStage", "widowed", "Widowed")}
          {renderOption("lifeStage", "empty-nester", "Empty Nester")}
          {renderOption("lifeStage", "retired", "Retired")}
          {renderOption("lifeStage", "career-focused", "Career Focused")}
        </View>
      </View>

      <Divider />

      {/* Politics */}
      <View style={styles.section}>
        <Text variant="titleMedium" style={styles.sectionTitle}>
          Political Views
        </Text>
        <Text variant="bodySmall" style={styles.sectionSubtitle}>
          Select all that are acceptable
        </Text>
        <View style={styles.optionsGrid}>
          {renderOption("politics", "liberal", "Liberal")}
          {renderOption("politics", "moderate", "Moderate")}
          {renderOption("politics", "conservative", "Conservative")}
          {renderOption("politics", "apolitical", "Apolitical")}
          {renderOption("politics", "any", "No Preference")}
        </View>
      </View>

      <Divider />

      {/* Religion */}
      <View style={styles.section}>
        <Text variant="titleMedium" style={styles.sectionTitle}>
          Religious Views
        </Text>
        <Text variant="bodySmall" style={styles.sectionSubtitle}>
          Select all that are acceptable
        </Text>
        <View style={styles.optionsGrid}>
          {renderOption("religion", "christian", "Christian")}
          {renderOption("religion", "jewish", "Jewish")}
          {renderOption("religion", "muslim", "Muslim")}
          {renderOption("religion", "hindu", "Hindu")}
          {renderOption("religion", "buddhist", "Buddhist")}
          {renderOption("religion", "spiritual", "Spiritual")}
          {renderOption("religion", "agnostic", "Agnostic")}
          {renderOption("religion", "atheist", "Atheist")}
          {renderOption("religion", "any", "No Preference")}
        </View>
      </View>

      <Divider />

      {/* Looking For */}
      <View style={styles.section}>
        <Text variant="titleMedium" style={styles.sectionTitle}>
          Looking For
        </Text>
        <View style={styles.optionsGrid}>
          <Button
            mode={
              preferences.lookingFor === "friendship" ? "contained" : "outlined"
            }
            onPress={() =>
              setPreferences((prev) => ({ ...prev, lookingFor: "friendship" }))
            }
            style={styles.optionButton}
          >
            Friendship
          </Button>
          <Button
            mode={
              preferences.lookingFor === "dating" ? "contained" : "outlined"
            }
            onPress={() =>
              setPreferences((prev) => ({ ...prev, lookingFor: "dating" }))
            }
            style={styles.optionButton}
          >
            Dating
          </Button>
          <Button
            mode={
              preferences.lookingFor === "either" ? "contained" : "outlined"
            }
            onPress={() =>
              setPreferences((prev) => ({ ...prev, lookingFor: "either" }))
            }
            style={styles.optionButton}
          >
            Either
          </Button>
        </View>
      </View>

      {/* Save Button */}
      <View style={styles.saveContainer}>
        <Button
          mode="contained"
          onPress={savePreferences}
          loading={saving}
          disabled={saving}
          style={styles.saveButton}
        >
          Save Preferences
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
    backgroundColor: "#F7FAFC",
  },
  header: {
    alignItems: "center",
    padding: 24,
    paddingTop: 32,
  },
  title: {
    marginTop: 16,
    color: "#2B6CB0",
    fontWeight: "bold",
  },
  subtitle: {
    marginTop: 8,
    color: "#666",
    textAlign: "center",
  },
  section: {
    padding: 20,
  },
  sectionTitle: {
    fontWeight: "600",
    color: "#2d2d2d",
    marginBottom: 8,
  },
  sectionSubtitle: {
    color: "#666",
    marginBottom: 16,
  },
  rangeLabel: {
    color: "#2B6CB0",
    fontWeight: "600",
    marginBottom: 8,
  },
  sliderContainer: {
    marginVertical: 8,
  },
  slider: {
    width: "100%",
    height: 40,
  },
  optionsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
  },
  optionButton: {
    marginBottom: 8,
  },
  selectedButton: {
    backgroundColor: "#2B6CB0",
  },
  optionLabel: {
    fontSize: 14,
  },
  saveContainer: {
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
