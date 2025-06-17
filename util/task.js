export function sortTasksByTime(tasks) {
  return tasks.sort((a, b) => {
    return new Date(a.date) - new Date(b.date);
  });
}

export function capitalizeWords(string) {
  return string.replace(/\b\w/g, (char) => char.toUpperCase());
}
