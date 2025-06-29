import { useContext } from "react";
import { FlatList } from "react-native";
import DataItem from "./DataItem.js";
import { DataContext } from "../store/data-context.js";

function AllGoals() {
  const { goals } = useContext(DataContext);

  return (
    <FlatList
      data={goals}
      keyExtractor={(item) => item.id}
      renderItem={({ item }) => <DataItem data={item} />}
    />
  );
}

export default AllGoals;
