import React, { useState, useContext } from 'react';
import Controls from '@plan-creator/plan/Controls';

import { css } from 'twin.macro';
import {
  CLEAR_PLAN,
  DELETE_PLAN,
  SET_CHILDBIRTH_YEAR,
  SET_VIEW_TYPE,
  SET_VIEW_YEARS
} from '@graphql/mutations/plan';

import { useMutation, useQuery } from '@apollo/client';
import { MY_PLANS } from '@graphql/queries/plans';

import PropTypes from 'prop-types';

import { SET_DEFAULT_PLAN } from '@graphql/mutations/user';
import { ME } from '@graphql/queries/user';
import MirzaModal from '@components/modals/MirzaModal';
import Chart from './chart';
import SwiperContext from '../SwiperProvider';
import { ChartProvider } from './chart/ChartContext';

// GraphQL queries here pass props into each sub-component

const ChartWithControls = ({
  plan,
  allowChoosingDefaultPlan = false,
  plans = []
}) => {
  const swiperRef = useContext(SwiperContext);
  const [setViewType] = useMutation(SET_VIEW_TYPE);
  const [setViewYears] = useMutation(SET_VIEW_YEARS);
  const [deletePlan] = useMutation(DELETE_PLAN, {
    onCompleted() {
      swiperRef.current.update();
    }
  });
  const [setDefaultPlan] = useMutation(SET_DEFAULT_PLAN);
  const [clearPlan] = useMutation(CLEAR_PLAN);
  const [setChildbirthYear] = useMutation(SET_CHILDBIRTH_YEAR);
  const { data: { me } = { me: {} } } = useQuery(ME);
  const [cannotDeleteModalOpen, setCannotDeleteModalOpen] = useState(false);
  return (
    <div tw="space-y-3">
      <Controls
        title={plan.title}
        allowChoosingDefaultPlan={allowChoosingDefaultPlan}
        planId={plan.id}
        plans={plans}
        viewType={plan.view_type}
        viewYears={plan.view_years}
        selfName={me.name}
        partnerName={me.partner_name}
        childbirthYear={plan.childbirth_year}
        onSetChildbirthYear={(year) =>
          setChildbirthYear({
            variables: {
              id: plan.id,
              year: parseInt(year, 10)
            }
          })
        }
        onSetViewType={(view_type) =>
          setViewType({
            variables: {
              id: plan.id,
              view_type
            }
          })
        }
        onSetViewYears={(view_years) => {
          setViewYears({
            variables: {
              id: plan.id,
              view_years
            }
          });
        }}
        onSetDefaultPlan={(default_plan_id) => {
          setDefaultPlan({
            variables: {
              plan_id: parseInt(default_plan_id, 10)
            }
          });
        }}
        onExportAsCSV={() => {}}
        onClearPlan={() => {
          clearPlan({
            variables: {
              id: plan.id
            }
          });
        }}
        onDeletePlan={() => {
          if (plan.id === me.default_plan_id) {
            console.log('Cannot delete default plan');
            setCannotDeleteModalOpen(true);
            return;
          }
          deletePlan({
            variables: {
              id: plan.id
            },
            update: (cache, { data: { deletePlan: deletedPlan } }) => {
              // Apollo cannot do automatic cache updates for create/delete
              // Read the existing query
              const existingResult = cache.readQuery({
                query: MY_PLANS
              });
              // Update the local query (similar to Redux)
              // deletePlan is the result from graphql
              cache.writeQuery({
                query: MY_PLANS,
                data: {
                  me: {
                    ...existingResult.me,
                    plans: existingResult.me.plans.filter(
                      (p) => p.id !== deletedPlan.id
                    )
                  }
                }
              });
            }
          });
        }}
      />
      <ChartProvider value={{}}>
        <Chart plan={plan} me={me} />
      </ChartProvider>
      <MirzaModal
        open={cannotDeleteModalOpen}
        onClose={() => setCannotDeleteModalOpen(false)}
      >
        <h2 tw="mb-0.5 md:mb-1 text-center">Cannot delete default plan</h2>
        <p
          tw="text-center"
          css={[
            css`
              max-width: 30ch;
            `
          ]}
        >
          Switch the default plan on Dashboard before deleting.
        </p>
      </MirzaModal>
    </div>
  );
};

ChartWithControls.propTypes = {
  plan: PropTypes.shape({
    id: PropTypes.number.isRequired,
    title: PropTypes.string.isRequired,
    view_type: PropTypes.string.isRequired,
    view_years: PropTypes.string.isRequired,
    childbirth_year: PropTypes.number.isRequired
  }).isRequired,
  allowChoosingDefaultPlan: PropTypes.bool,
  plans: PropTypes.instanceOf(Array)
};

ChartWithControls.defaultProps = {
  allowChoosingDefaultPlan: false,
  plans: []
};

export default ChartWithControls;
