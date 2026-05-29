import { Record } from '@types';
import { Dispatch, SetStateAction } from 'react';

export type CreateVacationProps = {
  record: Record;
  setCreateTime: Dispatch<SetStateAction<boolean>>;
  dataHasChanged: boolean;
  setDataHasChanged: Dispatch<SetStateAction<boolean>>;
};
