import React, { useEffect, useState, useContext } from 'react';
import PropTypes from 'prop-types';

import { useQuery, useMutation } from '@apollo/client';
import { MY_PLANS } from '@graphql/queries/plans';

import 'twin.macro';
import { ADD_PLAN, DUPLICATE_PLAN } from '@graphql/mutations/plan';
import SwiperContext from '../SwiperProvider';

const TryAnother = ({ setOpen }) => {
  const { loading, error, data } = useQuery(MY_PLANS);
  const swiperRef = useContext(SwiperContext);
  const [duplicatePlan] = useMutation(DUPLICATE_PLAN, {
    onCompleted: () => {
      setOpen(false);
      swiperRef.current.update();
      swiperRef.current.slideTo(swiperRef.current.slides.length - 1);
    }
  });
  const [addPlan] = useMutation(ADD_PLAN, {
    onCompleted: () => {
      setOpen(false);
      swiperRef.current.update();
      swiperRef.current.slideTo(swiperRef.current.slides.length - 1);
    }
  });
  const [selectedPlanId, setSelectedPlanId] = useState(null);
  useEffect(() => {
    if (data.me && data.me.plans && data.me.plans.length > 0) {
      setSelectedPlanId(data.me.plans[data.me.plans.length - 1].id);
    }
  }, [loading, data.me]);

  const callDuplicatePlan = () =>
    duplicatePlan({
      variables: {
        id: parseInt(selectedPlanId, 10)
      },
      update: (cache, { data: { duplicatePlan: duplicatedPlan } }) => {
        const existingResult = cache.readQuery({
          query: MY_PLANS
        });
        cache.writeQuery({
          query: MY_PLANS,
          data: {
            me: {
              ...existingResult.me,
              plans: [...existingResult.me.plans, duplicatedPlan]
            }
          }
        });
      }
    });
  const callAddPlan = () =>
    addPlan({
      update: (cache, { data: { createPlan: createdPlan } }) => {
        // Apollo cannot automatically update the cache for adding new entities
        // Gets existing result of MY_PLANS query
        // Inserts the new plan from the response
        // Similar to redux
        const existingResult = cache.readQuery({ query: MY_PLANS });
        cache.writeQuery({
          query: MY_PLANS,
          data: {
            me: {
              ...existingResult.me,
              plans: [...existingResult.me.plans, createdPlan]
            }
          }
        });
      }
    });

  return (
    <div tw="p-5 md:p-3">
      <h3 tw="font-bold mb-1">Try another plan</h3>
      <p tw="mb-2">Why not try a different scenario and compare plans?</p>
      <div tw="space-y-1 smlp:(flex space-y-0 space-x-2)">
        {loading && <div>Loading plans...</div>}
        {error && <div tw="text-red-500">Error loading plans</div>}
        <select
          value={selectedPlanId}
          onChange={(e) => setSelectedPlanId(e.target.value)}
          tw="p-1 border border-black rounded-8 block w-full"
        >
          {data.me &&
            data.me.plans.map((plan) => (
              <option value={plan.id}>Copy {plan.title}</option>
            ))}
          <option value="">Start a fresh plan</option>
        </select>
        <button
          type="button"
          tw="block w-full bg-mirza-purple rounded-8 px-2 py-1 text-white"
          onClick={() => (selectedPlanId ? callDuplicatePlan() : callAddPlan())}
        >
          Create
        </button>
      </div>
    </div>
  );
};

TryAnother.propTypes = {
  setOpen: PropTypes.func.isRequired
};

export default TryAnother;
