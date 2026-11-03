import { isPriority, priorityLabel } from '../utils/priority';

export default function PriorityBadge({ priority }: { priority: string }) {
  const mod = isPriority(priority) ? priority : 'unknown';
  return <span className={`badge badge--${mod}`}>{priorityLabel(priority)}</span>;
}
