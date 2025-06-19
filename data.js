export const TASKS = [
  {
    id: "1",
    title: "clean room",
    duration: { days: 0, hours: 0, minutes: 0 },
    priority: "high",
    description: "make bed",
    date: new Date(2025, 5, 16, 1),
    status: "not started",
    goalId: "1",
  },
  {
    id: "2",
    title: "read article",
    duration: { days: 0, hours: 0, minutes: 0 },
    priority: "medium",
    description: "make sure to read the article",
    date: new Date(2025, 5, 16, 2),
    status: "completed",
    goalId: "1",
  },
  {
    id: "3",
    title: "wash dishes",
    duration: { days: 0, hours: 0, minutes: 0 },
    priority: "low",
    description: "wash all the dishes",
    date: new Date(2025, 5, 16, 3),
    status: "in progress",
    goalId: "1",
  },
];

export const GOALS = [
  {
    id: "1",
    title: "Improve productivity",
    description: "Implement time blocking for deep work",
    deadline: new Date(2025, 5, 30),
    progress: 0,
  },
  {
    id: "2",
    title: "Enhance skills",
    description: "Complete the React Native course",
    deadline: new Date(2025, 6, 15),
    progress: 0,
  },
  {
    id: "3",
    title: "Maintain work-life balance",
    description: "Set boundaries for work hours",
    deadline: new Date(2025, 6, 30),
    progress: 0,
  },
];
