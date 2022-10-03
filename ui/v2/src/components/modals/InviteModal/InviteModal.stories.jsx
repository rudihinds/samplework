import React from 'react';
import InviteModal from './InviteModal';

export default {
  title: 'modals/InviteModal',
  component: InviteModal
};

const Template = (args) => <InviteModal {...args} />;

export const noInvitesUsed = Template.bind({});
noInvitesUsed.args = {
  showAllInvitesUsed: false,
  emailValue: { emailOne: '', emailTwo: '' },
  invitesUsed: [false, false]
};

export const firstInviteUsed = Template.bind({});
firstInviteUsed.args = {
  showAllInvitesUsed: false,
  emailValue: { emailOne: '', emailTwo: '' },
  invitesUsed: [true, false]
}

export const secondInviteUsed = Template.bind({});
secondInviteUsed.args = {
  showAllInvitesUsed: false,
  emailValue: { emailOne: '', emailTwo: '' },
  invitesUsed: [false, true]
}

export const bothUsed = Template.bind({});
bothUsed.args = {
  showAllInvitesUsed: true,
  emailValue: { emailOne: '', emailTwo: '' },
  invitesUsed: [true, true]
}


// const [showAllInvitesUsed, setShowAllInvitesUsed] = useState(false);
// const [emailValue, setEmailValue] = useState({ emailOne: '', emailTwo: '' });
// const [invitesUsed, setInvitesUsed] = useState([false, false]);

