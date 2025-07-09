export function calculateGoalProgress(goalTasks) {
  if (goalTasks.length === 0) return 0;
  const completed = goalTasks.filter((task) => task.status === "done").length;
  return (completed / goalTasks.length) * 100;
}

export function calculateGoalStatus(goalTasks) {
  const anyTaskInProgressOrDone = goalTasks.some(
    (task) => task.status === "in progress" || task.status === "done"
  );
  const allTasksComplete =
    goalTasks.length > 0 && goalTasks.every((task) => task.status === "done");

  if (allTasksComplete) return "done";
  if (anyTaskInProgressOrDone) return "in progress";
  return "not started";
}
