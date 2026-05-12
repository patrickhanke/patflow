import { useFindData } from '@provider';
import { useCallback, useEffect, useState } from 'react';

const PendingUpdates = ({ isConnected }: { isConnected: boolean }) => {
  const { handlePendingUploads } = useFindData();
  const [pendingUpdates, setPendingUpdates] = useState(false);

  const checkPendingUpdates = useCallback(async () => {
    setPendingUpdates(true);
    await handlePendingUploads();
    setPendingUpdates(false);
  }, [handlePendingUploads, pendingUpdates]);

  useEffect(() => {
    if (isConnected && !pendingUpdates) {
      checkPendingUpdates();
    }
  }, [isConnected]);

  return null;
};

export default PendingUpdates;
