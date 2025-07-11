import { useContext, useState, useRef, useCallback } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
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
import { SwipeListView } from "react-native-swipe-list-view";
import { useFocusEffect } from "@react-navigation/native";
import TaskFilter from "./TaskFilter.js";
import { GlobalStyles } from "../constants/styles.js";
import DeleteModal from "./form/DeleteModal.js";

function AllItems({ data }) {
  const [filterType, setFilterType] = useState(0);
  const [itemToDelete, setItemToDelete] = useState({
    title: "",
    tasksToDelete: [],
  });
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [openRowKey, setOpenRowKey] = useState(null);
  const dataCtx = useContext(DataContext);
  const rowMapRef = useRef({});
  const lastSwipeDirectionRef = useRef({});

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

  function handleDelete(item) {
    if (data === "goal") {
      let tasksToDelete = [];
      const goalTasks = dataCtx.tasks.filter((task) =>
        (item.tasks || []).includes(task.id)
      );
      const uniqueGoalTasks = goalTasks.filter(
        (task) => task.goals.length === 1
      );

      if (uniqueGoalTasks.length > 0) {
        tasksToDelete = uniqueGoalTasks;
      }

      setItemToDelete({ ...item, tasksToDelete });
    } else {
      setItemToDelete(item);
    }
    setShowDeleteModal(true);
  }

  const statuses = ["not started", "in progress", "done"];

  function getNextStatus(current) {
    const idx = statuses.indexOf(current);
    return idx < statuses.length - 1 ? statuses[idx + 1] : statuses[idx];
  }

  function getPrevStatus(current) {
    const idx = statuses.indexOf(current);
    return idx > 0 ? statuses[idx - 1] : statuses[idx];
  }

  function updateTaskStatus(itemId, direction) {
    const task = dataCtx.tasks.find((t) => t.id === itemId);
    if (!task) return;
    const newStatus =
      direction === "left"
        ? getNextStatus(task.status)
        : getPrevStatus(task.status);

    dataCtx.updateTask(itemId, { ...task, status: newStatus });
  }

  function renderHiddenItem({ item }) {
    const nextStatus = getNextStatus(item.status);
    const prevStatus = getPrevStatus(item.status);
    const isInProgress =
      item.status === "in progress" ? styles.pastelGreen : null;

    if (data === "goal") {
      return (
        <View style={styles.rowBackGoal}>
          <TouchableOpacity
            style={[styles.backButton, styles.deleteButton]}
            onPress={() => handleDelete(item)}
          >
            <Text style={styles.deleteText}>Delete</Text>
          </TouchableOpacity>
        </View>
      );
    }

    return (
      <View style={styles.rowBack}>
        <View style={[styles.statusBox, styles.leftSwipe]}>
          <Text style={styles.statusText}>{capitalizeWords(prevStatus)}</Text>
        </View>

        <View style={[styles.statusBox, styles.rightSwipe, isInProgress]}>
          {item.status === "done" ? (
            <TouchableOpacity
              style={[styles.backButton, styles.deleteButton]}
              onPress={() => handleDelete(item)}
            >
              <Text style={styles.deleteText}>Delete</Text>
            </TouchableOpacity>
          ) : (
            <Text style={styles.statusText}>{capitalizeWords(nextStatus)}</Text>
          )}
        </View>
      </View>
    );
  }
  const today = new Date().toISOString().split("T")[0];
  const todaysRecurringTasks = dataCtx.getRecurringTasksForDate(today);

  return (
    <TouchableWithoutFeedback
      onPress={() => {
        if (openRowKey && rowMapRef.current[openRowKey]) {
          rowMapRef.current[openRowKey].closeRow();
          setOpenRowKey(null);
        }
      }}
    >
      <View>
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
            const direction = lastSwipeDirectionRef.current[rowKey];
            const task = sortedData.find((t) => t.id === rowKey);
            if (!task || !direction) return;

            if (data !== "goal") {
              if (direction === "left" && task.status !== "done") {
                updateTaskStatus(rowKey, "left");
                rowMap?.[rowKey]?.closeRow();
              } else if (direction === "right") {
                updateTaskStatus(rowKey, "right");
                rowMap?.[rowKey]?.closeRow();
              }
            }

            delete lastSwipeDirectionRef.current[rowKey];
            setOpenRowKey(rowKey);
            rowMapRef.current = rowMap;
          }}
          onRowClose={(rowKey) => {
            if (openRowKey === rowKey) setOpenRowKey(null);
            delete lastSwipeDirectionRef.current[rowKey];
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
          rightOpenValue={-100}
          leftOpenValue={100}
          onSwipeValueChange={({ key, value }) => {
            if (value <= -100) {
              lastSwipeDirectionRef.current[key] = "left";
            } else if (value >= 100) {
              lastSwipeDirectionRef.current[key] = "right";
            }
          }}
          disableRightSwipe={data === "goal"}
          renderHiddenItem={renderHiddenItem}
          ItemSeparatorComponent={() => <View style={styles.separator} />}
        />
        <DeleteModal
          visible={showDeleteModal}
          onClose={() => setShowDeleteModal(false)}
          onDelete={() => {
            const action = data === "goal" ? "deleteGoal" : "deleteTask";
            dataCtx[action](itemToDelete.id);
            setShowDeleteModal(false);
          }}
          onDeleteWithTasks={() => {
            dataCtx.deleteGoalWithTasks(itemToDelete.id);
            setShowDeleteModal(false);
          }}
          itemTitle={itemToDelete.title}
          itemType={data}
          tasksToDelete={itemToDelete.tasksToDelete}
        />
      </View>
    </TouchableWithoutFeedback>
  );
}

export default AllItems;

const styles = StyleSheet.create({
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
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#f0f0f0",
    borderRadius: 12,
    marginVertical: 4,
  },
  backButton: {
    width: 100,
    height: "100%",
    justifyContent: "center",
    alignItems: "center",
  },
  deleteButton: {
    backgroundColor: GlobalStyles.red800,
    borderTopRightRadius: 12,
    borderBottomRightRadius: 12,
  },
  deleteText: {
    color: "#FFF",
    fontWeight: "600",
    textAlign: "center",
  },
  statusBox: {
    width: 100,
    alignItems: "center",
    justifyContent: "center",
    height: "100%",
  },
  leftSwipe: {
    borderTopLeftRadius: 12,
    borderBottomLeftRadius: 12,
    backgroundColor: GlobalStyles.indigo600,
  },
  rightSwipe: {
    borderTopRightRadius: 12,
    borderBottomRightRadius: 12,
    backgroundColor: GlobalStyles.indigo500,
  },
  pastelGreen: {
    backgroundColor: GlobalStyles.pastelGreen,
  },
  rowBackGoal: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "flex-end",
    alignItems: "center",
    backgroundColor: "#f0f0f0",
    borderRadius: 12,
    marginVertical: 4,
  },
  middleDeleteButton: {
    backgroundColor: GlobalStyles.red500,
  },
});
