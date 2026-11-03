import type { Priority } from '../api/types';

export const PRIORITIES: readonly Priority[] = ['low', 'medium', 'high'];

const LABELS: Record<Priority, string> = { low: 'Низкий', medium: 'Средний', high: 'Высокий' };
const WEIGHT: Record<Priority, number> = { low: 1, medium: 2, high: 3 };

export const isPriority = (v: string): v is Priority => (PRIORITIES as readonly string[]).includes(v);

/** Неизвестное значение показываем как есть */
export const priorityLabel = (v: string): string => (isPriority(v) ? LABELS[v] : v || '—');

/** Неизвестные приоритеты считаются самыми низкими (0) при сортировке */
export const priorityWeight = (v: string): number => (isPriority(v) ? WEIGHT[v] : 0);
