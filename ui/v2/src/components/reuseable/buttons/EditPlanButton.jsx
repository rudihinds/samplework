import React from 'react';
import { styled } from 'twin.macro';
import { SVG as DownArrow } from '@assets/down-arrow-button.svg';
import { SVG as UpArrow } from '@assets/up-arrow-button.svg';
import PropTypes from 'prop-types';

function EditPlanButton({ actionText, setOpen, open }) {
  return (
    <BUTTON
      tw="flex items-center justify-between border border-solid border-mirza-purple text-mirza-purple rounded h-4.5 w-max px-1.5 gap-1"
      onClick={() => setOpen(!open)}
    >
      <span>{actionText}</span>
      <div>{open ? <UpArrow /> : <DownArrow />}</div>
    </BUTTON>
  );
}

EditPlanButton.propTypes = {
  actionText: PropTypes.string,
  open: PropTypes.bool.isRequired,
  setOpen: PropTypes.func.isRequired
};

EditPlanButton.defaultProps = {
  actionText: 'Edit plan'
};

const BUTTON = styled.button``;

export default EditPlanButton;
