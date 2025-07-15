import { createContext, useReducer } from "react";
import Task from "../models/task";
import Goal from "../models/goal";
import {
  getTodayString,
  getNextDueDate,
  shouldShowRecurringTaskToday,
  getDisplayDateForRecurringTask,
} from "../util/task";

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
    repeat,
    dayOfWeek,
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
      repeat,
      dayOfWeek,
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
    repeat,
    dayOfWeek,
    startDate,
    endDate,
  }) => {},
  deleteRecurringTask: (taskId) => {},
  updateRecurringTask: (
    taskId,
    {
      title,
      duration,
      priority,
      description,
      goals,
      repeat,
      dayOfWeek,
      startDate,
      endDate,
    }
  ) => {},
  completeRecurringTask: (taskId, date) => {},
  deleteRecurringInstance: (taskId, date) => {},
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
    repeat,
    dayOfWeek,
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
      // Create recurring task with metadata
      const recurringTaskId = Math.random();
      const recurringTask = new Task({
        id: recurringTaskId,
        ...action.payload,
        isRecurring: true,
        repeat: action.payload.repeat || "daily",
        dayOfWeek: action.payload.dayOfWeek || null,
        startDate: action.payload.startDate,
        endDate: action.payload.endDate,
        completedDates: [],
      });

      // Update goals with the recurring task
      const updatedGoalsWithRecurringTask = state.goals.map((goal) => {
        if (recurringTask.goals && recurringTask.goals.includes(goal.id)) {
          return { ...goal, tasks: [...(goal.tasks || []), recurringTask.id] };
        }
        return goal;
      });

      return {
        ...state,
        tasks: [recurringTask, ...state.tasks],
        goals: updatedGoalsWithRecurringTask,
      };
    case "DELETE_RECURRING_TASK":
      // Delete the recurring task completely
      const tasksAfterRecurringDelete = state.tasks.filter(
        (task) => task.id !== action.payload
      );

      const updatedGoalsAfterRecurringDelete = state.goals.map((goal) => ({
        ...goal,
        tasks: (goal.tasks || []).filter((taskId) => taskId !== action.payload),
      }));

      return {
        ...state,
        tasks: tasksAfterRecurringDelete,
        goals: updatedGoalsAfterRecurringDelete,
      };
    case "UPDATE_RECURRING_TASK":
      // Update the recurring task metadata
      const recurringTaskIndex = state.tasks.findIndex(
        (task) => task.id === action.payload.taskId
      );

      if (recurringTaskIndex === -1) return state;

      const taskToUpdate = state.tasks[recurringTaskIndex];
      const updatedRecurringTask = {
        ...taskToUpdate,
        ...action.payload.data,
        isRecurring: true, // Ensure it remains recurring
      };

      const updatedTasks = [...state.tasks];
      updatedTasks[recurringTaskIndex] = updatedRecurringTask;

      return {
        ...state,
        tasks: updatedTasks,
      };
    case "COMPLETE_RECURRING_TASK":
      // Mark a specific date as completed
      const taskToCompleteIndex = state.tasks.findIndex(
        (task) => task.id === action.payload.taskId
      );

      if (taskToCompleteIndex === -1) return state;

      const taskToComplete = state.tasks[taskToCompleteIndex];
      const updatedCompletedDates = [...taskToComplete.completedDates];

      if (!updatedCompletedDates.includes(action.payload.date)) {
        updatedCompletedDates.push(action.payload.date);
      }

      const completedTask = {
        ...taskToComplete,
        completedDates: updatedCompletedDates,
      };

      const updatedTasksAfterComplete = [...state.tasks];
      updatedTasksAfterComplete[taskToCompleteIndex] = completedTask;

      return {
        ...state,
        tasks: updatedTasksAfterComplete,
      };
    case "DELETE_RECURRING_INSTANCE":
      // Delete a specific instance (date) from the recurring task
      const taskToDeleteInstanceIndex = state.tasks.findIndex(
        (task) => task.id === action.payload.taskId
      );

      if (taskToDeleteInstanceIndex === -1) return state;

      const taskToDeleteInstance = state.tasks[taskToDeleteInstanceIndex];
      const updatedCompletedDatesAfterDelete =
        taskToDeleteInstance.completedDates.filter(
          (date) => date !== action.payload.date
        );

      const taskAfterInstanceDelete = {
        ...taskToDeleteInstance,
        completedDates: updatedCompletedDatesAfterDelete,
      };

      const updatedTasksAfterInstanceDelete = [...state.tasks];
      updatedTasksAfterInstanceDelete[taskToDeleteInstanceIndex] =
        taskAfterInstanceDelete;

      return {
        ...state,
        tasks: updatedTasksAfterInstanceDelete,
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

      // Handle recurring task completion tracking
      if (updatableTask.isRecurring) {
        const today = getTodayString();

        if (action.payload.data.status === "done") {
          // When status becomes "done", add today to completed dates
          if (!updatedTaskItem.completedDates.includes(today)) {
            updatedTaskItem.completedDates = [
              ...updatedTaskItem.completedDates,
              today,
            ];
          }
        } else if (
          updatableTask.status === "done" &&
          action.payload.data.status !== "done"
        ) {
          // When status changes from "done" to something else, remove today from completed dates
          updatedTaskItem.completedDates =
            updatedTaskItem.completedDates.filter((date) => date !== today);
        }
      }

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

      const updatedTasksForGoal = state.tasks.map((task) => {
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
      return { ...state, goals: updatableGoals, tasks: updatedTasksForGoal };
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

  function deleteRecurringTask(taskId) {
    dispatch({ type: "DELETE_RECURRING_TASK", payload: taskId });
  }

  function updateRecurringTask(taskId, recurringTaskData) {
    dispatch({
      type: "UPDATE_RECURRING_TASK",
      payload: { taskId, data: recurringTaskData },
    });
  }

  function completeRecurringTask(taskId, date) {
    dispatch({
      type: "COMPLETE_RECURRING_TASK",
      payload: { taskId, date },
    });
  }

  function deleteRecurringInstance(taskId, date) {
    dispatch({
      type: "DELETE_RECURRING_INSTANCE",
      payload: { taskId, date },
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
    // Only update regular tasks during editing, not recurring tasks
    if (editingTaskData.id && !editingTaskData.isRecurring) {
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

  // Helper function to get tasks for display (including recurring tasks)
  function getDisplayTasks() {
    return state.tasks
      .map((task) => {
        if (task.isRecurring) {
          const displayDate = getDisplayDateForRecurringTask(task);
          return {
            ...task,
            date: displayDate,
            // Only show if there's a due date today
            shouldShow: shouldShowRecurringTaskToday(task),
          };
        }
        return {
          ...task,
          shouldShow: true,
        };
      })
      .filter((task) => task.shouldShow);
  }

  const value = {
    tasks: getDisplayTasks(),
    allTasks: state.tasks, // For internal use
    addTask,
    setTasks,
    deleteTask,
    updateTask,
    addRecurringTask,
    deleteRecurringTask,
    updateRecurringTask,
    completeRecurringTask,
    deleteRecurringInstance,
    getNextDueDate: (task) => getNextDueDate(task),
    shouldShowRecurringTaskToday: (task) => shouldShowRecurringTaskToday(task),
    getDisplayDateForRecurringTask: (task) =>
      getDisplayDateForRecurringTask(task),
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
