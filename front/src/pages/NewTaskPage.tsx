import { ArrowLeft } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { createTask } from '../api/tasks';
import type { TaskInput } from '../api/types';
import TaskForm from '../components/TaskForm';

export default function NewTaskPage() {
  const navigate = useNavigate();
  const submit = async (input: TaskInput, photo: File | null) => {
    const created = await createTask(input, photo);
    navigate(`/task/${created._id}`);
  };
  return (
    <section>
      <Link to="/tasks" className="back"><ArrowLeft size={18} aria-hidden="true" /> Все задачи</Link>
      <div className="frame form-card">
        <h1 className="h-pixel h-pixel--sm">НОВАЯ ЗАДАЧА</h1>
        <TaskForm withPhoto submitLabel="Создать" onSubmit={submit} onCancel={() => navigate(-1)} />
      </div>
    </section>
  );
}
