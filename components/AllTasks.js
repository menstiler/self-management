import { useContext, useState } from "react";
import { FlatList, View } from "react-native";
import DataItem from "./DataItem";
import { DataContext } from "../store/data-context.js";
import {
  sortTasksByTime,
  isSameDay,
  isSameWeek,
  hasDateInPastDays,
} from "../util/task";
import SegmentedControl from "@react-native-segmented-control/segmented-control";

function AllTasks() {
  const [filterType, setFilterType] = useState(0);
  const { tasks } = useContext(DataContext);

  const filteredTaskByDay = [...tasks].filter((task) => {
    switch (filterType) {
      case 1:
        return isSameDay(new Date(task.date), new Date());
      case 2:
        return isSameWeek(task.date);
      case 3:
        return hasDateInPastDays(task.date, 30);
      case 4:
        return hasDateInPastDays(task.date, 7);
      default:
        return task;
    }
  });

  const sortedTasks = sortTasksByTime(filteredTaskByDay);

  return (
    <>
      <View>
        <View>
          <SegmentedControl
            values={["All", "Today", "This Week", "This Month"]}
            selectedIndex={filterType}
            onChange={(event) => {
              setFilterType(event.nativeEvent.selectedSegmentIndex);
            }}
          />
        </View>
      </View>
      <FlatList
        data={sortedTasks}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <DataItem data={item} />}
      />
    </>
  );
}

export default AllTasks;
