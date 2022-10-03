import React, { useState } from 'react';
import PropTypes from 'prop-types';
import CommonCard from '@reuseable/cards/CommonCard';
import EditPlanButton from '@reuseable/buttons/EditPlanButton';
import FormContainer from '@components/new-plan-form/FormContainer';
import ChartWithControls from './ChartWithControls';
import 'twin.macro';

const Plan = ({ plan, plans }) => {
  const [open, setOpen] = useState(true);
  // const toggleOpenEditForm = () => setOpen(!open);

  return (
    <div>
      <CommonCard
        tw="bg-mid-grey p-2.5 px-1.5 md:p-3 space-y-2 mt-0"
        style={{ paddingBottom: '28px' }}
      >
        <ChartWithControls plan={plan} plans={plans} />
        <EditPlanButton open={open} setOpen={setOpen} />
        {open && <FormContainer planId={plan.id} />}
      </CommonCard>
    </div>
  );
};

Plan.propTypes = {
  plan: PropTypes.shape({
    id: PropTypes.number.isRequired
  }).isRequired,
  plans: PropTypes.instanceOf(Array).isRequired
};

export default Plan;
