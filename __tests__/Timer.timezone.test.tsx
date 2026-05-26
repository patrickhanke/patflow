import formatDateToISO from '../src/provider/functions/formatDateToIso';

describe('Timer Timezone Consistency Tests', () => {
  describe('formatDateToISO vs toISOString comparison', () => {
    it('should demonstrate timezone difference between formatDateToISO and toISOString', () => {
      // Create a date at a specific UTC time
      const date = new Date('2024-03-15T14:30:45Z'); // UTC time

      // formatDateToISO uses local timezone
      const localFormatted = formatDateToISO(date);

      // toISOString uses UTC
      const utcFormatted = date.toISOString().split('.')[0]; // Remove milliseconds

      console.log('Date object:', date);
      console.log('Local formatted (formatDateToISO):', localFormatted);
      console.log('UTC formatted (toISOString):', utcFormatted);

      // These will differ based on the local timezone
      // For example, if you're in UTC+2, local will be 2 hours ahead
      // This is a CONSISTENCY ISSUE in the Timer component
    });

    it('should show Timer storage vs end value inconsistency', () => {
      const startDate = new Date('2024-03-15T10:00:00Z');

      // This is what Timer.tsx line 106 does when storing start time
      const storedStartTime = startDate.toISOString();

      // This is what Timer.tsx line 147 does when creating endValue
      const endValueStartTime = formatDateToISO(startDate);

      console.log('Stored in AsyncStorage (UTC):', storedStartTime);
      console.log('Sent to backend (Local):', endValueStartTime);

      // These formats are different:
      // - AsyncStorage: "2024-03-15T10:00:00.000Z" (UTC)
      // - Backend: "2024-03-15T12:00:00" (Local, if UTC+2)

      // This could cause issues if:
      // 1. Backend expects consistent timezone
      // 2. User travels across timezones during work
      // 3. Daylight saving time changes occur
    });
  });

  describe('Potential Timer Issues', () => {
    it('should demonstrate cross-timezone work scenario', () => {
      // Scenario: User starts timer in timezone A, ends in timezone B

      // Start timer at 10:00 AM UTC
      const startTime = new Date('2024-03-15T10:00:00Z');
      const storedStart = startTime.toISOString();

      // Simulate timezone change (e.g., user travels or DST happens)
      // 4 hours later at 2:00 PM UTC
      const endTime = new Date('2024-03-15T14:00:00Z');

      // When timer ends, it loads start from storage and formats both
      const parsedStart = new Date(storedStart);
      const startForBackend = formatDateToISO(parsedStart);
      const endForBackend = formatDateToISO(endTime);

      console.log('Original start (stored):', storedStart);
      console.log('Start sent to backend:', startForBackend);
      console.log('End sent to backend:', endForBackend);

      // Calculate duration two ways:
      const durationFromStorage = endTime.getTime() - parsedStart.getTime();
      const durationInHours = durationFromStorage / (1000 * 60 * 60);

      console.log('Actual duration:', durationInHours, 'hours');

      // The duration calculation in Timer.tsx line 149 is correct
      // because it uses Date objects, not strings
      // However, the timestamps sent to backend may be in different timezones
      expect(durationInHours).toBe(4);
    });

    it('should verify duration calculation is timezone-independent', () => {
      // This verifies that Timer.tsx line 149 calculates duration correctly
      // duration: new Date().getTime() - start.getTime()

      const start = new Date('2024-03-15T10:00:00Z');
      const end = new Date('2024-03-15T14:00:00Z');

      const duration = end.getTime() - start.getTime();
      const durationInMs = 4 * 60 * 60 * 1000; // 4 hours in milliseconds

      // Duration calculation is correct regardless of timezone
      expect(duration).toBe(durationInMs);

      // The issue is only with the formatted timestamp strings
      // sent to the backend, not with the duration calculation
    });
  });

  describe('Recommended Fixes', () => {
    it('should demonstrate consistent UTC formatting', () => {
      const date = new Date('2024-03-15T14:30:45Z');

      // Option 1: Use toISOString consistently (UTC)
      const utcFormatted = date.toISOString().split('.')[0].replace('Z', '');

      // Option 2: Create a formatDateToUTC function
      const formatDateToUTC = (d: Date): string => {
        const year = d.getUTCFullYear();
        const month = String(d.getUTCMonth() + 1).padStart(2, '0');
        const day = String(d.getUTCDate()).padStart(2, '0');
        const hours = String(d.getUTCHours()).padStart(2, '0');
        const minutes = String(d.getUTCMinutes()).padStart(2, '0');
        const seconds = String(d.getUTCSeconds()).padStart(2, '0');
        return `${year}-${month}-${day}T${hours}:${minutes}:${seconds}`;
      };

      const customUTC = formatDateToUTC(date);

      console.log('toISOString (no ms/Z):', utcFormatted);
      console.log('Custom UTC format:', customUTC);

      expect(utcFormatted).toBe(customUTC);
    });
  });
});
