import { gql } from '@apollo/client';

const find_record = gql`
  query findRecord($params: RecordConstraints) {
    objects {
      findRecord(where: $params) {
        results {
          objectId
          createdAt
          year
          default_times
          absence
          absence_days
          start_date
          end_date
          holiday_template {
            __typename
            id: objectId
            objectId
            name
            project {
              __typename
              id: objectId
              objectId
              time_settings
            }
            holidays
          }
        }
      }
    }
  }
`;

export default find_record;
