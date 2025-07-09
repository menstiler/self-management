import { View, Text, TextInput } from "react-native";

function DurationField({ durationValue, updateDurationHandler }) {
  return (
    <View>
      <Text>Duration</Text>
      <View>
        <Text>Days</Text>
        <TextInput
          onChangeText={(value) => updateDurationHandler("days", value)}
          value={durationValue.days}
          keyboardType="numeric"
        />
        <Text>Hours</Text>
        <TextInput
          onChangeText={(value) => updateDurationHandler("hours", value)}
          value={durationValue.hours}
          keyboardType="numeric"
          maxLength={2}
        />
        <Text>Minutes</Text>
        <TextInput
          onChangeText={(value) => updateDurationHandler("minutes", value)}
          value={durationValue.minutes}
          keyboardType="numeric"
          maxLength={2}
        />
      </View>
    </View>
  );
}

export default DurationField;
