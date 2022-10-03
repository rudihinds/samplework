import React from 'react';

import FieldGroupCollection from '@components/new-plan-form/FieldGroupCollection';
import PropTypes from 'prop-types';

import tw from 'twin.macro';
import LeaveItem from './LeaveItem';

const LeaveItems = ({ name, isPartner = false }) => (
  <>
    <div tw="flex mb-1">
      <p tw="text-mirza-green font-bold">{name}&apos;s&nbsp;</p>
      <p tw="font-bold">leave</p>
    </div>
    <FieldGroupCollection
      name={isPartner ? 'partner_leave_items' : 'self_leave_items'}
      addText="Add a new leave salary"
      itemComponent={LeaveItem}
      requiredField="num_weeks"
      itemCss={tw`space-y-1`}
    />
  </>
);

LeaveItems.propTypes = {
  name: PropTypes.string.isRequired,
  isPartner: PropTypes.bool
};

LeaveItems.defaultProps = {
  isPartner: false
};

export default LeaveItems;
