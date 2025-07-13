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
    startDate = null,
    endDate = null,
    parentTaskId = null,
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
    this.startDate = startDate;
    this.endDate = endDate;
    this.parentTaskId = parentTaskId;
  }
}
