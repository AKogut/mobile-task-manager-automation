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

  it('adds a new incomplete task to the top of the list', () => {
    const sampleTask = sampleTasks[0];

    if (!sampleTask) {
      throw new Error('Expected sample task');
    }

    useTaskStore.getState().setTasks(sampleTasks);

    const task = useTaskStore.getState().addTask({
      title: 'Create add screen',
      description: 'Allow users to create tasks.',
      priority: 'medium',
      dueDate: '2026-06-02',
    });

    const state = useTaskStore.getState();
    expect(task.id).toMatch(/^task-/);
    expect(task.completed).toBe(false);
    expect(state.tasks[0]).toEqual(task);
    expect(state.tasks[1]).toEqual(sampleTask);
  });

  it('updates an existing task without changing completion state', () => {
    const sampleTask = sampleTasks[0];

    if (!sampleTask) {
      throw new Error('Expected sample task');
    }

    useTaskStore.getState().setTasks([{ ...sampleTask, completed: true }]);

    useTaskStore.getState().updateTask('task-1', {
      title: 'Updated task',
      description: 'Updated description.',
      priority: 'low',
      dueDate: '2026-06-03',
    });

    const task = useTaskStore.getState().tasks[0];
    expect(task).toEqual({
      id: 'task-1',
      title: 'Updated task',
      description: 'Updated description.',
      priority: 'low',
      dueDate: '2026-06-03',
      completed: true,
    });
  });

  it('toggles task completion', () => {
    useTaskStore.getState().setTasks(sampleTasks);

    useTaskStore.getState().toggleTaskCompleted('task-1');
    expect(useTaskStore.getState().tasks[0]?.completed).toBe(true);

    useTaskStore.getState().toggleTaskCompleted('task-1');
    expect(useTaskStore.getState().tasks[0]?.completed).toBe(false);
  });

  it('deletes a task', () => {
    useTaskStore.getState().setTasks(sampleTasks);

    useTaskStore.getState().deleteTask('task-1');

    expect(useTaskStore.getState().tasks).toEqual([]);
  });

  it('persists only the task list', async () => {
    useTaskStore.getState().setTasks(sampleTasks);
    await waitForPersistedState();

    const persistedState = await AsyncStorage.getItem(TASKS_STORAGE_KEY);

    expect(persistedState).toContain('Write test plan');
    expect(persistedState).toContain('task-1');
    expect(persistedState).not.toContain('setTasks');
    expect(persistedState).not.toContain('addTask');
    expect(persistedState).not.toContain('updateTask');
    expect(persistedState).not.toContain('deleteTask');
    expect(persistedState).not.toContain('toggleTaskCompleted');
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
