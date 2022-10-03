import React from 'react';
import { MenuItem, Select } from '@material-ui/core';
/**
 *
 * @param {Array<{key, value}>} options
 */
const MapSelect = ({ select: Select, options, ...extraProps }) => {
  return (
    <Select {...extraProps}>
      {options.length > 0 &&
        options.map(({ key, value }) => (
          <MenuItem value={key} key={key}>
            {value}
          </MenuItem>
        ))}
    </Select>
  );
};
MapSelect.defaultProps = { options: [], select: Select };
export default MapSelect;
