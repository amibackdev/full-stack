import { useEffect, useRef } from 'react';

interface Props {
  open: boolean;
  title: string;
  text?: string;
  confirmLabel?: string;
  busy?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

/** Нативный <dialog>: фокус-трап и Esc из коробки. */
export default function ConfirmDialog({ open, title, text, confirmLabel = 'Удалить', busy, onConfirm, onCancel }: Props) {
  const ref = useRef<HTMLDialogElement>(null);
  useEffect(() => {
    const d = ref.current;
    if (!d) return;
    if (open && !d.open) d.showModal();
    if (!open && d.open) d.close();
  }, [open]);

  return (
    <dialog ref={ref} className="dialog frame" onCancel={(e) => { e.preventDefault(); if (!busy) onCancel(); }} aria-labelledby="dlg-title">
      <h2 id="dlg-title" className="dialog__title">{title}</h2>
      {text && <p className="dialog__text">{text}</p>}
      <div className="dialog__actions">
        <button type="button" className="btn btn--ghost" onClick={onCancel} disabled={busy}>
          Отмена
        </button>
        <button type="button" className="btn btn--danger" onClick={onConfirm} disabled={busy}>
          {busy ? 'Удаляю…' : confirmLabel}
        </button>
      </div>
    </dialog>
  );
}
