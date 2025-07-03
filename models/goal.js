export default class Goal {
  constructor({
    id,
    title,
    description,
    deadline,
    progress,
    status,
    tasks,
    trackTaskStatus,
  }) {
    this.id = id;
    this.title = title;
    this.description = description;
    this.deadline = deadline;
    this.progress = progress;
    this.status = status;
    this.tasks = tasks;
    this.trackTaskStatus = trackTaskStatus;
  }
}
