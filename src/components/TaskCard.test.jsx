import { afterEach, expect, test, vi } from 'vitest';
import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router';
import { TaskCard } from './TaskCard.jsx';

afterEach(cleanup);

const task = {
  id: 2,
  title: 'Practise React state',
  completed: false,
};

function renderTaskCard(onToggle = vi.fn()) {
  render(
    <MemoryRouter>
      <TaskCard task={task} onToggle={onToggle} onDelete={vi.fn()} />
    </MemoryRouter>,
  );

  return onToggle;
}

test('displays the supplied task title', () => {
  renderTaskCard();

  expect(
    screen.getByRole('link', { name: 'Practise React state' }),
  ).toBeTruthy();
});

test('calls onToggle with the task ID when clicked', () => {
  const onToggle = renderTaskCard();

  fireEvent.click(screen.getByRole('button', { name: 'Toggle completion' }));

  expect(onToggle).toHaveBeenCalledOnce();
  expect(onToggle).toHaveBeenCalledWith(2);
});
