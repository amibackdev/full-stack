import { request, API_URL } from './http';
import type { Task, TaskInput } from './types';

export const getTasks = (signal?: AbortSignal) => request<Task[]>('/tasks', { signal });

export const getTask = (id: string, signal?: AbortSignal) =>
  request<Task>(`/task/${encodeURIComponent(id)}`, { signal });

/** multipart/form-data; поле файла строго "photo". Без фото поле не отправляем. */
export function createTask(input: TaskInput, photo: File | null): Promise<Task> {
  const form = new FormData();
  form.append('title', input.title);
  form.append('description', input.description);
  form.append('priority', input.priority);
  form.append('deadline', String(input.deadline));
  if (photo) form.append('photo', photo);
  return request<Task>('/tasks', { method: 'POST', form });
}

/** Шлём только изменённые поля. Фото через PATCH обновить нельзя. */
export const updateTask = (id: string, patch: Partial<TaskInput>) =>
  request<Task>(`/task/${encodeURIComponent(id)}`, { method: 'PATCH', json: patch });

export const deleteTask = (id: string) =>
  request<string>(`/task/${encodeURIComponent(id)}`, { method: 'DELETE' });

/** "./uploads/uuid.jpg" | "uploads/uuid.jpg" | "uuid.jpg" → `${API}/uploads/uuid.jpg` */
export function photoUrl(photo: string | null | undefined): string | null {
  if (!photo) return null;
  const name = photo.replace(/\\/g, '/').split('/').filter(Boolean).pop();
  return name ? `${API_URL}/uploads/${encodeURIComponent(name)}` : null;
}
