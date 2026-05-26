export type CalendarDate = {
  key: string;
  date: Date;
  day: number;
  isCurrentMonth: boolean;
};

export type DueDateParts = {
  weekday: string;
  month: string;
  day: string;
  year: string;
};

const millisecondsPerDay = 24 * 60 * 60 * 1000;

export function addDays(date: Date, days: number): Date {
  const nextDate = new Date(date);
  nextDate.setDate(nextDate.getDate() + days);

  return nextDate;
}

export function addMonths(date: Date, months: number): Date {
  const nextDate = new Date(date);
  nextDate.setMonth(nextDate.getMonth() + months);

  return nextDate;
}

export function formatDateInputValue(date: Date): string {
  const year = date.getFullYear();
  const month = `${date.getMonth() + 1}`.padStart(2, '0');
  const day = `${date.getDate()}`.padStart(2, '0');

  return `${year}-${month}-${day}`;
}

export function parseDateInputValue(value: string): Date | null {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value);

  if (!match) {
    return null;
  }

  const year = Number(match[1]);
  const month = Number(match[2]);
  const day = Number(match[3]);
  const date = new Date(year, month - 1, day);

  if (
    date.getFullYear() !== year ||
    date.getMonth() !== month - 1 ||
    date.getDate() !== day
  ) {
    return null;
  }

  return date;
}

export function parseUtcDueDate(dueDate: string): Date | null {
  const date = new Date(`${dueDate}T00:00:00.000Z`);

  if (Number.isNaN(date.getTime())) {
    return null;
  }

  return new Date(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate());
}

export function startOfToday(): Date {
  const today = new Date();

  return new Date(today.getFullYear(), today.getMonth(), today.getDate());
}

export function startOfMonth(date: Date): Date {
  return new Date(date.getFullYear(), date.getMonth(), 1);
}

export function formatCalendarMonth(date: Date): string {
  return date.toLocaleDateString('en-US', {
    month: 'long',
    year: 'numeric',
  });
}

export function getCalendarDates(visibleMonth: Date): CalendarDate[] {
  const monthStart = startOfMonth(visibleMonth);
  const gridStart = addDays(monthStart, -monthStart.getDay());

  return Array.from({ length: 42 }, (_, index) => {
    const date = addDays(gridStart, index);

    return {
      key: formatDateInputValue(date),
      date,
      day: date.getDate(),
      isCurrentMonth: date.getMonth() === visibleMonth.getMonth(),
    };
  });
}

export function getDaysUntilDue(dueDate: string): number | null {
  const date = parseUtcDueDate(dueDate);

  if (!date) {
    return null;
  }

  return Math.round(
    (date.getTime() - startOfToday().getTime()) / millisecondsPerDay,
  );
}

export function formatDueLabel(dueDate: string): string {
  const days = getDaysUntilDue(dueDate);

  if (days === null) {
    return 'No due date';
  }

  if (days === 0) {
    return 'Due today';
  }

  if (days === 1) {
    return 'Due tomorrow';
  }

  if (days > 1) {
    return `Due in ${days} days`;
  }

  return 'Overdue';
}

export function formatDaysRemaining(dueDate: string): string {
  const days = getDaysUntilDue(dueDate);

  if (days === null) {
    return 'No deadline';
  }

  if (days === 0) {
    return 'Due today';
  }

  if (days === 1) {
    return '1 day left';
  }

  if (days > 1) {
    return `${days} days left`;
  }

  return `Overdue by ${Math.abs(days)} day${days === -1 ? '' : 's'}`;
}

export function formatDueDateParts(dueDate: string): DueDateParts {
  const date = new Date(`${dueDate}T00:00:00.000Z`);

  if (Number.isNaN(date.getTime())) {
    return {
      weekday: 'Due',
      month: 'Date',
      day: '--',
      year: dueDate,
    };
  }

  return {
    weekday: date.toLocaleDateString('en-US', {
      weekday: 'short',
      timeZone: 'UTC',
    }),
    month: date.toLocaleDateString('en-US', {
      month: 'short',
      timeZone: 'UTC',
    }),
    day: date.toLocaleDateString('en-US', {
      day: '2-digit',
      timeZone: 'UTC',
    }),
    year: date.toLocaleDateString('en-US', {
      year: 'numeric',
      timeZone: 'UTC',
    }),
  };
}
