import { gql } from '@apollo/client';
/* eslint-disable import/prefer-default-export */

export const FETCH_NOTIFY_USER = gql`
  query fetchNotifyUser($notification_type: String!) {
    fetchNotifyUser(notification_type: $notification_type) {
      id
      notification_type
      user_id
    }
  }
`;
