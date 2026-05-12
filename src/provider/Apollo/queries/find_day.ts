import { gql } from '@apollo/client';

const find_day = gql`
  query findDays($params: DayConstraints) {
    objects {
      __typename
      findDay(where: $params) {
        __typename
        results {
          __typename
          id: objectId
          objectId
          year
          month
          date
          type
          is_working_day
          time
          default_time
          iso_date
          absence {
            __typename
            id: objectId
            objectId
            state
            start_date
            end_date
            comment
            type
            user {
              __typename
              id: objectId
              objectId
            }
          }
        }
      }
    }
  }
`;

export default find_day;
