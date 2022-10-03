import React from 'react';
import AboutYou from './AboutYou';

export default {
  title: 'form-fields/AboutYou',
  component: AboutYou
};

const Template = (args) => <AboutYou {...args} />;

export const table = Template.bind({});
table.args = {};
table.storyName = 'About You Table';
