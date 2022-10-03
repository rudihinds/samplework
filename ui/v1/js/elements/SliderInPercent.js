import React, { useEffect, useState } from 'react';
import Slider from './Slider';

const SliderInPercent = (props) => {
  // convertToPercent defines if it should be converted
  // max is the actual maximum value, before being converted
  // onChange, value and max are the real values and they'll be passed manually in other vars
  const { convertToPercent, onChange, value, max, ...sliderProps } = props;
  const [realValue, setRealValue] = useState(value);
  const [displayValue, setDisplayValue] = useState(value);
  const [maxValue, setMaxValue] = useState(Number(max));

  useEffect(() => {
    let innerValue = value;
    let innerMax = max;
    if (convertToPercent) {
      if (innerValue !== 0) {
        innerValue = Math.round((innerValue / innerMax) * 100);
      }
      innerMax = 100;
    }

    setDisplayValue(innerValue);
    setMaxValue(innerMax);
  }, [convertToPercent]);

  useEffect(() => {
    let innerVal = displayValue;
    if (convertToPercent) {
      innerVal = Math.min(100, innerVal);
      innerVal = Math.round((innerVal * max) / 100);
    }
    setRealValue(innerVal);
    onChange({}, innerVal); // ugly fix, might need to trigger the onChange for the MUI component
  }, [convertToPercent, displayValue]);

  // can't be onChange because it gets updated on every render, causing performance issues
  const handleOnChangeCommitted = (ev, _) => {
    onChange(ev, realValue);
  };

  const handleOnChangeSlider = (_, val) => {
    setDisplayValue(val);
  };

  return (
    <Slider
      {...sliderProps}
      value={displayValue}
      max={maxValue}
      onChange={handleOnChangeSlider}
      onChangeCommitted={handleOnChangeCommitted}
    />
  );
};

export default SliderInPercent;
