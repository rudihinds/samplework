import React, { useRef, useEffect } from 'react';
import { css } from 'twin.macro';
import PropTypes from 'prop-types';
import tick from '@assets/profile-icons/input-tick.svg';
import cross from '@assets/profile-icons/input-cross.svg';
import rightArrow from '@assets/profile-icons/input-right-arrow.svg';
import StyledInput from './StyledInput';

function OpenInput({ currentValue, open, setOpen, setCurrentValue }) {
  const inputRef = useRef();
  const clearInputButtonRef = useRef();
  const handleClickOutside = (e) => {
    if (
      inputRef &&
      !inputRef.current.contains(e.target) &&
      !clearInputButtonRef.current.contains(e.target)
    ) {
      setOpen(false);
    }
  };
  useEffect(() => {
    if (inputRef) window.addEventListener('mousedown', handleClickOutside);
    return () =>
      inputRef && window.removeEventListener('mousedown', handleClickOutside);
  });

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
        css={[
          css`
            width: 280px;
          `
        ]}
      >
        <div ref={inputRef}>
          <StyledInput
            value={currentValue}
            onChange={(e) => setCurrentValue(e.target.value)}
            open={open}
          />
        </div>
        <div tw="flex justify-end">
          <div
            type="button"
            onClick={() => setCurrentValue('')}
            ref={clearInputButtonRef}
            role="button"
            onKeyDown={() => setCurrentValue('')}
            tabIndex={0}
          >
            <img src={cross} alt="" />
          </div>
          <div
            type="button"
            onClick={() => setOpen(false)}
            onKeyDown={() => setOpen(false)}
            role="button"
            tabIndex={0}
          >
            <img src={tick} alt="" />
          </div>
        </div>
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

export default OpenInput;

OpenInput.propTypes = {
  currentValue: PropTypes.string.isRequired,
  open: PropTypes.bool.isRequired,
  setOpen: PropTypes.func.isRequired,
  setCurrentValue: PropTypes.func.isRequired
};
