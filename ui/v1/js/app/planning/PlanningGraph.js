import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FlexibleXYPlot, VerticalBarSeries, XAxis, YAxis, HorizontalGridLines, Hint } from 'react-vis';
import { Grid, FormControlLabel } from '@material-ui/core';
import { useTheme } from '@material-ui/core/styles';
import { GraphLegends, Checkbox, Tooltip, IncomeBreakdown, SquareButton } from '../../elements';
import { nFormatter, firstWord, moneyArrayToGraphPoints, convertToCSV, partnerName } from '../../utils';
import { useAuth } from '../../context/auth';
import useStyles from './styles/PlanningGraphStyles';
import ChildBirthLabel from './ChildBirthLabel';

const PlanningGraph = ({ planningData, extraData, setExtraData }) => {
  const { user } = useAuth();
  const { colors } = useTheme();
  const currentYear = new Date().getFullYear();
  const [myselfIncomeData, setMyselfIncomeData] = useState([]);
  const [partnerIncomeData, setPartnerIncomeData] = useState([]);
  const [totalExpensesData, setTotalExpensesData] = useState([]);
  const [totalLossData, setTotalLossData] = useState([]);
  const [childBirthYear, setChildBirthYear] = useState(null);
  const [nearPoint, setNearPoint] = useState(null);

  // console.log('extra Data',extraData);
  // console.log('nearpoint: ', nearPoint);
  // console.log('planning data: ', planningData);


  const [legends, setLegends] = useState([
    { title: `${firstWord(user.name)}'s earnings`, color: colors.grannysmith, show: 'splited' },
    { title: 'Merged earnings', color: colors.nevada, show: 'merged' },
    {
      title: 'Parenthood Penalty',
      color: colors.mountbattenpink,
      style: 'dashed',
      show: 'always',
      tooltip: 'motherhood'
    },
    { title: `${partnerName(user.partner_name)}'s earnings`, color: colors.capecod, show: 'splited' },
    { title: 'Family Expenses', color: colors.tawnyport, show: 'always' }
  ]);
  const classes = useStyles();
  const styles = {
    gridLine: { stroke: colors.gridLines },
    axis: {
      line: { stroke: 'none' },
      ticks: { stroke: colors.opaquePurpleBackground },
      text: {
        fill: colors.opaquePurpleBackground,
        stroke: 'none',
        fontWeight: 500
      }
    }
  };

  const handleSplitBarsChange = () => {
    setExtraData((state) => ({ ...state, split_incomes: !state.split_incomes }));
  };

  // Toggle hidden attr based on splitBars state
  useEffect(() => {
    setLegends((legends) => {
      return legends.map((item) => ({
        ...item,
        hidden:
          (extraData.split_incomes && item.show === 'merged') || (!extraData.split_incomes && item.show === 'splited')
      }));
    });
  }, [extraData]);

  useEffect(() => {
    const fetchIncome = async () => {
      const response = await axios.get('/api/planning/income', {
        params: extraData
      });
      const incomePlan = response.data;

      setMyselfIncomeData(incomePlan.self);
      setPartnerIncomeData(incomePlan.partner);
      setNearPoint(null);
      const totalLossAdjusted = moneyArrayToGraphPoints(incomePlan.totalLoss, currentYear).map(({ x, y }) => {
        if (y < 0) y = 0;
        return { x, y };
      });
      setTotalLossData(totalLossAdjusted);
    };

    fetchIncome();
  }, [planningData, extraData]);

  useEffect(() => {
    const fetchExpenses = async () => {
      const response = await axios.get('/api/planning/expenses', {
        params: extraData
      });
      const { expenses } = response.data;

      setTotalExpensesData(expenses);
    };

    fetchExpenses();
  }, [planningData, extraData]);

  useEffect(() => {
    const yearOffset = extraData.childbirth_on_year - 1;
    if (yearOffset < 0 || extraData.years_in_future < extraData.childbirth_on_year) {
      return setChildBirthYear(null);
    }
    setChildBirthYear(currentYear + yearOffset);
  }, [extraData]);

  const fetchCSV = () => {
    const fakeLink = document.createElement('a');
    document.body.appendChild(fakeLink);

    const csvData = new Blob(
      [convertToCSV(extraData, myselfIncomeData, partnerIncomeData, totalLossData, totalExpensesData)],
      { type: 'text/csv;charset=utf-8;' }
    );

    fakeLink.href = window.URL.createObjectURL(csvData);
    fakeLink.download = 'mirza.csv';
    fakeLink.click();
  };

  return (
    <div>
      <div className={classes.exportContainer}>
        <SquareButton theme="contrast" data-sel="csv-download" onClick={fetchCSV}>
          Export
        </SquareButton>
      </div>
      <Grid container spacing={2}>
        <Grid item sm={4}>
          <FormControlLabel
            data-sel="split_bars"
            control={
              <Checkbox
                className={classes.checkboxCont}
                checked={extraData.split_incomes}
                onChange={handleSplitBarsChange}
                name="split_bars"
              />
            }
            label="Separate Earnings & Expenses"
            classes={{ label: classes.checkboxLabelText }}
          />
        </Grid>
        <Grid item sm={8}>
          <GraphLegends width={300} items={legends} />
        </Grid>
      </Grid>
      <FlexibleXYPlot
        stackBy="y"
        height={300}
        xType="ordinal"
        onMouseLeave={() => {
          setNearPoint(null);
        }}
      >
        {Boolean(nearPoint) && (
          <Hint value={nearPoint} align={{ horizontal: 'leftEdge' }}>
            <Tooltip visible skipOffset content={<IncomeBreakdown data={nearPoint} />}>
              <div style={{ width: 20, transform: `translateX(${nearPoint.x}px)` }} />
            </Tooltip>
          </Hint>
        )}
        <HorizontalGridLines style={styles.gridLine} />
        <YAxis tickFormat={(val) => nFormatter(val, 1)} style={styles.axis} />
        <XAxis tickFormat={(val) => val.toString()} style={styles.axis} />
        <XAxis
          hideLine
          style={{ line: { stroke: 'none' } }}
          tickFormat={(value) => (
            <ChildBirthLabel
              value={value}
              childbirthYear={childBirthYear}
              backgroundColor={colors.capecod}
              textColor={colors.white}
            />
          )}
        />
        {extraData.split_incomes
          ? splitedBars({
            user,
            myselfIncomeData,
            partnerIncomeData,
            totalExpensesData,
            totalLossData,
            colors,
            setNearPoint
          })
          : unifiedBars({
            myselfIncomeData,
            partnerIncomeData,
            totalExpensesData,
            totalLossData,
            colors,
            setNearPoint
          })}
      </FlexibleXYPlot>
    </div>
  );
};

// As the order of declaring components matters on how react-vis renders everything inside a plot,
// that's the reason why expenses is listed first on the array here
const unifiedBars = ({
  myselfIncomeData,
  partnerIncomeData,
  totalExpensesData,
  totalLossData,
  colors,
  setNearPoint
}) => {
  return [
    <VerticalBarSeries
      key="myselfIncome"
      data={myselfIncomeData}
      color={colors.nevada}
      barWidth={0.5}
      onNearestX={(value, { index, innerX }) => {
        const self_value = myselfIncomeData[index];
        const partner_value = partnerIncomeData[index];
        const expenses = totalExpensesData[index];
        const x = innerX + 30; // YLabel's width is 30
        setNearPoint({ x, y: (self_value?.y || 0) + (partner_value?.y || 0), self_value, partner_value, expenses });
      }}
    />,
    <VerticalBarSeries key="partnerIncome" data={partnerIncomeData} color={colors.nevada} barWidth={0.5} />,
    <VerticalBarSeries
      key="totalLossData"
      barWidth={0.5}
      data={totalLossData}
      style={{ fillOpacity: 0, stroke: colors.mountbattenpink, strokeDasharray: '5 2' }}
    />,
    <VerticalBarSeries
      className="total-expenses-bar-series"
      key="expenses"
      data={totalExpensesData}
      color={colors.tawnyport}
      barWidth={1}
      cluster="expenses"
    />
  ];
};

// ...and at last here
const splitedBars = ({
  user,
  myselfIncomeData,
  partnerIncomeData,
  totalExpensesData,
  totalLossData,
  colors,
  setNearPoint
}) => {
  const bars = [];
  bars.push(<VerticalBarSeries key="partnerIncome" data={partnerIncomeData} color={colors.capecod} cluster="income" />);
  // If user is PCG bar will be on top, otherwise at bottom
  bars[user.is_primary_care_giver ? 'push' : 'unshift'](
    <VerticalBarSeries
      key="myselfIncome"
      data={myselfIncomeData}
      color={colors.grannysmith}
      cluster="income"
      onNearestX={(value, { index, innerX }) => {
        const self_value = myselfIncomeData[index];
        const partner_value = partnerIncomeData[index];
        const expenses = totalExpensesData[index];
        const x = innerX + 30; // YLabel's width is 30
        setNearPoint({ x, y: (self_value?.y || 0) + (partner_value?.y || 0), self_value, partner_value, expenses });
      }}
    />
  );
  bars.push(
    <VerticalBarSeries
      key="totalLossData"
      data={totalLossData}
      cluster="income"
      style={{ fillOpacity: 0, stroke: colors.mountbattenpink, strokeDasharray: '5 2' }}
    />
  );
  bars.push(<VerticalBarSeries key="expenses" data={totalExpensesData} color={colors.tawnyport} cluster="expenses" />);

  return bars;
};

export default PlanningGraph;
