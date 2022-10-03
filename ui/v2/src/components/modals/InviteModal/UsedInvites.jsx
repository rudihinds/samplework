import React from 'react';
import { css } from 'twin.macro';
import PropTypes from 'prop-types';

function UsedInvites({ onClose }) {
  return (
    <div>
      <div
        tw="flex-row md:max-w-3xl"
        css={[
          css`
            max-width: 330px;
            margin: 0 auto;
          `
        ]}
      >
        <div
          tw="md:max-w-2xl"
          css={[
            css`
              max-width: 260px;
              margin: 0 auto;
            `
          ]}
        >
          <div
            tw="flex justify-center max-w-sm max-w-full"
            css={[
              css`
                margin: 0 auto;
              `
            ]}
          >
            <p
              tw="text-purple-2 text-2.6 md:text-2.1 text-center font-bold md:max-w-max"
              css={[
                css`
                  margin: 27px 0 20px 0;
                `
              ]}
            >
              You’re out of invites...for now!
            </p>
          </div>
          <p tw="text-center mb-3.9">
            We’re working hard to welcome all our new users, but there’s still a
            bit of a waiting list. We’ll make sure we notify you once we can
            offer more invites!
          </p>
        </div>
      </div>
      <div tw="text-center">
        <button
          type="button"
          tw="text-white border-none rounded-md bg-purple-2 w-full md:(w-22 h-3.7)"
          css={[
            css`
              flex: 1;
              height: 45px;
            `
          ]}
          onClick={onClose}
        >
          <p>Close</p>
        </button>
      </div>
    </div>
  );
}

export default UsedInvites;

UsedInvites.propTypes = {
  onClose: PropTypes.func.isRequired
};
