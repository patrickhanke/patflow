const ABSOLUTE_DATE_TIME =
  /^(\d{4})-(\d{2})-(\d{2})(?:[T ](\d{2}):(\d{2})(?::(\d{2}))?)?/;

const pad = (value: number) => String(value).padStart(2, '0');

/** Calendar day from an absolute timestamp, without applying a timezone. */
export const absoluteDateKey = (value?: string | null): string => {
  if (!value) {
    return '';
  }
  const match = value.trim().match(ABSOLUTE_DATE_TIME);
  if (!match) {
    return '';
  }
  return `${match[1]}-${match[2]}-${match[3]}`;
};

/** `2026-09-15T10:50:01`. Timezone suffixes are dropped, not converted. */
export const toAbsoluteDateTime = (value?: string | null): string => {
  if (!value) {
    return '';
  }
  const match = value.trim().match(ABSOLUTE_DATE_TIME);
  if (!match || match[4] === undefined || match[5] === undefined) {
    return value.trim();
  }
  return `${match[1]}-${match[2]}-${match[3]}T${match[4]}:${match[5]}:${match[6] ?? '00'}`;
};

/** Local Date whose components match the stored clock, not a UTC parse. */
export const absoluteDateTimeToDate = (value?: string | null): Date | null => {
  const match = toAbsoluteDateTime(value).match(ABSOLUTE_DATE_TIME);
  if (!match || match[4] === undefined || match[5] === undefined) {
    return null;
  }
  return new Date(
    Number(match[1]),
    Number(match[2]) - 1,
    Number(match[3]),
    Number(match[4]),
    Number(match[5]),
    Number(match[6] ?? '0')
  );
};

export const absoluteTimeLabel = (value?: string | null): string => {
  const normalized = toAbsoluteDateTime(value);
  const match = normalized.match(ABSOLUTE_DATE_TIME);
  if (!match || match[4] === undefined || match[5] === undefined) {
    return '--:--';
  }
  return `${match[4]}:${match[5]}`;
};

/** Keep the stored calendar day and write the clock the user picked. */
export const withAbsoluteClock = (current: string, picked: Date): string => {
  const day =
    absoluteDateKey(current) ||
    `${picked.getFullYear()}-${pad(picked.getMonth() + 1)}-${pad(picked.getDate())}`;
  return `${day}T${pad(picked.getHours())}:${pad(picked.getMinutes())}:${pad(picked.getSeconds())}`;
};

const absoluteTimestamp = (value?: string | null): number | null => {
  const match = toAbsoluteDateTime(value).match(ABSOLUTE_DATE_TIME);
  if (!match || match[4] === undefined || match[5] === undefined) {
    return null;
  }
  return Date.UTC(
    Number(match[1]),
    Number(match[2]) - 1,
    Number(match[3]),
    Number(match[4]),
    Number(match[5]),
    Number(match[6] ?? '0')
  );
};

export const absoluteDiffMs = (
  end?: string | null,
  start?: string | null
): number => {
  const endMs = absoluteTimestamp(end);
  const startMs = absoluteTimestamp(start);
  if (endMs === null || startMs === null) {
    return NaN;
  }
  return endMs - startMs;
};

export const addAbsoluteMinutes = (value: string, minutes: number): string => {
  const timestamp = absoluteTimestamp(value);
  if (timestamp === null) {
    return toAbsoluteDateTime(value);
  }
  const shifted = new Date(timestamp + minutes * 60000);
  return `${shifted.getUTCFullYear()}-${pad(shifted.getUTCMonth() + 1)}-${pad(shifted.getUTCDate())}T${pad(shifted.getUTCHours())}:${pad(shifted.getUTCMinutes())}:${pad(shifted.getUTCSeconds())}`;
};

export const normalizeDayTime = <
  T extends {
    start: string;
    end: string;
    breaks?: { start: string; end: string; id: string }[];
  }
>(
  time: T
): T => ({
  ...time,
  start: toAbsoluteDateTime(time.start),
  end: toAbsoluteDateTime(time.end),
  breaks: (time.breaks ?? []).map(breakItem => ({
    ...breakItem,
    start: toAbsoluteDateTime(breakItem.start),
    end: toAbsoluteDateTime(breakItem.end)
  }))
});
