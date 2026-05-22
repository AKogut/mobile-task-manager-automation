import { taskSchema } from '@/features/tasks/taskSchema';

describe('taskSchema', () => {
  it('accepts a valid task form payload', () => {
    const result = taskSchema.safeParse({
      title: 'Create task details screen',
      description: 'Show the full task information.',
      priority: 'high',
      dueDate: '2026-06-01',
    });

    expect(result.success).toBe(true);
  });

  it('requires a title', () => {
    const result = taskSchema.safeParse({
      title: '',
      description: '',
      priority: 'medium',
      dueDate: '2026-06-01',
    });

    expect(result.success).toBe(false);
  });

  it('requires a valid due date in YYYY-MM-DD format', () => {
    const result = taskSchema.safeParse({
      title: 'Add due date support',
      description: '',
      priority: 'low',
      dueDate: '2026-02-31',
    });

    expect(result.success).toBe(false);
  });

  it('rejects unsupported priorities', () => {
    const result = taskSchema.safeParse({
      title: 'Add priority support',
      description: '',
      priority: 'urgent',
      dueDate: '2026-06-01',
    });

    expect(result.success).toBe(false);
  });
});
