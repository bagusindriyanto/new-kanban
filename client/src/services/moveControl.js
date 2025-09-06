const onMoveLeft = (task) => {
  const currentIndex = STATUS_ORDER.indexOf(task.status);
  if (currentIndex > 0) {
    const newStatus = STATUS_ORDER[currentIndex - 1];
    updateTaskStatus(task.id, newStatus, false);
  }
};

const onMoveRight = (task) => {
  const currentIndex = STATUS_ORDER.indexOf(task.status);
  if (currentIndex < STATUS_ORDER.length - 1) {
    const newStatus = STATUS_ORDER[currentIndex + 1];
    updateTaskStatus(task.id, newStatus, true);
  }
};
