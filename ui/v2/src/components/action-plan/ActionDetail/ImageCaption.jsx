import React from 'react';
import PropTypes from 'prop-types';
import { Basic as ButtonBasic } from '@reuseable/buttons/Button';
import tw from 'twin.macro';

const captionFirstMap = {
  true: tw`flex-col-reverse`,
  false: tw`flex-col`
};

const ImageCaption = ({
  imageSrc,
  altText,
  description,
  buttonText,
  actionHref,
  captionFirst = false
}) => (
  <div>
    <div tw="flex" css={[captionFirstMap[captionFirst]]}>
      <div tw="mb-2 px-2">
        <img alt={altText} src={imageSrc} tw="w-full" />
      </div>
      <p tw="mb-2 text-center">{description}</p>
    </div>
    <ButtonBasic
      as="a"
      tw="block text-center"
      href={actionHref}
      target="_blank"
    >
      {buttonText}
    </ButtonBasic>
  </div>
);

ImageCaption.propTypes = {
  imageSrc: PropTypes.string.isRequired,
  altText: PropTypes.string.isRequired,
  description: PropTypes.string.isRequired,
  buttonText: PropTypes.string.isRequired,
  actionHref: PropTypes.string.isRequired,
  captionFirst: PropTypes.bool
};

ImageCaption.defaultProps = {
  captionFirst: false
};

export default ImageCaption;
