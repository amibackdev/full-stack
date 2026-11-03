import { CalendarClock, Trash2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { photoUrl } from '../api/tasks';
import type { Task } from '../api/types';
import { formatDeadline, isOverdue } from '../utils/date';
import PriorityBadge from './PriorityBadge';

interface Props {
  task: Task;
  onDelete: (task: Task) => void;
}

export default function TaskCard({ task, onDelete }: Props) {
  const src = photoUrl(task.photo);
  const overdue = isOverdue(task.deadline);
  return (
    <article className="card">
      <Link to={`/task/${task._id}`} className="card__link" aria-label={`Открыть задачу: ${task.title}`}>
        <div className="card__photo">
          {src ? (
            <img src={src} alt="" loading="lazy" />
          ) : (
            <span className="card__ph" aria-hidden="true">
              {task.title.trim().charAt(0).toUpperCase() || '?'}
            </span>
          )}
          <PriorityBadge priority={task.priority} />
        </div>
        <div className="card__body">
          <h3 className="card__title">{task.title}</h3>
          <p className="card__desc">{task.description}</p>
          <p className={`card__meta${overdue ? ' is-overdue' : ''}`}>
            <CalendarClock size={16} aria-hidden="true" />
            {formatDeadline(task.deadline)}
            {overdue && <span> · срок прошёл</span>}
          </p>
        </div>
      </Link>
      <button type="button" className="card__del" onClick={() => onDelete(task)} aria-label={`Удалить задачу: ${task.title}`}>
        <Trash2 size={18} />
      </button>
    </article>
  );
}
