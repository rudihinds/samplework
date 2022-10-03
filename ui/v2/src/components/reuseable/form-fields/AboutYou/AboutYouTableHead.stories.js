import React from 'react';
import AboutYouTableHead from './AboutYouTableHead';

export default {
  title: 'form-fields/AboutYouTableHead',
  component: AboutYouTableHead
};

const Template = (args) => <AboutYouTableHead {...args} />;

// const [primaryUserActive, setPrimaryUserActive] = useState(true);

export const th = Template.bind({});
th.args = {
  user: {
    name: 'Joanna Dope',
    hasPartner: true,
    partnerName: 'Michael',
    gender: 'female',
    careerStart: '01/01/2010',
    familyStage: 'expecting',
    dueDate: '08/01/2021',
    childbearingParent: 'Joanna',
    basedIn: 'NY'
  },
  partner: {
    name: 'Michael',
    hasPartner: true,
    partnerName: 'Joanna',
    gender: 'female',
    careerStart: '01/01/2010',
    familyStage: 'expecting',
    dueDate: '08/01/2021',
    childbearingParent: 'Joanna',
    basedIn: 'NY'
  }
  // setPrimaryUserActive,
  // primaryUserActive,
};
th.storyName = 'Table Head';
