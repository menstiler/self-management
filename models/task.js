export default class Task {
  constructor({ id, title, duration, date, description, priority, status }) {
    this.id = id;
    this.title = title;
    this.duration = duration;
    this.date = date;
    this.description = description;
    this.priority = priority;
    this.status = status;
  }
}
