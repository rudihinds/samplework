import React from 'react';
import tw, { styled, css } from 'twin.macro';

import { up } from 'styled-breakpoints';

import Dropdown from '@reuseable/Dropdown';
import PropTypes from 'prop-types';

const yearsItems = [
  {
    id: '5',
    value: '5 years'
  },
  {
    id: '10',
    value: '10 years'
  },
  {
    id: '15',
    value: '15 years'
  },
  {
    id: '20',
    value: '20 years'
  }
];

const choosePlanStyles = css`
  ${tw`font-heading font-bold`}
  font-size: 18px;
  line-height: 26px;
  letter-spacing: 0.2;

  ${up('sm')} {
    font-size: 20px;
    line-height: 36px;
  }

  ${up('smLp')} {
    font-size: 22px;
    line-height: 32px;
    letter-spacing: 0.2px;
  }
`;

const Controls = ({
  title,
  allowChoosingDefaultPlan = false,
  plans = [],
  planId,
  // viewType,
  viewYears,
  childbirthYear,
  // selfName,
  // partnerName,
  // onSetViewType,
  onSetChildbirthYear,
  onSetViewYears,
  onExportAsCSV,
  onClearPlan,
  onDeletePlan,
  onSetDefaultPlan
}) => {
  const hamburgerOnChange = (actionId) => {
    switch (actionId) {
      case 'export_csv':
        return onExportAsCSV();
      case 'clear_plan':
        return onClearPlan();
      case 'delete_plan':
        return onDeletePlan();
      default:
    }
    return null;
  };

  const hamburgerItems = [
    // {
    //   id: 'export_csv',
    //   value: 'Export as .csv'
    // },
    // {
    //   id: 'clear_plan',
    //   value: 'Clear plan'
    // }
  ];

  // const viewTypeItems = [
  //   {
  //     id: 'self',
  //     value: selfName
  //   },
  //   {
  //     id: 'partner',
  //     value: partnerName || 'Partner'
  //   },
  //   {
  //     id: 'joint',
  //     value: 'Joint'
  //   }
  // ];

  if (plans.length > 1) {
    hamburgerItems.push({
      id: 'delete_plan',
      value: 'Delete plan'
    });
  }

  const years = [...Array(21).keys()].map((n) => new Date().getFullYear() + n);
  const childbirthYearItems = years.map((year) => ({
    id: year,
    value: String(year)
  }));

  return (
    <StyledControls>
      <div id={`controls-${planId}`} className="panel">
        {allowChoosingDefaultPlan ? (
          <Dropdown
            onChange={(selectedId) => onSetDefaultPlan(selectedId)}
            items={plans.map((p) => ({ id: p.id, value: p.title }))}
            selectedId={planId}
            labelStyles={[choosePlanStyles]}
          />
        ) : (
          <h2 style={{ width: 'max-content' }}>{title}</h2>
        )}
        <div tw="flex flex-col space-x-1 md:flex-row">
          <span tw="text-gray-500">Childbirth: </span>
          <Dropdown
            onChange={(selectedYear) => onSetChildbirthYear(selectedYear)}
            items={childbirthYearItems}
            selectedId={childbirthYear}
            label={childbirthYear}
          />
        </div>
        {/* <Dropdown
          onChange={(selectedId) => onSetViewType(selectedId)}
          items={viewTypeItems}
          selectedId={viewType}
          label={viewType}
        /> */}
        <Dropdown
          onChange={(selectedId) => onSetViewYears(selectedId)}
          items={yearsItems}
          selectedId={viewYears}
          label={viewYears}
        />
        <Dropdown
          onChange={(selectedId) => hamburgerOnChange(selectedId)}
          items={hamburgerItems}
          selectedId={null}
          label="Hamburger"
        />
      </div>
    </StyledControls>
  );
};

Controls.propTypes = {
  title: PropTypes.string.isRequired,
  allowChoosingDefaultPlan: PropTypes.bool,
  plans: PropTypes.instanceOf(Array),
  planId: PropTypes.number.isRequired,
  // viewType: PropTypes.string.isRequired,
  viewYears: PropTypes.string.isRequired,
  // selfName: PropTypes.string.isRequired,
  // partnerName: PropTypes.string,
  childbirthYear: PropTypes.number.isRequired,
  onSetChildbirthYear: PropTypes.func.isRequired,
  // onSetViewType: PropTypes.func.isRequired,
  onSetViewYears: PropTypes.func.isRequired,
  onExportAsCSV: PropTypes.func.isRequired,
  onClearPlan: PropTypes.func.isRequired,
  onDeletePlan: PropTypes.func.isRequired,
  onSetDefaultPlan: PropTypes.func.isRequired
};
Controls.defaultProps = {
  allowChoosingDefaultPlan: true,
  plans: []
  // partnerName: null
};

const StyledControls = styled.div`
  & .panel {
    display: grid;
    grid-template-columns:
      auto minmax(65px, max-content) minmax(71px, max-content)
      max-content;
    height: max-content;
    min-width: max-content;
    align-items: center;
    gap: 0 15px;

    ${up('sm')} {
      gap: 0 15px;
    }
  }

  & .ddwarrow {
    display: flex;
    flex-direction: row;
    justify-content: flex-end;
    align-items: center;
    position: relative;
    cursor: pointer;

    & span {
      cursor: 'pointer';
      margin-left: 5px;
    }

    &.plan {
      display: flex;
      justify-content: flex-start;
      column-gap: 8px;
    }
  }
`;

export default Controls;
