import React, { useState } from 'react';
import PropTypes from 'prop-types';
import tw, { css } from 'twin.macro';
import useAlgorithm from './useAlgorithm';
import useMirzaChart from './useMirzaChart';
import Snapshots from '../Snapshots';
import useChartContext from './ChartContext';
import NoPlan from '../NoPlan';

const Chart = ({ plan, me }) => {
  const [monthlyChildCosts, setMonthlyChildCosts] = useState('...');
  const [estimatedNetIncome, setEstimatedNetIncome] = useState('...');

  const { hasData } = useChartContext();

  const { chartRef, chartJs } = useMirzaChart({ plan });
  useAlgorithm({
    chartJs,
    plan,
    me,
    setMonthlyChildCosts,
    setEstimatedNetIncome
  });

  return (
    <div>
      <div>
        <canvas css={[!hasData && tw`hidden!`]} id="chart" ref={chartRef} />
      </div>
      <div css={[hasData && tw`hidden!`]}>
        <NoPlan />
      </div>
      <div tw="space-y-1 mt-2.5 mb-2.5 md:(flex justify-center space-x-3 space-y-0 text-1.2)">
        <div tw="flex space-x-1 items-center">
          <div tw="rounded-full w-1.5 h-1.5 border border-gray-500 bg-white" />
          <div tw="flex-1">Parenthood Penalty</div>
        </div>
        <div tw="flex space-x-1 items-center">
          <div
            tw="rounded-full w-1.5 h-1.5"
            css={[
              css`
                background-color: #31c5a1;
              `
            ]}
          />
          <div tw="flex-1">{me.name}&apos;s earnings</div>
        </div>
        {me.has_partner && (
          <div tw="flex space-x-1 items-center">
            <div
              tw="rounded-full w-1.5 h-1.5 bg-mirza-purple"
              css={[
                css`
                  background-color: #582eff;
                `
              ]}
            />
            <div tw="flex-1">{me.partner_name}&apos;s earnings</div>
          </div>
        )}
      </div>
      <Snapshots
        monthlyChildCosts={monthlyChildCosts}
        estimatedNetIncome={estimatedNetIncome}
      />
    </div>
  );
};

Chart.propTypes = {
  plan: PropTypes.shape({}).isRequired,
  me: PropTypes.shape({
    name: PropTypes.string.isRequired,
    has_partner: PropTypes.bool.isRequired,
    partner_name: PropTypes.bool
  }).isRequired
};
Chart.defaultProps = {};

export default Chart;
