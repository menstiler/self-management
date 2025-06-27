export function sortTasksByTime(tasks) {
  return tasks.sort((a, b) => {
    return new Date(a.date) - new Date(b.date);
  });
}

export function capitalizeWords(string) {
  return string.replace(/\b\w/g, (char) => char.toUpperCase());
}

export function isSameDay(dateA, dateB) {
  return (
    dateA.getFullYear() === dateB.getFullYear() &&
    dateA.getMonth() === dateB.getMonth() &&
    dateA.getDate() === dateB.getDate()
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

  const inputDate = new Date(taskDate);
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

  const date = new Date(
    taskDate.getFullYear(),
    taskDate.getMonth(),
    taskDate.getDate()
  );

  return date >= dateInPast && date <= today;
}
