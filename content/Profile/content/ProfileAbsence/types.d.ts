import { Absence, Record } from '@types';

export type GetRecordObject = {
  loading: boolean;
  record: Record;
  refetch: () => Promise<void>;
};

export type FindRecordsObject = {
  loading: boolean;
  records: Record[];
  refetch: () => Promise<void>;
};

export type GetAbsenceObject = {
  loading: boolean;
  absences: Absence[];
  refetch: () => Promise<void>;
};

export type AbsenceMemo = {
  absenceArray: Absence[];
  absenceDays: number;
  currentRecord?: Record;
};

export type YearOptions = {
  id: string;
  value: number;
  label: string;
}[];
