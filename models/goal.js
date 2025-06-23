export default class Goal {
  constructor({ id, title, description, deadline, progress, tasks }) {
    this.id = id;
    this.title = title;
    this.description = description;
    this.deadline = deadline;
    this.progress = progress;
    this.tasks = tasks;
  }
}
