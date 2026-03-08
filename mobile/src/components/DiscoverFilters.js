import React, { useState } from "react";
import {
  View,
  StyleSheet,
  Modal,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import { Text, Button, RadioButton, Checkbox } from "react-native-paper";
import { Settings, X } from "lucide-react-native";
import { userAPI } from "../services/api";

const LOCATION_OPTIONS = [
  "Same city",
  "Same state",
  "Within 50 miles",
  "Within 100 miles",
  "Within 200 miles",
  "Anywhere",
];

const POLITICAL_OPTIONS = [
  "Liberal", "Conservative", "Republican", "Democrat",
  "Libertarian", "Moderate", "Progressive", "Independent", "Prefer not to say",
];

const RELIGION_OPTIONS = [
  "Christian", "Catholic", "Protestant", "Muslim", "Jewish",
  "Hindu", "Buddhist", "Sikh", "Seeking/Undecided",
  "Agnostic", "Atheist", "Other", "Prefer not to say",
];

const LIFE_STAGE_OPTIONS = [
  "Single", "In a Relationship", "Engaged", "Married", "Divorced",
  "Widowed", "It's Complicated", "Single Parent", "Have Children",
  "Child-free by Choice", "Want Children Someday", "Empty Nester",
  "Stay-at-Home Parent", "Caregiver", "College Student", "Graduate Student",
  "Recent Graduate", "Working Professional", "Career Focused",
  "Entrepreneur", "Career Transition", "Retired", "Semi-Retired",
];

function MultiSelect({ options, selected, onToggle }) {
  return (
    <View style={styles.multiSelectGrid}>
      {options.map((option) => {
        const isSelected = selected.includes(option);
        return (
          <TouchableOpacity
            key={option}
            style={[styles.chip, isSelected && styles.chipSelected]}
            onPress={() => onToggle(option)}
          >
            <Text style={[styles.chipText, isSelected && styles.chipTextSelected]}>
              {option}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

export default function DiscoverFilters({ currentPreference, currentFilters = {}, onUpdate }) {
  const [visible, setVisible] = useState(false);
  const [locationPreference, setLocationPreference] = useState(
    currentPreference || "Home state"
  );
  const [politicalBeliefs, setPoliticalBeliefs] = useState(
    currentFilters.politicalBeliefs || []
  );
  const [religions, setReligions] = useState(
    currentFilters.religions || []
  );
  const [lifeStages, setLifeStages] = useState(
    currentFilters.lifeStages || []
  );
  const [saving, setSaving] = useState(false);
  const [activeSection, setActiveSection] = useState("location");

  const toggleItem = (list, setList, item) => {
    setList((prev) =>
      prev.includes(item) ? prev.filter((i) => i !== item) : [...prev, item]
    );
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      await userAPI.updateProfile({
        locationPreference,
        filterPoliticalBeliefs: politicalBeliefs,
        filterReligions: religions,
        filterLifeStages: lifeStages,
      });
      setVisible(false);
      if (onUpdate) onUpdate();
    } catch (error) {
      console.error("Error updating preferences:", error);
      alert("Failed to save preferences");
    } finally {
      setSaving(false);
    }
  };

  const handleClearAll = () => {
    setPoliticalBeliefs([]);
    setReligions([]);
    setLifeStages([]);
    setLocationPreference("Anywhere");
  };

  const activeFilterCount =
    (politicalBeliefs.length > 0 ? 1 : 0) +
    (religions.length > 0 ? 1 : 0) +
    (lifeStages.length > 0 ? 1 : 0);

  const sections = [
    { key: "location", label: "Location" },
    { key: "political", label: "Politics" },
    { key: "religion", label: "Religion" },
    { key: "lifestage", label: "Life Stage" },
  ];

  return (
    <>
      <TouchableOpacity style={styles.filterButton} onPress={() => setVisible(true)}>
        <Settings size={18} color="#2B6CB0" />
        <Text style={styles.filterButtonText}>Filters</Text>
        {activeFilterCount > 0 && (
          <View style={styles.badge}>
            <Text style={styles.badgeText}>{activeFilterCount}</Text>
          </View>
        )}
      </TouchableOpacity>

      <Modal
        visible={visible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>

            {/* Header */}
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Search Preferences</Text>
              <TouchableOpacity onPress={() => setVisible(false)}>
                <X size={24} color="#718096" />
              </TouchableOpacity>
            </View>
            <Text style={styles.modalSubtitle}>
              Filter discover results to find people that match your preferences
            </Text>

            {/* Section Tabs */}
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.tabsContainer}>
              {sections.map((s) => (
                <TouchableOpacity
                  key={s.key}
                  style={[styles.tab, activeSection === s.key && styles.tabActive]}
                  onPress={() => setActiveSection(s.key)}
                >
                  <Text style={[styles.tabText, activeSection === s.key && styles.tabTextActive]}>
                    {s.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>

            {/* Section Content */}
            <ScrollView style={styles.optionsContainer} showsVerticalScrollIndicator={false}>

              {activeSection === "location" && (
                <View>
                  <Text style={styles.sectionLabel}>Location Preference</Text>
                  <RadioButton.Group onValueChange={setLocationPreference} value={locationPreference}>
                    {LOCATION_OPTIONS.map((option) => (
                      <TouchableOpacity
                        key={option}
                        style={styles.radioOption}
                        onPress={() => setLocationPreference(option)}
                      >
                        <RadioButton.Android value={option} color="#2B6CB0" />
                        <Text style={styles.radioLabel}>{option}</Text>
                      </TouchableOpacity>
                    ))}
                  </RadioButton.Group>
                </View>
              )}

              {activeSection === "political" && (
                <View>
                  <Text style={styles.sectionLabel}>Political Beliefs</Text>
                  <Text style={styles.sectionHint}>Select to show only users with these beliefs</Text>
                  <MultiSelect
                    options={POLITICAL_OPTIONS}
                    selected={politicalBeliefs}
                    onToggle={(item) => toggleItem(politicalBeliefs, setPoliticalBeliefs, item)}
                  />
                </View>
              )}

              {activeSection === "religion" && (
                <View>
                  <Text style={styles.sectionLabel}>Religion</Text>
                  <Text style={styles.sectionHint}>Select to show only users with these religions</Text>
                  <MultiSelect
                    options={RELIGION_OPTIONS}
                    selected={religions}
                    onToggle={(item) => toggleItem(religions, setReligions, item)}
                  />
                </View>
              )}

              {activeSection === "lifestage" && (
                <View>
                  <Text style={styles.sectionLabel}>Life Stage</Text>
                  <Text style={styles.sectionHint}>Select to show only users in these life stages</Text>
                  <MultiSelect
                    options={LIFE_STAGE_OPTIONS}
                    selected={lifeStages}
                    onToggle={(item) => toggleItem(lifeStages, setLifeStages, item)}
                  />
                </View>
              )}

              <View style={{ height: 20 }} />
            </ScrollView>

            {/* Actions */}
            <View style={styles.modalActions}>
              <Button
                mode="contained"
                onPress={handleSave}
                loading={saving}
                disabled={saving}
                style={styles.saveButton}
                buttonColor="#2B6CB0"
              >
                Save Preferences
              </Button>
              <Button
                mode="outlined"
                onPress={handleClearAll}
                style={styles.clearButton}
                textColor="#718096"
              >
                Clear All Filters
              </Button>
            </View>

          </View>
        </View>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  filterButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 8,
    backgroundColor: "white",
    borderRadius: 8,
    borderWidth: 2,
    borderColor: "#2B6CB0",
    position: "relative",
  },
  filterButtonText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#2B6CB0",
  },
  badge: {
    backgroundColor: "#E53E3E",
    borderRadius: 10,
    width: 18,
    height: 18,
    alignItems: "center",
    justifyContent: "center",
    marginLeft: 2,
  },
  badgeText: {
    color: "white",
    fontSize: 11,
    fontWeight: "700",
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "flex-end",
  },
  modalContent: {
    backgroundColor: "white",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingTop: 20,
    paddingBottom: 40,
    maxHeight: "90%",
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingBottom: 6,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: "#2D3748",
  },
  modalSubtitle: {
    fontSize: 13,
    color: "#718096",
    paddingHorizontal: 20,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#E2E8F0",
  },
  tabsContainer: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#E2E8F0",
  },
  tab: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 8,
    backgroundColor: "#F7FAFC",
    borderWidth: 1,
    borderColor: "#E2E8F0",
  },
  tabActive: {
    backgroundColor: "#2B6CB0",
    borderColor: "#2B6CB0",
  },
  tabText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#718096",
  },
  tabTextActive: {
    color: "white",
  },
  optionsContainer: {
    paddingHorizontal: 20,
    paddingTop: 16,
    maxHeight: 380,
  },
  sectionLabel: {
    fontSize: 16,
    fontWeight: "700",
    color: "#2D3748",
    marginBottom: 4,
  },
  sectionHint: {
    fontSize: 13,
    color: "#718096",
    marginBottom: 16,
  },
  radioOption: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 6,
  },
  radioLabel: {
    fontSize: 15,
    color: "#4A5568",
    marginLeft: 8,
  },
  multiSelectGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
  },
  chip: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1.5,
    borderColor: "#E2E8F0",
    backgroundColor: "#F7FAFC",
  },
  chipSelected: {
    backgroundColor: "#EBF4FF",
    borderColor: "#2B6CB0",
  },
  chipText: {
    fontSize: 13,
    color: "#718096",
    fontWeight: "500",
  },
  chipTextSelected: {
    color: "#2B6CB0",
    fontWeight: "700",
  },
  modalActions: {
    paddingHorizontal: 20,
    paddingTop: 16,
    gap: 10,
    borderTopWidth: 1,
    borderTopColor: "#E2E8F0",
  },
  saveButton: { borderRadius: 8 },
  clearButton: { borderRadius: 8, borderColor: "#E2E8F0" },
});