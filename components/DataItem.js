import { Pressable, View, Text, StyleSheet } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { capitalizeWords } from "../util/task.js";
import CircularProgress from "react-native-circular-progress-indicator";
import { useGoalMeta } from "../hooks/useGoalMeta";
import { Ionicons } from "@expo/vector-icons";

function DataItem({ data, item }) {
  const navigation = useNavigation();

  function selectItemHandler(id) {
    const screen = data === "goal" ? "GoalDetail" : "TaskDetail";
    const screenId = data === "goal" ? "goalId" : "taskId";

    navigation.navigate(screen, {
      [screenId]: id,
    });
  }

  const { progress, status, goalTasks, completedTasks } =
    data === "goal"
      ? useGoalMeta(item)
      : {
          progress: null,
          status: item.status,
          goalTasks: [],
          completedTasks: null,
        };

  return (
    <Pressable onPress={() => selectItemHandler(item.id)}>
      <View style={styles.topRow}>
        <View style={styles.titleWrapper}>
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
            }}
          >
            <Text style={styles.goalTitle}>{item.title}</Text>
            {/* Recurring icon for tasks */}
            {data === "task" && item.isRecurring && (
              <Ionicons
                name="repeat"
                size={16}
                color="#9C27B0"
                style={styles.recurringIcon}
              />
            )}
          </View>
          <Text style={styles.goalProgressText}>{capitalizeWords(status)}</Text>
          {data === "goal" && (
            <Text>
              {goalTasks.length > 0
                ? `${completedTasks} of ${goalTasks.length} completed.`
                : `No tasks completed`}
            </Text>
          )}
        </View>
        {/* Priority badge for tasks at top right */}
        {data === "task" && item.priority && (
          <View
            style={[
              styles.priorityBadge,
              styles[`priority${item.priority}`],
              styles.priorityTopRight,
            ]}
          >
            <Text style={styles.priorityText}>{item.priority}</Text>
          </View>
        )}
        {data === "goal" && (
          <CircularProgress
            value={progress}
            radius={35}
            activeStrokeColor="#4CAF50"
            inActiveStrokeColor="#E0E0E0"
            inActiveStrokeWidth={8}
            activeStrokeWidth={8}
            progressValueColor="#333"
            maxValue={100}
            showProgressValue={false}
            title={`${progress.toFixed(0)}%`}
            titleFontSize={16}
            titleColor="black"
            titleStyle={{ fontWeight: "bold" }}
          />
        )}
      </View>
    </Pressable>
  );
}

export default DataItem;

const styles = StyleSheet.create({
  topRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 6,
  },
  titleWrapper: {
    width: "75%",
    marginRight: 12,
  },
  goalTitle: {
    fontSize: 16,
    fontWeight: "500",
    marginBottom: 8,
    color: "#333",
  },
  goalProgressText: {
    fontSize: 13,
    color: "#666",
    marginBottom: 6,
  },
  progressBar: {
    height: 6,
    borderRadius: 3,
  },
  recurringIcon: {
    fontSize: 16,
    marginLeft: 6,
    marginBottom: 8,
    color: "#9C27B0",
  },
  priorityBadge: {
    marginLeft: 8,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 6,
    alignItems: "center",
    justifyContent: "center",
  },
  priorityhigh: {
    backgroundColor: "#FFEBEE",
  },
  prioritymedium: {
    backgroundColor: "#FFF3E0",
  },
  prioritylow: {
    backgroundColor: "#E8F5E9",
  },
  priorityText: {
    fontSize: 12,
    fontWeight: "600",
    textTransform: "uppercase",
    color: "#C62828", // red for high
  },
  priorityTopRight: {
    position: "absolute",
    top: 0,
    right: 0,
    zIndex: 1,
  },
});
