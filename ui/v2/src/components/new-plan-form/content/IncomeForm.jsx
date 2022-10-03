import React from 'react';
import 'twin.macro';
import { useQuery } from '@apollo/client';
import { ME } from '@graphql/queries/user';
import DollarField from '@components/reuseable/form-fields/DollarField';
import TextField from '@reuseable/form-fields/TextField';
import NextPreviousButtons from './NextPreviousButtons';

function IncomeForm() {
  const { data: { me } = { me: {} } } = useQuery(ME);

  return (
    <>
      <p tw="mb-2.5">
        <strong>INCOME AFTER TAX</strong>
      </p>
      <div tw="space-y-2.5 mb-3 md:(flex space-y-0 space-x-2 mb-4.5)">
        <div tw="space-y-1 flex-1">
          <div tw="flex mb-1.5">
            <p tw="text-mirza-green font-bold">{me.name}&apos;s&nbsp;</p>
            <p tw="font-bold">Income</p>
          </div>
          <div tw="flex space-x-1.5 md:(flex-col gap-0 space-x-0 space-y-1)">
            <div tw="flex-1">
              <DollarField name="self_annual_income" label="Annual Income" />
            </div>
            <div tw="flex-1">
              <TextField name="self_hours_per_week" label="Hours per week" />
            </div>
          </div>
          {/* <MyTextInput label="Industry" name="self_industry_id" /> */}
        </div>
        {me.has_partner && (
          <div tw="space-y-1 flex-1">
            <div tw="flex mb-1.5">
              <p tw="text-mirza-green font-bold">
                {me.partner_name}&apos;s&nbsp;
              </p>
              <p tw="font-bold">Income</p>
            </div>
            <div tw="flex space-x-1.5 md:(flex-col gap-0 space-x-0 space-y-1)">
              <DollarField name="partner_annual_income" label="Annual Income" />
              <TextField name="partner_hours_per_week" label="Hours per week" />
            </div>
            {/* <MyTextInput label="Industry" name="partner_industry_id" /> */}
          </div>
        )}
      </div>
      <NextPreviousButtons />
    </>
  );
}

export default IncomeForm;
