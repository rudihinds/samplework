import React from 'react';
import { Controller } from 'react-hook-form';
import { FormControl, FormHelperText, InputLabel, makeStyles } from '@material-ui/core';
import { FilledSelect as Select } from '../../js/elements';
import { isExists } from 'date-fns';
import MapSelect from './MapSelectBit';
const { months } = require('../../catalog');

const useStyles = makeStyles(() => ({
  birthdayGrid: {
    display: 'grid',
    gridTemplateColumns: 'minmax(0, 130fr) minmax(0, 72fr) minmax(0, 88fr)',
    gridGap: 12
  }
}));

const OnboardingBirthdaySelector = ({ controlRef, errorRef, disabled }) => {
  const classes = useStyles();
  const validate = () => {
    const values = controlRef.getValues();
    if (Boolean(values.year) && new Date().getFullYear() - values.year < 16) {
      return 'Oops! Please enter an age of 16 or older';
    }
    if (Boolean(values.day) && Boolean(values.month) && Boolean(values.year)) {
      const validDate = isExists(values.year, values.month, values.day);
      return validDate || 'It looks like the date you selected is invalid, please check again.';
    }
    return true;
  };

  return (
    <div>
      <div className={classes.birthdayGrid}>
        <FormControl fullWidth={true} variant="filled" error={Boolean(errorRef?.month)}>
          <InputLabel>Month</InputLabel>
          <Controller
            control={controlRef}
            as={<MapSelect select={Select} options={months.map((_, i) => ({ key: i, value: _ }))}></MapSelect>}
            data-sel="birthday_month_select"
            name="month"
            disabled={disabled}
            displayEmpty
            rules={{ validate, required: 'Please choose a month.' }}
          />
        </FormControl>
        <FormControl fullWidth={true} variant="filled" error={Boolean(errorRef?.day)}>
          <InputLabel>Day</InputLabel>
          <Controller
            control={controlRef}
            as={
              <MapSelect
                select={Select}
                options={[...Array(31)].map((_, i) => ({
                  key: i + 1,
                  value: i + 1
                }))}
              ></MapSelect>
            }
            data-sel="birthday_day_select"
            name="day"
            disabled={disabled}
            displayEmpty
            rules={{ validate, required: 'Please choose a day.' }}
          />
        </FormControl>
        <FormControl fullWidth={true} variant="filled" error={Boolean(errorRef?.year)}>
          <InputLabel>Year</InputLabel>
          <Controller
            control={controlRef}
            as={
              <MapSelect
                select={Select}
                options={[...Array(101)].map((_, i) => ({
                  key: new Date().getFullYear() - i,
                  value: new Date().getFullYear() - i
                }))}
              ></MapSelect>
            }
            data-sel="birthday_year_select"
            name="year"
            disabled={disabled}
            displayEmpty
            rules={{ validate, required: 'Please choose a year.' }}
          />
        </FormControl>
      </div>
      <FormControl fullWidth={true} error={Boolean(Object.keys(errorRef).length)}>
        {Boolean(Object.keys(errorRef).length) && (
          <FormHelperText>Error: {Object.values(errorRef).map((tt) => tt.message)[0]}</FormHelperText>
        )}
      </FormControl>
    </div>
  );
};

export default OnboardingBirthdaySelector;
