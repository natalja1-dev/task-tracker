import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router';
import { afterEach, describe, expect, test, vi } from 'vitest';
import { TaskCard } from './TaskCard.jsx';

const task = {
  id: 2,
  title: 'Practise React state',
  completed: false,
};

function renderTaskCard(onDelete = vi.fn()) {
  render(
    <MemoryRouter>
      <TaskCard task={task} onToggle={vi.fn()} onDelete={onDelete} />
    </MemoryRouter>,
  );
}

afterEach(() => {
  cleanup();
});

describe('TaskCard', () => {
  test('displays the supplied task title', () => {
    renderTaskCard();

    expect(screen.getByText('Practise React state')).toBeTruthy();
  });

  test('calls onDelete with the task ID when Delete is clicked', () => {
    const onDelete = vi.fn();
    renderTaskCard(onDelete);

    fireEvent.click(screen.getByRole('button', { name: /delete/i }));

    expect(onDelete).toHaveBeenCalledExactlyOnceWith(2);
  });
});
