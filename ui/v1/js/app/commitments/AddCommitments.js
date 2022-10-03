import React, { useState } from 'react';
import { ContentPanel, CommitmentsCard, CommitmentsWrap, SquareButton } from '../../elements';
import CommitmentsEmailModal from './CommitmentsEmailModal';

const AddCommitments = () => {
  const endToEndTasks = {
    1: 'Ownership of dry cleaning',
    2: 'Ownership of groceries & meals',
    3: 'Ownership of household maintenance',
    4: 'Ownership of the bathroom'
  };
  const softTasks = {
    1: 'Support my partner to have an active social life',
    2: 'Support my partner to be successful in their career',
    3: 'To take the time I need to feel good',
    4: 'Show my parents I value their input into my life'
  };

  const [isOpen, setIsOpen] = useState(false);
  const openDialog = () => {
    setIsOpen(true);
  };

  const closeDialog = (ev) => {
    ev.preventDefault();
    setIsOpen(false);
  };

  return (
    <CommitmentsWrap data-sel="add-commitments-wrapper" fullOnMobile>
      <CommitmentsEmailModal isOpen={isOpen} handleClose={closeDialog} />
      <ContentPanel
        theme="round-bottom"
        navAction={{ text: 'Add new commitment', to: '/commitments', icon: 'backarrow' }}
        bottomContent={
          <>
            <p>If none of the options fits your plan, create your own custom commitment</p>
            <SquareButton data-sel="custom-commitment-button" onClick={openDialog} theme="secondary" ghost>
              Create custom commitment
            </SquareButton>
          </>
        }
      >
        <CommitmentsCard icon="end-to-end" title="End-to-end commitments" tasks={endToEndTasks}>
          Research has shown that commiting to end-to-end ownership of household tasks improves relationship
          communication, helps distribute unpaid work between both partners.
        </CommitmentsCard>
        <CommitmentsCard icon="softer-commit" title="Softer commitments" tasks={softTasks}>
          It’s important to own commitments beyond the home. You don’t tick off these commitments each month. They
          aren’t something you complete. They’re an ongoing driver. Each commitment is a big statement, an aspiration,
          and a promise.
        </CommitmentsCard>
      </ContentPanel>
    </CommitmentsWrap>
  );
};

export default AddCommitments;
