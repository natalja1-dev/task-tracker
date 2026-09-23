import { Link, useParams } from 'react-router';

export function TaskDetails({ tasks }) {
  const { taskId } = useParams();
  const id = Number(taskId);
  const task = tasks.find((item) => item.id === id);

  if (!task) {
    return (
      <section>
        <h2>Task not found</h2>
        <p>There is no task with ID {taskId}.</p>
        <Link to="/tasks">Back to tasks</Link>
      </section>
    );
  }

  return (
    <section>
      <h2>{task.title}</h2>
      <p>Status: {task.completed ? 'Completed' : 'Not completed'}</p>
      <p>Task ID: {task.id}</p>
      <Link to="/tasks">Back to tasks</Link>
    </section>
  );
}
