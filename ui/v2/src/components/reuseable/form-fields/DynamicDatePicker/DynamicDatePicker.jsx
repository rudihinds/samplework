import React, { useState } from 'react';
import ClosedInput from '../Dynamicinput/ClosedInput';
import DatePicker from './DatePickerComponent';

const DynamicDatePicker = () => {
  const user = {
    name: 'Joanna Doe'
  };

  const [open, setOpen] = useState(false);
  const [currentValue, setCurrentValue] = useState(user.name);

  return (
    <div>
      {open ? (
        <DatePicker
          setCurrentValue={setCurrentValue}
          currentValue={currentValue}
          open={open}
          setOpen={setOpen}
        />
      ) : (
        // <p>p</p>
        <ClosedInput
          setOpen={setOpen}
          open={open}
          currentValue={currentValue}
        />
      )}
    </div>
  );
};

export default DynamicDatePicker;
