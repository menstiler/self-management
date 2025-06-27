import { useContext } from "react";
import { FlatList } from "react-native";
import GoalItem from "./GoalItem";
import { DataContext } from "../store/data-context.js";

function AllGoals() {
  const { goals } = useContext(DataContext);

  return (
    <FlatList
      data={goals}
      keyExtractor={(item) => item.id}
      renderItem={({ item }) => <GoalItem goal={item} />}
    />
  );
}

export default AllGoals;
