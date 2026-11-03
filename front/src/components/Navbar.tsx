import { Home, LayoutGrid, Plus, Search } from 'lucide-react';
import { NavLink, useLocation, useNavigate, useSearchParams } from 'react-router-dom';

export default function Navbar() {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const [params] = useSearchParams();
  const q = pathname === '/tasks' ? params.get('q') ?? '' : '';

  const onSearch = (value: string) => {
    const next = value ? `/tasks?q=${encodeURIComponent(value)}` : '/tasks';
    navigate(next, { replace: pathname === '/tasks' });
  };

  return (
    <header className="nav-wrap">
      <nav className="nav frame" aria-label="Основная навигация">
        <NavLink to="/" className="nav__logo" aria-label="ТРЕКЕР — на главную">
          <span className="nav__logo-mark" aria-hidden="true" />
          ТРЕКЕР
        </NavLink>
        <div className="nav__icons">
          <NavLink to="/" end className="icon-btn" aria-label="Главная" title="Главная">
            <Home size={20} />
          </NavLink>
          <NavLink to="/tasks" className="icon-btn" aria-label="Все задачи" title="Все задачи">
            <LayoutGrid size={20} />
          </NavLink>
          <NavLink to="/new" className="icon-btn" aria-label="Новая задача" title="Новая задача">
            <Plus size={20} />
          </NavLink>
        </div>
        <label className="nav__search">
          <Search size={18} aria-hidden="true" />
          <input
            type="search"
            value={q}
            onChange={(e) => onSearch(e.target.value)}
            placeholder="Поиск задач"
            aria-label="Поиск задач"
          />
        </label>
      </nav>
    </header>
  );
}
