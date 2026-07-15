import type { QuickDate, TaskFixture, TaskPriority } from './taskFixtures';

export interface SeededTask {
  id: string;
  title: string;
  description: string;
  priority: TaskPriority;
  dueDate: string;
  completed: boolean;
  createdAt: string;
}

export interface SeedOptions {
  completedTitles?: readonly string[];
}

function pad(value: number): string {
  return String(value).padStart(2, '0');
}

function formatDateInputValue(date: Date): string {
  const year = String(date.getFullYear());
  const month = pad(date.getMonth() + 1);
  const day = pad(date.getDate());

  return `${year}-${month}-${day}`;
}

function addDays(date: Date, days: number): Date {
  const next = new Date(date);
  next.setDate(next.getDate() + days);

  return next;
}

function resolveDueDate(quickDate: QuickDate): string {
  const now = new Date();

  if (quickDate === 'tomorrow') {
    return formatDateInputValue(addDays(now, 1));
  }

  if (quickDate === 'next-week') {
    return formatDateInputValue(addDays(now, 7));
  }

  return formatDateInputValue(now);
}

export function buildSeededTasks(
  fixtures: readonly TaskFixture[],
  options: SeedOptions = {},
): SeededTask[] {
  const completedTitles = new Set(options.completedTitles ?? []);
  const baseTime = Date.now();

  const created = fixtures.map((fixture, index) => ({
    id: `seed-${String(baseTime)}-${String(index)}`,
    title: fixture.title,
    description: fixture.description ?? '',
    priority: fixture.priority,
    dueDate: resolveDueDate(fixture.quickDate),
    completed: completedTitles.has(fixture.title),
    createdAt: new Date(baseTime + index * 1000).toISOString(),
  }));

  return created.reverse();
}

export function serializeSeededTasks(
  fixtures: readonly TaskFixture[],
  options?: SeedOptions,
): string {
  return JSON.stringify(buildSeededTasks(fixtures, options));
}
