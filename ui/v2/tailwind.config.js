const defaultTheme = require('tailwindcss/defaultTheme');

const spacing = () => {
  const obj = { px: '1px' };
  for (let i = 0; i <= 100; i += 0.1) {
    let j = parseFloat(i.toFixed(1));
    if (Number.isInteger(j)) j = Number(j);
    obj[j.toString()] = `${j}rem`;
  }
  return obj;
};
const fontSize = () => {
  const obj = {};
  for (let i = 10; i <= 60; i += 1) {
    const value = i / 10;
    if (Number.isInteger(value)) {
      obj[value.toString()] = `${value.toString()}rem`;
    } else {
      obj[value.toFixed(1)] = `${value.toFixed(1)}rem`;
    }
  }
  return obj;
};

module.exports = {
  theme: {
    screens: {
      sm: '640px',
      md: '768px',
      smLp: '971px',
      smlp: '971px',
      lg: '1024px',
      xl: '1280px',
      '2xl': '1536px'
    },
    extend: {
      colors: {
        'mirza-purple': '#6116ff',
        'mirza-green': '#00c99f',
        'mirza-teal': '#2AA79F',
        'mirza-lightgrey': '#F7F7F8',
        'mirza-beige': '#faecda',
        'grey-2': '#969696',
        'grey-3': '#8A8A8A',
        'grey-4': '#9e9e9e',
        'grey-5': '#F2F2F2',
        'mid-grey': '#f7f7f8',
        'dark-grey': '#333333',
        'dark-green': '#55666B',
        'purple-2': '#582EFF',
        'teal-2': '#31C5A1'
      },
      animation: {
        'spin-fast': 'spin 0.5s linear infinite'
      },
      backgroundColor: {
        'grey-4': '#F2F2F2'
      }
    },
    spacing: {
      // ...defaultTheme.spacing,
      ...spacing()
    },
    fontSize: {
      ...defaultTheme.fontSize,
      ...fontSize()
    },
    fontFamily: {
      serif: ['"Recoleta"', ...defaultTheme.fontFamily.serif],
      heading: ['"Euclid Circular A"', ...defaultTheme.fontFamily.sans],
      sans: ['"Euclid Circular A"', ...defaultTheme.fontFamily.sans]
    },
    borderRadius: {
      ...defaultTheme.borderRadius,
      DEFAULT: '8px',
      0: '0',
      2: '2px',
      3: '3px',
      4: '4px',
      6: '6px',
      8: '8px',
      14: '14px',
      16: '16px',
      18: '18px'
    }
    // backgroundColor: {
    //   ...defaultTheme.backgroundColor,
    //   'grey-4': '#F2F2F2',
    // }
  },
  plugins: [],
  variants: {
    extend: {
      margin: ['last']
    }
  }
};
