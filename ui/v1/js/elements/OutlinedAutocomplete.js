import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { Autocomplete } from '@material-ui/lab';
import { TextField } from '@material-ui/core';

const useStyles = makeStyles(
  (theme) => {
    const style = {
      color: theme.colors.nevada,
      fontSize: theme.fontSize.f13px
    };
    return {
      root: {
        background: theme.colors.concrete,
        '& $inputRoot': {
          ...style
        }
      },
      listbox: {
        ...style
      },
      noOptions: {
        ...style
      },
      inputRoot: {}
    };
  },
  { name: 'OutlinedAutocomplete' }
);

const OutlinedAutocomplete = ({ options, currentValue, changeValue }) => {
  const classes = useStyles();
  const [value, setValue] = React.useState(options[options.findIndex((item) => item.id === currentValue)] || null);
  const [inputValue, setInputValue] = React.useState('');

  return (
    <Autocomplete
      size="small"
      disableClearable
      fullWidth
      classes={classes}
      getOptionLabel={(option) => option.name || option}
      value={value}
      onChange={(event, newValue) => {
        setValue(newValue);
        changeValue(newValue.id);
      }}
      inputValue={inputValue}
      onInputChange={(event, newInputValue) => {
        setInputValue(newInputValue);
      }}
      options={options}
      renderInput={(params) => <TextField {...params} variant="outlined" />}
    />
  );
};

export default OutlinedAutocomplete;
