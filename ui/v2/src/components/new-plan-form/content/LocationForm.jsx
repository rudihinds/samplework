import React from 'react';
import SelectField from '@reuseable/form-fields/SelectField';
import TextField from '@reuseable/form-fields/TextField';
import NextPreviousButtons from './NextPreviousButtons';
import 'twin.macro';

function LocationForm() {
  return (
    <div tw="flex-col ">
      <p style={{ marginBottom: '24px' }}>
        <strong>YOUR LOCATION</strong>
      </p>
      <div tw="space-y-2.5 mb-3 md:(flex mb-4.5 space-y-0 space-x-2)">
        <div tw="flex-1">
          <SelectField
            label="Country"
            name="country_id"
            isDisabled
            options={[{ id: 237, name: 'United States of America' }]}
          />
        </div>
        <div tw="flex-1">
          <TextField label="ZIP code" name="zip_code" />
        </div>
      </div>
      <NextPreviousButtons hidePrevious />
    </div>
  );
}

export default LocationForm;

// {formik.touched.zipCode && formik.errors.zipCode ? (
// <div>{formik.errors.zipCode}</div>
// ) : null}
