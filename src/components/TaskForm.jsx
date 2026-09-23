import { useState } from 'react';

export function TaskForm({ onAddTask }) {
  const [title, setTitle] = useState('');
  const [error, setError] = useState('');

  function handleSubmit(event) {
    event.preventDefault();

    const trimmedTitle = title.trim();

    if (trimmedTitle === '') {
      setError('Please enter a task title.');
      return;
    }

    onAddTask(trimmedTitle);
    setTitle('');
    setError('');
  }

  return (
    <form onSubmit={handleSubmit}>
      <label htmlFor="task-title">Task title</label>
      <input
        id="task-title"
        type="text"
        value={title}
        onChange={(event) => {
          setTitle(event.target.value);
          setError('');
        }}
        aria-invalid={error ? true : undefined}
        aria-describedby={error ? 'task-title-error' : undefined}
      />
      <button type="submit">Add task</button>
      {error && (
        <p id="task-title-error" role="alert">
          {error}
        </p>
      )}
    </form>
  );
}
