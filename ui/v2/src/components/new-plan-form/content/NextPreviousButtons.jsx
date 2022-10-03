import React, { useContext } from 'react';
import tw, { styled, theme } from 'twin.macro';
import { SVG as NextArrow } from '@assets/next-arrow.svg';
import { SVG as PrevArrow } from '@assets/previous-arrow.svg';
import { SVG as ArrowUp } from '@assets/arrow-up.svg';
import { SlidesContext } from '@components/new-plan-form/button-section/SlidesContext';
import PropTypes from 'prop-types';

const NextPreviousButtons = ({
  hidePrevious = false,
  hideNext = false,
  showReview = false,
  planId
}) => {
  const { swipeNext, swipePrev } = useContext(SlidesContext);

  const reviewClicked = () => {
    console.log('reviewClicked');
    const controlsElements = document.querySelectorAll(`#controls-${planId}`);
    console.log(controlsElements);
    const screenWidth =
      window.innerWidth > 0 ? window.innerWidth : window.screen.width;
    if (screenWidth < 768) {
      controlsElements[0].scrollIntoView({ behavior: 'smooth' });
    } else {
      controlsElements[1].scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div tw="flex justify-between">
      {!hidePrevious && (
        <Button
          type="button"
          onClick={swipePrev}
          tw="bg-transparent text-mirza-purple"
        >
          <div>
            <PrevArrow />
          </div>
          <span tw="text-mirza-purple">Previous</span>
        </Button>
      )}
      {!hideNext && (
        <Button
          type="button"
          onClick={swipeNext}
          tw="ml-auto bg-mirza-purple text-white"
        >
          <span tw="text-white">Next step</span>
          <div>
            <NextArrow />
          </div>
        </Button>
      )}
      {showReview && (
        <Button
          type="button"
          onClick={() => reviewClicked()}
          tw="ml-auto bg-mirza-purple text-white"
        >
          <span tw="text-white">Review</span>
          <div>
            <ArrowUp />
          </div>
        </Button>
      )}
    </div>
  );
};

NextPreviousButtons.propTypes = {
  hidePrevious: PropTypes.bool,
  hideNext: PropTypes.bool,
  showReview: PropTypes.bool,
  planId: PropTypes.number
};

NextPreviousButtons.defaultProps = {
  hidePrevious: false,
  hideNext: false,
  showReview: false,
  planId: null
};

export const Button = styled.button`
  ${tw`inline-flex items-center border border-solid border-mirza-purple rounded px-2 py-1.5 space-x-1 md:space-x-1.5`}
  background-color: ${theme`colors.mirza-purple`};

  p {
    color: white;
  }
`;

export default NextPreviousButtons;
