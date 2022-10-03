import React from 'react';
import { css } from 'twin.macro';
import PropTypes from 'prop-types';
import { Basic as ButtonBasic } from '@reuseable/buttons/Button';

const ActionCard = ({ icon, title, description, action }) => {
  const Icon = icon;
  return (
    <div
      css={[
        css`
          background-color: #f1f1f1;
        `
      ]}
      tw="rounded-14 px-2 py-3 text-center leading-normal flex flex-col"
    >
      <div tw="w-7 mx-auto mb-2">
        <Icon />
      </div>
      <h3 tw="mb-1.5 font-bold">{title}</h3>
      <p tw="mb-2.5">{description}</p>
      <ButtonBasic tw="mt-auto md:self-center" type="button" onClick={action}>
        Learn more
      </ButtonBasic>
    </div>
  );
};

ActionCard.propTypes = {
  icon: PropTypes.node.isRequired,
  title: PropTypes.string.isRequired,
  description: PropTypes.string.isRequired,
  action: PropTypes.func.isRequired
};

export default ActionCard;
