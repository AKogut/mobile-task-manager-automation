import type { TaskPriority } from '@/features/tasks/taskTypes';
import type { Palette } from '@/theme/palette';

export const priorityRank: Record<TaskPriority, number> = {
  low: 1,
  medium: 2,
  high: 3,
};

export function formatPriorityLabel(priority: TaskPriority): string {
  return `${priority.charAt(0).toUpperCase()}${priority.slice(1)}`;
}

export function getPriorityColors(
  priority: TaskPriority,
  palette: Palette,
): {
  background: string;
  border: string;
  text: string;
  accent: string;
} {
  if (priority === 'high') {
    return {
      background: palette.priorityHighBackground,
      border: palette.priorityHighBorder,
      text: palette.priorityHighText,
      accent: palette.priorityHighText,
    };
  }

  if (priority === 'medium') {
    return {
      background: palette.priorityMediumBackground,
      border: palette.priorityMediumBorder,
      text: palette.priorityMediumText,
      accent: palette.priorityMediumText,
    };
  }

  return {
    background: palette.priorityLowBackground,
    border: palette.priorityLowBorder,
    text: palette.priorityLowText,
    accent: palette.priorityLowText,
  };
}
