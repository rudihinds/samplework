import React from 'react';
import { useField, useFormikContext } from 'formik';
import PropTypes from 'prop-types';
import 'twin.macro';

/* eslint-disable react/jsx-props-no-spreading */
const TextFieldWrapper = ({ label, name, id, inputComponent }) => {
  const [field, meta, helpers] = useField({ name, id });
  const _onBlur = field.onBlur;
  const { submitForm } = useFormikContext();
  field.type = 'text';
  field.onBlur = (e) => {
    _onBlur(e);
    submitForm();
  };
  field.onKeyDown = (e) => {
    if (e.key === 'Enter') {
      submitForm();
    }
  };
  const InputComponent = inputComponent;
  const inputComponentProps = { field, meta, helpers };
  return (
    <div tw="flex-col">
      <label
        htmlFor={id || name}
        tw="flex mb-1 text-grey-3 text-1.5 md:text-1.4"
      >
        {label}
      </label>
      <InputComponent {...inputComponentProps} />
      {/* <div>touched: {JSON.stringify(meta)}</div> */}
      {meta.touched && meta.error ? (
        <div tw="text-red-500 text-1.2" className="error">
          {meta.error}
        </div>
      ) : null}
    </div>
  );
};

TextFieldWrapper.propTypes = {
  label: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  id: PropTypes.string,
  inputComponent: PropTypes.node.isRequired
};

TextFieldWrapper.defaultProps = {
  id: null
};

export default TextFieldWrapper;
