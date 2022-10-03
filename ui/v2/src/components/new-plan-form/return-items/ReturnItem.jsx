import React from 'react';
import { css } from 'twin.macro';
import PropTypes from 'prop-types';

import MinusIcon from '@assets/minus-icon.svg';
import TextField from '@reuseable/form-fields/TextField';

const ReturnItem = ({ index, name, onDelete, allowDelete = true }) => (
  <div>
    <div tw="flex space-x-2 items-end md:(gap-1)">
      <div tw="flex-1">
        <TextField label="Hours" name={`${name}.${index}.num_hours`} />
      </div>
      <div tw="flex-1 relative">
        <TextField label="Weeks" name={`${name}.${index}.num_weeks`} />
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
          <img src={MinusIcon} alt="" />
        </button>
      )}
    </div>
  </div>
);

ReturnItem.propTypes = {
  index: PropTypes.number.isRequired,
  name: PropTypes.string.isRequired,
  onDelete: PropTypes.func.isRequired,
  allowDelete: PropTypes.bool
};

ReturnItem.defaultProps = {
  allowDelete: true
};

export default ReturnItem;
