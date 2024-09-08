
export interface Callback<T> {
    value?: T,
    notify(value: T): void;
}