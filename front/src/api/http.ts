export const API_URL: string = (import.meta.env.VITE_API_URL ?? '/api').replace(/\/+$/, '');

export class ApiError extends Error {
  readonly status: number;
  constructor(message: string, status: number) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
  }
}

function isRecord(v: unknown): v is Record<string, unknown> {
  return typeof v === 'object' && v !== null;
}

/**
 * Достаёт читаемый текст из любого формата ошибки бэка:
 *  - JSON-строка:            "Такой задачи не существует"
 *  - объект { message, error }
 *  - Error / ApiError / сетевой TypeError
 */
export function normalizeError(err: unknown): string {
  if (typeof err === 'string') return err.trim() || 'Неизвестная ошибка';
  if (err instanceof ApiError) return err.message;
  if (err instanceof DOMException && err.name === 'AbortError') return 'Запрос отменён';
  if (err instanceof TypeError) return 'Нет соединения с сервером. Проверь, что бэкенд запущен.';
  if (err instanceof Error) return err.message || 'Неизвестная ошибка';
  if (isRecord(err)) {
    const message = typeof err.message === 'string' ? err.message.trim() : '';
    const detail = typeof err.error === 'string' ? err.error.trim() : '';
    if (message && detail && message !== detail) return `${message}: ${detail}`;
    if (message || detail) return message || detail;
  }
  return 'Неизвестная ошибка';
}

function statusFallback(status: number): string {
  if (status === 404) return 'Не найдено';
  if (status === 400) return 'Некорректный запрос';
  if (status >= 500) return `Ошибка сервера или сервер недоступен (HTTP ${status})`;
  return `Ошибка запроса (HTTP ${status})`;
}

async function parseBody(res: Response): Promise<unknown> {
  const text = await res.text();
  if (!text) return null;
  try {
    return JSON.parse(text) as unknown;
  } catch {
    return text.length > 300 ? `${text.slice(0, 300)}…` : text;
  }
}

interface RequestOptions {
  method?: 'GET' | 'POST' | 'PATCH' | 'DELETE';
  json?: unknown;
  form?: FormData;
  signal?: AbortSignal;
}

/** Единственная точка, через которую уходят запросы. */
export async function request<T>(path: string, opts: RequestOptions = {}): Promise<T> {
  const headers: Record<string, string> = {};
  let body: BodyInit | undefined;
  if (opts.form) {
    body = opts.form; // Content-Type с boundary браузер выставит сам
  } else if (opts.json !== undefined) {
    headers['Content-Type'] = 'application/json';
    body = JSON.stringify(opts.json);
  }

  let res: Response;
  try {
    res = await fetch(`${API_URL}${path}`, { method: opts.method ?? 'GET', headers, body, signal: opts.signal });
  } catch (e) {
    if (e instanceof DOMException && e.name === 'AbortError') throw e;
    throw new ApiError(normalizeError(e), 0);
  }

  const data = await parseBody(res);
  if (!res.ok) {
    const msg = data === null ? statusFallback(res.status) : normalizeError(data);
    throw new ApiError(msg, res.status);
  }
  return data as T;
}
