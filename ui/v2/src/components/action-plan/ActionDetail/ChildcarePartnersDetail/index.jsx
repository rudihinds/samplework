import React from 'react';
import { SVG as ChildcareIcon } from '@assets/action-plan/childcare.svg';
import { css } from 'twin.macro';
import GridSwiper from '@components/action-plan/GridSwiper';
import ImageCaption from '../ImageCaption';
import OtterLearning from './images/otter-learning.png';
import Upfront from './images/upfront.png';
import Abule from './images/abule.png';
import Carefully from './images/carefully.png';

const ChildcarePartnersDetail = () => (
  <div>
    <div tw="text-center px-4 mb-2">
      <div tw="w-7 mx-auto mb-2">
        <ChildcareIcon />
      </div>
      <h2 tw="text-mirza-purple text-3 mb-3 md:mb-2">
        Explore our childcare partners
      </h2>
      <p
        tw="hidden md:block md:mx-auto"
        css={[
          css`
            max-width: 493px;
          `
        ]}
      >
        We work with incredible childcare providers and options across the US.
        Check to see what&apos;s available in your region!
      </p>
    </div>
    <div
      css={[
        css`
          max-width: 649px;
        `
      ]}
      tw="mx-auto"
    >
      <GridSwiper gridCols={2}>
        <ImageCaption
          imageSrc={OtterLearning}
          altText="Screenshot of Otter Learning"
          description="Otter Learning is a network of early childhood schools focused on social and academic success."
          buttonText="Visit the Otter Learning website"
          actionHref="https://www.otterlearning.com/?utm_source=heymirza"
        />
        <ImageCaption
          imageSrc={Upfront}
          altText="Screenshot of Upfront"
          description="Upfront helps you find a daycare that fits your budget by providing transparent information."
          buttonText="Visit the Upfront website"
          actionHref="https://www.allupfront.com/?utm_source=heymirza"
        />
        <ImageCaption
          imageSrc={Abule}
          altText="Screenshot of Abule"
          description="Abulé uses technology to connect families to communities they can trust for childcare support."
          buttonText="Visit the Abulé website"
          actionHref="https://www.abule.io/?utm_source=heymirza"
        />
        <ImageCaption
          imageSrc={Carefully}
          altText="Screenshot of Carefully"
          description="Carefully allows you to build your own trusted network of parents to share care and provide mutual aid."
          buttonText="Visit the Carefully website"
          actionHref="https://www.carefullyapp.com//?utm_source=heymirza"
        />
      </GridSwiper>
    </div>
  </div>
);

export default ChildcarePartnersDetail;
