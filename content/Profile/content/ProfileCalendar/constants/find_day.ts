import { gql } from '@apollo/client';

const find_day = gql`
  query getObjectServiceTime($params: DayConstraints) {
    objects {
      findDay(where: $params) {
        results {
          objectId
          year
          month
          date
          is_working_day
          time
          default_time
          absence
          saldo
          type
          user {
            objectId
            first_name
            last_name
            color
          }
          record {
            objectId
          }
        }
      }
    }
  }
`;

export default find_day;
