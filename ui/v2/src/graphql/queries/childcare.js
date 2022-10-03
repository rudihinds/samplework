import { gql } from '@apollo/client';

/* eslint-disable import/prefer-default-export */
export const CHILDCARE_AVERAGE_COSTS = gql`
  query childcareAverageCosts($zip_code: Int!, $num_infants: Int!) {
    childcareAverageCosts(zip_code: $zip_code, num_infants: $num_infants) {
      weekly_nanny_rate
      weekly_nanny_share_rate
      weekly_daycare_rate
    }
  }
`;
