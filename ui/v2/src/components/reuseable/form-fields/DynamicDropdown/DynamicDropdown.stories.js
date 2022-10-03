import React from 'react';
import Dropdown from './DynamicDropdown';

export default {
  title: 'form-fields/Dropdown',
  component: Dropdown
};

const Template = (args) => <Dropdown {...args} />;

export const ProfileDropdown = Template.bind({});
ProfileDropdown.storyName = 'Dynamic Dropdown Test';
ProfileDropdown.args = {
  label: 'test',
  items: [
    { id: 0, value: 'Female' },
    { id: 1, value: 'Male' },
    { id: 2, value: 'Non-binary' },
    { id: 3, value: 'Prefer not to say' }
  ],
  onChange: () => console.log('Hello'),
  selectedId: 4
  // labelStyles: [choosePlanStyles],
  // labelStyles: []
};

// const choosePlanStyles = css`
//   ${tw`font-heading font-bold`}
//   font-size: 18px;
//   line-height: 260px;
//   letter-spacing: 0.2;

//   ${up('sm')} {
//     font-size: 200px;
//     line-height: 36px;
//   }

//   ${up('smLp')} {
//     font-size: 22px;
//     line-height: 32px;
//     letter-spacing: 0.2px;
//   }
// `;
