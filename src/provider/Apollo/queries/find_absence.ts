import { gql } from '@apollo/client';

const find_absence = gql`
  query findAbsence($params: AbsenceConstraints) {
    objects {
      __typename
      findAbsence(where: $params) {
        __typename
        results {
          __typename
          id: objectId
          objectId
          createdAt
          year
          type
          start_date
          end_date
          comment
          state
          user {
            __typename
            objectId
            id: objectId
            color
            first_name
            last_name
          }
        }
      }
    }
  }
`;

export default find_absence;
