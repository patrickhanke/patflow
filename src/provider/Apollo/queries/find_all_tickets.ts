import { gql } from '@apollo/client';

const FIND_ALL_TICKETS = gql`
  query findAllTickets($params: TicketConstraints) {
    objects {
      __typename
      findTicket(where: $params) {
        __typename
        results {
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
  }
`;

export default FIND_ALL_TICKETS;
