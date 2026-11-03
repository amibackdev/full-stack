import { Outlet, Route, Routes } from 'react-router-dom';
import Background from './components/Background';
import Navbar from './components/Navbar';
import { ToastProvider } from './components/Toast';
import Home from './pages/Home';
import NewTaskPage from './pages/NewTaskPage';
import NotFound from './pages/NotFound';
import TaskPage from './pages/TaskPage';
import TasksPage from './pages/TasksPage';

function Layout() {
  return (
    <>
      <Background />
      <Navbar />
      <main className="main">
        <Outlet />
      </main>
      <footer className="footer">ТРЕКЕР · учебный проект</footer>
    </>
  );
}

export default function App() {
  return (
    <ToastProvider>
      <Routes>
        <Route element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="tasks" element={<TasksPage />} />
          <Route path="task/:id" element={<TaskPage />} />
          <Route path="new" element={<NewTaskPage />} />
          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
    </ToastProvider>
  );
}
