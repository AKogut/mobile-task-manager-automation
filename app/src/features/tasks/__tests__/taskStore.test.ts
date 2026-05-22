import AsyncStorage from '@react-native-async-storage/async-storage';

import { TASKS_STORAGE_KEY } from '@/constants/tasks';
import { selectHasTasks, useTaskStore } from '@/features/tasks/taskStore';
import type { Task } from '@/features/tasks/taskTypes';

const sampleTasks: Task[] = [
  {
    id: 'task-1',
    title: 'Write test plan',
    description: 'Cover the happy path for task management.',
    priority: 'high',
    dueDate: '2026-06-01',
    completed: false,
  },
];

const initialTaskState = {
  tasks: [],
};

async function waitForPersistedState(): Promise<void> {
  await new Promise(resolve => {
    setTimeout(() => {
      resolve(undefined);
    }, 0);
  });
}

describe('taskStore', () => {
  beforeEach(async () => {
    await AsyncStorage.clear();
    useTaskStore.setState(initialTaskState);
  });

  it('starts with an empty task list', () => {
    const state = useTaskStore.getState();

    expect(state.tasks).toEqual([]);
    expect(selectHasTasks(state)).toBe(false);
  });

  it('stores tasks and marks the list as non-empty', () => {
    useTaskStore.getState().setTasks(sampleTasks);

    const state = useTaskStore.getState();
    expect(state.tasks).toEqual(sampleTasks);
    expect(selectHasTasks(state)).toBe(true);
  });

  it('persists only the task list', async () => {
    useTaskStore.getState().setTasks(sampleTasks);
    await waitForPersistedState();

    const persistedState = await AsyncStorage.getItem(TASKS_STORAGE_KEY);

    expect(persistedState).toContain('Write test plan');
    expect(persistedState).toContain('task-1');
    expect(persistedState).not.toContain('setTasks');
    expect(persistedState).not.toContain('clearTasks');
  });

  it('clears all tasks', () => {
    useTaskStore.getState().setTasks(sampleTasks);

    useTaskStore.getState().clearTasks();

    const state = useTaskStore.getState();
    expect(state.tasks).toEqual([]);
    expect(selectHasTasks(state)).toBe(false);
  });
});
