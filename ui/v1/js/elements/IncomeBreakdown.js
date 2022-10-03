import React, { Fragment } from 'react';
import classnames from 'classnames';
import { groupBy, reduce } from 'lodash';
import { useTranslation } from 'react-i18next';
import { makeStyles } from '@material-ui/core';
import { firstWord, partnerName } from '../utils';

const useStyles = makeStyles(
  ({ colors }) => ({
    breakdownTable: {
      borderCollapse: 'collapse',
      borderSpacing: '8px'
    },
    breakdownTableLabel: {
      textAlign: 'left',
      paddingRight: 24
    },
    breakdownTableValue: {
      textAlign: 'right'
    },
    negativeCell: {
      color: colors.red
    },
    positiveCell: {
      color: colors.deyork
    },
    separator: {
      border: '0',
      borderBottom: '1px solid rgba(255, 255, 255, 0.3)',
      margin: '7px 0'
    }
  }),
  { name: 'IncomeBreakdown' }
);

const IncomeBreakdown = ({ data }) => {
  const user = firstWord(data.self_value.username);
  const has_partner = data.self_value.has_partner;
  const partner_name = partnerName(data.partner_value.username);
  const { self_value, partner_value } = data;
  const breakdowns = self_value.breakdown.concat(partner_value.breakdown).filter((bd) => bd.apply);
  const groupedBreakdowns = groupBy(breakdowns, 'label');
  const reducedBreakdowns = reduce(
    groupedBreakdowns,
    (result, value, key) => {
      const sumValue = value
        .map((i) => (i.negative ? Number(i.value) * -1 : Number(i.value)))
        .reduce((carry, v) => carry + v, 0);
      result.push({ label: key, value: Math.abs(sumValue), negative: sumValue < 0 });
      return result;
    },
    []
  );
  const finalBreakdown = reducedBreakdowns
    .sort((x, y) => x.negative - y.negative)
    .filter((n) => Number(n.value.toFixed()) !== 0);
  const { expenses } = data;
  if (!expenses) return null;
  if (expenses.breakdown?.length) expenses.breakdown = expenses.breakdown.filter((n) => Number(n.value));

  return (
    <OneBreakdown
      income={Number(self_value.income) + Number(partner_value.income)}
      data={finalBreakdown}
      expenses={expenses}
      user={user}
      has_partner={has_partner}
      partner_name={partner_name}
    />
  );
};

const BreakdownRow = ({ item, label }) => {
  const { t } = useTranslation();
  const classes = useStyles();
  const tdValuesClasses = classnames({
    [classes.breakdownTableValue]: true,
    [classes.negativeCell]: item.negative,
    [classes.positiveCell]: !item.negative
  });

  return (
    <tr>
      <td className={classes.breakdownTableLabel}>{label || item.label}</td>
      <td className={tdValuesClasses}>
        {item.negative ? '-' : '+'} {t('{{value, number}}', { value: Number(item.value) })}
      </td>
    </tr>
  );
};

const Separator = () => {
  const classes = useStyles();
  return (
    <tr>
      <td colSpan={2}>
        <hr className={classes.separator} />
      </td>
    </tr>
  );
};

const OneBreakdown = ({ data, income, expenses, user, has_partner, partner_name }) => {
  const { t } = useTranslation();
  const classes = useStyles();
  return (
    <table data-sel="graph-tooltip" className={classes.breakdownTable}>
      <thead>
        <tr>
          <th className={classes.breakdownTableLabel}>
            <strong>
              {user}
              {has_partner && ` and ${partner_name}`}
            </strong>
          </th>
          <th className={classes.breakdownTableValue}>$USD</th>
        </tr>
      </thead>

      <tbody>
        <tr>
          <td className={classes.breakdownTableLabel}>Annual Income</td>
          <td className={classes.breakdownTableValue}>{t('{{value, number}}', { value: Number(income) })}</td>
        </tr>
        {data.map((item, index, array) => {
          const nextVal = index + 1;

          return (
            <Fragment key={index}>
              <BreakdownRow item={item} />
              {!array[index].negative && array[nextVal]?.negative && <Separator />}
            </Fragment>
          );
        })}
        {expenses?.breakdown && Boolean(Object.values(expenses?.breakdown).length) && (
          <Fragment>
            <Separator />
            <tr>
              <td colSpan={2}>
                <strong>Expenses</strong>
              </td>
            </tr>
            {expenses.breakdown.map((item, index) => {
              const label = t(`expenses_labels.${item.label}`);
              return <BreakdownRow item={item} label={label} key={index} />;
            })}
          </Fragment>
        )}
      </tbody>
    </table>
  );
};

export default IncomeBreakdown;
