import React, { useState } from "react";
import {
  View,
  StyleSheet,
  Modal,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import { Text, Button, RadioButton } from "react-native-paper";
import { Settings, X } from "lucide-react-native";
import { userAPI } from "../services/api";

export default function DiscoverFilters({ currentPreference, onUpdate }) {
  const [visible, setVisible] = useState(false);
  const [selectedPreference, setSelectedPreference] = useState(
    currentPreference || "Home state",
  );
  const [saving, setSaving] = useState(false);

  const locationOptions = [
    "Same city",
    "Home state",
    "Within 50 miles",
    "Within 100 miles",
    "Within 200 miles",
    "Anywhere",
  ];

  const handleSave = async () => {
    setSaving(true);
    try {
      await userAPI.updateProfile({ locationPreference: selectedPreference });
      setVisible(false);
      if (onUpdate) {
        onUpdate();
      }
    } catch (error) {
      logger.error("Error updating preferences:", error);
      alert("Failed to save preferences");
    } finally {
      setSaving(false);
    }
  };

  return (
    <>
      <TouchableOpacity
        style={styles.filterButton}
        onPress={() => setVisible(true)}
      >
        <Settings size={20} color="#2B6CB0" />
        <Text style={styles.filterButtonText}>Search Preferences</Text>
      </TouchableOpacity>

      <Modal
        visible={visible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Search Preferences</Text>
              <TouchableOpacity onPress={() => setVisible(false)}>
                <X size={24} color="#718096" />
              </TouchableOpacity>
            </View>

            <ScrollView style={styles.optionsContainer}>
              <Text style={styles.sectionLabel}>Show me people in:</Text>

              <RadioButton.Group
                onValueChange={(value) => setSelectedPreference(value)}
                value={selectedPreference}
              >
                {locationOptions.map((option) => (
                  <TouchableOpacity
                    key={option}
                    style={styles.radioOption}
                    onPress={() => setSelectedPreference(option)}
                  >
                    <RadioButton.Android value={option} color="#2B6CB0" />
                    <Text style={styles.radioLabel}>{option}</Text>
                  </TouchableOpacity>
                ))}
              </RadioButton.Group>
            </ScrollView>

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
                onPress={() => setVisible(false)}
                style={styles.cancelButton}
                textColor="#718096"
              >
                Cancel
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
    gap: 8,
    paddingHorizontal: 16,
    paddingVertical: 10,
    backgroundColor: "white",
    borderRadius: 8,
    borderWidth: 2,
    borderColor: "#2B6CB0",
  },
  filterButtonText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#2B6CB0",
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "flex-end",
  },
  modalContent: {
    backgroundColor: "white",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingTop: 20,
    paddingBottom: 40,
    maxHeight: "80%",
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#E2E8F0",
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: "#2D3748",
  },
  optionsContainer: {
    paddingHorizontal: 20,
    paddingTop: 16,
  },
  sectionLabel: {
    fontSize: 16,
    fontWeight: "600",
    color: "#2D3748",
    marginBottom: 12,
  },
  radioOption: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 8,
  },
  radioLabel: {
    fontSize: 16,
    color: "#4A5568",
    marginLeft: 8,
  },
  modalActions: {
    paddingHorizontal: 20,
    paddingTop: 20,
    gap: 12,
  },
  saveButton: {
    borderRadius: 8,
  },
  cancelButton: {
    borderRadius: 8,
    borderColor: "#E2E8F0",
  },
});
