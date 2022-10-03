import React, { useState } from 'react';
import PropTypes from 'prop-types'
import InviteModal from './InviteModal';

function InviteModalContainer({onClose}) {
  const [showAllInvitesUsed, setShowAllInvitesUsed] = useState(false);
  const [emailValue, setEmailValue] = useState({ emailOne: '', emailTwo: '' });
  const [invitesUsed, setInvitesUsed] = useState([false, false]);

  return (
    <InviteModal
      showAllInvitesUsed={showAllInvitesUsed}
      setShowAllInvitesUsed={setShowAllInvitesUsed}
      emailValue={emailValue}
      setEmailValue={setEmailValue}
      invitesUsed={invitesUsed}
      setInvitesUsed={setInvitesUsed}
      onClose={onClose}
    />
  );
}

InviteModalContainer.propTypes = {
  onClose: PropTypes.func
}

InviteModalContainer.defaultProps = {
  onClose: () => {}
}

export default InviteModalContainer;
