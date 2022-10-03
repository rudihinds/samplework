import React from 'react';
import { css } from 'twin.macro';
import PropTypes from 'prop-types';
// import tick from '@assets/profile-icons/input-tick.svg';
// import cross from '@assets/profile-icons/input-cross.svg';
import rightArrow from '@assets/profile-icons/input-right-arrow.svg';
import StyledInput from './StyledInput';

function ClosedInput({ setOpen, open, currentValue }) {
  // console.log('name in closed input is ', currentValue);

  return (
    <div
      css={[
        css`
          width: auto;
          display: flex;
        `
      ]}
    >
      <div
        onClick={() => setOpen(true)}
        onKeyDown={() => setOpen(true)}
        role="button"
        tabIndex={0}
        css={[
          css`
            width: 280px;

            /* display:flex; */
          `
        ]}
      >
        <StyledInput value={currentValue} open={open} readOnly />
      </div>
      <div
        css={[
          css`
            margin-top: 10px;
          `
        ]}
      >
        <img src={rightArrow} alt="" />
      </div>
    </div>
  );
}

export default ClosedInput;

ClosedInput.propTypes = {
  setOpen: PropTypes.func.isRequired,
  open: PropTypes.bool.isRequired,
  currentValue: PropTypes.string
};
ClosedInput.defaultProps = {
  currentValue: ''
};
