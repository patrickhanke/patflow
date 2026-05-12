import { gql } from '@apollo/client';

const find_all_staff = gql`
  query findAllWorkers {
    objects {
      find_User(order: family_name_DESC, where: { is_worker: { _eq: true } }) {
        __typename
        results {
          __typename
          objectId
          id: objectId
          first_name
          last_name
          is_worker
          portrait
          color
          role {
            objectId
            id: objectId
            name
            type
          }
          createdAt
        }
      }
    }
  }
`;

export default find_all_staff;
