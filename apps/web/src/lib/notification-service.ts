export const notificationService = {
  isSupported: () => typeof window !== "undefined" && "Notification" in window,
  permission: () => (notificationService.isSupported() ? Notification.permission : "denied"),
  requestPermission: async () => notificationService.isSupported() ? Notification.requestPermission() : "denied",
  completed: (title: string, body: string) => {
    if (window.aiOfficeDesktop?.notifyCompletion) { window.aiOfficeDesktop.notifyCompletion(title, body); return; }
    if (!notificationService.isSupported() || Notification.permission !== "granted") return;
    new Notification(title, { body, tag: `ai-office-${Date.now()}` });
  },
  taskCompleted: (taskTitle: string) => notificationService.completed("AI Office 작업 완료", `\"${taskTitle}\" 작업이 검토 대기 상태가 되었습니다.`),
};
