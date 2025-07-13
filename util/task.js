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

  // Ensure taskDate is a Date object
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

  // Ensure taskDate is a Date object
  const inputDate = taskDate instanceof Date ? taskDate : new Date(taskDate);
  const date = new Date(
    inputDate.getFullYear(),
    inputDate.getMonth(),
    inputDate.getDate()
  );

  return date >= dateInPast && date <= today;
}
