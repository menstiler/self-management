import { createContext, useReducer } from "react";
import Task from "../models/task";

export const TasksContext = createContext({
  tasks: [],
  addTask: ({ title, date, duration, priority, description }) => {},
  setTasks: (tasks) => {},
  deleteTask: (id) => {},
  updateTask: (id, { title, date, duration, priority, description }) => {},
});

function tasksReducer(state, action) {
  switch (action.type) {
    case "ADD":
      // TODO use id from db
      const id = Math.random();
      const task = new Task({ id, ...action.payload });
      return [task, ...state];
    case "SET":
      const tasks = action.payload.map((task) => new Task(task));
      return tasks;
    case "UPDATE":
      const updatableTaskIndex = state.findIndex(
        (task) => task.id === action.payload.id
      );
      const updatableTask = state[updatableTaskIndex];
      const updatedItem = { ...updatableTask, ...action.payload.data };
      const updatableTasks = [...state];
      updatableTasks[updatableTaskIndex] = updatedItem;
      return updatableTasks;
    case "DELETE":
      return state.filter((task) => task.id !== action.payload);
    default:
      return state;
  }
}

function TasksContextProvider({ children }) {
  const [tasksState, dispatch] = useReducer(tasksReducer, []);

  function addTask(taskData) {
    dispatch({ type: "ADD", payload: taskData });
  }

  function setTasks(tasks) {
    dispatch({ type: "SET", payload: tasks });
  }

  function deleteTask(id) {
    dispatch({ type: "DELETE", payload: id });
  }

  function updateTask(id, taskData) {
    dispatch({ type: "UPDATE", payload: { id, data: taskData } });
  }

  const value = {
    tasks: tasksState,
    addTask,
    setTasks,
    deleteTask,
    updateTask,
  };

  return (
    <TasksContext.Provider value={value}>{children}</TasksContext.Provider>
  );
}

export default TasksContextProvider;
