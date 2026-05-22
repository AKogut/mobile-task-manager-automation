import { z } from 'zod';

export const taskPriorities = ['low', 'medium', 'high'] as const;

function isValidDate(value: string): boolean {
  const date = new Date(`${value}T00:00:00.000Z`);

  return !Number.isNaN(date.getTime()) && date.toISOString().startsWith(value);
}

export const taskSchema = z.object({
  title: z
    .string()
    .trim()
    .min(1, 'Title is required.')
    .max(80, 'Title must be 80 characters or less.'),
  description: z
    .string()
    .trim()
    .max(240, 'Description must be 240 characters or less.'),
  priority: z.enum(taskPriorities),
  dueDate: z
    .string()
    .trim()
    .min(1, 'Due date is required.')
    .regex(/^\d{4}-\d{2}-\d{2}$/, 'Use YYYY-MM-DD format.')
    .refine(isValidDate, 'Enter a valid due date.'),
});

export type TaskFormValues = z.infer<typeof taskSchema>;
