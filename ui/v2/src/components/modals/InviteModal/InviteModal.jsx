import React from 'react';
import { css } from 'twin.macro';
import inviteMain from '@assets/invite-main.svg';
import cross from '@assets/cross-close-modal.svg';
import PropTypes from 'prop-types';
import NotUsedInvites from './NotUsedInvites';
import UsedInvites from './UsedInvites';

function InviteModal({
  showAllInvitesUsed,
  setShowAllInvitesUsed,
  emailValue,
  setEmailValue,
  invitesUsed,
  setInvitesUsed,
  onClose
}) {
  return (
    <div>
      <div
        tw="flex flex-col md:(px-4 pt-3 max-w-6xl) border-2 border-solid border-black rounded-2xl justify-items-center "
        css={[
          css`
            margin: 0 auto;
            padding: 20px 20px 38px 20px;
          `
        ]}
      >
        <div
          tw="flex justify-end"
          onClick={onClose}
          onKeyDown={onClose}
          role="button"
          tabIndex={0}
        >
          <img src={cross} alt="close modal button" />
        </div>
        <div tw="flex justify-center md:mt-2">
          <img src={inviteMain} alt="" />
        </div>
        {!showAllInvitesUsed ? (
          <NotUsedInvites
            setShowAllInvitesUsed={setShowAllInvitesUsed}
            emailValue={emailValue}
            setEmailValue={setEmailValue}
            invitesUsed={invitesUsed}
            setInvitesUsed={setInvitesUsed}
          />
        ) : (
          <UsedInvites onClose={onClose}/>
        )}
      </div>
    </div>
  );
}

export default InviteModal;

InviteModal.propTypes = {
  showAllInvitesUsed: PropTypes.bool,
  setShowAllInvitesUsed: PropTypes.func,
  emailValue: PropTypes.shape({}),
  setEmailValue: PropTypes.func,
  invitesUsed: PropTypes.arrayOf(PropTypes.bool),
  setInvitesUsed: PropTypes.func,
  onClose: PropTypes.func
};

InviteModal.defaultProps = {
  showAllInvitesUsed: false,
  emailValue: { emailOne: '', emailTwo: '' },
  invitesUsed: [false, false],
  setShowAllInvitesUsed: () => {},
  setEmailValue: () => {},
  setInvitesUsed: () => {},



  onClose: () => console.log('Closing modal...')
};
