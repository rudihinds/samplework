import React from 'react';
import { FieldArray, useFormikContext } from 'formik';
import { SVG as PlusIcon } from '@assets/add-section-button-icon.svg';
import PropTypes from 'prop-types';
import 'twin.macro';

const FieldGroupCollection = ({
  name,
  addText,
  itemComponent,
  requiredField,
  itemCss
}) => {
  const ItemComponent = itemComponent;
  const { submitForm, values } = useFormikContext();
  return (
    <FieldArray
      name={name}
      render={(arrayHelpers) => {
        const handleDelete = (index) => {
          arrayHelpers.remove(index);
          submitForm();
        };
        const filteredValues = values[name] || [];
        // const filteredValues =
        //   filterKey && typeof filterValue !== 'undefined'
        //     ? values[name].filter((item) => item[filterKey] === filterValue)
        //     : values[name];
        // console.log(filterKey, filterValue, filteredValues);
        return (
          <div css={[itemCss]}>
            {filteredValues.map((item, index) => (
              <ItemComponent
                key={item.id}
                name={name}
                index={index}
                onDelete={handleDelete}
                allowDelete={filteredValues.length > 1}
              />
            ))}
            <button
              onClick={() => {
                arrayHelpers.push({});
                submitForm();
              }}
              type="button"
              disabled={
                filteredValues.length > 0 &&
                !filteredValues[filteredValues.length - 1][requiredField]
              }
              tw="mt-2! flex space-x-1 text-mirza-green disabled:opacity-50"
            >
              <PlusIcon />
              <span>{addText}</span>
            </button>
          </div>
        );
      }}
    />
  );
};

FieldGroupCollection.propTypes = {
  name: PropTypes.string.isRequired,
  addText: PropTypes.string.isRequired,
  itemComponent: PropTypes.node.isRequired,
  requiredField: PropTypes.string.isRequired,
  itemCss: PropTypes.string
};

FieldGroupCollection.defaultProps = {
  itemCss: null
};

export default FieldGroupCollection;
