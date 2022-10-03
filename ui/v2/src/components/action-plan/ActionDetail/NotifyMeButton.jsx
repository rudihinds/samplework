import React from 'react';
import PropTypes from 'prop-types';
import { Basic as ButtonBasic } from '@reuseable/buttons/Button';
import { SVG as CheckIcon } from '@assets/action-plan/check.svg';
import tw from 'twin.macro';

const NotifyMeButton = ({ isSignedUp, onUserSignUp }) => (
  <ButtonBasic
    type="button"
    disabled={isSignedUp}
    onClick={onUserSignUp}
    css={[
      isSignedUp &&
        tw`bg-mirza-green inline-flex items-center border-mirza-green cursor-default hover:(bg-mirza-green text-white)`
    ]}
  >
    {isSignedUp ? (
      <>
        <span tw="mr-1">You will be notified</span>
        <CheckIcon />
      </>
    ) : (
      <span>Notify me</span>
    )}
  </ButtonBasic>
);

NotifyMeButton.propTypes = {
  isSignedUp: PropTypes.bool,
  onUserSignUp: PropTypes.func.isRequired
};
NotifyMeButton.defaultProps = {
  isSignedUp: false
};

export default NotifyMeButton;
