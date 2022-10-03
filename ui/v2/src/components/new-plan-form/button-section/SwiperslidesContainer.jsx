import React, { useContext } from 'react';
import { SlidesContext } from '@components/new-plan-form/button-section/SlidesContext';
import SwiperSlide from '@components/new-plan-form/button-section/swiper-slide/SwiperSlide';
import 'twin.macro';

function SwiperslidesContainer() {
  const { slidesValues, ourActiveIndex } = useContext(SlidesContext);

  const getStyles = (slideIndex) => {
    if (ourActiveIndex === slideIndex) return 'activeImage';
    if (slideIndex < ourActiveIndex) return 'completeImage';
    return 'incompleteImage';
  };

  return (
    <>
      <div className="swiper-wrapper">
        {slidesValues.map((slide, i) => {
          let image = getStyles(i);
          const isActiveSection = ourActiveIndex === i;
          image = slide[image];
          const slideName = slide.slide;
          return (
            <SwiperSlide
              slideName={slideName}
              key={slideName}
              slideIndex={i}
              ourActiveIndex={ourActiveIndex}
              image={image}
              isActiveSection={isActiveSection}
            />
          );
        })}
      </div>
      {/* <div tw='hidden sm:block'>
        hello
      </div> */}
    </>
  );
}

export default SwiperslidesContainer;
