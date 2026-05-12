import { gql } from '@apollo/client';

const FIND_ALL_TASKS = gql`
  query findAllTasks($params: TaskConstraints) {
    objects {
      __typename
      findTask(where: $params) {
        __typename
        results {
          __typename
          id: objectId
          objectId
          createdAt
          title
          state
          time
          assigned_staff
          dates
          description
          comments
          type
          images
          ticket {
            __typename
            id: objectId
            objectId
            title
          }
          property {
            __typename
            id: objectId
            objectId
            name
          }
        }
      }
    }
  }
`;

export default FIND_ALL_TASKS;
