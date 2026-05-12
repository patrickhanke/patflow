import { gql } from '@apollo/client';

const find_project = gql`
  query findRecord($params: HolidayConstraints) {
    objects {
      __typename
      findProject(where: $params) {
        __typename
        results {
          __typename
          id: objectId
          objectId
          createdAt
          year
          date
          name
          comment
          type
        }
      }
    }
  }
`;

export default find_project;
