import { View, Text } from "react-native";
import SegmentedControl from "@react-native-segmented-control/segmented-control";

function PriorityField({ value, updateInputHandler }) {
  const priorities = {
    high: 0,
    medium: 1,
    low: 2,
  };

  return (
    <View>
      <Text>Priority</Text>
      <SegmentedControl
        values={["High", "Medium", "Low"]}
        selectedIndex={priorities[value]}
        onChange={(event) => {
          updateInputHandler("priority", event.nativeEvent.value.toLowerCase());
        }}
      />
    </View>
  );
}

export default PriorityField;
