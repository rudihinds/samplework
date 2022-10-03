import React, { useState } from 'react';
import DatePicker from 'react-datepicker';
import 'twin.macro';

function DatePickerComponent() {
  const [startDate, setStartDate] = useState(new Date());
  return (
    <div tw="w-20">
      <DatePicker
        selected={startDate}
        onChange={(date) => setStartDate(date)}
      />
    </div>
  );
}

export default DatePickerComponent;
