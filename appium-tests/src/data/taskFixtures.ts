export type TaskPriority = 'low' | 'medium' | 'high';
export type QuickDate = 'today' | 'tomorrow' | 'next-week';

export interface TaskFixture {
  title: string;
  description?: string;
  priority: TaskPriority;
  quickDate: QuickDate;
}

export const TASK_FIXTURES = {
  allFields: {
    title: 'Buy groceries',
    description: 'Milk, eggs, and bread',
    priority: 'high',
    quickDate: 'tomorrow',
  },

  minimumRequired: {
    title: 'Minimal task',
    priority: 'low',
    quickDate: 'today',
  },

  listTask: {
    title: 'New list task',
    priority: 'medium',
    quickDate: 'next-week',
  },

  noDateValidation: {
    title: 'No date task',
    priority: 'medium',
    quickDate: 'today',
  },

  longTitle: {
    title:
      'AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA',
    priority: 'low',
    quickDate: 'today',
  },

  editLowPriority: {
    title: 'Low priority task',
    priority: 'low',
    quickDate: 'today',
  },

  editNoDescription: {
    title: 'No description task',
    priority: 'medium',
    quickDate: 'today',
  },

  editListBefore: {
    title: 'Old title',
    priority: 'high',
    quickDate: 'today',
  },

  simple: {
    title: 'Buy groceries',
    priority: 'medium',
    quickDate: 'today',
  },
} as const satisfies Record<string, TaskFixture>;

export const TASK_EDIT_VALUES = {
  updatedTitle: 'Updated task title',
  addedDescription: 'Added after creation',
  newListTitle: 'New title',
} as const;
