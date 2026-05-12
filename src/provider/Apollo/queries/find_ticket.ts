import { gql } from '@apollo/client';

const FIND_TICKET = gql`
  query findTicket($id: ID!) {
    objects {
      __typename
      getTicket(objectId: $id) {
        __typename
        id: objectId
        objectId
        description
        createdAt
        updatedAt
        state
        comments
        images
        title
        property {
          __typename
          id: objectId
          objectId
          name
        }
        task {
          __typename
          id: objectId
          objectId
          title
        }
      }
    }
  }
`;

export default FIND_TICKET;
