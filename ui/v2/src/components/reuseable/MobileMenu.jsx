import React from 'react';
import { NavLink } from 'react-router-dom';
import tw, { css, styled } from 'twin.macro';
import PropTypes from 'prop-types';

import { SVG as LogoLight } from '../../assets/mirza-logo-light.svg';

const MobileMenu = ({ links, open, setMobileMenuOpen }) => (
  <Container open={open}>
    <OverlayHeader>
      <LogoLight
        css={[
          css`
            margin-top: -5px;
          `
        ]}
      />
    </OverlayHeader>
    <ul tw="flex flex-col items-center mt-6">
      {Object.entries(links).map(([key, value]) => (
        <LI tw="mb-4">
          {!value.external ? (
            <NavLink
              exact
              to={value.url}
              onClick={() => setMobileMenuOpen(false)}
              activeClassName="active-bar"
            >
              {key}
            </NavLink>
          ) : (
            <a key={key} href={value.url} target="_blank" rel="noreferrer">
              {key}
            </a>
          )}
        </LI>
      ))}
    </ul>
  </Container>
);

MobileMenu.propTypes = {
  links: PropTypes.shape({}).isRequired,
  open: PropTypes.bool.isRequired,
  setMobileMenuOpen: PropTypes.func.isRequired
};

const OverlayHeader = styled.div`
  ${tw`flex items-center justify-center`}
  height: 71px;
`;

const Container = styled.div(({ open }) => [
  tw`bg-mirza-green opacity-0 invisible transition duration-200 fixed left-0 w-full z-10 top-0`,
  open && tw`opacity-100 visible`,
  css`
    height: ${window.innerHeight}px;
  `
]);

const LI = styled.li`
  a {
    font-size: 26px;
    ${tw`text-white font-heading font-bold`}
  }
`;

export default MobileMenu;
