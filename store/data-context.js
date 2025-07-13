import { createContext, useReducer } from "react";
import Task from "../models/task";
import Goal from "../models/goal";

// Helper function to generate dates between start and end date
function generateDateRange(startDate, endDate) {
  const dates = [];
  const currentDate = new Date(startDate);
  const end = new Date(endDate);

  while (currentDate <= end) {
    dates.push(new Date(currentDate));
    currentDate.setDate(currentDate.getDate() + 1);
  }
  return dates;
}

// Helper function to create recurring task instances
function createRecurringTaskInstances(parentTask, startDate, endDate) {
  const dates = generateDateRange(startDate, endDate);
  return dates.map((date) => {
    const taskId = Math.random();
    return new Task({
      id: taskId,
      title: parentTask.title,
      duration: parentTask.duration,
      description: parentTask.description,
      priority: parentTask.priority,
      status: parentTask.status,
      goals: parentTask.goals,
      date: date.toISOString().split("T")[0], // Format as YYYY-MM-DD
      parentTaskId: parentTask.id,
      isRecurring: false, // This is an instance, not the parent
    });
  });
}

// Helper function to get recurring task instances for a specific date
function getRecurringTasksForDate(tasks, targetDate) {
  return tasks.filter((task) => task.parentTaskId && task.date === targetDate);
}

// Helper function to get parent recurring tasks
function getParentRecurringTasks(tasks) {
  return tasks.filter((task) => task.isRecurring);
}

export const DataContext = createContext({
  tasks: [],
  addTask: ({
    title,
    date,
    duration,
    priority,
    description,
    goals,
    isRecurring,
    startDate,
    endDate,
  }) => {},
  setTasks: (tasks) => {},
  deleteTask: (id) => {},
  updateTask: (
    id,
    {
      title,
      date,
      duration,
      priority,
      description,
      goals,
      isRecurring,
      startDate,
      endDate,
    }
  ) => {},
  addRecurringTask: ({
    title,
    duration,
    priority,
    description,
    goals,
    startDate,
    endDate,
  }) => {},
  deleteRecurringTask: (parentTaskId) => {},
  updateRecurringTask: (
    parentTaskId,
    { title, duration, priority, description, goals, startDate, endDate }
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
    isRecurring,
    startDate,
    endDate,
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
    case "ADD_RECURRING_TASK":
      // Create parent recurring task
      const parentTaskId = Math.random();
      const parentTask = new Task({
        id: parentTaskId,
        ...action.payload,
        isRecurring: true,
        startDate: action.payload.startDate,
        endDate: action.payload.endDate,
      });

      // Create daily instances
      const recurringInstances = createRecurringTaskInstances(
        parentTask,
        action.payload.startDate,
        action.payload.endDate
      );

      // Update goals with all new task instances
      const updatedGoalsWithRecurringTasks = state.goals.map((goal) => {
        if (parentTask.goals && parentTask.goals.includes(goal.id)) {
          const allTaskIds = [
            parentTask.id,
            ...recurringInstances.map((task) => task.id),
          ];
          return { ...goal, tasks: [...(goal.tasks || []), ...allTaskIds] };
        }
        return goal;
      });

      return {
        ...state,
        tasks: [parentTask, ...recurringInstances, ...state.tasks],
        goals: updatedGoalsWithRecurringTasks,
      };
    case "DELETE_RECURRING_TASK":
      // Delete parent task and all its instances
      const tasksAfterRecurringDelete = state.tasks.filter(
        (task) =>
          task.id !== action.payload && task.parentTaskId !== action.payload
      );

      const updatedGoalsAfterRecurringDelete = state.goals.map((goal) => ({
        ...goal,
        tasks: (goal.tasks || []).filter(
          (taskId) =>
            taskId !== action.payload &&
            !state.tasks.find(
              (task) =>
                task.id === taskId && task.parentTaskId === action.payload
            )
        ),
      }));

      return {
        ...state,
        tasks: tasksAfterRecurringDelete,
        goals: updatedGoalsAfterRecurringDelete,
      };
    case "UPDATE_RECURRING_TASK":
      console.log("UPDATE_RECURRING_TASK reducer called");
      console.log("action.payload:", action.payload);

      // Find parent task
      const parentTaskIndex = state.tasks.findIndex(
        (task) => task.id === action.payload.parentTaskId
      );

      console.log("parentTaskIndex:", parentTaskIndex);

      if (parentTaskIndex === -1) {
        console.log("Parent task not found, returning state");
        return state;
      }

      const parentTaskToUpdate = state.tasks[parentTaskIndex];
      console.log("parentTaskToUpdate:", parentTaskToUpdate);

      const updatedParentTask = {
        ...parentTaskToUpdate,
        ...action.payload.data,
        isRecurring: true, // Ensure parent remains recurring
      };

      console.log("updatedParentTask:", updatedParentTask);

      // Delete old instances
      const tasksWithoutOldInstances = state.tasks.filter(
        (task) => task.parentTaskId !== action.payload.parentTaskId
      );

      console.log(
        "tasksWithoutOldInstances count:",
        tasksWithoutOldInstances.length
      );

      // Create new instances
      const newRecurringInstances = createRecurringTaskInstances(
        updatedParentTask,
        action.payload.data.startDate,
        action.payload.data.endDate
      );

      console.log("newRecurringInstances count:", newRecurringInstances.length);

      // Update parent task
      const updatedTasksWithNewParent = [...tasksWithoutOldInstances];
      updatedTasksWithNewParent[parentTaskIndex] = updatedParentTask;

      const finalTasks = [
        updatedParentTask,
        ...newRecurringInstances,
        ...tasksWithoutOldInstances.filter(
          (task) => task.id !== updatedParentTask.id
        ),
      ];

      console.log("finalTasks count:", finalTasks.length);

      return {
        ...state,
        tasks: finalTasks,
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

      const updatedGoalsAfterTaskDelete = state.goals.map((goal) => ({
        ...goal,
        tasks: (goal.tasks || []).filter((taskId) => taskId !== action.payload),
      }));

      return {
        ...state,
        tasks: updatedTasksAfterDelete,
        goals: updatedGoalsAfterTaskDelete,
      };
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

  function addRecurringTask(recurringTaskData) {
    dispatch({ type: "ADD_RECURRING_TASK", payload: recurringTaskData });
  }

  function deleteRecurringTask(parentTaskId) {
    dispatch({ type: "DELETE_RECURRING_TASK", payload: parentTaskId });
  }

  function updateRecurringTask(parentTaskId, recurringTaskData) {
    console.log("updateRecurringTask called");
    console.log("parentTaskId:", parentTaskId);
    console.log("recurringTaskData:", recurringTaskData);
    dispatch({
      type: "UPDATE_RECURRING_TASK",
      payload: { parentTaskId, data: recurringTaskData },
    });
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
    if (editingTaskData.id) {
      updateTask(editingTaskData.id, editingTaskData);
    }
  }

  function updateEditingGoal(editingGoalData) {
    dispatch({
      type: "UPDATE_EDITING_GOAL",
      payload: editingGoalData,
    });
    if (editingGoalData.id) {
      updateGoal(editingGoalData.id, editingGoalData);
    }
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
    addRecurringTask,
    deleteRecurringTask,
    updateRecurringTask,
    getRecurringTasksForDate: (targetDate) =>
      getRecurringTasksForDate(state.tasks, targetDate),
    getParentRecurringTasks: () => getParentRecurringTasks(state.tasks),
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
