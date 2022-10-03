import React, { useContext, useEffect, useRef } from 'react';
import { Swiper } from 'swiper/react';
import SwiperCore, { Navigation, Pagination, Scrollbar, A11y } from 'swiper';
import SwiperslidesContainer from '@components/new-plan-form/button-section/SwiperslidesContainer';
import { SlidesContext } from '@components/new-plan-form/button-section/SlidesContext';
import 'twin.macro';
import DesktopIconsContainer from '../button-section/DesktopIconsContainer';

SwiperCore.use([Navigation, Pagination, Scrollbar, A11y]);

function FormSteps() {
  const swiper = useRef(null);
  const { setSwiper } = useContext(SlidesContext);
  useEffect(() => {
    setSwiper(swiper);
  }, [swiper, setSwiper]);

  return (
    <>
      <div tw="hidden md:flex">
        <DesktopIconsContainer />
      </div>
      <Swiper
        // spaceBetween={5}
        slidesPerView={4}
        navigation
        // pagination={{ clickable: false }}
        scrollbar={{ draggable: false }}
        onSwiper={(swiperInstance) => {
          swiper.current = swiperInstance;
        }}
        className="swiper-container"
        watchSlidesProgress
        watchSlidesVisibility
        tw="md:hidden"
      >
        <SwiperslidesContainer swiper={swiper} />
      </Swiper>
    </>
  );
}

export default FormSteps;
