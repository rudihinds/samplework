import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import ClosedInput from './ClosedInput';
import OpenInput from './OpenInput';

const DynamicInputField = ({ initialValue }) => {
  const [currentValue, setCurrentValue] = useState('');
  const [open, setOpen] = useState(false);

  useEffect(() => {
    setCurrentValue(initialValue);
  }, [initialValue]);

  return (
    <div>
      {open ? (
        <OpenInput
          currentValue={currentValue}
          open={open}
          setOpen={setOpen}
          setCurrentValue={setCurrentValue}
        />
      ) : (
        <ClosedInput
          setOpen={setOpen}
          open={open}
          currentValue={currentValue}
        />
      )}
    </div>
  );
};

export default DynamicInputField;

DynamicInputField.propTypes = {
  initialValue: PropTypes.string.isRequired
};
