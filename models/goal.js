export default class Goal {
  constructor({ id, title, description, deadline, progress }) {
    this.id = id;
    this.title = title;
    this.description = description;
    this.deadline = deadline;
    this.progress = progress;
  }
}
