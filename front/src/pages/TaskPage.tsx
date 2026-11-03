import { ArrowLeft, CalendarClock, Pencil, Trash2 } from 'lucide-react';
import { useCallback, useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { ApiError, normalizeError } from '../api/http';
import { deleteTask, getTask, photoUrl, updateTask } from '../api/tasks';
import type { Task, TaskInput } from '../api/types';
import ConfirmDialog from '../components/ConfirmDialog';
import PriorityBadge from '../components/PriorityBadge';
import { EmptyBlock, ErrorBlock } from '../components/StateBlocks';
import TaskForm from '../components/TaskForm';
import { useToast } from '../components/Toast';
import { formatDeadline, isOverdue } from '../utils/date';
import { diffTask } from '../utils/validate';

// Mongo ObjectId. Бэк на кривой id отвечает 500 (CastError), а не 404 — отсекаем это на клиенте.
const OBJECT_ID = /^[a-f\d]{24}$/i;

export default function TaskPage() {
  const { id = '' } = useParams();
  const navigate = useNavigate();
  const toast = useToast();
  const [task, setTask] = useState<Task | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [notFound, setNotFound] = useState(false);
  const [editing, setEditing] = useState(false);
  const [confirm, setConfirm] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [reload, setReload] = useState(0);

  useEffect(() => {
    setTask(null); setError(null); setEditing(false);
    if (!OBJECT_ID.test(id)) { setNotFound(true); return; }
    setNotFound(false);
    const ctrl = new AbortController();
    getTask(id, ctrl.signal)
      .then(setTask)
      .catch((e: unknown) => {
        if (e instanceof DOMException && e.name === 'AbortError') return;
        if (e instanceof ApiError && e.status === 404) setNotFound(true);
        else setError(normalizeError(e));
      });
    return () => ctrl.abort();
  }, [id, reload]);

  const save = useCallback(async (input: TaskInput) => {
    if (!task) return;
    const patch = diffTask(
      { title: task.title, description: task.description, priority: task.priority, deadline: task.deadline },
      input,
    );
    if (Object.keys(patch).length > 0) setTask(await updateTask(task._id, patch));
    setEditing(false);
  }, [task]);

  const remove = async () => {
    if (!task) return;
    setDeleting(true);
    try {
      await deleteTask(task._id);
      navigate('/tasks', { replace: true });
    } catch (e) {
      setDeleting(false);
      setConfirm(false);
      toast.push(`Не удалось удалить: ${normalizeError(e)}`);
    }
  };

  const back = (
    <Link to="/tasks" className="back"><ArrowLeft size={18} aria-hidden="true" /> Все задачи</Link>
  );

  if (notFound) {
    return (
      <section>
        {back}
        <EmptyBlock title="Задача не найдена" text="Возможно, она уже удалена.">
          <Link to="/tasks" className="btn">К списку</Link>
        </EmptyBlock>
      </section>
    );
  }
  if (error) return <section>{back}<ErrorBlock message={error} onRetry={() => setReload((n) => n + 1)} /></section>;
  if (!task) {
    return (
      <section aria-busy="true">
        {back}
        <div className="detail frame" aria-hidden="true">
          <div className="detail__photo sk" />
          <div className="detail__body">
            <div className="sk sk--line" style={{ width: '60%', height: 36 }} />
            <div className="sk sk--line" style={{ width: '90%' }} />
            <div className="sk sk--line" style={{ width: '80%' }} />
          </div>
        </div>
      </section>
    );
  }

  const src = photoUrl(task.photo);
  return (
    <section>
      {back}
      <article className="detail frame">
        <div className="detail__photo">
          {src ? <img src={src} alt={`Фото к задаче «${task.title}»`} /> : <span className="card__ph" aria-hidden="true">{task.title.trim().charAt(0).toUpperCase() || '?'}</span>}
        </div>
        <div className="detail__body">
          {editing ? (
            <>
              <h1 className="h-pixel h-pixel--sm">РЕДАКТИРОВАНИЕ</h1>
              <TaskForm initial={task} withPhoto={false} submitLabel="Сохранить" onSubmit={save} onCancel={() => setEditing(false)} />
            </>
          ) : (
            <>
              <div className="detail__top">
                <PriorityBadge priority={task.priority} />
                <p className={`card__meta${isOverdue(task.deadline) ? ' is-overdue' : ''}`}>
                  <CalendarClock size={16} aria-hidden="true" />
                  {formatDeadline(task.deadline)}
                  {isOverdue(task.deadline) && <span> · срок прошёл</span>}
                </p>
              </div>
              <h1 className="detail__title">{task.title}</h1>
              <p className="detail__desc">{task.description}</p>
              <div className="form__actions">
                <button type="button" className="btn btn--danger" onClick={() => setConfirm(true)}>
                  <Trash2 size={18} aria-hidden="true" /> Удалить
                </button>
                <button type="button" className="btn" onClick={() => setEditing(true)}>
                  <Pencil size={18} aria-hidden="true" /> Изменить
                </button>
              </div>
            </>
          )}
        </div>
      </article>

      <ConfirmDialog
        open={confirm}
        busy={deleting}
        title="Удалить задачу?"
        text={`«${task.title}» будет удалена без возможности восстановления.`}
        onConfirm={() => void remove()}
        onCancel={() => setConfirm(false)}
      />
    </section>
  );
}
