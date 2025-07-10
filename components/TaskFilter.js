import { View } from "react-native";
import SegmentedControl from "@react-native-segmented-control/segmented-control";

function TaskFilter({ setFilterType, filterType }) {
  return (
    <View>
      <SegmentedControl
        values={["All", "Today", "This Week", "This Month"]}
        selectedIndex={filterType}
        onChange={(event) => {
          setFilterType(event.nativeEvent.selectedSegmentIndex);
        }}
        tintColor="#1F2937" // ✅ Green highlight
        backgroundColor="#E5E7EB"
        fontStyle={{ color: "#374151", fontSize: 14 }}
        activeFontStyle={{ color: "#fff", fontWeight: "600" }}
        style={{ borderRadius: 8, marginVertical: 8 }}
      />
    </View>
  );
}

export default TaskFilter;
