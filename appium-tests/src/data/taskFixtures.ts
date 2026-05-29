export type TaskPriority = 'low' | 'medium' | 'high';
export type QuickDate = 'today' | 'tomorrow' | 'next-week';

export interface TaskFixture {
  title: string;
  description?: string;
  priority: TaskPriority;
  quickDate: QuickDate;
}

export const TASK_FIXTURES = {
  simple: {
    title: 'Buy groceries',
    priority: 'medium',
    quickDate: 'today',
  },

  withDescription: {
    title: 'Call dentist',
    description: 'Schedule annual check-up',
    priority: 'high',
    quickDate: 'tomorrow',
  },

  lowPriority: {
    title: 'Read a book',
    priority: 'low',
    quickDate: 'next-week',
  },

  highPriority: {
    title: 'Submit tax return',
    priority: 'high',
    quickDate: 'today',
  },

  persistence: {
    title: 'Persist task',
    priority: 'medium',
    quickDate: 'tomorrow',
  },
} as const satisfies Record<string, TaskFixture>;
