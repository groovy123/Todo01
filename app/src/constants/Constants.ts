export const TASK_STATUS = {
    NOT_READY: "Not ready",
    READY: "Ready",
    DOING: "Doing",
    DONE: "Done",
} as const satisfies Record<string, string>
export type TaskStatusKey = keyof typeof TASK_STATUS;
export type TaskStatusValue = typeof TASK_STATUS[TaskStatusKey];
