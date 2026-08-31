export const notificationService = {
  isSupported: () => typeof window !== "undefined" && "Notification" in window,
  permission: () => (notificationService.isSupported() ? Notification.permission : "denied"),
  requestPermission: async () => notificationService.isSupported() ? Notification.requestPermission() : "denied",
  taskCompleted: (taskTitle: string) => {
    if (!notificationService.isSupported() || Notification.permission !== "granted") return;
    new Notification("AI Office 작업 완료", { body: `\"${taskTitle}\" 작업이 검토 대기 상태가 되었습니다.`, tag: "ai-office-task-completed" });
  }
};

