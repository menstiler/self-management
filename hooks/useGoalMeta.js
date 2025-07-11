import { useContext, useMemo } from "react";
import { DataContext } from "../store/data-context";
import { calculateGoalProgress, calculateGoalStatus } from "../util/goalUtils";

export function useGoalMeta(goal) {
  const { tasks } = useContext(DataContext);

  const goalTasks = useMemo(
    () => tasks.filter((task) => (goal.tasks || []).includes(task.id)),
    [tasks, goal.tasks]
  );

  const progress = useMemo(() => calculateGoalProgress(goalTasks), [goalTasks]);
  const status = useMemo(() => calculateGoalStatus(goalTasks), [goalTasks]);

  const completedTasks = useMemo(
    () => goalTasks.filter((task) => task.status === "done").length,
    [(tasks, goalTasks)]
  );

  const uniqueGoalTasks = useMemo(
    () => goalTasks.filter((task) => task.goals.length === 1),
    [(tasks, goalTasks)]
  );

  return { progress, status, goalTasks, completedTasks, uniqueGoalTasks };
}
