import React from 'react';
import { styled, css } from 'twin.macro';
import PropTypes from 'prop-types';

function MapSelect({
  label,
  selectedId,
  items,
  // hamburger,
  setSelection
  // labelStyles = null
}) {
  return (
    <SELECT
      tw="flex justify-end items-center cursor-pointer relative smlp:hidden"
      label={label}
      // hamburger={hamburger}
      value={selectedId}
      onChange={(e) => setSelection(e.target.value)}
      css={[
        // labelStyles,
        css`
          margin-left: -5px;
        `
      ]}
    >
      {/* <option value="" selected disabled hidden>
        {label !== 'Hamburger' ? selected : ''}
      </option> */}
      {items.map((item) => (
        <option key={item.id} value={item.id}>
          {item.value}
        </option>
      ))}
    </SELECT>
  );
}

MapSelect.propTypes = {
  label: PropTypes.string.isRequired,
  selectedId: PropTypes.number.isRequired,
  items: PropTypes.arrayOf(PropTypes.shape({})).isRequired,
  setSelection: PropTypes.func
};

MapSelect.defaultProps = {
  setSelection: () => {}
};

export default MapSelect;

const SELECT = styled.select`
  max-width: ${({ label }) => (label !== 'Hamburger' ? 'max-content' : '20px')};
  -webkit-appearance: ${({ label }) => (label === 'Hamburger' ? 'none' : null)};
  -moz-appearance: ${({ label }) => (label === 'Hamburger' ? 'none' : null)};

  /* text-align: 'right'; */
  text-align-last: right;
  margin-top: ${({ label }) => (label === 'Hamburger' ? '5px' : null)};
  color: ${({ label }) => (label === 'Hamburger' ? 'transparent' : null)};
  background: ${({ hamburger, label }) =>
    label === 'Hamburger' ? `url(${hamburger}) no-repeat` : null};
  background-color: #f7f7f8;
`;
