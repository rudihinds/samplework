import React, { useState, useRef } from 'react';
// import dropdown from '@assets/Rectangle 173.svg';
// import hamburger from '@assets/Options.svg';
import { styled } from 'twin.macro';
import PropTypes from 'prop-types';
import { find } from 'lodash';
import DropdownBox from './DynamicDropdownBox';
import MapSelect from './DynamicMapSelect';
import ClosedInput from '../Dynamicinput/ClosedInput';

/**
 * Dropdown component for rendering dynamic dropdowns in consistent design
 * @param {string} label - receives a label which will be used in state as the default header
 * @param {array}  items - receives list of items which is passed to dropdown box component to render
 */

/* eslint-disable no-unused-vars */

function Dropdown({ label, items, onChange, selectedId, value, labelStyles }) {
  const [open, setOpen] = useState(false);
  const outerDivRef = useRef();
  const toggleOpen = () => setOpen(!open);

  const setSelection = (id) => {
    onChange(id);
    // setValue(items[parseInt(id)].value);
  };

  const selectedItem = find(items, { id: selectedId });

  return (
    <>
      {open ? (
        <div>
          <CUSTOMDROPDOWN
            tw="flex justify-start items-center cursor-pointer relative hidden smlp:flex"
            role="button"
            data-ddname={label}
            onClick={() => toggleOpen()}
            ref={outerDivRef}
            label={label}
          >
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
            // dropdown={dropdown}
            // hamburger={hamburger}
            setSelection={setSelection}
            // labelStyles={labelStyles}
          />
        </div>
      ) : (
        // <p>nothing</p>
        <ClosedInput setOpen={setOpen} currentValue={value} open={open} />
        // <p onClick={toggleOpen}>{value}</p>
      )}
    </>
  );
}

Dropdown.propTypes = {
  value: PropTypes.string,
  label: PropTypes.string.isRequired,
  items: PropTypes.instanceOf(Array).isRequired,
  selectedId: PropTypes.number,
  onChange: PropTypes.func,
  labelStyles: PropTypes.instanceOf(Array)
};

Dropdown.defaultProps = {
  value: '',
  labelStyles: null,
  selectedId: 0,
  onChange: () => {}
};

export default Dropdown;

const CUSTOMDROPDOWN = styled.div`
  width: ${({ label }) => (label !== 'Hamburger' ? 'auto' : 'max-content')};
`;
