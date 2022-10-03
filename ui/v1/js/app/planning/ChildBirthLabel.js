import React from 'react';

const ChildBirthLabel = ({ value, childbirthYear, backgroundColor, textColor, label }) => {
  if (Number(value) !== childbirthYear) return null;

  return (
    <g transform="translate(-25, 25)">
      <rect x="0" y="0" width="50" height="14" rx="6" fill={backgroundColor} stroke={backgroundColor} />
      <text x="4" y="10" fill={textColor} style={{ fontSize: '0.6rem' }}>
        {label}
      </text>
    </g>
  );
};

ChildBirthLabel.defaultProps = {
  label: 'childbirth'
};

export default ChildBirthLabel;
