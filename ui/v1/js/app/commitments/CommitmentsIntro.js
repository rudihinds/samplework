import React from 'react';
import { useRouteMatch, Link } from 'react-router-dom';
import { SquareButton, Icon, SectionTitle, ContentPanel, StylizedText, CommitmentsWrap } from '../../elements';
import CommitmentsDisclaimer from './CommitmentsDisclaimer';

const CommitmentsIntro = () => {
  const { path } = useRouteMatch();

  return (
    <CommitmentsWrap>
      <SectionTitle variant="sansserif-small">Commitments</SectionTitle>
      <CommitmentsDisclaimer />
      <ContentPanel mt={2}>
        <div className="ctr">
          <Icon icon="comm-empty-state" width={324} fill={false}></Icon>
          <StylizedText theme="empty-state">You don&apos;t have any commitments yet</StylizedText>
          <SquareButton
            data-sel="new-commitment-button"
            icon="plussign"
            size="bigpadding"
            component={Link}
            to={`${path}/add`}
          >
            Add new commitment
          </SquareButton>
        </div>
      </ContentPanel>
    </CommitmentsWrap>
  );
};
export default CommitmentsIntro;
