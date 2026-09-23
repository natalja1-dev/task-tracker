import { TaskCard } from './TaskCard.jsx';

export function TaskList({ tasks, loading, error, onToggle, onDelete }) {
  if (loading) {
    return <p>Loading tasks...</p>;
  }

  if (error) {
    return <p role="alert">Could not load tasks: {error}</p>;
  }

  if (tasks.length === 0) {
    return <p>No tasks found</p>;
  }

  return tasks.map((task) => (
    <TaskCard
      key={task.id}
      task={task}
      onToggle={onToggle}
      onDelete={onDelete}
    />
  ));
}
