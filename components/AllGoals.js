import { useContext } from "react";
import { FlatList, StyleSheet, View, Text } from "react-native";
import DataItem from "./DataItem.js";
import { DataContext } from "../store/data-context.js";
import { SafeAreaView } from "react-native-safe-area-context";

function AllGoals() {
  const { goals } = useContext(DataContext);

  return (
    <SafeAreaView
      style={styles.container}
      edges={["top"]}
    >
      <Text style={styles.header}>My Goals</Text>
      <FlatList
        data={goals}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <DataItem
            item={item}
            data="goal"
          />
        )}
        ItemSeparatorComponent={() => <View style={styles.separator} />}
      />
    </SafeAreaView>
  );
}

export default AllGoals;

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
  header: {
    fontSize: 22,
    fontWeight: "600",
    marginBottom: 16,
    color: "#1A1A1A",
  },
  listContent: {
    paddingBottom: 24,
  },
  separator: {
    height: 12,
  },
});
