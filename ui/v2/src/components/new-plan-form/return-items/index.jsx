import React from 'react';
import tw from 'twin.macro';
import PropTypes from 'prop-types';

import FieldGroupCollection from '@components/new-plan-form/FieldGroupCollection';
import ReturnItem from './ReturnItem';

const ReturnItems = ({ name, isPartner = false }) => (
  <>
    <div tw="flex mb-1">
      <p tw="text-mirza-green font-bold">{name}&apos;s&nbsp;</p>
      <p tw="font-bold">return</p>
    </div>
    <FieldGroupCollection
      name={isPartner ? 'partner_return_items' : 'self_return_items'}
      addText="Add a new return step"
      itemComponent={ReturnItem}
      requiredField="num_hours"
      itemCss={tw`space-y-1`}
    />
  </>
);

ReturnItems.propTypes = {
  name: PropTypes.string.isRequired,
  isPartner: PropTypes.bool
};

ReturnItems.defaultProps = {
  isPartner: false
};

export default ReturnItems;
