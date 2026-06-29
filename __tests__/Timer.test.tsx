import checkTimerValidity from '../content/TimeRecords/content/Timer/functions/checkTimerValidity';
import {
  convertMillisecondsToString,
  getStringFromDate
} from '../src/provider/functions/dateTimeHelpers';
import formatDateToISO from '../src/provider/functions/formatDateToIso';
import { DayTime } from '../src/types/Data';

describe('Timer Time Calculation Tests', () => {
  describe('convertMillisecondsToString', () => {
    it('should correctly format milliseconds to time string without seconds', () => {
      expect(convertMillisecondsToString(0)).toBe(' 0.00');
      expect(convertMillisecondsToString(60000)).toBe(' 0.01'); // 1 minute
      expect(convertMillisecondsToString(3600000)).toBe(' 1.00'); // 1 hour
      expect(convertMillisecondsToString(3661000)).toBe(' 1.01'); // 1 hour 1 minute 1 second
      expect(convertMillisecondsToString(36000000)).toBe(' 10.00'); // 10 hours
    });

    it('should correctly format milliseconds with seconds', () => {
      expect(convertMillisecondsToString(0, true)).toBe('0.00.00');
      expect(convertMillisecondsToString(1000, true)).toBe('0.00.01'); // 1 second
      expect(convertMillisecondsToString(60000, true)).toBe('0.01.00'); // 1 minute
      expect(convertMillisecondsToString(61000, true)).toBe('0.01.01'); // 1 minute 1 second
      expect(convertMillisecondsToString(3661000, true)).toBe('1.01.01'); // 1 hour 1 minute 1 second
    });

    it('should correctly format milliseconds with seconds and double digits', () => {
      expect(convertMillisecondsToString(0, true, true)).toBe('00.00.00');
      expect(convertMillisecondsToString(1000, true, true)).toBe('00.00.01');
      expect(convertMillisecondsToString(3661000, true, true)).toBe('01.01.01');
      expect(convertMillisecondsToString(36000000, true, true)).toBe(
        '10.00.00'
      );
    });

    it('should handle negative values', () => {
      expect(convertMillisecondsToString(-3661000, true)).toBe('-1.01.01');
      expect(convertMillisecondsToString(-60000)).toBe('-0.01');
    });

    it('should round down partial seconds', () => {
      expect(convertMillisecondsToString(1500, true)).toBe('0.00.01'); // 1.5 seconds rounds to 1
      expect(convertMillisecondsToString(59999, true)).toBe('0.00.59'); // 59.999 seconds rounds to 59
    });
  });

  describe('formatDateToISO', () => {
    it('should format date to ISO string correctly', () => {
      const date = new Date('2024-03-15T14:30:45');
      const result = formatDateToISO(date);
      expect(result).toMatch(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}$/);
      expect(result).toBe('2024-03-15T14:30:45');
    });

    it('should handle single digit months and days with zero padding', () => {
      const date = new Date('2024-01-05T09:05:03');
      const result = formatDateToISO(date);
      expect(result).toBe('2024-01-05T09:05:03');
    });

    it('should handle midnight correctly', () => {
      const date = new Date('2024-03-15T00:00:00');
      const result = formatDateToISO(date);
      expect(result).toBe('2024-03-15T00:00:00');
    });
  });

  describe('getStringFromDate - ISSUE DETECTED', () => {
    it('should format a valid date correctly', () => {
      const date = new Date('2024-03-15T14:30:45');
      const result = getStringFromDate(date);
      // This should match ISO format with T separator
      expect(result).toMatch(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}$/);
    });

    it('should throw error for null/undefined date (BUG NOW FIXED)', () => {
      // The bug has been fixed - function now correctly throws an error
      // when called with null/undefined instead of creating epoch time
      expect(() => getStringFromDate(null as any)).toThrow(
        'getStringFromDate called with null or undefined date'
      );
      expect(() => getStringFromDate(undefined as any)).toThrow(
        'getStringFromDate called with null or undefined date'
      );
    });
  });

  describe('checkTimerValidity', () => {
    const createBreak = (start: Date, end?: Date) => ({
      id: start.toISOString(),
      start: `${start.getFullYear()}-${String(start.getMonth() + 1).padStart(2, '0')}-${String(start.getDate()).padStart(2, '0')}T${String(start.getHours()).padStart(2, '0')}:${String(start.getMinutes()).padStart(2, '0')}:${String(start.getSeconds()).padStart(2, '0')}`,
      end: end
        ? `${end.getFullYear()}-${String(end.getMonth() + 1).padStart(2, '0')}-${String(end.getDate()).padStart(2, '0')}T${String(end.getHours()).padStart(2, '0')}:${String(end.getMinutes()).padStart(2, '0')}:${String(end.getSeconds()).padStart(2, '0')}`
        : ''
    });

    it('should keep valid breaks within timer range', () => {
      const start = new Date('2024-03-15T10:00:00');
      const now = new Date('2024-03-15T12:00:00');
      const breaks = [
        createBreak(
          new Date('2024-03-15T10:30:00'),
          new Date('2024-03-15T10:45:00')
        )
      ];

      const result = checkTimerValidity({
        start,
        breaks,
        end: undefined,
        timerHandlerValue: 'pause',
        now
      });

      expect(result.breaks).toHaveLength(1);
      expect(result.changed).toBe(false);
    });

    it('should remove breaks that start before timer start', () => {
      const start = new Date('2024-03-15T10:00:00');
      const now = new Date('2024-03-15T12:00:00');
      const breaks = [
        createBreak(
          new Date('2024-03-15T09:30:00'),
          new Date('2024-03-15T09:45:00')
        )
      ];

      const result = checkTimerValidity({
        start,
        breaks,
        end: undefined,
        timerHandlerValue: 'pause',
        now
      });

      expect(result.breaks).toHaveLength(0);
      expect(result.changed).toBe(true);
    });

    it('should remove breaks that end after timer end', () => {
      const start = new Date('2024-03-15T10:00:00');
      const end = new Date('2024-03-15T12:00:00');
      const now = new Date('2024-03-15T12:00:00');
      const breaks = [
        createBreak(
          new Date('2024-03-15T11:30:00'),
          new Date('2024-03-15T12:30:00')
        )
      ];

      const result = checkTimerValidity({
        start,
        breaks,
        end,
        timerHandlerValue: 'end',
        now
      });

      expect(result.breaks).toHaveLength(0);
      expect(result.changed).toBe(true);
    });

    it('should remove overlapping breaks, keeping the first one', () => {
      const start = new Date('2024-03-15T10:00:00');
      const now = new Date('2024-03-15T12:00:00');
      const breaks = [
        createBreak(
          new Date('2024-03-15T10:30:00'),
          new Date('2024-03-15T11:00:00')
        ),
        createBreak(
          new Date('2024-03-15T10:45:00'),
          new Date('2024-03-15T11:15:00')
        ) // overlaps
      ];

      const result = checkTimerValidity({
        start,
        breaks,
        end: undefined,
        timerHandlerValue: 'pause',
        now
      });

      expect(result.breaks).toHaveLength(1);
      expect(result.changed).toBe(true);
    });

    it('should keep multiple non-overlapping breaks', () => {
      const start = new Date('2024-03-15T10:00:00');
      const now = new Date('2024-03-15T12:00:00');
      const breaks = [
        createBreak(
          new Date('2024-03-15T10:30:00'),
          new Date('2024-03-15T10:45:00')
        ),
        createBreak(
          new Date('2024-03-15T11:00:00'),
          new Date('2024-03-15T11:15:00')
        )
      ];

      const result = checkTimerValidity({
        start,
        breaks,
        end: undefined,
        timerHandlerValue: 'pause',
        now
      });

      expect(result.breaks).toHaveLength(2);
      expect(result.changed).toBe(false);
    });

    it('should handle breaks without end time (ongoing break)', () => {
      const start = new Date('2024-03-15T10:00:00');
      const now = new Date('2024-03-15T12:00:00');
      const breaks = [createBreak(new Date('2024-03-15T11:30:00'))];

      const result = checkTimerValidity({
        start,
        breaks,
        end: undefined,
        timerHandlerValue: 'pause',
        now
      });

      expect(result.breaks).toHaveLength(1);
      expect(result.changed).toBe(false);
    });

    it('should handle start action with empty breaks', () => {
      const now = new Date('2024-03-15T10:00:00');
      const result = checkTimerValidity({
        start: undefined,
        breaks: [],
        end: undefined,
        timerHandlerValue: 'start',
        now
      });

      expect(result.breaks).toHaveLength(0);
      expect(result.changed).toBe(false);
    });
  });

  describe('Timer Duration Calculation - Integration Test', () => {
    it('should calculate correct working time with no breaks', () => {
      const start = new Date('2024-03-15T10:00:00');
      const now = new Date('2024-03-15T12:00:00');
      const breaks: DayTime['breaks'] = [];

      // Simulate timer end calculation from Timer.tsx line 136-143
      const pauseDuration = breaks.reduce((acc, cur) => {
        if (cur.end) {
          return (
            acc + new Date(cur.end).getTime() - new Date(cur.start).getTime()
          );
        }
        return acc;
      }, 0);

      const totalDuration = now.getTime() - start.getTime();
      const workingTime = totalDuration - pauseDuration;

      expect(workingTime).toBe(2 * 60 * 60 * 1000); // 2 hours in milliseconds
      expect(convertMillisecondsToString(workingTime, true, true)).toBe(
        '02.00.00'
      );
    });

    it('should calculate correct working time with one break', () => {
      const start = new Date('2024-03-15T10:00:00');
      const now = new Date('2024-03-15T12:00:00');
      const breaks: DayTime['breaks'] = [
        {
          id: '1',
          start: '2024-03-15T10:30:00',
          end: '2024-03-15T10:45:00' // 15 minute break
        }
      ];

      const pauseDuration = breaks.reduce((acc, cur) => {
        if (cur.end) {
          return (
            acc + new Date(cur.end).getTime() - new Date(cur.start).getTime()
          );
        }
        return acc;
      }, 0);

      const totalDuration = now.getTime() - start.getTime();
      const workingTime = totalDuration - pauseDuration;

      expect(pauseDuration).toBe(15 * 60 * 1000); // 15 minutes
      expect(workingTime).toBe(2 * 60 * 60 * 1000 - 15 * 60 * 1000); // 2 hours - 15 minutes
      expect(convertMillisecondsToString(workingTime, true, true)).toBe(
        '01.45.00'
      );
    });

    it('should calculate correct working time with multiple breaks', () => {
      const start = new Date('2024-03-15T08:00:00');
      const now = new Date('2024-03-15T17:00:00');
      const breaks: DayTime['breaks'] = [
        {
          id: '1',
          start: '2024-03-15T10:00:00',
          end: '2024-03-15T10:15:00' // 15 minute break
        },
        {
          id: '2',
          start: '2024-03-15T12:00:00',
          end: '2024-03-15T13:00:00' // 1 hour lunch
        },
        {
          id: '3',
          start: '2024-03-15T15:00:00',
          end: '2024-03-15T15:10:00' // 10 minute break
        }
      ];

      const pauseDuration = breaks.reduce((acc, cur) => {
        if (cur.end) {
          return (
            acc + new Date(cur.end).getTime() - new Date(cur.start).getTime()
          );
        }
        return acc;
      }, 0);

      const totalDuration = now.getTime() - start.getTime();
      const workingTime = totalDuration - pauseDuration;

      expect(pauseDuration).toBe((15 + 60 + 10) * 60 * 1000); // 1 hour 25 minutes
      expect(workingTime).toBe(9 * 60 * 60 * 1000 - 85 * 60 * 1000); // 9 hours - 1h25m = 7h35m
      expect(convertMillisecondsToString(workingTime, true, true)).toBe(
        '07.35.00'
      );
    });

    it('should NOT count ongoing breaks in pause duration at timer end', () => {
      const breaks: DayTime['breaks'] = [
        {
          id: '1',
          start: '2024-03-15T10:30:00',
          end: '2024-03-15T10:45:00' // 15 minute completed break
        },
        {
          id: '2',
          start: '2024-03-15T11:30:00',
          end: '' // ongoing break - should NOT be counted
        }
      ];

      // This is the actual logic from Timer.tsx line 136-143
      const pauseDuration = breaks.reduce((acc, cur) => {
        if (cur.end) {
          return (
            acc + new Date(cur.end).getTime() - new Date(cur.start).getTime()
          );
        }
        return acc;
      }, 0);

      expect(pauseDuration).toBe(15 * 60 * 1000); // Only the completed break
    });

    it('should handle breaks that span across hours correctly', () => {
      const start = new Date('2024-03-15T09:45:00');
      const now = new Date('2024-03-15T11:15:00');
      const breaks: DayTime['breaks'] = [
        {
          id: '1',
          start: '2024-03-15T09:50:00',
          end: '2024-03-15T10:10:00' // 20 minutes crossing the hour
        }
      ];

      const pauseDuration = breaks.reduce((acc, cur) => {
        if (cur.end) {
          return (
            acc + new Date(cur.end).getTime() - new Date(cur.start).getTime()
          );
        }
        return acc;
      }, 0);

      const totalDuration = now.getTime() - start.getTime();
      const workingTime = totalDuration - pauseDuration;

      expect(pauseDuration).toBe(20 * 60 * 1000);
      expect(totalDuration).toBe(90 * 60 * 1000); // 1 hour 30 minutes
      expect(workingTime).toBe(70 * 60 * 1000); // 1 hour 10 minutes
      expect(convertMillisecondsToString(workingTime, true, true)).toBe(
        '01.10.00'
      );
    });
  });

  describe('DisplayTime Logic - Timer Calculation Simulation', () => {
    const simulateGetCurrentTimer = (
      start: Date | undefined,
      breaks: DayTime['breaks'],
      now: Date
    ) => {
      let currentDuration = 0;
      let pauseDuration = 0;
      let pauseTime = 0;

      if (start) {
        if (breaks.length > 0) {
          pauseDuration = breaks.reduce((acc, cur) => {
            if (cur.end) {
              return (
                acc +
                new Date(cur.end).getTime() -
                new Date(cur.start).getTime()
              );
            }
            return acc;
          }, 0);

          pauseTime = breaks.reduce((acc, cur) => {
            if (cur.end) {
              return (
                acc +
                new Date(cur.end).getTime() -
                new Date(cur.start).getTime()
              );
            } else if (!cur.end) {
              return acc + now.getTime() - new Date(cur.start).getTime();
            }
            return acc;
          }, 0);
        }
        const lastIndex = breaks.length - 1;
        if (
          lastIndex >= 0 &&
          !breaks[lastIndex].end &&
          breaks[lastIndex].start
        ) {
          currentDuration =
            new Date(breaks[lastIndex].start).getTime() - start.getTime();
        } else {
          currentDuration = now.getTime() - start.getTime();
        }
      }

      return {
        time: currentDuration - pauseDuration || 0,
        pause: pauseTime || 0
      };
    };

    it('should calculate zero time when no timer is started', () => {
      const result = simulateGetCurrentTimer(undefined, [], new Date());
      expect(result.time).toBe(0);
      expect(result.pause).toBe(0);
    });

    it('should calculate working time correctly with no breaks', () => {
      const start = new Date('2024-03-15T10:00:00');
      const now = new Date('2024-03-15T10:30:00');
      const result = simulateGetCurrentTimer(start, [], now);

      expect(result.time).toBe(30 * 60 * 1000); // 30 minutes
      expect(convertMillisecondsToString(result.time, true, true)).toBe(
        '00.30.00'
      );
    });

    it('should calculate working time correctly with completed break', () => {
      const start = new Date('2024-03-15T10:00:00');
      const now = new Date('2024-03-15T11:00:00');
      const breaks: DayTime['breaks'] = [
        {
          id: '1',
          start: '2024-03-15T10:20:00',
          end: '2024-03-15T10:30:00' // 10 minute break
        }
      ];

      const result = simulateGetCurrentTimer(start, breaks, now);

      expect(result.time).toBe(50 * 60 * 1000); // 1 hour - 10 minutes
      expect(result.pause).toBe(10 * 60 * 1000); // 10 minutes
      expect(convertMillisecondsToString(result.time, true, true)).toBe(
        '00.50.00'
      );
    });

    it('should calculate working time correctly with ongoing break', () => {
      const start = new Date('2024-03-15T10:00:00');
      const now = new Date('2024-03-15T11:00:00');
      const breaks: DayTime['breaks'] = [
        {
          id: '1',
          start: '2024-03-15T10:30:00',
          end: '' // ongoing break started 30 minutes ago
        }
      ];

      const result = simulateGetCurrentTimer(start, breaks, now);

      // Working time should stop at break start: 10:30 - 10:00 = 30 minutes
      expect(result.time).toBe(30 * 60 * 1000);
      // Pause time should show 30 minutes of ongoing break: 11:00 - 10:30
      expect(result.pause).toBe(30 * 60 * 1000);
      expect(convertMillisecondsToString(result.time, true, true)).toBe(
        '00.30.00'
      );
      expect(convertMillisecondsToString(result.pause, true, true)).toBe(
        '00.30.00'
      );
    });

    it('should calculate working time correctly with multiple breaks', () => {
      const start = new Date('2024-03-15T08:00:00');
      const now = new Date('2024-03-15T12:00:00');
      const breaks: DayTime['breaks'] = [
        {
          id: '1',
          start: '2024-03-15T09:00:00',
          end: '2024-03-15T09:15:00' // 15 minutes
        },
        {
          id: '2',
          start: '2024-03-15T10:00:00',
          end: '2024-03-15T10:30:00' // 30 minutes
        }
      ];

      const result = simulateGetCurrentTimer(start, breaks, now);

      // Total: 4 hours = 240 minutes
      // Breaks: 15 + 30 = 45 minutes
      // Working: 240 - 45 = 195 minutes = 3h 15m
      expect(result.time).toBe(195 * 60 * 1000);
      expect(result.pause).toBe(45 * 60 * 1000);
      expect(convertMillisecondsToString(result.time, true, true)).toBe(
        '03.15.00'
      );
    });
  });

  describe('Edge Cases and Potential Issues', () => {
    it('should handle timer started and stopped on same second', () => {
      const start = new Date('2024-03-15T10:00:00.000');
      const end = new Date('2024-03-15T10:00:00.500'); // 500ms later
      const breaks: DayTime['breaks'] = [];

      const pauseDuration = breaks.reduce((acc, cur) => {
        if (cur.end) {
          return (
            acc + new Date(cur.end).getTime() - new Date(cur.start).getTime()
          );
        }
        return acc;
      }, 0);

      const totalDuration = end.getTime() - start.getTime();
      const workingTime = totalDuration - pauseDuration;

      expect(workingTime).toBe(500);
      expect(convertMillisecondsToString(workingTime, true, true)).toBe(
        '00.00.00'
      ); // Rounds down
    });

    it('should handle timer running for more than 24 hours', () => {
      const start = new Date('2024-03-15T10:00:00');
      const now = new Date('2024-03-16T12:00:00'); // 26 hours later
      const breaks: DayTime['breaks'] = [];

      const pauseDuration = breaks.reduce((acc, cur) => {
        if (cur.end) {
          return (
            acc + new Date(cur.end).getTime() - new Date(cur.start).getTime()
          );
        }
        return acc;
      }, 0);

      const totalDuration = now.getTime() - start.getTime();
      const workingTime = totalDuration - pauseDuration;

      expect(workingTime).toBe(26 * 60 * 60 * 1000);
      expect(convertMillisecondsToString(workingTime, true, true)).toBe(
        '26.00.00'
      );
    });

    it('should handle breaks that are 1 second apart', () => {
      const breaks: DayTime['breaks'] = [
        {
          id: '1',
          start: '2024-03-15T10:10:00',
          end: '2024-03-15T10:15:00'
        },
        {
          id: '2',
          start: '2024-03-15T10:15:01', // 1 second after previous break ends
          end: '2024-03-15T10:20:01'
        }
      ];

      const pauseDuration = breaks.reduce((acc, cur) => {
        if (cur.end) {
          return (
            acc + new Date(cur.end).getTime() - new Date(cur.start).getTime()
          );
        }
        return acc;
      }, 0);

      expect(pauseDuration).toBe((5 * 60 + 5 * 60) * 1000); // 10 minutes total
    });

    it('should detect incorrect break data (break end before break start)', () => {
      const start = new Date('2024-03-15T10:00:00');
      const now = new Date('2024-03-15T12:00:00');
      const breaks = [
        {
          id: '1',
          start: '2024-03-15T10:45:00',
          end: '2024-03-15T10:30:00' // End before start - invalid!
        }
      ];

      const result = checkTimerValidity({
        start,
        breaks,
        end: undefined,
        timerHandlerValue: 'pause',
        now
      });

      // checkTimerValidity should filter out invalid breaks
      expect(result.breaks).toHaveLength(0);
      expect(result.changed).toBe(true);
    });
  });
});
