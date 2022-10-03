import React from 'react';
import addSection from '@assets/add-section-button-icon.svg';
import 'twin.macro';
import { FieldArray, useFormikContext } from 'formik';
import ChildcareItem from '../childcare-item';
import NextPreviousButtons from './NextPreviousButtons';

function ChildcareForm() {
  const { values, submitForm } = useFormikContext();
  return (
    <div>
      <p tw="mb-2">
        <strong>CHILDCARE COSTS</strong>
      </p>
      <div tw="mb-3 md:mb-4.5">
        <FieldArray
          name="childcare_items"
          render={(arrayHelpers) => {
            const handleDelete = (index) => {
              arrayHelpers.remove(index);
              submitForm();
            };
            return (
              <div tw="space-y-2">
                {values.childcare_items.map((item, index) => (
                  <ChildcareItem
                    key={item.id}
                    index={index}
                    onDelete={handleDelete}
                    allowDelete={values.childcare_items.length > 1}
                  />
                ))}
                <button
                  onClick={() => {
                    arrayHelpers.push({
                      childcare_type: '',
                      days_per_week: '',
                      cost_per_month: ''
                    });
                    submitForm();
                  }}
                  type="button"
                  disabled={
                    values.childcare_items.length > 0 &&
                    !values.childcare_items[values.childcare_items.length - 1]
                      .childcare_type
                  }
                  tw="flex space-x-1 text-mirza-green disabled:opacity-50"
                >
                  <img src={addSection} alt="" />
                  <span>Add another childcare type</span>
                </button>
              </div>
            );
          }}
        />
      </div>
      <NextPreviousButtons />
    </div>
  );
}

export default ChildcareForm;
