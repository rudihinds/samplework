import React from 'react';
import PropTypes from 'prop-types';
import TextFieldWrapper from './TextFieldWrapper';
import StyledInput from './StyledInput';

/* eslint-disable react/jsx-props-no-spreading */
const TextInput = ({ field }) => <StyledInput {...field} />;
TextInput.propTypes = {
  field: PropTypes.shape({}).isRequired
};

const TextField = ({ name, label, id }) => (
  // TextFieldWrapper wraps StyledInput with <label> and error components
  // Also automatically passes in useField Formik props
  <TextFieldWrapper
    label={label}
    name={name}
    id={id}
    inputComponent={TextInput}
  />
);
TextField.propTypes = {
  name: PropTypes.string.isRequired,
  label: PropTypes.string.isRequired,
  id: PropTypes.string.isRequired
};

export default TextField;
