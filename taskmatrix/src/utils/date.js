export function isTaskOverdue(dueDate, status) {
  if (!dueDate || status === "done") return false;

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const targetDate = new Date(dueDate);
  targetDate.setHours(0, 0, 0, 0);

  return targetDate < today;
}
