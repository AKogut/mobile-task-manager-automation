import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

import { TASKS_STORAGE_KEY } from '@/constants/tasks';
import type { Task } from '@/features/tasks/taskTypes';

type TaskState = {
  tasks: Task[];
  setTasks: (tasks: Task[]) => void;
  clearTasks: () => void;
};

export const useTaskStore = create<TaskState>()(
  persist(
    set => ({
      tasks: [],

      setTasks: tasks => {
        set({ tasks });
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
