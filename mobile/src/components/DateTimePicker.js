import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Modal,
} from "react-native";
import {
  ChevronLeft,
  ChevronRight,
  Calendar,
  Clock,
} from "lucide-react-native";

const MONTHS = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];
const DAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const HOURS = Array.from({ length: 12 }, (_, i) => i + 1);
const MINUTES = ["00", "15", "30", "45"];

function getDaysInMonth(year, month) {
  return new Date(year, month + 1, 0).getDate();
}

function getFirstDayOfMonth(year, month) {
  return new Date(year, month, 1).getDay();
}

export default function DateTimePicker({ value, onChange, label }) {
  const now = value instanceof Date ? value : new Date();

  const [visible, setVisible] = useState(false);
  const [viewMonth, setViewMonth] = useState(now.getMonth());
  const [viewYear, setViewYear] = useState(now.getFullYear());
  const [selectedDate, setSelectedDate] = useState(now);
  const [hour, setHour] = useState(now.getHours() % 12 || 12);
  const [minute, setMinute] = useState(
    MINUTES.reduce((prev, curr) =>
      Math.abs(parseInt(curr) - now.getMinutes()) <
      Math.abs(parseInt(prev) - now.getMinutes())
        ? curr
        : prev,
    ),
  );
  const [ampm, setAmpm] = useState(now.getHours() >= 12 ? "PM" : "AM");

  const daysInMonth = getDaysInMonth(viewYear, viewMonth);
  const firstDay = getFirstDayOfMonth(viewYear, viewMonth);

  const prevMonth = () => {
    if (viewMonth === 0) {
      setViewMonth(11);
      setViewYear((y) => y - 1);
    } else setViewMonth((m) => m - 1);
  };

  const nextMonth = () => {
    if (viewMonth === 11) {
      setViewMonth(0);
      setViewYear((y) => y + 1);
    } else setViewMonth((m) => m + 1);
  };

  const selectDay = (day) => {
    const d = new Date(viewYear, viewMonth, day);
    setSelectedDate(d);
  };

  const confirm = () => {
    const d = new Date(selectedDate);
    let h = hour;
    if (ampm === "PM" && h !== 12) h += 12;
    if (ampm === "AM" && h === 12) h = 0;
    d.setHours(h, parseInt(minute), 0, 0);
    onChange(d);
    setVisible(false);
  };

  const formatDisplay = () => {
    const d = value instanceof Date ? value : new Date();
    const dateStr = d.toLocaleDateString("en-US", {
      weekday: "short",
      month: "short",
      day: "numeric",
      year: "numeric",
    });
    const timeStr = d.toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });
    return `${dateStr} at ${timeStr}`;
  };

  const isToday = (day) => {
    const today = new Date();
    return (
      day === today.getDate() &&
      viewMonth === today.getMonth() &&
      viewYear === today.getFullYear()
    );
  };

  const isSelected = (day) => {
    return (
      day === selectedDate.getDate() &&
      viewMonth === selectedDate.getMonth() &&
      viewYear === selectedDate.getFullYear()
    );
  };

  return (
    <>
      <TouchableOpacity style={styles.trigger} onPress={() => setVisible(true)}>
        <Calendar size={18} color="#2B6CB0" />
        <Text style={styles.triggerText}>{formatDisplay()}</Text>
      </TouchableOpacity>

      <Modal
        visible={visible}
        animationType="slide"
        transparent
        onRequestClose={() => setVisible(false)}
      >
        <View style={styles.overlay}>
          <View style={styles.sheet}>
            {/* Header */}
            <View style={styles.sheetHeader}>
              <Text style={styles.sheetTitle}>Pick Date & Time</Text>
              <TouchableOpacity onPress={() => setVisible(false)}>
                <Text style={styles.cancelText}>Cancel</Text>
              </TouchableOpacity>
            </View>

            <ScrollView showsVerticalScrollIndicator={false}>
              {/* Month Navigation */}
              <View style={styles.monthNav}>
                <TouchableOpacity onPress={prevMonth} style={styles.navBtn}>
                  <ChevronLeft size={20} color="#2B6CB0" />
                </TouchableOpacity>
                <Text style={styles.monthTitle}>
                  {MONTHS[viewMonth]} {viewYear}
                </Text>
                <TouchableOpacity onPress={nextMonth} style={styles.navBtn}>
                  <ChevronRight size={20} color="#2B6CB0" />
                </TouchableOpacity>
              </View>

              {/* Day Headers */}
              <View style={styles.dayHeaders}>
                {DAYS.map((d) => (
                  <Text key={d} style={styles.dayHeader}>
                    {d}
                  </Text>
                ))}
              </View>

              {/* Calendar Grid */}
              <View style={styles.calendarGrid}>
                {Array.from({ length: firstDay }).map((_, i) => (
                  <View key={`empty-${i}`} style={styles.dayCell} />
                ))}
                {Array.from({ length: daysInMonth }, (_, i) => i + 1).map(
                  (day) => (
                    <TouchableOpacity
                      key={day}
                      style={[
                        styles.dayCell,
                        isSelected(day) && styles.dayCellSelected,
                        isToday(day) && !isSelected(day) && styles.dayCellToday,
                      ]}
                      onPress={() => selectDay(day)}
                    >
                      <Text
                        style={[
                          styles.dayText,
                          isSelected(day) && styles.dayTextSelected,
                          isToday(day) &&
                            !isSelected(day) &&
                            styles.dayTextToday,
                        ]}
                      >
                        {day}
                      </Text>
                    </TouchableOpacity>
                  ),
                )}
              </View>

              {/* Divider */}
              <View style={styles.divider} />

              {/* Time Picker */}
              <View style={styles.timeSection}>
                <View style={styles.timeLabelRow}>
                  <Clock size={16} color="#2B6CB0" />
                  <Text style={styles.timeLabel}>Select Time</Text>
                </View>

                <View style={styles.timeRow}>
                  {/* Hours */}
                  <View style={styles.timeColumn}>
                    <Text style={styles.timeColumnLabel}>Hour</Text>
                    <ScrollView
                      style={styles.timeScroll}
                      showsVerticalScrollIndicator={false}
                    >
                      {HOURS.map((h) => (
                        <TouchableOpacity
                          key={h}
                          style={[
                            styles.timeOption,
                            hour === h && styles.timeOptionSelected,
                          ]}
                          onPress={() => setHour(h)}
                        >
                          <Text
                            style={[
                              styles.timeOptionText,
                              hour === h && styles.timeOptionTextSelected,
                            ]}
                          >
                            {h}
                          </Text>
                        </TouchableOpacity>
                      ))}
                    </ScrollView>
                  </View>

                  {/* Minutes */}
                  <View style={styles.timeColumn}>
                    <Text style={styles.timeColumnLabel}>Minute</Text>
                    <ScrollView
                      style={styles.timeScroll}
                      showsVerticalScrollIndicator={false}
                    >
                      {MINUTES.map((m) => (
                        <TouchableOpacity
                          key={m}
                          style={[
                            styles.timeOption,
                            minute === m && styles.timeOptionSelected,
                          ]}
                          onPress={() => setMinute(m)}
                        >
                          <Text
                            style={[
                              styles.timeOptionText,
                              minute === m && styles.timeOptionTextSelected,
                            ]}
                          >
                            :{m}
                          </Text>
                        </TouchableOpacity>
                      ))}
                    </ScrollView>
                  </View>

                  {/* AM/PM */}
                  <View style={styles.timeColumn}>
                    <Text style={styles.timeColumnLabel}>AM/PM</Text>
                    <View style={styles.ampmContainer}>
                      {["AM", "PM"].map((p) => (
                        <TouchableOpacity
                          key={p}
                          style={[
                            styles.ampmOption,
                            ampm === p && styles.ampmOptionSelected,
                          ]}
                          onPress={() => setAmpm(p)}
                        >
                          <Text
                            style={[
                              styles.ampmText,
                              ampm === p && styles.ampmTextSelected,
                            ]}
                          >
                            {p}
                          </Text>
                        </TouchableOpacity>
                      ))}
                    </View>
                  </View>
                </View>
              </View>

              {/* Selected preview */}
              <View style={styles.preview}>
                <Text style={styles.previewText}>
                  {MONTHS[selectedDate.getMonth()]} {selectedDate.getDate()},{" "}
                  {selectedDate.getFullYear()} at {hour}:{minute} {ampm}
                </Text>
              </View>

              {/* Confirm */}
              <TouchableOpacity style={styles.confirmBtn} onPress={confirm}>
                <Text style={styles.confirmText}>Confirm Date & Time</Text>
              </TouchableOpacity>
            </ScrollView>
          </View>
        </View>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  trigger: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    backgroundColor: "white",
    borderWidth: 2,
    borderColor: "#E2E8F0",
    borderRadius: 10,
    padding: 14,
  },
  triggerText: {
    fontSize: 14,
    color: "#2D3748",
    fontWeight: "500",
    flex: 1,
  },
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "flex-end",
  },
  sheet: {
    backgroundColor: "white",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: "90%",
    paddingBottom: 40,
  },
  sheetHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#E2E8F0",
  },
  sheetTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#1E3A8A",
  },
  cancelText: {
    fontSize: 15,
    color: "#718096",
    fontWeight: "600",
  },
  monthNav: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  navBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "#EBF4FF",
    alignItems: "center",
    justifyContent: "center",
  },
  monthTitle: {
    fontSize: 17,
    fontWeight: "700",
    color: "#2D3748",
  },
  dayHeaders: {
    flexDirection: "row",
    paddingHorizontal: 12,
    marginBottom: 4,
  },
  dayHeader: {
    flex: 1,
    textAlign: "center",
    fontSize: 12,
    fontWeight: "600",
    color: "#A0AEC0",
  },
  calendarGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    paddingHorizontal: 12,
  },
  dayCell: {
    width: "14.28%",
    aspectRatio: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 2,
  },
  dayCellSelected: {
    backgroundColor: "#2B6CB0",
    borderRadius: 999,
  },
  dayCellToday: {
    borderWidth: 2,
    borderColor: "#2B6CB0",
    borderRadius: 999,
  },
  dayText: {
    fontSize: 15,
    color: "#2D3748",
    fontWeight: "500",
  },
  dayTextSelected: {
    color: "white",
    fontWeight: "700",
  },
  dayTextToday: {
    color: "#2B6CB0",
    fontWeight: "700",
  },
  divider: {
    height: 1,
    backgroundColor: "#E2E8F0",
    marginHorizontal: 20,
    marginVertical: 16,
  },
  timeSection: {
    paddingHorizontal: 20,
  },
  timeLabelRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 12,
  },
  timeLabel: {
    fontSize: 15,
    fontWeight: "700",
    color: "#1E3A8A",
  },
  timeRow: {
    flexDirection: "row",
    gap: 12,
  },
  timeColumn: {
    flex: 1,
  },
  timeColumnLabel: {
    fontSize: 11,
    fontWeight: "600",
    color: "#A0AEC0",
    textAlign: "center",
    marginBottom: 8,
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  timeScroll: {
    maxHeight: 160,
    backgroundColor: "#F7FAFC",
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#E2E8F0",
  },
  timeOption: {
    paddingVertical: 12,
    alignItems: "center",
    borderRadius: 8,
  },
  timeOptionSelected: {
    backgroundColor: "#2B6CB0",
    margin: 4,
    borderRadius: 8,
  },
  timeOptionText: {
    fontSize: 16,
    color: "#4A5568",
    fontWeight: "500",
  },
  timeOptionTextSelected: {
    color: "white",
    fontWeight: "700",
  },
  ampmContainer: {
    backgroundColor: "#F7FAFC",
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#E2E8F0",
    overflow: "hidden",
  },
  ampmOption: {
    paddingVertical: 16,
    alignItems: "center",
  },
  ampmOptionSelected: {
    backgroundColor: "#2B6CB0",
    margin: 4,
    borderRadius: 8,
  },
  ampmText: {
    fontSize: 16,
    color: "#4A5568",
    fontWeight: "600",
  },
  ampmTextSelected: {
    color: "white",
    fontWeight: "700",
  },
  preview: {
    margin: 20,
    padding: 14,
    backgroundColor: "#EBF4FF",
    borderRadius: 10,
    alignItems: "center",
  },
  previewText: {
    fontSize: 15,
    color: "#2B6CB0",
    fontWeight: "600",
  },
  confirmBtn: {
    marginHorizontal: 20,
    backgroundColor: "#2B6CB0",
    padding: 16,
    borderRadius: 12,
    alignItems: "center",
  },
  confirmText: {
    color: "white",
    fontSize: 16,
    fontWeight: "700",
  },
});
