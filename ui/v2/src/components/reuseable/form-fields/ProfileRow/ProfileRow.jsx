import React from 'react';
import { css } from 'twin.macro';
import PropTypes from 'prop-types';
import DynamicDatePicker from '../DynamicDatePicker/DynamicDatePicker';
import DynamicInputField from '../Dynamicinput/DynamicInputField';
import DynamicDropdown from '../DynamicDropdown/DynamicDropdown';

function ProfileRow({ field, value, type, items, setNewValue }) {
  // console.log('row:', value);
  const getFieldType = () => {
    if (type === 'input')
      return (
        <DynamicInputField initialValue={value} setNewValue={setNewValue} />
      );
    if (type === 'datepicker') return <DynamicDatePicker />;
    if (type === 'dropdown')
      return <DynamicDropdown items={items} value={value} />;
    return null;
  };
  return (
    <div>
      <div
        tw="flex"
        css={[
          css`
            height: 68px;
            border-bottom: 0.5px solid #e0e0e0;
          `
        ]}
      >
        <div
          tw="flex items-center"
          css={[
            css`
              width: 265px;
            `
          ]}
        >
          <p
            tw="font-sans font-bold text-dark-green"
            css={[
              css`
                margin-left: 18px;
              `
            ]}
          >
            {field}
          </p>
        </div>
        <div
          css={[
            css`
              margin-top: 17.4px;
              width: 265px;

              /* margin-left: 10px; */
            `
          ]}
        >
          {getFieldType(type)}
        </div>
      </div>
    </div>
  );
}

export default ProfileRow;

ProfileRow.propTypes = {
  field: PropTypes.string,
  value: PropTypes.string,
  type: PropTypes.string,
  items: PropTypes.arrayOf(PropTypes.string),
  setNewValue: PropTypes.func
};

ProfileRow.defaultProps = {
  field: '',
  value: '',
  type: 'none',
  items: [],
  setNewValue: () => {}
};
