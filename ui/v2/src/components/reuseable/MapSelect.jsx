import React from 'react';
import { styled, css } from 'twin.macro';
import PropTypes from 'prop-types';
import DropdownIcon from '@assets/Rectangle 173.svg';

function MapSelect({
  label,
  selectedId,
  items,
  hamburger,
  setSelection,
  labelStyles = null
}) {
  return (
    <SELECT
      tw="flex justify-end items-center cursor-pointer relative smlp:hidden"
      label={label}
      hamburger={hamburger}
      value={selectedId}
      onChange={(e) => setSelection(e.target.value)}
      css={[
        labelStyles,
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
  hamburger: PropTypes.string,
  setSelection: PropTypes.func,
  labelStyles: PropTypes.instanceOf(Array)
};

MapSelect.defaultProps = {
  hamburger: null,
  setSelection: () => {},
  labelStyles: null
};

export default MapSelect;

const SELECT = styled.select`
  max-width: max-content;
  -webkit-appearance: none;
  -moz-appearance: none;

  /* text-align: 'right'; */
  text-align-last: right;
  background: url('${DropdownIcon}') no-repeat;
  background-position: 100% center;
  background-color: #f7f7f8;
  padding-right: 15px;
  ${({ label, hamburger }) =>
    label === 'Hamburger' &&
    css`
      max-width: 20px;
      margin-top: 5px;
      color: transparent;
      background: url(${hamburger}) no-repeat !important;
      background-position: right center;
    `};
`;
