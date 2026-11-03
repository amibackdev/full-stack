/** Модель с бэка. photo — путь вида "./uploads/<uuid>.jpg", null или (у старых записей) отсутствует. */
export interface Task {
  _id: string;
  title: string;
  description: string;
  priority: string; // на бэке свободная строка
  deadline: number; // Number; единицы — см. utils/date.ts
  photo?: string | null;
  __v?: number;
}

export type Priority = 'low' | 'medium' | 'high';

/** Поля, которые можно менять через PATCH (фото — нельзя). */
export interface TaskInput {
  title: string;
  description: string;
  priority: string;
  deadline: number;
}
