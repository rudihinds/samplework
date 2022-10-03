import React from 'react';
import { css } from 'twin.macro';
import PropTypes from 'prop-types';

import { SVG as MinusIcon } from '@assets/minus-icon.svg';
import TextField from '@reuseable/form-fields/TextField';
import DollarField from '@reuseable/form-fields/DollarField';

const LeaveItem = ({ index, name, onDelete, allowDelete = true }) => (
  <div>
    <div tw="flex space-x-2 items-end md:(gap-1)">
      <div tw="flex-1">
        <TextField label="Weeks" name={`${name}.${index}.num_weeks`} />
      </div>
      <div tw="flex-1 relative">
        <span
          tw="absolute inline-block right-1.5 text-grey-2"
          css={[
            css`
              bottom: 12px;
            `
          ]}
        >
          %
        </span>
        <DollarField label="Salary" name={`${name}.${index}.salary_fraction`} />
      </div>
      {allowDelete && (
        <button
          type="button"
          css={[
            css`
              margin-bottom: 5px;
            `
          ]}
          onClick={() => onDelete(index)}
        >
          <MinusIcon />
        </button>
      )}
    </div>
  </div>
);

LeaveItem.propTypes = {
  index: PropTypes.number.isRequired,
  name: PropTypes.string.isRequired,
  onDelete: PropTypes.func.isRequired,
  allowDelete: PropTypes.bool
};

LeaveItem.defaultProps = {
  allowDelete: true
};

export default LeaveItem;
