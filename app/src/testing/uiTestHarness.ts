import AsyncStorage from '@react-native-async-storage/async-storage';

import { AUTH_STORAGE_KEY, DEMO_CREDENTIALS } from '@/constants/auth';
import { TASKS_STORAGE_KEY } from '@/constants/tasks';
import { useAuthStore } from '@/features/auth/authStore';
import { useTaskStore } from '@/features/tasks/taskStore';
import type { Task } from '@/features/tasks/taskTypes';

export type RootProps = {
  isUITest?: boolean;
  isUITestAuthed?: boolean;
  uiTestTasks?: string;
};

const PERSISTED_KEYS = [AUTH_STORAGE_KEY, TASKS_STORAGE_KEY];

const DEMO_SESSION = {
  user: {
    id: 'demo-user',
    email: DEMO_CREDENTIALS.email,
    name: 'Demo User',
  },
  token: 'demo-session-token',
} as const;

export function isUITestRun(props: RootProps): boolean {
  return props.isUITest === true;
}

export function isUITestAuthedRun(props: RootProps): boolean {
  return props.isUITestAuthed === true;
}

export function getUITestSeedTasks(props: RootProps): Task[] {
  const raw = props.uiTestTasks;

  if (raw === undefined || raw.length === 0) {
    return [];
  }

  try {
    const parsed: unknown = JSON.parse(raw);

    return Array.isArray(parsed) ? (parsed as Task[]) : [];
  } catch {
    return [];
  }
}

async function clearPersistedState(): Promise<void> {
  await Promise.all(PERSISTED_KEYS.map(key => AsyncStorage.removeItem(key)));
}

function seedAuthenticatedSession(): void {
  useAuthStore.setState({
    user: DEMO_SESSION.user,
    token: DEMO_SESSION.token,
    isSubmitting: false,
    authError: null,
  });
}

export async function bootstrapPersistence(
  isUITest: boolean,
  isUITestAuthed = false,
  seedTasks: Task[] = [],
): Promise<void> {
  if (isUITest) {
    await clearPersistedState();
  }

  await Promise.all([
    useAuthStore.persist.rehydrate(),
    useTaskStore.persist.rehydrate(),
  ]);

  if (isUITestAuthed) {
    seedAuthenticatedSession();
  }

  if (seedTasks.length > 0) {
    useTaskStore.setState({ tasks: seedTasks });
  }
}
