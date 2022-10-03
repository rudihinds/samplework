import React from 'react';
import LeaveItems from '@components/new-plan-form/leave-items';
import { useQuery } from '@apollo/client';
import { ME } from '@graphql/queries/user';
import 'twin.macro';

import NextPreviousButtons from './NextPreviousButtons';

function LeaveForm() {
  const { data, error, loading } = useQuery(ME);
  console.log(loading, error, data);

  return (
    <div>
      <p tw="mb-2">
        <strong>PARENTAL LEAVE</strong>
      </p>
      <div tw="mb-3">
        {data && data.me && <LeaveItems name={data.me.name} />}
      </div>
      <div tw="mb-3">
        {data && data.me?.has_partner && (
          <LeaveItems name={data.me.partner_name} isPartner />
        )}
      </div>
      <NextPreviousButtons />
    </div>
  );
}

export default LeaveForm;
