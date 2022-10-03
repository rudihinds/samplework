import { useEffect } from 'react';
import { zipWith, find } from 'lodash';
import currency from 'currency.js';
import callAlgorithm from './callAlgorithm';
import combineNetIncomes from './utils/combineNetIncomes';
import combineSelfPartner from './utils/combineSelfPartner';
import useChartContext from './ChartContext';

const min0 = (value) => (value < 0 ? 0 : value);

// Custom hook
// Calls algorithm, interprets results, and updates chart state

const monthlyChildCosts = (data) => {
  const childcareExpenses = find(data.datasets, {
    label: 'childcare_expenses'
  });
  if (childcareExpenses?.data) {
    const filteredData = childcareExpenses.data.filter((i) => i > 0);
    if (filteredData.length <= 0) {
      return currency(0);
    }
    const firstCostsYear = filteredData[0];
    return currency(firstCostsYear).divide(12);
  }
  return null;
};

const estimatedNetIncome = (netIncomes) => {
  const combined = zipWith(netIncomes.self, netIncomes.partner, (a, b) =>
    currency(a).add(b)
  );
  return combined
    .slice(0, 11)
    .reduce((sum, item) => sum.add(item), currency(0));
};

export default ({
  chartJs,
  plan,
  me,
  setMonthlyChildCosts,
  setEstimatedNetIncome
}) => {
  const { bulkSetDatasets } = useChartContext();
  useEffect(() => {
    (async () => {
      const { called, self, partner } = await callAlgorithm({ plan, me });
      if (!called) {
        console.log('Algo not called because self and partner not valid');
        return;
      }

      const _chartJs = chartJs;

      if (!self?.ok && !partner?.ok) {
        console.log('Both algo calls failed, do not draw chart');
        return;
      }

      const netIncomes = combineNetIncomes({ self, partner });

      if (_chartJs.current) {
        // Datasets is the single source of truth for chart and tooltips
        const chartJsDatasets = [
          {
            label: 'self_net_income',
            data: netIncomes.self,
            // hidden: true,
            backgroundColor: '#31C5A1'
          },
          {
            label: 'partner_net_income',
            data: netIncomes.partner,
            // hidden: true,
            backgroundColor: '#582EFF'
          },
          {
            label: 'self_interrupt',
            data: self?.ok
              ? self.response.data.user_results.interrupt_salaries.map(min0)
              : [],
            hidden: true
            // backgroundColor: '#31C5A1'
          },
          {
            label: 'partner_interrupt',
            data: partner?.ok
              ? partner.response.data.user_results.interrupt_salaries.map(min0)
              : [],
            hidden: true
            // backgroundColor: '#582EFF'
          },
          {
            label: 'combined_penalty',
            data: combineSelfPartner({ self, partner, key: 'salary_losses' }),
            backgroundColor: 'rgba(255, 255, 255, 1)',
            borderDash: [10, 5],
            borderColor: '#ccc',
            borderWidth: 2
          },
          {
            label: 'self_no_interrupt',
            data: self?.ok
              ? self.response.data.user_results.no_interrupt_salaries.map(min0)
              : [],
            hidden: true
          },
          {
            label: 'partner_no_interrupt',
            data: partner?.ok
              ? partner.response.data.user_results.no_interrupt_salaries.map(
                  min0
                )
              : [],
            hidden: true
          },
          {
            label: 'yearly_expenses',
            data: combineSelfPartner({
              self,
              partner,
              key: 'yearly_expenses'
            }),
            hidden: true
          },
          {
            label: 'childcare_expenses',
            data: combineSelfPartner({
              self,
              partner,
              key: 'childcare_expenses'
            }),
            hidden: true
          }
        ];

        bulkSetDatasets(chartJsDatasets);
        _chartJs.current.data.datasets = chartJsDatasets;

        const monthlyChildCostsCurrency = monthlyChildCosts(
          _chartJs.current.data
        );
        if (monthlyChildCostsCurrency) {
          setMonthlyChildCosts(
            currency(monthlyChildCostsCurrency, { precision: 0 }).format()
          );
        }

        setEstimatedNetIncome(
          currency(estimatedNetIncome(netIncomes), { precision: 0 }).format()
        );

        // window.datasets = _chartJs.current.data.datasets;
        _chartJs.current.update();
      }
    })();
  }, [
    plan,
    me,
    chartJs,
    setMonthlyChildCosts,
    setEstimatedNetIncome,
    bulkSetDatasets
  ]);
};
