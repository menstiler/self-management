export function sortTasksByTime(tasks) {
  return tasks.sort((a, b) => {
    // For recurring tasks, use the display date for sorting
    const dateA = a.isRecurring ? getDisplayDateForRecurringTask(a) : a.date;
    const dateB = b.isRecurring ? getDisplayDateForRecurringTask(b) : b.date;
    return new Date(dateA) - new Date(dateB);
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

export function isDateInCurrentMonth(taskDate) {
  const now = new Date();
  const currentYear = now.getFullYear();
  const currentMonth = now.getMonth();

  const inputDate = taskDate instanceof Date ? taskDate : new Date(taskDate);
  const taskYear = inputDate.getFullYear();
  const taskMonth = inputDate.getMonth();

  // Include tasks from the current month (both past and future dates)
  return taskYear === currentYear && taskMonth === currentMonth;
}

export function hasRecurringTaskInCurrentWeek(task) {
  if (!task.isRecurring) {
    return false;
  }

  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const dayOfWeek = today.getDay();

  const weekStart = new Date(today);
  weekStart.setDate(today.getDate() - dayOfWeek);

  const weekEnd = new Date(weekStart);
  weekEnd.setDate(weekStart.getDate() + 6);

  // Check if the task's date range overlaps with the current week
  const startDate = new Date(task.startDate);
  const endDate = new Date(task.endDate);

  // If the task's end date is before the week starts, or start date is after the week ends, no overlap
  if (endDate < weekStart || startDate > weekEnd) {
    return false;
  }

  // There is an overlap, so the task should show up this week
  return true;
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
  if (startDate >= today) {
    if (task.repeat === "weekly" && task.dayOfWeek) {
      // For weekly tasks, find the next occurrence of the specified day(s)
      return getNextWeeklyDate(startDate, task.dayOfWeek);
    }
    return startDate.toISOString().split("T")[0];
  }

  // Find the next due date that's not completed
  if (task.repeat === "weekly" && task.dayOfWeek) {
    // For weekly tasks, find the next occurrence of the specified day(s)
    const nextWeeklyDate = getNextWeeklyDate(today, task.dayOfWeek);
    if (nextWeeklyDate && new Date(nextWeeklyDate) <= endDate) {
      const dateString = nextWeeklyDate.toISOString().split("T")[0];
      if (!task.completedDates.includes(dateString)) {
        return dateString;
      }
    }
  } else {
    // Daily tasks - use existing logic
    const dates = generateDateRange(startDate, endDate);
    for (const date of dates) {
      const dateString = date.toISOString().split("T")[0];
      if (date >= today && !task.completedDates.includes(dateString)) {
        return dateString;
      }
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

export function getNextWeeklyDate(fromDate, dayOfWeeks) {
  if (!dayOfWeeks) return null;

  const dayNames = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];

  // Handle both single day and array of days
  const days = Array.isArray(dayOfWeeks) ? dayOfWeeks : [dayOfWeeks];
  if (days.length === 0) return null;

  const currentDate = new Date(fromDate);
  const currentDayIndex = currentDate.getDay();

  // Find the next occurrence of any of the specified days
  let closestDate = null;
  let minDaysToAdd = Infinity;

  for (const dayOfWeek of days) {
    const targetDayIndex = dayNames.indexOf(dayOfWeek);
    if (targetDayIndex === -1) continue;

    let daysToAdd = targetDayIndex - currentDayIndex;
    if (daysToAdd <= 0) {
      daysToAdd += 7; // Move to next week
    }

    if (daysToAdd < minDaysToAdd) {
      minDaysToAdd = daysToAdd;
      closestDate = new Date(currentDate);
      closestDate.setDate(currentDate.getDate() + daysToAdd);
    }
  }

  return closestDate ? closestDate.toISOString().split("T")[0] : null;
}

export function formatDateForDisplay(date) {
  if (!date) return new Date();

  if (date instanceof Date) return date;

  if (typeof date === "string") {
    const parsedDate = new Date(date);
    if (!isNaN(parsedDate.getTime())) {
      return parsedDate;
    }
  }

  return new Date();
}
