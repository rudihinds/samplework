import { unparse } from 'papaparse';
/**
 * Get first word of a string
 */
export const firstWord = (string) => {
  string = string || '';
  return string.trim().split(' ')[0];
};

/**
 * Get partner name
 */
export const partnerName = (name) => {
  let partnerName = firstWord(name || '');
  if (!partnerName.length) {
    partnerName = 'Partner';
  }
  return partnerName;
};

/**
 * Toggle (remove or add) a value, just for tracking...
 */
export const toggleFromArray = (_arr, key) => {
  const arr = [..._arr];
  if (arr.includes(key)) {
    arr.splice(arr.indexOf(key), 1);
  } else {
    arr.push(key);
  }
  return arr;
};

/**
 * Formats a number in terms of thousands
 *
 * ex: 100,000 => 100K
 * ex: 100,000,000 => 100M
 *
 * @param { Number } num
 * @param { Number } digits
 * @returns { String }
 */
export const nFormatter = (num, digits) => {
  const si = [
    { value: 1, symbol: '' },
    { value: 1e3, symbol: 'K' },
    { value: 1e6, symbol: 'M' },
    { value: 1e9, symbol: 'G' },
    { value: 1e12, symbol: 'T' },
    { value: 1e15, symbol: 'P' },
    { value: 1e18, symbol: 'E' }
  ];
  const rx = /\.0+$|(\.[0-9]*[1-9])0+$/;
  let i;
  for (i = si.length - 1; i > 0; i--) {
    if (num >= si[i].value) {
      break;
    }
  }
  return (num / si[i].value).toFixed(digits).replace(rx, '$1') + si[i].symbol;
};

/**
 *
 * Transform a flat array of values to an array of points with X starting on [initialX]
 * and Y with current value in index
 *
 * @param { Array } data
 * @param { Number } initialX
 * @returns { Array }
 */
export const moneyArrayToGraphPoints = (data, initialX) => {
  return data
    .map((value) => Number(value))
    .map((value, index) => ({
      x: initialX + index,
      y: value
    }));
};

/**
 *
 * Generate a CSV from arrays of values
 *
 */
export const convertToCSV = (extraData, myselfIncomeData, partnerIncomeData, totalLossData, totalExpensesData) => {
  const fields = extraData.split_incomes
    ? ['', 'Income self', 'Income Partner', 'Motherhood Penalty', 'Family Expenses']
    : ['', 'Merged earnings', 'Motherhood Penalty', 'Family Expenses'];
  const data = [];
  for (let i = 0; i < extraData.years_in_future; i++) {
    const row = [];
    row.push(myselfIncomeData[i].x);
    if (extraData.split_incomes) {
      row.push(myselfIncomeData[i].y);
      row.push(partnerIncomeData[i]?.y || 0);
    } else {
      row.push(Number(myselfIncomeData[i].y) + Number(partnerIncomeData[i]?.y || 0));
    }
    const motherhoodPenalty = totalLossData[i]?.y || 0;
    row.push(motherhoodPenalty < 0 ? 0 : motherhoodPenalty);
    data.push(row);
    data.push(
      Array(extraData.split_incomes ? 4 : 3)
        .fill(null)
        .concat([totalExpensesData[i]?.y || 0])
    );
  }
  const csv = unparse({ data, fields }, { headers: true, skipEmptyLines: true });
  return csv;
};
