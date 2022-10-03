import React from 'react';
import ProfileRow from './ProfileRow';

export default {
  title: 'form-fields/ProfileRow',
  component: ProfileRow
};

const Template = (args) => <ProfileRow {...args} />;

export const Row = Template.bind({});
Row.args = { type: 'input', field: 'Name', value: 'Joanna Doe' };
Row.storyName = 'Profile Row';
