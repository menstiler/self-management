import { View, Text, Pressable, StyleSheet } from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import { formatDateForDisplay } from "../../util/task.js";

function ReccuringInputs({ dataCtx, editingObj, updateEditingObj }) {
  function updateInputHandler(input, value) {
    const updatedObj = { ...dataCtx[editingObj], [input]: value };

    if (input === "repeat" && value === "weekly" && !updatedObj.dayOfWeek) {
      const dayNames = [
        "Sunday",
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday",
        "Saturday",
      ];
      const today = new Date();
      const todayName = dayNames[today.getDay()];
      updatedObj.dayOfWeek = [todayName]; // Now defaults to array
    }

    dataCtx[updateEditingObj](updatedObj);
  }

  function updateRecurringDateHandler(field, event, date) {
    if (date) {
      dataCtx[updateEditingObj]({
        ...dataCtx[editingObj],
        [field]: date,
      });
    }
  }

  return (
    <View style={styles.container}>
      <View style={styles.fieldGroup}>
        <Text style={styles.label}>Repeat</Text>
        <View style={styles.repeatOptions}>
          <Pressable
            style={[
              styles.repeatOption,
              dataCtx[editingObj].repeat === "daily" &&
                styles.repeatOptionSelected,
            ]}
            onPress={() => updateInputHandler("repeat", "daily")}
          >
            <Text
              style={[
                styles.repeatOptionText,
                dataCtx[editingObj].repeat === "daily" &&
                  styles.repeatOptionTextSelected,
              ]}
            >
              Daily
            </Text>
          </Pressable>
          <Pressable
            style={[
              styles.repeatOption,
              dataCtx[editingObj].repeat === "weekly" &&
                styles.repeatOptionSelected,
            ]}
            onPress={() => updateInputHandler("repeat", "weekly")}
          >
            <Text
              style={[
                styles.repeatOptionText,
                dataCtx[editingObj].repeat === "weekly" &&
                  styles.repeatOptionTextSelected,
              ]}
            >
              Weekly
            </Text>
          </Pressable>
        </View>
      </View>

      {dataCtx[editingObj].repeat === "weekly" && (
        <View style={styles.fieldGroup}>
          <Text style={styles.label}>Days of Week</Text>
          <View style={styles.dayOptions}>
            {[
              "Monday",
              "Tuesday",
              "Wednesday",
              "Thursday",
              "Friday",
              "Saturday",
              "Sunday",
            ].map((day) => {
              const currentDays = Array.isArray(dataCtx[editingObj].dayOfWeek)
                ? dataCtx[editingObj].dayOfWeek
                : dataCtx[editingObj].dayOfWeek
                ? [dataCtx[editingObj].dayOfWeek]
                : [];
              const isSelected = currentDays.includes(day);

              return (
                <Pressable
                  key={day}
                  style={[
                    styles.dayOption,
                    isSelected && styles.dayOptionSelected,
                  ]}
                  onPress={() => {
                    const newDays = isSelected
                      ? currentDays.filter((d) => d !== day)
                      : [...currentDays, day];
                    updateInputHandler("dayOfWeek", newDays);
                  }}
                >
                  <Text
                    style={[
                      styles.dayOptionText,
                      isSelected && styles.dayOptionTextSelected,
                    ]}
                  >
                    {day.slice(0, 3)}
                  </Text>
                </Pressable>
              );
            })}
          </View>
        </View>
      )}

      <View style={styles.pickerRow}>
        <View style={[styles.fieldGroup, styles.pickerContainer]}>
          <Text style={styles.label}>Start Date</Text>
          <View style={styles.pickerWrapper}>
            <DateTimePicker
              value={formatDateForDisplay(dataCtx[editingObj].startDate)}
              mode="date"
              display="default"
              onChange={(event, date) =>
                updateRecurringDateHandler("startDate", event, date)
              }
              minimumDate={new Date()}
            />
          </View>
        </View>

        <View style={[styles.fieldGroup, styles.pickerContainer]}>
          <Text style={styles.label}>End Date</Text>
          <View style={styles.pickerWrapper}>
            <DateTimePicker
              value={formatDateForDisplay(dataCtx[editingObj].endDate)}
              mode="date"
              display="default"
              onChange={(event, date) =>
                updateRecurringDateHandler("endDate", event, date)
              }
              minimumDate={formatDateForDisplay(dataCtx[editingObj].startDate)}
            />
          </View>
        </View>
      </View>
    </View>
  );
}

export default ReccuringInputs;

const styles = StyleSheet.create({
  container: {
    padding: 16,
    marginBottom: 50,
  },
  pickerRow: {
    flexDirection: "row",
    gap: 12,
  },
  pickerContainer: {
    flex: 1,
  },
  pickerWrapper: {
    marginLeft: -8,
    paddingLeft: 0,
  },
  fieldGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: "600",
    color: "#1A1A1A",
    marginBottom: 8,
  },
  repeatOptions: {
    flexDirection: "row",
    gap: 8,
  },
  repeatOption: {
    flex: 1,
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#E0E0E0",
    backgroundColor: "#FFFFFF",
  },
  repeatOptionSelected: {
    backgroundColor: "#E3F2FD",
    borderColor: "#2196F3",
  },
  repeatOptionText: {
    fontSize: 14,
    color: "#1A1A1A",
    textAlign: "center",
  },
  repeatOptionTextSelected: {
    color: "#1976D2",
    fontWeight: "600",
  },
  dayOptionText: {
    fontSize: 12,
    color: "#1A1A1A",
    textAlign: "center",
  },
  dayOptionSelected: {
    backgroundColor: "#E3F2FD",
    borderColor: "#2196F3",
  },
  dayOptionTextSelected: {
    color: "#1976D2",
    fontWeight: "600",
  },
  dayOptions: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 4,
  },
  dayOption: {
    paddingVertical: 6,
    paddingHorizontal: 8,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: "#E0E0E0",
    backgroundColor: "#FFFFFF",
    minWidth: 40,
  },
});
