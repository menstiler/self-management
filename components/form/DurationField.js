import { View, Text, TextInput, StyleSheet } from "react-native";

function DurationField({ durationValue, updateDurationHandler }) {
  return (
    <View style={styles.container}>
      <Text style={styles.label}>Duration</Text>
      <View style={styles.durationRow}>
        <View style={styles.durationField}>
          <Text style={styles.fieldLabel}>Days</Text>
          <TextInput
            style={styles.input}
            onChangeText={(value) => updateDurationHandler("days", value)}
            value={durationValue.days?.toString() || "0"}
            keyboardType="numeric"
            placeholder="0"
            placeholderTextColor="#999"
          />
        </View>
        <View style={styles.durationField}>
          <Text style={styles.fieldLabel}>Hours</Text>
          <TextInput
            style={styles.input}
            onChangeText={(value) => updateDurationHandler("hours", value)}
            value={durationValue.hours?.toString() || "0"}
            keyboardType="numeric"
            maxLength={2}
            placeholder="0"
            placeholderTextColor="#999"
          />
        </View>
        <View style={styles.durationField}>
          <Text style={styles.fieldLabel}>Minutes</Text>
          <TextInput
            style={styles.input}
            onChangeText={(value) => updateDurationHandler("minutes", value)}
            value={durationValue.minutes?.toString() || "0"}
            keyboardType="numeric"
            maxLength={2}
            placeholder="0"
            placeholderTextColor="#999"
          />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: "600",
    color: "#1A1A1A",
    marginBottom: 8,
  },
  durationRow: {
    flexDirection: "row",
    gap: 12,
  },
  durationField: {
    flex: 1,
  },
  fieldLabel: {
    fontSize: 14,
    color: "#666",
    marginBottom: 4,
  },
  input: {
    borderWidth: 1,
    borderColor: "#E0E0E0",
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    fontSize: 16,
    color: "#1A1A1A",
    backgroundColor: "#FFFFFF",
    textAlign: "center",
  },
});

export default DurationField;
