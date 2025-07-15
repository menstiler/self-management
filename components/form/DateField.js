import { View, Text, StyleSheet } from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";

function DateField({ data, value, updateDateHandler }) {
  return (
    <View style={styles.container}>
      <Text style={styles.label}>
        {data === "goal" ? "Deadline" : "Due Date"}
      </Text>

      <View style={styles.pickerRow}>
        <View style={styles.pickerContainer}>
          <Text style={styles.pickerLabel}>Date</Text>
          <View style={styles.pickerWrapper}>
            <DateTimePicker
              testID="datePicker"
              value={value}
              mode="date"
              is24Hour={true}
              display="default"
              onChange={updateDateHandler}
              minimumDate={new Date()}
              positiveButtonLabel="OK!"
              style={styles.picker}
            />
          </View>
        </View>

        <View style={styles.pickerContainer}>
          <Text style={styles.pickerLabel}>Time</Text>
          <View style={styles.pickerWrapper}>
            <DateTimePicker
              value={value}
              mode="time"
              is24Hour={true}
              display="default"
              onChange={updateDateHandler}
              positiveButtonLabel="OK!"
              style={styles.picker}
            />
          </View>
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
  pickerRow: {
    flexDirection: "row",
    gap: 12,
  },
  pickerContainer: {
    flex: 1,
  },
  pickerLabel: {
    fontSize: 14,
    color: "#666",
    marginBottom: 4,
  },
  picker: {
    height: 50,
  },
  pickerWrapper: {
    marginLeft: -8, // Remove default left margin
    paddingLeft: 0, // Remove any padding
  },
});

export default DateField;
