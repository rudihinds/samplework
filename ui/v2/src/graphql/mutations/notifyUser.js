import { gql } from '@apollo/client';
/* eslint-disable import/prefer-default-export */

export const SET_NOTIFY_USER = gql`
  mutation setNotifyUser($notification_type: String!) {
    createNotifyUser(input: { notification_type: $notification_type }) {
      id
      notification_type
      user_id
    }
  }
`;
