import React from 'react';
import PropTypes from 'prop-types';
import tw, { styled, theme } from 'twin.macro';
import SwiperCore, { Pagination } from 'swiper';
import { Swiper, SwiperSlide } from 'swiper/react';

SwiperCore.use([Pagination]);

const gridColsMap = {
  2: tw`grid-cols-2`,
  3: tw`grid-cols-3`
};

const GridSwiper = ({ children, gridCols = 3 }) => {
  const mobileMQ = window.matchMedia('(max-width: 600px)');
  return mobileMQ.matches ? (
    <SwiperStyles>
      <Swiper
        spaceBetween={20}
        slidesPerView={1.4}
        centeredSlides={false}
        slidesOffsetBefore={30}
        slidesOffsetAfter={30}
        pagination={{
          clickable: true,
          slidesPerView: 2
        }}
      >
        {children.map((child) => (
          <SwiperSlide>{child}</SwiperSlide>
        ))}
      </Swiper>
    </SwiperStyles>
  ) : (
    <div css={[gridColsMap[gridCols]]} tw="grid col-gap-2 row-gap-3">
      {children}
    </div>
  );
};

GridSwiper.propTypes = {
  children: PropTypes.arrayOf(PropTypes.node).isRequired,
  gridCols: PropTypes.number
};
GridSwiper.defaultProps = {
  gridCols: 3
};

const SwiperStyles = styled.div`
  --swiper-theme-color: ${theme`colors.mirza-green`};

  .swiper-container {
    ${tw`pb-5`}
  }

  .swiper-slide {
    height: unset;

    > div {
      height: 100%;
    }
  }

  .swiper-pagination {
    bottom: 0 !important;
  }

  .swiper-pagination-bullet {
    width: 12px;
    height: 12px;
  }
`;

export default GridSwiper;
