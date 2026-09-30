const API_URL = import.meta.env.VITE_API_URL;

export async function getTasks() {
  const response = await fetch(`${API_URL}/api/tasks`);

  if (!response.ok) {
    throw new Error('Could not load tasks');
  }

  return response.json();
}

export async function createTask(title) {
  const response = await fetch(`${API_URL}/api/tasks`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ title }),
  });

  if (!response.ok) {
    throw new Error('Could not add task');
  }

  return response.json();
}
