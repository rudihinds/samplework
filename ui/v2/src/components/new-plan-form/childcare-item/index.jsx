import React, { useEffect } from 'react';
import SelectField from '@reuseable/form-fields/SelectField';
import { SVG as MinusIcon } from '@assets/minus-icon.svg';

import { css } from 'twin.macro';
import PropTypes from 'prop-types';

import { useQuery } from '@apollo/client';
import { CHILDCARE_AVERAGE_COSTS } from '@graphql/queries/childcare';
import { useFormikContext } from 'formik';

import currency from 'currency.js';
import TextField from '@reuseable/form-fields/TextField';

const childcareOptions = [
  {
    id: 'daycare',
    name: 'Daycare'
  },
  {
    id: 'nanny',
    name: 'Nanny'
  },
  {
    id: 'family_or_friend',
    name: 'Family or friend'
  },
  {
    id: 'newborn_care_specialist',
    name: 'Newborn Care Specialist'
  },
  {
    id: 'nanny_share',
    name: 'Nanny share'
  },
  {
    id: 'childcare_pool',
    name: 'Childcare pool'
  }
];

const ChildcareItem = ({ index, onDelete, allowDelete = true }) => {
  const { values, setFieldValue } = useFormikContext();
  const { data = {} } = useQuery(CHILDCARE_AVERAGE_COSTS, {
    variables: {
      zip_code: parseInt(values.zip_code, 10),
      num_infants: 1
    }
  });

  const childcareType = values.childcare_items[index].childcare_type;
  const daysPerWeek = values.childcare_items[index].days_per_week;

  useEffect(() => {
    switch (childcareType) {
      case 'nanny':
        if (data.childcareAverageCosts?.weekly_nanny_rate) {
          setFieldValue(
            `childcare_items.${index}.cost_per_month`,
            currency(
              data.childcareAverageCosts.weekly_nanny_rate *
                (daysPerWeek / 5) *
                4.34524,
              { precision: 0 }
            )
          );
        }
        break;
      case 'nanny_share':
        if (data.childcareAverageCosts?.weekly_nanny_share_rate) {
          setFieldValue(
            `childcare_items.${index}.cost_per_month`,
            currency(
              data.childcareAverageCosts.weekly_nanny_share_rate *
                (daysPerWeek / 5) *
                4.34524,
              { precision: 0 }
            )
          );
        }
        break;
      case 'daycare':
        if (data.childcareAverageCosts?.weekly_daycare_rate) {
          setFieldValue(
            `childcare_items.${index}.cost_per_month`,
            currency(
              data.childcareAverageCosts.weekly_daycare_rate *
                (daysPerWeek / 5) *
                4.34524,
              { precision: 0 }
            )
          );
        }
        break;
      default:
        break;
    }
  }, [
    childcareType,
    daysPerWeek,
    data.childcareAverageCosts,
    index,
    setFieldValue
  ]);

  return (
    <div tw="space-y-1 md:(flex items-end space-y-0 space-x-1.5)">
      <div tw="relative md:flex-1">
        {allowDelete && (
          <button
            onClick={() => onDelete(index)}
            type="button"
            tw="text-mirza-purple absolute top-0 right-0 md:hidden"
          >
            Remove
          </button>
        )}
        <SelectField
          label="Childcare type"
          name={`childcare_items.${index}.childcare_type`}
          options={childcareOptions}
          stringId
        />
      </div>
      <div tw="flex space-x-1.5 md:(flex-1 items-end)">
        <div tw="flex-1">
          <TextField
            label="Days p/w"
            name={`childcare_items.${index}.days_per_week`}
          />
        </div>
        <div tw="flex-1">
          <TextField
            label="Monthly cost"
            name={`childcare_items.${index}.cost_per_month`}
          />
        </div>
      </div>
      <div
        tw="w-3 hidden md:block"
        css={[
          css`
            padding-bottom: 2px;
          `
        ]}
      >
        {allowDelete && (
          <button type="button" onClick={() => onDelete(index)}>
            <MinusIcon />
          </button>
        )}
      </div>
    </div>
  );
};

ChildcareItem.propTypes = {
  index: PropTypes.number.isRequired,
  onDelete: PropTypes.func.isRequired,
  allowDelete: PropTypes.bool
};
ChildcareItem.defaultProps = {
  allowDelete: true
};

export default ChildcareItem;
