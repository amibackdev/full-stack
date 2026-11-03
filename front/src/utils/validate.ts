import type { TaskInput } from '../api/types';
import { inputToDeadline } from './date';

export const MAX_PHOTO_BYTES = 5 * 1024 * 1024;
export const ALLOWED_MIME = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'] as const;
const ALLOWED_EXT = ['jpg', 'jpeg', 'png', 'gif', 'webp'];

export interface FormValues {
  title: string;
  description: string;
  priority: string;
  deadline: string; // значение <input type="date">
}
export type FormErrors = Partial<Record<keyof FormValues, string>>;

/** Бэк проверяет только title и description, остальное даёт 500 — поэтому проверяем все 4 поля тут. */
export function validateForm(v: FormValues): { errors: FormErrors; input: TaskInput | null } {
  const errors: FormErrors = {};
  const title = v.title.trim();
  const description = v.description.trim();
  if (!title) errors.title = 'Укажи заголовок';
  if (!description) errors.description = 'Добавь описание';
  if (!v.priority.trim()) errors.priority = 'Выбери приоритет';
  const deadline = inputToDeadline(v.deadline);
  if (deadline === null) errors.deadline = 'Укажи дедлайн';
  if (Object.keys(errors).length > 0 || deadline === null) return { errors, input: null };
  return { errors, input: { title, description, priority: v.priority.trim(), deadline } };
}

/** null — файл подходит. Сервер определяет расширение по имени файла, поэтому оно обязательно. */
export function validatePhoto(file: File): string | null {
  if (!(ALLOWED_MIME as readonly string[]).includes(file.type)) {
    return 'Допустимы только JPEG, PNG, GIF и WEBP';
  }
  const dot = file.name.lastIndexOf('.');
  const ext = dot >= 0 ? file.name.slice(dot + 1).toLowerCase() : '';
  if (!ALLOWED_EXT.includes(ext)) return 'У файла должно быть расширение .jpg, .png, .gif или .webp';
  if (file.size > MAX_PHOTO_BYTES) return 'Файл больше 5 МБ';
  return null;
}

/** Только реально изменённые поля — для PATCH */
export function diffTask(prev: TaskInput, next: TaskInput): Partial<TaskInput> {
  const patch: Partial<TaskInput> = {};
  if (prev.title !== next.title) patch.title = next.title;
  if (prev.description !== next.description) patch.description = next.description;
  if (prev.priority !== next.priority) patch.priority = next.priority;
  if (prev.deadline !== next.deadline) patch.deadline = next.deadline;
  return patch;
}
