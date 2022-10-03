import React from 'react';
import tw from 'twin.macro';
import DollarField from '@components/reuseable/form-fields/DollarField';
import ChildcareItem from '../childcare-item';
import NextPreviousButtons from './NextPreviousButtons';
import FieldGroupCollection from '../FieldGroupCollection';

function ChildcareForm() {
  return (
    <div>
      <p tw="mb-2">
        <strong>CHILDCARE COSTS</strong>
      </p>
      <div tw="mb-2 md:mb-2">
        <FieldGroupCollection
          name="childcare_items"
          addText="Add a new childcare option"
          itemComponent={ChildcareItem}
          requiredField="childcare_type"
          itemCss={tw`space-y-2`}
        />
      </div>
      <div tw="mb-2 md:mb-3.5">
        <div tw="w-1/2">
          <DollarField
            label="Early years essentials"
            name="childcare_early_years_essentials"
          />
        </div>
      </div>
      <NextPreviousButtons />
    </div>
  );
}

export default ChildcareForm;
