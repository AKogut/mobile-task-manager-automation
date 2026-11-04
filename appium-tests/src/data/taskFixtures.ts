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

export const SEARCH_FIXTURES = {
  groceries: {
    title: 'Buy groceries',
    priority: 'high',
    quickDate: 'today',
  },
  milk: {
    title: 'Buy milk',
    priority: 'medium',
    quickDate: 'today',
  },
  dentist: {
    title: 'Call dentist',
    priority: 'low',
    quickDate: 'today',
  },
  rent: {
    title: 'Pay rent',
    priority: 'medium',
    quickDate: 'today',
  },
} as const satisfies Record<string, TaskFixture>;

export const STATUS_FILTER_FIXTURES = {
  openOne: {
    title: 'Plan sprint review',
    priority: 'medium',
    quickDate: 'today',
  },
  openTwo: {
    title: 'Review pull requests',
    priority: 'low',
    quickDate: 'today',
  },
  completed: {
    title: 'Ship release notes',
    priority: 'high',
    quickDate: 'today',
  },
} as const satisfies Record<string, TaskFixture>;

export const PRIORITY_FILTER_FIXTURES = {
  high: {
    title: 'High priority task',
    priority: 'high',
    quickDate: 'today',
  },
  medium: {
    title: 'Medium priority task',
    priority: 'medium',
    quickDate: 'today',
  },
  low: {
    title: 'Low priority task',
    priority: 'low',
    quickDate: 'today',
  },
} as const satisfies Record<string, TaskFixture>;

export const SORT_FIXTURES = {
  taskA: {
    title: 'Task A',
    priority: 'low',
    quickDate: 'tomorrow',
  },
  taskB: {
    title: 'Task B',
    priority: 'high',
    quickDate: 'today',
  },
  taskC: {
    title: 'Task C',
    priority: 'medium',
    quickDate: 'next-week',
  },
} as const satisfies Record<string, TaskFixture>;

export const SORT_STATUS_FIXTURES = {
  completedFirst: {
    title: 'Task A',
    priority: 'medium',
    quickDate: 'today',
  },
  open: {
    title: 'Task B',
    priority: 'medium',
    quickDate: 'next-week',
  },
  completedSecond: {
    title: 'Task C',
    priority: 'medium',
    quickDate: 'tomorrow',
  },
} as const satisfies Record<string, TaskFixture>;

export const SORT_FILTER_FIXTURES = {
  openHigh: {
    title: 'Task A',
    priority: 'high',
    quickDate: 'tomorrow',
  },
  openLow: {
    title: 'Task B',
    priority: 'low',
    quickDate: 'today',
  },
  completedHigh: {
    title: 'Task C',
    priority: 'high',
    quickDate: 'today',
  },
} as const satisfies Record<string, TaskFixture>;

export const NAVIGATION_FIXTURES = {
  existing: {
    title: 'Review navigation flows',
    description: 'Walk through every screen',
    priority: 'high',
    quickDate: 'tomorrow',
  },
  created: {
    title: 'Test navigation task',
    priority: 'medium',
    quickDate: 'today',
  },
} as const satisfies Record<string, TaskFixture>;

export const NAVIGATION_EDIT_VALUES = {
  editedTitle: 'Edited navigation task',
} as const;

export const PERSISTENCE_FIXTURES = {
  first: {
    title: 'Persist task 1',
    priority: 'medium',
    quickDate: 'today',
  },
  second: {
    title: 'Persist task 2',
    priority: 'medium',
    quickDate: 'today',
  },
  completed: {
    title: 'Persist complete',
    priority: 'medium',
    quickDate: 'today',
  },
} as const satisfies Record<string, TaskFixture>;

export const SEARCH_QUERIES = {
  exact: 'Pay rent',
  partial: 'Buy',
  caseInsensitive: 'BUY GROCERIES',
  noMatch: 'zxq7-9418',
} as const;
