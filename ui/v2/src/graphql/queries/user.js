import { gql } from '@apollo/client';
/* eslint-disable import/prefer-default-export */

export const ME = gql`
  query me {
    me {
      id
      name
      email
      gender
      partner_gender
      birthdate
      partner_birthdate
      career_begin_age
      partner_career_begin_age
      has_partner
      partner_name
      default_plan_id
    }
  }
`;
