import { ArrowRight, Plus } from 'lucide-react';
import { Link } from 'react-router-dom';
import HeroPlanet from '../three/HeroPlanet';

export default function Home() {
  return (
    <section className="hero frame">
      <span className="corner corner--tl">TASK.TRACKER // v1.0</span>
      <span className="corner corner--tr">REST · MONGO · REACT</span>
      <span className="corner corner--bl">ЗАДАЧИ. ПРИОРИТЕТЫ. ДЕДЛАЙНЫ.</span>

      <h1 className="hero__title">
        <span className="hero__word">ЗАДАЧИ</span>
        <span className="hero__pixel">ТРЕКЕР</span>
      </h1>
      <HeroPlanet />

      <div className="hero__cta">
        <Link to="/tasks" className="btn">
          К задачам <ArrowRight size={18} aria-hidden="true" />
        </Link>
        <Link to="/new" className="btn btn--ghost">
          <Plus size={18} aria-hidden="true" /> Новая
        </Link>
      </div>
    </section>
  );
}
