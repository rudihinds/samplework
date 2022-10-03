import React, {
  createContext,
  useMemo,
  useState,
  useCallback,
  useEffect
} from 'react';
import PropTypes from 'prop-types';
import slidesValues from './swiper-slide/slidesValues';

export const SlidesContext = createContext(null);

export function SlidesContextProvider({ children }) {
  const [ourActiveIndex, setOurActiveIndex] = useState(0);
  const resetOurActiveIndex = () => setOurActiveIndex(0);
  const [swiper, setSwiper] = useState({});
  const alignSwiperInView = useCallback(() => {
    // increment ourActiveindex which will change swiper icon statuses
    // if the current form section slider is out of view, it will slide in
    // if the current form section is in view, it will only slide next on the 3rd slide
    if (swiper.current === undefined || !swiper.current.visibleSlidesIndexes) {
      return;
    }
    const visibleIndexes = swiper.current.visibleSlidesIndexes;
    if (!visibleIndexes.includes(ourActiveIndex)) {
      swiper.current.slideTo(ourActiveIndex);
    } else if (visibleIndexes[3] === ourActiveIndex) {
      swiper.current.slideNext();
    }
  }, [ourActiveIndex, swiper]);

  useEffect(() => {
    console.log(ourActiveIndex);
    alignSwiperInView();
  }, [ourActiveIndex, alignSwiperInView]);

  const swipeNext = useCallback(() => {
    setOurActiveIndex(ourActiveIndex + 1);
  }, [ourActiveIndex]);

  const swipePrev = useCallback(() => {
    if (ourActiveIndex > 0) setOurActiveIndex(ourActiveIndex - 1);
  }, [ourActiveIndex]);

  const value = useMemo(
    () => ({
      slidesValues,
      ourActiveIndex,
      setOurActiveIndex,
      resetOurActiveIndex,
      swipeNext,
      swipePrev,
      swiper,
      setSwiper
    }),
    [ourActiveIndex, swiper, swipeNext, swipePrev]
  );
  return (
    <SlidesContext.Provider value={value}>{children}</SlidesContext.Provider>
  );
}

SlidesContextProvider.propTypes = {
  children: PropTypes.oneOfType([
    PropTypes.node,
    PropTypes.arrayOf(PropTypes.node)
  ]).isRequired
};
