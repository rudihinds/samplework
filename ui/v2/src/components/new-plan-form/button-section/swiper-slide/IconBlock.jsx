import React from 'react';
import PropTypes from 'prop-types';
import { styled, css, theme } from 'twin.macro';

function IconBlock({ image, slideName, isActiveSection }) {
  const slide = slideName.charAt(0).toUpperCase() + slideName.slice(1);
  return (
    <div
      css={[
        css`
          min-width: calc(14.285% - 2rem);
        `
      ]}
    >
      <div tw="mb-1">
        <img src={image} alt="" tw="block mx-auto" />
      </div>
      <IconText isActiveSection={isActiveSection}>
        <span
          css={[
            css`
              margin-left: -100%;
              margin-right: -100%;
              text-align: center;
            `
          ]}
        >
          {slide}
        </span>
      </IconText>
    </div>
  );
}

const IconText = styled.p`
  color: ${(props) =>
    props.isActiveSection ? theme`colors.mirza-green` : theme`colors.grey-2`};
  text-align: center;
  font-size: 1.2rem;
  font-weight: 700;
`;

IconBlock.propTypes = {
  image: PropTypes.string.isRequired,
  slideName: PropTypes.string.isRequired,
  isActiveSection: PropTypes.bool.isRequired
};

export default IconBlock;
