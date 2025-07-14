import { useContext } from "react";
import { View, Text, StyleSheet } from "react-native";
import { DataContext } from "../store/data-context.js";
import AllItems from "../components/AllItems.js";
import { capitalizeWords } from "../util/task.js";
import {
  SafeAreaView,
  useSafeAreaInsets,
} from "react-native-safe-area-context";

function DataList({ route }) {
  const dataCtx = useContext(DataContext);
  const insets = useSafeAreaInsets();

  return (
    <SafeAreaView
      style={[styles.container, { paddingBottom: insets.bottom + 80 }]}
      edges={["top"]}
    >
      {dataCtx[route.params.data].length === 0 ? (
        <View>
          <Text>{`No ${capitalizeWords(route.params.data)} Found`}</Text>
        </View>
      ) : (
        <AllItems data={route.name === "GoalList" ? "goal" : "task"} />
      )}
    </SafeAreaView>
  );
}

export default DataList;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FAFAFA",
    paddingHorizontal: 16,
    borderRadius: 12,
    padding: 16,
    shadowColor: "#000",
    shadowOpacity: 0.04,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
});
