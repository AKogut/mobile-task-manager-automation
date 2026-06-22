import AsyncStorage from '@react-native-async-storage/async-storage';

import { AUTH_STORAGE_KEY } from '@/constants/auth';
import { TASKS_STORAGE_KEY } from '@/constants/tasks';
import { useAuthStore } from '@/features/auth/authStore';
import { useTaskStore } from '@/features/tasks/taskStore';

export type RootProps = {
  isUITest?: boolean;
};

const PERSISTED_KEYS = [AUTH_STORAGE_KEY, TASKS_STORAGE_KEY];

export function isUITestRun(props: RootProps): boolean {
  return props.isUITest === true;
}

async function clearPersistedState(): Promise<void> {
  await Promise.all(PERSISTED_KEYS.map(key => AsyncStorage.removeItem(key)));
}

export async function bootstrapPersistence(isUITest: boolean): Promise<void> {
  if (isUITest) {
    await clearPersistedState();
  }

  await Promise.all([
    useAuthStore.persist.rehydrate(),
    useTaskStore.persist.rehydrate(),
  ]);
}
