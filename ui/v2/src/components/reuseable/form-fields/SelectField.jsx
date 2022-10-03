import React, { useCallback } from 'react';
import { Select } from 'react-functional-select';
import { useField, useFormikContext } from 'formik';
import { find } from 'lodash';
import tw, { theme, styled } from 'twin.macro';
import Color from 'color';
import PropTypes from 'prop-types';

const SelectField = ({
  name,
  options,
  label,
  id = null,
  isDisabled = false,
  stringId = false
}) => {
  const { submitForm } = useFormikContext();

  const [, meta, helpers] = useField(name);
  const { value } = meta;
  const { setValue } = helpers;

  const initialOption = find(options, {
    id: stringId ? value : parseInt(value, 10)
  });

  console.log(initialOption);

  const handleChange = useCallback(
    (option) => {
      setValue(option.id);
      submitForm();
    },
    [setValue, submitForm]
  );

  return (
    <div className="flex-col">
      <label
        htmlFor={id || name}
        tw="flex mb-1 text-grey-3 text-1.5 md:text-1.4"
      >
        {label}
      </label>
      <SelectStyles>
        <Select
          options={options}
          initialValue={initialOption}
          onOptionChange={handleChange}
          getOptionValue={(option) => option.id}
          getOptionLabel={(option) => option.name}
          isDisabled={isDisabled}
          themeConfig={{
            color: {
              border: '#969696',
              iconSeparator: 'transparent',
              primary: theme`colors.mirza-purple`
            },
            control: {
              backgroundColor: 'white',
              padding: '1rem 1.2rem',
              borderRadius: '7px',
              boxShadowColor: Color(theme`colors.mirza-purple`)
                .alpha(0.5)
                .rgb()
                .string(),
              focusedBorderColor: theme`colors.mirza-purple`
            },
            separator: {
              width: 0,
              backgroundColor: 'transparent'
            },
            menu: {
              option: {
                focusedBgColor: Color(theme`colors.mirza-purple`)
                  .alpha(0.1)
                  .rgb()
                  .string(),
                selectedBgColor: theme`colors.mirza-purple`
              }
            }
          }}
        />
      </SelectStyles>
    </div>
  );
};

SelectField.propTypes = {
  name: PropTypes.string.isRequired,
  options: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.number.isRequired,
      name: PropTypes.string.isRequired
    })
  ).isRequired,
  label: PropTypes.string.isRequired,
  id: PropTypes.number,
  isDisabled: PropTypes.bool,
  stringId: PropTypes.bool
};

SelectField.defaultProps = {
  id: null,
  isDisabled: false,
  stringId: false
};

const SelectStyles = styled.div`
  .rfs-caret-icon {
    background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 12 7' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M1 1L6 6L11 1' stroke='%23969696'/%3E%3C/svg%3E%0A");
    width: 15px;
    height: 9px;
    border: 0;
  }

  .rfs-select-container {
    ${tw`text-1.5 md:text-1.4`}
  }
`;

export default SelectField;
