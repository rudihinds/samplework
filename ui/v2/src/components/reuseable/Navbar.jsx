import React, { useState } from 'react';
import tw, { styled, css } from 'twin.macro';
import { NavLink } from 'react-router-dom';
import { up } from 'styled-breakpoints';

import cx from 'classnames';
import { SVG as Logo } from '@assets/logo.svg';

import { useQuery } from '@apollo/client';
import { ME } from '@graphql/queries/user';
import MobileMenu from './MobileMenu';
import NavDropdown from './NavDropdown';

const links = {
  Dashboard: { url: '/dashboard' },
  'Plan Creator': { url: '/plan-creator' },
  Articles: { external: true, url: 'https://www.heymirza.com/articles' },
  'Mirza Connect': {
    external: true,
    url: 'https://links.geneva.com/invite/ef06ce83-77a0-462a-8ac9-c378de7a298f'
  }
};

function Navbar() {
  const handleClick = () => {
    // console.log(e);
  };

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const { loading, error, data: { me } = { me: {} } } = useQuery(ME);

  return (
    <NavWrapper>
      <NavContainer mobileMenuOpen={mobileMenuOpen}>
        <button
          tw="flex items-center h-full focus:outline-none z-20"
          id="hamburger"
          className={cx('hamburger hamburger--squeeze', {
            'is-active': mobileMenuOpen
          })}
          type="button"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          <span className="hamburger-box">
            <span className="hamburger-inner" />
          </span>
        </button>
        <div
          tw="w-8 h-full flex items-center"
          css={[
            css`
              grid-column: 1/2;
              grid-row: 2/3;
            `
          ]}
        >
          <NavLink
            tw="flex-1"
            css={[
              css`
                margin-top: -5px;
              `
            ]}
            exact
            to="/dashboard"
          >
            <Logo />
          </NavLink>
        </div>
        <div className="nav-links-container">
          <div className="nav-links">
            {Object.entries(links).map(([key, value]) => (
              <li key={key}>
                {!value.external ? (
                  <NavLink
                    exact
                    to={value.url}
                    onClick={handleClick}
                    activeClassName="active-bar"
                  >
                    {key}
                  </NavLink>
                ) : (
                  <a
                    key={key}
                    onClick={handleClick}
                    href={value.url}
                    target="_blank"
                    rel="noreferrer"
                  >
                    {key}
                  </a>
                )}
              </li>
            ))}
          </div>
        </div>
        <div className="profile-button-container" tw="relative">
          {!loading && !error && me && (
            <NavDropdown
              parentButtonComponent={() => (
                <div tw="flex space-x-1 items-center">
                  <div className="username-in-nav">{me.name}</div>
                  <div>
                    <span className="profile-button">
                      {me.name
                        .match(/(\b\S)?/g)
                        .join('')
                        .match(/(^\S|\S$)?/g)
                        .join('')
                        .toUpperCase()}
                    </span>
                  </div>
                </div>
              )}
            />
          )}
        </div>
      </NavContainer>
      <MobileMenu
        links={links}
        open={mobileMenuOpen}
        setMobileMenuOpen={setMobileMenuOpen}
      />
    </NavWrapper>
  );
}

export default Navbar;

const NavWrapper = styled.div`
  max-width: 100vw;
  background-color: #fff;
  border-bottom: 0.5px solid #e2e5e6;
  display: grid;
  height: 71px;

  ${up('smLp')} {
    display: block;
  }
`;

const NavContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0;
  position: relative;

  .nav-links-container,
  .username-in-nav {
    display: none;
  }

  .profile-button-container {
    padding: 0 30px 0 20.22px;
  }

  .profile-button {
    display: flex;
    align-items: center;
    justify-content: center;
    font-weight: bold;
    font-size: 1.2rem;
    width: 42px;
    height: 42px;
    ${tw`bg-mirza-purple font-sans`}
    border-radius: 50%;
    color: white;
  }

  ${up('smLp')} {
    .hamburger {
      display: none;
    }

    display: grid;
    max-width: 1415px;
    margin: 0 auto;
    padding: 0 35px;
    grid-template-columns: auto minmax(max-content, 600px) 1fr auto auto;
    grid-template-rows: 10px 50px 10px;
    font-family: 'Averta', serif;
    font-weight: 400;
    font-size: 16px;
    align-items: center;
    z-index: 1;

    & .nav-links-container {
      display: block;
      grid-column: 2/3;
      grid-row: 2/3;
      padding-left: 45px;
    }

    & .nav-links {
      display: flex;
      // justify-content: space-around;
      list-style-type: none;

      li {
        margin-right: 24px;

        a {
          text-decoration: none;
          color: inherit;
        }
      }
    }

    & .active-bar {
      border-bottom: 1.4px solid #333;
      font-weight: bold;
    }

    & .username-in-nav {
      // grid-column: 4/5;
      // grid-row: 2/3;
      justify-self: end;
      display: unset;
    }

    & .profile-button-container {
      grid-column: 4/6;
      grid-row: 2/3;
      justify-self: end;
      padding: 0 0 0 15px;
    }

    & .profile-button {
      font-size: 1.2rem;
      width: 42px;
      height: 42px;
      border-radius: 50%;
      padding: 1.2rem;
      color: white;
    }
  }
`;
