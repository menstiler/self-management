import React, { useContext, useMemo } from "react";
import { View, Text, StyleSheet, ScrollView, Pressable } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useNavigation } from "@react-navigation/native";
import { DataContext } from "../store/data-context";
import { isSameDay, getTodayString } from "../util/task";

export default function Dashboard() {
  const dataCtx = useContext(DataContext);
  const navigation = useNavigation();

  const dashboardData = useMemo(() => {
    const today = new Date();

    // Get today's completed goals
    const goalsCompleted = dataCtx.goals.filter((goal) => {
      // Check if goal has trackTaskStatus enabled and all tasks are done
      if (goal.trackTaskStatus) {
        const goalTasks = dataCtx.allTasks.filter((task) =>
          (goal.tasks || []).includes(task.id)
        );
        return (
          goalTasks.length > 0 &&
          goalTasks.every((task) => task.status === "done")
        );
      }
      return false;
    });

    // Get today's completed tasks (including recurring tasks)
    const tasksCompleted = dataCtx.allTasks.filter((task) => {
      if (task.status !== "done") return false;
      return task;
    });

    // Calculate streaks
    const calculateStreak = (items, isCompletedFn) => {
      let currentStreak = 0;
      let longestStreak = 0;
      let tempStreak = 0;

      // Sort items by date (most recent first)
      const sortedItems = [...items].sort(
        (a, b) =>
          new Date(b.date || b.deadline) - new Date(a.date || a.deadline)
      );

      for (const item of sortedItems) {
        if (isCompletedFn(item)) {
          tempStreak++;
          if (tempStreak === 1) {
            currentStreak = tempStreak;
          }
        } else {
          if (tempStreak > longestStreak) {
            longestStreak = tempStreak;
          }
          tempStreak = 0;
        }
      }

      // Check if we have an ongoing streak
      if (tempStreak > longestStreak) {
        longestStreak = tempStreak;
      }

      return { currentStreak, longestStreak };
    };

    // Calculate task streaks
    const taskStreaks = calculateStreak(
      dataCtx.allTasks,
      (task) => task.status === "done"
    );

    // Calculate goal streaks (simplified - count goals with all tasks completed)
    const goalStreaks = calculateStreak(dataCtx.goals, (goal) => {
      if (!goal.trackTaskStatus) return false;
      const goalTasks = dataCtx.allTasks.filter((task) =>
        (goal.tasks || []).includes(task.id)
      );
      return (
        goalTasks.length > 0 &&
        goalTasks.every((task) => task.status === "done")
      );
    });

    // Get upcoming tasks (not completed, due today or in the next 7 days)
    const upcomingTasks = dataCtx.allTasks
      .filter((task) => {
        if (task.status === "done") return false;

        if (task.isRecurring) {
          // For recurring tasks, check if they should be shown today or in the next 7 days
          const nextDueDate = dataCtx.getNextDueDate(task);

          // For daily tasks, always show them if they're active and not completed today
          if (task.repeat === "daily") {
            const startDate = new Date(task.startDate);
            const endDate = new Date(task.endDate);
            const normalizedToday = new Date(
              today.getFullYear(),
              today.getMonth(),
              today.getDate()
            );
            const normalizedStartDate = new Date(
              startDate.getFullYear(),
              startDate.getMonth(),
              startDate.getDate()
            );
            const normalizedEndDate = new Date(
              endDate.getFullYear(),
              endDate.getMonth(),
              endDate.getDate()
            );

            // Check if today is within the task's date range and not completed
            const todayString = new Date().toISOString().split("T")[0];
            const isActive =
              normalizedToday >= normalizedStartDate &&
              normalizedToday <= normalizedEndDate;
            const isNotCompletedToday =
              !task.completedDates.includes(todayString);

            return isActive && isNotCompletedToday;
          }

          // If getNextDueDate returns null, try to show the task if it's active
          if (!nextDueDate) {
            // Check if the task is still active (within its date range)
            const startDate = new Date(task.startDate);
            const endDate = new Date(task.endDate);
            const normalizedToday = new Date(
              today.getFullYear(),
              today.getMonth(),
              today.getDate()
            );
            const normalizedStartDate = new Date(
              startDate.getFullYear(),
              startDate.getMonth(),
              startDate.getDate()
            );
            const normalizedEndDate = new Date(
              endDate.getFullYear(),
              endDate.getMonth(),
              endDate.getDate()
            );

            // Show if today is within the task's date range
            return (
              normalizedToday >= normalizedStartDate &&
              normalizedToday <= normalizedEndDate
            );
          }

          const taskDate = new Date(nextDueDate);
          const weekFromNow = new Date();
          weekFromNow.setDate(weekFromNow.getDate() + 7);

          // Normalize dates to compare only the date part (not time)
          const normalizedTaskDate = new Date(
            taskDate.getFullYear(),
            taskDate.getMonth(),
            taskDate.getDate()
          );
          const normalizedToday = new Date(
            today.getFullYear(),
            today.getMonth(),
            today.getDate()
          );
          const normalizedWeekFromNow = new Date(
            weekFromNow.getFullYear(),
            weekFromNow.getMonth(),
            weekFromNow.getDate()
          );

          return (
            normalizedTaskDate >= normalizedToday &&
            normalizedTaskDate <= normalizedWeekFromNow
          );
        } else {
          // For regular tasks
          const taskDate = new Date(task.date);
          const weekFromNow = new Date();
          weekFromNow.setDate(weekFromNow.getDate() + 7);

          // Normalize dates to compare only the date part (not time)
          const normalizedTaskDate = new Date(
            taskDate.getFullYear(),
            taskDate.getMonth(),
            taskDate.getDate()
          );
          const normalizedToday = new Date(
            today.getFullYear(),
            today.getMonth(),
            today.getDate()
          );
          const normalizedWeekFromNow = new Date(
            weekFromNow.getFullYear(),
            weekFromNow.getMonth(),
            weekFromNow.getDate()
          );

          return (
            normalizedTaskDate >= normalizedToday &&
            normalizedTaskDate <= normalizedWeekFromNow
          );
        }
      })
      .sort((a, b) => {
        // Sort by next due date for recurring tasks, or regular date for normal tasks
        const aDate = a.isRecurring
          ? new Date(dataCtx.getNextDueDate(a) || a.date)
          : new Date(a.date);
        const bDate = b.isRecurring
          ? new Date(dataCtx.getNextDueDate(b) || b.date)
          : new Date(b.date);
        return aDate - bDate;
      })
      .slice(0, 5); // Show top 5

    return {
      goalsCompleted: goalsCompleted.length,
      tasksCompleted: tasksCompleted.length,
      longestActiveStreak: Math.max(
        taskStreaks.longestStreak,
        goalStreaks.longestStreak
      ),
      currentStreak: Math.max(
        taskStreaks.currentStreak,
        goalStreaks.currentStreak
      ),
      upcomingTasks,
    };
  }, [dataCtx.goals, dataCtx.allTasks]);

  const StatCard = ({ title, value, subtitle }) => (
    <View style={styles.statCard}>
      <Text style={styles.statValue}>{value}</Text>
      <Text style={styles.statTitle}>{title}</Text>
      {subtitle && <Text style={styles.statSubtitle}>{subtitle}</Text>}
    </View>
  );

  const TaskItem = ({ task }) => {
    const displayDate = task.isRecurring
      ? dataCtx.getNextDueDate(task) || task.date
      : task.date;

    const handleTaskPress = () => {
      navigation.navigate("TaskDetail", {
        taskId: task.id,
      });
    };

    return (
      <Pressable
        onPress={handleTaskPress}
        style={styles.taskItem}
      >
        <View style={styles.taskInfo}>
          <Text style={styles.taskTitle}>{task.title}</Text>
          <Text style={styles.taskDate}>
            {new Date(displayDate).toLocaleDateString("en-US", {
              month: "short",
              day: "numeric",
              hour: "2-digit",
              minute: "2-digit",
            })}
            {task.isRecurring && <Text style={styles.recurringBadge}> 🔄</Text>}
          </Text>
        </View>
        <View
          style={[styles.priorityBadge, styles[`priority${task.priority}`]]}
        >
          <Text style={styles.priorityText}>{task.priority}</Text>
        </View>
      </Pressable>
    );
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView style={styles.container}>
        <Text style={styles.header}>Today's Overview</Text>

        <View style={styles.statsGrid}>
          <StatCard
            title="Goals Completed"
            value={dashboardData.goalsCompleted}
            subtitle=""
          />
          <StatCard
            title="Tasks Completed"
            value={dashboardData.tasksCompleted}
            subtitle=""
          />
          <StatCard
            title="Longest Active Streak"
            value={dashboardData.longestActiveStreak}
            subtitle=""
          />
          <StatCard
            title="Current Streak"
            value={dashboardData.currentStreak}
            subtitle=""
          />
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Upcoming Tasks</Text>
          {dashboardData.upcomingTasks.length > 0 ? (
            dashboardData.upcomingTasks.map((task) => (
              <TaskItem
                key={task.id}
                task={task}
              />
            ))
          ) : (
            <Text style={styles.emptyText}>No upcoming tasks</Text>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#F8F9FA",
  },
  container: {
    flex: 1,
    backgroundColor: "#F8F9FA",
    padding: 20,
  },
  header: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#1A1A1A",
    marginBottom: 20,
  },
  statsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    marginBottom: 30,
  },
  statCard: {
    backgroundColor: "white",
    borderRadius: 12,
    padding: 16,
    width: "48%",
    marginBottom: 12,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  statValue: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#4CAF50",
    marginBottom: 4,
  },
  statTitle: {
    fontSize: 14,
    fontWeight: "600",
    color: "#1A1A1A",
    marginBottom: 2,
  },
  statSubtitle: {
    fontSize: 12,
    color: "#666",
  },
  section: {
    backgroundColor: "white",
    borderRadius: 12,
    padding: 20,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#1A1A1A",
    marginBottom: 16,
  },
  taskItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#F0F0F0",
  },
  taskInfo: {
    flex: 1,
  },
  taskTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#1A1A1A",
    marginBottom: 4,
  },
  taskDate: {
    fontSize: 14,
    color: "#666",
  },
  priorityBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  priorityhigh: {
    backgroundColor: "#FFEBEE",
  },
  prioritymedium: {
    backgroundColor: "#FFF3E0",
  },
  prioritylow: {
    backgroundColor: "#E8F5E8",
  },
  priorityText: {
    fontSize: 12,
    fontWeight: "600",
    textTransform: "uppercase",
  },
  recurringBadge: {
    fontSize: 12,
    color: "#9C27B0",
  },
  emptyText: {
    fontSize: 16,
    color: "#666",
    textAlign: "center",
    fontStyle: "italic",
  },
});
