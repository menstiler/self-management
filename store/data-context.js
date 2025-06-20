import { createContext, useReducer } from "react";
import Task from "../models/task";
import Goal from "../models/goal";

export const DataContext = createContext({
  tasks: [],
  addTask: ({ title, date, duration, priority, description }) => {},
  setTasks: (tasks) => {},
  deleteTask: (id) => {},
  updateTask: (id, { title, date, duration, priority, description }) => {},
  goals: [],
  addGoal: ({ id, title, description, deadline, progress }) => {},
  setGoals: (goals) => {},
  deleteGoal: (id) => {},
  updateGoal: (id, { title, description, deadline, progress }) => {},
});

function dataReducer(state, action) {
  switch (action.type) {
    case "ADD_TASK":
      // TODO use id from db
      const taskId = Math.random();
      const task = new Task({ taskId, ...action.payload });
      return { ...state, tasks: [task, ...state.tasks] };
    case "SET_TASKS":
      const tasks = action.payload.map((task) => new Task(task));
      return { ...state, tasks };
    case "UPDATE_TASK":
      const updatableTaskIndex = state.tasks.findIndex(
        (task) => task.id === action.payload.id
      );
      const updatableTask = state.tasks[updatableTaskIndex];
      const updatedTaskItem = { ...updatableTask, ...action.payload.data };
      const updatableTasks = [...state.tasks];
      updatableTasks[updatableTaskIndex] = updatedTaskItem;
      return { ...state, tasks: updatableTasks };
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
      const updatableGoal = state[updatableGoalIndex];
      const updatedGoalItem = { ...updatableGoal, ...action.payload.data };
      const updatableGoals = [...state.goals];
      updatableGoals[updatableGoalIndex] = updatedGoalItem;
      return { ...state, goals: updatableGoals };
    case "DELETE_GOAL":
      const updatedGoalsAfterDelete = state.goals.filter(
        (goal) => goal.id !== action.payload
      );
      return { ...state, goals: updatedGoalsAfterDelete };
    default:
      return state;
  }
}

function DataContextProvider({ children }) {
  const [state, dispatch] = useReducer(dataReducer, { tasks: [], goals: [] });

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
    dispatch({ type: "SET_GOALS", payload: tasks });
  }

  function deleteGoal(id) {
    dispatch({ type: "DELETE_GOAL", payload: id });
  }

  function updateGoal(id, goalData) {
    dispatch({ type: "UPDATE_GOAL", payload: { id, data: goalData } });
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
    updateGoal,
  };

  return <DataContext.Provider value={value}>{children}</DataContext.Provider>;
}

export default DataContextProvider;
