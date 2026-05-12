import { gql } from '@apollo/client';

const get_user_display_data = gql`
  query getUserDisplayData($id: ID!) {
    objects {
      __typename
      get_User(objectId: $id) {
        __typename
        id: objectId
        objectId
        username
        email
        portrait
        first_name
        last_name
        last_name
        color
        project {
          __typename
          id: objectId
          objectId
          time_settings
        }
        role {
          __typename
          id: objectId
          objectId
          name
        }
      }
    }
  }
`;

export default get_user_display_data;
