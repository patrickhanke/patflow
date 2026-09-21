import { Task } from '@types';

export const TASK_PROPERTIES = [
  'objectId',
  'title',
  'description',
  'assigned_staff',
  'dates',
  'time',
  'state',
  'images',
  'comments',
  'documents',
  'type',
  'createdAt',
  'property',
  'ticket'
];

export function normalizeAssignedStaff(value: unknown): string[] {
  if (!Array.isArray(value)) {
    return [];
  }

  return value
    .map(entry => {
      if (typeof entry === 'string') {
        return entry;
      }
      if (entry && typeof entry === 'object' && 'objectId' in entry) {
        const id = (entry as { objectId?: unknown }).objectId;
        return typeof id === 'string' ? id : null;
      }
      return null;
    })
    .filter((id): id is string => Boolean(id));
}

function toDateString(value: unknown): string | null {
  if (typeof value !== 'string' || value.length === 0) {
    return null;
  }
  return value;
}

export function normalizeTaskDates(task: Record<string, unknown>): string[] {
  const fromDates = Array.isArray(task.dates)
    ? task.dates.map(toDateString).filter((d): d is string => Boolean(d))
    : [];
  if (fromDates.length > 0) {
    return fromDates;
  }

  const time = task.time as
    | { next_dates?: unknown; dates?: unknown }
    | undefined;

  const fromNext = Array.isArray(time?.next_dates)
    ? time.next_dates.map(toDateString).filter((d): d is string => Boolean(d))
    : [];
  if (fromNext.length > 0) {
    return fromNext;
  }

  const fromTimeDates = Array.isArray(time?.dates)
    ? time.dates.map(toDateString).filter((d): d is string => Boolean(d))
    : [];
  return fromTimeDates;
}

export function normalizeTask(task: Record<string, unknown>): Task {
  return {
    ...(task as unknown as Task),
    assigned_staff: normalizeAssignedStaff(task.assigned_staff),
    dates: normalizeTaskDates(task)
  };
}

export function mapTaskFromParseJson(
  full: Record<string, unknown>,
  properties: string[] = TASK_PROPERTIES
): Task {
  const filtered = Object.fromEntries(
    Object.entries(full).filter(([key]) => properties.includes(key))
  );
  return normalizeTask(filtered);
}
