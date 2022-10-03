import React from 'react';
import DollarField from '@components/reuseable/form-fields/DollarField';
import NextPreviousButtons from './NextPreviousButtons';
import 'twin.macro';

function ExpensesForm() {
  return (
    <div>
      <p tw="mb-2.5">
        <strong>MONTHLY EXPENSES</strong>
      </p>
      <div tw="space-y-1 mb-3 md:(flex-row mb-4.5)">
        <div tw="space-y-1 md:(flex space-y-0 space-x-2)">
          <div tw="flex-1">
            <DollarField
              label="Mortgage or rent"
              name="expenses_mortgage_rent"
            />
          </div>
          <div tw="flex-1">
            <DollarField label="Healthcare" name="expenses_healthcare" />
          </div>
        </div>
        <div tw="space-y-1 md:(flex space-y-0 space-x-2)">
          <div tw="flex-1">
            <DollarField label="Student loan" name="expenses_student_loan" />
          </div>
          <div tw="flex-1">
            <DollarField label="Other" name="expenses_other" />
          </div>
        </div>
      </div>
      <NextPreviousButtons />
    </div>
  );
}

export default ExpensesForm;
