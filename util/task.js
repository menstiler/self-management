export function sortTasksByTime(tasks) {
  return tasks.sort((a, b) => {
    return new Date(a.date) - new Date(b.date);
  });
}

export function capitalizeWords(string) {
  return string.replace(/\b\w/g, (char) => char.toUpperCase());
}

export function isSameDay(dateA, dateB) {
  // Ensure both dates are Date objects
  const date1 = dateA instanceof Date ? dateA : new Date(dateA);
  const date2 = dateB instanceof Date ? dateB : new Date(dateB);

  return (
    date1.getFullYear() === date2.getFullYear() &&
    date1.getMonth() === date2.getMonth() &&
    date1.getDate() === date2.getDate()
  );
}

export function isSameWeek(taskDate) {
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());

  const dayOfWeek = today.getDay();

  const weekStart = new Date(today);
  weekStart.setDate(today.getDate() - dayOfWeek);

  const weekEnd = new Date(weekStart);
  weekEnd.setDate(weekStart.getDate() + 6);

  const inputDate = taskDate instanceof Date ? taskDate : new Date(taskDate);
  const normalizedInputDate = new Date(
    inputDate.getFullYear(),
    inputDate.getMonth(),
    inputDate.getDate()
  );

  return normalizedInputDate >= weekStart && normalizedInputDate <= weekEnd;
}

export function hasDateInPastDays(taskDate, daysAgo) {
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const dateInPast = new Date(today);
  dateInPast.setDate(today.getDate() - daysAgo);

  const inputDate = taskDate instanceof Date ? taskDate : new Date(taskDate);
  const date = new Date(
    inputDate.getFullYear(),
    inputDate.getMonth(),
    inputDate.getDate()
  );

  return date >= dateInPast && date <= today;
}

export function generateDateRange(startDate, endDate) {
  const dates = [];
  const currentDate = new Date(startDate);
  const end = new Date(endDate);

  while (currentDate <= end) {
    dates.push(new Date(currentDate));
    currentDate.setDate(currentDate.getDate() + 1);
  }
  return dates;
}

export function getTodayString() {
  return new Date().toISOString().split("T")[0];
}

export function isDateInPast(dateString) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const date = new Date(dateString);
  return date < today;
}

export function getNextDueDate(task) {
  if (!task.isRecurring || !task.startDate || !task.endDate) return null;

  const startDate = new Date(task.startDate);
  const endDate = new Date(task.endDate);
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  // If end date is in the past, no more due dates
  if (endDate < today) return null;

  // If start date is in the future, that's the next due date
  if (startDate >= today) return startDate.toISOString().split("T")[0];

  // Find the next due date that's not completed
  const dates = generateDateRange(startDate, endDate);
  for (const date of dates) {
    const dateString = date.toISOString().split("T")[0];
    if (date >= today && !task.completedDates.includes(dateString)) {
      return dateString;
    }
  }

  return null;
}

export function shouldShowRecurringTaskToday(task) {
  if (!task.isRecurring) return false;

  const nextDueDate = getNextDueDate(task);
  if (!nextDueDate) return false;

  const today = getTodayString();
  return nextDueDate === today;
}

export function getDisplayDateForRecurringTask(task) {
  if (!task.isRecurring) return task.date;

  const nextDueDate = getNextDueDate(task);
  return nextDueDate || task.date;
}
