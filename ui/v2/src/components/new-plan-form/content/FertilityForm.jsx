import React from 'react';
import SelectField from '@reuseable/form-fields/SelectField';
import smoothscroll from 'smoothscroll-polyfill';
import PropTypes from 'prop-types';
import 'twin.macro';
import NextPreviousButtons from './NextPreviousButtons';

const fertilityTypeOptions = [
  {
    id: null,
    name: 'None'
  },
  {
    id: 'ivf',
    name: 'IVF'
  },
  {
    id: 'other',
    name: 'Other'
  }
];

const alternativeFamilyOptions = [
  {
    id: null,
    name: 'None'
  },
  {
    id: 'adoption',
    name: 'Adoption'
  },
  {
    id: 'surrogacy',
    name: 'Surrogacy'
  }
];

function FertilityForm({ planId }) {
  smoothscroll.polyfill();
  return (
    <div>
      <p tw="text-1.4 mb-2">
        <strong>FERTILITY & &apos;ALTERNATIVE FAMILY&apos; OPTIONS</strong>
      </p>
      <div tw="space-y-2.5 mb-3 md:(flex space-y-0 space-x-2 mb-4.5)">
        <div tw="flex-1">
          <p tw="flex mb-1 text-mirza-green">
            <strong>Fertility</strong>
          </p>
          <div>
            <SelectField
              label="Type"
              name="fertility_type"
              options={fertilityTypeOptions}
              stringId
            />
          </div>
        </div>
        <div tw="flex-1">
          <p tw="flex mb-1 text-mirza-green">
            <strong>Alternative family</strong>
          </p>
          <SelectField
            label="Type"
            name="alternative_family_type"
            options={alternativeFamilyOptions}
            stringId
          />
        </div>
      </div>
      <NextPreviousButtons planId={planId} hideNext showReview />
    </div>
  );
}

FertilityForm.propTypes = {
  planId: PropTypes.number.isRequired
};
FertilityForm.defaultProps = {};

export default FertilityForm;
