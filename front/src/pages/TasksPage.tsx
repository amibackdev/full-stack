import { Plus } from 'lucide-react';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { ApiError, normalizeError } from '../api/http';
import { deleteTask, getTasks } from '../api/tasks';
import type { Priority, Task } from '../api/types';
import ConfirmDialog from '../components/ConfirmDialog';
import { EmptyBlock, ErrorBlock } from '../components/StateBlocks';
import TaskCard from '../components/TaskCard';
import TaskSkeleton from '../components/TaskSkeleton';
import { useToast } from '../components/Toast';
import { PRIORITIES, priorityLabel, priorityWeight } from '../utils/priority';

type PrioFilter = 'all' | Priority;
type Sort = 'server' | 'deadline-asc' | 'deadline-desc' | 'prio-desc' | 'prio-asc';

export default function TasksPage() {
  const [tasks, setTasks] = useState<Task[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [reload, setReload] = useState(0);
  const [prio, setPrio] = useState<PrioFilter>('all');
  const [sort, setSort] = useState<Sort>('server');
  const [params, setParams] = useSearchParams();  // q — единственный источник: поле поиска в навбаре
  const [pending, setPending] = useState<Task | null>(null);
  const toast = useToast();
  const q = params.get('q') ?? '';

  useEffect(() => {
    const ctrl = new AbortController();
    setError(null);
    setTasks(null);
    getTasks(ctrl.signal)
      .then(setTasks)
      .catch((e: unknown) => {
        if (e instanceof DOMException && e.name === 'AbortError') return;
        setError(normalizeError(e));
      });
    return () => ctrl.abort();
  }, [reload]);

  const visible = useMemo(() => {
    if (!tasks) return [];
    const needle = q.trim().toLowerCase();
    let list = tasks.filter(
      (t) =>
        (prio === 'all' || t.priority === prio) &&
        (!needle || t.title.toLowerCase().includes(needle) || t.description.toLowerCase().includes(needle)),
    );
    if (sort !== 'server') {
      list = [...list].sort((a, b) => {
        switch (sort) {
          case 'deadline-asc': return a.deadline - b.deadline;
          case 'deadline-desc': return b.deadline - a.deadline;
          case 'prio-desc': return priorityWeight(b.priority) - priorityWeight(a.priority);
          case 'prio-asc': return priorityWeight(a.priority) - priorityWeight(b.priority);
        }
      });
    }
    return list;
  }, [tasks, q, prio, sort]);

  /** Оптимистичное удаление: убираем сразу, при ошибке возвращаем на то же место. */
  const confirmDelete = useCallback(async () => {
    const task = pending;
    if (!task || !tasks) return;
    setPending(null);
    const index = tasks.findIndex((t) => t._id === task._id);
    setTasks((cur) => cur?.filter((t) => t._id !== task._id) ?? cur);
    try {
      await deleteTask(task._id);
    } catch (e) {
      if (e instanceof ApiError && e.status === 404) return; // уже удалена — откат не нужен
      setTasks((cur) => {
        if (!cur || cur.some((t) => t._id === task._id)) return cur;
        const next = [...cur];
        next.splice(Math.min(Math.max(index, 0), next.length), 0, task);
        return next;
      });
      toast.push(`Не удалось удалить «${task.title}»: ${normalizeError(e)}`);
    }
  }, [pending, tasks, toast]);

  const resetFilters = () => { setPrio('all'); setSort('server'); setParams({}, { replace: true }); };

  return (
    <section>
      <div className="page-head">
        <h1 className="h-pixel">ЗАДАЧИ</h1>
        <Link to="/new" className="btn btn--plus" aria-label="Новая задача">
          <Plus size={28} aria-hidden="true" />
          <span>Новая</span>
        </Link>
      </div>

      <div className="toolbar frame">
        <div className="chips" role="group" aria-label="Фильтр по приоритету">
          {(['all', ...PRIORITIES] as const).map((p) => (
            <button key={p} type="button" className={`chip${prio === p ? ' is-on' : ''}`} aria-pressed={prio === p} onClick={() => setPrio(p)}>
              {p === 'all' ? 'Все' : priorityLabel(p)}
            </button>
          ))}
        </div>
        <label className="toolbar__sort">
          <span className="visually-hidden">Сортировка</span>
          <select value={sort} onChange={(e) => setSort(e.target.value as Sort)} aria-label="Сортировка">
            <option value="server">Как на сервере</option>
            <option value="deadline-asc">Дедлайн: ближайшие</option>
            <option value="deadline-desc">Дедлайн: дальние</option>
            <option value="prio-desc">Приоритет: высокие сверху</option>
            <option value="prio-asc">Приоритет: низкие сверху</option>
          </select>
        </label>
      </div>

      {error ? (
        <ErrorBlock message={error} onRetry={() => setReload((n) => n + 1)} />
      ) : tasks === null ? (
        <TaskSkeleton />
      ) : tasks.length === 0 ? (
        <EmptyBlock title="Задач пока нет" text="Создай первую — она появится здесь.">
          <Link to="/new" className="btn"><Plus size={18} aria-hidden="true" /> Создать задачу</Link>
        </EmptyBlock>
      ) : visible.length === 0 ? (
        <EmptyBlock title="Ничего не найдено" text="Попробуй изменить поиск или фильтр.">
          <button type="button" className="btn btn--ghost" onClick={resetFilters}>Сбросить</button>
        </EmptyBlock>
      ) : (
        <>
          <p className="count">Показано: {visible.length} из {tasks.length}</p>
          <div className="grid">
            {visible.map((t) => (
              <TaskCard key={t._id} task={t} onDelete={setPending} />
            ))}
          </div>
        </>
      )}

      <ConfirmDialog
        open={pending !== null}
        title="Удалить задачу?"
        text={pending ? `«${pending.title}» будет удалена без возможности восстановления.` : undefined}
        onConfirm={() => void confirmDelete()}
        onCancel={() => setPending(null)}
      />
    </section>
  );
}
