import React, { useEffect, useRef } from 'react';
import { styled } from 'twin.macro';
import PropTypes from 'prop-types';
import upArrow from '@assets/profile-icons/dropdown-up-arrow.svg';

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
          {items.map((item, i) => (
            <LI key={item.id}>
              <button
                type="button"
                onClick={() => setSelection(item.id)}
                tw="flex justify-between"
              >
                <span>{item.value}</span>
                {i === 0 && (
                  <div tw="flex self-center">
                    <img src={upArrow} alt="" />{' '}
                  </div>
                )}
                {/* <span>{isItemInSelection(item)}</span> */}
              </button>
            </LI>
          ))}
        </DropdownContainer>
      )}
    </>
  );
}

// DropdownBox.propTypes = {
//   setSelection: PropTypes.func.isRequired,
//   items: PropTypes.instanceOf(Array).isRequired,
//   open: PropTypes.bool.isRequired,
//   setOpen: PropTypes.func.isRequired,
//   outerDivRef: PropTypes.shape({ current: PropTypes.instanceOf(Element) })
//     .isRequired
// };

export default DropdownBox;

const DropdownContainer = styled.ul`
  padding: 0;
  margin: 0;
  width: 256px;
  margin-top: 0;
  position: absolute;
  top: 110%;
`;

const LI = styled.li`
  list-style-type: none;
  margin-bottom: 0;
  border: 'none';

  & button {
    display: flex;
    justify-content: space-between;
    background-color: white;
    padding: 7px 17px;
    border: 0;
    border-left: 0.75px solid #8a8a8a;
    border-right: 0.75px solid #8a8a8a;
    width: 100%;
    text-align: left;
    background-image: url(upArrow);

    &:hover,
    &:focus {
      cursor: pointer;
      background-color: #ccc;
    }
  }

  &:first-of-type {
    > button {
      border-top-left-radius: 7px;
      border-top-right-radius: 7px;
      border-top: 0.75px solid #8a8a8a;
      padding-top: 20px;
    }
  }

  &:last-of-type > button {
    border-bottom-left-radius: 7px;
    border-bottom-right-radius: 7px;
    border-bottom: 0.75px solid #8a8a8a;
    padding-bottom: 20px;
  }
`;

DropdownBox.propTypes = {
  setSelection: PropTypes.func.isRequired,
  items: PropTypes.shape(PropTypes.array).isRequired,
  open: PropTypes.bool.isRequired,
  setOpen: PropTypes.func.isRequired,
  outerDivRef: PropTypes.instanceOf(PropTypes.element).isRequired
};
