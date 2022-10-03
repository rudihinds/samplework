import React from 'react';

import DynamicInputField from './DynamicInputField';

export default {
  title: 'form-fields/DynamicInputField',
  component: DynamicInputField
};

const Template = (args) => <DynamicInputField {...args} />;

export const ClickedInput = Template.bind({});
ClickedInput.args = { initialValue: 'Joanna Doe' };
ClickedInput.storyName = 'Text Input';
