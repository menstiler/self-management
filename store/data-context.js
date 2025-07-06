import { createContext, useReducer } from "react";
import Task from "../models/task";
import Goal from "../models/goal";

export const DataContext = createContext({
  tasks: [],
  addTask: ({ title, date, duration, priority, description, goals }) => {},
  setTasks: (tasks) => {},
  deleteTask: (id) => {},
  updateTask: (
    id,
    { title, date, duration, priority, description, goals }
  ) => {},
  goals: [],
  addGoal: ({
    id,
    title,
    description,
    deadline,
    progress,
    tasks,
    trackTaskStatus,
  }) => {},
  setGoals: (goals) => {},
  deleteGoal: (id) => {},
  deleteGoalWithTasks: (id) => {},
  updateGoal: (
    id,
    { title, description, deadline, status, progress, tasks, trackTaskStatus }
  ) => {},
  editingTask: {},
  editingGoal: {},
  updateEditingTask: ({
    title,
    date,
    duration,
    priority,
    description,
    status,
    trackTaskStatus,
    goals,
  }) => {},
  updateEditingGoal: ({
    title,
    deadline,
    progress,
    description,
    status,
    tasks,
    trackTaskStatus,
  }) => {},
});

function dataReducer(state, action) {
  switch (action.type) {
    case "ADD_TASK":
      // TODO use id from db
      const taskId = Math.random();
      const task = new Task({ id: taskId, ...action.payload });

      const updatedGoalsWithNewTask = state.goals.map((goal) =>
        task.goals && task.goals.includes(goal.id)
          ? { ...goal, tasks: [...(goal.tasks || []), task.id] }
          : goal
      );

      return {
        ...state,
        tasks: [task, ...state.tasks],
        goals: updatedGoalsWithNewTask,
      };
    case "SET_TASKS":
      const tasks = action.payload.map((task) => new Task(task));
      return { ...state, tasks };
    case "UPDATE_TASK":
      const updatableTaskIndex = state.tasks.findIndex(
        (task) => task.id === action.payload.id
      );
      const updatableTask = state.tasks[updatableTaskIndex];
      const updatedTaskItem = { ...updatableTask, ...action.payload.data };

      const oldGoalIds = new Set(updatableTask.goals || []);
      const newGoalIds = new Set(updatedTaskItem.goals || []);

      const updatedGoals = state.goals.map((goal) => {
        if (newGoalIds.has(goal.id) && !oldGoalIds.has(goal.id)) {
          return {
            ...goal,
            tasks: [...(goal.tasks || []), updatableTask.id],
          };
        }

        if (!newGoalIds.has(goal.id) && oldGoalIds.has(goal.id)) {
          return {
            ...goal,
            tasks: (goal.tasks || []).filter(
              (taskId) => taskId !== updatableTask.id
            ),
          };
        }

        return goal;
      });

      const updatableTasks = [...state.tasks];
      updatableTasks[updatableTaskIndex] = updatedTaskItem;
      return { ...state, tasks: updatableTasks, goals: updatedGoals };
    case "DELETE_TASK":
      const updatedTasksAfterDelete = state.tasks.filter(
        (task) => task.id !== action.payload
      );
      return { ...state, tasks: updatedTasksAfterDelete };
    case "ADD_GOAL":
      // TODO use id from db
      const goalId = Math.random();
      const goal = new Goal({ goalId, ...action.payload });
      return { ...state, goals: [goal, ...state.goals] };
    case "SET_GOALS":
      const goals = action.payload.map((goal) => new Goal(goal));
      return { ...state, goals };
    case "UPDATE_GOAL":
      const updatableGoalIndex = state.goals.findIndex(
        (goal) => goal.id === action.payload.id
      );
      const updatableGoal = state.goals[updatableGoalIndex];
      const updatedGoalItem = { ...updatableGoal, ...action.payload.data };

      const oldTaskIds = new Set(updatableGoal.tasks || []);
      const newTaskIds = new Set(updatedGoalItem.tasks || []);

      const updatedTasks = state.tasks.map((task) => {
        if (newTaskIds.has(task.id) && !oldTaskIds.has(task.id)) {
          return { ...task, goals: [...(task.goals || []), updatableGoal.id] };
        }

        if (!newTaskIds.has(task.id) && oldTaskIds.has(task.id)) {
          return {
            ...task,
            goals: (task.goals || []).filter(
              (goalId) => goalId !== updatableGoal.id
            ),
          };
        }

        return task;
      });

      const updatableGoals = [...state.goals];
      updatableGoals[updatableGoalIndex] = updatedGoalItem;
      return { ...state, goals: updatableGoals, tasks: updatedTasks };
    case "DELETE_GOAL":
      const updatedGoalsAfterDelete = state.goals.filter(
        (goal) => goal.id !== action.payload
      );

      const updatedTasksAfterGoalDelete = state.tasks.map((task) => ({
        ...task,
        goals: (task.goals || []).filter((goalId) => goalId !== action.payload),
      }));

      return {
        ...state,
        goals: updatedGoalsAfterDelete,
        tasks: updatedTasksAfterGoalDelete,
      };
    case "UPDATE_EDITING_TASK":
      return { ...state, editingTask: action.payload };
    case "UPDATE_EDITING_GOAL":
      return { ...state, editingGoal: action.payload };
    case "DELETE_GOAL_WITH_TASKS":
      const updatedGoalsAfterDeleteWithTasks = state.goals.filter(
        (goal) => goal.id !== action.payload
      );

      const tasksToDelete = state.tasks
        .filter(
          (task) =>
            Array.isArray(task.goals) &&
            task.goals.length === 1 &&
            task.goals[0] === action.payload
        )
        .map((task) => task.id);

      const updatedTasksAfterGoalDeleteWithTasks = state.tasks
        .filter((task) => !tasksToDelete.includes(task.id))
        .map((task) => ({
          ...task,
          goals: (task.goals || []).filter(
            (goalId) => goalId !== action.payload
          ),
        }));

      return {
        ...state,
        goals: updatedGoalsAfterDeleteWithTasks,
        tasks: updatedTasksAfterGoalDeleteWithTasks,
      };
    default:
      return state;
  }
}

function DataContextProvider({ children }) {
  const [state, dispatch] = useReducer(dataReducer, {
    tasks: [],
    goals: [],
    editingTask: {},
    editingGoal: {},
  });

  function addTask(taskData) {
    dispatch({ type: "ADD_TASK", payload: taskData });
  }

  function setTasks(tasks) {
    dispatch({ type: "SET_TASKS", payload: tasks });
  }

  function deleteTask(id) {
    dispatch({ type: "DELETE_TASK", payload: id });
  }

  function updateTask(id, taskData) {
    dispatch({ type: "UPDATE_TASK", payload: { id, data: taskData } });
  }

  function addGoal(goalData) {
    dispatch({ type: "ADD_GOAL", payload: goalData });
  }

  function setGoals(goals) {
    dispatch({ type: "SET_GOALS", payload: goals });
  }

  function deleteGoal(id) {
    dispatch({ type: "DELETE_GOAL", payload: id });
  }

  function updateGoal(id, goalData) {
    dispatch({ type: "UPDATE_GOAL", payload: { id, data: goalData } });
  }

  function updateEditingTask(editingTaskData) {
    dispatch({
      type: "UPDATE_EDITING_TASK",
      payload: editingTaskData,
    });
  }

  function updateEditingGoal(editingGoalData) {
    dispatch({
      type: "UPDATE_EDITING_GOAL",
      payload: editingGoalData,
    });
  }

  function deleteGoalWithTasks(id) {
    dispatch({
      type: "DELETE_GOAL_WITH_TASKS",
      payload: id,
    });
  }

  const value = {
    tasks: state.tasks,
    addTask,
    setTasks,
    deleteTask,
    updateTask,
    goals: state.goals,
    addGoal,
    setGoals,
    deleteGoal,
    deleteGoalWithTasks,
    updateGoal,
    editingTask: state.editingTask,
    editingGoal: state.editingGoal,
    updateEditingTask,
    updateEditingGoal,
  };

  return <DataContext.Provider value={value}>{children}</DataContext.Provider>;
}

export default DataContextProvider;
