import { useContext, useState, useRef, useCallback } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  TouchableWithoutFeedback,
} from "react-native";
import DataItem from "./DataItem.js";
import { DataContext } from "../store/data-context.js";
import {
  sortTasksByTime,
  isSameDay,
  isSameWeek,
  hasDateInPastDays,
  capitalizeWords,
} from "../util/task.js";
import { SafeAreaView } from "react-native-safe-area-context";
import { SwipeListView } from "react-native-swipe-list-view";
import { useNavigation, useFocusEffect } from "@react-navigation/native";
import TaskFilter from "./TaskFilter.js";

function AllItems({ data }) {
  const [filterType, setFilterType] = useState(0);
  const [openRowKey, setOpenRowKey] = useState(null);
  const rowMapRef = useRef({});
  const dataCtx = useContext(DataContext);
  const navigation = useNavigation();

  useFocusEffect(
    useCallback(() => {
      return () => {
        if (openRowKey && rowMapRef.current[openRowKey]) {
          rowMapRef.current[openRowKey].closeRow();
          setOpenRowKey(null);
        }
      };
    }, [openRowKey])
  );

  const filteredTaskByDay = [...dataCtx.tasks].filter((task) => {
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

  const sortedData =
    data === "task" ? sortTasksByTime(filteredTaskByDay) : dataCtx.goals;

  function handleDelete(itemId) {
    const action = data === "goal" ? "deleteGoal" : "deleteTask";
    Alert.alert(
      `Delete ${capitalizeWords(data)}`,
      `Are you sure you want to delete this ${data}?`,
      [
        {
          text: "Cancel",
          onPress: () => {},
          style: "cancel",
        },
        {
          text: "OK",
          onPress: () => dataCtx[action](itemId),
          style: "destructive",
        },
      ],
      { cancelable: true }
    );
  }

  function handleEdit(itemId) {
    const screen = data === "goal" ? "GoalDetail" : "TaskDetail";
    const screenId = data === "goal" ? "goalId" : "taskId";

    navigation.navigate(screen, {
      [screenId]: itemId,
    });
  }

  return (
    <TouchableWithoutFeedback
      onPress={() => {
        if (openRowKey && rowMapRef.current[openRowKey]) {
          console.log(openRowKey);
          rowMapRef.current[openRowKey].closeRow();
          setOpenRowKey(null);
        }
      }}
    >
      <SafeAreaView
        style={styles.container}
        edges={["top"]}
      >
        <Text style={styles.header}>{`My ${capitalizeWords(data)}s`}</Text>
        {data === "task" && (
          <TaskFilter
            filterType={filterType}
            setFilterType={setFilterType}
          />
        )}

        <SwipeListView
          data={sortedData}
          keyExtractor={(item) => item.id}
          extraData={openRowKey}
          onRowOpen={(rowKey, rowMap) => {
            setOpenRowKey(rowKey);
            rowMapRef.current = rowMap;
          }}
          onRowClose={(rowKey) => {
            if (openRowKey === rowKey) setOpenRowKey(null);
          }}
          renderItem={({ item }) => (
            <View
              style={[
                styles.rowFront,
                openRowKey === item.id && styles.rowFrontOpen,
              ]}
            >
              <DataItem
                data={data}
                item={item}
              />
            </View>
          )}
          renderHiddenItem={({ item }) => (
            <View style={styles.rowBack}>
              <TouchableOpacity
                style={[styles.backButton, styles.editButton]}
                onPress={() => handleEdit(item.id)}
              >
                <Text style={styles.backText}>Edit</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.backButton, styles.deleteButton]}
                onPress={() => handleDelete(item.id)}
              >
                <Text style={styles.backText}>Delete</Text>
              </TouchableOpacity>
            </View>
          )}
          rightOpenValue={-150}
          disableRightSwipe
          ItemSeparatorComponent={() => <View style={styles.separator} />}
        />
      </SafeAreaView>
    </TouchableWithoutFeedback>
  );
}

export default AllItems;

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
  separator: {
    height: 12,
  },
  rowFront: {
    marginVertical: 4,
    borderRadius: 12,
    backgroundColor: "#FFFFFF",
    padding: 16,
    shadowColor: "#000",
    shadowOpacity: 0.04,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  rowFrontOpen: {
    borderTopRightRadius: 0,
    borderBottomRightRadius: 0,
  },
  rowBack: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "flex-end",
    alignItems: "center",
    marginVertical: 4,
    borderRadius: 12,
    overflow: "hidden",
  },
  backButton: {
    width: 75,
    height: "100%",
    justifyContent: "center",
    alignItems: "center",
  },
  editButton: {
    backgroundColor: "#A5B4FC",
  },
  deleteButton: {
    backgroundColor: "#EF4444",
    borderTopRightRadius: 12,
    borderBottomRightRadius: 12,
  },
  backText: {
    color: "#FFF",
    fontWeight: "600",
  },
});
