import React from 'react';
import PropTypes from 'prop-types';
import { styled, theme } from 'twin.macro';

function SwiperSlide({ image, slideName, isActiveSection }) {
  const slide = slideName.charAt(0).toUpperCase() + slideName.slice(1);
  return (
    <div className="swiper-slide">
      <div tw="mb-1">
        <img src={image} alt="" tw="block m-auto" />
      </div>
      <IconText isActiveSection={isActiveSection}>
        <strong>{slide}</strong>
      </IconText>
    </div>
  );
}

const IconText = styled.p`
  color: ${(props) =>
    props.isActiveSection ? theme`colors.mirza-green` : theme`colors.grey-2`};
  text-align: center;
`;

SwiperSlide.propTypes = {
  image: PropTypes.string.isRequired,
  slideName: PropTypes.string.isRequired,
  isActiveSection: PropTypes.bool.isRequired
};

export default SwiperSlide;
