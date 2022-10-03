import React from 'react';
import { styled } from 'twin.macro';
import { SVG as RightArrow } from '@assets/right-arrow.svg';
import PropTypes from 'prop-types';

function GoButton({ actionText, rightArrow, onClick }) {
  if (rightArrow) {
    return (
      <BUTTON
        tw="flex items-center justify-around border border-solid border-mirza-purple rounded h-4.5 w-20 pr-1 text-mirza-purple transition-colors duration-200 hover:(bg-mirza-purple text-white)"
        onClick={onClick}
      >
        <p tw="pl-1">{actionText}</p>
        <div>
          <RightArrow />
        </div>
      </BUTTON>
    );
  }
  return (
    <BUTTON tw="flex items-center justify-around border border-solid border-mirza-purple rounded ">
      <div>
        <img src="will be left arrow for back button" alt="Left arrow" />
      </div>
      <p tw="text-mirza-purple">{actionText}</p>
    </BUTTON>
  );
}

GoButton.propTypes = {
  actionText: PropTypes.string,
  rightArrow: PropTypes.bool,
  onClick: PropTypes.func
};

GoButton.defaultProps = {
  rightArrow: true,
  actionText: 'Go to plan creator',
  onClick: () => {}
};

const BUTTON = styled.button``;

export default GoButton;
