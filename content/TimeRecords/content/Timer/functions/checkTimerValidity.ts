import type { Break } from '../types';

export type TimerHandlerValue = 'start' | 'pause' | 'continue' | 'end';

type Params = {
  start: Date | undefined;
  breaks: Break[];
  end: Date | undefined;
  timerHandlerValue: TimerHandlerValue;
  now: Date;
};

const breaksEqual = (a: Break[], b: Break[]): boolean => {
  if (a.length !== b.length) return false;
  return a.every(
    (item, i) =>
      item.id === b[i].id && item.start === b[i].start && item.end === b[i].end
  );
};

const isBreakWithinTimer = (
  b: Break,
  startMs: number,
  endMs: number
): boolean => {
  if (startMs >= endMs) return false;

  const breakStartMs = new Date(b.start).getTime();
  if (Number.isNaN(breakStartMs)) return false;
  if (breakStartMs <= startMs || breakStartMs >= endMs) return false;

  if (b.end) {
    const breakEndMs = new Date(b.end).getTime();
    if (Number.isNaN(breakEndMs)) return false;
    if (breakEndMs <= startMs || breakEndMs >= endMs) return false;
    if (breakEndMs < breakStartMs) return false;
  }

  return true;
};

/**
 * Drops breaks whose intervals overlap a previously kept break (sorted by start).
 * Open-ended breaks use `nowMs` capped by the timer end for their effective end.
 */
const removeOverlappingBreaks = (
  breaks: Break[],
  nowMs: number,
  timerEndMs: number
): Break[] => {
  const sorted = [...breaks].sort(
    (a, b) => new Date(a.start).getTime() - new Date(b.start).getTime()
  );

  const result: Break[] = [];
  let lastEndMs = -Infinity;

  for (const b of sorted) {
    const breakStartMs = new Date(b.start).getTime();
    const breakEndMs = b.end
      ? new Date(b.end).getTime()
      : Math.min(nowMs, timerEndMs);

    if (Number.isNaN(breakStartMs) || Number.isNaN(breakEndMs)) continue;
    if (breakStartMs >= lastEndMs) {
      result.push(b);
      lastEndMs = breakEndMs;
    }
  }

  return result;
};

/**
 * Keeps breaks whose start and (when set) end fall strictly after the timer
 * start and strictly before the timer end. Drops breaks outside that window,
 * then drops breaks that overlap another break.
 */
const checkTimerValidity = ({
  start,
  breaks,
  end,
  timerHandlerValue: value,
  now
}: Params): { breaks: Break[]; changed: boolean } => {
  let startMs: number;
  let endMs: number;

  if (value === 'start') {
    startMs = now.getTime();
    endMs = now.getTime();
  } else if (!start) {
    return { breaks, changed: false };
  } else {
    startMs = start.getTime();
    endMs = value === 'end' ? now.getTime() : (end ?? now).getTime();
  }

  const nowMs = now.getTime();
  const inWindow = breaks.filter(b => isBreakWithinTimer(b, startMs, endMs));
  const filtered = removeOverlappingBreaks(inWindow, nowMs, endMs);
  return {
    breaks: filtered,
    changed: !breaksEqual(filtered, breaks)
  };
};

export default checkTimerValidity;
