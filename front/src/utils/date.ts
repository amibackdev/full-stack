/**
 * ВСЯ работа с deadline — только здесь.
 * Допущение: deadline = Unix-timestamp в МИЛЛИСЕКУНДАХ (Date.now()).
 * Если на бэке окажутся секунды — поменяй DEADLINE_UNIT на 's', больше нигде ничего менять не надо.
 */
export const DEADLINE_UNIT: 'ms' | 's' = 'ms';

const k = DEADLINE_UNIT === 'ms' ? 1 : 1000;

/** значение с бэка → Date */
export const deadlineToDate = (deadline: number): Date => new Date(deadline * k);

/** Date → значение для бэка */
export const dateToDeadline = (d: Date): number => Math.round(d.getTime() / k);

const pad = (n: number) => String(n).padStart(2, '0');

/** deadline → значение для <input type="date"> (локальная дата), '' если невалидно */
export function deadlineToInput(deadline: number | undefined): string {
  if (deadline === undefined || !Number.isFinite(deadline)) return '';
  const d = deadlineToDate(deadline);
  if (Number.isNaN(d.getTime())) return '';
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
}

/** значение <input type="date"> → deadline (конец выбранного дня, локально) или null */
export function inputToDeadline(value: string): number | null {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return null;
  const d = new Date(`${value}T23:59:00`);
  return Number.isNaN(d.getTime()) ? null : dateToDeadline(d);
}

export function formatDeadline(deadline: number): string {
  const d = deadlineToDate(deadline);
  if (Number.isNaN(d.getTime())) return '—';
  return d.toLocaleDateString('ru-RU', { day: '2-digit', month: 'short', year: 'numeric' });
}

/** Просрочен ли дедлайн (вычисляется из даты, статуса «выполнено» на бэке нет) */
export function isOverdue(deadline: number): boolean {
  const d = deadlineToDate(deadline);
  return !Number.isNaN(d.getTime()) && d.getTime() < Date.now();
}
