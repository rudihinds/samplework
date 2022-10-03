import React, { useEffect, useRef } from 'react';
import { styled } from 'twin.macro';
import PropTypes from 'prop-types';

function DropdownBox({ setSelection, items, open, setOpen, outerDivRef }) {
  const container = useRef(null);

  /**
   * adds an event listener to the document to listen for clicks
   * outside the dropdown to close it. The handleclickoutside function
   * first checks that the click was also outside the containing div
   * to prevent duplicate open/close toggles
   */

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (!outerDivRef.current.contains(e.target)) {
        if (container.current && !container.current.contains(e.target)) {
          setOpen(false);
        }
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  });

  return (
    <>
      {open && (
        <DropdownContainer ref={container}>
          {items.map((item) => (
            <LI key={item.id}>
              <button type="button" onClick={() => setSelection(item.id)}>
                <span>{item.value}</span>
                {/* <span>{isItemInSelection(item)}</span> */}
              </button>
            </LI>
          ))}
        </DropdownContainer>
      )}
    </>
  );
}

DropdownBox.propTypes = {
  setSelection: PropTypes.func.isRequired,
  items: PropTypes.instanceOf(Array).isRequired,
  open: PropTypes.bool.isRequired,
  setOpen: PropTypes.func.isRequired,
  outerDivRef: PropTypes.shape({ current: PropTypes.instanceOf(Element) })
    .isRequired
};

export default DropdownBox;

const DropdownContainer = styled.ul`
  padding: 0;
  margin: 0;
  width: max-content;
  margin-top: 0;
  position: absolute;
  top: 110%;
`;

const LI = styled.li`
  list-style-type: none;

  & button {
    display: flex;
    justify-content: flex-end;
    background-color: white;
    //  font-size: 16px;
    padding: 7px 15px;
    border: 0;
    border-bottom: 0.5px solid rgba(0, 0, 0, 0.2);
    width: 100%;
    text-align: left;

    &:hover,
    &:focus {
      cursor: pointer;
      background-color: #ccc;
    }
  }

  &:first-of-type {
    > button {
      border-top-left-radius: 8px;
      border-top-right-radius: 8px;
    }
  }

  &:last-of-type > button {
    border-bottom-left-radius: 8px;
    border-bottom-right-radius: 8px;
    border-bottom: none;
  }
`;
