import React, { useContext } from 'react';
import { SlidesContext } from './SlidesContext';
import IconBlock from './swiper-slide/IconBlock';
import 'twin.macro';

function DesktopIconsContainer() {
  const { slidesValues, ourActiveIndex } = useContext(SlidesContext);
  const getStyles = (slideIndex) => {
    if (ourActiveIndex === slideIndex) return 'activeImage';
    if (slideIndex < ourActiveIndex) return 'completeImage';
    return 'incompleteImage';
  };

  return (
    <div>
      <div tw="hidden sm:flex pb-3.5 justify-end space-x-2">
        {slidesValues.map((slide, i) => {
          let image = getStyles(i);
          const isActiveSection = ourActiveIndex === i;
          image = slide[image];
          const slideName = slide.slide;
          return (
            <IconBlock
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
    </div>
  );
}

export default DesktopIconsContainer;
