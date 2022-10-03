import React from 'react';
import PropTypes from 'prop-types';

import { SVG as AddIcon } from '@assets/add-icon.svg';

import 'twin.macro';

const Cover = ({ setOpen }) => (
  <button
    type="button"
    onClick={() => setOpen(true)}
    tw="block w-full p-5 md:p-3"
  >
    <AddIcon tw="inline-block mb-2" />
    <h3 tw="font-bold mb-1">Try another plan</h3>
    <p>Why not try a different scenario and compare plans?</p>
  </button>
);

Cover.propTypes = {
  setOpen: PropTypes.func.isRequired
};

export default Cover;
