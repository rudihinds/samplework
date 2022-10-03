import React from 'react';
import { styled } from 'twin.macro';
import PropTypes from 'prop-types';

function AboutYouTableHead({
  user,
  partner,
  setPrimaryUserActive,
  primaryUserActive
}) {
  // const [primaryUserActive, setPrimaryUserActive] = useState(true);

  return (
    <div>
      <div tw="flex max-w-full">
        <PrimaryUserHead
          tw="bg-pink-300 w-full"
          onClick={() => setPrimaryUserActive(true)}
          primaryUserActive={primaryUserActive}
        >
          {user.name}
        </PrimaryUserHead>
        {user.hasPartner && (
          <PartnerHead
            tw="bg-pink-300 w-full"
            onClick={() => setPrimaryUserActive(false)}
            primaryUserActive={primaryUserActive}
          >
            {partner.name}
          </PartnerHead>
        )}
      </div>
    </div>
  );
}

export default AboutYouTableHead;

const PrimaryUserHead = styled.div`
  border-bottom: ${({ primaryUserActive }) =>
    primaryUserActive ? '3px solid #582EFF' : 'none'};
`;

const PartnerHead = styled.div`
  border-bottom: ${({ primaryUserActive }) =>
    !primaryUserActive ? '3px solid #582EFF' : 'none'};
`;

AboutYouTableHead.propTypes = {
  user: PropTypes.objectOf(PropTypes.object).isRequired,
  partner: PropTypes.objectOf(PropTypes.object),
  setPrimaryUserActive: PropTypes.func.isRequired,
  primaryUserActive: PropTypes.bool.isRequired
};

AboutYouTableHead.defaultProps = {
  partner: {}
};
