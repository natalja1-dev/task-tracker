import { useEffect, useState } from 'react';
import { Link, NavLink, Route, Routes } from 'react-router';
import Header from './components/Header.jsx';
import { TaskDetails } from './components/TaskDetails.jsx';
import { TaskForm } from './components/TaskForm.jsx';
import { createTask, getTasks } from './services/taskApi.js';
import { PageSection } from './components/PageSection.jsx';
import { TaskList } from './components/TaskList.jsx';
import './App.css';

const FILTER_KEY = 'task-tracker-filter';
const validFilters = ['all', 'completed', 'incomplete'];

function getInitialFilter() {
  try {
    const savedFilter = localStorage.getItem(FILTER_KEY);
    return validFilters.includes(savedFilter) ? savedFilter : 'all';
  } catch {
    return 'all';
  }
}

export default function App() {
  const [tasks, setTasks] = useState([]);
  const [filter, setFilter] = useState(getInitialFilter);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    try {
      localStorage.setItem(FILTER_KEY, filter);
    } catch {
      // Filtreerimine töötab kui brauseris ei saa salvestada
    }
  }, [filter]);

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

  async function handleAddTask(title) {
    try {
      const createdTask = await createTask(title);
      setTasks((previousTasks) => [...previousTasks, createdTask]);
      setError('');
    } catch (addError) {
      setError(addError.message);
    }
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
            <PageSection title="My tasks">
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

              <TaskList
                tasks={visibleTasks}
                loading={loading}
                error={error}
                onToggle={handleToggle}
                onDelete={handleDelete}
              />
            </PageSection>
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
