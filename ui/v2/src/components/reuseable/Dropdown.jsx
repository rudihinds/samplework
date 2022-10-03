import React, { useState, useRef } from 'react';
import dropdown from '@assets/Rectangle 173.svg';
import hamburger from '@assets/Options.svg';
import { styled } from 'twin.macro';
import PropTypes from 'prop-types';
import { find } from 'lodash';
import DropdownBox from './DropdownBox';
import MapSelect from './MapSelect';

/**
 * Dropdown component for rendering dynamic dropdowns in consistent design
 * @param {string} label - receives a label which will be used in state as the default header
 * @param {array}  items - receives list of items which is passed to dropdown box component to render
 */

/* eslint-disable no-unused-vars */

function Dropdown({
  label = 'none',
  items,
  onChange,
  selectedId,
  labelStyles = null
}) {
  const [open, setOpen] = useState(false);

  const outerDivRef = useRef();
  const toggleOpen = () => setOpen(!open);

  const setSelection = (id) => {
    onChange(id);
  };

  const selectedItem = find(items, { id: selectedId });

  return (
    <>
      <CUSTOMDROPDOWN
        tw="flex justify-start items-center cursor-pointer relative hidden smlp:flex"
        role="button"
        data-ddname={label}
        onClick={() => toggleOpen()}
        ref={outerDivRef}
        label={label}
      >
        {label !== 'Hamburger' && (
          <p css={[labelStyles]}>{selectedItem?.value}</p>
        )}
        <span style={{ marginLeft: '5px', marginTop: '2px' }}>
          <img src={label === 'Hamburger' ? hamburger : dropdown} alt="" />
        </span>
        <DropdownBox
          items={items}
          open={open}
          setOpen={setOpen}
          outerDivRef={outerDivRef}
          setSelection={setSelection}
        />
      </CUSTOMDROPDOWN>
      <MapSelect
        items={items}
        label={label}
        selectedId={selectedId}
        dropdown={dropdown}
        hamburger={hamburger}
        setSelection={setSelection}
        labelStyles={labelStyles}
      />
    </>
  );
}

Dropdown.propTypes = {
  label: PropTypes.string.isRequired,
  items: PropTypes.instanceOf(Array).isRequired,
  selectedId: PropTypes.number.isRequired,
  onChange: PropTypes.func.isRequired,
  labelStyles: PropTypes.instanceOf(Array)
};

Dropdown.defaultProps = {
  labelStyles: null
};

export default Dropdown;

const CUSTOMDROPDOWN = styled.div`
  width: ${({ label }) => (label !== 'Hamburger' ? 'auto' : 'max-content')};
`;
