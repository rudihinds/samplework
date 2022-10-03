import React from 'react';
import 'twin.macro';
import currency from 'currency.js';
import PropTypes from 'prop-types';

import TextFieldWrapper from './TextFieldWrapper';
import StyledInput from './StyledInput';

/* eslint-disable react/jsx-props-no-spreading */
const DollarInput = ({ field, helpers }) => {
  const _fieldProps = { ...field };
  if (_fieldProps.value && _fieldProps.value !== '') {
    _fieldProps.value = currency(field.value, {
      symbol: '',
      separator: ',',
      precision: 0
    }).format();
  } else {
    _fieldProps.value = '';
  }
  _fieldProps.onChange = (e) => {
    if (e.target.value === '') {
      helpers.setValue(null);
    } else {
      helpers.setValue(currency(e.target.value).value);
    }
  };
  return (
    <div tw="relative">
      <span tw="text-1.4 absolute left-1.5 h-full flex items-center z-10">
        $
      </span>
      <StyledInput tw="pl-3" {..._fieldProps} />
    </div>
  );
};

DollarInput.propTypes = {
  field: PropTypes.shape({
    value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    onChange: PropTypes.func.isRequired
  }),
  helpers: PropTypes.shape({
    setValue: PropTypes.func.isRequired
  }).isRequired
};
DollarInput.defaultProps = {
  field: PropTypes.shape({
    value: ''
  })
};

const DollarField = ({ name, label, id }) => (
  // TextFieldWrapper wraps StyledInput with <label> and error components
  // Also automatically passes in useField Formik props
  <TextFieldWrapper
    label={label}
    name={name}
    id={id}
    inputComponent={DollarInput}
  />
);

DollarField.propTypes = {
  name: PropTypes.string.isRequired,
  label: PropTypes.string.isRequired,
  id: PropTypes.string.isRequired
};

export default DollarField;
