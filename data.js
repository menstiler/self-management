export const TASKS = [
  {
    id: "1",
    title: "clean room",
    duration: { days: 0, hours: 0, minutes: 0 },
    priority: "high",
    description: "make bed",
    date: new Date(2025, 5, 26, 1),
    status: "not started",
    goals: ["1"],
  },
  {
    id: "2",
    title: "read article",
    duration: { days: 0, hours: 0, minutes: 0 },
    priority: "medium",
    description: "make sure to read the article",
    date: new Date(2025, 5, 22, 2),
    status: "done",
    goals: ["1"],
  },
  {
    id: "3",
    title: "wash dishes",
    duration: { days: 0, hours: 0, minutes: 0 },
    priority: "low",
    description: "wash all the dishes",
    date: new Date(2025, 5, 16, 3),
    status: "in progress",
    goals: ["1"],
  },
  {
    id: "4",
    title: "Daily Exercise",
    duration: { days: 0, hours: 0, minutes: 30 },
    priority: "high",
    description: "30 minutes of cardio or strength training",
    date: new Date(), // Today's date
    status: "not started",
    goals: ["1"],
    isRecurring: true,
    repeat: "daily",
    startDate: new Date(), // Today
    endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days from today
    completedDates: [], // No completed dates yet
  },
  {
    id: "5",
    title: "Weekly Team Meeting",
    duration: { days: 0, hours: 1, minutes: 0 },
    priority: "medium",
    description: "Weekly team sync and planning",
    date: new Date(), // Today's date
    status: "not started",
    goals: ["1"],
    isRecurring: true,
    repeat: "weekly",
    dayOfWeek: "Monday",
    startDate: new Date(), // Today
    endDate: new Date(Date.now() + 12 * 7 * 24 * 60 * 60 * 1000), // 12 weeks from today
    completedDates: [], // No completed dates yet
  },
];

export const GOALS = [
  {
    id: "1",
    title: "Improve productivity",
    description: "Implement time blocking for deep work",
    deadline: new Date(2025, 5, 30),
    progress: 0,
    status: "not started",
    trackTaskStatus: true,
    tasks: ["1", "2", "3"],
  },
  {
    id: "2",
    title: "Enhance skills",
    description: "Complete the React Native course",
    deadline: new Date(2025, 6, 15),
    progress: 0,
    status: "not started",
    trackTaskStatus: true,
    tasks: [],
  },
  {
    id: "3",
    title: "Maintain work-life balance",
    description: "Set boundaries for work hours",
    deadline: new Date(2025, 6, 30),
    progress: 0,
    status: "not started",
    trackTaskStatus: true,
    tasks: [],
  },
];
