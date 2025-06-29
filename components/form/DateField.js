import { View, Text } from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";

function DateField({ data, value, updateDateHandler }) {
  return (
    <View>
      <Text>{data === "goal" ? "Deadline" : "Due Date"}</Text>

      <DateTimePicker
        testID="datePicker"
        value={value}
        mode="date"
        is24Hour={true}
        display="default"
        onChange={updateDateHandler}
        minimumDate={new Date()}
        positiveButtonLabel="OK!"
      />
      <DateTimePicker
        value={value}
        mode="time"
        is24Hour={true}
        display="default"
        onChange={updateDateHandler}
        positiveButtonLabel="OK!"
      />
    </View>
  );
}

export default DateField;
