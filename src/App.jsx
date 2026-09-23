import { useEffect, useState } from 'react';
import { Link, NavLink, Route, Routes } from 'react-router';
import Header from './components/Header.jsx';
import { TaskCard } from './components/TaskCard.jsx';
import { TaskDetails } from './components/TaskDetails.jsx';
import { TaskForm } from './components/TaskForm.jsx';
import { getTasks } from './services/taskApi.js';
import './App.css';

export default function App() {
  const [tasks, setTasks] = useState([]);
  const [filter, setFilter] = useState('all');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let ignore = false;

    async function loadTasks() {
      try {
        const loadedTasks = await getTasks();

        if (!ignore) {
          setTasks(loadedTasks);
          setError('');
        }
      } catch (loadError) {
        if (!ignore) {
          setError(loadError.message);
        }
      } finally {
        if (!ignore) {
          setLoading(false);
        }
      }
    }

    loadTasks();

    return () => {
      ignore = true;
    };
  }, []);

  function handleToggle(id) {
    setTasks((previousTasks) =>
      previousTasks.map((task) =>
        task.id === id ? { ...task, completed: !task.completed } : task,
      ),
    );
  }

  function handleAddTask(title) {
    setTasks((previousTasks) => {
      const nextId = Math.max(0, ...previousTasks.map((task) => task.id)) + 1;
      return [...previousTasks, { id: nextId, title, completed: false }];
    });
  }

  function handleDelete(id) {
    setTasks((previousTasks) => previousTasks.filter((task) => task.id !== id));
  }

  const visibleTasks = tasks.filter((task) => {
    if (filter === 'completed') return task.completed;
    if (filter === 'incomplete') return !task.completed;
    return true;
  });

  return (
    <main>
      <Header />

      <nav aria-label="Main navigation">
        <NavLink to="/" end>
          Home
        </NavLink>{' '}
        <NavLink to="/tasks">Tasks</NavLink>
      </nav>

      <Routes>
        <Route
          path="/"
          element={
            <section>
              <h2>Welcome to Task Tracker</h2>
              <Link to="/tasks">View tasks</Link>
            </section>
          }
        />

        <Route
          path="/tasks"
          element={
            <>
              <TaskForm onAddTask={handleAddTask} />

              <div aria-label="Filter tasks">
                <button type="button" onClick={() => setFilter('all')}>
                  All
                </button>
                <button type="button" onClick={() => setFilter('completed')}>
                  Completed
                </button>
                <button type="button" onClick={() => setFilter('incomplete')}>
                  Incomplete
                </button>
              </div>

              {loading ? (
                <p>Loading tasks...</p>
              ) : error ? (
                <p role="alert">Could not load tasks: {error}</p>
              ) : visibleTasks.length === 0 ? (
                <p>No tasks found</p>
              ) : (
                visibleTasks.map((task) => (
                  <TaskCard
                    key={task.id}
                    task={task}
                    onToggle={handleToggle}
                    onDelete={handleDelete}
                  />
                ))
              )}
            </>
          }
        />

        <Route
          path="/tasks/:taskId"
          element={
            loading ? (
              <p>Loading tasks...</p>
            ) : error ? (
              <p role="alert">Could not load tasks: {error}</p>
            ) : (
              <TaskDetails tasks={tasks} />
            )
          }
        />

        <Route
          path="*"
          element={
            <section>
              <h2>Page not found</h2>
              <Link to="/">Go home</Link>
            </section>
          }
        />
      </Routes>
    </main>
  );
}
