import React from 'react';
import PropTypes from 'prop-types';
import { css } from 'twin.macro';
import { useQuery, useMutation } from '@apollo/client';
import { FETCH_NOTIFY_USER } from '@graphql/queries/notifyUser';

import { SET_NOTIFY_USER } from '@graphql/mutations/notifyUser';
import NotifyMeButton from './NotifyMeButton';

const ComingSoon = ({ icon, title, description, notificationType }) => {
  const Icon = icon;

  const { data } = useQuery(FETCH_NOTIFY_USER, {
    variables: {
      notification_type: notificationType
    }
  });

  const [setNotifyUser] = useMutation(SET_NOTIFY_USER);

  return (
    <div tw="text-center px-4 mb-2">
      <div tw="w-7 mx-auto mb-2">
        <Icon />
      </div>
      <h2
        tw="text-mirza-purple text-center text-3 mb-1 mx-auto"
        style={{ maxWidth: '450px' }}
      >
        {title}
      </h2>
      <p
        tw="text-center mb-4 mx-auto"
        css={[
          css`
            max-width: 493px;
          `
        ]}
      >
        {description}
      </p>
      <NotifyMeButton
        isSignedUp={data && data.fetchNotifyUser !== null}
        onUserSignUp={() =>
          setNotifyUser({ variables: { notification_type: notificationType } })
        }
      />
    </div>
  );
};

ComingSoon.propTypes = {
  icon: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
  description: PropTypes.string.isRequired,
  notificationType: PropTypes.string.isRequired
};

export default ComingSoon;
