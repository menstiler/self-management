export default class Task {
  constructor({
    id,
    title,
    duration,
    date,
    description,
    priority,
    status,
    goals,
    isRecurring = false,
    repeat = null,
    dayOfWeek = null,
    startDate = null,
    endDate = null,
    monthlyOption = null,
    dayOfMonth = null,
    completedDates = [],
  }) {
    this.id = id;
    this.title = title;
    this.duration = duration;
    this.date = date;
    this.description = description;
    this.priority = priority;
    this.status = status;
    this.goals = goals;
    this.isRecurring = isRecurring;
    this.repeat = repeat;
    this.dayOfWeek = dayOfWeek;
    this.startDate = startDate;
    this.endDate = endDate;
    this.monthlyOption = monthlyOption;
    this.dayOfMonth = dayOfMonth;
    this.completedDates = completedDates;
  }
}
