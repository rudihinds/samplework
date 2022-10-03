import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Input from './Input';
import CurrencyFormat from 'react-currency-format';
import classnames from 'classnames';

const useStyles = makeStyles(
  (theme) => ({
    container: {
      display: 'inline-flex',
      border: `1px solid ${theme.colors.iron}`,
      background: theme.colors.concrete,
      padding: 8.5,
      borderRadius: 5,
      boxSizing: 'border-box',
      width: 150,
      maxWidth: '100%'
    },
    input: {
      '&.inputtext': {
        color: theme.colors.nevada,
        width: 'auto',
        minWidth: 0,
        border: 0,
        padding: 0,
        flex: 1
      }
    },
    label: {
      color: theme.colors.nevada,
      opacity: 0.5,
      alignSelf: 'flex-end',
      fontSize: '0.625rem',
      textTransform: 'uppercase'
    }
  }),
  { name: 'LabeledInput' }
);

const LabeledInput = (props) => {
  const classes = useStyles();
  const inputClassName = classnames('inputtext', classes.input, props.className);

  return (
    <label className={classes.container}>
      {props.kind === 'numeric' ? (
        <CurrencyFormat {...props} type={null} className={inputClassName} />
      ) : (
        <Input {...props} className={inputClassName} />
      )}
      <span className={classes.label}>{props.label}</span>
    </label>
  );
};

export default LabeledInput;
