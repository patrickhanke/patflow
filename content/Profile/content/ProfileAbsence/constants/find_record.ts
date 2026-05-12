import { gql } from '@apollo/client';

const find_record = gql`
  query findRecord($params: RecordConstraints) {
    objects {
      findRecord(where: $params) {
        results {
          id: objectId
          objectId
          createdAt
          year
          default_times
          absence
          absence_days
        }
      }
    }
  }
`;

export default find_record;
