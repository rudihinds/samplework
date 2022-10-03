import React, { Fragment } from 'react';
import { Menu, Transition } from '@headlessui/react';
import tw from 'twin.macro';
import axios from 'axios';
import PropTypes from 'prop-types';

const NavDropdown = ({ parentButtonComponent }) => {
  const ParentButtonComponent = parentButtonComponent;
  const onClickLogout = async () => {
    const result = await axios
      .post('/api/logout')
      .then((response) => ({ ok: true, response }))
      .catch((error) => ({
        ok: false,
        response: error.response,
        request: error.request
      }));
    if (result.ok) {
      window.location.href = 'https://www.heymirza.com';
    } else {
      console.error('Error logging out', result.response, result.request);
    }
  };

  return (
    <Menu as="div">
      {({ open }) => (
        <>
          <div>
            <Menu.Button tw="focus:outline-none outline-none">
              <ParentButtonComponent />
            </Menu.Button>
          </div>

          <Transition
            show={open}
            as={Fragment}
            enter="transition ease-out duration-100"
            enterFrom="transform opacity-0 scale-95"
            enterTo="transform opacity-100 scale-100"
            leave="transition ease-in duration-75"
            leaveFrom="transform opacity-100 scale-100"
            leaveTo="transform opacity-0 scale-95"
          >
            <Menu.Items
              static
              tw="origin-top-right text-right absolute right-0 mt-2 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 focus:outline-none"
            >
              <div tw="py-1">
                {/* <Menu.Item>
                  {({ active }) => (
                    <a
                      href="#"
                      css={[
                        active
                          ? tw`bg-gray-100 text-gray-900`
                          : tw`text-gray-700`,
                        tw`block px-2 py-1`
                      ]}
                    >
                      Account&nbsp;settings
                    </a>
                  )}
                </Menu.Item> */}
                <Menu.Item>
                  {({ active }) => (
                    <button
                      type="button"
                      onClick={() => onClickLogout()}
                      css={[
                        active
                          ? tw`bg-gray-100 text-gray-900`
                          : tw`text-gray-700`,
                        tw`block text-right w-full px-2 py-1`
                      ]}
                    >
                      Sign out
                    </button>
                  )}
                </Menu.Item>
              </div>
            </Menu.Items>
          </Transition>
        </>
      )}
    </Menu>
  );
};

NavDropdown.propTypes = {
  parentButtonComponent: PropTypes.node.isRequired
};

export default NavDropdown;
