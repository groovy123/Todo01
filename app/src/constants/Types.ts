import { TaskStatusKey } from "./Constants";

export type TaskRow = {
    id: number,
    title: string,
    date: Date,
    notify: boolean,
    notifyInterval: number,
    status: TaskStatusKey,
}
