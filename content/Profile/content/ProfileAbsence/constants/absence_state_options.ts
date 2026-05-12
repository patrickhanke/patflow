import { AbsenceStateOptions } from '@types';

const absence_state_options = [
  {
    value: 'created',
    id: 'created',
    label: 'Erstellt',
    color: 'info'
  },
  {
    value: 'submitted',
    id: 'submitted',
    label: 'Eingereicht',
    color: 'warning'
  },
  {
    value: 'approved',
    id: 'approved',
    label: 'Genehmigt',
    color: 'success'
  }
] as AbsenceStateOptions;

export default absence_state_options;
