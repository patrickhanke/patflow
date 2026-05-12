import React, { FC } from 'react';
import { View } from 'react-native';
import NoTimes from './components/NoTimes';
import { CreateEditWorktimeProps } from './types';
import ShowTimes from './content/ShowTimes';

const CreateEditWorktime: FC<CreateEditWorktimeProps> = ({
  days,
  date,
  refetch,
  records
}) => {
  if (!days || days.length === 0) {
    return <NoTimes date={date} refetch={refetch} records={records} />;
  }

  return (
    <>
      <View style={{ flex: 1 }}>
        <ShowTimes
          days={days}
          refetch={refetch}
          date={date}
          records={records}
        />
      </View>
    </>
  );
};

export default CreateEditWorktime;
