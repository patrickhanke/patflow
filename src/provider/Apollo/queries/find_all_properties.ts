import { gql } from '@apollo/client';

const find_all_properties = gql`
  query findAllProperties {
    objects {
      __typename
      findProperty(order: name_DESC) {
        __typename
        results {
          __typename
          id: objectId
          objectId
          name
          createdAt
          created_by {
            __typename
            id: objectId
            objectId
            username
          }
        }
      }
    }
  }
`;

export default find_all_properties;
