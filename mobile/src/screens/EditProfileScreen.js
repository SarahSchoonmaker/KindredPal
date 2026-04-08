import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  TextInput,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { ActivityIndicator } from "react-native-paper";
import { authAPI, userAPI } from "../services/api";

const US_STATES = [
  "AL",
  "AK",
  "AZ",
  "AR",
  "CA",
  "CO",
  "CT",
  "DE",
  "FL",
  "GA",
  "HI",
  "ID",
  "IL",
  "IN",
  "IA",
  "KS",
  "KY",
  "LA",
  "ME",
  "MD",
  "MA",
  "MI",
  "MN",
  "MS",
  "MO",
  "MT",
  "NE",
  "NV",
  "NH",
  "NJ",
  "NM",
  "NY",
  "NC",
  "ND",
  "OH",
  "OK",
  "OR",
  "PA",
  "RI",
  "SC",
  "SD",
  "TN",
  "TX",
  "UT",
  "VT",
  "VA",
  "WA",
  "WV",
  "WI",
  "WY",
  "DC",
];

const RELIGION_OPTIONS = [
  "None",
  "Spiritual but not religious",
  "Christian (Catholic)",
  "Christian (Protestant)",
  "Christian (Evangelical)",
  "Christian (Orthodox)",
  "Jewish",
  "Muslim",
  "Hindu",
  "Buddhist",
  "Mormon / LDS",
  "Other",
];

const POLITICS_OPTIONS = [
  "Conservative",
  "Moderate",
  "Liberal",
  "Prefer not to say",
];

const LIFE_STAGE_OPTIONS = [
  "Single",
  "In a relationship",
  "Married",
  "Divorced",
  "Widowed",
  "Empty nester",
  "Retired",
  "Caregiver",
  "Aging Alone",
  "New Career",
  "New to Town",
];

const FAMILY_OPTIONS = [
  "No kids",
  "Expecting",
  "Kids under 5",
  "Kids 6-12",
  "Teenagers",
  "Adult children",
  "Grandchildren",
  "Homeschooling",
];

const CORE_VALUES_OPTIONS = [
  "Faith & God",
  "Personal growth",
  "Health & wellness",
  "Community & service",
  "Adventure & outdoors",
  "Creativity & arts",
  "Lifelong learning",
  "Financial freedom",
  "Environmental stewardship",
  "Mental health & self-care",
  "Entrepreneurship",
  "Animal welfare",
  "Theology",
  "Philosophy",
  "Technology",
  "Sports & Athletics",
  "Fashion",
  "Design",
  "Real Estate",
  "Investing",
  "Reading",
  "Politics",
];

function SectionHeader({ title }) {
  return <Text style={styles.sectionHeader}>{title}</Text>;
}

function Field({ label, children }) {
  return (
    <View style={styles.field}>
      <Text style={styles.fieldLabel}>{label}</Text>
      {children}
    </View>
  );
}

function ChipGroup({ options, selected = [], onChange, max }) {
  const toggle = (val) => {
    if (selected.includes(val)) {
      onChange(selected.filter((v) => v !== val));
    } else {
      if (max && selected.length >= max) return;
      onChange([...selected, val]);
    }
  };
  return (
    <View style={styles.chips}>
      {options.map((opt) => (
        <TouchableOpacity
          key={opt}
          style={[styles.chip, selected.includes(opt) && styles.chipActive]}
          onPress={() => toggle(opt)}
        >
          <Text
            style={[
              styles.chipText,
              selected.includes(opt) && styles.chipTextActive,
            ]}
          >
            {opt}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );
}

function PickerField({ label, options, value, onChange }) {
  const [open, setOpen] = useState(false);
  return (
    <Field label={label}>
      <TouchableOpacity style={styles.pickerBtn} onPress={() => setOpen(!open)}>
        <Text style={value ? styles.pickerValue : styles.pickerPlaceholder}>
          {value || "Select..."}
        </Text>
        <Text style={styles.pickerArrow}>{open ? "▲" : "▼"}</Text>
      </TouchableOpacity>
      {open && (
        <View style={styles.pickerDropdown}>
          <ScrollView style={{ maxHeight: 200 }} nestedScrollEnabled>
            <TouchableOpacity
              style={styles.pickerOption}
              onPress={() => {
                onChange("");
                setOpen(false);
              }}
            >
              <Text style={styles.pickerOptionText}>— None —</Text>
            </TouchableOpacity>
            {options.map((opt) => (
              <TouchableOpacity
                key={opt}
                style={[
                  styles.pickerOption,
                  value === opt && styles.pickerOptionActive,
                ]}
                onPress={() => {
                  onChange(opt);
                  setOpen(false);
                }}
              >
                <Text
                  style={[
                    styles.pickerOptionText,
                    value === opt && styles.pickerOptionTextActive,
                  ]}
                >
                  {opt}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
      )}
    </Field>
  );
}

export default function EditProfileScreen({ navigation, route }) {
  const emailRef = useRef(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    name: "",
    email: "",
    age: "",
    bio: "",
    city: "",
    state: "",
    religion: "",
    politicalBeliefs: "",
    lifeStage: [],
    familySituation: [],
    coreValues: [],
  });

  const set = (field, value) =>
    setForm((prev) => ({ ...prev, [field]: value }));

  useEffect(() => {
    authAPI
      .getProfile()
      .then((res) => {
        const u = res.data;
        setForm({
          name: u.name || "",
          email: u.email || "",
          age: u.age ? String(u.age) : "",
          bio: u.bio || "",
          city: u.city || "",
          state: u.state || "",
          religion: u.religion || "",
          politicalBeliefs:
            typeof u.politicalBeliefs === "string" ? u.politicalBeliefs : "",
          lifeStage: u.lifeStage || [],
          familySituation: u.familySituation || [],
          coreValues: u.coreValues || [],
        });
      })
      .catch(() => Alert.alert("Error", "Could not load profile"))
      .finally(() => setLoading(false));
  }, []);

  // Auto-focus email if navigated with focusEmail param
  useEffect(() => {
    if (!loading && route?.params?.focusEmail) {
      setTimeout(() => emailRef.current?.focus(), 400);
    }
  }, [loading, route?.params?.focusEmail]);

  const handleSave = async () => {
    if (!form.name.trim()) return Alert.alert("Required", "Name is required");
    if (!form.email.trim()) return Alert.alert("Required", "Email is required");
    setSaving(true);
    try {
      // FIX: Email was previously only saved in a separate conditional block
      // that checked route.params.currentEmail — which is never passed, so
      // email changes were silently dropped. Now included in the main call.
      await userAPI.updateProfile({
        name: form.name,
        email: form.email,
        age: form.age ? parseInt(form.age) : undefined,
        bio: form.bio,
        city: form.city,
        state: form.state,
        religion: form.religion,
        politicalBeliefs: form.politicalBeliefs,
        lifeStage: form.lifeStage,
        familySituation: form.familySituation,
        coreValues: form.coreValues,
      });

      Alert.alert("Saved!", "Your profile has been updated.", [
        { text: "OK", onPress: () => navigation.goBack() },
      ]);
    } catch (err) {
      Alert.alert(
        "Error",
        err.response?.data?.message || "Could not save profile",
      );
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#2B6CB0" />
      </View>
    );
  }

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.content}
        keyboardShouldPersistTaps="handled"
      >
        <SectionHeader title="Basic Info" />

        <Field label="Name">
          <TextInput
            style={styles.input}
            value={form.name}
            onChangeText={(v) => set("name", v)}
            placeholder="Your name"
            placeholderTextColor="#a0aec0"
          />
        </Field>

        <Field label="Email">
          <TextInput
            ref={emailRef}
            style={styles.input}
            value={form.email}
            onChangeText={(v) => set("email", v)}
            placeholder="your@email.com"
            placeholderTextColor="#a0aec0"
            keyboardType="email-address"
            autoCapitalize="none"
            autoCorrect={false}
          />
          <Text style={styles.fieldHint}>
            Changing your email will update your login
          </Text>
        </Field>

        <Field label="Age">
          <TextInput
            style={[styles.input, styles.inputShort]}
            value={form.age}
            onChangeText={(v) => set("age", v)}
            keyboardType="number-pad"
            maxLength={3}
            placeholder="Age"
            placeholderTextColor="#a0aec0"
          />
        </Field>

        <Field label="Bio">
          <TextInput
            style={[styles.input, styles.inputMulti]}
            value={form.bio}
            onChangeText={(v) => set("bio", v)}
            multiline
            numberOfLines={4}
            maxLength={500}
            placeholder="Tell people about yourself..."
            placeholderTextColor="#a0aec0"
          />
          <Text style={styles.charCount}>{form.bio.length}/500</Text>
        </Field>

        <View style={styles.row}>
          <View style={{ flex: 1 }}>
            <Field label="City">
              <TextInput
                style={styles.input}
                value={form.city}
                onChangeText={(v) => set("city", v)}
                placeholder="City"
                placeholderTextColor="#a0aec0"
              />
            </Field>
          </View>
          <View style={{ width: 100, marginLeft: 10 }}>
            <PickerField
              label="State"
              options={US_STATES}
              value={form.state}
              onChange={(v) => set("state", v)}
            />
          </View>
        </View>

        <SectionHeader title="Faith & Values" />

        <PickerField
          label="Religion / Faith"
          options={RELIGION_OPTIONS}
          value={form.religion}
          onChange={(v) => set("religion", v)}
        />

        <PickerField
          label="Political Views"
          options={POLITICS_OPTIONS}
          value={form.politicalBeliefs}
          onChange={(v) => set("politicalBeliefs", v)}
        />

        <Field label="Core Values (pick up to 3)">
          <ChipGroup
            options={CORE_VALUES_OPTIONS}
            selected={form.coreValues}
            onChange={(v) => set("coreValues", v)}
            max={3}
          />
        </Field>

        <SectionHeader title="Life Stage" />

        <Field label="Life Stage (select all that apply)">
          <ChipGroup
            options={LIFE_STAGE_OPTIONS}
            selected={form.lifeStage}
            onChange={(v) => set("lifeStage", v)}
          />
        </Field>

        <Field label="Family Situation (select all that apply)">
          <ChipGroup
            options={FAMILY_OPTIONS}
            selected={form.familySituation}
            onChange={(v) => set("familySituation", v)}
          />
        </Field>

        <TouchableOpacity
          style={[styles.saveBtn, saving && styles.saveBtnDisabled]}
          onPress={handleSave}
          disabled={saving}
        >
          <Text style={styles.saveBtnText}>
            {saving ? "Saving..." : "Save Profile"}
          </Text>
        </TouchableOpacity>

        <View style={{ height: 40 }} />
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F7FAFC" },
  content: { padding: 16 },
  center: { flex: 1, justifyContent: "center", alignItems: "center" },

  sectionHeader: {
    fontSize: 13,
    fontWeight: "700",
    color: "#718096",
    textTransform: "uppercase",
    letterSpacing: 0.8,
    marginTop: 24,
    marginBottom: 12,
    paddingBottom: 6,
    borderBottomWidth: 1,
    borderBottomColor: "#E2E8F0",
  },

  field: { marginBottom: 14 },
  fieldLabel: {
    fontSize: 13,
    fontWeight: "600",
    color: "#4A5568",
    marginBottom: 6,
  },
  fieldHint: { fontSize: 11, color: "#a0aec0", marginTop: 4 },
  charCount: {
    fontSize: 11,
    color: "#a0aec0",
    textAlign: "right",
    marginTop: 2,
  },

  input: {
    backgroundColor: "white",
    borderWidth: 1.5,
    borderColor: "#E2E8F0",
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 15,
    color: "#2D3748",
  },
  inputShort: { width: 80 },
  inputMulti: { minHeight: 100, textAlignVertical: "top" },
  row: { flexDirection: "row", alignItems: "flex-start" },

  pickerBtn: {
    backgroundColor: "white",
    borderWidth: 1.5,
    borderColor: "#E2E8F0",
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 10,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  pickerValue: { fontSize: 15, color: "#2D3748", flex: 1 },
  pickerPlaceholder: { fontSize: 15, color: "#a0aec0", flex: 1 },
  pickerArrow: { fontSize: 11, color: "#a0aec0" },
  pickerDropdown: {
    backgroundColor: "white",
    borderWidth: 1.5,
    borderColor: "#E2E8F0",
    borderRadius: 10,
    marginTop: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  pickerOption: {
    paddingHorizontal: 14,
    paddingVertical: 11,
    borderBottomWidth: 1,
    borderBottomColor: "#F7FAFC",
  },
  pickerOptionActive: { backgroundColor: "#EBF4FF" },
  pickerOptionText: { fontSize: 14, color: "#2D3748" },
  pickerOptionTextActive: { color: "#2B6CB0", fontWeight: "600" },

  chips: { flexDirection: "row", flexWrap: "wrap", gap: 8 },
  chip: {
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 16,
    backgroundColor: "white",
    borderWidth: 1.5,
    borderColor: "#E2E8F0",
  },
  chipActive: { backgroundColor: "#2B6CB0", borderColor: "#2B6CB0" },
  chipText: { fontSize: 13, color: "#4A5568", fontWeight: "500" },
  chipTextActive: { color: "white", fontWeight: "600" },

  saveBtn: {
    backgroundColor: "#2B6CB0",
    borderRadius: 12,
    paddingVertical: 15,
    alignItems: "center",
    marginTop: 24,
  },
  saveBtnDisabled: { opacity: 0.6 },
  saveBtnText: { color: "white", fontSize: 16, fontWeight: "700" },
});
