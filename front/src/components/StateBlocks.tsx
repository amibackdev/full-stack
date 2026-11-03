import { AlertTriangle, Inbox } from 'lucide-react';
import type { ReactNode } from 'react';

export function ErrorBlock({ message, onRetry }: { message: string; onRetry?: () => void }) {
  return (
    <div className="state frame" role="alert">
      <AlertTriangle size={36} aria-hidden="true" />
      <h2 className="state__title">Что-то сломалось</h2>
      <p className="state__text">{message}</p>
      {onRetry && (
        <button type="button" className="btn" onClick={onRetry}>
          Повторить
        </button>
      )}
    </div>
  );
}

export function EmptyBlock({ title, text, children }: { title: string; text?: string; children?: ReactNode }) {
  return (
    <div className="state frame">
      <Inbox size={36} aria-hidden="true" />
      <h2 className="state__title">{title}</h2>
      {text && <p className="state__text">{text}</p>}
      {children}
    </div>
  );
}
