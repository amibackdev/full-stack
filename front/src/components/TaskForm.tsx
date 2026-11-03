import { useState, type FormEvent } from 'react';
import { normalizeError } from '../api/http';
import type { Task, TaskInput } from '../api/types';
import { deadlineToInput } from '../utils/date';
import { PRIORITIES, isPriority, priorityLabel } from '../utils/priority';
import { validateForm, type FormErrors, type FormValues } from '../utils/validate';
import PhotoDropzone from './PhotoDropzone';

interface Props {
  initial?: Task;
  /** Фото можно загрузить только при создании — PATCH его не принимает */
  withPhoto: boolean;
  submitLabel: string;
  onSubmit: (input: TaskInput, photo: File | null) => Promise<void>;
  onCancel?: () => void;
}

export default function TaskForm({ initial, withPhoto, submitLabel, onSubmit, onCancel }: Props) {
  const [values, setValues] = useState<FormValues>({
    title: initial?.title ?? '',
    description: initial?.description ?? '',
    priority: initial?.priority ?? 'medium',
    deadline: deadlineToInput(initial?.deadline),
  });
  const [photo, setPhoto] = useState<File | null>(null);
  const [errors, setErrors] = useState<FormErrors>({});
  const [serverError, setServerError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  const set = <K extends keyof FormValues>(k: K, v: FormValues[K]) => setValues((s) => ({ ...s, [k]: v }));
  const unknownPriority = initial && !isPriority(initial.priority) ? initial.priority : null;

  async function submit(e: FormEvent) {
    e.preventDefault();
    const { errors: errs, input } = validateForm(values);
    setErrors(errs);
    setServerError(null);
    if (!input) return;
    setBusy(true);
    try {
      await onSubmit(input, photo);
    } catch (err) {
      setServerError(normalizeError(err));
    } finally {
      setBusy(false);
    }
  }

  return (
    <form className="form" onSubmit={submit} noValidate>
      <div className="field">
        <label className="field__label" htmlFor="f-title">Заголовок</label>
        <input id="f-title" value={values.title} onChange={(e) => set('title', e.target.value)} aria-invalid={!!errors.title} aria-describedby={errors.title ? 'e-title' : undefined} />
        {errors.title && <p id="e-title" className="field__error" role="alert">{errors.title}</p>}
      </div>

      <div className="field">
        <label className="field__label" htmlFor="f-desc">Описание</label>
        <textarea id="f-desc" rows={5} value={values.description} onChange={(e) => set('description', e.target.value)} aria-invalid={!!errors.description} aria-describedby={errors.description ? 'e-desc' : undefined} />
        {errors.description && <p id="e-desc" className="field__error" role="alert">{errors.description}</p>}
      </div>

      <div className="form__row">
        <div className="field">
          <label className="field__label" htmlFor="f-prio">Приоритет</label>
          <select id="f-prio" value={values.priority} onChange={(e) => set('priority', e.target.value)} aria-invalid={!!errors.priority}>
            {PRIORITIES.map((p) => (
              <option key={p} value={p}>{priorityLabel(p)}</option>
            ))}
            {unknownPriority && <option value={unknownPriority}>{unknownPriority}</option>}
          </select>
          {errors.priority && <p className="field__error" role="alert">{errors.priority}</p>}
        </div>
        <div className="field">
          <label className="field__label" htmlFor="f-dl">Дедлайн</label>
          <input id="f-dl" type="date" value={values.deadline} onChange={(e) => set('deadline', e.target.value)} aria-invalid={!!errors.deadline} />
          {errors.deadline && <p className="field__error" role="alert">{errors.deadline}</p>}
        </div>
      </div>

      {withPhoto ? (
        <PhotoDropzone file={photo} onChange={setPhoto} />
      ) : (
        <p className="hint">Фото нельзя изменить после создания — бэкенд не принимает его в PATCH.</p>
      )}

      {serverError && <p className="form__error" role="alert">{serverError}</p>}

      <div className="form__actions">
        {onCancel && (
          <button type="button" className="btn btn--ghost" onClick={onCancel} disabled={busy}>Отмена</button>
        )}
        <button type="submit" className="btn" disabled={busy}>{busy ? 'Сохраняю…' : submitLabel}</button>
      </div>
    </form>
  );
}
