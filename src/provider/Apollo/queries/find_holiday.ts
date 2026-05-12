import { gql } from '@apollo/client';

const find_holiday = gql`
  query findRecord($params: HolidayConstraints) {
    objects {
      __typename
      findHoliday(where: $params) {
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
          dates
        }
      }
    }
  }
`;

export default find_holiday;
