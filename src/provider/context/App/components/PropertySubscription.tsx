import {
  subscribeToQuery,
  useDataStore,
  useFindData,
  useParse
} from '@provider';
import { useEffect } from 'react';

const PropertySubscription = () => {
  const { Parse, isReady } = useParse();
  const { loadProperties } = useFindData();
  const { properties } = useDataStore();

  useEffect(() => {
    if (isReady && (properties.length === 0 || !properties)) {
      loadProperties();
    }
  }, [properties, isReady]);

  useEffect(() => {
    if (!isReady || !Parse) return;

    const PropertyClass = Parse.Object.extend('Property');
    const propertyQuery = new Parse.Query(PropertyClass);
    let subscription: Awaited<ReturnType<typeof subscribeToQuery>> | null =
      null;
    let isMounted = true;

    subscribeToQuery(propertyQuery, {
      onCreate: object => {
        console.log('[Property LiveQuery] create:', object.toJSON());
        loadProperties();
      },
      onUpdate: object => {
        console.log('[Property LiveQuery] update:', object.toJSON());
        loadProperties();
      },
      onDelete: object => {
        console.log('[Property LiveQuery] delete:', object.toJSON());
        loadProperties();
      }
    }).then(sub => {
      if (isMounted) {
        subscription = sub;
      } else {
        sub.unsubscribe();
      }
    });

    return () => {
      isMounted = false;
      if (subscription) {
        subscription.unsubscribe();
      }
    };
  }, [isReady, Parse]);

  return null;
};

export default PropertySubscription;
