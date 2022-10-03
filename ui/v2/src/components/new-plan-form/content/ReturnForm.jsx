import React from 'react';
import { useQuery } from '@apollo/client';
import { ME } from '@graphql/queries/user';
import ReturnItems from '../return-items';
import 'twin.macro';
import NextPreviousButtons from './NextPreviousButtons';

function ReturnForm() {
  const { data, error, loading } = useQuery(ME);
  console.log(loading, error, data);

  return (
    <div>
      <p tw="mb-2">
        <strong>RETURN TO WORK PLAN</strong>
      </p>
      <div tw="mb-3">
        {data && data.me && <ReturnItems name={data.me.name} />}
      </div>
      <div tw="mb-3">
        {data && data.me?.has_partner && (
          <ReturnItems name={data.me.partner_name} isPartner />
        )}
      </div>
      <NextPreviousButtons />
    </div>
  );
}

export default ReturnForm;
