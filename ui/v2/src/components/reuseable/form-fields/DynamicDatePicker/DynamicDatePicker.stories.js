import React from 'react';
import DynamicDatePicker from './DynamicDatePicker';

export default {
  title: 'form-fields/DynamicDatePicker',
  component: DynamicDatePicker
};

const Template = (args) => <DynamicDatePicker {...args} />;

export const OpenDatePicker = Template.bind({});
OpenDatePicker.args = {};
OpenDatePicker.storyName = 'Text Input';
