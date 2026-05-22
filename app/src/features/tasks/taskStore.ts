import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

import { TASKS_STORAGE_KEY } from '@/constants/tasks';
import type { Task } from '@/features/tasks/taskTypes';

export type TaskDraft = Omit<Task, 'id' | 'completed'>;

type TaskState = {
  tasks: Task[];
  setTasks: (tasks: Task[]) => void;
  addTask: (task: TaskDraft) => Task;
  updateTask: (taskId: string, task: TaskDraft) => void;
  deleteTask: (taskId: string) => void;
  toggleTaskCompleted: (taskId: string) => void;
  clearTasks: () => void;
};

function createTaskId(): string {
  return `task-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

export const useTaskStore = create<TaskState>()(
  persist(
    set => ({
      tasks: [],

      setTasks: tasks => {
        set({ tasks });
      },

      addTask: taskDraft => {
        const task: Task = {
          id: createTaskId(),
          completed: false,
          ...taskDraft,
        };

        set(state => ({
          tasks: [task, ...state.tasks],
        }));

        return task;
      },

      updateTask: (taskId, taskDraft) => {
        set(state => ({
          tasks: state.tasks.map(task =>
            task.id === taskId ? { ...task, ...taskDraft } : task,
          ),
        }));
      },

      deleteTask: taskId => {
        set(state => ({
          tasks: state.tasks.filter(task => task.id !== taskId),
        }));
      },

      toggleTaskCompleted: taskId => {
        set(state => ({
          tasks: state.tasks.map(task =>
            task.id === taskId ? { ...task, completed: !task.completed } : task,
          ),
        }));
      },

      clearTasks: () => {
        set({ tasks: [] });
      },
    }),
    {
      name: TASKS_STORAGE_KEY,
      storage: createJSONStorage(() => AsyncStorage),
      partialize: state => ({
        tasks: state.tasks,
      }),
    },
  ),
);

export function selectHasTasks(state: TaskState): boolean {
  return state.tasks.length > 0;
}

export function selectTaskById(
  taskId: string,
): (state: TaskState) => Task | null {
  return state => state.tasks.find(task => task.id === taskId) ?? null;
}
